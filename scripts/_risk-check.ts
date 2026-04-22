import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }) });
  const states = (process.argv[2] ?? '').split(',').map(s => s.trim().toUpperCase()).filter(Boolean);

  const utils = await prisma.utility.findMany({
    where: {
      state: { abbreviation: { in: states } },
      risk_level: { in: ['high', 'critical'] },
    },
    select: {
      name: true, pwsid: true, risk_level: true, population_served: true,
      state: { select: { abbreviation: true } },
      violations: {
        where: { is_health_based: true },
        select: { contaminant_name: true, resolution_date: true, violation_date: true },
      },
    },
    orderBy: [{ state: { abbreviation: 'asc' } }, { risk_level: 'desc' }, { population_served: 'desc' }],
  });

  for (const u of utils) {
    const open = u.violations.filter(v => !v.resolution_date);
    const resolved = u.violations.filter(v => v.resolution_date);
    const contams = [...new Set(open.map(v => v.contaminant_name).filter(Boolean))].join(', ');
    const oldestOpen = open
      .map(v => v.violation_date)
      .filter(Boolean)
      .sort()[0];
    console.log(
      `[${u.state.abbreviation}] ${u.risk_level.toUpperCase().padEnd(8)} | ${u.pwsid} | ${u.name.substring(0, 42).padEnd(42)} | pop ${String(u.population_served.toLocaleString()).padStart(7)} | open:${open.length} resolved:${resolved.length} | ${contams || '—'}${oldestOpen ? ` | since ${new Date(oldestOpen).getFullYear()}` : ''}`
    );
  }

  console.log(`\nTotal: ${utils.length} utilities at high or critical risk`);
  await prisma.$disconnect();
}

main().catch(e => { console.error(e); process.exit(1); });
