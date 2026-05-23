import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  
  // Find Chicago water utility
  const u = await prisma.utility.findFirst({
    where: { state: { abbreviation: 'IL' }, name: { contains: 'CHICAGO', mode: 'insensitive' }, publish_status: 'published' },
    select: { name: true, pwsid: true, city_served: true, population_served: true },
    orderBy: { population_served: 'desc' },
  });
  console.log('Chicago utility:', JSON.stringify(u));
  
  // Also check NYC
  const nyc = await prisma.utility.findFirst({
    where: { state: { abbreviation: 'NY' }, name: { contains: 'NEW YORK', mode: 'insensitive' }, publish_status: 'published' },
    select: { name: true, pwsid: true, city_served: true, population_served: true },
    orderBy: { population_served: 'desc' },
  });
  console.log('NYC utility:', JSON.stringify(nyc));

  await prisma.$disconnect();
}
main().catch(console.error);
