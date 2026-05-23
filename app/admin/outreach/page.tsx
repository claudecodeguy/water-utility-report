import { prisma } from "@/lib/prisma";
import AdminPitchCard from "@/components/admin-pitch-card";
import AdminPipelineRunner from "@/components/admin-pipeline-runner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Outreach — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminOutreachPage() {
  const now = new Date();
  const cutoff7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const cutoff30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [draftPitches, sentCount, repliesCount, backlinksCount] = await Promise.all([
    prisma.outreachPitch.findMany({
      where: { status: "draft" },
      orderBy: { story: { newsworthiness_score: "desc" } },
      include: {
        story: {
          include: {
            signal: {
              include: { utility: true },
            },
          },
        },
        journalist: true,
      },
    }),
    prisma.outreachPitch.count({
      where: { status: "sent", sent_at: { gte: cutoff7d } },
    }),
    prisma.outreachPitch.count({
      where: { replied_at: { gte: cutoff7d } },
    }),
    prisma.outreachPitch.count({
      where: { backlink_found: true, sent_at: { gte: cutoff30d } },
    }),
  ]);

  const cards = draftPitches.map((p) => ({
    id: p.id,
    subject: p.subject,
    body: p.body,
    personalization_note: p.personalization_note,
    story: {
      newsworthiness_score: p.story.newsworthiness_score,
      primary_angle: p.story.primary_angle,
      key_stat: p.story.key_stat,
      signal: {
        state: p.story.signal.state,
        contaminant: p.story.signal.contaminant,
      },
    },
    journalist: {
      name: p.journalist.name,
      outlet: p.journalist.outlet,
      beat: p.journalist.beat,
      state: p.journalist.state,
      pickup_count: p.journalist.pickup_count,
    },
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">Outreach</h1>
          <p className="text-sm text-muted-foreground">
            Review and approve AI-drafted pitches before sending
          </p>
        </div>
        <AdminPipelineRunner />
      </div>

      {/* Stat strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Drafts pending", value: draftPitches.length.toLocaleString() },
          { label: "Sent (7d)", value: sentCount.toLocaleString() },
          { label: "Replies (7d)", value: repliesCount.toLocaleString() },
          { label: "Backlinks (30d)", value: backlinksCount.toLocaleString() },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Pitch cards */}
      {cards.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center text-sm text-muted-foreground">
          No draft pitches. Run the pipeline to generate new drafts.
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((card) => (
            <AdminPitchCard key={card.id} pitch={card} />
          ))}
        </div>
      )}
    </div>
  );
}
