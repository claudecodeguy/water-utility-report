import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const states = (process.argv[2] ?? '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);
  const levels = ['critical', 'high'] as const;

  for (const abbr of states) {
    const utils = await prisma.utility.findMany({
      where: {
        state: { abbreviation: abbr },
        publish_status: 'published',
        risk_level: { in: levels },
      },
      select: {
        name: true, slug: true, risk_level: true, risk_score: true, population_served: true,
        violations: { where: { is_health_based: true, resolution_date: null }, select: { violation_type: true, contaminant_name: true, violation_date: true } }
      },
      orderBy: [{ risk_level: 'asc' }, { risk_score: 'desc' }],
    });

    if (utils.length === 0) continue;
    console.log(`\n━━━ ${abbr} high/critical ━━━`);
    for (const u of utils) {
      console.log(`  [${u.risk_level.toUpperCase()}] ${u.name} (score: ${u.risk_score}, pop: ${u.population_served.toLocaleString()})`);
      console.log(`    /utilities/${u.slug}`);
      for (const v of u.violations) {
        console.log(`    → ${v.violation_type ?? 'unknown'} | ${v.contaminant_name ?? 'no contaminant'} | ${v.violation_date?.toISOString().split('T')[0] ?? 'no date'}`);
      }
    }
  }
  await prisma.$disconnect();
}
main().catch(console.error);
