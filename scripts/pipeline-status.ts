import { prisma } from "@/lib/prisma";

async function main() {
  const [
    totalOrgs,
    activeOrgs,
    enrichedOrgs,
    pendingOrgs,
    totalPitches,
    sentPitches,
    draftPitches,
    approvedPitches,
    abPitches,
    recentRuns,
  ] = await Promise.all([
    prisma.outreachOrganization.count(),
    prisma.outreachOrganization.count({ where: { status: "active" } }),
    prisma.outreachOrganization.count({
      where: { status: "active", enrichment_status: { in: ["enriched", "enriched_partial", "manual"] } },
    }),
    prisma.outreachOrganization.count({
      where: { status: "active", enrichment_status: "pending" },
    }),
    prisma.outreachOrgPitch.count(),
    prisma.outreachOrgPitch.count({ where: { status: "sent" } }),
    prisma.outreachOrgPitch.count({ where: { status: "draft" } }),
    prisma.outreachOrgPitch.count({ where: { status: "approved" } }),
    prisma.outreachOrgPitch.count({ where: { ab_variant: { in: ["A", "B"] } } }),
    prisma.outreachOrgPitch.findMany({
      where: { status: "sent" },
      orderBy: { sent_at: "desc" },
      take: 5,
      select: { sent_at: true, ab_variant: true, organization: { select: { name: true } } },
    }),
  ]);

  // Orgs eligible for new pitches (enriched, not pitched in 90 days)
  const cutoff90d = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const eligible = await prisma.outreachOrganization.count({
    where: {
      status: "active",
      enrichment_status: { in: ["enriched", "enriched_partial", "manual"] },
      OR: [{ last_contacted_at: null }, { last_contacted_at: { lt: cutoff90d } }],
    },
  });

  console.log(JSON.stringify({
    orgs: { total: totalOrgs, active: activeOrgs, enriched: enrichedOrgs, pending: pendingOrgs, eligible_for_pitch: eligible },
    pitches: { total: totalPitches, sent: sentPitches, draft: draftPitches, approved: approvedPitches, with_ab_variant: abPitches },
    recent_sends: recentRuns.map(r => ({
      sent_at: r.sent_at,
      ab_variant: r.ab_variant,
      org: r.organization.name,
    })),
  }, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
