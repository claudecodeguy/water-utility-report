import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  const states = ['CA','TX','FL','AZ','OH','GA','IL','MI','NC','NY'];
  let total = 0;

  for (const abbr of states) {
    const result = await prisma.utility.findMany({
      where: { state: { abbreviation: abbr }, publish_status: 'published', city_served: { not: null } },
      select: { city_served: true },
      distinct: ['city_served'],
    });
    console.log(`${abbr}: ${result.length} cities`);
    total += result.length;
  }
  console.log(`\nTotal: ${total} city pages`);
  await prisma.$disconnect();
}
main().catch(console.error);
