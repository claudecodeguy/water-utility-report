import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const [states, utilities] = await Promise.all([
    prisma.state.count(),
    prisma.utility.count(),
  ]);
  const byState = await prisma.utility.groupBy({ by: ["state_id"], _count: true });
  const stateRecords = await prisma.state.findMany({ select: { id: true, name: true } });
  const stateMap = Object.fromEntries(stateRecords.map(s => [s.id, s.name]));
  console.log(`\nStates: ${states}  |  Utilities: ${utilities}\n`);
  for (const s of byState) {
    console.log(`  ${stateMap[s.state_id] ?? s.state_id}: ${s._count}`);
  }
  await prisma.$disconnect();
}

main().catch(console.error);
