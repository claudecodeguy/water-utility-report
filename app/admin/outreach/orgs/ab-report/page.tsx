import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "A/B Backlink Report — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function pct(num: number, den: number) {
  if (den === 0) return "—";
  return `${((num / den) * 100).toFixed(1)}%`;
}

function lift(rateA: number, rateB: number) {
  if (rateB === 0) return rateA > 0 ? "∞" : "—";
  const l = ((rateA - rateB) / rateB) * 100;
  const sign = l > 0 ? "+" : "";
  return `${sign}${l.toFixed(0)}%`;
}

function liftColor(rateA: number, rateB: number) {
  if (rateA > rateB) return "text-emerald-600";
  if (rateA < rateB) return "text-red-500";
  return "text-muted-foreground";
}

const COHORT_LABELS: Record<string, string> = {
  nonprofit: "Nonprofit",
  extension: "Extension",
  health_dept: "Health Dept",
  research: "Research",
  advocacy: "Advocacy",
  other: "Other",
};

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function AbReportPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [allPitches, recentPitches] = await Promise.all([
    prisma.outreachOrgPitch.findMany({
      where: { ab_variant: { in: ["A", "B"] } },
      select: {
        id: true,
        ab_variant: true,
        status: true,
        replied_at: true,
        backlink_found: true,
        sent_at: true,
        state_abbreviation: true,
        organization: {
          select: { organization_type: true },
        },
      },
    }),
    prisma.outreachOrgPitch.findMany({
      where: {
        ab_variant: { in: ["A", "B"] },
        sent_at: { gte: thirtyDaysAgo },
      },
      orderBy: { sent_at: "desc" },
      take: 50,
      select: {
        id: true,
        ab_variant: true,
        status: true,
        subject: true,
        sent_at: true,
        replied_at: true,
        backlink_found: true,
        published_url: true,
        state_abbreviation: true,
        organization: {
          select: { name: true, organization_type: true },
        },
      },
    }),
  ]);

  // ── Top-level A vs B stats ─────────────────────────────────────────────────
  const stats = { A: { sent: 0, replied: 0, backlinks: 0 }, B: { sent: 0, replied: 0, backlinks: 0 } };

  for (const p of allPitches) {
    const v = p.ab_variant as "A" | "B";
    if (p.status === "sent" || p.status === "replied" || p.status === "published") {
      stats[v].sent++;
      if (p.replied_at) stats[v].replied++;
      if (p.backlink_found) stats[v].backlinks++;
    }
  }

  const rateA_reply = stats.A.sent > 0 ? stats.A.replied / stats.A.sent : 0;
  const rateB_reply = stats.B.sent > 0 ? stats.B.replied / stats.B.sent : 0;
  const rateA_link = stats.A.sent > 0 ? stats.A.backlinks / stats.A.sent : 0;
  const rateB_link = stats.B.sent > 0 ? stats.B.backlinks / stats.B.sent : 0;

  // ── By org type ────────────────────────────────────────────────────────────
  const byType: Record<string, { A: { sent: number; replied: number; backlinks: number }; B: { sent: number; replied: number; backlinks: number } }> = {};

  for (const p of allPitches) {
    if (!["sent", "replied", "published"].includes(p.status)) continue;
    const v = p.ab_variant as "A" | "B";
    const t = p.organization.organization_type ?? "other";
    if (!byType[t]) byType[t] = { A: { sent: 0, replied: 0, backlinks: 0 }, B: { sent: 0, replied: 0, backlinks: 0 } };
    byType[t][v].sent++;
    if (p.replied_at) byType[t][v].replied++;
    if (p.backlink_found) byType[t][v].backlinks++;
  }

  const cohorts = Object.entries(byType).sort((a, b) => (b[1].A.sent + b[1].B.sent) - (a[1].A.sent + a[1].B.sent));

  // ── By state (top 10 by volume) ────────────────────────────────────────────
  const byState: Record<string, { A: { sent: number; backlinks: number }; B: { sent: number; backlinks: number } }> = {};

  for (const p of allPitches) {
    if (!["sent", "replied", "published"].includes(p.status)) continue;
    const v = p.ab_variant as "A" | "B";
    const s = p.state_abbreviation ?? "NAT";
    if (!byState[s]) byState[s] = { A: { sent: 0, backlinks: 0 }, B: { sent: 0, backlinks: 0 } };
    byState[s][v].sent++;
    if (p.backlink_found) byState[s][v].backlinks++;
  }

  const topStates = Object.entries(byState)
    .sort((a, b) => (b[1].A.sent + b[1].B.sent) - (a[1].A.sent + a[1].B.sent))
    .slice(0, 10);

  // ── Winner determination ───────────────────────────────────────────────────
  const minSentForConclusion = 30;
  let winner: "A" | "B" | null = null;
  let winnerMetric = "";
  if (stats.A.sent >= minSentForConclusion && stats.B.sent >= minSentForConclusion) {
    if (rateA_link > rateB_link * 1.1) { winner = "A"; winnerMetric = "backlink rate"; }
    else if (rateB_link > rateA_link * 1.1) { winner = "B"; winnerMetric = "backlink rate"; }
    else if (rateA_reply > rateB_reply * 1.15) { winner = "A"; winnerMetric = "reply rate"; }
    else if (rateB_reply > rateA_reply * 1.15) { winner = "B"; winnerMetric = "reply rate"; }
  }

  const totalSent = stats.A.sent + stats.B.sent;
  const needed = Math.max(0, minSentForConclusion - Math.min(stats.A.sent, stats.B.sent));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">A/B Backlink Report</h1>
        <p className="text-sm text-muted-foreground">
          Variant A = explicit resource-page ask &nbsp;·&nbsp; Variant B = peer-share soft ask
        </p>
      </div>

      {/* Winner banner */}
      {winner ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-center gap-3">
          <span className="text-2xl">🏆</span>
          <div>
            <p className="font-semibold text-emerald-800">Variant {winner} is winning on {winnerMetric}</p>
            <p className="text-sm text-emerald-700">10%+ lift over the other variant with {totalSent} sends. Consider pausing the losing variant.</p>
          </div>
        </div>
      ) : totalSent > 0 ? (
        <div className="rounded-xl border border-border bg-muted/40 px-5 py-3 text-sm text-muted-foreground">
          {needed > 0
            ? `Need ${needed} more sends per variant for a conclusion (currently A: ${stats.A.sent}, B: ${stats.B.sent}).`
            : "Both variants have sufficient data — no clear winner yet (lift under 10%)."}
        </div>
      ) : null}

      {/* Top-level comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(["A", "B"] as const).map((v) => {
          const s = stats[v];
          const replyRate = v === "A" ? rateA_reply : rateB_reply;
          const linkRate = v === "A" ? rateA_link : rateB_link;
          const otherReply = v === "A" ? rateB_reply : rateA_reply;
          const otherLink = v === "A" ? rateB_link : rateA_link;
          return (
            <div key={v} className="rounded-xl border border-border bg-white p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v === "A" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
                  Variant {v}
                </span>
                <span className="text-xs text-muted-foreground">
                  {v === "A" ? "Explicit resource-page ask" : "Peer-share soft ask"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{s.sent}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Sent</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{s.replied}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Replied</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold tabular-nums">{s.backlinks}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Backlinks</p>
                </div>
              </div>
              <div className="border-t border-border pt-3 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Reply rate</p>
                  <p className="text-lg font-semibold">{pct(s.replied, s.sent)}</p>
                  <p className={`text-xs font-medium ${liftColor(replyRate, otherReply)}`}>
                    {lift(replyRate, otherReply)} vs {v === "A" ? "B" : "A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Backlink rate</p>
                  <p className="text-lg font-semibold">{pct(s.backlinks, s.sent)}</p>
                  <p className={`text-xs font-medium ${liftColor(linkRate, otherLink)}`}>
                    {lift(linkRate, otherLink)} vs {v === "A" ? "B" : "A"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* By org type */}
      {cohorts.length > 0 && (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="font-semibold text-sm text-foreground">By Organization Type</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-5 py-2.5 font-medium">Type</th>
                  <th className="text-right px-3 py-2.5 font-medium">A sent</th>
                  <th className="text-right px-3 py-2.5 font-medium">A links</th>
                  <th className="text-right px-3 py-2.5 font-medium">A rate</th>
                  <th className="text-right px-3 py-2.5 font-medium">B sent</th>
                  <th className="text-right px-3 py-2.5 font-medium">B links</th>
                  <th className="text-right px-3 py-2.5 font-medium">B rate</th>
                  <th className="text-right px-5 py-2.5 font-medium">Lift (A vs B)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cohorts.map(([type, data]) => {
                  const rA = data.A.sent > 0 ? data.A.backlinks / data.A.sent : 0;
                  const rB = data.B.sent > 0 ? data.B.backlinks / data.B.sent : 0;
                  return (
                    <tr key={type} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-2.5 font-medium text-foreground">{COHORT_LABELS[type] ?? type}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums text-muted-foreground">{data.A.sent}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums">{data.A.backlinks}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums font-medium">{pct(data.A.backlinks, data.A.sent)}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums text-muted-foreground">{data.B.sent}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums">{data.B.backlinks}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums font-medium">{pct(data.B.backlinks, data.B.sent)}</td>
                      <td className={`text-right px-5 py-2.5 font-semibold ${liftColor(rA, rB)}`}>
                        {lift(rA, rB)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* By state */}
      {topStates.length > 0 && (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <h2 className="font-semibold text-sm text-foreground">By State (top 10 by volume)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-5 py-2.5 font-medium">State</th>
                  <th className="text-right px-3 py-2.5 font-medium">A sent</th>
                  <th className="text-right px-3 py-2.5 font-medium">A links</th>
                  <th className="text-right px-3 py-2.5 font-medium">B sent</th>
                  <th className="text-right px-3 py-2.5 font-medium">B links</th>
                  <th className="text-right px-5 py-2.5 font-medium">Lift (A vs B)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {topStates.map(([state, data]) => {
                  const rA = data.A.sent > 0 ? data.A.backlinks / data.A.sent : 0;
                  const rB = data.B.sent > 0 ? data.B.backlinks / data.B.sent : 0;
                  return (
                    <tr key={state} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-2.5 font-medium">{state === "NAT" ? "National" : state}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums text-muted-foreground">{data.A.sent}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums">{data.A.backlinks}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums text-muted-foreground">{data.B.sent}</td>
                      <td className="text-right px-3 py-2.5 tabular-nums">{data.B.backlinks}</td>
                      <td className={`text-right px-5 py-2.5 font-semibold ${liftColor(rA, rB)}`}>
                        {lift(rA, rB)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent 30 days */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border flex items-center justify-between">
          <h2 className="font-semibold text-sm text-foreground">Recent Sends (last 30 days)</h2>
          <span className="text-xs text-muted-foreground">{recentPitches.length} emails</span>
        </div>
        {recentPitches.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground text-center">No A/B sends in the last 30 days yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-5 py-2.5 font-medium">Date</th>
                  <th className="text-left px-3 py-2.5 font-medium">Organization</th>
                  <th className="text-left px-3 py-2.5 font-medium">State</th>
                  <th className="text-center px-3 py-2.5 font-medium">Variant</th>
                  <th className="text-center px-3 py-2.5 font-medium">Replied</th>
                  <th className="text-center px-5 py-2.5 font-medium">Backlink</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentPitches.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-2 text-muted-foreground tabular-nums whitespace-nowrap">
                      {p.sent_at ? new Date(p.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </td>
                    <td className="px-3 py-2 max-w-[200px] truncate">
                      <span className="font-medium text-foreground">{p.organization.name}</span>
                      <span className="ml-1.5 text-xs text-muted-foreground">{p.organization.organization_type ?? ""}</span>
                    </td>
                    <td className="px-3 py-2 text-muted-foreground">{p.state_abbreviation ?? "—"}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${p.ab_variant === "A" ? "bg-blue-100 text-blue-700" : "bg-violet-100 text-violet-700"}`}>
                        {p.ab_variant}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      {p.replied_at ? (
                        <span className="text-emerald-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-2 text-center">
                      {p.backlink_found ? (
                        <a href={p.published_url ?? "#"} target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-medium hover:underline">
                          ✓
                        </a>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
