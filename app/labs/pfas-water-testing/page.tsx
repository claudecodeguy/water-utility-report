import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Droplets, FlaskConical } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PFAS Water Testing: How To Test Your Water for PFAS",
  description: "How to test drinking water for PFAS, which lab methods apply, what a positive result means, and what treatment options are used for PFAS removal.",
  alternates: { canonical: "https://waterutilityreport.com/labs/pfas-water-testing" },
  openGraph: {
    title: "PFAS Water Testing: How To Test Your Water for PFAS",
    description: "How to test drinking water for PFAS, which lab methods apply, what a positive result means, and what treatment options are used for PFAS removal.",
    url: "https://waterutilityreport.com/labs/pfas-water-testing",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Can a standard home water test detect PFAS?",
    answer: "No. Standard multi-panel home test kits do not test for PFAS. PFAS testing requires specialized laboratory analysis — typically EPA Method 533 or 537.1 — at a state-certified or NELAP-accredited laboratory. At-home PFAS test strips currently available are not validated to the same accuracy standard as certified lab methods.",
  },
  {
    question: "What EPA method is used for PFAS water testing?",
    answer: "EPA Method 537.1 is the primary drinking water method for 40 PFAS compounds. EPA Method 533 expands coverage to shorter-chain PFAS compounds including PFBS, PFPeA, and others not covered by 537.1. Laboratories certified for PFAS testing will specify which method applies to your sample.",
  },
  {
    question: "How much does PFAS water testing cost?",
    answer: "PFAS water testing typically costs between $150 and $450 per sample depending on the method ordered, the number of PFAS compounds tested, and the laboratory. Some state programs offer subsidized testing for certain users. See our drinking water test cost guide for current ranges.",
  },
  {
    question: "My public utility has PFAS records — do I still need to test my own tap?",
    answer: "If your home is on a public water system with PFAS violations or health-based exceedances, that utility data applies to treated water at the distribution point — not necessarily at your tap. Lead service lines, building plumbing, and private service lines can affect point-of-use quality. If you have specific concerns about your tap, point-of-use testing is the most direct answer.",
  },
  {
    question: "What PFAS levels should I be concerned about?",
    answer: "In April 2024, the EPA finalized Maximum Contaminant Levels (MCLs) for six PFAS in public drinking water. PFOA and PFOS have an MCL of 4 parts per trillion (ppt) individually. PFNA, PFHxS, and HFPO-DA (GenX) have an MCL of 10 ppt. A hazard index applies to certain combinations. These MCLs apply to public water utilities — private well users do not have a federal regulatory trigger but can use these as reference points.",
  },
  {
    question: "What filters remove PFAS from drinking water?",
    answer: "Reverse osmosis (RO) systems are the most studied and widely used for PFAS removal at the point of use. NSF/ANSI Standard 58 certifies RO systems for PFAS reduction. Activated carbon filters (NSF/ANSI 53) reduce some PFAS at varying rates depending on carbon type, contact time, and specific PFAS compounds. Pitcher filters generally have lower effectiveness.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
    { "@type": "ListItem", position: 2, name: "Labs", item: "https://waterutilityreport.com/labs" },
    { "@type": "ListItem", position: 3, name: "PFAS Water Testing", item: "https://waterutilityreport.com/labs/pfas-water-testing" },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "PFAS Water Testing: How To Test Your Water for PFAS",
  description: "Lab methods, cost, interpretation, and treatment options for PFAS in drinking water.",
  dateModified: "2026-05-13",
  publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
};

const pfasMethods = [
  { method: "EPA Method 537.1", compounds: "40 PFAS including PFOA, PFOS, PFNA, PFHxS, HFPO-DA (GenX)", notes: "Standard for most certified labs; covers regulated compounds" },
  { method: "EPA Method 533", compounds: "25 PFAS including shorter-chain PFBS, PFPeA, PFPeS", notes: "Expands coverage beyond 537.1; complementary method for broader screening" },
  { method: "EPA Method 533 + 537.1 combined", compounds: "50+ PFAS total", notes: "Broadest available coverage for comprehensive screening" },
];

const riskFactors = [
  "You are near a current or former military installation with firefighting training areas",
  "Your address is near an industrial site known to use or manufacture PFAS",
  "Your public utility has PFAS records in EPA UCMR 5 data",
  "You use a private well in an area with documented PFAS contamination",
  "Your state has flagged PFAS as a priority concern in local water quality advisories",
  "You are near a landfill or wastewater facility that received PFAS-containing materials",
];

export default function PfasWaterTestingPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />

      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/labs" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Water Testing Labs
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Contaminant Testing Guide</p>
          <h1 className="font-display text-4xl text-white mb-3">PFAS Water Testing: How To Test Your Water for PFAS</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Standard home test kits do not detect PFAS. Testing requires specialized EPA-method analysis
            at a certified laboratory. This guide explains which methods apply, what results include,
            and what treatment options are available.
          </p>
          <p className="text-white/40 text-xs mt-4 font-mono">Last updated: 2026-05-13 · Source: EPA, NSF International, ATSDR</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct answer */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Direct Answer</p>
          <p className="text-foreground leading-relaxed">
            PFAS testing requires a state-certified laboratory using EPA Method 537.1 or EPA Method 533.
            Standard home test kits do not include PFAS. Testing typically costs $150–$450 per sample.
            If your public utility has PFAS records in EPA compliance data, that covers the treated water
            at the distribution system — not your individual tap. Point-of-use testing gives the most direct
            answer about what is at your faucet.
          </p>
        </section>

        {/* Who should consider testing */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Who Should Consider PFAS Testing</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            PFAS are found in many public water systems and some private wells. Testing is most relevant when
            one or more of the following applies:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {riskFactors.map((factor) => (
              <div key={factor} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <Droplets className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <p className="text-sm text-foreground leading-relaxed">{factor}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Check your utility&apos;s PFAS compliance records in{" "}
            <Link href="/pfas-watchlist" className="text-wur-teal hover:underline">our PFAS Watchlist</Link>{" "}
            before ordering a test.
          </p>
        </section>

        {/* Lab methods */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Lab Methods for PFAS Testing</h2>
          <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
            Not all labs run all methods. Confirm with the laboratory which PFAS compounds are included
            before submitting a sample.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">EPA Method</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">PFAS Compounds Covered</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pfasMethods.map((row) => (
                  <tr key={row.method} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground font-mono text-xs">{row.method}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.compounds}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* EPA MCLs */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">EPA PFAS Maximum Contaminant Levels (2024)</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            The EPA finalized the first federal drinking water limits for PFAS in April 2024. These MCLs
            apply to public water utilities — not private wells — but provide the primary reference benchmarks
            for interpreting test results.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { compound: "PFOA", limit: "4 ppt (parts per trillion)", note: "Individual MCL" },
              { compound: "PFOS", limit: "4 ppt", note: "Individual MCL" },
              { compound: "PFNA", limit: "10 ppt", note: "Individual MCL" },
              { compound: "PFHxS", limit: "10 ppt", note: "Individual MCL" },
              { compound: "HFPO-DA (GenX)", limit: "10 ppt", note: "Individual MCL" },
              { compound: "PFNA + PFHxS + HFPO-DA + PFBS", limit: "Hazard Index ≤ 1", note: "Combined hazard index" },
            ].map((item) => (
              <div key={item.compound} className="p-4 rounded-lg border border-border bg-card flex gap-3">
                <div className="w-2 h-2 rounded-full bg-wur-teal shrink-0 mt-1.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.compound}</p>
                  <p className="text-xs text-muted-foreground">{item.limit} · {item.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Source: EPA PFAS National Primary Drinking Water Regulation (April 2024).{" "}
            <Link href="/contaminants/pfas" className="text-wur-teal hover:underline">Full PFAS contaminant guide →</Link>
          </p>
        </section>

        {/* How to get tested */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">How To Get PFAS Water Tested</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Check existing utility data first",
                desc: "If you are on a public water system, check the PFAS Watchlist for your utility's EPA UCMR 5 records before ordering a test. Your utility may already have disclosed PFAS data.",
              },
              {
                step: "02",
                title: "Find a certified lab",
                desc: "Use the EPA certified lab directory or your state drinking water program's lab list. Confirm the lab is certified for EPA Method 537.1 or 533. Not all state-certified labs run PFAS panels.",
              },
              {
                step: "03",
                title: "Order and submit a sample",
                desc: "Request a PFAS sampling kit from the lab. Follow collection instructions precisely — PFAS can be introduced through container contamination if protocol is not followed. Submit within the lab's required time window.",
              },
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-xs font-mono text-muted-foreground mb-2">{s.step}</p>
                <h3 className="font-semibold text-foreground text-sm mb-2">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Treatment options */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">PFAS Treatment Options</h2>
          <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-4 flex items-start gap-3 mb-5">
            <AlertTriangle className="w-4 h-4 text-wur-caution shrink-0 mt-0.5" />
            <p className="text-sm text-wur-caution/80 leading-relaxed">
              Treatment effectiveness depends on specific PFAS compounds, system design, and maintenance.
              Look for NSF/ANSI-certified systems. Certification is not the same as general product claims.
            </p>
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Reverse Osmosis (RO)",
                desc: "The most studied point-of-use method for PFAS reduction. NSF/ANSI Standard 58 covers RO systems for PFAS. RO membranes physically reject most PFAS compounds. Effectiveness varies by compound chain length — longer-chain PFAS are generally more reliably removed.",
                link: "/treatment/reverse-osmosis",
              },
              {
                title: "Activated Carbon (GAC / Block Carbon)",
                desc: "NSF/ANSI Standard 53 covers activated carbon for PFAS reduction. Granular activated carbon (GAC) and solid block carbon filters vary in effectiveness by compound and contact time. Shorter-chain PFAS (PFBS, PFPeA) are harder to remove with carbon alone.",
                link: "/treatment",
              },
              {
                title: "Whole-house treatment",
                desc: "Large-scale GAC systems or ion exchange systems are used by utilities and some households for whole-home PFAS reduction. These are more complex to size, install, and maintain than point-of-use systems.",
                link: null,
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">
                    {item.link ? (
                      <Link href={item.link} className="hover:text-wur-teal transition-colors">{item.title}</Link>
                    ) : item.title}
                  </p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="font-display text-xl text-foreground mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { href: "/pfas-watchlist", label: "Check your utility's PFAS records", desc: "EPA UCMR 5 data by utility" },
              { href: "/labs", label: "Find a certified water testing lab", desc: "State-certified and NELAP labs" },
              { href: "/contaminants/pfas", label: "PFAS contaminant guide", desc: "Health context, EPA regulation, sources" },
              { href: "/treatment/reverse-osmosis", label: "Reverse osmosis treatment guide", desc: "How RO removes PFAS and other contaminants" },
              { href: "/labs/well-water-testing", label: "Well water testing guide", desc: "Private well users: what to test and when" },
              { href: "/labs/drinking-water-test-cost", label: "Water testing cost guide", desc: "What PFAS and other tests cost" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
              >
                <FlaskConical className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-wur-teal transition-colors">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <FaqSection faqs={faqs} title="PFAS Water Testing FAQs" />

        {/* Sources */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Data Sources and Methodology</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            PFAS testing guidance is summarized from EPA PFAS methods documentation, EPA&apos;s 2024 National
            Primary Drinking Water Regulation for PFAS, ATSDR health advisories, and NSF International
            certification standards. MCL values reflect the April 2024 final rule.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">Full methodology →</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "EPA PFAS Drinking Water Rule", url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas" },
              { label: "EPA Method 537.1", url: "https://www.epa.gov/water-research/epa-method-5371" },
              { label: "EPA Method 533", url: "https://www.epa.gov/water-research/method-533" },
              { label: "NSF/ANSI 58 (RO)", url: "https://www.nsf.org/consumer-resources/articles/nsf-certification-reverse-osmosis" },
            ].map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline"
              >
                {s.label} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-mono mt-2">Last updated: 2026-05-13</p>
        </section>
      </div>
    </div>
  );
}
