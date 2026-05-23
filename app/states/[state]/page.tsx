import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Droplets, FlaskConical, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getStateContentBySlug } from "@/lib/content/states";
import stateContent from "@/lib/content/states";
import contaminants from "@/lib/content/contaminants";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import FaqSection from "@/components/faq-section";
import JsonLd from "@/components/json-ld";
import ExploreArea from "@/components/explore-area";
import RelatedWaterQuestions from "@/components/related-water-questions";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: rawSlug } = await params;
  const stateSlug = rawSlug.replace(/\s+/g, "-");
  const state = getStateContentBySlug(stateSlug);
  if (!state) return {};
  const popM = (state.populationServed / 1_000_000).toFixed(1);
  const topNames = state.topContaminants.slice(0, 3).join(", ");
  const title = `${state.name} Water Quality Reports, PFAS & Utility Lookup (2025)`;
  const description = `Browse drinking water utilities in ${state.name}, check PFAS records and violations, and find official water quality reports and next-step guidance.`;
  const url = `https://waterutilityreport.com/states/${stateSlug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

const riskBgs: Record<string, string> = {
  safe: "bg-wur-safe-bg text-wur-safe border-wur-safe-border",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  moderate: "bg-wur-caution-bg text-wur-caution border-wur-caution-border",
  high: "bg-wur-warning-bg text-wur-warning border-wur-warning-border",
  critical: "bg-wur-danger-bg text-wur-danger border-wur-danger-border",
};

const PAGE_SIZE = 25;

export default async function StatePage({
  params,
  searchParams,
}: {
  params: Promise<{ state: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const [{ state: rawSlug }, { page: pageParam }] = await Promise.all([params, searchParams]);
  // Redirect space-encoded slugs (e.g. "rhode island") to canonical hyphenated form
  const stateSlug = rawSlug.includes(" ") ? rawSlug.replace(/\s+/g, "-") : rawSlug;
  if (stateSlug !== rawSlug) redirect(`/states/${stateSlug}`);
  const state = getStateContentBySlug(stateSlug);
  if (!state) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const dbState = await prisma.state.findUnique({ where: { abbreviation: state.abbreviation } });

  const [dbUtilities, dbUtilityCount, topCityUtilities, openViolationsUtilityCount, pfasUtilityCount, highRiskUtilities, safestUtilities, openViolationUtilities] = dbState
    ? await Promise.all([
        prisma.utility.findMany({
          where: { state_id: dbState.id, publish_status: "published" },
          orderBy: { population_served: "desc" },
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
          select: {
            slug: true,
            name: true,
            pwsid: true,
            population_served: true,
            risk_level: true,
            service_type: true,
            ownership_type: true,
          },
        }),
        prisma.utility.count({ where: { state_id: dbState.id, publish_status: "published" } }),
        prisma.utility.findMany({
          where: { state_id: dbState.id, publish_status: "published", city_served: { not: null } },
          select: { city_served: true },
          orderBy: { population_served: "desc" },
          take: 100,
        }),
        prisma.utility.count({
          where: {
            state_id: dbState.id,
            publish_status: "published",
            violations: { some: { is_health_based: true, resolution_date: null } },
          },
        }),
        prisma.utility.count({
          where: {
            state_id: dbState.id,
            publish_status: "published",
            pfas_records: { some: { suppressed: false, validated: true } },
          },
        }),

        // Query 6: Highest-risk utilities (open health violations, ordered by risk then population)
        prisma.utility.findMany({
          where: {
            state_id: dbState.id,
            publish_status: "published",
            violations: { some: { is_health_based: true, resolution_date: null } },
          },
          select: {
            slug: true, name: true, risk_level: true, population_served: true,
            city_served: true,
            _count: { select: { violations: true } },
          },
          orderBy: [
            { risk_level: "desc" },
            { population_served: "desc" },
          ],
          take: 5,
        }),

        // Query 7: Safest large utilities (no open health violations, largest population)
        prisma.utility.findMany({
          where: {
            state_id: dbState.id,
            publish_status: "published",
            risk_level: { in: ["safe", "low"] },
            population_served: { gte: 10000 },
          },
          select: {
            slug: true, name: true, risk_level: true, population_served: true,
            city_served: true,
          },
          orderBy: { population_served: "desc" },
          take: 5,
        }),

        // Query 8: All utilities with open health-based violations + violation details
        prisma.utility.findMany({
          where: {
            state_id: dbState.id,
            publish_status: "published",
            violations: { some: { is_health_based: true, resolution_date: null } },
          },
          select: {
            slug: true, name: true, pwsid: true,
            city_served: true, population_served: true, risk_level: true,
            violations: {
              where: { is_health_based: true, resolution_date: null },
              select: {
                id: true,
                contaminant_name: true, contaminant_code: true,
                violation_type: true, violation_date: true,
                description: true, source_url: true, severity: true,
              },
              orderBy: { violation_date: "desc" },
            },
          },
          orderBy: [{ risk_level: "desc" }, { population_served: "desc" }],
        }),
      ])
    : [[], 0, [], 0, 0, [], [], []];

  // Build deduplicated city list sorted by population (take order)
  const topCities = Array.from(
    new Map(
      (topCityUtilities as { city_served: string | null }[])
        .map(u => {
          const raw = u.city_served!.split(",")[0].trim().replace(/-\d{3,4}$/, "").trim();
          const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
          return { name: raw, slug };
        })
        .filter(c => c.slug.length > 0)
        .map(c => [c.slug, c])
    ).values()
  ).slice(0, 20);

  const totalPages = Math.ceil(dbUtilityCount / PAGE_SIZE);

  // Filter contaminants to those flagged for this state
  const stateContaminants = contaminants.filter((c) =>
    state.topContaminants.includes(c.slug)
  );

  // AEO-optimized, data-driven FAQs
  const stateFaqs = [
    {
      question: `Is ${state.name} tap water safe to drink?`,
      answer: `${state.name} has ${dbUtilityCount > 0 ? dbUtilityCount.toLocaleString() : "thousands of"} EPA-tracked public water systems. ${openViolationsUtilityCount > 0 ? `${openViolationsUtilityCount.toLocaleString()} of those systems currently have open health-based violations recorded in the EPA federal database, meaning a contaminant exceeded a legal limit and the violation has not yet been formally resolved.` : "No open health-based violations are currently recorded across tracked systems in the EPA federal database."} Water quality can vary significantly between utilities — check individual utility pages for full compliance history, or find your utility by ZIP code.`,
    },
    {
      question: `What contaminants are in ${state.name} drinking water?`,
      answer: `The most commonly detected or concerning contaminants in ${state.name} include ${state.topContaminants.join(", ")}. ${state.summary.split(".").slice(0, 2).join(".")}. Contact your utility or review their annual Consumer Confidence Report (CCR) for specific test results for your water system.`,
    },
    {
      question: `Does ${state.name} have PFAS in drinking water?`,
      answer: `${pfasUtilityCount > 0 ? `${pfasUtilityCount.toLocaleString()} water system${pfasUtilityCount !== 1 ? "s" : ""} in ${state.name} have official PFAS monitoring records in the EPA UCMR 5 dataset (2023–2025). UCMR 5 results are monitoring data — detection above the minimum reporting limit is not a compliance determination or health risk conclusion.` : `No qualifying PFAS records have been located for ${state.name} water systems in the current EPA UCMR 5 dataset. This does not establish absence of PFAS.`} View the ${state.name} PFAS Watchlist for full monitoring records and source links.`,
    },
    {
      question: `How many water utilities are in ${state.name}?`,
      answer: `${state.name} has ${dbUtilityCount > 0 ? dbUtilityCount.toLocaleString() + " publicly tracked" : "thousands of"} water systems in the EPA database, ranging from large municipal utilities serving millions of residents to small community systems. About ${state.wellWaterPercent}% of ${state.name} residents rely on private wells not covered by public utility monitoring. Use the ZIP lookup to find your specific provider.`,
    },
    {
      question: `How is ${state.name} drinking water regulated?`,
      answer: `${state.name} water utilities are regulated under the federal Safe Drinking Water Act (SDWA), enforced by the EPA with day-to-day primacy held by the state drinking water program. Utilities must publish annual Consumer Confidence Reports (CCRs) disclosing tested contaminant levels and any violations. The ${state.name} utility directory on this page covers ${dbUtilityCount > 0 ? `${dbUtilityCount.toLocaleString()} tracked systems` : "tracked systems"} with links to individual compliance pages and official source data.`,
    },
    {
      question: `Where can I find my water utility's water quality report (CCR) in ${state.name}?`,
      answer: `Every public water system in ${state.name} is required under the Safe Drinking Water Act to publish an annual Consumer Confidence Report (CCR) by July 1 each year. CCRs list all detected contaminants, their levels, applicable EPA limits, and any violations during the reporting year. To find your utility's CCR: (1) check your water bill for a direct link or mailed copy, (2) search the EPA ECHO database by PWSID, or (3) visit your utility's website. Individual utility pages on this site include CCR links where available.`,
    },
    {
      question: `How do I get my water tested in ${state.name}?`,
      answer: `To test your tap water in ${state.name}, use a state-certified laboratory. The EPA maintains a national directory of certified labs searchable by state and contaminant type at epa.gov/dwlabcert. Your ${state.name} state drinking water program maintains its own certified lab list for regulatory-grade testing. For PFAS, confirm the lab holds EPA Method 533 or 537.1 certification. For private well testing, see the ${state.name} well water guide at waterutilityreport.com/well-water/${stateSlug}. Find certified labs by state at waterutilityreport.com/labs.`,
    },
  ];

  // ── Schema ──────────────────────────────────────────────────────────────────

  const stateCanonical = `https://waterutilityreport.com/states/${stateSlug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "States", item: "https://waterutilityreport.com/states" },
      { "@type": "ListItem", position: 3, name: state.name, item: stateCanonical },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${state.name} Drinking Water Quality`,
    description: `Directory of ${dbUtilityCount > 0 ? dbUtilityCount.toLocaleString() : "public"} water utilities in ${state.name}, with violation history, contaminant concerns, PFAS records, and official source links.`,
    url: stateCanonical,
    dateModified: state.lastUpdated,
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${state.name} Drinking Water Quality Data`,
    description: `Public drinking water compliance records for ${state.name}${dbUtilityCount > 0 ? `, covering ${dbUtilityCount.toLocaleString()} water utilities` : ""}. Sourced from EPA SDWIS (violations, compliance) and EPA UCMR 5 (PFAS monitoring).`,
    url: stateCanonical,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
    spatialCoverage: {
      "@type": "Place",
      name: state.name,
      geo: { "@type": "GeoShape", addressRegion: state.abbreviation, addressCountry: "US" },
    },
    dateModified: state.lastUpdated,
    ...(stateContaminants.length > 0 ? { variableMeasured: stateContaminants.map(c => c.name) } : {}),
  };

  const faqPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: stateFaqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const itemListJsonLd = dbUtilities.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Water utilities in ${state.name}`,
    numberOfItems: dbUtilityCount,
    itemListElement: dbUtilities.map((u, i) => ({
      "@type": "ListItem",
      position: (page - 1) * PAGE_SIZE + i + 1,
      name: normalizeName(u.name),
      url: `https://waterutilityreport.com/utilities/${u.slug}`,
    })),
  } : null;

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionPageJsonLd} />
      <JsonLd data={datasetJsonLd} />
      <JsonLd data={faqPageJsonLd} />
      {itemListJsonLd && <JsonLd data={itemListJsonLd} />}

      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to map
          </Link>
          <div className="flex items-start gap-4">
            <div className="text-5xl font-display text-white/30 leading-none">{state.abbreviation}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">State Hub</p>
              <h1 className="font-display text-4xl sm:text-5xl text-white">{state.name} Water Quality</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
            <div>
              <p className="text-2xl font-mono font-semibold text-white">{dbUtilityCount.toLocaleString()}</p>
              <p className="text-xs text-white/50 mt-0.5">Utilities in database</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-white">{(state.populationServed / 1_000_000).toFixed(1)}M</p>
              <p className="text-xs text-white/50 mt-0.5">Residents served</p>
            </div>
            <div>
              <p className={`text-2xl font-mono font-semibold ${openViolationsUtilityCount > 0 ? "text-amber-300" : "text-white"}`}>
                {openViolationsUtilityCount.toLocaleString()}
              </p>
              <p className="text-xs text-white/50 mt-0.5">With open violations</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-white">{pfasUtilityCount.toLocaleString()}</p>
              <p className="text-xs text-white/50 mt-0.5">PFAS monitored</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Answer — full-width, AEO-optimized */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Quick Answer</p>
          <p className="text-foreground leading-relaxed">
            {state.name} public drinking water is served by{" "}
            <strong>{dbUtilityCount > 0 ? dbUtilityCount.toLocaleString() : "thousands of"} EPA-tracked water systems</strong>,
            providing service to approximately {(state.populationServed / 1_000_000).toFixed(1)} million residents through public utilities.{" "}
            {openViolationsUtilityCount > 0 ? (
              <>
                <strong className="text-wur-warning">{openViolationsUtilityCount.toLocaleString()} of those systems</strong>{" "}
                currently have open health-based violations on record in the EPA federal database.
              </>
            ) : (
              <><strong className="text-wur-safe">No open health-based violations</strong> are currently recorded across tracked systems in the EPA federal database.</>
            )}
            {pfasUtilityCount > 0 && (
              <> <strong>{pfasUtilityCount.toLocaleString()} systems</strong> have official PFAS monitoring records from the EPA UCMR 5 program (2023–2025).</>
            )}
            {` About ${state.wellWaterPercent}% of ${state.abbreviation} residents use private wells, which fall outside federal utility compliance monitoring.`}
          </p>

          {/* Inline violation status signal */}
          <div className={`mt-4 flex items-start gap-2.5 rounded-lg p-3 border ${
            openViolationsUtilityCount > 0
              ? "border-wur-warning/30 bg-wur-warning/5"
              : "border-wur-safe-border bg-wur-safe-bg"
          }`}>
            {openViolationsUtilityCount > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-wur-warning shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-wur-safe shrink-0 mt-0.5" />
            )}
            <p className="text-xs leading-relaxed text-muted-foreground">
              {openViolationsUtilityCount > 0
                ? `${openViolationsUtilityCount.toLocaleString()} ${state.name} water ${openViolationsUtilityCount === 1 ? "system has an" : "systems have"} open health-based violation${openViolationsUtilityCount !== 1 ? "s" : ""} recorded in EPA SDWIS. An open violation means a contaminant exceeded a federal limit and the violation has not been formally resolved in the federal database. Check individual utility pages for current status.`
                : `No open health-based violations are currently recorded in the EPA SDWIS database for ${state.name}'s tracked water systems. Always verify with your utility's Consumer Confidence Report for annual test results.`}
            </p>
          </div>
        </section>
      </div>

      {/* Open Health-Based Violations Detail */}
      {openViolationUtilities.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <section>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-wur-warning shrink-0" />
              <h2 className="font-display text-xl text-foreground">
                Open Health-Based Violations in {state.name}
              </h2>
            </div>
            <div className="space-y-3">
              {openViolationUtilities.map((u) => (
                <div key={u.slug} className="rounded-xl border border-wur-warning/25 bg-wur-warning/5 px-4 py-3">
                  {/* Utility header row */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <Link
                        href={`/utilities/${u.slug}`}
                        className="font-semibold text-sm text-foreground hover:text-wur-teal transition-colors"
                      >
                        {normalizeName(u.name)}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {u.city_served ?? state.name} · {u.population_served.toLocaleString()} served · PWSID {u.pwsid}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full border ${
                        u.risk_level === "safe" ? "text-wur-safe bg-wur-safe-bg border-wur-safe-border" :
                        u.risk_level === "low" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                        u.risk_level === "moderate" ? "text-wur-caution bg-wur-caution-bg border-wur-caution-border" :
                        u.risk_level === "high" ? "text-wur-warning bg-wur-warning-bg border-wur-warning-border" :
                        "text-wur-danger bg-wur-danger-bg border-wur-danger-border"
                      }`}>{u.risk_level}</span>
                      <Link href={`/utilities/${u.slug}`} className="text-xs text-wur-teal hover:underline">
                        View utility →
                      </Link>
                    </div>
                  </div>

                  {/* Violation count — linked to EPA ECHO */}
                  <a
                    href={`https://echo.epa.gov/detailed-facility-report?fid=${u.pwsid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 mb-2 text-[10px] font-semibold uppercase tracking-widest text-wur-warning hover:underline"
                  >
                    {u.violations.length} open health-based {u.violations.length === 1 ? "violation" : "violations"} ↗ EPA ECHO
                  </a>

                  {/* Compact violation rows */}
                  <div className="divide-y divide-border rounded-lg border border-border bg-background/60 overflow-hidden">
                    {u.violations.map((v) => (
                      <div key={v.id} className="flex flex-wrap items-baseline gap-x-6 gap-y-0.5 px-3 py-2 text-xs">
                        <span className="font-medium text-foreground min-w-[140px]">
                          {v.contaminant_name ?? v.contaminant_code ?? "Contaminant not identified"}
                        </span>
                        <span className="text-muted-foreground">{v.violation_type ?? "Health-based"}</span>
                        <span className="text-muted-foreground">
                          {v.violation_date
                            ? new Date(v.violation_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Date not in dataset"}
                        </span>
                        {v.description && (
                          <span className="w-full text-muted-foreground/80 pt-0.5">{v.description}</span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-2">
                    <Link href={`/utilities/${u.slug}/records`} className="text-xs text-wur-teal hover:underline">
                      Official source records →
                    </Link>
                    <a
                      href={`https://echo.epa.gov/detailed-facility-report?fid=${u.pwsid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      View on EPA ECHO ↗
                    </a>
                    <Link href="/help/health-based-violation-record-meaning" className="text-xs text-muted-foreground hover:underline">
                      What a health-based violation means
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
              Records sourced from EPA SDWIS. A record may be under review or resolved at the utility level but not yet updated in federal records. Water Utility Report does not determine whether water is safe to drink.
            </p>
          </section>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">

            {/* Summary */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Drinking Water in {state.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{state.summary}</p>
            </section>

            {/* Risk Intelligence Sections */}
            {(highRiskUtilities.length > 0 || safestUtilities.length > 0) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Highest risk */}
                {highRiskUtilities.length > 0 && (
                  <section>
                    <h2 className="font-display text-xl text-foreground mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-wur-danger shrink-0" />
                      Highest Risk Utilities
                    </h2>
                    <p className="text-xs text-muted-foreground mb-3">
                      {state.name} systems with open health-based violations in EPA records.
                    </p>
                    <div className="space-y-1.5">
                      {highRiskUtilities.map((u) => (
                        <Link
                          key={u.slug}
                          href={`/utilities/${u.slug}`}
                          className="group flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-wur-danger/30 transition-all"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors truncate">
                              {normalizeName(u.name)}
                            </p>
                            <p className="text-xs text-muted-foreground">{u.city_served ?? state.name} · {u.population_served.toLocaleString()}</p>
                          </div>
                          <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full border shrink-0 ml-2 ${
                            riskBgs[u.risk_level] ?? riskBgs.safe
                          }`}>{u.risk_level}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Safest large utilities */}
                {safestUtilities.length > 0 && (
                  <section>
                    <h2 className="font-display text-xl text-foreground mb-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-wur-safe shrink-0" />
                      Safest Large Utilities
                    </h2>
                    <p className="text-xs text-muted-foreground mb-3">
                      {state.name} systems with no open health violations serving 10,000+ residents.
                    </p>
                    <div className="space-y-1.5">
                      {safestUtilities.map((u) => (
                        <Link
                          key={u.slug}
                          href={`/utilities/${u.slug}`}
                          className="group flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-wur-safe/30 transition-all"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors truncate">
                              {normalizeName(u.name)}
                            </p>
                            <p className="text-xs text-muted-foreground">{u.city_served ?? state.name} · {u.population_served.toLocaleString()}</p>
                          </div>
                          <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full border shrink-0 ml-2 ${
                            riskBgs[u.risk_level] ?? riskBgs.safe
                          }`}>{u.risk_level}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* Utilities from DB */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-foreground">
                  Utilities in {state.name}
                </h2>
                {dbUtilityCount > 0 && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {((page - 1) * PAGE_SIZE + 1).toLocaleString()}–{Math.min(page * PAGE_SIZE, dbUtilityCount).toLocaleString()} of {dbUtilityCount.toLocaleString()}
                  </span>
                )}
              </div>
              {dbUtilities.length > 0 ? (
                <>
                  <div className="space-y-2">
                    {dbUtilities.map((utility) => (
                      <Link
                        key={utility.slug}
                        href={`/utilities/${utility.slug}`}
                        className="group flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-wur-teal/50 hover:shadow-sm transition-all"
                      >
                        <Droplets className="w-4 h-4 text-wur-teal shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium text-foreground group-hover:text-wur-teal transition-colors text-sm truncate">
                                {normalizeName(utility.name)}
                              </p>
                              <p className="text-xs text-muted-foreground font-mono mt-0.5">
                                {utility.pwsid} · {utility.population_served.toLocaleString()} served
                              </p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${riskBgs[utility.risk_level]}`}>
                              {utility.risk_level}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal shrink-0 transition-colors" />
                      </Link>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                      <Link
                        href={page > 1 ? `/states/${stateSlug}?page=${page - 1}` : "#"}
                        aria-disabled={page <= 1}
                        className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border transition-colors ${
                          page <= 1
                            ? "border-border text-muted-foreground/30 pointer-events-none"
                            : "border-border text-muted-foreground hover:border-wur-teal hover:text-wur-teal"
                        }`}
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Previous
                      </Link>
                      <span className="text-xs text-muted-foreground font-mono">
                        Page {page} of {totalPages}
                      </span>
                      <Link
                        href={page < totalPages ? `/states/${stateSlug}?page=${page + 1}` : "#"}
                        aria-disabled={page >= totalPages}
                        className={`flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg border transition-colors ${
                          page >= totalPages
                            ? "border-border text-muted-foreground/30 pointer-events-none"
                            : "border-border text-muted-foreground hover:border-wur-teal hover:text-wur-teal"
                        }`}
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="rounded-lg border border-border bg-muted/30 p-5">
                  <p className="text-sm text-muted-foreground">Detailed utility pages for {state.name} are being prepared and will go live soon. <a href="/states" className="text-wur-teal hover:underline">Browse available states →</a></p>
                </div>
              )}
            </section>

            {/* Contaminant concerns */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">Key Contaminant Concerns in {state.name}</h2>
              <p className="text-sm text-muted-foreground mb-5">
                These contaminants appear most frequently in {state.name} utility records or pose elevated risk in this region based on EPA data.
              </p>
              {stateContaminants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stateContaminants.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/contaminants/${c.slug}`}
                      className="group flex flex-col p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <FlaskConical className="w-4 h-4 text-muted-foreground" />
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${riskBgs[c.riskLevel]}`}>
                          {c.riskLevel}
                        </span>
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-wur-teal transition-colors mb-1">
                        {c.shortName}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{c.definition}</p>
                      {c.epaLimit && (
                        <p className="text-[10px] text-muted-foreground/70 font-mono mt-2">EPA limit: {c.epaLimit}</p>
                      )}
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No specific contaminants tracked for this state yet.</p>
              )}
            </section>

            {/* City water reports — expanded grid */}
            {topCities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  City Water Reports in {state.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Tap water quality pages for {state.name} cities — violations, PFAS records, utility profiles, and official source links.
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {topCities.map(c => (
                    <Link
                      key={c.slug}
                      href={`/cities/${c.slug}-${state.abbreviation.toLowerCase()}`}
                      className="group flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <MapPin className="w-3 h-3 shrink-0 text-wur-teal/50 group-hover:text-wur-teal transition-colors" />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate">{c.name}</span>
                    </Link>
                  ))}
                </div>
                <Link
                  href={`/pfas-watchlist/${stateSlug}`}
                  className="inline-flex items-center gap-1.5 text-xs text-wur-teal hover:underline mt-4"
                >
                  <FlaskConical className="w-3 h-3" />
                  {state.name} PFAS Watchlist — all utilities with official records
                </Link>
              </section>
            )}

            {/* Labs CTA */}
            <section className="rounded-xl border border-border bg-card p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Independent Water Testing</p>
              <h2 className="font-display text-lg text-foreground mb-2">Find a certified lab in {state.name}</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Utility compliance records show what water systems report to the EPA. An independent test from a certified laboratory confirms what&apos;s actually in your tap water. {state.name} labs can test for PFAS, lead, nitrates, bacteria, and dozens of other contaminants.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/labs?state=${stateSlug}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-wur-teal/40 bg-teal-50 text-wur-teal hover:bg-teal-100 transition-colors font-medium"
                >
                  Find certified labs in {state.name} →
                </Link>
                <Link
                  href="/treatment"
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
                >
                  Browse treatment options
                </Link>
              </div>
            </section>

            <ExploreArea
              areaType="state"
              areaName={state.name}
              stateSlug={stateSlug}
              stateName={state.name}
              stateAbbr={state.abbreviation}
              topUtilities={dbUtilities.slice(0, 3)}
              pfasUtilityCount={pfasUtilityCount}
              openViolationCount={openViolationsUtilityCount}
            />

            <RelatedWaterQuestions
              title={`Common Questions About ${state.name} Drinking Water`}
              questions={[
                {
                  question: `Does ${state.name} drinking water have PFAS?`,
                  href: `/pfas-watchlist/${stateSlug}`,
                  description: pfasUtilityCount > 0
                    ? `${pfasUtilityCount} ${state.name} water systems have EPA UCMR 5 PFAS monitoring records (2023–2025)`
                    : `Official EPA UCMR 5 PFAS monitoring data for ${state.name} water systems`,
                  eventName: "related_question_click",
                  eventParams: { question: "pfas_state", state: stateSlug },
                },
                {
                  question: `Which ${state.name} water utilities have open violations?`,
                  href: `/states/${stateSlug}`,
                  description: openViolationsUtilityCount > 0
                    ? `${openViolationsUtilityCount} systems have open health-based violations in EPA SDWIS — search for your utility`
                    : `Browse ${state.name} utility compliance records and violation history`,
                  eventName: "related_question_click",
                  eventParams: { question: "violations_state", state: stateSlug },
                },
                {
                  question: `How do I test my water in ${state.name}?`,
                  href: `/labs?state=${stateSlug}`,
                  description: `State-certified labs for PFAS (EPA 533/537.1), lead, nitrate, and bacteria testing`,
                  eventName: "related_question_click",
                  eventParams: { question: "labs_state", state: stateSlug },
                },
                {
                  question: `What treatment removes PFAS from ${state.abbreviation} tap water?`,
                  href: `/treatment/reverse-osmosis`,
                  description: "Reverse osmosis removes PFAS, lead, arsenic, and nitrates — cost, maintenance, and NSF certification explained",
                  eventName: "related_question_click",
                  eventParams: { question: "treatment_ro", state: stateSlug },
                },
                {
                  question: `What do ${state.name} PFAS records tell me about my water?`,
                  href: `/contaminants/pfas`,
                  description: "EPA limits, health context, and what UCMR 5 detection above MRL means for your water",
                  eventName: "related_question_click",
                  eventParams: { question: "pfas_contaminant", state: stateSlug },
                },
                {
                  question: `How is ${state.name} water quality data sourced here?`,
                  href: `/methodology`,
                  description: "EPA SDWIS violations, UCMR 5 PFAS records, and CCR data — sources, accuracy notes, and limitations",
                  eventName: "source_methodology_click",
                  eventParams: { from: "state", state: stateSlug },
                },
              ]}
            />

            <section id="faq">
              <FaqSection faqs={stateFaqs} title={`${state.name} Water FAQs`} />
            </section>

            {/* Data source note */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Data sources:</span>{" "}
                Utility compliance and violation data from <strong>EPA SDWIS</strong> (Safe Drinking Water Information System).
                PFAS monitoring records from <strong>EPA UCMR 5</strong> (Unregulated Contaminant Monitoring Rule 5, 2023–2025).
                Contaminant data from EPA and ATSDR public references.
                This page summarizes public records — it is not a compliance determination.{" "}
                <Link href="/methodology" className="text-wur-teal hover:underline">Methodology →</Link>
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">Last updated: {state.lastUpdated}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* At a Glance */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">{state.name} at a Glance</h3>
              <div className="space-y-3">
                {[
                  { label: "Utilities tracked", value: dbUtilityCount.toLocaleString(), mono: true },
                  { label: "Population served", value: `${(state.populationServed / 1_000_000).toFixed(1)}M`, mono: true },
                  { label: "On private wells", value: `${state.wellWaterPercent}%`, mono: true },
                  {
                    label: "With open violations",
                    value: openViolationsUtilityCount.toLocaleString(),
                    mono: true,
                    color: openViolationsUtilityCount > 0 ? "text-wur-warning" : "text-wur-safe",
                  },
                  {
                    label: "PFAS monitored (UCMR 5)",
                    value: pfasUtilityCount.toLocaleString(),
                    mono: true,
                  },
                ].map(({ label, value, mono, color }) => (
                  <div key={label} className="flex items-start justify-between">
                    <span className="text-xs text-muted-foreground">{label}</span>
                    <span className={`text-xs font-semibold ${mono ? "font-mono" : ""} ${color ?? "text-foreground"}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href={`/pfas-watchlist/${stateSlug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                  <FlaskConical className="w-3.5 h-3.5 shrink-0" /> {state.name} PFAS Watchlist
                </Link>
                <Link href={`/well-water/${stateSlug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {state.name} Well Water Guide
                </Link>
                <Link href={`/labs?state=${stateSlug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                  <FlaskConical className="w-3.5 h-3.5 shrink-0" /> Certified Labs in {state.abbreviation}
                </Link>
              </div>
            </div>

            {/* City list */}
            {topCities.length > 0 && (
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground text-sm mb-3">City Water Reports</h3>
                <div className="space-y-1.5">
                  {topCities.slice(0, 10).map(c => (
                    <Link
                      key={c.slug}
                      href={`/cities/${c.slug}-${state.abbreviation.toLowerCase()}`}
                      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
                    >
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      {c.name} water quality
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Guides */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Water Quality Guides</h3>
              <div className="space-y-1.5">
                {[
                  { href: "/guides/how-to-read-a-water-quality-report", label: "How to read a water quality report" },
                  { href: "/guides/best-filter-for-pfas-in-drinking-water", label: "Best filters for PFAS removal" },
                  { href: "/guides/home-water-test-kits-vs-certified-labs", label: "Home test kits vs. certified labs" },
                ].map(link => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors py-0.5"
                  >
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Contaminant chips */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Top Contaminants in {state.abbreviation}</h3>
              <div className="flex flex-wrap gap-2">
                {state.topContaminants.map((slug) => {
                  const c = contaminants.find((x) => x.slug === slug);
                  return (
                    <Link key={slug} href={`/contaminants/${slug}`} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground hover:bg-wur-teal hover:text-white transition-colors">
                      {c?.shortName ?? slug}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Other states */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Other States</h3>
              <div className="space-y-1">
                {stateContent.filter((s) => s.slug !== stateSlug).map((s) => (
                  <Link key={s.slug} href={`/states/${s.slug}`} className="flex items-center justify-between py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group">
                    <span>{s.name}</span>
                    <span className="text-xs font-mono text-muted-foreground/50 group-hover:text-primary/60">{s.abbreviation}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
