/**
 * Publish / Unpublish utilities by state or filter criteria.
 *
 * Usage:
 *   npx tsx scripts/publish.ts --state CA              # publish all CA utilities
 *   npx tsx scripts/publish.ts --state CA --min 10000  # publish CA >= 10k pop
 *   npx tsx scripts/publish.ts --state CA --dry-run    # preview without writing
 *   npx tsx scripts/publish.ts --state CA --unpublish  # revert to draft
 *   npx tsx scripts/publish.ts --status                # show publish counts by state
 */

import "dotenv/config";
import { PrismaClient, type Prisma } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function showStatus() {
  const states = await prisma.state.findMany({ select: { id: true, name: true, abbreviation: true } });
  console.log("\nPublish status by state:\n");
  console.log("  State".padEnd(20) + "Published".padEnd(12) + "Draft".padEnd(10) + "Total");
  console.log("  " + "─".repeat(48));
  for (const state of states) {
    const [published, total] = await Promise.all([
      prisma.utility.count({ where: { state_id: state.id, publish_status: "published" } }),
      prisma.utility.count({ where: { state_id: state.id } }),
    ]);
    console.log(
      `  ${(state.name + " (" + state.abbreviation + ")").padEnd(20)}` +
      `${String(published).padEnd(12)}` +
      `${String(total - published).padEnd(10)}` +
      `${total}`
    );
  }
  const grandTotal = await prisma.utility.count();
  const grandPublished = await prisma.utility.count({ where: { publish_status: "published" } });
  console.log("  " + "─".repeat(48));
  console.log(`  ${"TOTAL".padEnd(20)}${String(grandPublished).padEnd(12)}${String(grandTotal - grandPublished).padEnd(10)}${grandTotal}\n`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--status")) {
    await showStatus();
    await prisma.$disconnect();
    return;
  }

  const stateArg = args.find((_, i) => args[i - 1] === "--state");
  const minArg = args.find((_, i) => args[i - 1] === "--min");
  const dryRun = args.includes("--dry-run");
  const unpublish = args.includes("--unpublish");

  if (!stateArg) {
    console.error("--state is required. Use --status to see current publish state.");
    process.exit(1);
  }

  const state = await prisma.state.findUnique({ where: { abbreviation: stateArg.toUpperCase() } });
  if (!state) {
    console.error(`State not found: ${stateArg}`);
    process.exit(1);
  }

  const where: Prisma.UtilityWhereInput = {
    state_id: state.id,
    publish_status: unpublish ? "published" : { not: "published" },
    ...(minArg ? { population_served: { gte: parseInt(minArg) } } : {}),
  };

  const targets = await prisma.utility.findMany({
    where,
    select: { id: true, name: true, pwsid: true, population_served: true, risk_level: true },
    orderBy: { population_served: "desc" },
  });

  const action = unpublish ? "unpublish" : "publish";
  console.log(`\n${dryRun ? "[DRY RUN] " : ""}${action.toUpperCase()} ${targets.length} utilities in ${state.name}${minArg ? ` (pop >= ${parseInt(minArg).toLocaleString()})` : ""}\n`);

  if (targets.length === 0) {
    console.log("Nothing to do.");
    await prisma.$disconnect();
    return;
  }

  // Show sample
  const sample = targets.slice(0, 5);
  for (const u of sample) {
    console.log(`  ${u.name.padEnd(50)} ${u.pwsid}  pop: ${u.population_served.toLocaleString()}  risk: ${u.risk_level}`);
  }
  if (targets.length > 5) {
    console.log(`  ... and ${targets.length - 5} more`);
  }

  if (dryRun) {
    console.log(`\n[DRY RUN] No changes written. Remove --dry-run to apply.`);
    await prisma.$disconnect();
    return;
  }

  const newStatus = unpublish ? "draft" : "published";
  const result = await prisma.utility.updateMany({
    where: { id: { in: targets.map((t) => t.id) } },
    data: {
      publish_status: newStatus,
      last_published_at: unpublish ? null : new Date(),
    },
  });

  console.log(`\n✓ ${result.count} utilities set to "${newStatus}"`);

  await showStatus();
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  prisma.$disconnect();
  process.exit(1);
});
