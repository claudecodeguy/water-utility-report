/**
 * Fixes utility slugs for names in suffix format ("NAME, CITY OF" → "city-of-name").
 *
 * Usage:
 *   npx tsx scripts/fix-slugs.ts --dry-run      # preview changes only
 *   npx tsx scripts/fix-slugs.ts                 # apply changes
 *   npx tsx scripts/fix-slugs.ts --state CA      # single state
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { normalizeName, normalizeSlug } from "../lib/normalize-name";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const stateIdx = args.indexOf("--state");
const STATE_FILTER: string | null = stateIdx !== -1 ? (args[stateIdx + 1] ?? null) : null;

async function main() {
  const where = STATE_FILTER
    ? { state: { abbreviation: STATE_FILTER } }
    : {};

  const utilities = await prisma.utility.findMany({
    where,
    select: { id: true, name: true, slug: true, publish_status: true, state: { select: { abbreviation: true } } },
  });

  const suffixRe = /[, \-]+(CITY|TOWN|COUNTY|TOWNSHIP|VILLAGE|BOROUGH) OF$/i;
  const toFix = utilities.filter((u) => suffixRe.test(u.name));

  console.log(`\nFound ${toFix.length} utilities with suffix-format names${STATE_FILTER ? ` in ${STATE_FILTER}` : ""}.\n`);

  if (toFix.length === 0) {
    console.log("Nothing to do.");
    await prisma.$disconnect();
    return;
  }

  // Load ALL slugs across all states to detect cross-state conflicts
  const allSlugsRaw = await prisma.utility.findMany({ select: { slug: true } });
  const existingSlugs = new Set(allSlugsRaw.map((u) => u.slug));
  const redirects: Array<{ from: string; to: string; state: string; status: string }> = [];
  const updates: Array<{ id: string; slug: string; name: string }> = [];
  const conflicts: string[] = [];

  for (const u of toFix) {
    const newName = normalizeName(u.name);
    let newSlug = normalizeSlug(u.name);

    // If new slug already exists (for a different utility), append state abbreviation
    if (newSlug !== u.slug && existingSlugs.has(newSlug)) {
      const stateSlug = `${newSlug}-${u.state.abbreviation.toLowerCase()}`;
      if (existingSlugs.has(stateSlug)) {
        console.warn(`  CONFLICT (unresolvable): ${newSlug} and ${stateSlug} both taken (for ${u.name})`);
        conflicts.push(u.slug);
        continue;
      }
      console.warn(`  CONFLICT: ${newSlug} taken — using ${stateSlug} instead`);
      newSlug = stateSlug;
    }

    if (newSlug === u.slug && newName === u.name) continue; // nothing to change

    updates.push({ id: u.id, slug: newSlug, name: newName });
    if (u.publish_status === "published") {
      redirects.push({ from: u.slug, to: newSlug, state: u.state.abbreviation, status: "published" });
    }
    existingSlugs.delete(u.slug);
    existingSlugs.add(newSlug);
  }

  console.log(`  ${updates.length} slugs to update (${redirects.length} require redirects for published pages)`);
  if (conflicts.length) console.log(`  ${conflicts.length} conflicts skipped`);

  if (DRY_RUN) {
    console.log("\n--- DRY RUN: first 20 changes ---");
    updates.slice(0, 20).forEach((u) => {
      const orig = toFix.find((x) => x.id === u.id)!;
      console.log(`  "${orig.name}" → "${u.name}"`);
      console.log(`  /${orig.slug} → /${u.slug}${redirects.find((r) => r.from === orig.slug) ? " [redirect needed]" : ""}\n`);
    });

    if (redirects.length) {
      console.log(`\n--- Redirects needed (paste into next.config.ts) ---`);
      printRedirects(redirects);
    }
    await prisma.$disconnect();
    return;
  }

  // Apply updates in batches
  console.log("\nApplying updates...");
  let done = 0;
  for (const u of updates) {
    await prisma.utility.update({
      where: { id: u.id },
      data: { slug: u.slug },
    });
    done++;
    if (done % 50 === 0) process.stdout.write(`  ${done}/${updates.length}\r`);
  }
  console.log(`\n✓ Updated ${done} utilities.`);

  if (redirects.length) {
    console.log(`\n--- Add these redirects to next.config.ts ---`);
    printRedirects(redirects);
  }

  await prisma.$disconnect();
}

function printRedirects(redirects: Array<{ from: string; to: string }>) {
  console.log("  async redirects() {");
  console.log("    return [");
  redirects.forEach(({ from, to }) => {
    console.log(`      { source: "/utilities/${from}", destination: "/utilities/${to}", permanent: true },`);
  });
  console.log("    ];");
  console.log("  },");
}

main().catch((e) => { console.error(e); process.exit(1); });
