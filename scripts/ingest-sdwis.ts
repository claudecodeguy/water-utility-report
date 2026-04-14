/**
 * SDWIS Ingestion Script
 * Pulls active community water systems + violations from EPA SDWIS
 * for Stage 1 states (CA, TX, FL, AZ, OH) and upserts into Supabase.
 *
 * Usage: npx tsx scripts/ingest-sdwis.ts
 * Options:
 *   --state CA     only ingest one state
 *   --limit 100    cap records per state (default: all)
 *   --violations   also ingest violations (slower)
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const STAGE1_STATES = [
  { code: "CA", name: "California", abbr: "CA", fips: "06" },
  { code: "TX", name: "Texas",      abbr: "TX", fips: "48" },
  { code: "FL", name: "Florida",    abbr: "FL", fips: "12" },
  { code: "AZ", name: "Arizona",    abbr: "AZ", fips: "04" },
  { code: "OH", name: "Ohio",       abbr: "OH", fips: "39" },
];

const SDWIS_BASE = "https://data.epa.gov/efservice";

// Only ingest systems serving >= this many people to keep Stage 1 focused
const MIN_POPULATION = 500;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ownerTypeLabel(code: string | null): string {
  const map: Record<string, string> = {
    F: "Federal",
    L: "Local",
    M: "Public/Private",
    N: "Native American",
    P: "Private",
    S: "State",
    C: "County",
  };
  return code ? (map[code] ?? code) : "Unknown";
}

function sourceTypeLabel(code: string | null): string {
  const map: Record<string, string> = {
    GW: "Groundwater",
    SW: "Surface water",
    GU: "Groundwater under influence",
    SWP: "Purchased surface water",
    GWP: "Purchased groundwater",
  };
  return code ? (map[code] ?? code) : "Unknown";
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`SDWIS fetch failed: ${res.status} ${url}`);
  return res.json() as Promise<T>;
}

// ─── Fetch systems ─────────────────────────────────────────────────────────────

interface SdwisSystem {
  pwsid: string;
  pws_name: string;
  primacy_agency_code: string;
  pws_activity_code: string;
  pws_type_code: string;
  owner_type_code: string | null;
  population_served_count: number | null;
  gw_sw_code: string | null;
  city_name: string | null;
  zip_code: string | null;
  state_code: string | null;
  address_line1: string | null;
  address_line2: string | null;
  phone_number: string | null;
  email_addr: string | null;
  org_name: string | null;
  submission_status_code: string | null;
}

async function fetchSystems(stateCode: string, limit?: number): Promise<SdwisSystem[]> {
  const rowSpec = limit ? `ROWS/0:${limit - 1}` : "ROWS/0:4999";
  const url = `${SDWIS_BASE}/WATER_SYSTEM/PRIMACY_AGENCY_CODE/${stateCode}/PWS_TYPE_CODE/CWS/PWS_ACTIVITY_CODE/A/${rowSpec}/JSON`;
  console.log(`  Fetching systems: ${url}`);
  const data = await fetchJson<SdwisSystem[]>(url);
  return data.filter(
    (s) => (s.population_served_count ?? 0) >= MIN_POPULATION
  );
}

// ─── Fetch violations ─────────────────────────────────────────────────────────

interface SdwisViolation {
  pwsid: string;
  violation_id: string;
  facility_id: string | null;
  population_served_count: number | null;
  viol_measure: string | null;
  unit_of_measure: string | null;
  state_mcl: string | null;
  federal_mcl: string | null;
  data_validation_value_yn: string | null;
  pws_activity_code: string | null;
  pws_deactivation_date: string | null;
  primacy_agency_code: string | null;
  epa_region: string | null;
  violation_survey_id: string | null;
  contaminant_code: string | null;
  contaminant_name: string | null;
  violation_category_code: string | null;
  is_health_based_ind: string | null;
  violation_code: string | null;
  violation_code_name: string | null;
  compl_per_begin_date: string | null;
  compl_per_end_date: string | null;
  violation_begin_date: string | null;
  violation_end_date: string | null;
  enforcement_date: string | null;
  rtc_date: string | null;
  violation_status: string | null;
  public_notification_tier: string | null;
  originator_code: string | null;
  sample_result_id: string | null;
  corrective_action_id: string | null;
  rule_code: string | null;
  rule_name: string | null;
  rule_group_code: string | null;
  rule_family_code: string | null;
}

async function fetchViolations(pwsid: string): Promise<SdwisViolation[]> {
  const url = `${SDWIS_BASE}/VIOLATION/PWSID/${pwsid}/JSON`;
  try {
    const data = await fetchJson<SdwisViolation[]>(url);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// ─── Risk scoring ──────────────────────────────────────────────────────────────

function computeRiskLevel(violations: SdwisViolation[]): "safe" | "low" | "moderate" | "high" | "critical" {
  const healthBased = violations.filter(
    (v) => v.is_health_based_ind === "Y" && v.violation_status !== "Resolved"
  ).length;

  if (healthBased === 0) return "safe";
  if (healthBased <= 1) return "low";
  if (healthBased <= 3) return "moderate";
  if (healthBased <= 6) return "high";
  return "critical";
}

// ─── Ingest one state ─────────────────────────────────────────────────────────

async function ingestState(
  stateInfo: (typeof STAGE1_STATES)[0],
  opts: { limit?: number; withViolations?: boolean }
) {
  console.log(`\n━━━ ${stateInfo.name} (${stateInfo.code}) ━━━`);

  // Upsert state record
  const state = await prisma.state.upsert({
    where: { abbreviation: stateInfo.abbr },
    update: { updated_at: new Date() },
    create: {
      slug: stateInfo.name.toLowerCase(),
      name: stateInfo.name,
      abbreviation: stateInfo.abbr,
      fips_code: stateInfo.fips,
      publish_status: "draft",
    },
  });

  const systems = await fetchSystems(stateInfo.code, opts.limit);
  console.log(`  ${systems.length} active CWS >= ${MIN_POPULATION} pop`);

  let inserted = 0;
  let skipped = 0;

  for (const sys of systems) {
    const pop = sys.population_served_count ?? 0;
    const slug = slugify(sys.pws_name);

    // Fetch violations if requested
    let violations: SdwisViolation[] = [];
    if (opts.withViolations) {
      violations = await fetchViolations(sys.pwsid);
      // Small delay to avoid hammering the API
      await new Promise((r) => setTimeout(r, 100));
    }

    const riskLevel = computeRiskLevel(violations);

    try {
      const utility = await prisma.utility.upsert({
        where: { pwsid: sys.pwsid },
        update: {
          name: sys.pws_name,
          slug,
          population_served: pop,
          service_type: sourceTypeLabel(sys.gw_sw_code),
          ownership_type: ownerTypeLabel(sys.owner_type_code),
          address: [sys.address_line1, sys.address_line2].filter(Boolean).join(", ") || null,
          phone: sys.phone_number,
          risk_level: riskLevel,
          last_verification_date: new Date(),
          updated_at: new Date(),
        },
        create: {
          slug,
          name: sys.pws_name,
          pwsid: sys.pwsid,
          state_id: state.id,
          population_served: pop,
          service_type: sourceTypeLabel(sys.gw_sw_code),
          ownership_type: ownerTypeLabel(sys.owner_type_code),
          address: [sys.address_line1, sys.address_line2].filter(Boolean).join(", ") || null,
          phone: sys.phone_number,
          risk_level: riskLevel,
          publish_status: "draft",
          source_type: "epa_sdwis",
          source_url: `https://data.epa.gov/efservice/WATER_SYSTEM/PWSID/${sys.pwsid}/JSON`,
          ingestion_date: new Date(),
          last_verification_date: new Date(),
          transform_version: "1.0",
          confidence_score: 0.85,
        },
      });

      // Insert violations
      if (opts.withViolations && violations.length > 0) {
        for (const v of violations) {
          await prisma.violation.upsert({
            where: { id: `${sys.pwsid}-${v.violation_id}` },
            update: {},
            create: {
              id: `${sys.pwsid}-${v.violation_id}`,
              utility_id: utility.id,
              contaminant_code: v.contaminant_code,
              contaminant_name: v.contaminant_name,
              violation_type: v.violation_code_name,
              violation_date: v.violation_begin_date ? new Date(v.violation_begin_date) : null,
              resolution_date: v.rtc_date ? new Date(v.rtc_date) : null,
              is_health_based: v.is_health_based_ind === "Y",
              severity: v.violation_category_code,
              description: v.rule_name,
              source_url: `https://data.epa.gov/efservice/VIOLATION/PWSID/${sys.pwsid}/JSON`,
              ingestion_date: new Date(),
            },
          }).catch(() => {}); // skip duplicate violations silently
        }
      }

      inserted++;
    } catch (err) {
      // Slug collision — append pwsid suffix
      try {
        await prisma.utility.upsert({
          where: { pwsid: sys.pwsid },
          update: { updated_at: new Date() },
          create: {
            slug: `${slug}-${sys.pwsid.toLowerCase()}`,
            name: sys.pws_name,
            pwsid: sys.pwsid,
            state_id: state.id,
            population_served: pop,
            service_type: sourceTypeLabel(sys.gw_sw_code),
            ownership_type: ownerTypeLabel(sys.owner_type_code),
            risk_level: riskLevel,
            publish_status: "draft",
            source_type: "epa_sdwis",
            source_url: `https://data.epa.gov/efservice/WATER_SYSTEM/PWSID/${sys.pwsid}/JSON`,
            ingestion_date: new Date(),
            transform_version: "1.0",
            confidence_score: 0.85,
          },
        });
        inserted++;
      } catch {
        skipped++;
      }
    }
  }

  console.log(`  ✓ ${inserted} upserted · ${skipped} skipped`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const stateArg = args.find((_, i) => args[i - 1] === "--state");
  const limitArg = args.find((_, i) => args[i - 1] === "--limit");
  const withViolations = args.includes("--violations");

  const statesToRun = stateArg
    ? STAGE1_STATES.filter((s) => s.code === stateArg.toUpperCase())
    : STAGE1_STATES;

  if (statesToRun.length === 0) {
    console.error(`Unknown state: ${stateArg}`);
    process.exit(1);
  }

  const limit = limitArg ? parseInt(limitArg) : undefined;

  console.log(`\nWUR SDWIS Ingestion`);
  console.log(`States: ${statesToRun.map((s) => s.code).join(", ")}`);
  console.log(`Min population: ${MIN_POPULATION}`);
  console.log(`Violations: ${withViolations ? "yes" : "no (add --violations to enable)"}`);
  if (limit) console.log(`Limit: ${limit} per state`);

  const start = Date.now();

  for (const state of statesToRun) {
    await ingestState(state, { limit, withViolations });
  }

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n✓ Done in ${elapsed}s`);

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
