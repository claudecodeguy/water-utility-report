/**
 * Manually set risk_level for utilities with active EPA enforcement priority
 * that our SDWIS-only scoring misses.
 * Usage: npx tsx scripts/_flag-enforcement.ts
 */
import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const ENFORCEMENT_OVERRIDES: { pwsid: string; risk_level: 'low' | 'moderate' | 'high' | 'critical'; reason: string }[] = [
  { pwsid: 'AL0001015', risk_level: 'low', reason: 'EPA ECHO Enforcement Priority — active formal compliance action despite resolved SDWIS violations' },
];

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });

  for (const o of ENFORCEMENT_OVERRIDES) {
    const u = await prisma.utility.findFirst({ where: { pwsid: o.pwsid }, select: { id: true, name: true, risk_level: true } });
    if (!u) { console.log(`NOT FOUND: ${o.pwsid}`); continue; }
    await prisma.utility.update({ where: { id: u.id }, data: { risk_level: o.risk_level } });
    console.log(`✓ ${o.pwsid} ${u.name}: ${u.risk_level} → ${o.risk_level} (${o.reason})`);
  }

  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
