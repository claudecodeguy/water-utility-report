/**
 * Rescores risk_level and risk_score for all published utilities.
 *
 * PHILOSOPHY: Risk level answers "Is my water safe RIGHT NOW?"
 *   - Only OPEN (unresolved) health-based violations count toward the score
 *   - Resolved violations = 0 contribution (they are history, not current risk)
 *   - Admin/Monitoring/Reporting violations = 0 for health score
 *     (missed paperwork ≠ contaminated water)
 *
 * SCORING (open health-based violations only):
 *   MCL Violation             = 10 pts  (contaminant currently exceeds legal limit)
 *   Treatment Technique       =  7 pts  (treatment process failure)
 *   Disinfectant Level (MRDL) =  7 pts  (disinfection failure)
 *   Other health-based        =  5 pts
 *
 * RECENCY FACTOR (applied to open violations):
 *   < 1 yr  = 1.0   (active, recent)
 *   1–3 yr  = 0.8   (active, slightly older)
 *   3–5 yr  = 0.1   (likely stale SDWIS data — heavily discounted)
 *   > 5 yr  = 0     (presumed stale — excluded from scoring entirely)
 *
 * ADMIN FLOOR:
 *   6+ open monitoring/reporting failures in the last 3 years
 *   → floor score at 1.0 (= "low") — utility is not reliably testing its water
 *
 * SCORE → RISK LEVEL:
 *   0         → safe      (no open health violations)
 *   0.01–7    → low       (minor open health concern, or admin floor)
 *   7–15      → moderate  (1 open MCL or TT violation)
 *   15–25     → high      (2 open MCL violations, or multiple TT failures)
 *   ≥ 25      → critical  (3+ open MCL violations)
 *
 * Usage:
 *   npx tsx scripts/rescore-risk.ts              # all published states
 *   npx tsx scripts/rescore-risk.ts --state FL   # one state
 *   npx tsx scripts/rescore-risk.ts --dry-run    # preview without writing
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const NOW = new Date();

function yearsSince(date: Date): number {
  return (NOW.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
}

/** Weight by violation type — only applied to open health-based violations */
function typeWeight(violationType: string | null): number {
  if (!violationType) return 5;
  const t = violationType.trim().toLowerCase();
  if (t === "mcl violation") return 10;
  if (t === "treatment technique") return 7;
  if (t === "disinfectant level") return 7;
  return 5; // other health-based
}

/**
 * Recency factor for OPEN violations.
 * An open violation is an ongoing problem — we discount for age because
 * SDWIS frequently leaves old violations open after resolution.
 * Violations > 5 years with no resolution date are treated as presumed stale
 * and excluded from scoring entirely.
 */
function recencyFactorOpen(date: Date | null): number {
  if (!date) return 0.8; // unknown start date — treat as moderately recent
  const years = yearsSince(date);
  if (years < 1) return 1.0;
  if (years < 3) return 0.8;
  if (years < 5) return 0.1;  // 3–5 years: likely stale SDWIS data, heavily discounted
  return 0;                    // >5 years: presumed stale — excluded from scoring
}

function computeScore(violations: Array<{
  is_health_based: boolean;
  violation_type: string | null;
  violation_date: Date | null;
  resolution_date: Date | null;
}>): number {
  let score = 0;

  for (const v of violations) {
    // Resolved violations do not affect current risk — they are history
    if (v.resolution_date != null) continue;

    // Admin/monitoring failures are not health violations
    if (!v.is_health_based) continue;

    const weight = typeWeight(v.violation_type);
    const recency = recencyFactorOpen(v.violation_date);
    score += weight * recency;
  }

  // Admin floor: 6+ open monitoring/reporting failures in last 3 years
  // means the utility is not reliably testing or reporting results — flag as "low"
  const recentOpenAdmin = violations.filter(
    (v) =>
      !v.is_health_based &&
      v.resolution_date == null &&
      v.violation_date != null &&
      yearsSince(v.violation_date) < 3
  ).length;
  if (recentOpenAdmin >= 6) score = Math.max(score, 1.0);

  return score;
}

function scoreToLevel(score: number): "safe" | "low" | "moderate" | "high" | "critical" {
  if (score === 0) return "safe";
  if (score < 7)  return "low";
  if (score < 15) return "moderate";
  if (score < 25) return "high";
  return "critical";
}

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const stateFilter = stateIdx !== -1 ? args[stateIdx + 1]?.toUpperCase() : null;
  const dryRun = args.includes("--dry-run");

  const stateWhere = stateFilter
    ? { state: { abbreviation: stateFilter } }
    : {};

  const utilities = await prisma.utility.findMany({
    where: { publish_status: "published", ...stateWhere },
    select: {
      id: true,
      name: true,
      risk_level: true,
      violations: {
        select: {
          is_health_based: true,
          violation_type: true,
          violation_date: true,
          resolution_date: true,
        },
      },
    },
  });

  console.log(`\nRisk rescoring${dryRun ? " [DRY RUN]" : ""}${stateFilter ? ` — ${stateFilter}` : " — all published states"}`);
  console.log(`Utilities: ${utilities.length}`);
  console.log(`\nAlgorithm: open health-based violations only. Resolved = 0. Admin = 0.\n`);

  const dist: Record<string, number> = { safe: 0, low: 0, moderate: 0, high: 0, critical: 0 };
  const before: Record<string, number> = { safe: 0, low: 0, moderate: 0, high: 0, critical: 0 };
  const changes: Array<{ name: string; from: string; to: string; score: number }> = [];

  let updated = 0;

  for (let i = 0; i < utilities.length; i++) {
    const u = utilities[i];
    before[u.risk_level] = (before[u.risk_level] ?? 0) + 1;

    const score = computeScore(u.violations);
    const newLevel = scoreToLevel(score);
    dist[newLevel] = (dist[newLevel] ?? 0) + 1;

    if (newLevel !== u.risk_level) {
      changes.push({ name: u.name, from: u.risk_level, to: newLevel, score });
      if (!dryRun) {
        await prisma.utility.update({
          where: { id: u.id },
          data: { risk_level: newLevel, risk_score: Math.round(score * 100) / 100 },
        });
      }
      updated++;
    } else if (!dryRun) {
      await prisma.utility.update({
        where: { id: u.id },
        data: { risk_score: Math.round(score * 100) / 100 },
      });
    }

    if ((i + 1) % 100 === 0 || i === utilities.length - 1) {
      process.stdout.write(`\r  ${i + 1}/${utilities.length} · ${updated} changed`);
    }
  }

  console.log(`\n\nBefore: ${JSON.stringify(before)}`);
  console.log(`After:  ${JSON.stringify(dist)}`);
  console.log(`\nChanged: ${changes.length}`);

  if (changes.length > 0 && changes.length <= 50) {
    console.log("\nChanges:");
    for (const c of changes) {
      console.log(`  ${c.from.padEnd(8)} → ${c.to.padEnd(8)} (score: ${c.score.toFixed(2)})  ${c.name}`);
    }
  } else if (changes.length > 50) {
    console.log("\nTop 20 changes (by score desc):");
    changes.sort((a, b) => b.score - a.score);
    for (const c of changes.slice(0, 20)) {
      console.log(`  ${c.from.padEnd(8)} → ${c.to.padEnd(8)} (score: ${c.score.toFixed(2)})  ${c.name}`);
    }
  }

  console.log(`\n${dryRun ? "Dry run complete — no DB changes written." : `✓ Done — ${updated} utilities updated.`}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
