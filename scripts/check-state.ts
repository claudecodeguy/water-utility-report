import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const abbr = process.argv[2]?.toUpperCase();
  const state = await prisma.state.findFirst({ where: { abbreviation: abbr } });
  if (!state) { console.log(`State ${abbr} not found in DB`); }
  else {
    const count = await prisma.utility.count({ where: { state_id: state.id } });
    console.log(`${abbr}: state record exists, publish_status=${state.publish_status}, utilities=${count}`);
  }
  await prisma.$disconnect();
}
main().catch(console.error);
