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
  pfasStateData,
  PFAS_SOURCES,
  PFAS_LAST_UPDATED,
  PFAS_STATE_SLUGS,
  type PfasStateData,
} from "@/lib/content/pfas-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export async function generateStaticParams() {
  return PFAS_STATE_SLUGS.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const data = pfasStateData[stateSlug];
  if (!data) return {};
  const canonical = `https://waterutilityreport.com/contaminants/pfas/${stateSlug}`;
  const title = `PFAS in ${data.stateName} Drinking Water: EPA 4 ppt Limit, Military Sources & Filtration`;
  const description = `Official data on PFAS "forever chemicals" in ${data.stateName} drinking water. Utilities with PFAS violations, key contamination sources, how to filter PFAS, and what the new EPA 4 ppt MCL means for ${data.stateName} residents.`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function PfasStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const data = pfasStateData[stateSlug];
  if (!data) notFound();

  const stateInfo = stateContent.find((s) => s.slug === stateSlug);

  const [stateRecord, utilitiesWithPfasViolations] = await Promise.all([
    prisma.state.findFirst({ where: { abbreviation: data.stateAbbr } }),
    prisma.utility.findMany({
      where: {
        publish_status: "published",
        state: { abbreviation: data.stateAbbr },
        violations: {
          some: {
            OR: [
              { contaminant_name: { contains: "pfas", mode: "insensitive" } },
              { contaminant_name: { contains: "pfoa", mode: "insensitive" } },
              { contaminant_name: { contains: "pfos", mode: "insensitive" } },
            ],
          },
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
      question: `Is PFAS in drinking water a real concern in ${data.stateName}?`,
      answer: data.quickAnswers.isRealConcern,
    },
    {
      question: "What is the EPA limit for PFAS in drinking water?",
      answer: "The EPA finalized a Maximum Contaminant Level (MCL) of 4 parts per trillion (ppt) for PFOA and PFOS in April 2024 — the most protective drinking water standard ever set. The EPA also set limits for PFNA (10 ppt), PFHxS (10 ppt), and HFPO-DA ('GenX', 10 ppt). Public water systems must comply by 2027. There is no established safe level — the Maximum Contaminant Level Goal (MCLG) for PFOA and PFOS is zero.",
    },
    {
      question: `Where does PFAS come from in ${data.stateName}?`,
      answer: data.quickAnswers.primaryRoute,
    },
    {
      question: "Does a standard water filter remove PFAS?",
      answer: "Most standard pitcher filters (such as Brita with GAC) provide limited PFAS reduction. For reliable removal: (1) Reverse osmosis systems certified to NSF/ANSI 58 reduce PFAS by 90–99%. (2) Under-sink activated carbon block filters certified to NSF/ANSI 53 or 58 reduce PFAS significantly. Always verify the specific product's certification — not all carbon or RO filters are rated for PFAS. Replace filters on schedule.",
    },
    {
      question: "Does boiling water remove PFAS?",
      answer: "No. Boiling does not remove PFAS and can actually concentrate it by reducing water volume. Only certified filtration (reverse osmosis or NSF/ANSI 58-rated carbon) reliably reduces PFAS in drinking water.",
    },
    {
      question: `How do I know if my tap water has PFAS?`,
      answer: `Request your utility's most recent Consumer Confidence Report (CCR) — it lists what was tested and at what levels. You can also use the EPA's ECHO database or this site's data to look up your utility's PFAS monitoring data. For private well owners, PFAS is unregulated and untested unless you order a lab test. State-certified labs typically charge $150–$400 for a PFAS panel test.`,
    },
    {
      question: `Are private well owners in ${data.stateName} at risk from PFAS?`,
      answer: data.quickAnswers.mainReason,
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
    headline: `PFAS In Drinking Water In ${data.stateName}: Sources, Risks & Next Steps`,
    dateModified: PFAS_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "PFAS", item: "https://waterutilityreport.com/contaminants/pfas" },
      { "@type": "ListItem", position: 4, name: data.stateName, item: `https://waterutilityreport.com/contaminants/pfas/${stateSlug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <div className="bg-wur-danger-bg border-b border-wur-danger-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5 flex-wrap">
            <Link href="/contaminants" className="hover:text-primary transition-colors">Contaminants</Link>
            <span>›</span>
            <Link href="/contaminants/pfas" className="hover:text-primary transition-colors">PFAS</Link>
            <span>›</span>
            <span className="text-foreground font-medium">{data.stateName}</span>
          </nav>
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-wur-danger mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-wur-danger">Critical Risk Level</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium text-wur-danger bg-wur-danger-bg border-wur-danger-border">Forever Chemicals</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-3">
                PFAS in Drinking Water in {data.stateName}
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                What residents of {data.stateName} need to know about PFAS ("forever chemicals") in drinking water — including contamination sources, which utilities have documented violations, and how to filter PFAS from tap water.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA SDWIS, {data.agencyName}, CDC · Last reviewed: {PFAS_LAST_UPDATED}
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
                <p className="text-sm font-semibold text-foreground mb-1">Is PFAS in drinking water a real concern in {data.stateName}?</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{data.quickAnswers.isRealConcern}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Where does PFAS come from in {data.stateName}?</p>
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
                Why PFAS Matters in {data.stateName}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{data.whyItMatters}</p>
              {data.historicalContext && (
                <div className="rounded-lg border border-wur-caution-border bg-wur-caution-bg p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-wur-caution mb-1">Historical Context</p>
                  <p className="text-sm text-wur-caution/90 leading-relaxed">{data.historicalContext}</p>
                </div>
              )}
            </section>

            {/* State PFAS Regulation */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">{data.stateName} PFAS Regulation</h2>
              {(data as PfasStateData).stateMcl && (
                <div className="rounded-lg border border-wur-teal/30 bg-wur-teal/5 p-4 mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-1">State MCL — Stricter Than Federal</p>
                  <p className="text-sm text-foreground">{(data as PfasStateData).stateMcl}</p>
                </div>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed">{(data as PfasStateData).stateProgramNote}</p>
            </section>

            {/* Utility examples */}
            {utilitiesWithPfasViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  {data.stateName} Utilities With PFAS Violation Records
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  The utilities listed below have at least one PFAS violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status and risk level.
                </p>
                <div className="space-y-2">
                  {utilitiesWithPfasViolations.map((u) => (
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
            {utilitiesWithPfasViolations.length === 0 && topUtilities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Largest {data.stateName} Water Utilities
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  No PFAS violations on record in EPA SDWIS for {data.stateName} utilities in our database. Browse the largest utilities to review their full water quality record.
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

            {/* What is PFAS — condensed callout */}
            <section className="rounded-lg border border-wur-teal/20 bg-wur-teal/5 p-5">
              <p className="text-sm font-semibold text-foreground mb-2">What Are PFAS (&ldquo;Forever Chemicals&rdquo;)?</p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                PFAS are a family of over 12,000 synthetic chemicals used in non-stick cookware, stain-resistant fabrics, food packaging, and AFFF firefighting foam. Their carbon-fluorine bonds do not break down in the environment or the body — hence the name &ldquo;forever chemicals.&rdquo; AFFF used at military bases is the single largest source of PFAS in U.S. drinking water.
              </p>
              <Link href="/contaminants/pfas" className="text-sm text-wur-teal hover:underline inline-flex items-center gap-1">
                Full PFAS overview — national data, health effects, all 50 states <ArrowRight className="w-3 h-3" />
              </Link>
            </section>

            {/* Who should pay attention */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Who Should Pay Closest Attention</h2>
              <p className="text-sm text-muted-foreground mb-3">{data.demographicNote}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Residents near military bases with AFFF use history",
                  "Private well owners near military or industrial sites",
                  "Pregnant residents and families with young children",
                  "Residents in communities with documented PFAS detections",
                  "Anyone who has consumed water above 4 ppt for an extended period",
                  "Residents near airports, fire training areas, or industrial manufacturers",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 p-3 rounded-lg bg-wur-danger-bg border border-wur-danger-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-danger mt-1.5 shrink-0" />
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
                  `Identify your water utility using the ZIP lookup below or by browsing the ${data.stateName} utility directory on this site.`,
                  `Review your utility's Consumer Confidence Report (CCR) — it must report PFAS monitoring results under UCMR5 and the new MCL.`,
                  `Check the EPA's ECHO database for your utility's monitoring history. Look for PFAS, PFOA, PFOS, and related compound results.`,
                  `Contact your utility directly and ask for their most recent PFAS test results and whether they are implementing treatment under the 2024 MCL.`,
                  `If you use a private well near a military base, airport, or industrial facility, order a PFAS panel test from a state-certified laboratory. Tests typically cost $150–$400.`,
                  `If PFAS is detected above 4 ppt in your source water, install a certified NSF/ANSI 58 reverse osmosis system or an NSF/ANSI 53-certified activated carbon filter rated for PFAS removal.`,
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
              <h2 className="font-display text-2xl text-foreground mb-4">How to Remove PFAS from Tap Water</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Reverse Osmosis (Best)", desc: "90–99% removal — NSF/ANSI 58 certified systems only", href: "/treatment/reverse-osmosis", safe: true },
                  { label: "Certified Activated Carbon", desc: "Effective with NSF/ANSI 53 or 58 certification — verify before buying", href: "/treatment/activated-carbon", safe: true },
                ].map((opt) => (
                  <Link key={opt.href} href={opt.href} className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-wur-teal/40 transition-all">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors">{opt.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Boiling concentrates PFAS. Standard pitcher filters and water softeners do not remove PFAS. Always verify NSF certification before purchasing.</p>
            </section>

            {/* Take action callout */}
            <section className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Take Action Now</p>
              <div className="space-y-2">
                {[
                  `Look up your ${data.stateName} utility's PFAS monitoring history on the PFAS Watchlist below.`,
                  "If your utility has detected PFAS above 4 ppt, install an NSF/ANSI 58-certified reverse osmosis system at your drinking tap.",
                  "Private well owners near military or industrial sites should order a PFAS panel test ($150–$400 at a state-certified lab).",
                  "Request your utility's most recent Consumer Confidence Report — PFAS results must be disclosed under the new 2024 MCL.",
                ].map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-wur-teal/20 text-wur-teal font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <p className="text-sm text-foreground leading-relaxed">{action}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-wur-teal/20">
                <Link href={`/pfas-watchlist/${stateSlug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:underline">
                  View {data.stateName} PFAS Watchlist Data <ArrowRight className="w-3.5 h-3.5" />
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
                  { href: "/contaminants/pfas", label: "PFAS — National Overview", desc: "All U.S. utilities with PFAS records" },
                  { href: `/pfas-watchlist/${stateSlug}`, label: `${data.stateName} PFAS Watchlist`, desc: "Live utility PFAS monitoring data" },
                  { href: stateInfo ? `/states/${stateInfo.slug}` : `/search?state=${data.stateAbbr}`, label: `${data.stateName} State Overview`, desc: "All utilities and water quality data" },
                  { href: "/treatment/reverse-osmosis", label: "Reverse Osmosis Guide", desc: "Removes 90–99% of PFAS" },
                  { href: "/treatment/activated-carbon", label: "Activated Carbon Filter Guide", desc: "NSF/ANSI 53/58 certified options for PFAS" },
                  { href: "/contaminants/arsenic", label: "Arsenic in Drinking Water", desc: "Another priority contaminant" },
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

            <SourcesBlock sources={PFAS_SOURCES} lastUpdated={PFAS_LAST_UPDATED} confidence="high" />
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
                {PFAS_STATE_SLUGS.filter((s) => s !== stateSlug).slice(0, 6).map((s) => (
                  <Link
                    key={s}
                    href={`/contaminants/pfas/${s}`}
                    className="flex items-center justify-between py-1 group"
                  >
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors capitalize">
                      {pfasStateData[s].stateName}
                    </span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                  </Link>
                ))}
                <Link href="/contaminants/pfas" className="flex items-center gap-1 text-xs text-wur-teal hover:underline mt-1">
                  <ArrowLeft className="w-3 h-3" /> All PFAS state pages
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
