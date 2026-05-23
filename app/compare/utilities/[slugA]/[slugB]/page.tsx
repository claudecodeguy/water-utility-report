import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  FlaskConical,
  ArrowRight,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import RiskMeter from "@/components/risk-meter";
import RelatedPages from "@/components/related-pages";
import JsonLd from "@/components/json-ld";
import type { RiskLevel } from "@/lib/types";
import { riskConfig } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slugA: string; slugB: string }>;
};

const riskOrder: Record<string, number> = {
  safe: 0,
  low: 1,
  moderate: 2,
  high: 3,
  critical: 4,
};

function openViolationCount(violations: { is_health_based: boolean; resolution_date: Date | null }[]) {
  return violations.filter((v) => v.is_health_based && v.resolution_date === null).length;
}

function uniqueContaminantNames(
  violations: { contaminant_name: string | null }[]
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of violations) {
    if (v.contaminant_name) {
      const key = v.contaminant_name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(v.contaminant_name);
      }
    }
  }
  return out.slice(0, 6);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugA, slugB } = await params;
  const [a, b] = await Promise.all([
    prisma.utility.findUnique({ where: { slug: slugA }, select: { name: true } }),
    prisma.utility.findUnique({ where: { slug: slugB }, select: { name: true } }),
  ]);
  if (!a || !b) return { title: "Utility Comparison | Water Utility Report" };
  return {
    title: `${a.name} vs ${b.name} Water Quality | Water Utility Report`,
    description: `Side-by-side comparison of ${a.name} and ${b.name}: risk levels, violations, PFAS records, and contaminants detected.`,
  };
}

export default async function UtilityComparisonPage({ params }: Props) {
  const { slugA, slugB } = await params;

  const [utilityA, utilityB] = await Promise.all([
    prisma.utility.findUnique({
      where: { slug: slugA },
      include: {
        state: { select: { name: true, slug: true, abbreviation: true } },
        violations: {
          select: { is_health_based: true, resolution_date: true, contaminant_name: true, violation_type: true },
          take: 50,
          orderBy: [{ resolution_date: { sort: "asc", nulls: "first" } }],
        },
        _count: { select: { violations: true } },
        utility_contaminants: {
          include: { contaminant: { select: { name: true, slug: true } } },
          orderBy: { confidence_score: "desc" },
          take: 6,
        },
      },
    }),
    prisma.utility.findUnique({
      where: { slug: slugB },
      include: {
        state: { select: { name: true, slug: true, abbreviation: true } },
        violations: {
          select: { is_health_based: true, resolution_date: true, contaminant_name: true, violation_type: true },
          take: 50,
          orderBy: [{ resolution_date: { sort: "asc", nulls: "first" } }],
        },
        _count: { select: { violations: true } },
        utility_contaminants: {
          include: { contaminant: { select: { name: true, slug: true } } },
          orderBy: { confidence_score: "desc" },
          take: 6,
        },
      },
    }),
  ]);

  if (!utilityA || !utilityB) notFound();
  if (utilityA.publish_status !== "published" || utilityB.publish_status !== "published") notFound();

  const [pfasA, pfasB] = await Promise.all([
    prisma.pfasRecord.count({ where: { pwsid: utilityA.pwsid, suppressed: false, validated: true } }),
    prisma.pfasRecord.count({ where: { pwsid: utilityB.pwsid, suppressed: false, validated: true } }),
  ]);

  const openA = openViolationCount(utilityA.violations);
  const openB = openViolationCount(utilityB.violations);
  const contaminantsA = uniqueContaminantNames(utilityA.violations);
  const contaminantsB = uniqueContaminantNames(utilityB.violations);

  const riskA = riskOrder[utilityA.risk_level ?? "moderate"] ?? 2;
  const riskB = riskOrder[utilityB.risk_level ?? "moderate"] ?? 2;
  const saferUtility = riskA < riskB ? utilityA : riskA > riskB ? utilityB : null;
  const saferLabel = saferUtility
    ? `${saferUtility.name} has a lower risk classification (${saferUtility.risk_level})`
    : `Both utilities share the same risk level (${utilityA.risk_level})`;

  const cfgA = riskConfig[(utilityA.risk_level as RiskLevel) ?? "moderate"];
  const cfgB = riskConfig[(utilityB.risk_level as RiskLevel) ?? "moderate"];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which is safer — ${utilityA.name} or ${utilityB.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${saferLabel}. ${saferUtility ? `${saferUtility.name} has ${openViolationCount(saferUtility.violations)} open health-based violations.` : `Both have similar violation profiles.`}`,
        },
      },
      {
        "@type": "Question",
        name: `How many open violations does ${utilityA.name} have?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${utilityA.name} has ${openA} open health-based violation${openA !== 1 ? "s" : ""} and ${utilityA._count.violations} total recorded violations.`,
        },
      },
      {
        "@type": "Question",
        name: `How many open violations does ${utilityB.name} have?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${utilityB.name} has ${openB} open health-based violation${openB !== 1 ? "s" : ""} and ${utilityB._count.violations} total recorded violations.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${utilityA.name} have PFAS contamination?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: pfasA > 0
            ? `Yes. ${utilityA.name} has ${pfasA} PFAS detection record${pfasA !== 1 ? "s" : ""} in our database.`
            : `No PFAS records have been validated in our database for ${utilityA.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `Does ${utilityB.name} have PFAS contamination?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: pfasB > 0
            ? `Yes. ${utilityB.name} has ${pfasB} PFAS detection record${pfasB !== 1 ? "s" : ""} in our database.`
            : `No PFAS records have been validated in our database for ${utilityB.name}.`,
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
        name: `${utilityA.name} vs ${utilityB.name}`,
        item: `https://waterutilityreport.com/compare/utilities/${slugA}/${slugB}`,
      },
    ],
  };

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
          <span className="text-foreground truncate">Utilities</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Compare
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-2">
            {utilityA.name} vs {utilityB.name}
          </h1>
          <p className="text-muted-foreground">
            Water quality comparison — risk levels, violations, PFAS records, and contaminants
          </p>
        </div>

        {/* Quick Answer */}
        <div className="p-5 rounded-xl bg-wur-teal/5 border border-wur-teal/20 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-1">Quick Answer</p>
          <p className="text-foreground font-medium leading-relaxed">
            {saferLabel}.{" "}
            {utilityA.name} has {openA} open health-based violation{openA !== 1 ? "s" : ""} and{" "}
            {pfasA} PFAS record{pfasA !== 1 ? "s" : ""}.{" "}
            {utilityB.name} has {openB} open health-based violation{openB !== 1 ? "s" : ""} and{" "}
            {pfasB} PFAS record{pfasB !== 1 ? "s" : ""}.
          </p>
        </div>

        {/* Side-by-side risk meters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {[
            { utility: utilityA, pfas: pfasA, open: openA, cfg: cfgA },
            { utility: utilityB, pfas: pfasB, open: openB, cfg: cfgB },
          ].map(({ utility, pfas, open, cfg }) => (
            <div
              key={utility.slug}
              className={`p-5 rounded-xl border-2 ${cfg.border} ${cfg.bg}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <Building2 className="w-5 h-5 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <Link
                    href={`/utilities/${utility.slug}`}
                    className="font-semibold text-foreground hover:text-wur-teal transition-colors"
                  >
                    {utility.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {utility.state.name} · {utility.pwsid}
                  </p>
                </div>
              </div>
              <RiskMeter level={(utility.risk_level as RiskLevel) ?? "moderate"} className="mb-4" />
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-background/60 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{open}</p>
                  <p className="text-xs text-muted-foreground">Open violations</p>
                </div>
                <div className="bg-background/60 rounded-lg p-3 text-center">
                  <p className="text-lg font-bold text-foreground">{pfas}</p>
                  <p className="text-xs text-muted-foreground">PFAS records</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">Head-to-Head Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-1/3">Metric</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    <Link href={`/utilities/${utilityA.slug}`} className="hover:text-wur-teal transition-colors">
                      {utilityA.name}
                    </Link>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    <Link href={`/utilities/${utilityB.slug}`} className="hover:text-wur-teal transition-colors">
                      {utilityB.name}
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">State</td>
                  <td className="px-4 py-3">
                    <Link href={`/states/${utilityA.state.slug}`} className="text-wur-teal hover:underline">
                      {utilityA.state.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/states/${utilityB.state.slug}`} className="text-wur-teal hover:underline">
                      {utilityB.state.name}
                    </Link>
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Risk Level</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${cfgA.bg} ${cfgA.color}`}>
                      {riskConfig[(utilityA.risk_level as RiskLevel) ?? "moderate"].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold uppercase px-2 py-0.5 rounded-full ${cfgB.bg} ${cfgB.color}`}>
                      {riskConfig[(utilityB.risk_level as RiskLevel) ?? "moderate"].label}
                    </span>
                  </td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Population Served</td>
                  <td className="px-4 py-3 font-mono">
                    {utilityA.population_served != null
                      ? utilityA.population_served.toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {utilityB.population_served != null
                      ? utilityB.population_served.toLocaleString()
                      : "—"}
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Open Health Violations</td>
                  <td className="px-4 py-3">
                    <span className={openA > 0 ? "text-wur-danger font-semibold" : "text-wur-safe font-semibold"}>
                      {openA}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={openB > 0 ? "text-wur-danger font-semibold" : "text-wur-safe font-semibold"}>
                      {openB}
                    </span>
                  </td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Total Violations</td>
                  <td className="px-4 py-3 font-mono">{utilityA._count.violations}</td>
                  <td className="px-4 py-3 font-mono">{utilityB._count.violations}</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">PFAS Records</td>
                  <td className="px-4 py-3">
                    <span className={pfasA > 0 ? "text-wur-warning font-semibold" : "text-muted-foreground"}>
                      {pfasA > 0 ? pfasA : "None detected"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={pfasB > 0 ? "text-wur-warning font-semibold" : "text-muted-foreground"}>
                      {pfasB > 0 ? pfasB : "None detected"}
                    </span>
                  </td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Ownership</td>
                  <td className="px-4 py-3">{utilityA.ownership_type ?? "—"}</td>
                  <td className="px-4 py-3">{utilityB.ownership_type ?? "—"}</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Service Type</td>
                  <td className="px-4 py-3">{utilityA.service_type ?? "—"}</td>
                  <td className="px-4 py-3">{utilityB.service_type ?? "—"}</td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">City Served</td>
                  <td className="px-4 py-3">{utilityA.city_served ?? "—"}</td>
                  <td className="px-4 py-3">{utilityB.city_served ?? "—"}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Contaminant breakdown */}
        {(contaminantsA.length > 0 || contaminantsB.length > 0) && (
          <section className="mb-10">
            <h2 className="font-display text-2xl text-foreground mb-5 flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-wur-warning" />
              Contaminants in Violation Records
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { utility: utilityA, names: contaminantsA },
                { utility: utilityB, names: contaminantsB },
              ].map(({ utility, names }) => (
                <div key={utility.slug} className="rounded-xl border border-border bg-card p-5">
                  <p className="font-semibold text-foreground mb-3 text-sm">{utility.name}</p>
                  {names.length > 0 ? (
                    <ul className="space-y-1">
                      {names.map((name) => (
                        <li key={name} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Droplets className="w-3.5 h-3.5 text-wur-teal shrink-0" />
                          {name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No named contaminants in violation records.</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key differences */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">Key Differences</h2>
          <div className="space-y-3">
            {riskA !== riskB && (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                {riskA < riskB ? (
                  <CheckCircle2 className="w-5 h-5 text-wur-safe shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-wur-warning shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{utilityA.name}</span> has a{" "}
                  <span className="font-semibold">{utilityA.risk_level}</span> risk rating vs.{" "}
                  <span className="font-semibold">{utilityB.risk_level}</span> for{" "}
                  <span className="font-semibold">{utilityB.name}</span>.
                </p>
              </div>
            )}
            {openA !== openB && (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                {openA < openB ? (
                  <CheckCircle2 className="w-5 h-5 text-wur-safe shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-wur-warning shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{utilityA.name}</span> has {openA} open
                  health-based violation{openA !== 1 ? "s" : ""} vs. {openB} for{" "}
                  <span className="font-semibold">{utilityB.name}</span>.
                </p>
              </div>
            )}
            {pfasA !== pfasB && (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                {pfasA < pfasB ? (
                  <CheckCircle2 className="w-5 h-5 text-wur-safe shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-wur-warning shrink-0 mt-0.5" />
                )}
                <p className="text-sm text-foreground">
                  <span className="font-semibold">{utilityA.name}</span> has {pfasA} PFAS record
                  {pfasA !== 1 ? "s" : ""} vs. {pfasB} for{" "}
                  <span className="font-semibold">{utilityB.name}</span>.
                </p>
              </div>
            )}
            {utilityA.state.slug !== utilityB.state.slug && (
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <Users className="w-5 h-5 text-wur-teal shrink-0 mt-0.5" />
                <p className="text-sm text-foreground">
                  These utilities are in different states:{" "}
                  <Link href={`/states/${utilityA.state.slug}`} className="text-wur-teal hover:underline">
                    {utilityA.state.name}
                  </Link>{" "}
                  and{" "}
                  <Link href={`/states/${utilityB.state.slug}`} className="text-wur-teal hover:underline">
                    {utilityB.state.name}
                  </Link>
                  . State regulatory programs differ in stringency and monitoring frequency.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* What to do */}
        <section className="mb-10 p-5 rounded-xl bg-wur-warning-bg border border-wur-warning-border">
          <h2 className="font-display text-xl text-foreground mb-3">What Should I Do?</h2>
          <p className="text-sm text-muted-foreground mb-3">
            If either utility shows open violations or elevated PFAS records, consider:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-wur-warning shrink-0 mt-0.5" />
              Installing a{" "}
              <Link href="/treatment/reverse-osmosis" className="text-wur-teal hover:underline">
                reverse osmosis filter
              </Link>{" "}
              — removes PFAS, lead, arsenic, nitrates, and most heavy metals.
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-wur-warning shrink-0 mt-0.5" />
              Requesting your utility&rsquo;s annual Consumer Confidence Report (CCR) for
              the most current test results.
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-wur-warning shrink-0 mt-0.5" />
              Ordering a certified{" "}
              <Link href="/labs" className="text-wur-teal hover:underline">
                lab water test
              </Link>{" "}
              if you want contaminant-specific data for your address.
            </li>
          </ul>
        </section>

        {/* FAQs */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: `Which is safer — ${utilityA.name} or ${utilityB.name}?`,
                a: `${saferLabel}. ${saferUtility
                  ? `${saferUtility.name} has ${openViolationCount(saferUtility.violations)} open health-based violation${openViolationCount(saferUtility.violations) !== 1 ? "s" : ""} compared to ${openViolationCount(saferUtility === utilityA ? utilityB.violations : utilityA.violations)} for the other system.`
                  : "Both utilities have similar violation profiles — review the full data above to decide based on specific contaminants that concern you."
                }`,
              },
              {
                q: `What does "open health-based violation" mean?`,
                a: "An open health-based violation means a water system has exceeded an EPA Maximum Contaminant Level (MCL) or failed to meet a treatment technique — and the violation has not yet been resolved. These are the most serious type of water quality violations.",
              },
              {
                q: `How current is this data?`,
                a: "Violation data comes from EPA's Safe Drinking Water Information System (SDWIS), which is updated as utilities report. PFAS data comes from EPA's UCMR 5 monitoring (2023–2025). Risk levels are recalculated daily.",
              },
              {
                q: `What does PWSID mean?`,
                a: "PWSID stands for Public Water System ID — a unique federal identifier assigned to each community water system. You can use it to look up a system in EPA's ECHO database.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-lg border border-border bg-card p-4">
                <p className="font-semibold text-foreground mb-2 text-sm">{q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <RelatedPages
          pages={[
            {
              href: `/utilities/${utilityA.slug}`,
              label: utilityA.name,
              type: "utility",
              description: `Full profile — ${utilityA.state.name}`,
            },
            {
              href: `/utilities/${utilityB.slug}`,
              label: utilityB.name,
              type: "utility",
              description: `Full profile — ${utilityB.state.name}`,
            },
            {
              href: `/states/${utilityA.state.slug}`,
              label: `${utilityA.state.name} Water Quality`,
              type: "state",
              description: "All utilities in this state",
            },
            ...(utilityA.state.slug !== utilityB.state.slug
              ? [
                  {
                    href: `/states/${utilityB.state.slug}`,
                    label: `${utilityB.state.name} Water Quality`,
                    type: "state" as const,
                    description: "All utilities in this state",
                  },
                ]
              : []),
            { href: "/compare", label: "More Comparisons", type: "utility", description: "States, contaminants, utilities" },
          ]}
        />
      </main>
    </>
  );
}
