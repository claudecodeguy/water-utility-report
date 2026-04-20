import Link from "next/link";
import { ArrowLeft, ShieldCheck, ExternalLink, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PFAS Watchlist Methodology — Water Utility Report",
  description:
    "How the PFAS Watchlist sources, validates, and displays official government PFAS drinking water records. What we will never infer or claim.",
};

const allowedSources = [
  {
    name: "EPA UCMR 5",
    full: "EPA Unregulated Contaminant Monitoring Rule 5 Occurrence Data",
    url: "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5",
    use: "Primary PFAS monitoring data source. Used for all displayed PFAS occurrence records.",
    cadence: "Published by EPA; updated as EPA releases final occurrence data.",
  },
  {
    name: "EPA SDWIS",
    full: "EPA Safe Drinking Water Information System",
    url: "https://www.epa.gov/enviro/sdwis-search",
    use: "Canonical utility registry. Used to match PWSID to utility name, location, and system type.",
    cadence: "Ingested quarterly.",
  },
  {
    name: "EPA ECHO",
    full: "EPA Enforcement and Compliance History Online",
    url: "https://echo.epa.gov",
    use: "Supplemental official enforcement context where available.",
    cadence: "Referenced by direct link; not bulk-ingested.",
  },
];

const allowedLanguage = [
  "Official PFAS record",
  "Official detection",
  "Official non-detect",
  "Official monitoring result",
  "Official enforcement context",
  "No qualifying official PFAS record located",
];

const forbiddenLanguage = [
  "Safe",
  "Unsafe",
  "Toxic",
  "Dangerous",
  "Failed",
  "Contaminated",
  "Poisoned",
  "Risk score (PFAS-specific)",
  "Contamination level",
  "Exceeds safe limit (unless exact source wording)",
];

const validationSteps = [
  "Official government source validation — source URL resolves to a .gov or official EPA endpoint",
  "Schema validation — all required fields present and correctly typed",
  "Utility linkage validation — PWSID resolves to a known public water system in SDWIS",
  "Date validation — sample date is within UCMR 5 monitoring window (2023–2025)",
  "Unit preservation — result unit matches source exactly (no conversion without documentation)",
  "Key-field completeness — analyte code, result value, detection flag, and source URL all present",
];

export default function PfasMethodologyPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── HEADER ── */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/pfas-watchlist" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              PFAS Watchlist
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/60">Methodology</span>
          </div>
          <h1 className="font-display text-4xl text-white mb-3">PFAS Watchlist Methodology</h1>
          <p className="text-white/60 max-w-2xl">
            How this watchlist sources, validates, and presents official PFAS drinking water records —
            and what it will never claim or infer.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Core principles */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-6">Core Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Official government data only",
                desc: "Every displayed record comes from EPA UCMR 5, EPA SDWIS, EPA ECHO, or another official government dataset with a stable .gov URL.",
              },
              {
                title: "No risk scoring",
                desc: "This system generates no PFAS risk score, safety label, or contamination rating. Only official source data is displayed.",
              },
              {
                title: "No compliance inference",
                desc: "UCMR 5 monitoring results are presented as monitoring data only. This system never determines whether a result constitutes a regulatory violation.",
              },
              {
                title: "No safe/unsafe labels",
                desc: "Words like 'safe,' 'unsafe,' 'contaminated,' or 'dangerous' are never applied by this system unless they appear verbatim in a cited official source.",
              },
              {
                title: "Missing ≠ absent",
                desc: "Absence of a record means no qualifying official record was located. It does not establish that PFAS are absent from that system's water.",
              },
              {
                title: "Full provenance",
                desc: "Every record shows its source dataset, source URL, and retrieval date. Raw source payloads are retained for audit.",
              },
            ].map((p) => (
              <div key={p.title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <ShieldCheck className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{p.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Allowed sources */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-6">Allowed Data Sources</h2>
          <div className="space-y-4">
            {allowedSources.map((s) => (
              <div key={s.name} className="rounded-lg border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.full}</p>
                  </div>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline shrink-0"
                  >
                    Source <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{s.use}</p>
                <p className="text-xs text-muted-foreground font-mono">Refresh: {s.cadence}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-lg border border-border bg-secondary/30 p-4">
            <p className="text-sm font-semibold text-foreground mb-2">Disallowed sources</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              This watchlist never uses commercial databases, NGOs, news stories, utility marketing pages,
              crowdsourced data, university summaries unless republished by a government source,
              or modeled/inferred contamination risk data unless published by a government authority
              and clearly labeled as such.
            </p>
          </div>
        </section>

        {/* Language rules */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-6">Language Rules</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                Allowed output language
              </h3>
              <ul className="space-y-2">
                {allowedLanguage.map((l) => (
                  <li key={l} className="flex items-center gap-2 text-sm text-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-safe shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <XCircle className="w-4 h-4 text-wur-danger" />
                Forbidden output language
              </h3>
              <ul className="space-y-2">
                {forbiddenLanguage.map((l) => (
                  <li key={l} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-danger shrink-0" />
                    {l}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Validation */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Record Validation</h2>
          <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
            Every PFAS record must pass all of the following validations before it is published.
            Records that fail any check are not displayed and are queued for review.
          </p>
          <div className="space-y-3">
            {validationSteps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card">
                <span className="text-xs font-mono font-bold text-wur-teal shrink-0 w-5 text-right">{i + 1}.</span>
                <p className="text-sm text-foreground">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* UCMR 5 specific */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">UCMR 5 Interpretation Rules</h2>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-3 text-sm text-amber-900">
                <p>
                  <strong>UCMR 5 is monitoring data, not compliance data.</strong> EPA required public
                  water systems to monitor for PFAS under UCMR 5 to gather occurrence data.
                  A result — whether a detection or non-detect — is a monitoring result, not a
                  compliance determination.
                </p>
                <p>
                  <strong>The EPA PFAS MCL rule</strong> (finalized April 2024) sets enforceable limits
                  for PFOA, PFOS, PFNA, PFHxS, HFPO-DA, and a PFAS mixture. Where this watchlist shows
                  a result alongside an EPA MCL, that comparison is informational only — this system does
                  not determine whether any system is in compliance or violation.
                </p>
                <p>
                  <strong>Detection flag semantics:</strong> "Detected above MRL" means the result
                  exceeded the minimum reporting limit. "Not Detected above MRL" means the result was
                  below the MRL. Both are presented exactly as reported in the UCMR 5 dataset.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data freshness */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Data Freshness</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Each record displays its <strong className="text-foreground">source retrieval date</strong> —
            the date this system last fetched the record from the official source.
            Each page also shows the source publication/update date where EPA provides it.
            This system is not responsible for delays in EPA data releases.
          </p>
        </section>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Link
            href="/pfas-watchlist"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-wur-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            PFAS Watchlist
          </Link>
          <Link href="/pfas-watchlist/sources" className="text-sm text-wur-teal hover:underline">
            View data sources →
          </Link>
        </div>
      </div>
    </div>
  );
}
