import { prisma } from "@/lib/prisma";

async function main() {
  // Get sent counts per day for the last 14 days
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  const sends = await prisma.outreachOrgPitch.findMany({
    where: { status: "sent", sent_at: { gte: since } },
    select: { sent_at: true, ab_variant: true },
    orderBy: { sent_at: "desc" },
  });

  // Group by date
  const byDay: Record<string, { total: number; A: number; B: number; none: number }> = {};
  for (const p of sends) {
    const day = p.sent_at!.toISOString().slice(0, 10);
    if (!byDay[day]) byDay[day] = { total: 0, A: 0, B: 0, none: 0 };
    byDay[day].total++;
    if (p.ab_variant === "A") byDay[day].A++;
    else if (p.ab_variant === "B") byDay[day].B++;
    else byDay[day].none++;
  }

  const approved = await prisma.outreachOrgPitch.count({ where: { status: "approved" } });
  const eligibleOrgs = await prisma.outreachOrganization.count({
    where: {
      status: "active",
      enrichment_status: { in: ["enriched", "enriched_partial", "manual"] },
      OR: [
        { last_contacted_at: null },
        { last_contacted_at: { lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } },
      ],
    },
  });

  console.log(JSON.stringify({ daily_sends: byDay, approved_queued: approved, eligible_orgs_remaining: eligibleOrgs, total_sent_all_time: sends.length + (await prisma.outreachOrgPitch.count({ where: { status: "sent", sent_at: { lt: since } } })) }, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
