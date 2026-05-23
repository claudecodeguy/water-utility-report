import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FlaskConical,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ArrowRight,
  Droplets,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getContaminantBySlug } from "@/lib/content/contaminants";
import treatmentMethods, { type TreatmentMethod } from "@/lib/content/treatments";
import RelatedPages from "@/components/related-pages";
import FaqSection from "@/components/faq-section";
import JsonLd from "@/components/json-ld";

export const revalidate = 86400;

const VIOLATION_TERMS: Record<string, string[]> = {
  pfas: ["pfas", "pfoa", "pfos"],
  lead: ["lead"],
  arsenic: ["arsenic"],
  nitrates: ["nitrate", "nitrite"],
  nitrate: ["nitrate", "nitrite"],
  "disinfection-byproducts": ["trihalomethane", "thm", "haloacetic", "haa"],
  copper: ["copper"],
  uranium: ["uranium"],
  radium: ["radium"],
  selenium: ["selenium"],
  cadmium: ["cadmium"],
  mercury: ["mercury"],
  barium: ["barium"],
  atrazine: ["atrazine"],
  vocs: ["voc", "trichloroethylene", "tetrachloroethylene", "benzene"],
  perchlorate: ["perchlorate"],
  cryptosporidium: ["cryptosporidium"],
  "hydrogen-sulfide": ["hydrogen sulfide", "sulfide"],
};

async function getUtilityCount(slug: string): Promise<number> {
  const terms = VIOLATION_TERMS[slug] ?? [slug];
  if (terms.length === 0) return 0;
  return prisma.utility.count({
    where: {
      publish_status: "published",
      violations: {
        some: {
          OR: terms.map((term) => ({
            contaminant_name: { contains: term, mode: "insensitive" as const },
          })),
        },
      },
    },
  });
}

const KEY_PAIRS = [
  ["pfas", "lead"],
  ["pfas", "arsenic"],
  ["lead", "arsenic"],
  ["nitrates", "lead"],
  ["pfas", "nitrates"],
  ["arsenic", "nitrates"],
  ["pfas", "disinfection-byproducts"],
  ["lead", "copper"],
  ["uranium", "arsenic"],
  ["vocs", "pfas"],
];

export async function generateStaticParams() {
  return KEY_PAIRS.map(([slugA, slugB]) => ({ slugA, slugB }));
}

type Props = {
  params: Promise<{ slugA: string; slugB: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slugA, slugB } = await params;
  const a = getContaminantBySlug(slugA);
  const b = getContaminantBySlug(slugB);
  if (!a || !b) return { title: "Contaminant Comparison | Water Utility Report" };
  return {
    title: `${a.shortName} vs ${b.shortName} in Drinking Water | Water Utility Report`,
    description: `Compare ${a.name} and ${b.name}: EPA limits, health effects, treatment options, and number of affected U.S. water utilities.`,
  };
}

const riskRank: Record<string, number> = { safe: 0, low: 1, moderate: 2, high: 3, critical: 4 };

export default async function ContaminantComparisonPage({ params }: Props) {
  const { slugA, slugB } = await params;

  const contA = getContaminantBySlug(slugA);
  const contB = getContaminantBySlug(slugB);
  if (!contA || !contB) notFound();

  const [utilCountA, utilCountB] = await Promise.all([
    getUtilityCount(slugA),
    getUtilityCount(slugB),
  ]);

  const rankA = riskRank[contA.riskLevel] ?? 2;
  const rankB = riskRank[contB.riskLevel] ?? 2;
  const moreSerious = rankA > rankB ? contA : rankB > rankA ? contB : null;

  const treatmentsA = treatmentMethods.filter((t: TreatmentMethod) => contA.treatments.includes(t.slug));
  const treatmentsB = treatmentMethods.filter((t: TreatmentMethod) => contB.treatments.includes(t.slug));
  const sharedTreatments = treatmentMethods.filter(
    (t: TreatmentMethod) => contA.treatments.includes(t.slug) && contB.treatments.includes(t.slug)
  );

  const riskBadge = (level: string) => {
    const colors: Record<string, string> = {
      safe: "bg-wur-safe-bg text-wur-safe",
      low: "bg-emerald-50 text-emerald-700",
      moderate: "bg-wur-caution-bg text-wur-caution",
      high: "bg-wur-warning-bg text-wur-warning",
      critical: "bg-wur-danger-bg text-wur-danger",
    };
    return colors[level] ?? "bg-muted text-muted-foreground";
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `Which is more dangerous — ${contA.shortName} or ${contB.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: moreSerious
            ? `${moreSerious.name} has a higher EPA risk classification (${moreSerious.riskLevel}). ${moreSerious.whyCare}`
            : `Both ${contA.shortName} and ${contB.shortName} are classified as ${contA.riskLevel} risk by EPA standards. The severity depends on exposure level and individual vulnerability.`,
        },
      },
      {
        "@type": "Question",
        name: `What is the EPA limit for ${contA.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The EPA Maximum Contaminant Level (MCL) for ${contA.name} is ${contA.epaLimit}. ${contA.epaLimitNote ?? ""}`,
        },
      },
      {
        "@type": "Question",
        name: `What is the EPA limit for ${contB.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `The EPA Maximum Contaminant Level (MCL) for ${contB.name} is ${contB.epaLimit}. ${contB.epaLimitNote ?? ""}`,
        },
      },
      {
        "@type": "Question",
        name: `Does reverse osmosis remove both ${contA.shortName} and ${contB.shortName}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: (() => {
            const roA = contA.treatments.includes("reverse-osmosis");
            const roB = contB.treatments.includes("reverse-osmosis");
            if (roA && roB) return `Yes. Reverse osmosis removes both ${contA.shortName} and ${contB.shortName}. It is one of the most effective whole-contaminant filtration technologies.`;
            if (roA) return `Reverse osmosis removes ${contA.shortName} but is not the primary recommended treatment for ${contB.shortName}. See treatment details below.`;
            if (roB) return `Reverse osmosis removes ${contB.shortName} but is not the primary recommended treatment for ${contA.shortName}. See treatment details below.`;
            return `Reverse osmosis is not the primary recommended treatment for either ${contA.shortName} or ${contB.shortName}. Review the treatment options below.`;
          })(),
        },
      },
      {
        "@type": "Question",
        name: `How many U.S. utilities have ${contA.shortName} violations?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${utilCountA.toLocaleString()} U.S. public water systems in our database have recorded violations or detections linked to ${contA.name}.`,
        },
      },
      {
        "@type": "Question",
        name: `How many U.S. utilities have ${contB.shortName} violations?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `${utilCountB.toLocaleString()} U.S. public water systems in our database have recorded violations or detections linked to ${contB.name}.`,
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
        name: `${contA.shortName} vs ${contB.shortName}`,
        item: `https://waterutilityreport.com/compare/contaminants/${slugA}/${slugB}`,
      },
    ],
  };

  const faqs = [
    {
      question: `Which is more dangerous — ${contA.shortName} or ${contB.shortName}?`,
      answer: moreSerious
        ? `${moreSerious.name} carries a higher risk classification (${moreSerious.riskLevel}). ${moreSerious.whyCare} That said, both contaminants require attention — exposure level, duration, and individual health factors all affect actual risk.`
        : `Both are classified as ${contA.riskLevel} risk. The relative danger depends on specific exposure levels and health conditions.`,
    },
    {
      question: `Can you filter out both ${contA.shortName} and ${contB.shortName} with one filter?`,
      answer: sharedTreatments.length > 0
        ? `Yes. ${sharedTreatments.map((t: TreatmentMethod) => t.name).join(" and ")} can remove both ${contA.shortName} and ${contB.shortName}. ${sharedTreatments[0].summary}`
        : `No single filter type covers both optimally. ${contA.shortName} is best addressed by ${treatmentsA.map((t: TreatmentMethod) => t.shortName).join(", ") || "specialized treatment"}; ${contB.shortName} by ${treatmentsB.map((t: TreatmentMethod) => t.shortName).join(", ") || "specialized treatment"}.`,
    },
    {
      question: `Which is more common in U.S. tap water — ${contA.shortName} or ${contB.shortName}?`,
      answer: `${utilCountA.toLocaleString()} utilities have ${contA.shortName}-related violations in our database vs. ${utilCountB.toLocaleString()} for ${contB.shortName}. ${utilCountA > utilCountB ? contA.shortName : contB.shortName} appears in more utility records, but detection rates depend on monitoring requirements.`,
    },
    {
      question: `Who is most at risk from ${contA.shortName} vs. ${contB.shortName}?`,
      answer: `${contA.shortName}: ${contA.whoIsAffected} ${contB.shortName}: ${contB.whoIsAffected}`,
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
          <span className="text-foreground truncate">Contaminants</span>
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
            <FlaskConical className="w-7 h-7 text-wur-warning shrink-0" />
            <h1 className="font-display text-3xl sm:text-4xl text-foreground">
              {contA.shortName} vs {contB.shortName}
            </h1>
          </div>
          <p className="text-muted-foreground">
            EPA limits, health effects, treatment options, and affected U.S. utilities — compared
          </p>
        </div>

        {/* Quick Answer */}
        <div className="p-5 rounded-xl bg-wur-teal/5 border border-wur-teal/20 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-1">Quick Answer</p>
          <p className="text-foreground font-medium leading-relaxed">
            {moreSerious
              ? `${moreSerious.name} carries a higher EPA risk classification (${moreSerious.riskLevel}). `
              : `Both ${contA.shortName} and ${contB.shortName} share the same risk classification (${contA.riskLevel}). `
            }
            {contA.shortName} affects {utilCountA.toLocaleString()} utilities in our database vs.{" "}
            {utilCountB.toLocaleString()} for {contB.shortName}.
          </p>
        </div>

        {/* Side-by-side cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          {[
            { cont: contA, utilCount: utilCountA, slug: slugA },
            { cont: contB, utilCount: utilCountB, slug: slugB },
          ].map(({ cont, utilCount, slug }) => (
            <div key={slug} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start gap-3 mb-4">
                <FlaskConical className="w-5 h-5 text-wur-warning shrink-0 mt-0.5" />
                <div>
                  <Link
                    href={`/contaminants/${slug}`}
                    className="font-semibold text-foreground hover:text-wur-warning transition-colors"
                  >
                    {cont.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{cont.category}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskBadge(cont.riskLevel)}`}>
                    {cont.riskLevel.charAt(0).toUpperCase() + cont.riskLevel.slice(1)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">EPA MCL</span>
                  <span className="font-mono font-semibold text-foreground">{cont.epaLimit}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Utilities Affected</span>
                  <span className="font-mono font-semibold text-foreground">{utilCount.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{cont.summary.split(".")[0]}.</p>
            </div>
          ))}
        </div>

        {/* Full comparison table */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">Head-to-Head Comparison</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground w-1/3">Metric</th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    <Link href={`/contaminants/${slugA}`} className="hover:text-wur-warning transition-colors">
                      {contA.shortName}
                    </Link>
                  </th>
                  <th className="text-left px-4 py-3 font-medium text-foreground">
                    <Link href={`/contaminants/${slugB}`} className="hover:text-wur-warning transition-colors">
                      {contB.shortName}
                    </Link>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Category</td>
                  <td className="px-4 py-3">{contA.category}</td>
                  <td className="px-4 py-3">{contB.category}</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Risk Classification</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskBadge(contA.riskLevel)}`}>
                      {contA.riskLevel}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskBadge(contB.riskLevel)}`}>
                      {contB.riskLevel}
                    </span>
                  </td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">EPA MCL</td>
                  <td className="px-4 py-3 font-mono">{contA.epaLimit}</td>
                  <td className="px-4 py-3 font-mono">{contB.epaLimit}</td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Utilities in Violation</td>
                  <td className="px-4 py-3 font-mono">{utilCountA.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono">{utilCountB.toLocaleString()}</td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Well Water Risk</td>
                  <td className="px-4 py-3">
                    {contA.wellWaterRelevant ? (
                      <span className="text-wur-warning font-medium text-xs">Yes — test recommended</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Lower risk</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {contB.wellWaterRelevant ? (
                      <span className="text-wur-warning font-medium text-xs">Yes — test recommended</span>
                    ) : (
                      <span className="text-muted-foreground text-xs">Lower risk</span>
                    )}
                  </td>
                </tr>
                <tr className="bg-muted/20">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Primary Sources</td>
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5">
                      {contA.sources.slice(0, 3).map((s) => (
                        <li key={s} className="text-xs text-muted-foreground">{s}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3">
                    <ul className="space-y-0.5">
                      {contB.sources.slice(0, 3).map((s) => (
                        <li key={s} className="text-xs text-muted-foreground">{s}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
                <tr className="bg-background">
                  <td className="px-4 py-3 text-muted-foreground font-medium">Recommended Treatments</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {treatmentsA.map((t: TreatmentMethod) => (
                        <Link
                          key={t.slug}
                          href={`/treatment/${t.slug}`}
                          className="text-xs bg-wur-teal/10 text-wur-teal px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                        >
                          {t.shortName}
                        </Link>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {treatmentsB.map((t: TreatmentMethod) => (
                        <Link
                          key={t.slug}
                          href={`/treatment/${t.slug}`}
                          className="text-xs bg-wur-teal/10 text-wur-teal px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity"
                        >
                          {t.shortName}
                        </Link>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Health effects comparison */}
        <section className="mb-10">
          <h2 className="font-display text-2xl text-foreground mb-5">Health Effects Compared</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { cont: contA, slug: slugA },
              { cont: contB, slug: slugB },
            ].map(({ cont, slug }) => (
              <div key={slug} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
                  <AlertTriangle className="w-4 h-4 text-wur-warning shrink-0" />
                  {cont.shortName} Health Effects
                </h3>
                <ul className="space-y-1.5">
                  {cont.healthEffects.map((effect) => (
                    <li key={effect} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <Droplets className="w-3.5 h-3.5 text-wur-warning shrink-0 mt-0.5" />
                      {effect}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground italic">
                  Who is affected: {cont.whoIsAffected}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Shared treatments callout */}
        {sharedTreatments.length > 0 && (
          <section className="mb-10 p-5 rounded-xl bg-wur-teal/5 border border-wur-teal/20">
            <h2 className="font-display text-xl text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-wur-teal" />
              Filters That Remove Both
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              These treatment methods are effective against both {contA.shortName} and {contB.shortName}:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {sharedTreatments.map((t: TreatmentMethod) => (
                <Link
                  key={t.slug}
                  href={`/treatment/${t.slug}`}
                  className="group flex items-start gap-3 p-3 rounded-lg border border-wur-teal/20 bg-background hover:border-wur-teal/40 hover:shadow-sm transition-all"
                >
                  <Wrench className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground group-hover:text-wur-teal transition-colors">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{t.bestFor}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-wur-teal shrink-0 mt-0.5 transition-colors" />
                </Link>
              ))}
            </div>
          </section>
        )}

        <FaqSection faqs={faqs} />

        <RelatedPages
          className="mt-10"
          pages={[
            { href: `/contaminants/${slugA}`, label: `${contA.name}`, type: "contaminant", description: "Full contaminant profile" },
            { href: `/contaminants/${slugB}`, label: `${contB.name}`, type: "contaminant", description: "Full contaminant profile" },
            ...treatmentsA.slice(0, 1).map((t: TreatmentMethod) => ({
              href: `/treatment/${t.slug}`,
              label: `${t.name}`,
              type: "treatment" as const,
              description: `Removes ${contA.shortName}`,
            })),
            ...treatmentsB
              .filter((t: TreatmentMethod) => !contA.treatments.includes(t.slug))
              .slice(0, 1)
              .map((t: TreatmentMethod) => ({
                href: `/treatment/${t.slug}`,
                label: `${t.name}`,
                type: "treatment" as const,
                description: `Removes ${contB.shortName}`,
              })),
            { href: "/compare", label: "More Comparisons", type: "contaminant", description: "Utilities, states, and more" },
          ]}
        />
      </main>
    </>
  );
}
