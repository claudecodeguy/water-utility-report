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
  leadStateData,
  LEAD_SOURCES,
  LEAD_LAST_UPDATED,
  LEAD_STATE_SLUGS,
} from "@/lib/content/contaminant-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateStaticParams() {
  return LEAD_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const data = leadStateData[stateSlug];
  if (!data) return {};
  const canonical = `https://waterutilityreport.com/contaminants/lead/${stateSlug}`;
  const title = `Lead in ${data.stateName} Drinking Water: EPA Limit 15 ppb, Utilities & Testing`;
  const description = `Official EPA data on lead in ${data.stateName} drinking water. Utilities with lead violations, who is most at risk, how to test, and how to remove lead from tap water.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function LeadStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const data = leadStateData[stateSlug];
  if (!data) notFound();

  const stateInfo = stateContent.find((s) => s.slug === stateSlug);

  const [stateRecord, utilitiesWithLeadViolations] = await Promise.all([
    prisma.state.findFirst({ where: { abbreviation: data.stateAbbr } }),
    prisma.utility.findMany({
      where: {
        publish_status: "published",
        state: { abbreviation: data.stateAbbr },
        violations: {
          some: { contaminant_name: { contains: "lead", mode: "insensitive" } },
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
      question: `Is lead in drinking water a problem in ${data.stateName}?`,
      answer: data.quickAnswers.isRealConcern,
    },
    {
      question: `How does lead get into tap water in ${data.stateName}?`,
      answer: `Lead does not come from ${data.stateName}'s water sources. It leaches into water from lead service lines (the pipe connecting a building to the water main), lead solder used in plumbing before it was federally banned in 1986, and older brass fixtures and faucets. ${data.quickAnswers.primaryRoute}`,
    },
    {
      question: "Is lead usually coming from the utility or the home's plumbing?",
      answer: "Both can be sources. The utility delivers treated water, but water picks up lead as it moves through lead service lines and household plumbing. Utilities use corrosion control treatment to reduce leaching, but they cannot control lead in household plumbing beyond the meter.",
    },
    {
      question: `How do I find my utility in ${data.stateName}?`,
      answer: `Use the ZIP lookup on this page to identify which public water system serves your address. You can also browse utilities directly on the ${data.stateName} state page or search by city on this site.`,
    },
    {
      question: `Are older homes in ${data.stateName} more likely to have lead-related plumbing risk?`,
      answer: `Yes. Homes built before 1986 are most likely to have lead solder at pipe joints, and homes built before approximately 1960 may also have lead service lines or galvanized pipes coated with lead sediment. ${data.demographicNote}`,
    },
    {
      question: "What should I do if I am worried about lead in my water?",
      answer: "First, identify your utility and review its lead violation history on this site. Contact your utility to ask about your service line material. Consider testing your water at a state-certified lab. If you have young children or are pregnant, install a certified NSF/ANSI 53 or 58 filter as a precautionary measure while you gather more information.",
    },
    {
      question: "What type of filter helps reduce lead?",
      answer: "Filters certified to NSF/ANSI Standard 53 (activated carbon block) or Standard 58 (reverse osmosis) are independently verified to reduce lead at the tap. Do not rely on filter claims that lack NSF certification. Replace filters on schedule — an expired filter may not perform as certified.",
    },
    {
      question: "Does boiling water remove lead?",
      answer: "No. Boiling does not remove lead and can increase concentration by reducing water volume. Only use a certified filter or flushing (as a temporary measure) to reduce lead before drinking or cooking.",
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
    headline: `Lead In Drinking Water In ${data.stateName}: Utilities, Risks, Next Steps`,
    dateModified: LEAD_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "Lead", item: "https://waterutilityreport.com/contaminants/lead" },
      { "@type": "ListItem", position: 4, name: data.stateName, item: `https://waterutilityreport.com/contaminants/lead/${stateSlug}` },
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
            <Link href="/contaminants/lead" className="hover:text-primary transition-colors">Lead</Link>
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
                Lead In Drinking Water In {data.stateName}
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                What residents of {data.stateName} need to know about lead in drinking water — including how it enters water, which utilities have documented violations, and what steps to take.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA SDWIS, {data.agencyName}, CDC · Last reviewed: {LEAD_LAST_UPDATED}
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
                <p className="text-sm font-semibold text-foreground mb-1">Is lead in drinking water a real concern in {data.stateName}?</p>
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

            {/* Utility examples */}
            {utilitiesWithLeadViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  {data.stateName} Utilities With Lead Violation Records
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  The utilities listed below have at least one lead violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status and risk level.
                </p>
                <div className="space-y-2">
                  {utilitiesWithLeadViolations.map((u) => (
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
            {utilitiesWithLeadViolations.length === 0 && topUtilities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Largest {data.stateName} Water Utilities
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  No lead violations on record in EPA SDWIS for {data.stateName} utilities in our database. Browse the largest utilities to review their full water quality record.
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

            {/* How lead gets in */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How Lead Gets Into Drinking Water</h2>
              <div className="space-y-3">
                {[
                  { title: "Lead service lines", desc: "The pipe connecting a home to the water main may be made of lead, especially in pre-1986 construction. Water sitting in these lines can accumulate lead before it reaches the tap." },
                  { title: "Lead solder", desc: "Lead solder at pipe joints was banned for potable water systems in 1986. Homes built before that date — including significant portions of older {state} cities — may still have lead solder throughout their plumbing.".replace("{state}", data.stateName) },
                  { title: "Older brass fixtures", desc: "Faucets, valves, and fixtures with high lead content were common before the 2014 revision of 'lead-free' standards. Replacing older fixtures at kitchen and drinking taps can meaningfully reduce exposure." },
                  { title: "Corrosive water chemistry", desc: "Soft, acidic, or low-alkalinity water dissolves lead from plumbing more readily. Utilities use orthophosphate and other corrosion control treatments, but household plumbing after the meter is not within their control." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                    <AlertTriangle className="w-4 h-4 text-wur-warning mt-0.5 shrink-0" />
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
                  "Families with children under six",
                  "Pregnant residents",
                  "Households in homes built before 1986",
                  "Renters who cannot inspect building plumbing",
                  "Residents on a confirmed lead service line",
                  "Households that had plumbing work done recently (disturbances dislodge protective scale)",
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
                  `Identify your water utility. Use the ZIP lookup below or browse the ${data.stateName} utility directory on this site.`,
                  `Read your utility's page on this site to see its current risk level and any open lead violations.`,
                  `Contact your utility and ask for your address-level service line material status. Under the federal Lead and Copper Rule Revisions (LCRR), utilities must maintain and provide this information.`,
                  `Review your utility's most recent Consumer Confidence Report (CCR) — mailed annually or available on the utility's website.`,
                  `Consider testing your tap water at a ${data.agencyName}-certified lab. Your state health department or ${data.agencyName} maintains a list of certified labs.`,
                  `If you have young children or are pregnant, install a certified NSF/ANSI 53 or 58 filter at the kitchen tap as a precautionary measure.`,
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
                Boiling does not remove lead. Use a certified filter for drinking and cooking water.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">NSF/ANSI Standard 53 — Activated Carbon Block</p>
                  </div>
                  <p className="text-sm text-muted-foreground">Under-sink or pitcher filters certified to Standard 53 are independently verified to reduce lead. Replace filters on the manufacturer's schedule — an overdue filter may not perform as certified.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <p className="font-medium text-foreground text-sm">NSF/ANSI Standard 58 — Reverse Osmosis</p>
                  </div>
                  <p className="text-sm text-muted-foreground">RO systems certified to Standard 58 remove 95–99% of lead and a broad range of contaminants. Requires under-sink installation. More comprehensive than Standard 53 for households with multiple contaminant concerns.</p>
                </div>
                <div className="p-4 rounded-lg border border-wur-caution-border bg-wur-caution-bg">
                  <p className="font-medium text-wur-caution text-sm mb-1">Flushing — temporary mitigation only</p>
                  <p className="text-sm text-wur-caution/80">EPA recommends flushing the cold tap for 30 seconds to 2 minutes if water has sat in pipes for 6+ hours. Not a substitute for certified filtration or service line replacement.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                See: <Link href="/treatment/reverse-osmosis" className="text-primary hover:underline">Reverse Osmosis guide</Link> · <Link href="/treatment/activated-carbon" className="text-primary hover:underline">Activated carbon filter guide</Link>
              </p>
            </section>

            {/* FAQ */}
            <FaqSection faqs={faqs} />

            {/* Related pages */}
            <section>
              <h2 className="font-display text-xl text-foreground mb-3">Related Pages</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { href: "/contaminants/lead", label: "Lead — National Overview", desc: "All U.S. utilities with lead records" },
                  { href: stateInfo ? `/states/${stateInfo.slug}` : `/search?state=${data.stateAbbr}`, label: `${data.stateName} State Overview`, desc: "All utilities and water quality data" },
                  { href: "/contaminants/nitrate", label: "Nitrate in Drinking Water", desc: "A separate but common concern" },
                  { href: "/treatment/reverse-osmosis", label: "Reverse Osmosis Guide", desc: "Removes 95–99% of lead" },
                  { href: "/treatment/activated-carbon", label: "Activated Carbon Filter Guide", desc: "NSF/ANSI 53 certified options" },
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

            <SourcesBlock sources={LEAD_SOURCES} lastUpdated={LEAD_LAST_UPDATED} confidence="high" />
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
                {LEAD_STATE_SLUGS.filter((s) => s !== stateSlug).slice(0, 6).map((s) => (
                  <Link
                    key={s}
                    href={`/contaminants/lead/${s}`}
                    className="flex items-center justify-between py-1 group"
                  >
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors capitalize">
                      {leadStateData[s].stateName}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                  </Link>
                ))}
                <Link href="/contaminants/lead" className="flex items-center gap-1 text-xs text-wur-teal hover:underline mt-1">
                  <ArrowLeft className="w-3 h-3" /> All lead state pages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
