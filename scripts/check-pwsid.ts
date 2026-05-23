import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });
  const pwsid = process.argv[2];
  const u = await prisma.utility.findFirst({
    where: { pwsid },
    include: { violations: { orderBy: { violation_date: 'desc' } } }
  });
  console.log('Name:', u?.name);
  console.log('Risk level:', u?.risk_level, '| Score:', u?.risk_score);
  console.log('Violations:');
  for (const v of u?.violations ?? []) {
    console.log(JSON.stringify({
      id: v.id,
      type: v.violation_type,
      health: v.is_health_based,
      date: v.violation_date?.toISOString().split('T')[0] ?? null,
      resolved: v.resolution_date?.toISOString().split('T')[0] ?? null,
      contaminant: v.contaminant_name,
    }));
  }
  await prisma.$disconnect();
}
main().catch(console.error);
