import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const slugs = process.argv.slice(2);
  for (const slug of slugs) {
    const u = await prisma.utility.findUnique({
      where: { slug },
      select: { name: true, risk_level: true, risk_score: true, publish_status: true, violations: { where: { is_health_based: true, resolution_date: null }, select: { id: true, violation_type: true, contaminant_name: true, violation_date: true } } }
    });
    if (!u) { console.log(`${slug}: NOT FOUND`); continue; }
    console.log(`${slug}: ${u.name} | ${u.risk_level} (${u.risk_score}) | ${u.publish_status}`);
    for (const v of u.violations) console.log(`  → ${v.violation_type} | ${v.contaminant_name} | ${v.violation_date?.toISOString().split('T')[0]}`);
  }
  await prisma.$disconnect();
}
main().catch(console.error);
