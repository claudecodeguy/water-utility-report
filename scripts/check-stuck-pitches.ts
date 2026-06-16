import { prisma } from "@/lib/prisma";

async function main() {
  const now = new Date();

  // Approved pitches grouped by age
  const approved = await prisma.outreachOrgPitch.findMany({
    where: { status: "approved" },
    select: {
      id: true,
      approved_at: true,
      approved_by: true,
      organization: { select: { name: true, email: true } },
    },
    orderBy: { approved_at: "asc" },
  });

  const byAge = approved.map(p => ({
    org: p.organization.name,
    email: p.organization.email,
    approved_by: p.approved_by,
    approved_at: p.approved_at,
    age_days: p.approved_at ? Math.floor((now.getTime() - p.approved_at.getTime()) / 86400000) : null,
  }));

  const stuckOver1Day = byAge.filter(p => (p.age_days ?? 0) >= 1);
  const stuckOver3Days = byAge.filter(p => (p.age_days ?? 0) >= 3);

  // Also check what the orchestrator sees for daily budget
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const sentToday = await prisma.outreachOrgPitch.count({
    where: { status: "sent", sent_at: { gte: todayStart } },
  });
  const inPipeline = await prisma.outreachOrgPitch.count({
    where: { status: { in: ["draft", "approved"] } },
  });
  const dailyLimit = 50;
  const alreadyInPipeline = sentToday + inPipeline;
  const targetDrafts = Math.max(0, dailyLimit - alreadyInPipeline);

  console.log(JSON.stringify({
    approved_total: approved.length,
    stuck_over_1_day: stuckOver1Day.length,
    stuck_over_3_days: stuckOver3Days.length,
    oldest_stuck: byAge.slice(0, 5).map(p => ({ org: p.org, age_days: p.age_days, approved_by: p.approved_by })),
    budget_calc: {
      sent_today: sentToday,
      in_pipeline_draft_or_approved: inPipeline,
      already_in_pipeline: alreadyInPipeline,
      daily_limit: dailyLimit,
      target_new_drafts: targetDrafts,
      effective_sends_available: dailyLimit - sentToday,
    },
  }, null, 2));

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
