/**
 * Refresh violation resolution dates from EPA SDWIS.
 *
 * Problem this solves:
 *   The original ingest script used `update: {}` on violation upserts, so
 *   resolution_date (rtc_date) was never updated after initial ingestion.
 *   Violations resolved after ingestion were stuck showing as "open".
 *
 * Approach:
 *   Instead of 1 API call per utility (1000+ slow calls), fetch all violations
 *   for a state in bulk (paginated 5000 rows at a time) — ~5-20 calls per state.
 *   Then update resolution_date for any record that has changed.
 *
 * Usage:
 *   npx tsx scripts/refresh-violations.ts              # all published states
 *   npx tsx scripts/refresh-violations.ts --state CA   # one state
 *   npx tsx scripts/refresh-violations.ts --dry-run    # preview without writing
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SDWIS_BASE = "https://data.epa.gov/efservice";
const PAGE_SIZE = 5000;
const FETCH_TIMEOUT_MS = 20000; // 20s per request

const PUBLISHED_STATES = ["CA", "TX", "FL", "AZ", "OH"];

interface SdwisViolation {
  pwsid: string;
  violation_id: string;
  rtc_date: string | null;
  is_health_based_ind: string | null;
  violation_code_name: string | null;
  contaminant_name: string | null;
}

async function fetchWithTimeout(url: string): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchViolationPage(state: string, offset: number): Promise<SdwisViolation[]> {
  const url = `${SDWIS_BASE}/VIOLATION/PRIMACY_AGENCY_CODE/${state}/ROWS/${offset}:${offset + PAGE_SIZE - 1}/JSON`;
  console.log(`  Fetching ${state} violations rows ${offset}–${offset + PAGE_SIZE - 1}...`);
  const res = await fetchWithTimeout(url);
  if (!res.ok) throw new Error(`SDWIS fetch failed: ${res.status} ${url}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

async function fetchAllViolations(state: string): Promise<SdwisViolation[]> {
  const all: SdwisViolation[] = [];
  let offset = 0;
  while (true) {
    const page = await fetchViolationPage(state, offset);
    all.push(...page);
    console.log(`    got ${page.length} rows (total so far: ${all.length})`);
    if (page.length < PAGE_SIZE) break; // last page
    offset += PAGE_SIZE;
  }
  return all;
}

async function refreshState(state: string, dryRun: boolean) {
  console.log(`\n━━━ ${state} ━━━`);

  const violations = await fetchAllViolations(state);
  console.log(`  Total violations from EPA: ${violations.length}`);

  // Build lookup: "PWSID-violationId" → rtc_date
  // EPA returns multiple rows per violation_id (enforcement history rows).
  // Prefer any row that has an rtc_date — don't overwrite a resolved date with null.
  const lookup = new Map<string, string | null>();
  for (const v of violations) {
    if (!v.pwsid || !v.violation_id) continue;
    const key = `${v.pwsid}-${v.violation_id}`;
    const existing = lookup.get(key);
    if (existing === undefined || (existing === null && v.rtc_date)) {
      lookup.set(key, v.rtc_date ?? null);
    }
  }

  // Get all violation records we have for this state
  const dbViolations = await prisma.violation.findMany({
    where: { utility: { state: { abbreviation: state } } },
    select: { id: true, resolution_date: true },
  });

  console.log(`  Violations in DB: ${dbViolations.length}`);

  let updated = 0;
  let nowResolved = 0;
  let nowOpen = 0;
  let unchanged = 0;
  let notInEpa = 0;

  for (const dbV of dbViolations) {
    if (!lookup.has(dbV.id)) {
      notInEpa++;
      continue; // violation ID not in EPA response — skip
    }

    const epaRtc = lookup.get(dbV.id);
    const epaResolutionDate = epaRtc ? new Date(epaRtc) : null;
    const dbResolutionDate = dbV.resolution_date;

    // Check if resolution date has changed
    const dbHasDate = dbResolutionDate != null;
    const epaHasDate = epaResolutionDate != null;

    if (dbHasDate === epaHasDate) {
      unchanged++;
      continue;
    }

    // It changed — update
    updated++;
    if (!dbHasDate && epaHasDate) nowResolved++;
    if (dbHasDate && !epaHasDate) nowOpen++;

    if (!dryRun) {
      await prisma.violation.update({
        where: { id: dbV.id },
        data: { resolution_date: epaResolutionDate },
      });
    }
  }

  console.log(`  Updated: ${updated} (${nowResolved} now resolved, ${nowOpen} now open)`);
  console.log(`  Unchanged: ${unchanged} · Not in EPA response: ${notInEpa}`);
  return updated;
}

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const stateFilter = stateIdx !== -1 ? args[stateIdx + 1]?.toUpperCase() : null;
  const dryRun = args.includes("--dry-run");

  const states = stateFilter ? [stateFilter] : PUBLISHED_STATES;

  console.log(`\nViolation resolution refresh${dryRun ? " [DRY RUN]" : ""}`);
  console.log(`States: ${states.join(", ")}`);
  console.log(`Approach: bulk state-level fetch (${PAGE_SIZE} rows/page, ${FETCH_TIMEOUT_MS / 1000}s timeout)\n`);

  const start = Date.now();
  let totalUpdated = 0;

  for (const state of states) {
    totalUpdated += await refreshState(state, dryRun);
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n${dryRun ? "Dry run complete." : `✓ Done — ${totalUpdated} resolution dates updated.`} (${elapsed}s)`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
