import Link from "next/link";
import { ExternalLink, CheckCircle2, AlertTriangle, FlaskConical, Droplets } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import TestingTreatmentPath from "@/components/testing-treatment-path";
import RelatedWaterQuestions from "@/components/related-water-questions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Testing Labs by State: Drinking Water, Well Water & PFAS",
  description:
    "Find certified water testing labs in your state for tap water, private wells, PFAS, lead, nitrate, and arsenic testing. Compare options and find next steps.",
  alternates: { canonical: "https://waterutilityreport.com/labs" },
  openGraph: {
    title: "Water Testing Labs by State: Drinking Water, Well Water & PFAS",
    description:
      "Find certified water testing labs in your state for tap water, private wells, PFAS, lead, nitrate, and arsenic testing. Compare options and find next steps.",
    url: "https://waterutilityreport.com/labs",
  },
  robots: { index: true, follow: true },
};

const labsFaqs = [
  {
    question: "How do I get my drinking water tested?",
    answer: "To test your tap water, use a state-certified or NELAP-accredited laboratory. The EPA maintains a national directory of certified labs searchable by state and contaminant at epa.gov/dwlabcert. Contact the lab to request a sampling kit with chain-of-custody instructions before collecting a sample. Results are typically returned within 5–15 business days depending on the contaminants tested.",
  },
  {
    question: "What water tests should I get?",
    answer: "The right tests depend on your water source and concern. For municipal tap water, consider testing for lead (especially in pre-1986 homes), PFAS (if your utility has records), nitrate, and disinfection byproducts. For private well water, the CDC recommends annual testing for coliform bacteria, nitrate, pH, and hardness, plus additional tests if your area has agricultural runoff, industrial activity, or known contamination. Ask your state drinking water program for a priority list specific to your region.",
  },
  {
    question: "How do I test for PFAS in my water?",
    answer: "PFAS testing requires a laboratory certified under EPA Method 533 or EPA Method 537.1. Not all general labs hold this certification — confirm before submitting a sample. The EPA certified lab directory (epa.gov/dwlabcert) allows you to filter by state and test type. Collect the sample according to the lab's chain-of-custody procedure, typically first-draw after 6–8 hours of no water use.",
  },
  {
    question: "How do I test a private well for contamination?",
    answer: "Private wells are not regulated by the federal Safe Drinking Water Act, so testing is the owner's responsibility. At minimum, test annually for coliform bacteria, nitrate, and pH. If you live near agricultural land, also test for pesticides and nitrates. Near industrial sites, test for VOCs and heavy metals. Use a state-certified laboratory for any results you plan to use for real estate, legal, or regulatory purposes. Your state's department of health or environment typically publishes a list of certified labs.",
  },
  {
    question: "What is the difference between a certified lab and a home test kit?",
    answer: "State-certified or NELAP-accredited laboratories follow strict chain-of-custody and quality assurance protocols. Their results are legally defensible and accepted by regulators, lenders, and public health agencies. Home test kits (strips, color-change tablets) provide quick screening but are not certified, not quantitative for most contaminants, and not accepted for regulatory or real estate purposes. Use certified labs whenever results matter beyond personal curiosity.",
  },
  {
    question: "How much does water testing cost?",
    answer: "A basic coliform and nitrate panel typically costs $30–$80. A full lead and copper analysis runs $20–$60. A comprehensive PFAS panel (Method 533 or 537.1) typically costs $150–$350 depending on the number of compounds tested. Well water panels that test 50+ parameters range from $200 to $500. Some state and local health departments offer subsidized or free testing for low-income households — contact your state drinking water program to ask.",
  },
];

const labsFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: labsFaqs.map(f => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={labsFaqJsonLd} />
      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Testing Labs</p>
          <h1 className="font-display text-4xl text-white mb-3">Find a Certified Water Testing Lab</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Use a state-certified or NELAP-accredited lab for drinking water and private
            well testing. Always verify current certification directly with the lab or your state program
            before submitting samples.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important disclaimer */}
        <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-5 mb-10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-wur-caution mb-1">Verify Before Submitting Samples</p>
              <p className="text-sm text-wur-caution/80 leading-relaxed">
                Lab certifications change. Always confirm that a lab&apos;s current certification covers the
                specific contaminants you need tested before submitting samples. Check with your state&apos;s
                laboratory certification program for the authoritative, up-to-date list.
              </p>
            </div>
          </div>
        </div>

        {/* EPA Lab Finder — primary CTA */}
        <section className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-8 mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Authoritative Resource</p>
          <h2 className="font-display text-2xl text-foreground mb-3">EPA National Certified Lab Directory</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
            The EPA maintains the definitive national database of certified drinking water testing
            laboratories organized by state and contaminant type. This is the most comprehensive and
            current resource — always use it to find certified labs.
          </p>
          <a
            href="https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-white bg-wur-teal border border-wur-teal rounded-md px-5 py-2.5 hover:bg-wur-teal/90 transition-colors"
          >
            Search EPA Certified Lab Database <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* Testing by Concern — 7-card section linking to all cluster pages */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-2">Testing Guides by Contaminant or Concern</h2>
          <p className="text-muted-foreground text-sm mb-5">
            Start with the guide that matches your specific concern — each covers what to test, how, what results mean, and next steps.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              {
                href: "/labs/pfas-water-testing",
                label: "PFAS Water Testing",
                desc: "Lab methods required (EPA 537.1 / 533), cost, and what PFAS results include",
                badge: "Most requested",
              },
              {
                href: "/labs/lead-water-testing",
                label: "Lead Water Testing",
                desc: "First-draw sample protocol, benchmarks, and filter options",
                badge: null,
              },
              {
                href: "/labs/nitrate-water-testing",
                label: "Nitrate Water Testing",
                desc: "EPA MCL, infant health risk, and which filters remove nitrate",
                badge: null,
              },
              {
                href: "/labs/well-water-testing",
                label: "Well Water Testing",
                desc: "What private well users should test for and how often",
                badge: null,
              },
              {
                href: "/labs/what-to-test-for-in-drinking-water",
                label: "What To Test For",
                desc: "Full contaminant guide matched to your water source and situation",
                badge: null,
              },
              {
                href: "/labs/how-to-read-water-test-results",
                label: "How To Read Results",
                desc: "Interpreting lab reports — units, MCLs, ND, and next steps",
                badge: null,
              },
              {
                href: "/labs/drinking-water-test-cost",
                label: "Water Testing Cost",
                desc: "Current cost ranges by test type, plus free and subsidized options",
                badge: null,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col gap-2 p-4 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-4 h-4 text-wur-teal shrink-0" />
                    <p className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors leading-snug">{item.label}</p>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-semibold uppercase tracking-wide text-wur-teal bg-wur-teal/10 px-1.5 py-0.5 rounded shrink-0">{item.badge}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">{item.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Public water vs private well comparison */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5">Public Utility vs. Private Well: Who Needs to Test?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">I&apos;m on a public water utility</p>
              <ul className="space-y-2 mb-4">
                {[
                  "Your utility is required to test and report results to EPA",
                  "Check compliance records and the PFAS Watchlist first — it may answer your question without testing",
                  "If concerned about lead: test at your own tap using a first-draw sample",
                  "If concerned about PFAS: check PFAS Watchlist records before ordering a test",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Droplets className="w-3.5 h-3.5 text-wur-teal shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                <Link href="/" className="text-xs font-semibold text-wur-teal hover:underline">Look up your utility →</Link>
                <Link href="/pfas-watchlist" className="text-xs font-semibold text-wur-teal hover:underline">PFAS Watchlist →</Link>
              </div>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">I have a private well</p>
              <ul className="space-y-2 mb-4">
                {[
                  "Private wells are not covered by federal EPA utility monitoring rules",
                  "Testing is your responsibility — no required schedule exists federally",
                  "Most state programs recommend annual bacteria and nitrate testing at minimum",
                  "Additional tests depend on your location, local geology, and nearby land use",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Droplets className="w-3.5 h-3.5 text-wur-teal shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/labs/well-water-testing" className="text-xs font-semibold text-wur-teal hover:underline">Well water testing guide →</Link>
            </div>
          </div>
        </section>

        {/* How to choose a lab */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5">How to Choose a Water Testing Lab</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Match certification to contaminant",
                desc: "Not all labs are certified for all tests. A lab may be NELAP accredited but not specifically certified for PFAS analysis using EPA Method 533 or 537.1. Ask for the specific certification before submitting.",
              },
              {
                title: "Use state-certified labs for legal purposes",
                desc: "If results will be used for regulatory compliance, real estate transactions, or formal documentation, the lab must be certified by your state program — not just nationally accredited.",
              },
              {
                title: "Mail-in kits vs. local labs",
                desc: "Many certified labs offer mail-in sampling kits with chain-of-custody forms. These are valid for most purposes. Local labs can provide faster turnaround and in-person guidance on sampling technique.",
              },
            ].map((point, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-4 h-4 text-wur-teal mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-2">{point.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* State lab programs */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5">State Certification Programs</h2>
          <p className="text-muted-foreground mb-5 max-w-2xl">
            Each state runs its own laboratory certification program. These are the authoritative sources
            for finding certified labs in your state.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { state: "California", abbr: "CA", url: "https://www.waterboards.ca.gov/drinking_water/certlic/labs/", label: "SWRCB Laboratory Accreditation" },
              { state: "Texas", abbr: "TX", url: "https://www.tceq.texas.gov/agency/water_main.html", label: "TCEQ Water Programs" },
              { state: "Florida", abbr: "FL", url: "https://www.floridahealth.gov/environmental-health/drinking-water/", label: "FDOH Drinking Water Program" },
              { state: "Arizona", abbr: "AZ", url: "https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water", label: "EPA Certified Labs — Arizona" },
              { state: "Ohio", abbr: "OH", url: "https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water", label: "EPA Certified Labs — Ohio" },
            ].map((s) => (
              <a
                key={s.abbr}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-foreground group-hover:text-wur-teal transition-colors text-sm">{s.state}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-wur-teal shrink-0 mt-0.5 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* Well water guide links */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground mb-2">Testing Private Well Water?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Private well testing requirements vary by state. See our state-specific well water guides
            for testing recommendations and links to each state&apos;s certified lab program.
          </p>
          <Link
            href="/well-water"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:underline"
          >
            View Well Water Testing Guides →
          </Link>
        </section>

        {/* Utility lookup CTA */}
        <section className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-6">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Before You Test</p>
          <h2 className="font-display text-lg text-foreground mb-2">Check your utility&apos;s EPA compliance record first</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Before ordering a lab test, review what EPA has already recorded for your utility — violations, PFAS monitoring data, and detected contaminants. This helps you decide which contaminants to prioritize in your test panel.
          </p>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="text-xs px-3 py-1.5 rounded-full border border-wur-teal/40 bg-white text-wur-teal hover:bg-teal-50 transition-colors font-medium"
            >
              Look up your utility →
            </Link>
            <Link
              href="/pfas-watchlist"
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
            >
              PFAS watchlist
            </Link>
            <Link
              href="/treatment"
              className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
            >
              Treatment options
            </Link>
          </div>
        </section>

        <TestingTreatmentPath
          pageType="labs"
          contaminantSlugs={["pfas", "lead", "nitrates", "arsenic"]}
        />
        <RelatedWaterQuestions
          questions={[
            {
              question: "What do my utility's EPA records show before I test?",
              href: "/",
              description: "Search by ZIP code or utility name for violations, PFAS records, and official source links",
              eventName: "related_question_click",
              eventParams: { question: "utility_lookup", from: "labs" },
            },
            {
              question: "Which water systems have PFAS monitoring data?",
              href: "/pfas-watchlist",
              description: "Official EPA UCMR 5 PFAS monitoring records by utility and compound (2023–2025)",
              eventName: "related_question_click",
              eventParams: { question: "pfas_watchlist", from: "labs" },
            },
            {
              question: "What treatment removes PFAS from drinking water?",
              href: "/treatment/reverse-osmosis",
              description: "Reverse osmosis is the most effective point-of-use method for PFAS, lead, and arsenic",
              eventName: "related_question_click",
              eventParams: { question: "treatment_ro", from: "labs" },
            },
            {
              question: "What does EPA compliance data tell me about my water?",
              href: "/methodology",
              description: "How EPA SDWIS violations, UCMR 5 PFAS data, and CCR reports are sourced and displayed",
              eventName: "source_methodology_click",
              eventParams: { from: "labs" },
            },
            {
              question: "What contaminants should I test my well water for?",
              href: "/well-water",
              description: "State-by-state well water testing guidance — coliform, nitrate, arsenic, and more",
              eventName: "related_question_click",
              eventParams: { question: "well_water", from: "labs" },
            },
            {
              question: "How do I choose between reverse osmosis and carbon filtration?",
              href: "/guides/reverse-osmosis-vs-carbon-filter",
              description: "Side-by-side comparison of contaminant removal, cost, and maintenance",
              eventName: "related_question_click",
              eventParams: { question: "filter_guide", from: "labs" },
            },
          ]}
          title="Common Water Testing Questions"
        />
        <FaqSection faqs={labsFaqs} title="Water Testing FAQs" />
      </div>
    </div>
  );
}
