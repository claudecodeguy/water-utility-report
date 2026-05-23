/**
 * Fix violation_date = null for health-based violations where the SDWIS bulk
 * API returns compl_per_begin_date but the original ingest used violation_begin_date.
 *
 * Fetches violations for each affected state in bulk (paginated), then updates
 * any DB record that has violation_date = null but has a compl_per_begin_date in SDWIS.
 *
 * Usage:
 *   npx tsx scripts/fix-missing-dates.ts --state CA
 *   npx tsx scripts/fix-missing-dates.ts --state CA --dry-run
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SDWIS_BASE = "https://data.epa.gov/efservice";
const PAGE_SIZE = 5000;

async function fetchPage(state: string, offset: number): Promise<Array<{ pwsid: string; violation_id: string; compl_per_begin_date: string | null; violation_begin_date: string | null }>> {
  const url = `${SDWIS_BASE}/VIOLATION/PRIMACY_AGENCY_CODE/${state}/ROWS/${offset}:${offset + PAGE_SIZE - 1}/JSON`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(45000) });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    } catch (err) {
      if (attempt === 4) throw err;
      console.log(`\n  Timeout on offset ${offset}, retry ${attempt}/3...`);
      await new Promise(r => setTimeout(r, 3000 * attempt));
    }
  }
  return [];
}

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const state = stateIdx !== -1 ? args[stateIdx + 1]?.toUpperCase() : null;
  const dryRun = args.includes("--dry-run");

  if (!state) { console.error("Usage: npx tsx scripts/fix-missing-dates.ts --state CA"); process.exit(1); }

  console.log(`\nFix missing violation dates — ${state}${dryRun ? " [DRY RUN]" : ""}\n`);

  // Fetch all SDWIS violations for the state
  const all: Array<{ pwsid: string; violation_id: string; compl_per_begin_date: string | null; violation_begin_date: string | null }> = [];
  let offset = 0;
  while (true) {
    const page = await fetchPage(state, offset);
    all.push(...page);
    process.stdout.write(`\r  Fetched ${all.length} rows from EPA...`);
    if (page.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }
  console.log();

  // Build lookup: "PWSID-violationId" → best available date
  const lookup = new Map<string, string>();
  for (const v of all) {
    if (!v.pwsid || !v.violation_id) continue;
    const key = `${v.pwsid}-${v.violation_id}`;
    const date = v.violation_begin_date ?? v.compl_per_begin_date;
    if (date && !lookup.has(key)) lookup.set(key, date);
  }

  // Find DB violations with null date in this state
  const nullDated = await prisma.violation.findMany({
    where: {
      violation_date: null,
      utility: { state: { abbreviation: state } },
    },
    select: { id: true },
  });

  console.log(`  DB violations with null date: ${nullDated.length}`);

  let updated = 0;
  let notFound = 0;

  for (const v of nullDated) {
    const date = lookup.get(v.id);
    if (!date) { notFound++; continue; }
    if (!dryRun) {
      await prisma.violation.update({
        where: { id: v.id },
        data: { violation_date: new Date(date) },
      });
    }
    updated++;
  }

  console.log(`  Updated: ${updated}`);
  console.log(`  Not in EPA response: ${notFound}`);
  console.log(`\n${dryRun ? "Dry run — no changes written." : "✓ Done."}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
