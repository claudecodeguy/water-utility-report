/**
 * Violations Ingestion Script
 * Pulls violation history from EPA SDWIS for utilities serving >= MIN_POPULATION.
 * Also updates risk_level based on open health-based violations.
 *
 * Usage:
 *   npx tsx scripts/ingest-violations.ts              # all utilities >= 10k pop
 *   npx tsx scripts/ingest-violations.ts --min 50000  # only large systems
 *   npx tsx scripts/ingest-violations.ts --state CA   # one state only
 */

import "dotenv/config";
import { PrismaClient, type Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SDWIS_BASE = "https://data.epa.gov/efservice";
const DEFAULT_MIN_POP = 10_000;
const BATCH_DELAY_MS = 150; // be polite to EPA's API

interface SdwisViolation {
  pwsid: string;
  violation_id: string;
  contaminant_code: string | null;
  violation_category_code: string | null;  // MON, MCL, TT, RPT, MRDL, PN, Other
  is_health_based_ind: string | null;       // "Y" or "N"
  compl_per_begin_date: string | null;      // violation start date
  rtc_date: string | null;                  // resolution date
  rule_code: string | null;
  rule_group_code: string | null;
}

// Human-readable labels for violation_category_code
const VIOLATION_TYPE_LABELS: Record<string, string> = {
  MCL:   "MCL Violation",
  MCLG:  "MCLG Violation",
  MON:   "Monitoring & Reporting",
  RPT:   "Reporting",
  TT:    "Treatment Technique",
  MRDL:  "Disinfectant Level",
  PN:    "Public Notification",
  Other: "Other",
};

// Common EPA contaminant codes → human-readable names
const CONTAMINANT_CODE_NAMES: Record<string, string> = {
  "1005": "Total Coliform",
  "1040": "E. coli",
  "1041": "Fecal Coliform",
  "1094": "Cryptosporidium",
  "2050": "Turbidity",
  "2100": "pH",
  "2456": "Total Trihalomethanes (TTHMs)",
  "2950": "Haloacetic Acids (HAA5)",
  "2951": "Chlorite",
  "2977": "Bromate",
  "3100": "Nitrate",
  "3140": "Nitrite",
  "4000": "Arsenic",
  "4006": "Barium",
  "4010": "Cadmium",
  "4020": "Chromium",
  "4030": "Fluoride",
  "4040": "Mercury",
  "4045": "Selenium",
  "5000": "Lead",
  "5100": "Copper",
  "6584": "PFAS / PFOA",
  "7000": "Nitrate",
  "8000": "Coliform (TCR)",
  "8001": "E. coli (RTCR)",
};

async function fetchViolations(pwsid: string): Promise<SdwisViolation[]> {
  const url = `${SDWIS_BASE}/VIOLATION/PWSID/${pwsid}/JSON`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function computeRiskLevel(violations: SdwisViolation[]): "safe" | "low" | "moderate" | "high" | "critical" {
  const openHealth = violations.filter(
    (v) => v.is_health_based_ind === "Y" && !v.rtc_date
  ).length;
  if (openHealth === 0) return "safe";
  if (openHealth <= 1) return "low";
  if (openHealth <= 3) return "moderate";
  if (openHealth <= 6) return "high";
  return "critical";
}

async function main() {
  const args = process.argv.slice(2);
  const minArg = args.find((_, i) => args[i - 1] === "--min");
  const stateArg = args.find((_, i) => args[i - 1] === "--state");
  const minPop = minArg ? parseInt(minArg) : DEFAULT_MIN_POP;

  const where: Prisma.UtilityWhereInput = {
    population_served: { gte: minPop },
  };

  if (stateArg) {
    const state = await prisma.state.findUnique({ where: { abbreviation: stateArg.toUpperCase() } });
    if (!state) { console.error(`State not found: ${stateArg}`); process.exit(1); }
    where.state_id = state.id;
  }

  const utilities = await prisma.utility.findMany({
    where,
    select: { id: true, pwsid: true, name: true, population_served: true },
    orderBy: { population_served: "desc" },
  });

  console.log(`\nViolations ingestion`);
  console.log(`Utilities: ${utilities.length} (pop >= ${minPop.toLocaleString()}${stateArg ? `, state: ${stateArg}` : ""})`);
  console.log(`Starting...\n`);

  let totalViolations = 0;
  let updatedRisk = 0;

  for (let i = 0; i < utilities.length; i++) {
    const util = utilities[i];
    const violations = await fetchViolations(util.pwsid);

    if (violations.length > 0) {
      // Upsert violations
      for (const v of violations) {
        const vid = `${util.pwsid}-${v.violation_id}`;
        const contaminantName = v.contaminant_code
          ? (CONTAMINANT_CODE_NAMES[v.contaminant_code] ?? null)
          : null;
        const violationType = v.violation_category_code
          ? (VIOLATION_TYPE_LABELS[v.violation_category_code] ?? v.violation_category_code)
          : null;
        const violationDate = v.compl_per_begin_date ? new Date(v.compl_per_begin_date) : null;
        const resolutionDate = v.rtc_date ? new Date(v.rtc_date) : null;

        await prisma.violation.upsert({
          where: { id: vid },
          update: {
            contaminant_name: contaminantName,
            violation_type: violationType,
            violation_date: violationDate,
            resolution_date: resolutionDate,
            is_health_based: v.is_health_based_ind === "Y",
            severity: v.violation_category_code,
          },
          create: {
            id: vid,
            utility_id: util.id,
            contaminant_code: v.contaminant_code,
            contaminant_name: contaminantName,
            violation_type: violationType,
            violation_date: violationDate,
            resolution_date: resolutionDate,
            is_health_based: v.is_health_based_ind === "Y",
            severity: v.violation_category_code,
            source_url: `${SDWIS_BASE}/VIOLATION/PWSID/${util.pwsid}/JSON`,
            ingestion_date: new Date(),
          },
        }).catch(() => {});
      }

      // Update risk level based on real violations
      const newRisk = computeRiskLevel(violations);
      await prisma.utility.update({
        where: { id: util.id },
        data: { risk_level: newRisk, last_verification_date: new Date() },
      });

      totalViolations += violations.length;
      updatedRisk++;
    }

    // Progress every 50
    if ((i + 1) % 50 === 0 || i === utilities.length - 1) {
      process.stdout.write(`\r  ${i + 1}/${utilities.length} processed · ${totalViolations} violations · ${updatedRisk} risk scores updated`);
    }

    await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
  }

  console.log(`\n\n✓ Done`);
  console.log(`  Total violations ingested: ${totalViolations}`);
  console.log(`  Risk scores updated: ${updatedRisk}`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
