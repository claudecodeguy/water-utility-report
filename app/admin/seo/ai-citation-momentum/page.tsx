import type { Metadata } from "next";
import { AI_CITATION_DATA, AI_STATS, CANARY_ALLOWLIST, PROTECTED_PAGES, CANARY_REPORT_DATE } from "@/lib/seo/canary-data";

export const metadata: Metadata = {
  title: "AI Citation Momentum — Admin",
  robots: { index: false, follow: false },
};

function rollingAvg(data: typeof AI_CITATION_DATA, key: "citations" | "citedPages", window = 7) {
  return data.slice(-window).reduce((s, d) => s + d[key], 0) / window;
}

// Week-over-week growth
const weeks: { label: string; citations: number; citedPages: number }[] = [];
for (let i = 0; i + 7 <= AI_CITATION_DATA.length; i += 7) {
  const slice = AI_CITATION_DATA.slice(i, i + 7);
  weeks.push({
    label: `${slice[0].date.slice(5)} – ${slice[slice.length - 1].date.slice(5)}`,
    citations: slice.reduce((s, d) => s + d.citations, 0),
    citedPages: slice.reduce((s, d) => s + d.citedPages, 0),
  });
}

// Pages that are both protected AND likely to receive citations (high-content pages)
const highPriorityCitationProtected = PROTECTED_PAGES.filter((p) =>
  p.url.startsWith("/utilities/") || p.url.startsWith("/cities/") || p.url.startsWith("/learn/")
);

// Canary pages that overlap with organic winners (impressions > 500)
const highImpCanary = CANARY_ALLOWLIST.filter((p) => p.impressions >= 500);

const peak = AI_CITATION_DATA.reduce((max, d) => d.citations > max.citations ? d : max, AI_CITATION_DATA[0]);

export default function AiCitationMomentumPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">AI Citation Momentum</h1>
        <p className="text-sm text-muted-foreground">
          Source: Bing AI Performance &nbsp;·&nbsp; {AI_CITATION_DATA[0].date} to {AI_CITATION_DATA[AI_CITATION_DATA.length - 1].date} &nbsp;·&nbsp; Updated: {CANARY_REPORT_DATE}
        </p>
      </div>

      {/* Key stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total citations", value: AI_STATS.totalCitations.toLocaleString() },
          { label: "Total cited pages", value: AI_STATS.totalCitedPages.toLocaleString() },
          { label: "7-day avg citations", value: AI_STATS.rollingAvg7dCitations.toFixed(1) },
          { label: "7-day avg cited pages", value: AI_STATS.rollingAvg7dCitedPages.toFixed(1) },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Growth banner */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 space-y-1">
        <p className="font-semibold text-emerald-800">
          Citations growing +{AI_STATS.growthTrendCitations.toFixed(0)}/day avg vs. first week
        </p>
        <p className="text-sm text-emerald-700">
          Peak: {peak.citations} citations on {peak.date} across {peak.citedPages} pages. The site is accelerating into Bing AI — protect this momentum by not rewriting pages that are being cited.
        </p>
      </div>

      {/* Weekly trend table */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">Weekly Citation Trend</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
              <th className="text-left px-5 py-2.5 font-medium">Week</th>
              <th className="text-right px-3 py-2.5 font-medium">Citations</th>
              <th className="text-right px-5 py-2.5 font-medium">Cited pages</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {weeks.map((w, i) => (
              <tr key={w.label} className="hover:bg-muted/20">
                <td className="px-5 py-2.5 text-muted-foreground tabular-nums">{w.label}</td>
                <td className="text-right px-3 py-2.5 tabular-nums font-medium">{w.citations}</td>
                <td className="text-right px-5 py-2.5 tabular-nums text-muted-foreground">{w.citedPages}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Daily log */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">Daily Log</h2>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white border-b border-border">
              <tr className="text-xs text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-5 py-2 font-medium">Date</th>
                <th className="text-right px-3 py-2 font-medium">Citations</th>
                <th className="text-right px-5 py-2 font-medium">Cited pages</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[...AI_CITATION_DATA].reverse().map((d) => (
                <tr key={d.date} className={`hover:bg-muted/20 ${d.citations === peak.citations ? "bg-emerald-50" : ""}`}>
                  <td className="px-5 py-2 text-muted-foreground tabular-nums">{d.date}</td>
                  <td className={`text-right px-3 py-2 tabular-nums font-medium ${d.citations > 30 ? "text-emerald-700" : ""}`}>
                    {d.citations}{d.citations === peak.citations ? " 🏆" : ""}
                  </td>
                  <td className="text-right px-5 py-2 tabular-nums text-muted-foreground">{d.citedPages}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High-impression canary pages to monitor */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">Canary Pages Overlapping With High Organic Impressions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">These pages have both canary overrides applied AND high Google impression counts — most likely to receive AI citations next.</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
              <th className="text-left px-5 py-2.5 font-medium">URL</th>
              <th className="text-right px-3 py-2.5 font-medium">Impressions</th>
              <th className="text-right px-3 py-2.5 font-medium">Avg pos</th>
              <th className="text-left px-5 py-2.5 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {highImpCanary.map((p) => (
              <tr key={p.url} className="hover:bg-muted/20">
                <td className="px-5 py-2.5 font-mono text-xs">{p.url}</td>
                <td className="text-right px-3 py-2.5 tabular-nums font-medium">{p.impressions.toLocaleString()}</td>
                <td className="text-right px-3 py-2.5 tabular-nums text-muted-foreground">{p.avgPosition.toFixed(1)}</td>
                <td className="px-5 py-2.5">
                  {p.alreadyInOverrides ? (
                    <span className="text-xs text-emerald-700 font-medium">Override active</span>
                  ) : p.canaryEligible ? (
                    <span className="text-xs text-blue-700 font-medium">Override applied this phase</span>
                  ) : (
                    <span className="text-xs text-amber-700">Deferred</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Protected citation-likely pages */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-red-50">
          <h2 className="font-semibold text-sm text-red-800">Protected Pages — Citation Authority Assets</h2>
          <p className="text-xs text-red-700 mt-0.5">These pages are already receiving organic clicks and likely contributing to AI citations. Do not rewrite content, metadata, or structure.</p>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wide">
              <th className="text-left px-5 py-2.5 font-medium">URL</th>
              <th className="text-right px-3 py-2.5 font-medium">Clicks</th>
              <th className="text-left px-5 py-2.5 font-medium">Protection reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {highPriorityCitationProtected.slice(0, 10).map((p) => (
              <tr key={p.url} className="hover:bg-muted/20">
                <td className="px-5 py-2.5 font-mono text-xs">{p.url}</td>
                <td className="text-right px-3 py-2.5 tabular-nums font-medium">{p.clicks > 0 ? p.clicks : "—"}</td>
                <td className="px-5 py-2.5 text-xs text-muted-foreground">{p.protectedReason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Guidance */}
      <div className="rounded-xl border border-border bg-white p-5 space-y-3">
        <h2 className="font-semibold text-sm text-foreground">Citation Strategy Guidance</h2>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2"><span className="shrink-0 text-emerald-600">✓</span> Treat AI citations as authority signals — they precede organic ranking improvements.</li>
          <li className="flex gap-2"><span className="shrink-0 text-emerald-600">✓</span> Pages receiving citations should be protected from unnecessary rewrites.</li>
          <li className="flex gap-2"><span className="shrink-0 text-emerald-600">✓</span> The Official Records Preview module (CanaryAnswerModule) surfaces structured facts that AI models prefer to cite.</li>
          <li className="flex gap-2"><span className="shrink-0 text-amber-500">⚠</span> Do not optimize for AI referral traffic only — citations are a means to organic authority, not an end.</li>
          <li className="flex gap-2"><span className="shrink-0 text-amber-500">⚠</span> If citation growth slows, check whether any canary pages were reverted or had content changed.</li>
          <li className="flex gap-2"><span className="shrink-0 text-red-500">✗</span> Never add alarmist language to boost AI pickup — it violates the water-safety rule and risks snippet quality issues.</li>
        </ul>
      </div>
    </div>
  );
}
