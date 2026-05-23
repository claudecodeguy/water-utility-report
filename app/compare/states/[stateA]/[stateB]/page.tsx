import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  MapPin,
  Building2,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Users,
  FlaskConical,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getStateContentBySlug } from "@/lib/content/states";
import RelatedPages from "@/components/related-pages";
import FaqSection from "@/components/faq-section";
import JsonLd from "@/components/json-ld";
import type { RiskLevel } from "@/lib/types";
import { riskConfig } from "@/lib/types";
import contaminants from "@/lib/content/contaminants";

export const revalidate = 86400;

const TOP_PAIRS = [
  ["california", "texas"],
  ["new-york", "florida"],
  ["ohio", "michigan"],
  ["illinois", "pennsylvania"],
  ["arizona", "nevada"],
  ["washington", "oregon"],
  ["new-jersey", "connecticut"],
  ["north-carolina", "virginia"],
  ["georgia", "florida"],
  ["texas", "florida"],
  ["california", "florida"],
  ["new-york", "texas"],
  ["michigan", "ohio"],
  ["indiana", "ohio"],
  ["massachusetts", "new-york"],
];

export async function generateStaticParams() {
  return TOP_PAIRS.map(([stateA, stateB]) => ({ stateA, stateB }));
}

type Props = {
  params: Promise<{ stateA: string; stateB: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { stateA, stateB } = await params;
  const a = getStateContentBySlug(stateA);
  const b = getStateContentBySlug(stateB);
  if (!a || !b) return { title: "State Comparison | Water Utility Report" };
  return {
    title: `${a.name} vs ${b.name} Water Quality | Water Utility Report`,
    description: `Side-by-side comparison of drinking water quality in ${a.name} and ${b.name}: utility counts, violation rates, PFAS prevalence, and highest-risk systems.`,
  };
}

async function getStateStats(stateId: string) {
  const [
    totalUtilities,
    openViolationsCount,
    pfasCount,
    highRiskCount,
    safeCount,
    highRiskUtilities,
  ] = await Promise.all([
    prisma.utility.count({
      where: { state_id: stateId, publish_status: "published" },
    }),
    prisma.utility.count({
      where: {
        state_id: stateId,
        publish_status: "published",
        violations: { some: { is_health_based: true, resolution_date: null } },
      },
    }),
    prisma.utility.count({
      where: {
        state_id: stateId,
        publish_status: "published",
        pfas_records: { some: { suppressed: false, validated: true } },
      },
    }),
    prisma.utility.count({
      where: {
        state_id: stateId,
        publish_status: "published",
        risk_level: { in: ["high", "critical"] },
      },
    }),
    prisma.utility.count({
      where: {
        state_id: stateId,
        publish_status: "published",
        risk_level: { in: ["safe", "low"] },
      },
    }),
    prisma.utility.findMany({
      where: {
        state_id: stateId,
        publish_status: "published",
        violations: { some: { is_health_based: true, resolution_date: null } },
      },
      select: { slug: true, name: true, risk_level: true, population_served: true, city_served: true },
      orderBy: [{ risk_level: "desc" }, { population_served: "desc" }],
      take: 3,
    }),
  ]);

  return { totalUtilities, openViolationsCount, pfasCount, highRiskCount, safeCount, highRiskUtilities };
}

export default async function StateComparisonPage({ params }: Props) {
  const { stateA, stateB } = await params;

  const contentA = getStateContentBySlug(stateA);
  const contentB = getStateContentBySlug(stateB);
  if (!contentA || !contentB) notFound();

  const [dbA, dbB] = await Promise.all([
    prisma.state.findUnique({ where: { slug: stateA } }),
    prisma.state.findUnique({ where: { slug: stateB } }),
  ]);
  if (!dbA || !dbB) notFound();

  const [statsA, statsB] = await Promise.all([
    getStateStats(dbA.id),
    getStateStats(dbB.id),
  ]);

  const violationRateA = statsA.totalUtilities > 0
    ? ((statsA.openViolationsCount / statsA.totalUtilities) * 100).toFixed(1)
    : "0.0";
  const violationRateB = statsB.totalUtilities > 0
    ? ((statsB.openViolationsCount / statsB.totalUtilities) * 100).toFixed(1)
    : "0.0";
  const pfasRateA = statsA.totalUtilities > 0
    ? ((statsA.pfasCount / statsA.totalUtilities) * 100).toFixed(1)
    : "0.0";
  const pfasRateB = statsB.totalUtilities > 0
    ? ((statsB.pfasCount / statsB.totalUtilities) * 100).toFixed(1)
    : "0.0";
  const safeRateA = statsA.totalUtilities > 0
    ? ((statsA.safeCount / statsA.totalUtilities) * 100).toFixed(1)
    : "0.0";
  const safeRateB = statsB.totalUtilities > 0
    ? ((statsB.safeCount / statsB.totalUtilities) * 100).toFixed(1)
    : "0.0";

  const aScoreViolation = parseFloat(violationRateA);
  const bScoreViolation = parseFloat(violationRateB);
  const saferByViolations =
    aScoreViolation < bScoreViolation ? contentA.name :
    bScoreViolation < aScoreViolation ? contentB.name : null;

  const topContaminantsA = contentA.topContaminants
    .map((slug) => contaminants.find((c) => c.slug === slug)?.shortName ?? slug)
    .join(", ");
  const topContaminantsB = contentB.topContaminants
    .map((slug) => contaminants.find((c) => c.slug === slug)?.shortName ?? slug)
    .join(", ");

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which state has better drinking water — ${contentA.name} or ${contentB.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: saferByViolations
            ? `${saferByViolations} has a lower percentage of utilities with open health-based violations. ${contentA.name} has ${violationRateA}% of utilities with open violations vs. ${violationRateB}% in ${contentB.name}.`
            : `${contentA.name} and ${contentB.name} have similar open-violation rates (${violationRateA}% each). Compare PFAS prevalence and high-risk utility counts for a fuller picture.`,
        },
      },
      {
        "@type": "Question",
        name: `How many water utilities are in ${contentA.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${contentA.name} has ${statsA.totalUtilities.toLocaleString()} community water systems in our database. Of those, ${statsA.openViolationsCount} (${violationRateA}%) have at least one open health-based violation.`,
        },
      },
      {
        "@type": "Question",
        name: `How many water utilities are in ${contentB.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${contentB.name} has ${statsB.totalUtilities.toLocaleString()} community water systems in our database. Of those, ${statsB.openViolationsCount} (${violationRateB}%) have at least one open health-based violation.`,
        },
      },
      {
        "@type": "Question",
        name: `Is PFAS contamination more common in ${contentA.name} or ${contentB.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${contentA.name} has PFAS detection records for ${statsA.pfasCount} utilities (${pfasRateA}% of systems). ${contentB.name} has PFAS records for ${statsB.pfasCount} utilities (${pfasRateB}%). ${parseFloat(pfasRateA) < parseFloat(pfasRateB) ? contentA.name : contentB.name} has a lower PFAS detection rate.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the top contaminants in ${contentA.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The most commonly reported contaminants in ${contentA.name} are: ${topContaminantsA}. ${contentA.summary.split(".")[0]}.`,
        },
      },
      {
        "@type": "Question",
        name: `What are the top contaminants in ${contentB.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The most commonly reported contaminants in ${contentB.name} are: ${topContaminantsB}. ${contentB.summary.split(".")[0]}.`,
        },
      },
    ],
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Compare", item: "https://waterutilityreport.com/compare" },
      {
        "@type": "ListItem",
        position: 3,
        name: `${contentA.name} vs ${contentB.name}`,
        item: `https://waterutilityreport.com/compare/states/${stateA}/${stateB}`,
      },
    ],
  };

  const faqs = [
    {
      question: `Which state has better drinking water — ${contentA.name} or ${contentB.name}?`,
      answer: saferByViolations
        ? `${saferByViolations} has a lower percentage of utilities with open health-based violations (${saferByViolations === contentA.name ? violationRateA : violationRateB}% vs. ${saferByViolations === contentA.name ? violationRateB : violationRateA}%). However, violation rate alone does not tell the full story — PFAS prevalence, contaminant type, and population affected all matter.`
        : `Both states have similar open-violation rates (${violationRateA}%). Look at PFAS prevalence and specific contaminant profiles to compare more deeply.`,
    },
    {
      question: `Does ${contentA.name} have more PFAS-contaminated utilities than ${contentB.name}?`,
      answer: `${contentA.name} has PFAS records for ${statsA.pfasCount} utilities (${pfasRateA}% of systems). ${contentB.name} has PFAS records for ${statsB.pfasCount} utilities (${pfasRateB}%). ${parseFloat(pfasRateA) <= parseFloat(pfasRateB) ? `${contentA.name} has a lower detected PFAS rate.` : `${contentB.name} has a lower detected PFAS rate.`} Note: PFAS monitoring varies by system size and state program.`,
    },
    {
      question: `How many people rely on public water in each state?`,
      answer: `${contentA.name} public water systems serve an estimated ${contentA.populationServed.toLocaleString()} residents. ${contentB.name} public water systems serve an estimated ${contentB.populationServed.toLocaleString()} residents. Approximately ${contentA.wellWaterPercent}% of ${contentA.name} residents use private wells (not regulated under SDWA).`,
    },
    {
      question: `What does "open health-based violation" mean?`,
      answer: "An open health-based violation means a water system has exceeded an EPA Maximum Contaminant Level (MCL) or failed a treatment technique requirement — and has not yet returned to compliance. These are the most serious category of SDWA violations.",
    },
  ];

  return (
    <>
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/compare" className="hover:text-foreground transition-colors">Compare</Link>
          <span>/</span>
          <span className="text-foreground truncate">States</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Compare
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-7 h-7 text-purple-600 shrink-0" />
            <h1 className="font-display text-3xl sm:text-4xl text-foreground">
              {contentA.name} vs {contentB.name}
            </h1>
          </div>
          <p className="text-muted-foreground">
            Statewide drinking water quality comparison — violation rates, PFAS prevalence, and
            system-level risk
          </p>
        </div>

        {/* Quick Answer */}
        <div className="p-5 rounded-xl bg-wur-teal/5 border border-wur-teal/20 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-1">Quick Answer</p>
          <p className="text-foreground font-medium leading-relaxed">
            {saferByViolations
              ? `${saferByViolations} has a lower open-violation rate (${saferByViolations === contentA.name ? violationRateA : violationRateB}% vs. ${saferByViolations === contentA.name ? violationRateB : violationRateA}%).`
              : `${contentA.name} and ${contentB.name} have similar open-violation rates (both ${violationRateA}%).`
            }{" "}
            {contentA.name} has {statsA.pfasCount} utilities with PFAS records ({pfasRateA}%) vs.{" "}
            {statsB.pfasCount} in {contentB.name} ({pfasRateB}%).
          </p>
        </div>

        {/* Side-by-side stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {[
            { content: contentA, stats: statsA, violationRate: violationRateA, pfasRate: pfasRateA, safeRate: safeRateA, slug: stateA },
            { content: contentB, stats: statsB, violationRate: violationRateB, pfasRate: pfasRateB, safeRate: safeRateB, slug: stateB },
          ].map(({ content, stats, violationRate, pfasRate, safeRate, slug }) => (
            <div key={slug} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3 mb-5">
                <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <Link
                    href={`/states/${slug}`}
                    className="font-semibold text-foreground hover:text-purple-700 transition-colors"
                  >
                    {content.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {content.abbreviation} · {stats.totalUtilities.toLocaleString()} utilities
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{violationRate}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Open violation rate</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{pfasRate}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">PFAS detection rate</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{stats.highRiskCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">High/critical risk</p>
                </div>
                <div className="rounded-lg bg-muted/40 p-3 text-center">
                  <p className="text-xl font-bold text-foreground">{safeRate}%</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Safe/low risk</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed comparison table */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">Head-to-Head Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-1/3">Metric</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    <Link href={`/states/${stateA}`} className="hover:text-purple-700 transition-colors">
                      {contentA.name}
                    </Link>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    <Link href={`/states/${stateB}`} className="hover:text-purple-700 transition-colors">
                      {contentB.name}
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Total Utilities</td>
                  <td className="px-4 py-3 font-mono">{statsA.totalUtilities.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">{statsB.totalUtilities.toLocaleString()}</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Population Served</td>
                  <td className="px-4 py-3 font-mono">{contentA.populationServed.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">{contentB.populationServed.toLocaleString()}</td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Well Water %</td>
                  <td className="px-4 py-3">{contentA.wellWaterPercent}% on private wells</td>
                  <td className="px-4 py-3">{contentB.wellWaterPercent}% on private wells</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Open Violation Rate</td>
                  <td className="px-4 py-3">
                    <span className={parseFloat(violationRateA) > 10 ? "text-wur-danger font-semibold" : parseFloat(violationRateA) > 5 ? "text-wur-warning font-semibold" : "text-wur-safe font-semibold"}>
                      {violationRateA}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">({statsA.openViolationsCount} utilities)</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={parseFloat(violationRateB) > 10 ? "text-wur-danger font-semibold" : parseFloat(violationRateB) > 5 ? "text-wur-warning font-semibold" : "text-wur-safe font-semibold"}>
                      {violationRateB}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">({statsB.openViolationsCount} utilities)</span>
                  </td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">PFAS Detection Rate</td>
                  <td className="px-4 py-3">
                    <span className={parseFloat(pfasRateA) > 20 ? "text-wur-warning font-semibold" : "text-foreground"}>
                      {pfasRateA}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">({statsA.pfasCount} utilities)</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={parseFloat(pfasRateB) > 20 ? "text-wur-warning font-semibold" : "text-foreground"}>
                      {pfasRateB}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">({statsB.pfasCount} utilities)</span>
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">High/Critical Risk Utilities</td>
                  <td className="px-4 py-3 font-mono">{statsA.highRiskCount.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">{statsB.highRiskCount.toLocaleString()}</td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Safe/Low Risk Rate</td>
                  <td className="px-4 py-3">
                    <span className="text-wur-safe font-semibold">{safeRateA}%</span>
                    <span className="text-xs text-muted-foreground ml-1">({statsA.safeCount} utilities)</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-wur-safe font-semibold">{safeRateB}%</span>
                    <span className="text-xs text-muted-foreground ml-1">({statsB.safeCount} utilities)</span>
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Top Contaminants</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {contentA.topContaminants.map((slug) => (
                        <Link
                          key={slug}
                          href={`/contaminants/${slug}`}
                          className="text-xs bg-wur-warning-bg text-wur-warning px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                        >
                          {contaminants.find((c) => c.slug === slug)?.shortName ?? slug}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {contentB.topContaminants.map((slug) => (
                        <Link
                          key={slug}
                          href={`/contaminants/${slug}`}
                          className="text-xs bg-wur-warning-bg text-wur-warning px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                        >
                          {contaminants.find((c) => c.slug === slug)?.shortName ?? slug}
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* State summaries */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">State Profiles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { content: contentA, slug: stateA, stats: statsA },
              { content: contentB, slug: stateB, stats: statsB },
            ].map(({ content, slug, stats }) => (
              <div key={slug} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                  {content.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{content.summary}</p>
                {stats.highRiskUtilities.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                      Highest-Risk Systems
                    </p>
                    <div className="space-y-1.5">
                      {stats.highRiskUtilities.map((u) => (
                        <Link
                          key={u.slug}
                          href={`/utilities/${u.slug}`}
                          className="flex items-center justify-between text-xs hover:text-wur-teal transition-colors"
                        >
                          <span className="text-foreground truncate">{u.name}</span>
                          <span className={`ml-2 shrink-0 font-semibold ${riskConfig[(u.risk_level as RiskLevel) ?? "moderate"].color}`}>
                            {u.risk_level}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Key differences */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">Key Differences</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              {parseFloat(violationRateA) <= parseFloat(violationRateB) ? (
                <CheckCircle2 className="w-5 h-5 text-wur-safe shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-wur-warning shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-foreground">
                <span className="font-semibold">Open violation rate:</span>{" "}
                {contentA.name} at {violationRateA}% vs. {contentB.name} at {violationRateB}%.{" "}
                {saferByViolations
                  ? `${saferByViolations} has a lower rate of systems with unresolved health-based violations.`
                  : "Both states have similar open-violation rates."
                }
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              {parseFloat(pfasRateA) <= parseFloat(pfasRateB) ? (
                <CheckCircle2 className="w-5 h-5 text-wur-safe shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-wur-warning shrink-0 mt-0.5" />
              )}
              <p className="text-sm text-foreground">
                <span className="font-semibold">PFAS detection:</span>{" "}
                {contentA.name} has PFAS records at {pfasRateA}% of utilities vs. {pfasRateB}% in{" "}
                {contentB.name}. Rates reflect UCMR 5 monitoring (2023–2025).
              </p>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <Users className="w-5 h-5 text-wur-teal shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">
                <span className="font-semibold">Well water reliance:</span>{" "}
                {contentA.name} ({contentA.wellWaterPercent}% on private wells) vs. {contentB.name}{" "}
                ({contentB.wellWaterPercent}% on private wells). Private well users are not regulated
                under the Safe Drinking Water Act and should test independently.
              </p>
            </div>
          </div>
        </section>

        <FaqSection faqs={faqs} />

        <RelatedPages
          className="mt-10"
          pages={[
            { href: `/states/${stateA}`, label: `${contentA.name} Water Quality`, type: "state", description: `All utilities in ${contentA.name}` },
            { href: `/states/${stateB}`, label: `${contentB.name} Water Quality`, type: "state", description: `All utilities in ${contentB.name}` },
            { href: `/contaminants/pfas/${stateA}`, label: `PFAS in ${contentA.name}`, type: "contaminant", description: "State-level PFAS data" },
            { href: `/contaminants/pfas/${stateB}`, label: `PFAS in ${contentB.name}`, type: "contaminant", description: "State-level PFAS data" },
            { href: "/compare", label: "More Comparisons", type: "state", description: "Utilities, contaminants, and more" },
          ]}
        />
      </main>
    </>
  );
}
