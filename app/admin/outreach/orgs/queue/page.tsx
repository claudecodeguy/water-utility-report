import { prisma } from "@/lib/prisma";
import AdminOrgPitchQueue, { type CohortStat } from "@/components/admin-org-pitch-queue";
import type { OrgPitchCardData } from "@/components/admin-org-pitch-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pitch Queue — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function scoreOrg(org: {
  focus_areas: string[];
  recent_topics: string[];
  organization_type: string | null;
  enrichment_status: string;
  contacted_count: number;
}): number {
  let score = 0;
  const waterTerms = /water|environment|public health|drinking water|pfas/i;
  if (org.focus_areas.some((f) => waterTerms.test(f))) score += 5;
  if (org.recent_topics.some((t) => /pfas|drinking water|water quality|contamination/i.test(t))) score += 3;
  if (org.organization_type === "nonprofit") score += 2;
  if (org.organization_type === "extension") score += 1;
  if (org.organization_type === "health_dept") score += 1;
  if (org.contacted_count === 0) score += 0.5;
  if (org.enrichment_status === "enriched_partial") score -= 2;
  return score;
}

function toPitchCard(p: {
  id: string;
  subject: string;
  body: string;
  personalization_note: string | null;
  page_url: string;
  page_type: string;
  state_abbreviation: string | null;
  status: string;
  organization: {
    id: string;
    name: string;
    email: string;
    organization_type: string | null;
    contact_name: string | null;
    focus_areas: string[];
    recent_topics: string[];
    enrichment_status: string;
    contacted_count: number;
    pickup_count: number;
  };
}): OrgPitchCardData {
  return {
    id: p.id,
    subject: p.subject,
    body: p.body,
    personalization_note: p.personalization_note,
    page_url: p.page_url,
    page_type: p.page_type,
    state_abbreviation: p.state_abbreviation,
    status: p.status,
    score: scoreOrg(p.organization),
    organization: {
      id: p.organization.id,
      name: p.organization.name,
      email: p.organization.email,
      organization_type: p.organization.organization_type,
      contact_name: p.organization.contact_name,
      focus_areas: p.organization.focus_areas,
      contacted_count: p.organization.contacted_count,
      pickup_count: p.organization.pickup_count,
    },
  };
}

export default async function OrgPitchQueuePage() {
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);

  const dailyLimit = parseInt(process.env.OUTREACH_ORG_DAILY_LIMIT || "30", 10);

  const orgSelect = {
    id: true,
    name: true,
    email: true,
    organization_type: true,
    contact_name: true,
    focus_areas: true,
    recent_topics: true,
    enrichment_status: true,
    contacted_count: true,
    pickup_count: true,
  } as const;

  // Load draft + approved pitches, all-time sent per cohort, replied per cohort
  const [drafts, approvedPitches, alreadyInPipeline, sentByCohort, repliedByCohort, draftByCohort, approvedByCohort] =
    await Promise.all([
      prisma.outreachOrgPitch.findMany({
        where: { status: "draft" },
        include: { organization: { select: orgSelect } },
        orderBy: { draft_created_at: "desc" },
      }),
      prisma.outreachOrgPitch.findMany({
        where: { status: "approved" },
        include: { organization: { select: orgSelect } },
        orderBy: { approved_at: "desc" },
      }),
      prisma.outreachOrgPitch.count({
        where: {
          OR: [
            { status: "draft" },
            { status: "approved" },
            { status: "sent", sent_at: { gte: todayStart } },
          ],
        },
      }),
      // sent counts per cohort (all time)
      prisma.outreachOrgPitch.findMany({
        where: { status: "sent" },
        select: { organization: { select: { organization_type: true } } },
      }),
      // replied counts per cohort (all time)
      prisma.outreachOrgPitch.findMany({
        where: { replied_at: { not: null } },
        select: { organization: { select: { organization_type: true } } },
      }),
      // draft counts per cohort
      prisma.outreachOrgPitch.findMany({
        where: { status: "draft" },
        select: { organization: { select: { organization_type: true } } },
      }),
      // approved counts per cohort
      prisma.outreachOrgPitch.findMany({
        where: { status: "approved" },
        select: { organization: { select: { organization_type: true } } },
      }),
    ]);

  const dailyBudgetRemaining = Math.max(0, dailyLimit - alreadyInPipeline);

  // Build cohort stats
  function countByCohort(rows: { organization: { organization_type: string | null } }[]) {
    const map: Record<string, number> = {};
    for (const r of rows) {
      const t = r.organization.organization_type ?? "other";
      map[t] = (map[t] ?? 0) + 1;
    }
    return map;
  }

  const sentMap = countByCohort(sentByCohort);
  const repliedMap = countByCohort(repliedByCohort);
  const draftMap = countByCohort(draftByCohort);
  const approvedMap = countByCohort(approvedByCohort);

  const allCohorts = new Set([
    ...Object.keys(sentMap),
    ...Object.keys(draftMap),
    ...Object.keys(approvedMap),
  ]);

  const cohortStats: CohortStat[] = Array.from(allCohorts)
    .map((cohort) => ({
      cohort,
      sent: sentMap[cohort] ?? 0,
      replied: repliedMap[cohort] ?? 0,
      draft: draftMap[cohort] ?? 0,
      approved: approvedMap[cohort] ?? 0,
    }))
    .sort((a, b) => b.sent - a.sent || a.cohort.localeCompare(b.cohort));

  const draftCards = drafts.map(toPitchCard).sort((a, b) => b.score - a.score);
  const approvedCards = approvedPitches.map(toPitchCard).sort((a, b) => b.score - a.score);

  // Summary stats
  const totalSent = Object.values(sentMap).reduce((a, b) => a + b, 0);
  const totalReplied = Object.values(repliedMap).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Pitch Queue</h1>
        <p className="text-sm text-muted-foreground">
          Review drafts → Approve → Daily cron sends at rate of {dailyLimit}/day
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Needs review", value: drafts.length },
          { label: "Approved / queued", value: approvedPitches.length },
          { label: "Sent (all time)", value: totalSent },
          { label: "Replied (all time)", value: totalReplied },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{value.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <AdminOrgPitchQueue
        draftPitches={draftCards}
        approvedPitches={approvedCards}
        cohortStats={cohortStats}
        dailyBudgetRemaining={dailyBudgetRemaining}
      />
    </div>
  );
}
