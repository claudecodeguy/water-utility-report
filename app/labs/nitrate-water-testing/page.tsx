import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Droplets, FlaskConical } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nitrate Water Testing: What Nitrate Levels Mean and How To Test",
  description: "How to test drinking water for nitrate, what the EPA limit is, why nitrate matters for infants, and which treatment options reduce nitrate in water.",
  alternates: { canonical: "https://waterutilityreport.com/labs/nitrate-water-testing" },
  openGraph: {
    title: "Nitrate Water Testing: What Nitrate Levels Mean and How To Test",
    description: "How to test drinking water for nitrate, what the EPA limit is, why nitrate matters for infants, and which treatment options reduce nitrate in water.",
    url: "https://waterutilityreport.com/labs/nitrate-water-testing",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "What is the EPA limit for nitrate in drinking water?",
    answer: "The EPA Maximum Contaminant Level (MCL) for nitrate in public drinking water is 10 mg/L (milligrams per liter), also expressed as 10 ppm (parts per million) as nitrogen. For nitrite, the MCL is 1 mg/L. The combined nitrate + nitrite MCL is also 10 mg/L. These MCLs apply to public water systems — private wells are not regulated under these rules.",
  },
  {
    question: "Why is nitrate dangerous for infants?",
    answer: "Nitrate in drinking water is converted to nitrite in the body. In infants under 6 months, nitrite interferes with hemoglobin's ability to carry oxygen, causing a condition called methemoglobinemia (blue baby syndrome). Adults and older children are much less susceptible because stomach acid inhibits the bacteria that convert nitrate to nitrite. The EPA MCL of 10 mg/L is specifically designed to protect infants.",
  },
  {
    question: "Can boiling water remove nitrate?",
    answer: "No. Boiling does not remove nitrate — it concentrates it. As water evaporates during boiling, the nitrate concentration in the remaining water increases. Do not use boiled water for infant formula if nitrate is a concern.",
  },
  {
    question: "Where does nitrate in water come from?",
    answer: "The most common sources of nitrate in drinking water are fertilizers applied to agricultural land, animal waste (feedlots, manure), and septic systems. Nitrate leaches through soil into groundwater, where it enters private wells and sometimes public water supply sources. Areas with intensive agriculture, particularly corn-belt and livestock regions, tend to have higher nitrate levels in groundwater.",
  },
  {
    question: "Do I need to test for nitrate if I'm on a public water system?",
    answer: "Public utilities are required to test for nitrate and report violations. If your utility has had nitrate exceedances, that would appear in compliance data and Consumer Confidence Reports. For public utility users, checking your utility's compliance history is the starting point. Private well users are not covered by utility monitoring and are responsible for their own testing.",
  },
  {
    question: "What filters remove nitrate from water?",
    answer: "Reverse osmosis (RO) is the most effective point-of-use method for nitrate removal. Ion exchange systems (specifically anion exchange with nitrate-selective resin) are also effective. Standard activated carbon filters do not reliably remove nitrate. Distillation also removes nitrate. Look for NSF/ANSI 58 certification (RO) or NSF/ANSI 62 (distillation) for certified performance.",
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
    { "@type": "ListItem", position: 3, name: "Nitrate Water Testing", item: "https://waterutilityreport.com/labs/nitrate-water-testing" },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Nitrate Water Testing: What Nitrate Levels Mean and How To Test",
  description: "Nitrate MCL, infant health risk, testing methods, and treatment options for nitrate in drinking water.",
  dateModified: "2026-05-13",
  publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
};

export default function NitrateWaterTestingPage() {
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
          <h1 className="font-display text-4xl text-white mb-3">Nitrate Water Testing: What Nitrate Levels Mean and How To Test</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Nitrate is one of the most common contaminants in private well water in agricultural regions.
            The EPA maximum contaminant level of 10 mg/L is specifically set to protect infants.
            Boiling water does not remove nitrate — it concentrates it.
          </p>
          <p className="text-white/40 text-xs mt-4 font-mono">Last updated: 2026-05-13 · Source: EPA, CDC</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct answer */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Direct Answer</p>
          <p className="text-foreground leading-relaxed">
            The EPA MCL for nitrate is <strong>10 mg/L</strong>. Above this level, nitrate poses a documented
            health risk to infants under 6 months (methemoglobinemia). Private well users in agricultural
            areas are most likely to encounter elevated nitrate — annual testing is commonly recommended.
            Standard carbon filters do not remove nitrate; reverse osmosis and ion exchange do.
          </p>
        </section>

        {/* Infant warning */}
        <section>
          <div className="rounded-xl border border-wur-warning-border bg-wur-warning-bg p-5 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-wur-warning mb-1">Important for households with infants under 6 months</p>
              <p className="text-sm text-wur-warning/80 leading-relaxed">
                Do not use water with nitrate above 10 mg/L for infant formula. Do not boil the water —
                boiling concentrates nitrate. Use bottled water or a certified reverse osmosis system while
                awaiting test results or if results exceed 10 mg/L.
              </p>
            </div>
          </div>
        </section>

        {/* Where nitrate comes from */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Where Nitrate in Water Comes From</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                source: "Agricultural fertilizers",
                desc: "Nitrogen-based fertilizers applied to cropland leach through soil into groundwater. Corn-belt states and other intensive agriculture regions show the highest nitrate levels in groundwater monitoring data.",
              },
              {
                source: "Animal waste",
                desc: "Feedlots, manure lagoons, and pasture land contribute nitrate to groundwater through runoff and soil infiltration. Proximity to concentrated animal feeding operations (CAFOs) increases risk.",
              },
              {
                source: "Septic systems",
                desc: "Improperly sited, failing, or overloaded septic systems can introduce nitrate into surrounding groundwater. Older septic systems in high-density areas are a documented source.",
              },
            ].map((item) => (
              <div key={item.source} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-2">{item.source}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who should test */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Who Should Test for Nitrate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Private well users in agricultural areas", note: "Highest risk group; annual testing commonly recommended" },
              { label: "Households with infants under 6 months", note: "Infant health risk applies even at moderate levels" },
              { label: "Households near feedlots or CAFOs", note: "Proximity to concentrated animal operations increases groundwater nitrate" },
              { label: "Households with older or failing septic systems", note: "Especially if well is downgradient of the septic field" },
              { label: "Households with shallow wells", note: "Shallower wells are more susceptible to surface contamination" },
              { label: "Anyone whose utility has reported nitrate violations", note: "Check your utility's compliance history first" },
            ].map((item) => (
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

        {/* How to test */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">How To Test for Nitrate</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Find a certified lab",
                desc: "Nitrate testing is included in most standard water panels at state-certified laboratories. Use the EPA certified lab directory or your state health department's list. Confirm nitrate (and nitrite if desired) are included.",
              },
              {
                step: "02",
                title: "Collect a water sample",
                desc: "Nitrate sampling does not require the first-draw protocol used for lead. Follow your lab's collection instructions. For well samples, collect from the tap closest to the pressure tank.",
              },
              {
                step: "03",
                title: "Compare results to the MCL",
                desc: "Results are reported in mg/L (ppm) as nitrogen. The EPA MCL is 10 mg/L. If results are near or above this level, consult your state health department and evaluate treatment options.",
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
          <h2 className="font-display text-2xl text-foreground mb-4">Nitrate Benchmarks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "EPA MCL for nitrate (as N)", value: "10 mg/L", context: "Health-based limit for public utilities; reference for wells" },
              { label: "EPA MCL for nitrite (as N)", value: "1 mg/L", context: "Separate limit for nitrite compound" },
              { label: "Combined nitrate + nitrite MCL", value: "10 mg/L", context: "Total combined limit" },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-lg border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                <p className="text-2xl font-semibold text-foreground font-mono">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.context}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Treatment */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Nitrate Treatment Options</h2>
          <div className="space-y-3">
            {[
              {
                title: "Reverse osmosis (RO) — most common point-of-use option",
                desc: "RO membranes reject nitrate effectively. NSF/ANSI Standard 58 covers reverse osmosis systems for nitrate reduction. Undersink RO systems treat water at a single tap. Effective for both nitrate and nitrite.",
                effective: true,
              },
              {
                title: "Ion exchange (anion exchange with nitrate-selective resin)",
                desc: "Anion exchange systems are effective for nitrate removal. Standard water softeners (cation exchange) do not remove nitrate. Systems must use nitrate-selective resin, not general-purpose softener resin.",
                effective: true,
              },
              {
                title: "Distillation",
                desc: "Distillation removes nitrate. NSF/ANSI 62 certifies distillation units. Distillers are generally slower and higher-maintenance than RO systems for residential use.",
                effective: true,
              },
              {
                title: "Activated carbon filters — not effective for nitrate",
                desc: "Standard carbon block or GAC filters do not reliably remove nitrate. Do not rely on a carbon filter for nitrate removal.",
                effective: false,
              },
            ].map((item) => (
              <div key={item.title} className={`flex items-start gap-3 p-4 rounded-lg border ${item.effective ? "border-border bg-card" : "border-wur-caution-border bg-wur-caution-bg/30"}`}>
                {item.effective ? (
                  <CheckCircle2 className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-wur-caution shrink-0 mt-0.5" />
                )}
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
              { href: "/labs", label: "Find a certified water testing lab", desc: "State-certified and NELAP-accredited labs" },
              { href: "/contaminants/nitrates", label: "Nitrate contaminant guide", desc: "Health context, EPA limits, and geographic prevalence" },
              { href: "/labs/well-water-testing", label: "Well water testing guide", desc: "Nitrate is a baseline test for private well users" },
              { href: "/treatment/reverse-osmosis", label: "Reverse osmosis treatment guide", desc: "How RO removes nitrate and other contaminants" },
              { href: "/labs/what-to-test-for-in-drinking-water", label: "What to test for in drinking water", desc: "Full guide by contaminant and situation" },
              { href: "/labs/how-to-read-water-test-results", label: "How to read water test results", desc: "Interpreting mg/L and ppm in lab reports" },
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

        <FaqSection faqs={faqs} title="Nitrate Water Testing FAQs" />

        {/* Sources */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Data Sources and Methodology</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Nitrate guidance is drawn from EPA National Primary Drinking Water Regulations, EPA health
            advisories, CDC methemoglobinemia guidance, and USGS groundwater quality research.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">Full methodology →</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "EPA Nitrate MCL", url: "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations" },
              { label: "CDC Methemoglobinemia", url: "https://www.cdc.gov/niosh/topics/emres/chemlead.html" },
              { label: "USGS Nitrate in Groundwater", url: "https://www.usgs.gov/special-topics/water-science-school/science/nitrates-and-water" },
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
