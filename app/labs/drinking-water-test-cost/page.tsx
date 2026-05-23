import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Droplets, FlaskConical } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How Much Does Water Testing Cost? (2026 Guide)",
  description: "Current cost ranges for drinking water testing — basic panels, PFAS, lead, bacteria, and full well water panels — plus free and low-cost options.",
  alternates: { canonical: "https://waterutilityreport.com/labs/drinking-water-test-cost" },
  openGraph: {
    title: "How Much Does Water Testing Cost? (2026 Guide)",
    description: "Current cost ranges for drinking water testing — basic panels, PFAS, lead, bacteria, and full well water panels — plus free and low-cost options.",
    url: "https://waterutilityreport.com/labs/drinking-water-test-cost",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "How much does it cost to test well water?",
    answer: "A basic well water panel — coliform bacteria, nitrate, and pH — typically costs $50–$150 at a state-certified laboratory. A more comprehensive panel that includes heavy metals, hardness, and basic chemistry runs $100–$300. Adding PFAS testing (EPA Method 537.1 or 533) typically adds $150–$400 to the cost. Some state programs subsidize well testing for qualifying households.",
  },
  {
    question: "How much does PFAS testing cost?",
    answer: "PFAS testing using EPA Method 537.1 or 533 typically costs $150–$450 per water sample depending on the laboratory and which method is ordered. Some labs offer combined method panels (537.1 + 533) at a higher price for broader compound coverage. Cost varies by region and lab.",
  },
  {
    question: "How much does a lead test for tap water cost?",
    answer: "A laboratory lead test (first-draw sample) typically costs $20–$60 per sample at a state-certified laboratory. Some utilities, state programs, or local health departments offer free or subsidized lead testing, especially for households with young children or pregnant residents. Check with your local health department first.",
  },
  {
    question: "Are there free water testing options?",
    answer: "Yes, in several circumstances. Some utilities offer free lead testing kits or subsidized sampling for customers. State-funded programs exist in some states for well users, rural households, or low-income residents. Superfund sites and certain contamination events trigger EPA- or state-funded testing programs for nearby residents. Contact your state drinking water program or local health department to ask what is available in your area.",
  },
  {
    question: "Can I trust a home test kit instead of a certified lab?",
    answer: "Home test strips and kits provide quick results for some parameters (pH, hardness, basic chlorine) and can be useful for screening. However, they are not equivalent to certified laboratory analysis for health decisions — accuracy is lower, detection limits are higher, and they do not cover PFAS or most regulated contaminants at relevant sensitivity. For any health-driven testing decision, use a state-certified or NELAP-accredited laboratory.",
  },
  {
    question: "How often should I pay for water testing?",
    answer: "For private well users, many state programs recommend at minimum annual testing for coliform bacteria and nitrate. Other contaminants can be tested every 3–5 years unless there are changes (new land use nearby, flooding, plumbing changes). For public utility users, your utility pays for its own mandatory monitoring. You would only pay for supplemental point-of-use testing if you have specific concerns about lead at your tap or PFAS.",
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
    { "@type": "ListItem", position: 3, name: "Drinking Water Test Cost", item: "https://waterutilityreport.com/labs/drinking-water-test-cost" },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How Much Does Water Testing Cost? (2026 Guide)",
  description: "Cost ranges for certified lab water testing — basic panels, PFAS, lead, bacteria, and full well panels. Plus free and low-cost options.",
  dateModified: "2026-05-13",
  publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
};

const costTable = [
  {
    test: "Basic bacteria (coliform / E. coli)",
    range: "$15 – $40",
    who: "Private well users as baseline test",
    link: null,
  },
  {
    test: "Nitrate",
    range: "$15 – $30",
    who: "Well users; agricultural areas; infant households",
    link: "/labs/nitrate-water-testing",
  },
  {
    test: "Basic well water panel (bacteria + nitrate + pH)",
    range: "$50 – $150",
    who: "Standard annual well test",
    link: "/labs/well-water-testing",
  },
  {
    test: "Comprehensive well water panel (metals, bacteria, chemistry)",
    range: "$100 – $300",
    who: "First-time well testing or major water quality review",
    link: "/labs/well-water-testing",
  },
  {
    test: "Lead (first-draw sample)",
    range: "$20 – $60",
    who: "Pre-1986 homes; households with children; any plumbing concern",
    link: "/labs/lead-water-testing",
  },
  {
    test: "PFAS (EPA Method 537.1)",
    range: "$150 – $350",
    who: "Near military, industrial, or utility with PFAS records",
    link: "/labs/pfas-water-testing",
  },
  {
    test: "PFAS (EPA Method 533)",
    range: "$150 – $400",
    who: "Broader PFAS compound coverage including shorter chains",
    link: "/labs/pfas-water-testing",
  },
  {
    test: "PFAS (Method 537.1 + 533 combined panel)",
    range: "$250 – $600",
    who: "Most comprehensive PFAS screening available",
    link: "/labs/pfas-water-testing",
  },
  {
    test: "VOCs (volatile organic compounds)",
    range: "$100 – $250",
    who: "Near industrial sites, gas stations, dry cleaners",
    link: null,
  },
  {
    test: "Arsenic",
    range: "$25 – $60",
    who: "Well users in geological risk areas (Southwest, New England)",
    link: "/contaminants/arsenic",
  },
  {
    test: "Full water quality panel (utilities equivalent)",
    range: "$300 – $700+",
    who: "Comprehensive screening for new well or specific complex concerns",
    link: null,
  },
];

const freeOptions = [
  {
    source: "Your water utility",
    desc: "Some utilities offer free lead test kits or sampling assistance for customers, especially in areas with older infrastructure or Lead and Copper Rule compliance actions.",
  },
  {
    source: "State drinking water programs",
    desc: "Many states fund well water testing assistance for rural households, low-income residents, or areas near known contamination. Contact your state's drinking water program.",
  },
  {
    source: "Local health departments",
    desc: "County or city health departments sometimes provide free or subsidized testing kits, particularly for lead and bacteria, in response to local water quality concerns.",
  },
  {
    source: "EPA Superfund site programs",
    desc: "Residents near active or former Superfund sites may be eligible for free testing funded by EPA or the responsible party. Contact the EPA regional office for your area.",
  },
  {
    source: "USDA / rural programs",
    desc: "The USDA Rural Development program and related programs provide well testing assistance in some rural areas. Availability varies by state and funding cycle.",
  },
];

export default function DrinkingWaterTestCostPage() {
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
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Cost Guide</p>
          <h1 className="font-display text-4xl text-white mb-3">How Much Does Water Testing Cost?</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Certified laboratory water testing ranges from $15 for a single parameter to $600+ for
            comprehensive multi-contaminant panels. PFAS testing is the most expensive single test.
            Free and subsidized options exist in many states.
          </p>
          <p className="text-white/40 text-xs mt-4 font-mono">Last updated: 2026-05-13 · Cost ranges are approximate national averages</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct answer */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Direct Answer</p>
          <p className="text-foreground leading-relaxed">
            A basic well water test (bacteria + nitrate) costs <strong>$50–$150</strong> at a certified lab.
            PFAS testing costs <strong>$150–$450</strong> per sample. Lead testing costs <strong>$20–$60</strong>.
            Some utilities, state programs, and local health departments offer free or subsidized testing
            — check before paying. Home test kits ($15–$50) provide limited screening but are not equivalent
            to certified lab analysis.
          </p>
        </section>

        {/* Important disclaimer */}
        <section>
          <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-caution shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-wur-caution mb-1">Cost ranges are general estimates</p>
              <p className="text-sm text-wur-caution/80 leading-relaxed">
                Lab pricing varies significantly by region, laboratory, method, and number of parameters.
                Contact the specific lab for a quote before ordering. The ranges below are national
                approximations based on publicly listed and reported lab pricing as of 2026.
              </p>
            </div>
          </div>
        </section>

        {/* Cost table */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Water Testing Cost by Type</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Test / Panel</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Typical Range</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Most Relevant For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {costTable.map((row) => (
                  <tr key={row.test} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground text-xs">
                      {row.link ? (
                        <Link href={row.link} className="text-wur-teal hover:underline">{row.test}</Link>
                      ) : row.test}
                    </td>
                    <td className="px-4 py-3 font-semibold text-foreground text-xs font-mono">{row.range}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.who}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Prices are approximate and based on state-certified laboratory published pricing.
            Contact labs directly for current quotes.
          </p>
        </section>

        {/* Free options */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Free and Low-Cost Water Testing Options</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-5">
            Before paying out of pocket, check whether any of these resources apply to your situation:
          </p>
          <div className="space-y-3">
            {freeOptions.map((item) => (
              <div key={item.source} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{item.source}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Home kit vs lab */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Home Test Kits vs. Certified Lab: What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Home Test Kit ($15–$50)</p>
              <ul className="space-y-2">
                {[
                  "Quick results (minutes)",
                  "Limited to basic parameters (pH, hardness, chlorine, nitrate dip strips)",
                  "Does not test for PFAS, lead at relevant levels, VOCs",
                  "Higher detection limits — misses low-level contamination",
                  "Not accepted for regulatory purposes",
                  "Useful for quick screening only",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground shrink-0 mt-1.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-wur-teal/20 bg-wur-teal/5">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Certified Lab ($20–$600+)</p>
              <ul className="space-y-2">
                {[
                  "5–15 business day turnaround",
                  "Covers PFAS, lead, bacteria, VOCs, metals, and more",
                  "Lower detection limits — finds contamination at regulatory levels",
                  "Chain-of-custody documentation",
                  "Accepted for regulatory, legal, and health decisions",
                  "Required for accurate health-driven decisions",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-wur-teal shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Tips to save */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Tips to Reduce Testing Costs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { tip: "Start with your utility's existing data", desc: "For public utility users: check compliance records and the PFAS Watchlist before ordering any testing. Your utility may already monitor for your concern." },
              { tip: "Test for the most likely contaminants first", desc: "If your primary concern is lead, test for lead. If it is PFAS, test for PFAS. Don't pay for a full panel if one contaminant is the specific concern." },
              { tip: "Ask about state programs", desc: "Many states fund testing assistance for well users, rural households, or specific contamination events. Call your state drinking water program before ordering." },
              { tip: "Group well tests together", desc: "If you need multiple tests — bacteria, nitrate, arsenic, and lead — ordering them together from the same lab typically costs less than ordering separately." },
            ].map((item) => (
              <div key={item.tip} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <Droplets className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{item.tip}</p>
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
              { href: "/labs", label: "Find a certified water testing lab", desc: "State-certified and NELAP-accredited labs near you" },
              { href: "/labs/what-to-test-for-in-drinking-water", label: "What to test for in drinking water", desc: "Match contaminant tests to your situation" },
              { href: "/labs/pfas-water-testing", label: "PFAS testing guide", desc: "Lab methods, cost, and result interpretation" },
              { href: "/labs/lead-water-testing", label: "Lead testing guide", desc: "First-draw protocol and cost options" },
              { href: "/labs/well-water-testing", label: "Well water testing guide", desc: "What private well users should test and when" },
              { href: "/labs/how-to-read-water-test-results", label: "How to read water test results", desc: "Interpreting your lab report against EPA benchmarks" },
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

        <FaqSection faqs={faqs} title="Water Testing Cost FAQs" />

        {/* Sources */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Methodology Note</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Cost ranges reflect publicly published pricing from certified laboratories, state drinking
            water program guidance, and published research on water testing costs as of 2026. Prices
            vary by lab and region — contact labs directly for current quotes.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">Full methodology →</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "EPA Certified Lab Directory", url: "https://www.epa.gov/dwlabcert" },
              { label: "NELAP Accreditation", url: "https://www.nist.gov/nvlap/nelap" },
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
