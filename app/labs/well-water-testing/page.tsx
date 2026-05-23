import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Droplets, FlaskConical } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Well Water Testing: What To Test For And When",
  description: "Learn what private well users may need to test for, how well water testing differs from public utility water, and what to do after results.",
  alternates: { canonical: "https://waterutilityreport.com/labs/well-water-testing" },
  openGraph: {
    title: "Well Water Testing: What To Test For And When",
    description: "Learn what private well users may need to test for, how well water testing differs from public utility water, and what to do after results.",
    url: "https://waterutilityreport.com/labs/well-water-testing",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "What should private well water be tested for?",
    answer: "At a minimum, private well water is commonly tested for coliform bacteria, nitrate, and pH. Depending on local conditions, additional tests for arsenic, lead, hardness, volatile organic compounds (VOCs), and PFAS may be appropriate. Your state's drinking water program typically publishes priority contaminants for your region.",
  },
  {
    question: "How is well water testing different from public utility water testing?",
    answer: "Public water utilities are regulated under the federal Safe Drinking Water Act and must meet EPA standards and testing schedules. Private wells are not regulated by the federal SDWA — the household is generally responsible for testing. This is why private well testing decisions are left to the well owner, and testing frequency and scope vary.",
  },
  {
    question: "Should I test my well after flooding?",
    answer: "Flooding can introduce surface water, bacteria, and other contaminants into a well through the casing or surrounding soil. Many state health departments recommend testing for coliform bacteria and nitrate after significant flooding events. Contact your local health department or state drinking water program for guidance specific to your area.",
  },
  {
    question: "Can I use my utility's water quality report for a private well?",
    answer: "No. Consumer Confidence Reports and EPA compliance data apply only to the public water system — they do not reflect private well water quality. Well water is not covered by utility monitoring programs.",
  },
  {
    question: "What should I do if a well test finds a contaminant?",
    answer: "Contact the certifying laboratory for result interpretation. Depending on the contaminant, your state health department may have guidance. For certain contaminants — such as bacteria, nitrate above EPA's 10 mg/L benchmark, or arsenic — reviewing treatment options or using an alternative water source for sensitive uses may be appropriate next steps.",
  },
  {
    question: "How often should a private well be tested?",
    answer: "Many state programs and health agencies suggest annual testing for coliform bacteria and nitrate as a baseline. Testing frequency for other contaminants depends on local geology, land use, and any changes near the well. There is no single federal requirement — your state health department is the best source for local guidance.",
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
    { "@type": "ListItem", position: 3, name: "Well Water Testing", item: "https://waterutilityreport.com/labs/well-water-testing" },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Well Water Testing: What To Test For And When",
  description: "Private well testing guidance — what to test for, how it differs from public utility water, and next steps after results.",
  dateModified: "2026-05-13",
  publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
};

const testItems = [
  { contaminant: "Coliform bacteria", why: "Indicates microbial contamination; required baseline test", concern: "high", link: null },
  { contaminant: "Nitrate", why: "Agricultural runoff, septic systems; critical for infants", concern: "high", link: "/contaminants/nitrates" },
  { contaminant: "pH", why: "Affects corrosivity and taste; easy baseline indicator", concern: "moderate", link: null },
  { contaminant: "Hardness (calcium/magnesium)", why: "Affects appliances, plumbing, and taste", concern: "low", link: null },
  { contaminant: "Arsenic", why: "Naturally occurring in some aquifers; relevant in many states", concern: "high", link: "/contaminants/arsenic" },
  { contaminant: "Lead", why: "Can leach from well components, pump, or household plumbing", concern: "high", link: "/contaminants/lead" },
  { contaminant: "PFAS", why: "Relevant near industrial sites, military bases, landfills, or where public utilities have PFAS records", concern: "moderate", link: "/contaminants/pfas" },
  { contaminant: "VOCs (volatile organic compounds)", why: "Gasoline, solvents, dry-cleaning chemicals; relevant near industrial or commercial areas", concern: "moderate", link: null },
];

export default function WellWaterTestingPage() {
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
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Private Well Testing</p>
          <h1 className="font-display text-4xl text-white mb-3">Well Water Testing: What To Test For and When</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Private well users are generally responsible for testing their own water. Unlike public utilities,
            private wells are not regulated under the federal Safe Drinking Water Act — testing decisions
            are the household's responsibility.
          </p>
          <p className="text-white/40 text-xs mt-4 font-mono">Last updated: 2026-05-13 · Source: EPA, CDC, state health programs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct answer */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Direct Answer</p>
          <p className="text-foreground leading-relaxed">
            Private wells are not covered by federal water quality regulations that apply to public utilities.
            The household is typically responsible for testing, interpreting results, and addressing any issues.
            Many state health departments recommend testing well water at least annually for coliform bacteria
            and nitrate, with additional tests depending on local geology, land use, and specific concerns.
          </p>
        </section>

        {/* Public vs private distinction */}
        <section>
          <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-caution shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-wur-caution mb-1">This page is for private well users</p>
              <p className="text-sm text-wur-caution/80 leading-relaxed">
                If your home is served by a public water utility, your water is already monitored and tested under
                EPA requirements. Check your utility&apos;s official compliance records first.{" "}
                <Link href="/" className="underline hover:no-underline">Look up your utility →</Link>
              </p>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">Quick Facts: Well Water Testing</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Who it applies to", value: "Private well owners; households not served by a public utility" },
              { label: "Minimum recommended tests", value: "Coliform bacteria, nitrate, pH (annually or per state guidance)" },
              { label: "Who regulates private wells", value: "State and local health programs — not federal EPA utility rules" },
              { label: "Lab type required", value: "State-certified or NELAP-accredited laboratory" },
              { label: "Result turnaround", value: "Typically 5–15 business days depending on tests ordered" },
              { label: "Utility report applicability", value: "Does not apply — utility compliance records are for public systems only" },
            ].map((item) => (
              <div key={item.label} className="flex gap-3 p-4 rounded-lg border border-border bg-card">
                <Droplets className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-0.5">{item.label}</p>
                  <p className="text-sm text-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* What to test for */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Common Well Water Tests</h2>
          <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
            The right tests depend on your location, local land use, well age, and any specific concerns.
            Your state drinking water program or local health department typically publishes priority
            contaminants for your region.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Contaminant / Indicator</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Why It Matters for Wells</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {testItems.map((item) => (
                  <tr key={item.contaminant} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {item.link ? (
                        <Link href={item.link} className="text-wur-teal hover:underline">{item.contaminant}</Link>
                      ) : item.contaminant}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.why}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            This list is not exhaustive. Consult your state health department or a certified lab for a
            priority list relevant to your location.
          </p>
        </section>

        {/* How testing works */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">How Well Water Testing Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Choose a certified lab",
                desc: "Use a state-certified or NELAP-accredited laboratory. The EPA maintains a national directory at epa.gov/dwlabcert. Your state health department also publishes a list of certified labs.",
              },
              {
                step: "02",
                title: "Request a sampling kit",
                desc: "Contact the lab before collecting samples. Labs provide collection containers, chain-of-custody forms, and instructions. Sampling procedures affect accuracy — follow the lab's instructions precisely.",
              },
              {
                step: "03",
                title: "Collect and submit",
                desc: "Most well samples are collected at the tap. Some tests (first-draw lead, bacteria) have specific collection protocols. Send samples to the lab within the required time window.",
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

        {/* After results */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">What To Do After Test Results</h2>
          <p className="text-muted-foreground leading-relaxed mb-5 text-sm">
            Results should be reviewed in context of applicable EPA maximum contaminant levels (MCLs)
            and health advisories. The laboratory will typically provide reference ranges on the report.
          </p>
          <div className="space-y-3">
            {[
              { title: "Review results against benchmarks", desc: "Compare detected levels to EPA MCLs and health advisories provided by the lab. For contaminants without an MCL, your state may have its own standard." },
              { title: "Contact your lab or health department with questions", desc: "If you have questions about what a result means, the certifying laboratory or your state health department can provide context." },
              { title: "Review treatment options", desc: "Treatment depends on the specific contaminant. Reverse osmosis addresses many regulated contaminants including nitrate, arsenic, and PFAS. Activated carbon addresses VOCs and some PFAS." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{item.title}</p>
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
              { href: "/labs", label: "Find a certified water testing lab", desc: "EPA-linked directory and state program links" },
              { href: "/labs/pfas-water-testing", label: "PFAS water testing guidance", desc: "Lab methods required and what PFAS results include" },
              { href: "/labs/nitrate-water-testing", label: "Nitrate water testing", desc: "Especially relevant for wells and households with infants" },
              { href: "/labs/lead-water-testing", label: "Lead water testing", desc: "When it matters and what results may show" },
              { href: "/treatment", label: "Water treatment options", desc: "Reverse osmosis, activated carbon, and filtration guides" },
              { href: "/contaminants/nitrates", label: "Nitrate contaminant guide", desc: "EPA limits, health context, and treatment" },
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

        <FaqSection faqs={faqs} title="Well Water Testing FAQs" />

        {/* Sources */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Data Sources and Methodology</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Well water testing guidance on this page is summarized from EPA private well guidance, CDC recommendations,
            and state health department resources. No specific lab products are recommended. All content is general
            educational guidance — not a substitute for site-specific advice from your state health department
            or a certified laboratory.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">Full methodology →</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "EPA Private Wells", url: "https://www.epa.gov/privatewells" },
              { label: "CDC Private Well Safety", url: "https://www.cdc.gov/healthywater/drinking/private/wells/index.html" },
              { label: "EPA Certified Lab Directory", url: "https://www.epa.gov/dwlabcert" },
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
