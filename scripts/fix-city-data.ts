import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  // 1. Fix city_served values with parenthetical suffixes e.g. "New York (C)" → "New York"
  const withParens = await prisma.utility.findMany({
    where: { city_served: { contains: '(' }, publish_status: 'published' },
    select: { id: true, city_served: true, name: true },
  });
  console.log(`\nFixing parenthetical city names: ${withParens.length}`);
  for (const u of withParens) {
    const fixed = u.city_served!.replace(/\s*\([^)]*\)/g, '').trim();
    await prisma.utility.update({ where: { id: u.id }, data: { city_served: fixed } });
    if (fixed !== u.city_served) console.log(`  "${u.city_served}" → "${fixed}" (${u.name})`);
  }

  // 2. Patch major cities with null city_served using known PWSID mappings
  const patches = [
    { pwsid: 'IL0316000', city: 'Chicago' },       // Chicago Dept of Water Management
    { pwsid: 'NY7003493', city: 'New York' },       // NYC DEP (already fixed above, belt+suspenders)
    { pwsid: 'MI3826800', city: 'Detroit' },        // Detroit Water
    { pwsid: 'NC0492010', city: 'Charlotte' },      // Charlotte Water
    { pwsid: 'GA0610001', city: 'Atlanta' },        // City of Atlanta
    { pwsid: 'NC0920010', city: 'Raleigh' },        // City of Raleigh
    { pwsid: 'MI8200003', city: 'Grand Rapids' },   // Grand Rapids Water
    { pwsid: 'IL1634010', city: 'Naperville' },     // Naperville Water
    { pwsid: 'NY5503393', city: 'Buffalo' },        // Buffalo Water
    { pwsid: 'NY5501500', city: 'Syracuse' },       // Syracuse Water
  ];

  console.log(`\nPatching major cities with null city_served:`);
  for (const p of patches) {
    const u = await prisma.utility.findFirst({ where: { pwsid: p.pwsid }, select: { id: true, city_served: true, name: true } });
    if (!u) { console.log(`  ${p.pwsid}: not found`); continue; }
    if (u.city_served === p.city) { console.log(`  ${p.pwsid}: already set to "${p.city}"`); continue; }
    await prisma.utility.update({ where: { id: u.id }, data: { city_served: p.city } });
    console.log(`  ${u.name}: "${u.city_served ?? 'null'}" → "${p.city}"`);
  }

  console.log('\n✓ Done.');
  await prisma.$disconnect();
}
main().catch(console.error);
