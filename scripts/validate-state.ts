/**
 * validate-state.ts
 *
 * Post-build validation for a state. Exits 1 if critical checks fail.
 *
 * Usage:
 *   npx tsx scripts/validate-state.ts --state MA
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const state = stateIdx !== -1 ? args[stateIdx + 1]?.toUpperCase() : null;
  if (!state) { console.error("Usage: npx tsx scripts/validate-state.ts --state MA"); process.exit(1); }

  console.log(`\nValidating ${state}...`);
  const failures: string[] = [];
  const warnings: string[] = [];

  const stateRecord = await prisma.state.findFirst({ where: { abbreviation: state } });
  if (!stateRecord) { console.error(`State ${state} not in DB`); process.exit(1); }

  // 1. Publish count
  const total = await prisma.utility.count({ where: { state_id: stateRecord.id } });
  const published = await prisma.utility.count({ where: { state_id: stateRecord.id, publish_status: "published" } });
  if (published === 0) failures.push(`No utilities published (${total} total)`);
  else if (published < total) warnings.push(`${total - published} utilities not published (${published}/${total})`);
  else console.log(`  ✓ All ${published} utilities published`);

  // 2. Empty slugs
  const emptySlug = await prisma.utility.count({ where: { state_id: stateRecord.id, publish_status: "published", slug: "" } });
  if (emptySlug > 0) failures.push(`${emptySlug} utilities with empty slug`);
  else console.log(`  ✓ No empty slugs`);

  // 3. Risk distribution (should not be 100% safe)
  const safe = await prisma.utility.count({ where: { state_id: stateRecord.id, publish_status: "published", risk_level: "safe" } });
  if (published > 0 && safe === published) warnings.push(`All utilities are "safe" — risk scoring may not have run`);
  else console.log(`  ✓ Risk distribution OK (${safe}/${published} safe)`);

  // 4. Health violations exist
  const violations = await prisma.violation.count({ where: { utility: { state_id: stateRecord.id }, is_health_based: true } });
  if (violations === 0) warnings.push(`No health-based violations found — check ingestion`);
  else console.log(`  ✓ ${violations.toLocaleString()} health-based violations`);

  // 5. Violations with null date
  const nullDates = await prisma.violation.count({ where: { utility: { state_id: stateRecord.id }, is_health_based: true, violation_date: null } });
  if (nullDates > 50) warnings.push(`${nullDates} health violations with null date — fix-missing-dates may have failed`);
  else console.log(`  ✓ Null violation dates: ${nullDates}`);

  // 6. cities exist
  const withCity = await prisma.utility.count({ where: { state_id: stateRecord.id, publish_status: "published", city_served: { not: null } } });
  if (withCity === 0) warnings.push(`No utilities have city_served set — city pages won't work`);
  else console.log(`  ✓ ${withCity} utilities have city_served`);

  // 7. states.ts has entry
  const statesFile = fs.readFileSync(path.join(__dirname, "../lib/content/states.ts"), "utf8");
  if (!statesFile.includes(`abbreviation: "${state}"`)) failures.push(`${state} missing from lib/content/states.ts`);
  else console.log(`  ✓ states.ts entry present`);

  // Print summary
  console.log(`\n  Warnings: ${warnings.length}`);
  for (const w of warnings) console.log(`    ⚠  ${w}`);
  console.log(`  Failures: ${failures.length}`);
  for (const f of failures) console.log(`    ✖  ${f}`);

  await prisma.$disconnect();

  if (failures.length > 0) {
    console.log(`\n✖  ${state} validation FAILED\n`);
    process.exit(1);
  }
  console.log(`\n✅  ${state} validation PASSED\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
