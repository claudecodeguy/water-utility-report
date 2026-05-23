import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Building2, AlertTriangle, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import FaqSection from "@/components/faq-section";
import SourcesBlock from "@/components/sources-block";
import JsonLd from "@/components/json-ld";
import ZipLookup from "@/components/zip-lookup";
import stateContent from "@/lib/content/states";
import {
  arsenicStateData,
  ARSENIC_SOURCES,
  ARSENIC_LAST_UPDATED,
  ARSENIC_STATE_SLUGS,
  type ArsenicStateData,
} from "@/lib/content/arsenic-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateStaticParams() {
  return ARSENIC_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const data = arsenicStateData[stateSlug];
  if (!data) return {};
  const canonical = `https://waterutilityreport.com/contaminants/arsenic/${stateSlug}`;
  const title = `Arsenic in ${data.stateName} Drinking Water: Sources, Testing & Removal`;
  const description = `Arsenic in ${data.stateName} drinking water — natural geology sources, private well risk, which utilities have violation records, how to test, and how to remove arsenic from tap water.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function ArsenicStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const data = arsenicStateData[stateSlug];
  if (!data) notFound();

  const stateInfo = stateContent.find((s) => s.slug === stateSlug);

  const [stateRecord, utilitiesWithArsenicViolations] = await Promise.all([
    prisma.state.findFirst({ where: { abbreviation: data.stateAbbr } }),
    prisma.utility.findMany({
      where: {
        publish_status: "published",
        state: { abbreviation: data.stateAbbr },
        violations: {
          some: { contaminant_name: { contains: "arsenic", mode: "insensitive" } },
        },
      },
      select: {
        slug: true, name: true, risk_level: true, population_served: true,
        city_served: true,
        state: { select: { abbreviation: true } },
      },
      orderBy: { population_served: "desc" },
      take: 10,
    }),
  ]);

  const topUtilities = stateRecord
    ? await prisma.utility.findMany({
        where: {
          publish_status: "published",
          state_id: stateRecord.id,
          population_served: { gte: 50000 },
        },
        select: {
          slug: true, name: true, risk_level: true, population_served: true,
        },
        orderBy: { population_served: "desc" },
        take: 5,
      })
    : [];

  const riskBgs: Record<string, string> = {
    safe: "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
    low: "text-emerald-700 bg-emerald-50 border-emerald-200",
    moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
    high: "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
    critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
  };

  const faqs = [
    {
      question: `Is arsenic in drinking water a concern in ${data.stateName}?`,
      answer: data.quickAnswers.isRealConcern,
    },
    {
      question: "Where does arsenic in water come from?",
      answer: `Arsenic in drinking water is almost always naturally occurring — it leaches from arsenic-bearing rocks and minerals into groundwater over time. ${data.stateName} geology includes ${data.quickAnswers.primaryRoute} It is not typically the result of industrial pollution, though mining and agriculture can contribute arsenic to surface water and groundwater in some regions.`,
    },
    {
      question: "What is the EPA limit for arsenic in water?",
      answer: "The EPA Maximum Contaminant Level (MCL) for arsenic is 10 µg/L (10 parts per billion). The MCLG — the level at which no health risk is established — is zero. Arsenic is a Group A human carcinogen, meaning no safe exposure level has been scientifically established. Some states and health authorities recommend that action be taken at levels below the federal MCL.",
    },
    {
      question: `Does arsenic affect private well water in ${data.stateName}?`,
      answer: data.quickAnswers.mainReason,
    },
    {
      question: "What filter removes arsenic?",
      answer: "The most effective residential treatment options for arsenic: (1) Reverse osmosis (RO) — NSF/ANSI 58 certified systems remove 85–95% of arsenic. (2) Activated alumina filters — specifically designed for arsenic and fluoride removal. (3) Iron/manganese oxidation filters — effective for arsenic in iron-rich well water. Activated carbon (Brita, etc.) does NOT effectively remove arsenic. Always choose a product certified by NSF International or WQA for arsenic reduction.",
    },
    {
      question: "Does boiling water remove arsenic?",
      answer: "No. Boiling concentrates arsenic rather than removing it. Only certified filtration effectively reduces arsenic in drinking water.",
    },
    {
      question: `How do I test my well water for arsenic in ${data.stateName}?`,
      answer: `Order a test from a ${data.stateName}-certified laboratory. Your ${data.agencyName} maintains a list of certified labs. A basic arsenic test costs $15–$40; a comprehensive well water panel runs $150–$250. Well water should be tested for arsenic at least once, and again after any nearby construction, flooding, or changes in water appearance or taste.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `Arsenic In Drinking Water In ${data.stateName}: Sources, Risks & Removal`,
    dateModified: ARSENIC_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "Arsenic", item: "https://waterutilityreport.com/contaminants/arsenic" },
      { "@type": "ListItem", position: 4, name: data.stateName, item: `https://waterutilityreport.com/contaminants/arsenic/${stateSlug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <div className="bg-wur-warning-bg border-b border-wur-warning-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 flex-wrap">
            <Link href="/contaminants" className="hover:text-primary transition-colors">Contaminants</Link>
            <span>›</span>
            <Link href="/contaminants/arsenic" className="hover:text-primary transition-colors">Arsenic</Link>
            <span>›</span>
            <span className="text-foreground font-medium">{data.stateName}</span>
          </nav>
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-wur-warning mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-wur-warning">High Risk Level</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium text-wur-warning bg-wur-warning-bg border-wur-warning-border">Heavy Metals</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-3">
                Arsenic in Drinking Water in {data.stateName}
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                What residents of {data.stateName} need to know about arsenic in drinking water — including natural geological sources, private well risk, which utilities have documented violations, and how to remove arsenic from tap water.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA SDWIS, {data.agencyName}, USGS · Last reviewed: {ARSENIC_LAST_UPDATED}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick answer block */}
            <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal">Quick Answer</p>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Is arsenic in drinking water a concern in {data.stateName}?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.quickAnswers.isRealConcern}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Where does arsenic come from in {data.stateName}&apos;s water?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.quickAnswers.primaryRoute}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">What should {data.stateName} residents know?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.quickAnswers.mainReason}</p>
              </div>
            </section>

            {/* Key facts table */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Key Facts</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {data.keyFacts.map(({ label, value }, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                        <td className="px-4 py-3 font-medium text-foreground w-2/5 align-top">{label}</td>
                        <td className="px-4 py-3 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Why it matters */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">
                Why Arsenic Matters in {data.stateName}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{data.whyItMatters}</p>
              {data.historicalContext && (
                <div className="rounded-lg border border-wur-caution-border bg-wur-caution-bg p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-wur-caution mb-1">Historical Context</p>
                  <p className="text-sm text-wur-caution/90 leading-relaxed">{data.historicalContext}</p>
                </div>
              )}
            </section>

            {/* State Arsenic Program */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">{data.stateName} Arsenic Program</h2>
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full border ${
                  (data as ArsenicStateData).geologicRisk === "high"
                    ? "text-wur-danger bg-wur-danger-bg border-wur-danger-border"
                    : (data as ArsenicStateData).geologicRisk === "moderate"
                    ? "text-wur-warning bg-wur-warning-bg border-wur-warning-border"
                    : "text-wur-safe bg-wur-safe-bg border-wur-safe-border"
                }`}>
                  {(data as ArsenicStateData).geologicRisk} geologic risk
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{(data as ArsenicStateData).stateProgramNote}</p>
            </section>

            {/* Utility examples */}
            {utilitiesWithArsenicViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  {data.stateName} Utilities With Arsenic Violation Records
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  The utilities listed below have at least one arsenic violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status and risk level.
                </p>
                <div className="space-y-2">
                  {utilitiesWithArsenicViolations.map((u) => (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Building2 className="w-4 h-4 text-wur-teal shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{normalizeName(u.name)}</p>
                          <p className="text-xs text-muted-foreground">{u.city_served ?? data.stateName} · {u.population_served.toLocaleString()} served</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${riskBgs[u.risk_level] ?? riskBgs.safe}`}>{u.risk_level}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Top utilities if no violations found */}
            {utilitiesWithArsenicViolations.length === 0 && topUtilities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Largest {data.stateName} Water Utilities
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  No arsenic violations on record in EPA SDWIS for {data.stateName} utilities in our database. Browse the largest utilities to review their full water quality record.
                </p>
                <div className="space-y-2">
                  {topUtilities.map((u) => (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Building2 className="w-4 h-4 text-wur-teal shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{normalizeName(u.name)}</p>
                          <p className="text-xs text-muted-foreground">{u.population_served.toLocaleString()} served</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${riskBgs[u.risk_level] ?? riskBgs.safe}`}>{u.risk_level}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* How arsenic gets in — condensed callout */}
            <section className="rounded-lg border border-wur-teal/20 bg-wur-teal/5 p-5">
              <p className="text-sm font-semibold text-foreground mb-2">How Does Arsenic Get Into Drinking Water?</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                Arsenic in drinking water is almost always naturally occurring — it leaches from arsenic-bearing rocks and minerals into groundwater over time. New England granite, Southwest volcanic geology, and Upper Midwest glacial aquifers are the primary high-risk formations. It has no taste, odor, or color.
              </p>
              <Link href="/contaminants/arsenic" className="text-sm text-wur-teal hover:underline inline-flex items-center gap-1">
                Full arsenic overview — geology maps, health effects, all 50 states <ArrowRight className="w-3 h-3" />
              </Link>
            </section>

            {/* Who should pay attention */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Who Should Pay Closest Attention</h2>
              <p className="text-sm text-muted-foreground mb-3">{data.demographicNote}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Private well owners near mining districts or agricultural areas",
                  "Residents in states with documented volcanic or geothermal geology",
                  "Long-term consumers of water from small groundwater systems",
                  "Households in homes built before 1960 with older well casings",
                  "Residents whose well water has never been tested for arsenic",
                  "Anyone living in a state where bedrock wells are common",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 p-3 rounded-lg bg-wur-warning-bg border border-wur-warning-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-warning mt-1.5 shrink-0" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How to check */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How to Check Your Situation in {data.stateName}</h2>
              <ol className="space-y-3">
                {[
                  `Identify your water source. If you use a public utility, use the ZIP lookup on this page to find your system and check its compliance record.`,
                  `If on public water, review your utility's most recent Consumer Confidence Report (CCR) for arsenic monitoring data. The MCL is 10 ppb — your report should show recent test results.`,
                  `If on a private well, order an arsenic test from a ${data.agencyName}-certified laboratory. A basic arsenic test costs $15–$40. The state agency website maintains a certified lab list.`,
                  `Test your well at the tap — not just at the wellhead. The entire water distribution system within your home can affect water quality.`,
                  `If your test shows arsenic above 5 ppb, install certified treatment immediately. If above 10 ppb, do not use the water for drinking or cooking until treatment is installed.`,
                  `Retest after installing treatment to confirm it is working as certified. Replace filter media on the manufacturer's schedule — an exhausted filter may not perform as rated.`,
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-wur-teal/10 text-wur-teal font-bold text-sm flex items-center justify-center shrink-0">{i + 1}</span>
                    <p className="text-sm text-muted-foreground pt-1">{text}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Treatment */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Treatment Options for Arsenic</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Boiling does not remove arsenic — it concentrates it. Standard activated carbon filters (Brita, etc.) do not effectively remove arsenic. Certified treatment is required.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">NSF/ANSI Standard 58 — Reverse Osmosis</p>
                  </div>
                  <p className="text-sm text-muted-foreground">RO systems certified to NSF/ANSI 58 remove 85–95% of arsenic. Under-sink installation. Most effective for removing multiple contaminants simultaneously. Replace membranes and pre-filters on schedule.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">Activated Alumina Filters</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Activated alumina is specifically designed for arsenic and fluoride removal. Point-of-use or whole-house options available. Must be certified by NSF International or WQA for arsenic reduction. Requires periodic media regeneration or replacement.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">Iron/Manganese Oxidation Filters</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Effective for arsenic in iron-rich well water, which is common in the Midwest and New England. Oxidation converts dissolved iron and arsenic to a form that can be filtered out. Best when arsenic is co-occurring with high iron levels.</p>
                </div>
                <div className="p-4 rounded-lg border border-wur-caution-border bg-wur-caution-bg">
                  <p className="font-medium text-wur-caution text-sm mb-1">What does NOT work for arsenic</p>
                  <p className="text-sm text-wur-caution/80">Standard activated carbon filters (Brita, refrigerator filters, most pitcher filters) do NOT effectively remove arsenic. Boiling concentrates arsenic. Water softeners do not remove arsenic. Only use products with NSF certification specifically for arsenic reduction.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                See: <Link href="/treatment/reverse-osmosis" className="text-primary hover:underline">Reverse Osmosis guide</Link> · <Link href="/treatment/activated-carbon" className="text-primary hover:underline">Activated carbon filter guide</Link>
              </p>
            </section>

            {/* Take action callout */}
            <section className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Take Action Now</p>
              <div className="space-y-2">
                {[
                  `If you use a private well in ${data.stateName}, test for arsenic — especially if you are in a region with granite, volcanic, or sedimentary geology. A basic arsenic test costs $15–$40 at a state-certified lab.`,
                  `Public water users: check your utility's Consumer Confidence Report (CCR) for arsenic results. The EPA MCL is 10 ppb — any detection warrants attention.`,
                  "If arsenic is detected above 10 ppb (or even below it, given MCLG is zero), install an NSF/ANSI 58-certified reverse osmosis system for drinking and cooking water.",
                  "Standard carbon filters do NOT remove arsenic — do not rely on a Brita or refrigerator filter for arsenic protection.",
                ].map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-wur-teal/20 text-wur-teal font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-foreground leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-wur-teal/20 flex gap-4 flex-wrap">
                <Link href="/guides/how-to-test-well-water" className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:underline">
                  How to test well water <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link href="/guides/best-filter-for-arsenic-in-well-water" className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:underline">
                  Best arsenic filters <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

            {/* FAQ */}
            <FaqSection faqs={faqs} />

            {/* Related pages */}
            <section>
              <h2 className="font-display text-xl text-foreground mb-3">Related Pages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { href: "/contaminants/arsenic", label: "Arsenic — National Overview", desc: "All U.S. utilities with arsenic records" },
                  { href: stateInfo ? `/states/${stateInfo.slug}` : `/search?state=${data.stateAbbr}`, label: `${data.stateName} State Overview`, desc: "All utilities and water quality data" },
                  { href: `/well-water/${stateSlug}`, label: `${data.stateName} Well Water Guide`, desc: "Testing, risks & certified labs for private wells" },
                  { href: "/treatment/reverse-osmosis", label: "Reverse Osmosis Guide", desc: "Removes 85–95% of arsenic" },
                  { href: "/guides/best-filter-for-arsenic-in-well-water", label: "Best Arsenic Filter Guide", desc: "What actually works (carbon doesn't)" },
                  { href: "/contaminants/pfas", label: "PFAS in Drinking Water", desc: "The 'forever chemical' contamination overview" },
                  { href: "/contaminants", label: "All Contaminants", desc: "Complete reference library" },
                ].map(({ href, label, desc }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-wur-teal mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">{label}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <SourcesBlock sources={ARSENIC_SOURCES} lastUpdated={ARSENIC_LAST_UPDATED} confidence="high" />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-5 sticky top-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Find Your Utility</p>
              <ZipLookup variant="inline" />

              {stateInfo && (
                <div className="mt-5">
                  <Link
                    href={`/states/${stateInfo.slug}`}
                    className="group flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30 hover:border-wur-teal/40 transition-all"
                  >
                    <MapPin className="w-4 h-4 text-wur-teal shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">
                        Browse All {data.stateName} Utilities
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {stateInfo ? `${(stateInfo.populationServed / 1e6).toFixed(1)}M residents served` : ""}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-wur-teal ml-auto shrink-0 transition-colors" />
                  </Link>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-border">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">State Regulator</p>
                <a
                  href={data.agencyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-muted-foreground hover:text-primary transition-colors leading-relaxed"
                >
                  {data.agencyName} ↗
                </a>
              </div>

              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Other States</p>
                {ARSENIC_STATE_SLUGS.filter((s) => s !== stateSlug).slice(0, 6).map((s) => (
                  <Link
                    key={s}
                    href={`/contaminants/arsenic/${s}`}
                    className="flex items-center justify-between py-1 group"
                  >
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors capitalize">
                      {arsenicStateData[s].stateName}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                  </Link>
                ))}
                <Link href="/contaminants/arsenic" className="flex items-center gap-1 text-xs text-wur-teal hover:underline mt-1">
                  <ArrowLeft className="w-3 h-3" /> All arsenic state pages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
