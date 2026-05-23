import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const states = await prisma.state.findMany({ orderBy: { abbreviation: "asc" } });
  console.log("\nViolation coverage by state:\n");
  console.log("  State".padEnd(20) + "With Violations".padEnd(18) + "Total Utilities".padEnd(18) + "Total Violations");
  console.log("  " + "─".repeat(72));
  for (const s of states) {
    const [total, withViolations, totalViolations] = await Promise.all([
      prisma.utility.count({ where: { state_id: s.id } }),
      prisma.utility.count({ where: { state_id: s.id, violations: { some: {} } } }),
      prisma.violation.count({ where: { utility: { state_id: s.id } } }),
    ]);
    const label = `${s.name} (${s.abbreviation})`;
    console.log(
      `  ${label.padEnd(18)} ${String(withViolations).padEnd(16)} ${String(total).padEnd(16)} ${totalViolations}`
    );
  }
  await prisma.$disconnect();
}

main().catch(console.error);
