import { requireAdmin, requireCronSecret } from "@/lib/outreach/auth";
import { runOrgPipeline } from "@/lib/outreach/orgs/orchestrator";
import { prisma } from "@/lib/prisma";
import stateContent from "@/lib/content/states";

const DAILY_CAP = parseInt(process.env.OUTREACH_ORG_DAILY_LIMIT || "50", 10);

const STATE_SLUG: Record<string, string> = Object.fromEntries(
  stateContent.map((s) => [s.abbreviation, s.slug])
);
const HUB_URL = "https://waterutilityreport.com/data/pfas";

async function sentTodayCount(): Promise<number> {
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  return prisma.outreachOrgPitch.count({
    where: { status: "sent", sent_at: { gte: todayStart } },
  });
}

async function validCandidateCount(): Promise<number> {
  const cutoff90d = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  const orgs = await prisma.outreachOrganization.findMany({
    where: {
      status: "active",
      enrichment_status: { in: ["enriched", "enriched_partial", "manual"] },
      OR: [{ last_contacted_at: null }, { last_contacted_at: { lt: cutoff90d } }],
    },
    select: { id: true, is_national: true, states_served: true },
  });
  const existingPitches = await prisma.outreachOrgPitch.findMany({
    where: { organization_id: { in: orgs.map((o) => o.id) } },
    select: { organization_id: true, page_url: true },
  });
  const pitched = new Set(existingPitches.map((p) => `${p.organization_id}::${p.page_url}`));

  let count = 0;
  for (const org of orgs) {
    if (org.is_national) {
      if (!pitched.has(`${org.id}::${HUB_URL}`)) count++;
    } else {
      const hasNew = org.states_served.some((abbr) => {
        const slug = STATE_SLUG[abbr];
        if (!slug) return false;
        return !pitched.has(`${org.id}::https://waterutilityreport.com/data/pfas/${slug}`);
      });
      if (hasNew) count++;
    }
  }
  return count;
}

export async function GET(request: Request) {
  return POST(request);
}

export async function POST(request: Request) {
  if (!requireAdmin(request) && !requireCronSecret(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (process.env.OUTREACH_ORG_ENABLED !== "true") {
    return Response.json({ ok: false, error: "Org outreach pipeline is disabled" }, { status: 503 });
  }

  const sentToday = await sentTodayCount();

  // Already at cap — skip pipeline run, just report status
  if (sentToday >= DAILY_CAP) {
    const candidates = await validCandidateCount();
    return Response.json({
      ok: true,
      skipped: true,
      reason: "daily_cap_already_reached",
      total_sent_today: sentToday,
      daily_cap: DAILY_CAP,
      valid_candidates_remaining: candidates,
      pool_low: candidates < 100,
    });
  }

  // Run the pipeline once — orchestrator handles budget, expiry, auto-approve, send
  let result: Awaited<ReturnType<typeof runOrgPipeline>>;
  try {
    result = await runOrgPipeline();
  } catch (err) {
    console.error("[ensure-daily-cap] pipeline error:", err);
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }

  const totalSentToday = await sentTodayCount();
  const candidates = await validCandidateCount();
  const poolLow = candidates < 100;

  if (poolLow) {
    console.warn(
      `[ensure-daily-cap] POOL LOW: ${candidates} valid candidates remaining — add more orgs`
    );
  }

  return Response.json({
    ok: true,
    skipped: false,
    total_sent_today: totalSentToday,
    daily_cap: DAILY_CAP,
    cap_reached: totalSentToday >= DAILY_CAP,
    pipeline: result,
    valid_candidates_remaining: candidates,
    pool_low: poolLow,
  });
}
