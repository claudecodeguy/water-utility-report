import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Wrench, AlertTriangle, CheckCircle2, Building2 } from "lucide-react";
import contaminants, { getContaminantBySlug } from "@/lib/content/contaminants";
import treatmentMethods from "@/lib/content/treatments";
import stateContent from "@/lib/content/states";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import FaqSection from "@/components/faq-section";
import RelatedPages from "@/components/related-pages";
import JsonLd from "@/components/json-ld";
import SourcesBlock from "@/components/sources-block";
import ContaminantToAction from "@/components/contaminant-to-action";
import RelatedWaterQuestions from "@/components/related-water-questions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

// Contaminant-specific guide links shown in sidebar
const CONTAMINANT_GUIDE_LINKS: Record<string, { href: string; label: string }[]> = {
  "pfas": [
    { href: "/pfas-watchlist", label: "PFAS watchlist — official EPA UCMR 5 records" },
    { href: "/guides/best-filter-for-pfas-in-drinking-water", label: "Best filters for PFAS removal" },
    { href: "/guides/does-boiling-water-remove-lead-pfas-or-nitrates", label: "Does boiling water remove PFAS?" },
  ],
  "lead": [
    { href: "/guides/best-filter-for-lead-in-tap-water", label: "Best filters for lead removal" },
    { href: "/guides/what-does-lead-in-tap-water-actually-mean", label: "What lead in tap water actually means" },
    { href: "/guides/does-boiling-water-remove-lead-pfas-or-nitrates", label: "Does boiling water remove lead?" },
  ],
  "nitrates": [
    { href: "/guides/what-are-nitrates-in-water", label: "What are nitrates in drinking water?" },
    { href: "/guides/does-boiling-water-remove-lead-pfas-or-nitrates", label: "Does boiling water remove nitrates?" },
    { href: "/well-water", label: "Private well water and nitrate guidance" },
  ],
  "arsenic": [
    { href: "/guides/reverse-osmosis-vs-carbon-filter", label: "Reverse osmosis vs. carbon filters for arsenic" },
    { href: "/well-water", label: "Private well water guidance" },
    { href: "/labs", label: "Find a certified lab for arsenic testing" },
  ],
  "ph": [
    { href: "/labs/well-water-testing", label: "Well water testing — includes pH" },
    { href: "/contaminants/lead", label: "Lead in drinking water — linked to low pH corrosion" },
    { href: "/contaminants/copper", label: "Copper in drinking water — also leaches in acidic water" },
  ],
  "disinfection-byproducts": [
    { href: "/guides/does-boiling-water-remove-lead-pfas-or-nitrates", label: "What boiling water does and doesn't remove" },
    { href: "/guides/reverse-osmosis-vs-carbon-filter", label: "Reverse osmosis vs. carbon for DBP reduction" },
  ],
};

// Maps contaminant slugs → violation contaminant name search terms
const CONTAMINANT_VIOLATION_TERMS: Record<string, string[]> = {
  "lead": ["lead"],
  "nitrates": ["nitrate"],
  "pfas": ["pfas", "pfoa", "pfos"],
  "disinfection-byproducts": ["trihalomethane", "haloacetic"],
  "arsenic": ["arsenic"],
  "hard-water": ["hardness"],
};

export async function generateStaticParams() {
  return contaminants.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const contaminant = getContaminantBySlug(slug);
  if (!contaminant) return {};
  const canonical = `https://waterutilityreport.com/contaminants/${slug}`;
  const title = `${contaminant.shortName} in Drinking Water: EPA Limit ${contaminant.epaLimit}, Health Effects & Removal`;
  const description = `EPA limit for ${contaminant.shortName} in drinking water is ${contaminant.epaLimit}. ${contaminant.whyCare.slice(0, 130)}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical },
  };
}

export default async function ContaminantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const contaminant = getContaminantBySlug(slug);
  if (!contaminant) notFound();

  const linkedTreatments = treatmentMethods.filter((t) =>
    contaminant.treatments.includes(t.slug)
  );

  const affectedStatesData = stateContent.filter((s) =>
    contaminant.affectedStates.includes(s.slug)
  );

  // Utilities with violations for this contaminant
  const searchTerms = CONTAMINANT_VIOLATION_TERMS[contaminant.slug] ?? [];
  const utilitiesWithViolations = searchTerms.length > 0
    ? await prisma.utility.findMany({
        where: {
          publish_status: "published",
          violations: {
            some: {
              OR: searchTerms.map((term) => ({
                contaminant_name: { contains: term, mode: "insensitive" as const },
              })),
            },
          },
        },
        select: {
          slug: true,
          name: true,
          risk_level: true,
          population_served: true,
          state: { select: { abbreviation: true } },
        },
        orderBy: { population_served: "desc" },
        take: 8,
      })
    : [];

  const relatedContaminants = contaminants
    .filter((c) => c.slug !== contaminant.slug && c.category === contaminant.category)
    .slice(0, 4);

  const relatedPages = [
    ...linkedTreatments.map((t) => ({
      href: `/treatment/${t.slug}`,
      label: t.name,
      type: "treatment" as const,
      description: `Removes: ${contaminant.shortName}`,
    })),
    ...relatedContaminants.map((c) => ({
      href: `/contaminants/${c.slug}`,
      label: c.name,
      type: "contaminant" as const,
      description: c.category,
    })),
  ];

  const riskColors: Record<string, { text: string; bg: string; border: string }> = {
    safe: { text: "text-wur-safe", bg: "bg-wur-safe-bg", border: "border-wur-safe-border" },
    low: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    moderate: { text: "text-wur-caution", bg: "bg-wur-caution-bg", border: "border-wur-caution-border" },
    high: { text: "text-wur-warning", bg: "bg-wur-warning-bg", border: "border-wur-warning-border" },
    critical: { text: "text-wur-danger", bg: "bg-wur-danger-bg", border: "border-wur-danger-border" },
  };

  const rc = riskColors[contaminant.riskLevel];

  const sources = [
    { label: "EPA Drinking Water Contaminant Information", url: `https://www.epa.gov/ground-water-and-drinking-water` },
    { label: "ATSDR ToxFAQs / Toxicological Profiles", url: "https://www.atsdr.cdc.gov/toxfaqs/" },
    { label: "EPA SDWIS — violation and detection data", url: "https://sdwis.epa.gov/" },
  ];

  const contaminantCanonical = `https://waterutilityreport.com/contaminants/${slug}`;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contaminant.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const definedTermJsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name: contaminant.name,
    description: contaminant.definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "EPA Drinking Water Contaminants",
      url: "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations",
    },
    url: contaminantCanonical,
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${contaminant.name} in Drinking Water — Sources, Health Effects & Treatment`,
    description: contaminant.summary,
    url: contaminantCanonical,
    dateModified: contaminant.lastUpdated,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: contaminant.name, item: contaminantCanonical },
    ],
  };

  const violationItemListJsonLd = utilitiesWithViolations.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Water utilities with ${contaminant.shortName} violations`,
    numberOfItems: utilitiesWithViolations.length,
    itemListElement: utilitiesWithViolations.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: normalizeName(u.name),
      url: `https://waterutilityreport.com/utilities/${u.slug}`,
    })),
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={definedTermJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {violationItemListJsonLd && <JsonLd data={violationItemListJsonLd} />}
      {/* Hero */}
      <div className={`${rc.bg} border-b ${rc.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/contaminants"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Contaminants
          </Link>
          <div className="flex items-start gap-3">
            <FlaskConical className={`w-6 h-6 ${rc.text} mt-1 shrink-0`} />
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className={`text-xs font-semibold uppercase tracking-widest ${rc.text}`}>
                  {contaminant.riskLevel} risk level
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${rc.text} ${rc.bg} ${rc.border}`}>
                  {contaminant.category}
                </span>
                {contaminant.wellWaterRelevant && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                    Relevant to well water
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-2">
                {contaminant.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {contaminant.summary}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Entity Intelligence Block — AI citation anchor */}
            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Quick Reference · {contaminant.shortName}
              </p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { label: "EPA MCL", value: contaminant.epaLimit },
                  { label: "MCLG", value: contaminant.epaLimitNote ?? "See EPA guidance" },
                  { label: "Risk Classification", value: contaminant.riskLevel.charAt(0).toUpperCase() + contaminant.riskLevel.slice(1) },
                  { label: "Category", value: contaminant.category },
                  { label: "Detection Method", value: contaminant.detection },
                  { label: "Utilities with violations", value: utilitiesWithViolations.length > 0 ? `${utilitiesWithViolations.length}+ in database` : "See contaminant data" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex flex-col py-1.5 border-b border-border/50">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{label}</span>
                    <span className="text-xs font-semibold text-foreground mt-0.5">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Direct answer */}
            <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Quick Answer</p>
              <p className="text-foreground leading-relaxed">{contaminant.definition}</p>
            </section>

            {/* Why you should care */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Why Is {contaminant.shortName} in Drinking Water a Concern?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{contaminant.whyCare}</p>
              <p className="text-sm text-muted-foreground">{contaminant.whoIsAffected}</p>
            </section>

            {/* Health effects */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Health Effects of {contaminant.shortName} in Drinking Water</h2>
              <div className="space-y-2.5">
                {contaminant.healthEffects.map((effect, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${rc.text}`} />
                    <p className="text-sm text-foreground">{effect}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sources */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How Does {contaminant.shortName} Get Into Drinking Water?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contaminant.sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-muted/40 border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-1.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{source}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* EPA limit */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl text-foreground mb-4">Regulatory Limit</h2>
              <div className="flex items-start gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">EPA Maximum Contaminant Level (MCL)</p>
                  <p className="font-mono text-2xl font-semibold text-foreground">{contaminant.epaLimit}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{contaminant.epaLimitNote}</p>
            </section>

            {/* Detection */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How to Test for {contaminant.shortName} in Your Water</h2>
              <p className="text-muted-foreground leading-relaxed">{contaminant.detection}</p>
            </section>

            {/* Treatment options */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">How to Remove {contaminant.shortName} from Drinking Water</h2>
              {linkedTreatments.length > 0 && (
                <div className="mb-5 rounded-lg border border-wur-teal/20 bg-wur-teal/5 px-4 py-3 text-sm text-foreground">
                  <span className="font-semibold">Best filter for {contaminant.shortName}:</span>{" "}
                  <Link href={`/treatment/${linkedTreatments[0].slug}`} className="text-wur-teal hover:underline font-medium">
                    {linkedTreatments[0].name}
                  </Link>
                  {linkedTreatments.length > 1 && (
                    <span className="text-muted-foreground"> — also effective: {linkedTreatments.slice(1).map(t => t.shortName).join(", ")}</span>
                  )}
                </div>
              )}
              <p className="text-sm text-muted-foreground mb-5">
                These treatment methods have demonstrated effectiveness for {contaminant.shortName} removal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {linkedTreatments.map((method) => (
                  <Link
                    key={method.slug}
                    href={`/treatment/${method.slug}`}
                    className="group flex flex-col p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                  >
                    <Wrench className="w-4 h-4 text-wur-teal mb-2" />
                    <h3 className="font-medium text-foreground group-hover:text-wur-teal transition-colors mb-1">
                      {method.shortName}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{method.summary}</p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {method.solves.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {s.split("(")[0].trim()}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>


            {/* Utilities with violations */}
            {utilitiesWithViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Utilities With {contaminant.shortName} Violations
                  {utilitiesWithViolations.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-muted-foreground font-sans">
                      ({utilitiesWithViolations.length}+ in database)
                    </span>
                  )}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  These utilities have reported {contaminant.shortName}-related violations in EPA SDWIS. Ordered by population served.
                </p>
                <div className="space-y-2">
                  {utilitiesWithViolations.map((u) => (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Building2 className="w-4 h-4 text-wur-teal shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors truncate">
                            {normalizeName(u.name)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {u.state.abbreviation} · {u.population_served >= 1_000_000
                              ? `${(u.population_served / 1_000_000).toFixed(1)}M served`
                              : `${(u.population_served / 1_000).toFixed(0)}K served`}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border shrink-0 ml-3 ${
                        u.risk_level === "critical" ? "text-wur-danger bg-wur-danger-bg border-wur-danger-border" :
                        u.risk_level === "high" ? "text-wur-warning bg-wur-warning-bg border-wur-warning-border" :
                        u.risk_level === "moderate" ? "text-wur-caution bg-wur-caution-bg border-wur-caution-border" :
                        u.risk_level === "low" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                        "text-wur-safe bg-wur-safe-bg border-wur-safe-border"
                      }`}>
                        {u.risk_level}
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            <FaqSection faqs={contaminant.faqs} />
            <ContaminantToAction
              contaminantSlug={contaminant.slug}
              contaminantName={contaminant.shortName}
              treatmentSlugs={linkedTreatments.map(t => t.slug)}
              affectedStates={affectedStatesData.slice(0, 4).map(s => ({ slug: s.slug, name: s.name }))}
              isPfas={contaminant.slug === "pfas"}
            />
            <RelatedWaterQuestions
              questions={[
                {
                  question: `How do I test my water for ${contaminant.shortName}?`,
                  href: "/labs",
                  description: "Find state-certified labs — confirm EPA Method 533/537.1 for PFAS",
                  eventName: "related_question_click",
                  eventParams: { question: "testing", contaminant: contaminant.slug },
                },
                {
                  question: `Which utilities have ${contaminant.shortName} violations?`,
                  href: "/",
                  description: "Search by ZIP code or utility name for official EPA compliance records",
                  eventName: "related_question_click",
                  eventParams: { question: "utility_search", contaminant: contaminant.slug },
                },
                ...(linkedTreatments[0] ? [{
                  question: `What removes ${contaminant.shortName} from tap water?`,
                  href: `/treatment/${linkedTreatments[0].slug}`,
                  description: `${linkedTreatments[0].name} — NSF certification details, cost, and maintenance`,
                  eventName: "related_question_click",
                  eventParams: { question: "treatment", contaminant: contaminant.slug },
                }] : []),
                ...(contaminant.slug === "pfas" ? [{
                  question: "Which water systems have PFAS monitoring records?",
                  href: "/pfas-watchlist",
                  description: "Official EPA UCMR 5 PFAS monitoring data by utility and compound",
                  eventName: "related_question_click",
                  eventParams: { question: "pfas_watchlist", contaminant: contaminant.slug },
                }] : []),
                {
                  question: `How is ${contaminant.shortName} data sourced on this site?`,
                  href: "/methodology",
                  description: "EPA SDWIS, UCMR 5, and CCR data sources — update cadence and accuracy notes",
                  eventName: "source_methodology_click",
                  eventParams: { from: "contaminant", contaminant: contaminant.slug },
                },
              ]}
              title={`Questions About ${contaminant.shortName} in Drinking Water`}
            />
            <RelatedPages pages={relatedPages} />
            <SourcesBlock sources={sources} lastUpdated={contaminant.lastUpdated} />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              {/* Summary card */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Quick Reference</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{contaminant.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className={`text-sm font-semibold capitalize ${rc.text}`}>{contaminant.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">EPA Limit</p>
                    <p className="text-sm font-mono font-medium">{contaminant.epaLimit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Most at Risk</p>
                    <p className="text-sm font-medium text-foreground leading-snug">{contaminant.whoIsAffected.split(".")[0]}.</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Well Water Relevant</p>
                    <p className={`text-sm font-medium ${contaminant.wellWaterRelevant ? "text-wur-warning" : "text-muted-foreground"}`}>
                      {contaminant.wellWaterRelevant ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Affected states */}
              {affectedStatesData.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    {contaminant.shortName} by State
                  </p>
                  <div className="space-y-1.5">
                    {affectedStatesData.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/states/${s.slug}`}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
                      >
                        <ArrowLeft className="w-3 h-3 shrink-0 rotate-180" />
                        {contaminant.shortName} in {s.name} drinking water
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment options quick */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Treatment Options
                </p>
                <div className="space-y-2">
                  {linkedTreatments.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/treatment/${t.slug}`}
                      className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
                      {t.shortName}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Guide links */}
              {CONTAMINANT_GUIDE_LINKS[contaminant.slug] && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Guides & Data
                  </p>
                  <div className="space-y-1.5">
                    {CONTAMINANT_GUIDE_LINKS[contaminant.slug].map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
                      >
                        <ArrowLeft className="w-3 h-3 shrink-0 rotate-180" />
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
