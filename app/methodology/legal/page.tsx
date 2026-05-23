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
          <p className="text-white/35 text-xs mt-4">Last updated: May 2025</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* No warranty / as-is */}
        <section className="rounded-xl border border-border bg-muted/40 p-6">
          <p className="text-sm text-foreground font-semibold mb-2 uppercase tracking-wide">Disclaimer of Warranties</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This site and all content are provided <strong>&ldquo;as is&rdquo;</strong> and <strong>&ldquo;as available&rdquo;</strong> without warranties of any kind, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or accuracy. Water Utility Report does not warrant that information on this site is complete, current, or free from error. Use of this site is at your own risk.
          </p>
        </section>

        {/* Underlying data rights */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Scale className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Underlying Data Rights</h2>
          </div>
          <p className="text-muted-foreground mb-6 max-w-2xl leading-relaxed">
            The core data used by Water Utility Report is sourced from U.S. federal and state
            government agencies. Works of the U.S. federal government are not subject to copyright
            protection under 17 U.S.C. § 105. This means the raw factual data — utility names,
            PWSID numbers, violation records, and contaminant measurements — carries no copyright restriction.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Federal government data is not subject to copyright",
                desc: "EPA SDWIS, ECHO, UCMR 5, and CDC health guidance are works of the U.S. government and are not protected by copyright under 17 U.S.C. § 105. We do not require a license to publish derived facts from these sources.",
                ok: true,
              },
              {
                title: "State data requires per-state verification",
                desc: "State open data portals operate under varying terms. We verify that each state dataset explicitly permits normalization and derived republication before ingestion. State data that does not permit this is not used.",
                ok: true,
              },
              {
                title: "Third-party databases are not reproduced",
                desc: "EWG Tap Water Database, WQA member directory, and NSF certified product datasets are commercially or nonprofit-licensed. We do not reproduce or scrape these without explicit written permission.",
                ok: false,
              },
              {
                title: "Our original content is protected by copyright",
                desc: "The summaries, FAQs, editorial framing, and original analysis published on this site are original creative works protected by copyright. They are not in the public domain.",
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
            <h2 className="font-display text-2xl text-foreground">Permitted and Restricted Uses</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
            The following describes uses we expressly permit and uses we do not permit. Permitted uses constitute a limited, non-exclusive, revocable license for those specific purposes only.
          </p>
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
                detail: 'Brief factual quotes with clear attribution (e.g., "According to Water Utility Report...") are permitted. Attribution must appear in close proximity to the quoted content.',
              },
              {
                action: "Reproduce short excerpts for journalistic or educational purposes",
                permitted: true,
                detail: "Short quotations for news reporting, commentary, research, or education are permitted provided attribution is included and the excerpt is not the primary content of a competing work.",
              },
              {
                action: "Bulk-copy page content for republication",
                permitted: false,
                detail: "Reproducing our original written content (summaries, FAQs, framing) in bulk is not permitted without a written license agreement. This restriction does not apply to the underlying government data facts.",
              },
              {
                action: "Automated scraping at scale",
                permitted: false,
                detail: "Automated access at volume that places material load on our servers or circumvents normal browsing is not permitted. Our robots.txt communicates crawl preferences. If your data needs are research-oriented, the primary sources — EPA SDWIS and ECHO APIs — are publicly available.",
              },
              {
                action: "Use our original written content in AI training datasets",
                permitted: false,
                detail: "Our original editorial content (summaries, FAQs, analysis) may not be used in AI training datasets without a written license. The underlying government-sourced data facts are not subject to this restriction, as they are not our original works.",
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
                  {item.permitted ? "Permitted" : "Not permitted"}
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
              recommendations. Water quality information is presented for informational and educational
              purposes only. You should not rely on this site as a substitute for professional medical
              or environmental health advice.
            </p>
            <ul className="space-y-2 text-sm text-wur-caution/80">
              {[
                "A contaminant detected at or below the EPA Maximum Contaminant Level (MCL) is a regulatory compliance determination, not a guarantee of zero health risk. MCLs are set by balancing known health effects against technical and economic treatment feasibility.",
                "For several contaminants — including lead, arsenic, and certain PFAS compounds — the EPA Maximum Contaminant Level Goal (MCLG) is set at zero, meaning no level is considered risk-free. The enforceable MCL is set higher than zero for these contaminants due to feasibility constraints. Water that complies with the MCL may still carry measurable risk for some individuals.",
                "Sensitive populations — including infants, young children, pregnant individuals, and immunocompromised individuals — may face greater risk from certain contaminants than the general adult population for which many MCLs were calibrated.",
                "We do not recommend specific medical tests, treatments, or interventions. For health concerns related to water quality, consult a licensed healthcare provider.",
                "For formal water testing required for legal, regulatory, or real estate purposes, use a state-certified laboratory. This site does not provide certified testing or analysis.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-wur-caution mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Shield className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Limitation of Liability</h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              To the maximum extent permitted by applicable law, Water Utility Report and its operators shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or reliance on this site, including but not limited to:
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground mb-4">
              {[
                "Inaccuracies, errors, or omissions in data sourced from EPA, state agencies, or other third parties",
                "Delays in data updates, including violations that have been resolved or newly issued after our last sync",
                "Actions taken or not taken based on information presented on this site",
                "Interruptions in site availability or data access",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground/70 leading-relaxed">
              Some jurisdictions do not allow the exclusion or limitation of certain damages. In those jurisdictions, our liability is limited to the greatest extent permitted by applicable law.
            </p>
          </div>
        </section>

        {/* Service area accuracy */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-2xl text-foreground">Service Area Accuracy</h2>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-5 max-w-2xl">
            ZIP code–to–utility matching is modeled from spatial overlap between ZIP code tabulation
            areas (ZCTAs) and utility service area boundaries. This approach has known limitations:
          </p>
          <div className="space-y-3">
            {[
              {
                issue: "ZIP codes and utility service areas do not align exactly",
                detail: "A single ZIP code may span multiple utility service areas, and one utility may serve portions of many ZIPs. We display the primary match (highest estimated overlap) but flag ambiguous cases.",
              },
              {
                issue: "Service area boundary data is often unavailable or outdated",
                detail: "Many utilities have not published GIS-formatted service area boundaries. Where boundaries are unavailable, we model from available administrative data and note match confidence. Lower-confidence matches are labeled accordingly.",
              },
              {
                issue: "Your water bill is the authoritative source",
                detail: "For definitive confirmation of your water provider, check your water bill, contact your municipality directly, or use your utility's own service area lookup if available.",
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

        {/* Governing law */}
        <section>
          <div className="flex items-center gap-2.5 mb-3">
            <Scale className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-2xl text-foreground">Governing Law</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            These terms and any disputes arising from use of this site are governed by the laws of the United States and the State of Delaware, without regard to conflict of law principles. Any claims not subject to arbitration shall be brought exclusively in the state or federal courts located in Delaware.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground mb-2">Legal Inquiries, Licensing & Corrections</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            For licensing inquiries, data use questions, factual correction requests, or copyright notices (including DMCA takedown requests under 17 U.S.C. § 512), please contact us at{" "}
            <a href="mailto:legal@waterutilityreport.com" className="text-wur-teal hover:underline">
              legal@waterutilityreport.com
            </a>. We aim to respond to factual correction requests within 5 business days.
          </p>
          <p className="text-xs text-muted-foreground/70">
            DMCA notices must include all elements required under 17 U.S.C. § 512(c)(3), including identification of the allegedly infringing content and a statement of good faith belief.
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
