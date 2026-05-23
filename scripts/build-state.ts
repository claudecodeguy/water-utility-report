/**
 * State Build Orchestrator
 *
 * Runs every step needed to add a new state end-to-end:
 *   1. Ingest utilities from EPA SDWIS
 *   2. Ingest violations
 *   3. Ingest city_served (geo area)
 *   4. Fix slugs (suffix normalization)
 *   5. Rescore risk levels
 *   6. Auto-generate state content entry → patches lib/content/states.ts
 *   7. Print ready-to-publish summary with admin link
 *
 * Usage:
 *   npx tsx scripts/build-state.ts --state NY
 *   npx tsx scripts/build-state.ts --state MI --dry-run   (skip DB writes, preview content only)
 */

import "dotenv/config";
import { spawnSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ROOT = path.resolve(__dirname, "..");
const STATES_FILE = path.join(ROOT, "lib/content/states.ts");

// ─── State metadata ────────────────────────────────────────────────────────────

const STATE_NAMES: Record<string, string> = {
  AL: "Alabama",        AK: "Alaska",         AZ: "Arizona",        AR: "Arkansas",
  CA: "California",     CO: "Colorado",       CT: "Connecticut",    DE: "Delaware",
  FL: "Florida",        GA: "Georgia",        HI: "Hawaii",         ID: "Idaho",
  IL: "Illinois",       IN: "Indiana",        IA: "Iowa",           KS: "Kansas",
  KY: "Kentucky",       LA: "Louisiana",      ME: "Maine",          MD: "Maryland",
  MA: "Massachusetts",  MI: "Michigan",       MN: "Minnesota",      MS: "Mississippi",
  MO: "Missouri",       MT: "Montana",        NE: "Nebraska",       NV: "Nevada",
  NH: "New Hampshire",  NJ: "New Jersey",     NM: "New Mexico",     NY: "New York",
  NC: "North Carolina", ND: "North Dakota",   OH: "Ohio",           OK: "Oklahoma",
  OR: "Oregon",         PA: "Pennsylvania",   RI: "Rhode Island",   SC: "South Carolina",
  SD: "South Dakota",   TN: "Tennessee",      TX: "Texas",          UT: "Utah",
  VT: "Vermont",        VA: "Virginia",       WA: "Washington",     WV: "West Virginia",
  WI: "Wisconsin",      WY: "Wyoming",
};

// Approximate % of residents on private wells (USGS/EPA estimates)
const WELL_WATER_PCT: Record<string, number> = {
  AL: 28, AK: 45, AZ: 18, AR: 32, CA: 15, CO: 25, CT: 22, DE: 24,
  FL: 10, GA: 28, HI: 18, ID: 40, IL: 20, IN: 30, IA: 35, KS: 38,
  KY: 32, LA: 18, ME: 48, MD: 25, MA: 18, MI: 42, MN: 35, MS: 30,
  MO: 30, MT: 48, NE: 40, NV: 10, NH: 55, NJ: 20, NM: 30, NY: 25,
  NC: 35, ND: 48, OH: 12, OK: 25, OR: 32, PA: 30, RI: 12, SC: 30,
  SD: 45, TN: 22, TX: 22, UT: 12, VT: 50, VA: 28, WA: 22, WV: 38,
  WI: 38, WY: 45,
};

// State drinking water primacy agencies
const STATE_AGENCY: Record<string, string> = {
  AL: "ADEM", AK: "DEC", AZ: "ADEQ", AR: "ADH", CA: "SWRCB",
  CO: "CDPHE", CT: "DPH", DE: "DNREC", FL: "FDEP", GA: "EPD",
  HI: "DOH", ID: "DEQ", IL: "IEPA", IN: "IDEM", IA: "DNR",
  KS: "KDHE", KY: "DWR", LA: "DEQ", ME: "DHHS", MD: "MDE",
  MA: "DEP", MI: "EGLE", MN: "MDH", MS: "MDEQ", MO: "MoDNR",
  MT: "MDEQ", NE: "DHHS", NV: "NDEP", NH: "DES", NJ: "DEP",
  NM: "NMED", NY: "NYSDOH", NC: "NCDEQ", ND: "NDDoH", OH: "Ohio EPA",
  OK: "DEQ", OR: "OHA", PA: "DEP", RI: "DEM", SC: "DHEC",
  SD: "DENR", TN: "TDEC", TX: "TCEQ", UT: "DWQ", VT: "DEC",
  VA: "DEQ", WA: "DOH", WV: "BPH", WI: "DNR", WY: "DEQ",
};

// ─── Contaminant name → content slug mapping ───────────────────────────────────

const CONTAMINANT_SLUG_MAP: Array<[RegExp, string]> = [
  [/lead/i, "lead"],
  [/nitrate|nitrite/i, "nitrates"],
  [/arsenic/i, "arsenic"],
  [/trihalomethane|tthm/i, "disinfection-byproducts"],
  [/haloacetic|haa5/i, "disinfection-byproducts"],
  [/pfas|pfoa|pfos|pfna|pfhxs/i, "pfas"],
  [/hardness|hard water/i, "hard-water"],
];

function mapContaminantToSlug(name: string): string | null {
  for (const [re, slug] of CONTAMINANT_SLUG_MAP) {
    if (re.test(name)) return slug;
  }
  return null;
}

// ─── Run a script step ─────────────────────────────────────────────────────────

function runStep(label: string, scriptPath: string, args: string[]): boolean {
  const bar = "─".repeat(60);
  console.log(`\n${bar}`);
  console.log(`▶  ${label}`);
  console.log(bar);

  const result = spawnSync(
    "npx", ["tsx", scriptPath, ...args],
    { stdio: "inherit", cwd: ROOT, env: process.env }
  );

  if (result.status !== 0) {
    console.error(`\n✖  Step failed: ${label} (exit ${result.status})`);
    return false;
  }
  return true;
}

// ─── Generate state content entry ─────────────────────────────────────────────

async function generateStateContent(abbr: string, stateName: string) {
  const stateRecord = await prisma.state.findFirst({ where: { abbreviation: abbr } });
  if (!stateRecord) throw new Error(`State record not found in DB for ${abbr}`);

  // Population: sum of utility populations
  const popAgg = await prisma.utility.aggregate({
    where: { state_id: stateRecord.id },
    _sum: { population_served: true },
  });
  const populationServed = popAgg._sum.population_served ?? 0;

  // Utility count
  const utilCount = await prisma.utility.count({ where: { state_id: stateRecord.id } });

  // Top contaminants: most frequent health-based violation contaminants → map to our slugs
  const healthViolations = await prisma.violation.findMany({
    where: {
      utility: { state_id: stateRecord.id },
      is_health_based: true,
      contaminant_name: { not: null },
    },
    select: { contaminant_name: true },
  });

  const slugCounts = new Map<string, number>();
  for (const v of healthViolations) {
    const slug = mapContaminantToSlug(v.contaminant_name!);
    if (slug) slugCounts.set(slug, (slugCounts.get(slug) ?? 0) + 1);
  }

  const topContaminants = [...slugCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([slug]) => slug);

  // Fallback contaminants if violations are sparse
  if (topContaminants.length === 0) topContaminants.push("disinfection-byproducts", "lead");
  if (topContaminants.length < 2) topContaminants.push("nitrates");

  // Primary source type
  const sourceGroups = await prisma.utility.groupBy({
    by: ["service_type"],
    where: { state_id: stateRecord.id },
    _count: true,
    orderBy: { _count: { service_type: "desc" } },
  });
  const primarySource = sourceGroups[0]?.service_type ?? "groundwater and surface water";

  // Violation stats
  const violationCount = await prisma.violation.count({
    where: { utility: { state_id: stateRecord.id } },
  });

  // Risk distribution
  const riskGroups = await prisma.utility.groupBy({
    by: ["risk_level"],
    where: { state_id: stateRecord.id },
    _count: true,
  });
  const riskMap = Object.fromEntries(riskGroups.map((r) => [r.risk_level, r._count]));
  const nonSafe = (riskMap.low ?? 0) + (riskMap.moderate ?? 0) + (riskMap.high ?? 0) + (riskMap.critical ?? 0);

  const wellPct = WELL_WATER_PCT[abbr] ?? 20;
  const agency = STATE_AGENCY[abbr] ?? "the state drinking water program";
  const contaminantNames = topContaminants
    .map((s) => ({ "lead": "lead", "nitrates": "nitrates", "arsenic": "arsenic", "disinfection-byproducts": "disinfection byproducts", "pfas": "PFAS", "hard-water": "hard water" }[s] ?? s))
    .join(", ");

  const summary =
    `${stateName} has ${utilCount.toLocaleString()} community water systems serving approximately ` +
    `${(populationServed / 1_000_000).toFixed(1)} million residents. Primary water sources include ${primarySource.toLowerCase()}. ` +
    `The most commonly reported contaminants include ${contaminantNames}. ` +
    `${wellPct}% of ${stateName} residents rely on private wells. ` +
    `${agency} holds primary enforcement authority under the Safe Drinking Water Act.`;

  const slug = stateName.toLowerCase().replace(/\s+/g, "-");
  const today = new Date().toISOString().split("T")[0];

  return {
    slug,
    name: stateName,
    abbreviation: abbr,
    populationServed,
    wellWaterPercent: wellPct,
    topContaminants,
    summary,
    lastUpdated: today,
    // stats for summary report
    _stats: { utilCount, violationCount, riskMap, nonSafe, topContaminants },
  };
}

// ─── Patch contaminants.ts affectedStates ─────────────────────────────────────

function patchContaminantsFile(stateSlug: string, contaminantSlugs: string[]) {
  const file = path.join(ROOT, "lib/content/contaminants.ts");
  let src = fs.readFileSync(file, "utf8");
  let patched = false;

  for (const slug of contaminantSlugs) {
    // Find the affectedStates array for this contaminant slug
    const re = new RegExp(
      `(slug:\\s*"${slug}"[\\s\\S]*?affectedStates:\\s*\\[)([^\\]]*)(\\])`,
      "m"
    );
    src = src.replace(re, (match, before, contents, close) => {
      if (contents.includes(`"${stateSlug}"`)) return match; // already there
      patched = true;
      const trimmed = contents.trimEnd();
      const separator = trimmed.endsWith(",") || trimmed.trim() === "" ? " " : ", ";
      return `${before}${trimmed}${separator}"${stateSlug}"${close}`;
    });
  }

  if (patched) {
    fs.writeFileSync(file, src, "utf8");
    console.log(`  ✓ Added "${stateSlug}" to affectedStates for: ${contaminantSlugs.join(", ")}`);
  } else {
    console.log(`  ℹ  affectedStates already up to date`);
  }
}

// ─── Patch states.ts ───────────────────────────────────────────────────────────

function patchStatesFile(content: ReturnType<typeof generateStateContent> extends Promise<infer T> ? T : never) {
  const { _stats, ...entry } = content;
  void _stats;

  const src = fs.readFileSync(STATES_FILE, "utf8");

  // Already exists?
  if (src.includes(`abbreviation: "${entry.abbreviation}"`)) {
    console.log(`\n  ℹ  ${entry.abbreviation} already exists in states.ts — skipping content patch.`);
    console.log(`     Update manually if needed: ${STATES_FILE}`);
    return;
  }

  const block = `  {
    slug: "${entry.slug}",
    name: "${entry.name}",
    abbreviation: "${entry.abbreviation}",
    populationServed: ${entry.populationServed},
    wellWaterPercent: ${entry.wellWaterPercent},
    topContaminants: ${JSON.stringify(entry.topContaminants)},
    summary:
      "${entry.summary.replace(/"/g, '\\"')}",
    lastUpdated: "${entry.lastUpdated}",
  },`;

  // Insert before the closing `];`
  const patched = src.replace(/\n\];/, `\n${block}\n];`);
  fs.writeFileSync(STATES_FILE, patched, "utf8");
  console.log(`\n  ✓ Appended ${entry.abbreviation} entry to lib/content/states.ts`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const abbr = stateIdx !== -1 ? args[stateIdx + 1]?.toUpperCase() : null;
  const dryRun = args.includes("--dry-run");

  if (!abbr || !STATE_NAMES[abbr]) {
    console.error("Usage: npx tsx scripts/build-state.ts --state NY [--dry-run]");
    console.error(`Available: ${Object.keys(STATE_NAMES).join(", ")}`);
    process.exit(1);
  }

  const stateName = STATE_NAMES[abbr];
  const scripts = path.join(ROOT, "scripts");

  console.log(`\n${"═".repeat(60)}`);
  console.log(`  WUR State Builder — ${stateName} (${abbr})`);
  console.log(`  ${dryRun ? "DRY RUN — no DB writes" : "Live run"}`);
  console.log(`${"═".repeat(60)}`);

  if (dryRun) {
    console.log("\n[Dry run] Skipping DB ingestion steps. Generating content preview only.\n");
  } else {
    // Step 1: Utilities
    const ok1 = runStep("Step 1/5 — Ingest utilities (EPA SDWIS)", `${scripts}/ingest-sdwis.ts`, ["--state", abbr]);
    if (!ok1) process.exit(1);

    // Step 2: Violations
    const ok2 = runStep("Step 2/5 — Ingest violations", `${scripts}/ingest-violations.ts`, ["--state", abbr]);
    if (!ok2) process.exit(1);

    // Step 3: Geo area
    const ok3 = runStep("Step 3/5 — Ingest city data (geo area)", `${scripts}/ingest-geo-area.ts`, ["--state", abbr]);
    if (!ok3) process.exit(1);

    // Step 4: Fix slugs
    const ok4 = runStep("Step 4/5 — Normalize slugs", `${scripts}/fix-slugs.ts`, ["--state", abbr]);
    if (!ok4) process.exit(1);

    // Step 5: Rescore
    const ok5 = runStep("Step 5/5 — Score risk levels", `${scripts}/rescore-risk.ts`, ["--state", abbr]);
    if (!ok5) process.exit(1);
  }

  // Generate state content
  console.log(`\n${"─".repeat(60)}`);
  console.log("▶  Generating state content entry...");
  const content = await generateStateContent(abbr, stateName);

  if (!dryRun) {
    patchStatesFile(content);
    console.log("▶  Updating contaminant affectedStates...");
    patchContaminantsFile(content.slug, content.topContaminants);
  }

  // ─── Summary ────────────────────────────────────────────────────────────────
  const s = content._stats;
  console.log(`\n${"═".repeat(60)}`);
  console.log(`  ✅  ${stateName} is ready to publish`);
  console.log(`${"═".repeat(60)}`);
  console.log(`\n  Utilities ingested : ${s.utilCount.toLocaleString()}`);
  console.log(`  Violations         : ${s.violationCount.toLocaleString()}`);
  console.log(`  Risk distribution  : safe=${s.riskMap.safe ?? 0} low=${s.riskMap.low ?? 0} moderate=${s.riskMap.moderate ?? 0} high=${s.riskMap.high ?? 0} critical=${s.riskMap.critical ?? 0}`);
  console.log(`  Non-safe utilities : ${s.nonSafe}`);
  console.log(`  Top contaminants   : ${s.topContaminants.join(", ")}`);
  console.log(`\n  Generated summary:`);
  console.log(`  "${content.summary}"`);
  if (!dryRun) {
    console.log(`\n  Next steps:`);
    console.log(`  1. Review the generated entry in lib/content/states.ts`);
    console.log(`  2. Edit the summary to add state-specific context if needed`);
    console.log(`  3. Deploy: vercel --prod`);
    console.log(`  4. Publish from admin: https://waterutilityreport.com/admin/states`);
  }
  console.log(`\n${"═".repeat(60)}\n`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
