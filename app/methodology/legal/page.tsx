import Link from "next/link";
import { ArrowLeft, Shield, AlertTriangle, BookOpen, Scale, CheckCircle2, XCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal & Usage Boundaries — Water Utility Report Methodology",
  description:
    "Detailed discussion of data use rights, acceptable use, citation policy, and legal safeguards for Water Utility Report content and data.",
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Methodology
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Methodology</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Legal & Usage Boundaries
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            How we handle data use rights, what third parties can and can&apos;t do with our
            content, and the legal guardrails built into our publishing process.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Underlying data rights */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Scale className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Underlying Data Rights</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
            The core data used by Water Utility Report is sourced from U.S. federal and state
            government agencies. Federal government works are in the public domain under 17 U.S.C. § 105.
            This means the raw data (utility names, PWSID numbers, violation records, contaminant
            measurements) carries no copyright restriction.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Federal government data is public domain",
                desc: "EPA SDWIS, ECHO, CCR data, and CDC health guidance are not subject to copyright. We do not need a license to republish derived facts from these sources.",
                ok: true,
              },
              {
                title: "State data requires per-state verification",
                desc: "State open data portals operate under varying terms. We verify that each state dataset explicitly allows normalization and derived republication before ingestion.",
                ok: true,
              },
              {
                title: "Third-party databases are off-limits",
                desc: "EWG Tap Water Database, WQA member directory, and NSF certified product datasets are commercially licensed or nonprofit databases. We do not scrape or reproduce these without explicit written permission.",
                ok: false,
              },
              {
                title: "Our original content carries copyright",
                desc: "The summaries, FAQs, framing, and analysis we write are our original creative work. These are not in the public domain — they are copyrighted by Water Utility Report.",
                ok: true,
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-5 rounded-lg border border-border bg-card">
                {item.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-wur-safe mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-wur-danger mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What third parties can do */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <BookOpen className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">What Third Parties Can Do</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                action: "Link to any page on this site",
                permitted: true,
                detail: "No restriction. Deep-linking to utility, contaminant, or state pages is encouraged.",
              },
              {
                action: "Cite individual facts with attribution",
                permitted: true,
                detail: 'Brief factual quotes with attribution (e.g., "According to Water Utility Report...") are acceptable under fair use.',
              },
              {
                action: "Reproduce short excerpts for journalistic or educational purposes",
                permitted: true,
                detail: "Fair use applies. Excerpts must be attributed and not republished in bulk.",
              },
              {
                action: "Bulk-copy page content for republication",
                permitted: false,
                detail: "Reproducing our pages or summaries in bulk — including via AI training dataset collection — is not permitted without a written license.",
              },
              {
                action: "Scrape the site with automated tools",
                permitted: false,
                detail: "Automated scraping at volume is not permitted. robots.txt is enforced. Data needs are better served by our source APIs (EPA SDWIS, ECHO) directly.",
              },
              {
                action: "Use our content in AI training datasets",
                permitted: false,
                detail: "Our original written content (summaries, FAQs, framing) may not be used for AI training without a written license. Source-derived data facts are not restricted by this.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                <div className="shrink-0">
                  {item.permitted ? (
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                  ) : (
                    <XCircle className="w-4 h-4 text-wur-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.action}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{item.detail}</p>
                </div>
                <span className={`text-xs font-semibold shrink-0 ${item.permitted ? "text-wur-safe" : "text-wur-danger"}`}>
                  {item.permitted ? "OK" : "Not permitted"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Health and legal disclaimers */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <AlertTriangle className="w-5 h-5 text-wur-caution" />
            <h2 className="font-display text-2xl text-foreground">Health & Medical Disclaimer</h2>
          </div>
          <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6">
            <p className="text-sm text-wur-caution/90 leading-relaxed mb-4">
              Nothing on Water Utility Report constitutes medical advice, diagnosis, or treatment
              recommendations. Water quality information is presented for informational purposes only.
            </p>
            <ul className="space-y-2 text-sm text-wur-caution/80">
              {[
                "Contaminant presence at or below the EPA MCL is a regulatory determination, not a guarantee of absolute safety — MCLs balance public health with treatment feasibility.",
                "Some contaminants have non-zero MCLGs (maximum contaminant level goals) below their enforced MCL, meaning some health risk may exist at legally compliant levels.",
                "Sensitive populations (infants, pregnant women, immunocompromised individuals) may face higher risk than the general population from contaminants where the MCL was set for average adults.",
                "We do not recommend specific medical tests or treatments. For health concerns related to water quality, consult a licensed healthcare provider.",
                "For formal water testing (legal, regulatory, or real estate purposes), use a state-certified laboratory, not this site.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-wur-caution mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Service area accuracy */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Shield className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Service Area Accuracy</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
            ZIP code → utility matching is modeled from spatial overlap between ZIP code tabulation
            areas (ZCTAs) and utility service area boundaries. This approach has known limitations:
          </p>
          <div className="space-y-3">
            {[
              {
                issue: "ZIP codes and utility service areas don't align perfectly",
                detail: "A single ZIP code may span multiple utility service areas, or one utility may serve parts of many ZIPs. We show the primary match (highest overlap) but flag ambiguous cases.",
              },
              {
                issue: "Service area boundaries are often unavailable or outdated",
                detail: "Many utilities have not published GIS service area boundaries. We model from available data and mark match confidence accordingly. Low-confidence matches display an explicit 'likely match' label.",
              },
              {
                issue: "Your water bill is the authoritative source",
                detail: "For definitive confirmation of your water provider, check your water bill, contact your municipality, or use your utility's own service area checker if available.",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{item.issue}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground mb-2">Legal Questions or Licensing</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For licensing inquiries, data use questions, correction requests, or legal notices,
            please contact us through the information on our{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">
              methodology page
            </Link>
            . We respond to all factual correction requests within 5 business days.
          </p>
        </section>

        {/* Back */}
        <div className="pt-4 border-t border-border flex gap-6">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Methodology
          </Link>
          <Link
            href="/methodology/data-sources"
            className="inline-flex items-center gap-1.5 text-sm text-wur-teal hover:underline"
          >
            ← Data Sources
          </Link>
        </div>
      </div>
    </div>
  );
}
