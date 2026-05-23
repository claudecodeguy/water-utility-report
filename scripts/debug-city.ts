import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const state = process.argv[2]?.toUpperCase();
  const search = process.argv[3]?.toLowerCase();
  
  const rows = await prisma.utility.findMany({
    where: { state: { abbreviation: state }, city_served: { not: null }, publish_status: 'published' },
    select: { city_served: true, name: true },
    distinct: ['city_served'],
    orderBy: { city_served: 'asc' },
  });

  const filtered = search ? rows.filter(r => r.city_served!.toLowerCase().includes(search)) : rows.slice(0, 30);
  filtered.forEach(r => {
    const slug = r.city_served!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    console.log(`"${r.city_served}" → ${slug}-${state!.toLowerCase()}`);
  });
  await prisma.$disconnect();
}
main().catch(console.error);
