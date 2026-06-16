import { prisma } from "@/lib/prisma";

async function main() {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [sent, bounced, rejected, drafts] = await Promise.all([
    prisma.outreachOrgPitch.count({ where: { status: "sent", sent_at: { gte: todayStart } } }),
    prisma.outreachOrgPitch.count({ where: { status: "bounced" } }),
    prisma.outreachOrgPitch.count({ where: { status: "rejected" } }),
    prisma.outreachOrgPitch.count({ where: { status: "draft" } }),
  ]);

  // Check orgs with missing emails
  const missingEmail = await prisma.outreachOrganization.count({
    where: { status: "active", email: "" },
  });

  // Sample bounced pitches
  const bouncedSamples = await prisma.outreachOrgPitch.findMany({
    where: { status: "bounced" },
    include: { organization: { select: { name: true, email: true } } },
    take: 10,
  });

  // Today's sent pitches with variant info
  const todaySent = await prisma.outreachOrgPitch.findMany({
    where: { status: "sent", sent_at: { gte: todayStart } },
    select: {
      ab_variant: true,
      sent_at: true,
      organization: { select: { name: true, email: true } },
    },
    take: 20,
  });

  console.log(JSON.stringify({
    today: { sent, bounced_all_time: bounced, rejected_all_time: rejected, drafts_waiting: drafts },
    orgs_with_missing_email: missingEmail,
    bounced_samples: bouncedSamples.map(p => ({ org: p.organization.name, email: p.organization.email })),
    today_sent_sample: todaySent.map(p => ({ org: p.organization.name, variant: p.ab_variant, sent_at: p.sent_at })),
  }, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
