/**
 * Fix violations that are marked "open" (rtc_date = null) in our DB but have
 * compliance_status_code = K/R/C in EPA SDWIS — meaning the utility returned
 * to compliance without a formal RTC date being recorded.
 *
 * SDWIS uses two resolution signals:
 *   1. rtc_date        — formal "return to compliance" date (our current check)
 *   2. compliance_status_code = K/R/C — also means resolved (we were missing this)
 *
 * EPA ECHO uses compliance_status_code, which is why ECHO says "compliant"
 * for utilities our system was rating as critical/high.
 *
 * This script:
 *   - Finds all utilities with open health-based violations
 *   - Per-PWSID fetches fresh data from SDWIS (richer than bulk endpoint)
 *   - Sets resolution_date = NOW() for violations with compliance_status_code K/R/C
 *   - Does NOT touch violations that are genuinely still open
 *
 * Usage:
 *   npx tsx scripts/fix-compliance-status.ts            # all published
 *   npx tsx scripts/fix-compliance-status.ts --dry-run  # preview
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Compliance status codes that mean "resolved" in SDWIS
const RESOLVED_STATUS_CODES = new Set(["K", "R", "C"]);

async function fetchViolationsForPwsid(pwsid: string): Promise<Record<string, {
  rtc_date: string | null;
  compliance_status_code: string | null;
  is_health_based_ind: string | null;
}>> {
  const url = `https://data.epa.gov/efservice/VIOLATION/PWSID/${pwsid}/JSON`;
  let lastErr: unknown;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(20000) });
      if (!res.ok) throw new Error(`${res.status} ${url}`);
      const rows = await res.json() as Array<{
        violation_id: string;
        rtc_date?: string | null;
        compliance_status_code?: string | null;
        is_health_based_ind?: string | null;
      }>;
      // Deduplicate: per violation_id, prefer rtc_date or K/R/C status over null/open
      const best: Record<string, { rtc_date: string | null; compliance_status_code: string | null; is_health_based_ind: string | null }> = {};
      for (const v of rows) {
        if (!v.violation_id) continue;
        const existing = best[v.violation_id];
        const thisIsResolved = v.rtc_date || RESOLVED_STATUS_CODES.has(v.compliance_status_code ?? "");
        const existingIsResolved = existing && (existing.rtc_date || RESOLVED_STATUS_CODES.has(existing.compliance_status_code ?? ""));
        if (!existing || (!existingIsResolved && thisIsResolved)) {
          best[v.violation_id] = {
            rtc_date: v.rtc_date ?? null,
            compliance_status_code: v.compliance_status_code ?? null,
            is_health_based_ind: v.is_health_based_ind ?? null,
          };
        }
      }
      return best;
    } catch (err) {
      lastErr = err;
      if (attempt < 3) await new Promise(r => setTimeout(r, 2000 * attempt));
    }
  }
  throw lastErr;
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const NOW = new Date();

  console.log(`\nCompliance status fix${dryRun ? " [DRY RUN]" : ""}`);
  console.log(`Checks compliance_status_code (K/R/C) in addition to rtc_date\n`);

  // Get all utilities that have any open health-based violation
  const utilities = await prisma.utility.findMany({
    where: {
      publish_status: "published",
      violations: { some: { is_health_based: true, resolution_date: null } },
    },
    select: {
      id: true, name: true, pwsid: true, risk_level: true,
      violations: {
        where: { is_health_based: true, resolution_date: null },
        select: { id: true },
      },
    },
  });

  console.log(`Utilities with open health violations: ${utilities.length}`);
  console.log(`API calls required: ${utilities.length} (per-PWSID)\n`);

  let totalFixed = 0;
  let totalErrors = 0;

  for (let i = 0; i < utilities.length; i++) {
    const u = utilities[i];
    process.stdout.write(`\r  ${i + 1}/${utilities.length} — ${u.name.substring(0, 40).padEnd(40)}`);

    try {
      const epaData = await fetchViolationsForPwsid(u.pwsid);
      let fixedForUtility = 0;

      for (const dbViol of u.violations) {
        // Extract the violation_id part (after PWSID-)
        const violId = dbViol.id.replace(`${u.pwsid}-`, "");
        const epa = epaData[violId];
        if (!epa) continue;

        const isResolvedByStatus = RESOLVED_STATUS_CODES.has(epa.compliance_status_code ?? "");
        const hasRtcDate = !!epa.rtc_date;

        if (isResolvedByStatus || hasRtcDate) {
          if (!dryRun) {
            await prisma.violation.update({
              where: { id: dbViol.id },
              data: {
                resolution_date: epa.rtc_date ? new Date(epa.rtc_date) : NOW,
              },
            });
          }
          fixedForUtility++;
          totalFixed++;
        }
      }

      if (fixedForUtility > 0) {
        process.stdout.write(`  → fixed ${fixedForUtility}\n`);
      }

      // Small delay to avoid hammering API
      await new Promise((r) => setTimeout(r, 150));
    } catch (err) {
      totalErrors++;
    }
  }

  console.log(`\n\n✓ Violations resolved via compliance_status_code: ${totalFixed}`);
  console.log(`  API errors (skipped): ${totalErrors}`);
  console.log(`\n${dryRun ? "Dry run — no DB changes written." : "Done. Run rescore-risk.ts next."}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
