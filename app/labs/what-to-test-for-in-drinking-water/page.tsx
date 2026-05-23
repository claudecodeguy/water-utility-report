import Link from "next/link";
import { ArrowLeft, CheckCircle2, ExternalLink, Droplets, FlaskConical } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "What To Test For in Drinking Water: A Complete Guide",
  description: "Which contaminants to test for in tap water or well water, what the tests cover, and how to choose the right panel for your situation.",
  alternates: { canonical: "https://waterutilityreport.com/labs/what-to-test-for-in-drinking-water" },
  openGraph: {
    title: "What To Test For in Drinking Water: A Complete Guide",
    description: "Which contaminants to test for in tap water or well water, what the tests cover, and how to choose the right panel for your situation.",
    url: "https://waterutilityreport.com/labs/what-to-test-for-in-drinking-water",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "What is the most important thing to test for in drinking water?",
    answer: "There is no single universal answer — the most relevant tests depend on your water source and location. For public utility users, checking official compliance data for your utility is the starting point. For private well users, coliform bacteria and nitrate are commonly recommended as baseline tests. PFAS testing is increasingly relevant near industrial or military sites.",
  },
  {
    question: "Do I need to test my water if I'm on a public water system?",
    answer: "Your public utility is required to test the water it delivers and report results annually in a Consumer Confidence Report (CCR). However, if you have specific concerns about lead from your home's plumbing, PFAS at the tap, or water quality changes, point-of-use testing can give you the most direct data about what is at your faucet.",
  },
  {
    question: "What does a basic water quality test panel include?",
    answer: "A basic panel typically covers pH, hardness, chlorine/chloramines, turbidity, nitrate, coliform bacteria, and sometimes a handful of heavy metals. PFAS, lead, and volatile organic compounds (VOCs) usually require separate or upgraded panels. Always confirm what is included with the specific lab before ordering.",
  },
  {
    question: "Is bottled water safer than tap water?",
    answer: "Bottled water is regulated by FDA, while public tap water is regulated by EPA. Neither is universally safer than the other. Some bottled water is sourced from municipal water systems. The most accurate comparison requires reviewing the specific source and testing data for both. This page covers what to test for in tap water specifically.",
  },
  {
    question: "How do I know which contaminants are most relevant to my location?",
    answer: "Your state's drinking water program, local health department, and EPA's ECHO compliance database are the primary sources for location-specific water quality data. Our PFAS Watchlist and utility compliance pages surface EPA monitoring data by utility and state. Proximity to industrial sites, military bases, agriculture, and legacy contamination sites affects which tests are most relevant.",
  },
  {
    question: "Can I test for everything in one panel?",
    answer: "No single panel covers all possible contaminants. Standard panels cover common indicators and regulated contaminants. PFAS requires a specialized panel (EPA Method 537.1 or 533). Volatile organic compounds (VOCs) are a separate analysis. Lead testing for household plumbing is separate from a utility-level metals panel. Tell the lab your specific concerns so they can recommend the right test combination.",
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
    { "@type": "ListItem", position: 3, name: "What To Test For in Drinking Water", item: "https://waterutilityreport.com/labs/what-to-test-for-in-drinking-water" },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What To Test For in Drinking Water: A Complete Guide",
  description: "Which contaminants to test for in tap water or well water based on source and situation.",
  dateModified: "2026-05-13",
  publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
};

const contaminantRows = [
  {
    name: "Coliform bacteria / E. coli",
    source: "Sewage, animal waste, surface water intrusion",
    who: "Private well users (required baseline)",
    regulated: "Yes — EPA MCL of 0",
    link: "/contaminants/bacteria",
  },
  {
    name: "Nitrate",
    source: "Agricultural fertilizer, septic systems, animal waste",
    who: "Well users in agricultural areas; infant households",
    regulated: "Yes — 10 mg/L MCL",
    link: "/contaminants/nitrates",
  },
  {
    name: "Lead",
    source: "Older household plumbing, service lines, fixtures",
    who: "Homes built before 1986; anyone with older plumbing",
    regulated: "Yes — 15 ppb action level (utilities)",
    link: "/contaminants/lead",
  },
  {
    name: "PFAS (PFOA, PFOS, PFNA, and others)",
    source: "Industrial sites, military AFFF firefighting foam, consumer products",
    who: "Near military bases, industrial sites, utilities with PFAS records",
    regulated: "Yes — EPA MCLs finalized April 2024",
    link: "/contaminants/pfas",
  },
  {
    name: "Arsenic",
    source: "Natural geology, mining, smelting",
    who: "Private wells in affected regions (Southwest, New England, Midwest)",
    regulated: "Yes — 10 ppb MCL",
    link: "/contaminants/arsenic",
  },
  {
    name: "pH",
    source: "Source water chemistry, treatment",
    who: "Well users and anyone with corrosion concerns",
    regulated: "Secondary standard only (6.5–8.5)",
    link: "/contaminants/ph",
  },
  {
    name: "Hardness (calcium/magnesium)",
    source: "Natural geology (limestone, dolomite)",
    who: "Households with scale buildup or appliance concerns",
    regulated: "No federal MCL",
    link: "/contaminants/hard-water",
  },
  {
    name: "Volatile organic compounds (VOCs)",
    source: "Solvents, fuel, dry-cleaning chemicals",
    who: "Near gas stations, industrial sites, dry cleaners",
    regulated: "Yes — EPA MCLs for individual VOCs",
    link: "/contaminants/vocs",
  },
  {
    name: "Radon",
    source: "Radioactive decay in rock and soil (groundwater)",
    who: "Private well users in radon-affected geological regions",
    regulated: "No federal MCL for water (proposed); state standards vary",
    link: "/contaminants/radon",
  },
  {
    name: "Iron and manganese",
    source: "Natural geology, corrosion",
    who: "Anyone with discoloration, staining, or taste issues",
    regulated: "Secondary standards only",
    link: "/contaminants/iron-and-manganese",
  },
];

const scenarios = [
  {
    label: "I'm on a public water utility",
    steps: [
      "Check your utility's official compliance records on this site or via EPA ECHO",
      "Review your annual Consumer Confidence Report (CCR)",
      "For lead concerns: test at the tap using a first-draw lead sample",
      "For PFAS concerns: check PFAS Watchlist, then consider point-of-use testing",
    ],
    links: [{ href: "/", label: "Look up your utility →" }, { href: "/pfas-watchlist", label: "PFAS Watchlist →" }],
  },
  {
    label: "I have a private well",
    steps: [
      "Minimum baseline: coliform bacteria, nitrate, pH",
      "Additional priority tests based on your state health dept recommendations",
      "PFAS if near industrial, military, or landfill sites",
      "Lead if your well pump, casing, or plumbing contains older materials",
      "Arsenic if in a geological region with documented natural arsenic",
    ],
    links: [{ href: "/labs/well-water-testing", label: "Well water testing guide →" }, { href: "/labs", label: "Find a certified lab →" }],
  },
  {
    label: "I have a specific concern",
    steps: [
      "PFAS: requires EPA Method 537.1 or 533 at a certified lab — see PFAS testing guide",
      "Lead: use a first-draw sample protocol — do not pre-flush before collection",
      "Nitrate: relevant for infants; any certified lab running standard water panels",
      "Bacteria: collect sample as instructed by the lab to avoid contamination",
    ],
    links: [{ href: "/labs/pfas-water-testing", label: "PFAS testing guide →" }, { href: "/labs/lead-water-testing", label: "Lead testing guide →" }],
  },
];

export default function WhatToTestForPage() {
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
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Testing Guide</p>
          <h1 className="font-display text-4xl text-white mb-3">What To Test For in Drinking Water</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            The right tests depend on your water source, location, and specific concerns.
            Public utility users have different starting points than private well users.
            This guide maps common contaminants to the situations where they are most relevant.
          </p>
          <p className="text-white/40 text-xs mt-4 font-mono">Last updated: 2026-05-13 · Source: EPA, CDC, state health programs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct answer */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Direct Answer</p>
          <p className="text-foreground leading-relaxed">
            For <strong>public utility users</strong>: start by checking your utility&apos;s official compliance
            data. Your utility tests the water it delivers. If you have specific concerns — lead from
            household plumbing, PFAS at the tap — point-of-use testing gives the most direct data.{" "}
            For <strong>private well users</strong>: coliform bacteria and nitrate are the most common
            baseline tests, with additional tests depending on location and local contamination concerns.
          </p>
        </section>

        {/* Contaminant table */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Common Drinking Water Contaminants by Situation</h2>
          <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
            Not every contaminant is equally relevant to every household. The table below maps each
            contaminant to the situations where testing is most commonly warranted.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Contaminant</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Common Source</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Most Relevant For</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Regulated?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contaminantRows.map((row) => (
                  <tr key={row.name} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">
                      {row.link ? (
                        <Link href={row.link} className="text-wur-teal hover:underline">{row.name}</Link>
                      ) : row.name}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.source}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.who}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.regulated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            This list covers common testing scenarios — not all possible contaminants.
            State drinking water programs publish priority contaminant lists for your region.
          </p>
        </section>

        {/* By situation */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">What To Test For — By Situation</h2>
          <div className="space-y-5">
            {scenarios.map((scenario) => (
              <div key={scenario.label} className="p-6 rounded-xl border border-border bg-card">
                <p className="font-display text-lg text-foreground mb-4">{scenario.label}</p>
                <ul className="space-y-2 mb-4">
                  {scenario.steps.map((step) => (
                    <li key={step} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {scenario.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex items-center text-xs font-semibold text-wur-teal hover:underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Public vs well comparison */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">Public Utility vs. Private Well: Key Differences</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Public Water Utility</p>
              <ul className="space-y-2">
                {[
                  "Regulated under EPA Safe Drinking Water Act",
                  "Required to test and report on schedule",
                  "Results published in annual Consumer Confidence Report",
                  "You can look up compliance data by utility or state",
                  "You are still responsible for lead in your own plumbing",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Droplets className="w-3.5 h-3.5 text-wur-teal shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-5 rounded-xl border border-border bg-card">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Private Well</p>
              <ul className="space-y-2">
                {[
                  "Not covered by federal Safe Drinking Water Act utility rules",
                  "Household is responsible for testing decisions",
                  "No required testing schedule — state guidance varies",
                  "Most state programs recommend annual coliform and nitrate tests",
                  "No CCR; results depend on what you order",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Droplets className="w-3.5 h-3.5 text-wur-teal shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Next steps */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="font-display text-xl text-foreground mb-4">Explore Testing by Concern</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { href: "/labs/pfas-water-testing", label: "PFAS water testing", desc: "Lab methods, cost, and treatment for PFAS" },
              { href: "/labs/lead-water-testing", label: "Lead water testing", desc: "First-draw protocol and what results mean" },
              { href: "/labs/nitrate-water-testing", label: "Nitrate water testing", desc: "Especially relevant for well users and infant households" },
              { href: "/labs/well-water-testing", label: "Well water testing guide", desc: "Private well baseline testing and what to order" },
              { href: "/labs/how-to-read-water-test-results", label: "How to read water test results", desc: "Interpreting lab reports against EPA benchmarks" },
              { href: "/labs", label: "Find a certified lab", desc: "State-certified and NELAP-accredited labs" },
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

        <FaqSection faqs={faqs} title="Drinking Water Testing FAQs" />

        {/* Sources */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Data Sources and Methodology</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Contaminant information is drawn from EPA maximum contaminant levels, health advisories,
            CDC drinking water guidance, and state drinking water program resources. Regulatory status
            reflects federal standards; state standards may be stricter.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">Full methodology →</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "EPA Drinking Water Contaminants", url: "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations" },
              { label: "CDC Drinking Water Health", url: "https://www.cdc.gov/healthywater/drinking/index.html" },
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
