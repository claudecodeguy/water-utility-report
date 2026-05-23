import { prisma } from "@/lib/prisma";
import OutreachTabNav from "@/components/outreach-tab-nav";
import AdminOrgPitchQueue from "@/components/admin-org-pitch-queue";
import type { OrgPitchCardData } from "@/components/admin-org-pitch-card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Org Pitch Queue — Admin",
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

export default async function OrgPitchQueuePage() {
  const now = new Date();
  const cutoff7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const cutoff30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);

  const dailyLimit = parseInt(process.env.OUTREACH_ORG_DAILY_LIMIT || "30", 10);

  const [drafts, sentCount, repliesCount, backlinksCount, alreadyInPipeline] = await Promise.all([
    prisma.outreachOrgPitch.findMany({
      where: { status: "draft" },
      include: {
        organization: {
          select: {
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
          },
        },
      },
      orderBy: { draft_created_at: "desc" },
    }),
    prisma.outreachOrgPitch.count({ where: { status: "sent", sent_at: { gte: cutoff7d } } }),
    prisma.outreachOrgPitch.count({ where: { replied_at: { gte: cutoff7d } } }),
    prisma.outreachOrgPitch.count({ where: { backlink_found: true, sent_at: { gte: cutoff30d } } }),
    prisma.outreachOrgPitch.count({
      where: {
        OR: [
          { status: "draft" },
          { status: "sent", sent_at: { gte: todayStart } },
        ],
      },
    }),
  ]);

  const dailyBudgetRemaining = Math.max(0, dailyLimit - alreadyInPipeline);

  const pitchCards: OrgPitchCardData[] = drafts
    .map((p) => ({
      id: p.id,
      subject: p.subject,
      body: p.body,
      personalization_note: p.personalization_note,
      page_url: p.page_url,
      page_type: p.page_type,
      state_abbreviation: p.state_abbreviation,
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
    }))
    .sort((a, b) => b.score - a.score);

  const stats = [
    { label: "Drafts pending",  value: drafts.length.toLocaleString() },
    { label: "Sent (7d)",       value: sentCount.toLocaleString() },
    { label: "Replies (7d)",    value: repliesCount.toLocaleString() },
    { label: "Backlinks (30d)", value: backlinksCount.toLocaleString() },
    { label: "Budget remaining",value: dailyBudgetRemaining.toLocaleString() },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Org Pitch Queue</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve org outreach drafts before sending
        </p>
      </div>
      <OutreachTabNav />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Queue (client component handles filters + interactions) */}
      <AdminOrgPitchQueue
        initialPitches={pitchCards}
        dailyBudgetRemaining={dailyBudgetRemaining}
      />
    </div>
  );
}
