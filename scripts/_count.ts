import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
async function main() {
  const states = await prisma.state.findMany({
    select: { abbreviation: true, _count: { select: { utilities: true } } },
    orderBy: { abbreviation: "asc" },
  });
  console.log(`State records in DB: ${states.length}`);
  states.forEach(s => console.log(`  ${s.abbreviation}: ${s._count.utilities} utilities`));
}
main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
