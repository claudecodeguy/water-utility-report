import Link from "next/link";
import { ArrowRight, Database, Shield, BookOpen, AlertTriangle, CheckCircle2, XCircle, RefreshCw } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Methodology — How Water Utility Report Works",
  description:
    "How Water Utility Report sources, normalizes, and publishes U.S. drinking water data. What we use, what we won't, and how we handle uncertainty.",
};

const allowedSources = [
  { name: "EPA SDWIS (Safe Drinking Water Information System)", desc: "Core utility identity, system IDs, violation records, population served" },
  { name: "EPA ECHO (Enforcement and Compliance History Online)", desc: "Compliance history, enforcement actions, detailed violation data" },
  { name: "Consumer Confidence Reports (CCRs)", desc: "Annual utility-published water quality reports; source of contaminant level data" },
  { name: "EPA Water Quality Portal", desc: "Supporting sampling and monitoring data from federal and state agencies" },
  { name: "State drinking water program datasets", desc: "Where terms permit public use; used for service area and utility detail" },
  { name: "EPA and CDC public guidance documents", desc: "Health-effect interpretations and treatment guidance references" },
  { name: "U.S. Census Bureau", desc: "Population and geography data for service area normalization" },
];

const prohibitedSources = [
  { name: "WQA Member Directory", reason: "Licensed commercial data — requires explicit authorization" },
  { name: "WQA / NSF Certified Product Datasets", reason: "Commercial certification databases — bulk reproduction prohibited" },
  { name: "EWG Tap Water Database content", reason: "Nonprofit competitive database — bulk extraction not permitted" },
  { name: "Competitor or third-party directories", reason: "No bulk scraping, copying, or republication of third-party databases" },
  { name: "Logos, seals, and certification marks", reason: "Third-party trust marks — not reproduced without explicit license" },
];

const confidenceLevels = [
  {
    level: "High",
    color: "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
    desc: "Data sourced directly from EPA SDWIS, ECHO, or utility CCRs with verified ingestion date. Utility identity confirmed against official system ID.",
  },
  {
    level: "Medium",
    color: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
    desc: "Data sourced from state datasets or derived from official data through normalization steps. Core facts verified; some derived fields may carry uncertainty.",
  },
  {
    level: "Low",
    color: "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
    desc: "Data modeled, inferred, or sourced from a third party that has not been fully verified. Flagged for review before publication. Pages with low-confidence data carry explicit warnings.",
  },
];

const pageBuildSteps = [
  { step: "01", title: "Data ingested", desc: "Official datasets downloaded from EPA or state sources. Source URL, ingestion date, and dataset version recorded at row level." },
  { step: "02", title: "Records normalized", desc: "Utility names, system IDs, geographic references, and contaminant names standardized. Duplicate and incomplete records filtered." },
  { step: "03", title: "Draft page generated", desc: "Page templates populated from normalized data. AI-assisted plain-English summaries drafted for human review." },
  { step: "04", title: "Human review", desc: "Reviewer checks factual accuracy, legal compliance flags, internal link logic, and content quality. No page is published directly from automated generation." },
  { step: "05", title: "Approved and published", desc: "Page assigned publish status. Cohort controls allow staged rollout by state, city, or entity group." },
  { step: "06", title: "Refresh cycle", desc: "Annual ingestion refresh. Utilities that publish new CCRs trigger re-review of affected pages." },
];

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Transparency</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Our Methodology
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            How Water Utility Report sources, normalizes, interprets, and publishes U.S. drinking water
            data — and where we draw hard lines on what we will and won&apos;t do.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Core philosophy */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-7">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Core Philosophy</p>
          <p className="text-foreground leading-relaxed text-lg mb-4">
            Water Utility Report is built on a simple premise: the most useful thing we can do is take
            hard-to-navigate official public data and make it genuinely understandable.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We do not manufacture water quality claims. We do not republish third-party commercial
            databases. We do not publish pages that exist only to capture search traffic. Every page
            that goes live must answer a real user question with real, source-backed information.
          </p>
        </section>

        {/* Allowed data sources */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <CheckCircle2 className="w-5 h-5 text-wur-safe" />
            <h2 className="font-display text-2xl text-foreground">What We Use</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Stage 1 uses only official U.S. government datasets and public records where terms
            clearly allow normalization, summarization, and republication of derived facts.
          </p>
          <div className="space-y-3">
            {allowedSources.map((source, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-wur-safe-border bg-wur-safe-bg">
                <CheckCircle2 className="w-4 h-4 text-wur-safe mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{source.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{source.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Prohibited sources */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <XCircle className="w-5 h-5 text-wur-danger" />
            <h2 className="font-display text-2xl text-foreground">What We Won&apos;t Use</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Stage 1 explicitly prohibits the following sources unless written permission or a license is obtained.
          </p>
          <div className="space-y-3">
            {prohibitedSources.map((source, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-wur-danger-border bg-wur-danger-bg">
                <XCircle className="w-4 h-4 text-wur-danger mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{source.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{source.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Page build workflow */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <RefreshCw className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">How Pages Are Built</h2>
          </div>
          <p className="text-muted-foreground mb-7 max-w-2xl">
            No page goes live from an automated pipeline directly to public. Every page goes through a
            review and publish workflow with human checkpoints.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pageBuildSteps.map((step) => (
              <div key={step.step} className="p-5 rounded-xl border border-border bg-card">
                <span className="font-mono text-xs text-wur-teal mb-2 block">{step.step}</span>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Confidence levels */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Shield className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Confidence Levels</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Every data record in our system carries a confidence score. This is shown on pages where
            confidence is less than high, so readers understand the certainty level of the underlying data.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {confidenceLevels.map((level) => (
              <div key={level.level} className="p-5 rounded-xl border border-border bg-card">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border inline-block mb-3 ${level.color}`}>
                  {level.level} Confidence
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">{level.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Legal safeguards */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <AlertTriangle className="w-5 h-5 text-wur-caution" />
            <h2 className="font-display text-2xl text-foreground">Legal Safeguards</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { title: "Likely match disclosure", desc: "Utility-to-address matching is disclosed as 'likely' where service area mapping relies on modeled boundaries. We never claim certainty we don't have." },
              { title: "Regulatory vs. health interpretation", desc: "We clearly separate what regulatory data shows from what health guidance recommends. These are often different — we do not conflate them." },
              { title: "No medical claims", desc: "Water quality information is informational only. We do not make medical, diagnostic, or treatment recommendations beyond linking to official health guidance." },
              { title: "Source-first", desc: "Every factual claim links to or identifies its source. Data without a source attribution is not published on entity pages." },
            ].map((safeguard, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground text-sm mb-2">{safeguard.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{safeguard.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Provenance */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Database className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Data Provenance Standards</h2>
          </div>
          <p className="text-muted-foreground mb-4 max-w-2xl">
            Every ingested record in our system stores the following provenance fields at the row level:
          </p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Field</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["source_type", "Identifies whether data is official, state, derived, or modeled"],
                  ["source_url", "Direct URL to the source document or dataset"],
                  ["ingestion_date", "Date this record was pulled from the source"],
                  ["last_verification_date", "Last date a human or automated check confirmed the record"],
                  ["transform_version", "Which version of our normalization pipeline processed this record"],
                  ["confidence_score", "Numerical confidence score for derived or inferred values"],
                ].map(([field, purpose]) => (
                  <tr key={field} className="hover:bg-muted/20">
                    <td className="py-3 px-4 font-mono text-xs text-foreground">{field}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Site-wide disclaimer */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-wur-teal mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-3">Site-Wide Disclaimer</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Water Utility Report provides informational content derived from official U.S. government
                and public datasets. All content is published for informational purposes only.
              </p>
              <ul className="text-sm text-muted-foreground space-y-1.5 list-none">
                {[
                  "This site is not a substitute for professional water testing by a certified laboratory.",
                  "Utility service area matching is likely but not guaranteed for all addresses — confirm with your utility or water bill.",
                  "Where data is modeled or derived, this is disclosed on the relevant page.",
                  "This site is not a substitute for medical advice. Consult a healthcare provider for health concerns related to water quality.",
                  "Contaminant data reflects the most recent Consumer Confidence Report or regulatory data available to us, which may not reflect real-time conditions.",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-muted-foreground mt-2 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Sub-pages */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">More Methodology Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { href: "/methodology/data-sources", label: "Data Sources", desc: "Full list of ingested datasets with source URLs and update cadences." },
              { href: "/methodology/legal", label: "Legal & Usage Boundaries", desc: "Detailed legal discussion of data use rights, citation, and acceptable use." },
            ].map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="group flex items-start gap-3 p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 transition-all"
              >
                <div className="flex-1">
                  <p className="font-semibold text-foreground group-hover:text-wur-teal transition-colors mb-1">{page.label}</p>
                  <p className="text-sm text-muted-foreground">{page.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal mt-0.5 shrink-0 transition-colors" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
