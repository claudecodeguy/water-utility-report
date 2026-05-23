import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const states = (process.argv[2] ?? '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

  for (const abbr of states) {
    const state = await prisma.state.findFirst({ where: { abbreviation: abbr } });
    if (!state) { console.log(`${abbr}: NOT IN DB`); continue; }

    const total = await prisma.utility.count({ where: { state_id: state.id } });
    const published = await prisma.utility.count({ where: { state_id: state.id, publish_status: 'published' } });
    const noSlug = await prisma.utility.count({ where: { state_id: state.id, slug: '' } });
    const riskGroups = await prisma.utility.groupBy({
      by: ['risk_level'], where: { state_id: state.id, publish_status: 'published' }, _count: true,
    });
    const risk = Object.fromEntries(riskGroups.map(r => [r.risk_level, r._count]));
    const openHealth = await prisma.violation.count({
      where: { utility: { state_id: state.id }, is_health_based: true, resolution_date: null }
    });
    const noDate = await prisma.violation.count({
      where: { utility: { state_id: state.id }, is_health_based: true, violation_date: null }
    });

    console.log(`\n━━━ ${abbr} ━━━`);
    console.log(`  Utilities: ${total} total, ${published} published`);
    console.log(`  Empty slugs: ${noSlug}`);
    console.log(`  Risk: safe=${risk.safe??0} low=${risk.low??0} moderate=${risk.moderate??0} high=${risk.high??0} critical=${risk.critical??0}`);
    console.log(`  Open health violations: ${openHealth}`);
    console.log(`  Health violations missing date: ${noDate}`);
  }

  await prisma.$disconnect();
}
main().catch(console.error);
