/**
 * audit-risk.ts
 *
 * Verifies all moderate/high/critical utilities against EPA SDWIS live data.
 * Re-checks every open violation for these utilities and resolves any that
 * EPA marks as K/R/C. Then rescores only the affected utilities.
 *
 * Run this after any state build, or on demand to clean up stale risk ratings.
 *
 * Usage:
 *   npx tsx scripts/audit-risk.ts              # all moderate+ across all states
 *   npx tsx scripts/audit-risk.ts --state LA   # one state only
 *   npx tsx scripts/audit-risk.ts --dry-run    # preview without writing
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const RESOLVED_CODES = new Set(["K", "R", "C"]);
const RETRY_ATTEMPTS = 3;

async function fetchWithRetry(url: string): Promise<unknown[]> {
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`${res.status}`);
      return await res.json() as unknown[];
    } catch (err) {
      if (attempt === RETRY_ATTEMPTS) throw err;
      await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
  return [];
}

async function checkUtility(pwsid: string): Promise<Map<string, { resolved: boolean; rtcDate: string | null }>> {
  const url = `https://data.epa.gov/efservice/VIOLATION/PWSID/${pwsid}/JSON`;
  const rows = await fetchWithRetry(url) as Array<{
    violation_id?: string;
    compliance_status_code?: string;
    rtc_date?: string;
  }>;

  // Per violation_id: prefer resolved status over open
  const best = new Map<string, { resolved: boolean; rtcDate: string | null }>();
  for (const v of rows) {
    if (!v.violation_id) continue;
    const resolved = RESOLVED_CODES.has(v.compliance_status_code ?? "") || !!v.rtc_date;
    const existing = best.get(v.violation_id);
    if (!existing || (!existing.resolved && resolved)) {
      best.set(v.violation_id, { resolved, rtcDate: v.rtc_date ?? null });
    }
  }
  return best;
}

const RISK_ORDER = ["safe", "low", "moderate", "high", "critical"] as const;
type RiskLevel = typeof RISK_ORDER[number];

function computeRisk(violations: Array<{
  is_health_based: boolean;
  violation_type: string | null;
  violation_date: Date | null;
  resolution_date: Date | null;
}>): RiskLevel {
  const NOW = Date.now();
  function years(d: Date | null) { return d ? (NOW - d.getTime()) / 31557600000 : 2; }
  function weight(t: string | null) {
    if (!t) return 5;
    const tl = t.toLowerCase();
    if (tl === "mcl violation") return 10;
    if (tl === "treatment technique" || tl === "disinfectant level") return 7;
    return 5;
  }
  function recency(d: Date | null) {
    const y = years(d);
    if (y < 1) return 1.0;
    if (y < 3) return 0.8;
    if (y < 5) return 0.25;
    return 0.1;
  }

  let score = 0;
  let adminCount = 0;
  for (const v of violations) {
    if (v.resolution_date) continue; // resolved
    if (!v.is_health_based) {
      const y = years(v.violation_date);
      if (y < 3) adminCount++;
      continue;
    }
    score += weight(v.violation_type) * recency(v.violation_date);
  }
  if (score === 0 && adminCount >= 6) score = 1.0;

  if (score === 0) return "safe";
  if (score < 7) return "low";
  if (score < 15) return "moderate";
  if (score < 25) return "high";
  return "critical";
}

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const state = stateIdx !== -1 ? args[stateIdx + 1]?.toUpperCase() : null;
  const dryRun = args.includes("--dry-run");

  console.log(`\nAudit risk — ${state ?? "all states"}${dryRun ? " [DRY RUN]" : ""}\n`);

  const whereState = state ? { state: { abbreviation: state } } : {};

  // Find all moderate+ utilities
  const targets = await prisma.utility.findMany({
    where: {
      publish_status: "published",
      risk_level: { in: ["moderate", "high", "critical"] },
      ...whereState,
    },
    select: {
      id: true, name: true, pwsid: true, risk_level: true,
      state: { select: { abbreviation: true } },
      violations: {
        where: { is_health_based: true, resolution_date: null },
        select: { id: true, violation_type: true, violation_date: true },
      },
    },
    orderBy: [{ risk_level: "desc" }, { state: { abbreviation: "asc" } }],
  });

  console.log(`Found ${targets.length} moderate+ utilities to verify\n`);
  if (targets.length === 0) {
    console.log("Nothing to audit. ✓");
    await prisma.$disconnect();
    return;
  }

  let fixedUtilities = 0;
  let apiErrors = 0;
  const riskChanges: Array<{ name: string; state: string; from: string; to: string }> = [];

  for (let i = 0; i < targets.length; i++) {
    const u = targets[i];
    process.stdout.write(`  [${i + 1}/${targets.length}] ${u.state.abbreviation} ${u.name.substring(0, 45).padEnd(45)} `);

    try {
      const epaData = await checkUtility(u.pwsid);
      let fixedViolations = 0;

      for (const dbViol of u.violations) {
        const violId = dbViol.id.replace(`${u.pwsid}-`, "");
        const epa = epaData.get(violId);
        if (!epa?.resolved) continue;

        if (!dryRun) {
          await prisma.violation.update({
            where: { id: dbViol.id },
            data: { resolution_date: epa.rtcDate ? new Date(epa.rtcDate) : new Date() },
          });
        }
        fixedViolations++;
      }

      if (fixedViolations > 0) {
        fixedUtilities++;
        // Refetch all violations for accurate rescore
        const allViols = await prisma.violation.findMany({
          where: { utility_id: u.id },
          select: { is_health_based: true, violation_type: true, violation_date: true, resolution_date: true },
        });
        const newRisk = computeRisk(allViols);

        if (newRisk !== u.risk_level) {
          riskChanges.push({ name: u.name, state: u.state.abbreviation, from: u.risk_level, to: newRisk });
          if (!dryRun) {
            await prisma.utility.update({ where: { id: u.id }, data: { risk_level: newRisk } });
          }
          process.stdout.write(`fixed ${fixedViolations} → ${u.risk_level} → ${newRisk}\n`);
        } else {
          process.stdout.write(`fixed ${fixedViolations} violations (risk unchanged: ${newRisk})\n`);
        }
      } else {
        process.stdout.write(`✓ ${u.risk_level} confirmed\n`);
      }

      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      apiErrors++;
      process.stdout.write(`API error (skipped)\n`);
    }
  }

  console.log(`\n${"─".repeat(60)}`);
  console.log(`Utilities fixed: ${fixedUtilities}`);
  console.log(`API errors:      ${apiErrors}`);
  console.log(`Risk changes:    ${riskChanges.length}`);
  for (const c of riskChanges) {
    console.log(`  ${c.state} ${c.name}: ${c.from} → ${c.to}`);
  }

  // Final count
  const remaining = await prisma.utility.count({
    where: {
      publish_status: "published",
      risk_level: { in: ["moderate", "high", "critical"] },
      ...whereState,
    },
  });
  console.log(`\nModerate+ remaining: ${remaining}`);
  console.log(`\n${dryRun ? "Dry run — no changes written." : "✓ Done. Deploy to reflect changes."}\n`);

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
