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
  nitrateStateData,
  NITRATE_SOURCES,
  NITRATE_LAST_UPDATED,
  NITRATE_STATE_SLUGS,
} from "@/lib/content/contaminant-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateStaticParams() {
  return NITRATE_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const data = nitrateStateData[stateSlug];
  if (!data) return {};
  const canonical = `https://waterutilityreport.com/contaminants/nitrate/${stateSlug}`;
  const title = `Nitrate in ${data.stateName} Drinking Water: EPA Limit 10 mg/L, Utilities & Testing`;
  const description = `Official EPA data on nitrates in ${data.stateName} drinking water. Utilities with nitrate violations, who is most at risk, how to test, and how to remove nitrates from tap water.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function NitrateStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const data = nitrateStateData[stateSlug];
  if (!data) notFound();

  const stateInfo = stateContent.find((s) => s.slug === stateSlug);

  const [stateRecord, utilitiesWithNitrateViolations] = await Promise.all([
    prisma.state.findFirst({ where: { abbreviation: data.stateAbbr } }),
    prisma.utility.findMany({
      where: {
        publish_status: "published",
        state: { abbreviation: data.stateAbbr },
        violations: {
          some: { contaminant_name: { contains: "nitrate", mode: "insensitive" } },
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
      question: `Is nitrate in drinking water a problem in ${data.stateName}?`,
      answer: data.quickAnswers.isRealConcern,
    },
    {
      question: `How does nitrate get into tap water in ${data.stateName}?`,
      answer: `Nitrate enters ${data.stateName}'s water supplies primarily through agricultural activity — fertilizer and manure runoff leaching into groundwater and surface water. ${data.quickAnswers.primaryRoute}`,
    },
    {
      question: "Is nitrate risk mainly a public-water issue or a private-well issue?",
      answer: `Both can be affected, but private well owners are at greater risk because private wells are not regulated under the Safe Drinking Water Act. Public water systems are required to test and notify customers if nitrate exceeds 10 mg/L. Private well owners in ${data.stateName} should test annually, especially in agricultural areas. ${data.quickAnswers.primaryRoute}`,
    },
    {
      question: `How do I find my utility in ${data.stateName}?`,
      answer: `Use the ZIP lookup on this page to identify which public water system serves your address. You can also browse utilities directly on the ${data.stateName} state page or search by city on this site.`,
    },
    {
      question: "Why is nitrate especially dangerous for infants?",
      answer: "High nitrate levels interfere with the blood's ability to carry oxygen — a condition called methemoglobinemia or 'blue baby syndrome.' Infants under six months are at the greatest risk because their digestive systems convert nitrate to nitrite more readily than adults, and their hemoglobin is more susceptible. This condition can be life-threatening. Do not use tap water exceeding 10 mg/L nitrate-nitrogen to prepare infant formula or feed infants.",
    },
    {
      question: "What should I do if I am worried about nitrate in my water?",
      answer: `First, identify your utility and review its nitrate violation history on this site. If you have an infant under six months, use bottled water or a certified reverse osmosis (NSF/ANSI 58) system immediately as a precautionary measure. If you are on a private well in ${data.stateName}, arrange testing at a state-certified lab — your state health department maintains a list.`,
    },
    {
      question: "What type of filter removes nitrate?",
      answer: "Reverse osmosis systems certified to NSF/ANSI Standard 58 reduce nitrate by 85–95%. Distillation units and anion exchange systems are also effective. Standard carbon filters — including pitcher filters and under-sink units certified to NSF/ANSI 42 or 53 — do NOT remove nitrate and should not be used for this purpose.",
    },
    {
      question: "Does boiling water remove nitrate?",
      answer: "No. Boiling concentrates nitrate by evaporating water. Never boil water to try to reduce nitrate — this makes the problem worse, not better.",
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
    headline: `Nitrate In Drinking Water In ${data.stateName}: Utilities, Risks, Next Steps`,
    dateModified: NITRATE_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "Nitrate", item: "https://waterutilityreport.com/contaminants/nitrate" },
      { "@type": "ListItem", position: 4, name: data.stateName, item: `https://waterutilityreport.com/contaminants/nitrate/${stateSlug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <div className="bg-wur-caution-bg border-b border-wur-caution-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 flex-wrap">
            <Link href="/contaminants" className="hover:text-primary transition-colors">Contaminants</Link>
            <span>›</span>
            <Link href="/contaminants/nitrate" className="hover:text-primary transition-colors">Nitrate</Link>
            <span>›</span>
            <span className="text-foreground font-medium">{data.stateName}</span>
          </nav>
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-wur-caution mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-wur-caution">Moderate–High Risk</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium text-wur-caution bg-wur-caution-bg border-wur-caution-border">Agricultural Contaminant</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-3">
                Nitrate In Drinking Water In {data.stateName}
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                What residents of {data.stateName} need to know about nitrate in drinking water — including how it enters water, which utilities have documented violations, and what steps to take.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA SDWIS, {data.agencyName}, CDC · Last reviewed: {NITRATE_LAST_UPDATED}
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
                <p className="text-sm font-semibold text-foreground mb-1">Is nitrate in drinking water a real concern in {data.stateName}?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.quickAnswers.isRealConcern}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Is this mostly a public-water issue, a private-well issue, or both?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.quickAnswers.primaryRoute}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">What is the main reason residents should care?</p>
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

            {/* Why it matters in this state */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">
                Why This Matters in {data.stateName}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{data.whyItMatters}</p>
              {data.historicalContext && (
                <div className="rounded-lg border border-wur-caution-border bg-wur-caution-bg p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-wur-caution mb-1">Historical Context</p>
                  <p className="text-sm text-wur-caution/90 leading-relaxed">{data.historicalContext}</p>
                </div>
              )}
            </section>

            {/* Infant warning */}
            <section className="rounded-xl border-2 border-wur-danger-border bg-wur-danger-bg p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-danger mb-2">Critical — Infants Under 6 Months</p>
              <p className="text-sm text-foreground leading-relaxed">
                Do not use tap water that exceeds 10 mg/L nitrate-nitrogen to prepare infant formula or feed infants under six months. Boiling will concentrate nitrate — do not boil. Use bottled water or a certified reverse osmosis system (NSF/ANSI 58) until the issue is resolved.
              </p>
            </section>

            {/* Utility examples */}
            {utilitiesWithNitrateViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  {data.stateName} Utilities With Nitrate Violation Records
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  The utilities listed below have at least one nitrate violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status and risk level.
                </p>
                <div className="space-y-2">
                  {utilitiesWithNitrateViolations.map((u) => (
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
            {utilitiesWithNitrateViolations.length === 0 && topUtilities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Largest {data.stateName} Water Utilities
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  No nitrate violations on record in EPA SDWIS for {data.stateName} utilities in our database. Browse the largest utilities to review their full water quality record.
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

            {/* How nitrate gets in */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How Nitrate Gets Into Drinking Water</h2>
              <div className="space-y-3">
                {[
                  { title: "Agricultural fertilizer and manure runoff", desc: `Nitrogen-based fertilizers and animal waste applied to ${data.stateName} cropland can leach into groundwater or run off into surface water supplies. This is the dominant nitrate pathway in most agricultural regions.` },
                  { title: "Septic system effluent", desc: "Failing or poorly sited septic systems release nitrogen-rich wastewater near drinking water wells. Rural areas with high well density and aging septic infrastructure face elevated risk." },
                  { title: "Concentrated animal feeding operations (CAFOs)", desc: "Large livestock facilities generate significant waste. Lagoon leaks and overapplication of manure to nearby fields can create localized nitrate hotspots in groundwater." },
                  { title: "Natural geological deposits", desc: "In some regions, naturally occurring nitrogen compounds in soil and bedrock contribute background nitrate levels to groundwater independent of agricultural activity." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                    <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Who should pay attention */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Who Should Pay Closest Attention</h2>
              <p className="text-sm text-muted-foreground mb-3">{data.demographicNote}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Households with infants under six months",
                  "Pregnant residents",
                  "Private well owners in agricultural areas",
                  "Households near livestock operations or CAFOs",
                  "Rural residents on shallow groundwater wells",
                  "Households with older or failing septic systems nearby",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 p-3 rounded-lg bg-wur-caution-bg border border-wur-caution-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-caution mt-1.5 shrink-0" />
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
                  `Identify your water utility. Use the ZIP lookup below or browse the ${data.stateName} utility directory on this site.`,
                  `Read your utility's page on this site to see its current risk level and any open nitrate violations.`,
                  `Review your utility's most recent Consumer Confidence Report (CCR) — mailed annually or available on the utility's website. It must disclose any MCL exceedances.`,
                  `If you are on a private well, arrange testing at a ${data.agencyName}-certified lab. Your state health department maintains a list of certified labs. Annual testing is recommended in agricultural areas.`,
                  `If you have an infant under six months, use bottled water or a certified RO system (NSF/ANSI 58) immediately as a precautionary measure — do not wait for test results if you are in a high-risk area.`,
                  `If your utility issues a nitrate exceedance notice, follow their guidance and do not use tap water for infants until the issue is resolved.`,
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
              <h2 className="font-display text-2xl text-foreground mb-4">Treatment Options</h2>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Carbon filters and boiling do not remove nitrate. Only the options below are effective.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">NSF/ANSI Standard 58 — Reverse Osmosis</p>
                  </div>
                  <p className="text-sm text-muted-foreground">RO systems certified to NSF/ANSI 58 reduce nitrate by 85–95% at the point of use. Under-sink installation required. The most practical residential option for nitrate concerns.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">Distillation</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Distillation units effectively remove nitrate along with most other dissolved contaminants. Suitable for drinking and cooking water — not whole-house use.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">Anion Exchange</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Ion exchange systems designed for nitrate removal exchange nitrate ions for chloride on a resin bed. Effective as a point-of-entry system; requires periodic regeneration and monitoring.</p>
                </div>
                <div className="p-4 rounded-lg border-2 border-wur-danger-border bg-wur-danger-bg">
                  <p className="font-medium text-wur-danger text-sm mb-1">Carbon filters do NOT remove nitrate</p>
                  <p className="text-sm text-wur-danger/80">Standard pitcher filters, faucet filters, and under-sink carbon units — including those certified NSF/ANSI 42 or 53 — do not remove nitrate. Do not use these for nitrate reduction.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                See: <Link href="/treatment/reverse-osmosis" className="text-primary hover:underline">Reverse Osmosis guide</Link>
              </p>
            </section>

            {/* FAQ */}
            <FaqSection faqs={faqs} />

            {/* Related pages */}
            <section>
              <h2 className="font-display text-xl text-foreground mb-3">Related Pages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { href: "/contaminants/nitrate", label: "Nitrate — National Overview", desc: "All U.S. utilities with nitrate records" },
                  { href: stateInfo ? `/states/${stateInfo.slug}` : `/search?state=${data.stateAbbr}`, label: `${data.stateName} State Overview`, desc: "All utilities and water quality data" },
                  { href: "/contaminants/lead", label: "Lead in Drinking Water", desc: "A separate but common concern" },
                  { href: "/treatment/reverse-osmosis", label: "Reverse Osmosis Guide", desc: "Removes 85–95% of nitrate" },
                  { href: "/well-water", label: "Well Water Guide", desc: "Private well testing and safety" },
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

            <SourcesBlock sources={NITRATE_SOURCES} lastUpdated={NITRATE_LAST_UPDATED} confidence="high" />
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
                {NITRATE_STATE_SLUGS.filter((s) => s !== stateSlug).slice(0, 6).map((s) => (
                  <Link
                    key={s}
                    href={`/contaminants/nitrate/${s}`}
                    className="flex items-center justify-between py-1 group"
                  >
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors capitalize">
                      {nitrateStateData[s].stateName}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                  </Link>
                ))}
                <Link href="/contaminants/nitrate" className="flex items-center gap-1 text-xs text-wur-teal hover:underline mt-1">
                  <ArrowLeft className="w-3 h-3" /> All nitrate state pages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
