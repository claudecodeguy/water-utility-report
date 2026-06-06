import type { Metadata } from "next";
import {
  CANARY_ALLOWLIST,
  PROTECTED_PAGES,
  TOP_ZERO_CLICK_QUERIES,
  TRAFFIC_SUMMARY,
  CANARY_REPORT_DATE,
  REPORT_WINDOW,
} from "@/lib/seo/canary-data";

export const metadata: Metadata = {
  title: "SEO Momentum Opportunities — Admin",
  robots: { index: false, follow: false },
};

function pct(n: number) {
  if (n === 0) return "0%";
  return `${(n * 100).toFixed(1)}%`;
}

const INTENT_COLORS: Record<string, string> = {
  "contamination/current issue records": "bg-red-50 text-red-700 border-red-200",
  "contamination/current issue": "bg-red-50 text-red-700 border-red-200",
  "PFAS/UCMR 5 sampling": "bg-violet-50 text-violet-700 border-violet-200",
  "PFAS/UCMR sampling": "bg-violet-50 text-violet-700 border-violet-200",
  "PFAS/UCMR 5 sampling + contamination records": "bg-violet-50 text-violet-700 border-violet-200",
  "PFAS/UCMR 5 sampling + PFAS contamination records": "bg-violet-50 text-violet-700 border-violet-200",
  "PFAS/UCMR 5 sampling records": "bg-violet-50 text-violet-700 border-violet-200",
  "violation history": "bg-amber-50 text-amber-700 border-amber-200",
  "violation history + PFAS sampling records": "bg-amber-50 text-amber-700 border-amber-200",
  "utility/PWSID lookup": "bg-blue-50 text-blue-700 border-blue-200",
  "utility/PWSID lookup + official water quality report": "bg-blue-50 text-blue-700 border-blue-200",
  "utility/PWSID lookup + official records": "bg-blue-50 text-blue-700 border-blue-200",
  "utility/PWSID lookup + official water records": "bg-blue-50 text-blue-700 border-blue-200",
  "PFAS/violation records": "bg-violet-50 text-violet-700 border-violet-200",
  "PFAS updates": "bg-violet-50 text-violet-700 border-violet-200",
  "PFAS updates + utility records": "bg-violet-50 text-violet-700 border-violet-200",
  "testing/labs": "bg-green-50 text-green-700 border-green-200",
  "PFAS/UCMR 5 sampling + official records": "bg-violet-50 text-violet-700 border-violet-200",
  "PFAS/UCMR 5 sampling records — city-level lookup": "bg-violet-50 text-violet-700 border-violet-200",
  "contamination/infrastructure query + utility lookup": "bg-red-50 text-red-700 border-red-200",
};

function intentBadge(intent: string) {
  const cls = INTENT_COLORS[intent] ?? "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${cls}`}>
      {intent}
    </span>
  );
}

const eligible = CANARY_ALLOWLIST.filter((p) => p.canaryEligible);
const deferred = CANARY_ALLOWLIST.filter((p) => !p.canaryEligible);
const alreadyDone = eligible.filter((p) => p.alreadyInOverrides);
const toApply = eligible.filter((p) => !p.alreadyInOverrides);
const totalImpressions = CANARY_ALLOWLIST.reduce((s, p) => s + p.impressions, 0);

export default function MomentumOpportunitiesPage() {
  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <h1 className="font-display text-2xl text-foreground">SEO Momentum Opportunities</h1>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 font-medium">
            Protected Canary
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Report date: {CANARY_REPORT_DATE} &nbsp;·&nbsp; Window: {REPORT_WINDOW} &nbsp;·&nbsp;
          Source: Google Search Console + Bing AI Performance
        </p>
      </div>

      {/* Warning banner */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800 space-y-1">
        <p className="font-semibold">Hard Protection Rules — Do Not Override</p>
        <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-700">
          <li>Do not change URLs, canonicals, H1s, robots/indexing, or sitemap logic.</li>
          <li>Do not rewrite metadata on protected pages (clicks ≥ 3).</li>
          <li>Do not touch homepage, global utility/city templates sitewide.</li>
          <li>Do not use safety language — safe, unsafe, dangerous, contaminated, health risk.</li>
          <li>Canary changes are gated by the allowlist in <code>lib/canary/seo-overrides.ts</code>.</li>
        </ul>
      </div>

      {/* Traffic summary */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Traffic Overview ({REPORT_WINDOW})</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Organic sessions", value: TRAFFIC_SUMMARY.organicSessions.toLocaleString() },
            { label: "Engaged sessions", value: TRAFFIC_SUMMARY.organicEngagedSessions.toLocaleString() },
            { label: "Engagement rate", value: pct(TRAFFIC_SUMMARY.organicEngagementRate) },
            { label: "Key events", value: TRAFFIC_SUMMARY.organicKeyEvents === 0 ? "⚠ 0 — fix needed" : TRAFFIC_SUMMARY.organicKeyEvents.toString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
              <p className="text-xl font-semibold tabular-nums text-foreground">{value}</p>
            </div>
          ))}
        </div>
        {TRAFFIC_SUMMARY.organicKeyEvents === 0 && (
          <p className="mt-2 text-xs text-red-600">
            ⚠ GA4 key events show 0. Conversion tracking is not firing. See Phase 6 fix in <code>lib/analytics.ts</code>.
          </p>
        )}
      </div>

      {/* Canary summary */}
      <div>
        <h2 className="text-sm font-semibold text-foreground mb-3">Canary Allowlist Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total allowlist pages", value: CANARY_ALLOWLIST.length },
            { label: "Eligible (utility/PFAS)", value: eligible.length },
            { label: "Already in overrides", value: alreadyDone.length },
            { label: "This phase — applying", value: toApply.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border bg-white p-4">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
              <p className="text-xl font-semibold tabular-nums text-foreground">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Total impressions at stake: {totalImpressions.toLocaleString()} &nbsp;·&nbsp;
          Deferred (city pages): {deferred.length} — city template canary gating needed before Phase 2
        </p>
      </div>

      {/* Applying this phase */}
      {toApply.length > 0 && (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-emerald-50">
            <h2 className="font-semibold text-sm text-emerald-800">Applying This Phase ({toApply.length} pages)</h2>
            <p className="text-xs text-emerald-700 mt-0.5">Canary overrides added to seo-overrides.ts. No global template changes.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-medium">URL</th>
                  <th className="text-right px-3 py-2.5 font-medium">Imp</th>
                  <th className="text-right px-3 py-2.5 font-medium">Pos</th>
                  <th className="text-left px-3 py-2.5 font-medium">Intent</th>
                  <th className="text-left px-4 py-2.5 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {toApply.map((p) => (
                  <tr key={p.url} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-mono text-[10px] text-foreground whitespace-nowrap">{p.url}</td>
                    <td className="text-right px-3 py-2.5 tabular-nums font-medium">{p.impressions.toLocaleString()}</td>
                    <td className="text-right px-3 py-2.5 tabular-nums text-muted-foreground">{p.avgPosition.toFixed(1)}</td>
                    <td className="px-3 py-2.5">{intentBadge(p.likelyIntent)}</td>
                    <td className="px-4 py-2.5 text-muted-foreground max-w-xs">{p.recommendedAction.split(".")[0]}.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Already done */}
      {alreadyDone.length > 0 && (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-blue-50">
            <h2 className="font-semibold text-sm text-blue-800">Already In Canary Overrides ({alreadyDone.length} pages)</h2>
            <p className="text-xs text-blue-700 mt-0.5">Monitor for CTR improvement. Do not re-apply or overwrite.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-medium">URL</th>
                  <th className="text-right px-3 py-2.5 font-medium">Imp</th>
                  <th className="text-right px-3 py-2.5 font-medium">Pos</th>
                  <th className="text-left px-4 py-2.5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {alreadyDone.map((p) => (
                  <tr key={p.url} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-mono text-[10px]">{p.url}</td>
                    <td className="text-right px-3 py-2.5 tabular-nums font-medium">{p.impressions.toLocaleString()}</td>
                    <td className="text-right px-3 py-2.5 tabular-nums text-muted-foreground">{p.avgPosition.toFixed(1)}</td>
                    <td className="px-4 py-2.5 text-emerald-700 font-medium">Override active — monitoring</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deferred */}
      {deferred.length > 0 && (
        <div className="rounded-xl border border-border bg-white overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-amber-50">
            <h2 className="font-semibold text-sm text-amber-800">Deferred — City Pages ({deferred.length} pages)</h2>
            <p className="text-xs text-amber-700 mt-0.5">City template canary gating required before applying. Phase 2 prerequisite.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wide">
                  <th className="text-left px-4 py-2.5 font-medium">URL</th>
                  <th className="text-right px-3 py-2.5 font-medium">Imp</th>
                  <th className="text-right px-3 py-2.5 font-medium">Pos</th>
                  <th className="text-left px-4 py-2.5 font-medium">Priority note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {deferred.sort((a, b) => b.impressions - a.impressions).map((p) => (
                  <tr key={p.url} className="hover:bg-muted/20">
                    <td className="px-4 py-2.5 font-mono text-[10px]">{p.url}</td>
                    <td className="text-right px-3 py-2.5 tabular-nums font-medium">{p.impressions.toLocaleString()}</td>
                    <td className={`text-right px-3 py-2.5 tabular-nums ${p.avgPosition < 3 ? "text-red-600 font-bold" : "text-muted-foreground"}`}>
                      {p.avgPosition.toFixed(1)}{p.avgPosition < 3 ? " ⚠" : ""}
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{p.eligibilityReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 border-t border-border bg-muted/20">
            <p className="text-xs text-muted-foreground">
              <strong>/cities/mexico-mo</strong> (pos 2.25) and <strong>/cities/watsonville-ca</strong> (pos 3.91) are highest priority deferred pages.
              These need city template canary support before they can receive title/meta or module changes.
            </p>
          </div>
        </div>
      )}

      {/* Top zero-click queries */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="font-semibold text-sm text-foreground">Top Zero-Click Queries (by impressions)</h2>
          <p className="text-xs text-muted-foreground mt-0.5">High-intent queries where Google is already testing the site — canary title/meta must align with these.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium">Query</th>
                <th className="text-right px-3 py-2.5 font-medium">Imp</th>
                <th className="text-right px-3 py-2.5 font-medium">Pos</th>
                <th className="text-left px-4 py-2.5 font-medium">Intent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TOP_ZERO_CLICK_QUERIES.map((q) => (
                <tr key={q.query} className="hover:bg-muted/20">
                  <td className="px-4 py-2 text-foreground max-w-xs">{q.query}</td>
                  <td className="text-right px-3 py-2 tabular-nums font-medium">{q.impressions.toLocaleString()}</td>
                  <td className={`text-right px-3 py-2 tabular-nums ${q.avgPosition <= 3 ? "text-emerald-600 font-bold" : "text-muted-foreground"}`}>
                    {q.avgPosition.toFixed(1)}
                  </td>
                  <td className="px-4 py-2">{intentBadge(q.intent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Protected pages */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-red-50">
          <h2 className="font-semibold text-sm text-red-800">Protected Pages — Do Not Touch ({PROTECTED_PAGES.length})</h2>
          <p className="text-xs text-red-700 mt-0.5">These pages generate organic clicks or are structurally protected. No metadata, content, or template changes permitted.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium">URL</th>
                <th className="text-right px-3 py-2.5 font-medium">Clicks</th>
                <th className="text-left px-4 py-2.5 font-medium">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PROTECTED_PAGES.map((p) => (
                <tr key={p.url} className="hover:bg-muted/20">
                  <td className="px-4 py-2 font-mono text-[10px]">{p.url}</td>
                  <td className="text-right px-3 py-2 tabular-nums font-medium">{p.clicks > 0 ? p.clicks : "—"}</td>
                  <td className="px-4 py-2 text-muted-foreground">{p.protectedReason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rollback triggers */}
      <div className="rounded-xl border border-border bg-white p-5 space-y-3">
        <h2 className="font-semibold text-sm text-foreground">Rollback Triggers (Phase 10)</h2>
        <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
          <li>Canary average position drops materially vs. control pages over 7 days</li>
          <li>Google displays alarming or misleading snippets from canary pages</li>
          <li>Any non-canary, non-allowlisted page is changed</li>
          <li>Any protected page metadata or content is modified</li>
          <li>Water-safety language ("safe", "unsafe", "dangerous", "contaminated") appears in any page</li>
          <li>GA4 key events still show 0 after 48h post-deploy with confirmed user submissions</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          To roll back: revert <code>lib/canary/seo-overrides.ts</code> to the previous commit.
          All canary changes are isolated to that file — no template changes to undo.
        </p>
      </div>
    </div>
  );
}
