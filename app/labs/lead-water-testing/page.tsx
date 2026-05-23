import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Droplets, FlaskConical } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lead Water Testing: How To Test Your Tap Water for Lead",
  description: "How to test drinking water for lead, what first-draw protocol means, what results indicate, and what treatment options reduce lead at the tap.",
  alternates: { canonical: "https://waterutilityreport.com/labs/lead-water-testing" },
  openGraph: {
    title: "Lead Water Testing: How To Test Your Tap Water for Lead",
    description: "How to test drinking water for lead, what first-draw protocol means, what results indicate, and what treatment options reduce lead at the tap.",
    url: "https://waterutilityreport.com/labs/lead-water-testing",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "Does my water utility test for lead?",
    answer: "Public water utilities test for lead under EPA's Lead and Copper Rule, but they test at the distribution system level — not at individual taps in your home. The lead level at your tap depends on your home's specific plumbing, fixtures, and service line. Utility compliance data does not tell you what is at your tap.",
  },
  {
    question: "What is a first-draw lead sample?",
    answer: "A first-draw sample is collected after water has sat in the plumbing for at least 6–8 hours (typically overnight) without flushing. This maximizes the potential for lead to leach from plumbing materials. EPA's Lead and Copper Rule uses first-draw samples at the tap for its residential testing protocols. The collection protocol matters — do not run the tap before taking the sample.",
  },
  {
    question: "What is the EPA action level for lead in water?",
    answer: "EPA's current action level for lead is 15 parts per billion (ppb). When more than 10% of first-draw samples at monitored sites exceed 15 ppb, the utility must take action. However, there is no safe level of lead in drinking water — the CDC and EPA state that lead in water can contribute to blood lead levels even below the action level threshold. EPA's Lead and Copper Rule Improvements (2021) and subsequent rulemaking set a lead MCL goal of 0.",
  },
  {
    question: "My utility passed its lead compliance tests — does that mean my water is lead-free?",
    answer: "Not necessarily. Utility compliance testing reflects the distribution system, not your specific home's plumbing. Lead can enter water from your home's service line (if it contains lead), soldered joints in pipes, or lead-bearing fixtures and faucets — none of which are covered by utility-level compliance data.",
  },
  {
    question: "What should I do if lead is detected in my water?",
    answer: "Contact your local health department or water utility. In the short term, avoid drinking first-draw tap water, especially for infants and children. Use a certified filter (NSF/ANSI 53 or NSF/ANSI 58 for lead) or bottled water for consumption. Do not boil water to remove lead — boiling concentrates lead rather than removing it.",
  },
  {
    question: "Does a standard home water test kit test for lead?",
    answer: "Some home test strips include a lead indicator, but these have limited accuracy and are not equivalent to laboratory analysis. For a reliable result, use a state-certified or NELAP-accredited laboratory with a proper first-draw sample following the lab's collection protocol.",
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
    { "@type": "ListItem", position: 3, name: "Lead Water Testing", item: "https://waterutilityreport.com/labs/lead-water-testing" },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Lead Water Testing: How To Test Your Tap Water for Lead",
  description: "First-draw protocol, lab methods, result interpretation, and treatment for lead in drinking water.",
  dateModified: "2026-05-13",
  publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
};

const riskFactors = [
  { label: "Home built before 1986", note: "Lead solder in copper pipes was common before the 1986 ban" },
  { label: "Home built before 1930", note: "Higher likelihood of lead service line from street to home" },
  { label: "Older brass fixtures or faucets", note: "Pre-2014 brass faucets could contain up to 8% lead by weight" },
  { label: "Known lead service line area", note: "Contact your utility to check lead service line inventory data" },
  { label: "Any household with infants or young children", note: "Children are most vulnerable to neurological effects of lead" },
  { label: "Pregnant household members", note: "Lead exposure during pregnancy affects fetal development" },
];

export default function LeadWaterTestingPage() {
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
          <h1 className="font-display text-4xl text-white mb-3">Lead Water Testing: How To Test Your Tap Water for Lead</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Lead in drinking water typically enters from household plumbing — not from the source water
            itself. Utility compliance tests do not tell you what is at your tap. A first-draw sample
            from a certified lab gives you the most direct data.
          </p>
          <p className="text-white/40 text-xs mt-4 font-mono">Last updated: 2026-05-13 · Source: EPA, CDC, NSF International</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct answer */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Direct Answer</p>
          <p className="text-foreground leading-relaxed">
            Lead in tap water usually comes from household plumbing, service lines, or fixtures — not
            from the water source itself. Your utility&apos;s compliance data does not reflect lead at your
            specific tap. To know what is at your faucet, collect a first-draw sample following the lab&apos;s
            protocol and submit it to a state-certified laboratory. There is no safe level of lead in
            drinking water according to the CDC.
          </p>
        </section>

        {/* Critical warning */}
        <section>
          <div className="rounded-xl border border-wur-warning-border bg-wur-warning-bg p-5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-wur-warning mb-1">Do not boil water to remove lead</p>
              <p className="text-sm text-wur-warning/80 leading-relaxed">
                Boiling water does not remove lead — it concentrates it. If lead is a concern, use a certified
                filter (NSF/ANSI 53 or 58), bottled water, or an alternative source for drinking and cooking
                while you assess next steps.
              </p>
            </div>
          </div>
        </section>

        {/* Who should test */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Who Should Consider Lead Testing</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Lead testing is most relevant in these situations:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {riskFactors.map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <Droplets className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Where lead comes from */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Where Lead in Tap Water Comes From</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Lead is rarely present in source water at health-concerning levels. It typically enters
            water after it leaves the treatment plant, through contact with plumbing materials in the
            distribution system or in your home.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                source: "Lead service lines",
                desc: "Pipes connecting the water main to your home. Still present in millions of U.S. homes — EPA estimates 9 million lead service lines remain. Contact your utility for your address.",
              },
              {
                source: "Lead solder in copper pipes",
                desc: "Used commonly in homes built before 1986. The 1986 Safe Drinking Water Act amendment banned lead solder in new plumbing, but older homes retain legacy solder in joints.",
              },
              {
                source: "Lead-bearing fixtures and faucets",
                desc: "Pre-2014 faucets could legally contain up to 8% lead under a broad 'lead-free' standard. The 2014 SDWA update tightened this to 0.25% for drinking water fixtures.",
              },
            ].map((item) => (
              <div key={item.source} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-2">{item.source}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How to test */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">How To Test for Lead at the Tap</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Order a first-draw sampling kit",
                desc: "Contact a state-certified laboratory and request a lead first-draw sample kit. Confirm they provide collection instructions — the protocol is critical to result accuracy.",
              },
              {
                step: "02",
                title: "Do not run the tap before collecting",
                desc: "Let water sit in the pipes for at least 6–8 hours (overnight is typical). Collect the sample before any flushing. Do not pre-flush. This ensures you capture lead that may have leached from plumbing materials.",
              },
              {
                step: "03",
                title: "Submit and interpret results",
                desc: "Return the sample to the lab within the required time window. Results are reported in parts per billion (ppb). The EPA action level is 15 ppb for utility monitoring; the CDC states no safe level exists.",
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

        {/* Benchmarks */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">EPA Lead Benchmarks for Reference</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Action Level (utilities)", value: "15 ppb (first-draw)", context: "Triggers utility action if >10% of samples exceed this level" },
              { label: "MCL Goal (MCLG)", value: "0 ppb", context: "EPA's health-based goal — there is no safe level of lead" },
              { label: "Trigger Level", value: "10 ppb", context: "Under Lead and Copper Rule Improvements (2021): triggers additional action" },
              { label: "School/childcare action level", value: "5 ppb", context: "EPA recommends action in schools and childcare facilities at 5 ppb" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-lg font-semibold text-foreground font-mono">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.context}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Source: EPA Lead and Copper Rule, EPA Lead and Copper Rule Improvements (2021).
          </p>
        </section>

        {/* Treatment */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Reducing Lead at the Tap</h2>
          <div className="space-y-3">
            {[
              {
                title: "NSF/ANSI 53 certified filter",
                desc: "NSF Standard 53 certifies water treatment devices for lead reduction at specific concentrations. Look for the lead-reduction claim on the certification. Replace filter cartridges on schedule — a saturated filter can release lead.",
              },
              {
                title: "NSF/ANSI 58 certified reverse osmosis",
                desc: "Reverse osmosis systems certified to NSF/ANSI 58 are effective for lead reduction. RO systems also address other contaminants. Undersink systems treat water at the specific tap.",
              },
              {
                title: "Flush before using water for drinking",
                desc: "Running the tap for 30–60 seconds before drawing drinking water flushes lead that has leached from nearby plumbing. This is a mitigation measure, not a treatment — it shifts lead downstream into the drain rather than removing it from your home.",
              },
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
              { href: "/labs", label: "Find a certified water testing lab", desc: "State-certified and NELAP-accredited labs by state" },
              { href: "/contaminants/lead", label: "Lead contaminant guide", desc: "Health effects, EPA regulation, and sources" },
              { href: "/treatment/reverse-osmosis", label: "Reverse osmosis guide", desc: "How RO removes lead and other contaminants" },
              { href: "/treatment", label: "All treatment options", desc: "Filters, RO, and other treatment methods" },
              { href: "/labs/what-to-test-for-in-drinking-water", label: "What to test for in drinking water", desc: "Full guide to contaminant testing by situation" },
              { href: "/labs/how-to-read-water-test-results", label: "How to read water test results", desc: "Interpreting lab reports against EPA benchmarks" },
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

        <FaqSection faqs={faqs} title="Lead Water Testing FAQs" />

        {/* Sources */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Data Sources and Methodology</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Lead testing guidance is summarized from EPA&apos;s Lead and Copper Rule, Lead and Copper Rule
            Improvements (2021), CDC lead guidance, NSF International certification standards, and
            EPA&apos;s 3Ts for Reducing Lead in Drinking Water toolkit.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">Full methodology →</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "EPA Lead and Copper Rule", url: "https://www.epa.gov/dwreginfo/lead-and-copper-rule" },
              { label: "CDC Lead in Drinking Water", url: "https://www.cdc.gov/niosh/topics/emres/chemlead.html" },
              { label: "NSF Lead Certification", url: "https://www.nsf.org/consumer-resources/articles/lead-water-filters" },
              { label: "EPA 3Ts Toolkit", url: "https://www.epa.gov/ground-water-and-drinking-water/3ts-reducing-lead-drinking-water" },
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
