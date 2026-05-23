import { notFound } from "next/navigation";
import Link from "next/link";
import { CANARY_OVERRIDES } from "@/lib/canary/seo-overrides";
import CanaryAnswerModule from "@/components/canary-answer-module";
import {
  ArrowLeft, ExternalLink, AlertTriangle, Building2,
  Users, Droplets, FileText, Clock, Wrench,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import treatmentMethods from "@/lib/content/treatments";
import contaminantContent from "@/lib/content/contaminants";
import { LEAD_STATE_SLUGS, NITRATE_STATE_SLUGS } from "@/lib/content/contaminant-state-data";
import RiskMeter from "@/components/risk-meter";
import RelatedPages from "@/components/related-pages";
import SourcesBlock from "@/components/sources-block";
import DataLimitationsNote from "@/components/data-limitations-note";
import JsonLd from "@/components/json-ld";
import ViolationAlertForm from "@/components/violation-alert-form";
import SaveUtilityCTA from "@/components/conversion/save-utility-cta";
import EmailReportCTA from "@/components/conversion/email-report-cta";
import FaqSection from "@/components/faq-section";
import JumpNav from "@/components/jump-nav";
import PageIntroBox from "@/components/page-intro-box";
import TrackedLink from "@/components/tracked-link";
import TrackedAnchor from "@/components/tracked-anchor";
import CopyPwsid from "@/components/copy-pwsid";
import { Badge } from "@/components/ui/badge";
import ExploreSystem from "@/components/explore-system";
import RelatedWaterQuestions, { type WaterQuestion } from "@/components/related-water-questions";
import WaterRecordInterpreter from "@/components/interpreter/water-record-interpreter";
import type { Metadata } from "next";

// Expand raw EPA violation type codes to human-readable labels
const VIOLATION_TYPE_LABELS: Record<string, string> = {
  MR:    "Monitoring & Reporting",
  MON:   "Monitoring & Reporting",
  MCL:   "MCL Violation",
  MCLG:  "MCLG Violation",
  RPT:   "Reporting",
  TT:    "Treatment Technique",
  MRDL:  "Disinfectant Level",
  PN:    "Public Notification",
};

function displayViolationType(raw: string | null): string {
  if (!raw) return "Violation";
  return VIOLATION_TYPE_LABELS[raw.trim().toUpperCase()] ?? raw;
}

// Maps EPA contaminant codes → human-readable names (for violations where name is missing)
const CONTAMINANT_CODE_NAMES: Record<string, string> = {
  "1005": "Total Coliform",
  "1006": "Fecal Coliform",
  "1040": "E. coli",
  "1000": "Giardia lamblia",
  "2456": "Total Trihalomethanes (TTHMs)",
  "2950": "Haloacetic Acids (HAA5)",
  "2451": "Chlorine",
  "2452": "Chloramines",
  "4006": "Nitrate",
  "4010": "Nitrite",
  "4020": "Fluoride",
  "4109": "Arsenic",
  "5000": "Lead",
  "5100": "Copper",
  "4030": "Radium",
  "4101": "Antimony",
  "4102": "Barium",
  "4104": "Beryllium",
  "4105": "Cadmium",
  "4106": "Chromium",
  "4107": "Mercury",
  "4108": "Selenium",
  "4110": "Thallium",
  "2039": "Atrazine",
  "2050": "Benzene",
  "2964": "Chlorobenzene",
  "3100": "PFOA",
  "3101": "PFOS",
  "1094": "Legionella",
};

// Maps violation contaminant names → our content slugs
const VIOLATION_TO_CONTAMINANT_SLUG: Record<string, string> = {
  "lead": "lead",
  "nitrate": "nitrates",
  "nitrates": "nitrates",
  "nitrate (as n)": "nitrates",
  "arsenic": "arsenic",
  "total trihalomethanes (tthms)": "disinfection-byproducts",
  "tthms": "disinfection-byproducts",
  "haloacetic acids (haa5)": "disinfection-byproducts",
  "haa5": "disinfection-byproducts",
  "pfas": "pfas",
  "pfoa": "pfas",
  "pfos": "pfas",
  "perfluorooctanoic acid": "pfas",
  "perfluorooctane sulfonate": "pfas",
};

// Contaminant slugs → recommended treatment slugs (priority order)
const CONTAMINANT_TO_TREATMENTS: Record<string, string[]> = {
  "lead": ["reverse-osmosis", "activated-carbon"],
  "nitrate": ["reverse-osmosis"],
  "nitrates": ["reverse-osmosis"],
  "arsenic": ["reverse-osmosis", "activated-carbon"],
  "disinfection-byproducts": ["activated-carbon", "reverse-osmosis"],
  "pfas": ["reverse-osmosis", "activated-carbon"],
};

// Contaminant names with no content page → direct treatment mapping
const DIRECT_TO_TREATMENTS: Record<string, string[]> = {
  "coliform (tcr)": ["uv-purification"],
  "e. coli": ["uv-purification"],
  "total coliform rule": ["uv-purification"],
  "turbidity": ["whole-house-filter"],
};

// ISR — render on first request, cache 24h
export const revalidate = 86400;

// Don't pre-build 5700 pages at deploy time
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;

  // Canary override — takes precedence over dynamic title/description logic
  const canary = CANARY_OVERRIDES[slug];

  const [utility, pfasCount] = await Promise.all([
    prisma.utility.findUnique({
      where: { slug },
      select: {
        name: true,
        state: { select: { abbreviation: true, name: true } },
        violations: {
          where: { is_health_based: true },
          select: { id: true },
          take: 1,
        },
      },
    }),
    prisma.pfasRecord.count({ where: { utility: { slug } } }),
  ]);
  if (!utility) return {};
  const displayName = normalizeName(utility.name);
  const stateAbbr = utility.state.abbreviation;
  const stateName = utility.state.name;
  const hasViolations = utility.violations.length > 0;
  const hasPfas = pfasCount > 0;
  const url = `https://waterutilityreport.com/utilities/${slug}`;

  // Canary: use override title/description when available
  if (canary) {
    return {
      title: canary.title,
      description: canary.description,
      alternates: { canonical: url },
      openGraph: { title: canary.title, description: canary.description, url },
    };
  }

  // Route-specific title formula — U1/U2/U3 per CTR brief
  let title: string;
  if (hasPfas && hasViolations) {
    title = `${displayName} Water Quality Report, PFAS & Violations (${stateAbbr})`;
  } else if (hasPfas) {
    title = `${displayName} PFAS Records & Water Quality Report (${stateAbbr})`;
  } else if (hasViolations) {
    title = `${displayName} Water Quality Report & Violations (${stateAbbr})`;
  } else {
    title = `${displayName} Water Quality Report (${stateAbbr}) | Official EPA Data`;
  }
  const description = `Official drinking water data for ${displayName} in ${stateName}. Check PFAS records, violations, contaminant details, testing links, PWSID, and source reports.`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

const riskTextColors: Record<string, string> = {
  safe: "text-wur-safe",
  low: "text-emerald-600",
  moderate: "text-wur-caution",
  high: "text-wur-warning",
  critical: "text-wur-danger",
};

export default async function UtilityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const canary = CANARY_OVERRIDES[slug];

  const utility = await prisma.utility.findUnique({
    where: { slug },
    include: {
      state: { select: { name: true, slug: true, abbreviation: true } },
      violations: {
        // Open violations first, then most recent date within each group
        orderBy: [
          { resolution_date: { sort: "asc", nulls: "first" } },
          { violation_date: "desc" },
        ],
        take: 25,
      },
      _count: { select: { violations: true } },
      utility_contaminants: {
        include: { contaminant: true },
        orderBy: { confidence_score: "desc" },
      },
    },
  });

  if (!utility) notFound();
  if (utility.publish_status !== "published") notFound();

  const contaminantNamesForSimilar = utility.violations
    .filter(v => v.is_health_based && !!v.contaminant_name)
    .map(v => v.contaminant_name as string)
    .slice(0, 3);

  const [nearbyUtilities, pfasRecordCount, similarViolationUtilities] = await Promise.all([
    prisma.utility.findMany({
      where: {
        publish_status: "published",
        state_id: utility.state_id,
        slug: { not: utility.slug },
      },
      select: { slug: true, name: true, risk_level: true, population_served: true },
      orderBy: { population_served: "desc" },
      take: 4,
    }),
    prisma.pfasRecord.count({
      where: { pwsid: utility.pwsid, suppressed: false, validated: true },
    }),
    contaminantNamesForSimilar.length > 0
      ? prisma.utility.findMany({
          where: {
            publish_status: "published",
            state_id: utility.state_id,
            slug: { not: utility.slug },
            violations: {
              some: {
                is_health_based: true,
                contaminant_name: {
                  in: contaminantNamesForSimilar,
                  mode: "insensitive",
                },
              },
            },
          },
          select: {
            slug: true, name: true, risk_level: true, population_served: true,
            city_served: true,
          },
          orderBy: { population_served: "desc" },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  const displayName = normalizeName(utility.name);

  const openViolations = utility.violations.filter(
    (v) => !v.resolution_date && v.is_health_based
  ).length;

  // Group violations for display
  const namedOrHealthViolations = utility.violations.filter(
    (v) => v.is_health_based || v.contaminant_name
  );
  const namelessAdminCount = utility.violations.filter(
    (v) => !v.is_health_based && !v.contaminant_name
  ).length;

  // Historical note: all visible health violations are resolved but risk rating is still elevated
  const healthViolations = utility.violations.filter((v) => v.is_health_based);
  const allHealthResolved =
    healthViolations.length > 0 &&
    healthViolations.every((v) => v.resolution_date != null);
  const showHistoricalNote = allHealthResolved && ["high", "critical"].includes(utility.risk_level);

  // Build plain-language risk summary from open health violations
  const openHealthViolations = utility.violations.filter(
    (v) => v.is_health_based && !v.resolution_date
  );
  // Collect unique open contaminant names (using code lookup as fallback)
  const openContaminantNames = Array.from(
    new Set(
      openHealthViolations
        .map((v) => {
          if (v.contaminant_name) return v.contaminant_name;
          if (v.contaminant_code) return CONTAMINANT_CODE_NAMES[v.contaminant_code] ?? null;
          return null;
        })
        .filter((n): n is string => n !== null)
    )
  );

  // Derive treatment recommendations — health-based violations only
  // Admin/monitoring failures do NOT indicate a contaminant was detected
  const recommendedTreatmentSlugs = new Set<string>();
  const detectedContaminantSlugs = new Set<string>();

  for (const v of utility.violations) {
    if (!v.is_health_based) continue; // Skip monitoring/reporting failures — not actual detections
    const name = v.contaminant_name?.toLowerCase()
      ?? (v.contaminant_code ? CONTAMINANT_CODE_NAMES[v.contaminant_code]?.toLowerCase() : null);
    if (!name) continue;
    const contSlug = VIOLATION_TO_CONTAMINANT_SLUG[name];
    if (contSlug) {
      detectedContaminantSlugs.add(contSlug);
      (CONTAMINANT_TO_TREATMENTS[contSlug] ?? []).forEach((t) => recommendedTreatmentSlugs.add(t));
    }
    const direct = DIRECT_TO_TREATMENTS[name];
    if (direct) direct.forEach((t) => recommendedTreatmentSlugs.add(t));
  }

  // Fallback by risk level if no specific contaminant matches
  if (recommendedTreatmentSlugs.size === 0) {
    if (["high", "critical"].includes(utility.risk_level)) {
      recommendedTreatmentSlugs.add("reverse-osmosis");
      recommendedTreatmentSlugs.add("activated-carbon");
    } else if (utility.risk_level === "moderate") {
      recommendedTreatmentSlugs.add("activated-carbon");
    }
  }

  const recommendedTreatments = treatmentMethods.filter((t) =>
    recommendedTreatmentSlugs.has(t.slug)
  );

  const hasPfas = utility.violations.some(
    (v) => v.contaminant_name?.toLowerCase().includes("pfas") ||
            v.contaminant_name?.toLowerCase().includes("pfoa") ||
            v.contaminant_name?.toLowerCase().includes("pfos")
  );

  type RelatedPage = { href: string; label: string; type: "state" | "contaminant" | "treatment"; description: string };
  const relatedPages: RelatedPage[] = [
    {
      href: `/states/${utility.state.slug}`,
      label: `${utility.state.name} State Overview`,
      type: "state",
      description: `All utilities in ${utility.state.abbreviation}`,
    },
    // Contaminant national hub + state page where available
    ...Array.from(detectedContaminantSlugs).flatMap((cSlug) => {
      const c = contaminantContent.find((x) => x.slug === cSlug);
      if (!c) return [];
      const pages: RelatedPage[] = [{ href: `/contaminants/${cSlug}`, label: c.name, type: "contaminant", description: "Found in violation history" }];
      const stateSlug = utility.state.slug;
      if (cSlug === "lead" && LEAD_STATE_SLUGS.includes(stateSlug))
        pages.push({ href: `/contaminants/lead/${stateSlug}`, label: `Lead in ${utility.state.name}`, type: "contaminant", description: "State-specific lead guide" });
      if (cSlug === "nitrate" && NITRATE_STATE_SLUGS.includes(stateSlug))
        pages.push({ href: `/contaminants/nitrate/${stateSlug}`, label: `Nitrate in ${utility.state.name}`, type: "contaminant", description: "State-specific nitrate guide" });
      return pages;
    }),
    // City page if city_served is set
    ...(utility.city_served ? (() => {
      const cleanCity = utility.city_served
        .split(",")[0]                    // first city if comma-separated
        .replace(/\s+\d{3,4}\b/g, "")    // strip NJ municipality codes like " 1105"
        .trim();
      const citySlug = cleanCity.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const stateAbbr = utility.state.abbreviation.toLowerCase();
      if (!citySlug || !stateAbbr) return [];
      return [{
        href: `/cities/${citySlug}-${stateAbbr}`,
        label: `${cleanCity} Water Quality`,
        type: "state" as const,
        description: "City-level water overview",
      }];
    })() : []),
    // PFAS watchlist — direct utility PFAS page if records exist, state page otherwise
    ...(pfasRecordCount > 0 ? [{
      href: `/pfas-watchlist/utility/${utility.pwsid}`,
      label: `${displayName} PFAS Records`,
      type: "contaminant" as const,
      description: "Official EPA UCMR 5 monitoring data",
    }] : hasPfas ? [{
      href: `/pfas-watchlist/${utility.state.slug}`,
      label: `${utility.state.name} PFAS Watchlist`,
      type: "contaminant" as const,
      description: "PFAS records for this state",
    }] : []),
  ];

  // Derive city slug/name for ExploreSystem (same logic as relatedPages city derivation)
  const exploreCityRaw = utility.city_served
    ? utility.city_served.split(",")[0].replace(/\s+\d{3,4}\b/g, "").replace(/-\d{3,4}$/, "").trim()
    : undefined;
  const exploreCitySlug = exploreCityRaw
    ? exploreCityRaw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
    : undefined;

  const utilityWaterQuestions: WaterQuestion[] = [
    pfasRecordCount > 0
      ? {
          question: `Does ${displayName} have PFAS monitoring records?`,
          href: `/utilities/${utility.slug}/records`,
          description: `${pfasRecordCount} official EPA UCMR 5 PFAS sampling record${pfasRecordCount !== 1 ? "s" : ""} on file`,
          eventName: "related_question_click",
          eventParams: { question: "pfas_records", utility: utility.slug },
        }
      : {
          question: `Is there PFAS data for ${utility.state.name} water systems?`,
          href: `/pfas-watchlist/${utility.state.slug}`,
          description: `Official EPA UCMR 5 PFAS monitoring records for ${utility.state.name} water systems`,
          eventName: "related_question_click",
          eventParams: { question: "pfas_state", state: utility.state.slug },
        },
    {
      question: `Are there EPA violations on record for ${displayName}?`,
      href: healthViolations.length > 0 || pfasRecordCount > 0
        ? `/utilities/${utility.slug}/records`
        : `/utilities/${utility.slug}`,
      description: healthViolations.length > 0
        ? `${healthViolations.length} health-based violation${healthViolations.length !== 1 ? "s" : ""} recorded in EPA SDWIS`
        : "No health-based violations recorded in EPA SDWIS",
      eventName: "related_question_click",
      eventParams: { question: "violations", utility: utility.slug },
    },
    {
      question: `How do I get my water tested in ${utility.state.name}?`,
      href: `/labs?state=${utility.state.slug}`,
      description: "State-certified labs for PFAS, lead, nitrate, and bacteria testing",
      eventName: "related_question_click",
      eventParams: { question: "testing", state: utility.state.slug },
    },
    {
      question: `What water treatment options address these contaminants?`,
      href: `/treatment`,
      description: "Reverse osmosis, activated carbon, and whole-home filtration guides with NSF certification data",
      eventName: "related_question_click",
      eventParams: { question: "treatment", utility: utility.slug },
    },
    ...(exploreCityRaw && exploreCitySlug
      ? [{
          question: `Which other utilities serve ${exploreCityRaw}?`,
          href: `/cities/${exploreCitySlug}-${utility.state.abbreviation.toLowerCase()}`,
          description: `All EPA-tracked water systems serving ${exploreCityRaw}, ${utility.state.abbreviation}`,
          eventName: "related_question_click",
          eventParams: { question: "city_utilities", city: exploreCitySlug },
        }]
      : []),
    {
      question: `Where can I find official sampling records for this system?`,
      href: `/utilities/${utility.slug}/records`,
      description: "Official EPA SDWIS violations and UCMR 5 PFAS sampling records with source links",
      eventName: "related_question_click",
      eventParams: { question: "official_records", utility: utility.slug },
    },
  ];

  const sources = [
    {
      label: "EPA ECHO — Water System & Compliance Report",
      note: `PWSID ${utility.pwsid}`,
      url: `https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`,
    },
    {
      label: "EPA CCR — Consumer Confidence Reports",
      url: `https://www.epa.gov/ccr`,
    },
  ];

  if (utility.ccr_url) {
    sources.push({
      label: `${displayName} Consumer Confidence Report${utility.ccr_year ? ` (${utility.ccr_year})` : ""}`,
      url: utility.ccr_url,
    });
  }

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: displayName,
    areaServed: utility.state.name,
    url: utility.website ?? utility.ccr_url ?? undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: utility.state.name, item: `https://waterutilityreport.com/states/${utility.state.slug}` },
      { "@type": "ListItem", position: 3, name: displayName, item: `https://waterutilityreport.com/utilities/${slug}` },
    ],
  };

  const measuredVars = utility.utility_contaminants.map((uc) => uc.contaminant.name);

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${displayName} Drinking Water Quality Data`,
    description: `Public drinking water compliance records for ${displayName} (${utility.state.abbreviation}), including violation history, contaminant test results, and service area data sourced from EPA SDWIS and Consumer Confidence Reports.`,
    url: `https://waterutilityreport.com/utilities/${slug}`,
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
    spatialCoverage: { "@type": "Place", name: utility.state.name },
    ...(measuredVars.length > 0 ? { variableMeasured: measuredVars } : {}),
  };

  const utilityFaqs = [
    {
      question: `Is ${displayName} water safe to drink?`,
      answer: openViolations > 0
        ? `${displayName} currently has ${openViolations} open health-based violation${openViolations > 1 ? "s" : ""} recorded in EPA's federal database${openContaminantNames.length > 0 ? `, involving ${openContaminantNames.join(", ")}` : ""}. A health-based violation means a contaminant exceeded EPA's legal limit and the violation has not been formally resolved. Residents with concerns should review the full violation history and consider certified point-of-use filtration${recommendedTreatments.length > 0 ? ` — specifically ${recommendedTreatments.map(t => t.shortName).join(" or ")}` : ""}.`
        : `${displayName} has no open health-based violations currently recorded in EPA's federal database. No active exceedances of legal contaminant limits are on record. Review the Consumer Confidence Report for annual test results and detected levels.`,
    },
    {
      question: `Does ${displayName} have PFAS contamination?`,
      answer: pfasRecordCount > 0
        ? `${displayName} (PWSID: ${utility.pwsid}) has ${pfasRecordCount} PFAS monitoring record${pfasRecordCount !== 1 ? "s" : ""} in EPA's UCMR 5 dataset (2023–2025). UCMR 5 data represents monitoring under the unregulated contaminant monitoring rule — detection is not a violation determination but indicates PFAS was measured. View the full PFAS record on the PFAS Watchlist page for this utility.`
        : hasPfas
        ? `${displayName} has at least one PFAS-related violation on record in EPA's SDWIS compliance database. Review the violation history on this page and the ${utility.state.name} PFAS Watchlist for context.`
        : `No PFAS records for ${displayName} have been located in the current EPA UCMR 5 dataset. This does not confirm absence of PFAS — utilities below the minimum size threshold may not have been required to test. Confirm with your utility's Consumer Confidence Report.`,
    },
    {
      question: `What contaminants has ${displayName} violated limits for?`,
      answer: detectedContaminantSlugs.size > 0
        ? `${displayName} has health-based violations on record for: ${Array.from(detectedContaminantSlugs).join(", ")}. Health-based violations mean the EPA's legal limit (MCL) was exceeded. See the violation history on this page for dates, resolution status, and EPA source links.`
        : utility.violations.length > 0
        ? `${displayName} has ${utility.violations.length} violation record${utility.violations.length !== 1 ? "s" : ""} on file, primarily monitoring and reporting failures rather than exceedances of contaminant limits. Monitoring failures mean required test submissions were not filed — not necessarily that the water is unsafe.`
        : `No violations of any kind are currently on record for ${displayName} in EPA's SDWIS database.`,
    },
    {
      question: `What water filter is recommended for ${displayName}?`,
      answer: recommendedTreatments.length > 0
        ? `Based on ${displayName}'s violation history and risk profile, the most relevant filtration options are: ${recommendedTreatments.map(t => `${t.shortName} (${t.solves.slice(0, 2).join(", ")})`).join("; ")}. Any filter used should be NSF/ANSI certified for the specific contaminants of concern. Replace filters on the manufacturer's schedule — an overdue filter may not perform as certified.`
        : `${displayName} has no current open health violations. For general water quality improvement, an NSF/ANSI 42-certified activated carbon filter removes chlorine, taste, and odor. For broader protection, a certified reverse osmosis system reduces the widest range of contaminants.`,
    },
    {
      question: `Where can I find the official water quality report (Consumer Confidence Report) for ${displayName}?`,
      answer: utility.ccr_url
        ? `${displayName} publishes its Consumer Confidence Report (CCR) at ${utility.ccr_url}${utility.ccr_year ? ` (${utility.ccr_year} report year)` : ""}. The CCR is required annually under the federal Safe Drinking Water Act and discloses all tested contaminants, detected levels, and violations during the reporting period. You can also view official compliance records on EPA ECHO using PWSID ${utility.pwsid}.`
        : `${displayName} (PWSID: ${utility.pwsid}) is required to publish an annual Consumer Confidence Report (CCR) under the federal Safe Drinking Water Act. View official compliance records on EPA ECHO: https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}. Contact the utility directly to request a printed copy of the most recent CCR.`,
    },
    {
      question: `How can I independently test my water from ${displayName}?`,
      answer: `You can test your tap water independently of ${displayName}'s compliance monitoring. Use a state-certified laboratory — the EPA maintains a national directory of certified labs searchable by state and contaminant type at epa.gov/dwlabcert. For PFAS, confirm the lab holds EPA Method 533 or 537.1 certification. For lead, use a lab certified by ${utility.state.name}'s drinking water program. Find certified labs in ${utility.state.name} at waterutilityreport.com/labs.`,
    },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: utilityFaqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={orgJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={datasetJsonLd} />
      <JsonLd data={faqJsonLd} />

      {/* Hero */}
      <div className="bg-wur-ink text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/states/${utility.state.slug}`} className="hover:text-white/70 transition-colors">
              {utility.state.name}
            </Link>
            <span>/</span>
            <span className="text-white/60 truncate">{displayName}</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <Badge variant="ink" className="text-[10px] font-mono">{utility.pwsid}</Badge>
                <Badge variant="ink" className="text-[10px]">{utility.state.abbreviation}</Badge>
                {openViolations === 0 ? (
                  <Badge variant="safe" className="text-[10px]">No open health violations</Badge>
                ) : (
                  <Badge variant="high" className="text-[10px]">{openViolations} open health violation(s)</Badge>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white mb-2 leading-tight">
                {displayName}
              </h1>
              <p className="text-white/50 text-sm">
                {utility.service_type ?? "Community Water System"} · {utility.ownership_type ?? "Public"}
                {utility.address && ` · ${utility.address}`}
              </p>
            </div>

            {utility.ccr_url && (
              <a
                href={utility.ccr_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-white/70 border border-white/20 rounded-md px-4 py-2 hover:bg-white/10 transition-colors shrink-0"
              >
                <FileText className="w-4 h-4" />
                View CCR {utility.ccr_year ?? ""}
                <ExternalLink className="w-3 h-3 opacity-50" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Jump nav — in-page orientation */}
      <div className="border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <JumpNav items={[
            { label: "About", href: "#about" },
            { label: "Violations", href: "#violations" },
            { label: "Contaminants", href: "#contaminants" },
            ...(pfasRecordCount > 0 ? [{ label: "PFAS records", href: "#pfas-records" }] : []),
            ...(recommendedTreatments.length > 0 ? [{ label: "Treatment", href: "#treatment" }] : []),
            { label: "FAQ", href: "#faq" },
            { label: "Sources", href: "#sources" },
          ]} />
        </div>
      </div>

      {/* Quick-action strip — crawlable links, visible on scroll */}
      <div className="border-b border-border bg-muted/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground shrink-0 mr-1">
              Check also:
            </span>
            <Link
              href={`/utilities/${utility.slug}/records`}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-wur-teal/30 bg-wur-teal/5 text-wur-teal hover:bg-wur-teal/10 transition-colors font-medium"
            >
              Official records
            </Link>
            {pfasRecordCount > 0 && (
              <Link
                href={`/pfas-watchlist/utility/${utility.pwsid}`}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors font-medium"
              >
                PFAS data ({pfasRecordCount})
              </Link>
            )}
            <Link
              href={`/labs?state=${utility.state.slug}`}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/40 hover:text-wur-teal transition-colors"
            >
              Testing labs in {utility.state.abbreviation}
            </Link>
            <Link
              href="/treatment"
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/40 hover:text-wur-teal transition-colors"
            >
              Treatment options
            </Link>
            <Link
              href={`/states/${utility.state.slug}`}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/40 hover:text-wur-teal transition-colors"
            >
              {utility.state.name} water hub
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* ── ORIENTATION (PageIntroBox) ── */}
            <PageIntroBox
              summary={`This page shows official EPA compliance records for ${displayName}, including PFAS monitoring data, violation history, contaminant test results, treatment options, and certified testing lab links for ${utility.state.name}.`}
              dataItems={[
                { label: "PFAS monitoring records (UCMR 5)", available: pfasRecordCount > 0 },
                { label: "Health-based violations", available: utility.violations.some(v => v.is_health_based) },
                { label: "Contaminant test data (CCR)", available: utility.utility_contaminants.length > 0 },
                { label: "Treatment recommendations", available: recommendedTreatments.length > 0 },
              ]}
            />

            {/* ── CANARY: source-backed answer module (only for eligible zero-click pages) ── */}
            {canary && <CanaryAnswerModule override={canary} />}

              {/* ── ABOUT THIS SYSTEM (AEO anchor) ── */}
            <section id="about">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {displayName} is a {utility.service_type?.toLowerCase() ?? "community water"} system
                serving {utility.population_served.toLocaleString()} residents
                {utility.city_served ? ` in ${utility.city_served}, ${utility.state.name}` : ` in ${utility.state.name}`}
                {" "}(PWSID: {utility.pwsid}).
                {openViolations > 0
                  ? ` The system currently has ${openViolations} open health-based violation${openViolations !== 1 ? "s" : ""} recorded in the EPA federal database${openContaminantNames.length > 0 ? `, involving ${openContaminantNames.join(", ")}` : ""}.`
                  : " No open health-based violations are recorded in the EPA federal database for this system."}
                {pfasRecordCount > 0
                  ? ` EPA UCMR 5 monitoring returned ${pfasRecordCount} PFAS record${pfasRecordCount !== 1 ? "s" : ""} for this utility.`
                  : ""}
              </p>
            </section>

            {/* ── AT A GLANCE ── */}
            <section className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">At a Glance</p>
                <span className="text-[10px] font-mono text-muted-foreground/60">{utility.pwsid}</span>
              </div>
              <div className="p-5">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Risk level</span>
                    <span className={`text-sm font-semibold capitalize ${riskTextColors[utility.risk_level]}`}>{utility.risk_level}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Open violations</span>
                    <span className={`text-sm font-semibold ${openViolations > 0 ? "text-wur-warning" : "text-wur-safe"}`}>
                      {openViolations === 0 ? "None on record" : `${openViolations} health-based`}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">PFAS records</span>
                    <span className={`text-sm font-semibold ${pfasRecordCount > 0 ? "text-wur-warning" : "text-muted-foreground"}`}>
                      {pfasRecordCount > 0 ? `${pfasRecordCount} UCMR 5 records` : "None in dataset"}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Population served</span>
                    <span className="text-sm font-semibold text-foreground">{utility.population_served.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Source water</span>
                    <span className="text-sm font-semibold text-foreground">{utility.service_type ?? "Not specified"}</span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Data source</span>
                    <a
                      href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-wur-teal hover:underline"
                    >
                      EPA ECHO ↗
                    </a>
                  </div>
                </div>
                {/* Quick Actions */}
                <div className="border-t border-border pt-4">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-2.5">Quick actions</p>
                  <div className="flex flex-wrap gap-2">
                    <a href="#contaminants" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all">
                      Check contaminants ↓
                    </a>
                    <a href="#violations" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all">
                      Violation history ↓
                    </a>
                    {(utility.violations.some(v => v.is_health_based) || pfasRecordCount > 0) && (
                      <Link href={`/utilities/${utility.slug}/records`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all font-medium">
                        Official records →
                      </Link>
                    )}
                    {pfasRecordCount > 0 && (
                      <Link href={`/pfas-watchlist/utility/${utility.pwsid}`} className="text-xs px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400 transition-all">
                        View PFAS records →
                      </Link>
                    )}
                    {recommendedTreatments.length > 0 && (
                      <Link href={`/treatment/${recommendedTreatments[0].slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all">
                        Treatment options →
                      </Link>
                    )}
                    <Link href={`/compare/utilities/${utility.slug}/${nearbyUtilities[0]?.slug ?? "chicago"}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all">
                      Compare utilities →
                    </Link>
                    <a
                      href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all"
                    >
                      Official EPA source ↗
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* Intelligence Summary — AI retrieval anchor */}
            <section className="rounded-xl border border-border bg-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Intelligence Summary · {displayName}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                {[
                  {
                    label: "Risk Level",
                    value: utility.risk_level.charAt(0).toUpperCase() + utility.risk_level.slice(1),
                    color: riskTextColors[utility.risk_level],
                  },
                  {
                    label: "Open Health Violations",
                    value: openViolations === 0 ? "None on record" : `${openViolations} active (${openContaminantNames.join(", ") || "contaminant unspecified"})`,
                    color: openViolations > 0 ? "text-wur-warning" : "text-wur-safe",
                  },
                  {
                    label: "PFAS Records",
                    value: pfasRecordCount > 0 ? `${pfasRecordCount} UCMR5 monitoring record${pfasRecordCount !== 1 ? "s" : ""} on file` : hasPfas ? "Violation on record" : "No records in current dataset",
                    color: (pfasRecordCount > 0 || hasPfas) ? "text-wur-warning" : "text-muted-foreground",
                  },
                  {
                    label: "Population Served",
                    value: utility.population_served.toLocaleString() + " residents",
                    color: "",
                  },
                  {
                    label: "Source Water",
                    value: utility.service_type ?? "Not specified",
                    color: "",
                  },
                  {
                    label: "Ownership",
                    value: utility.ownership_type ?? "Not specified",
                    color: "",
                  },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex items-baseline justify-between gap-3 py-1.5 border-b border-border/50 last:border-0">
                    <span className="text-xs text-muted-foreground shrink-0">{label}</span>
                    <span className={`text-xs font-semibold text-right ${color || "text-foreground"}`}>{value}</span>
                  </div>
                ))}
              </div>
              {recommendedTreatments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/50">
                  <span className="text-xs text-muted-foreground">Recommended filtration: </span>
                  {recommendedTreatments.map((t, i) => (
                    <span key={t.slug}>
                      <Link href={`/treatment/${t.slug}`} className="text-xs text-wur-teal hover:underline">{t.shortName}</Link>
                      {i < recommendedTreatments.length - 1 && <span className="text-muted-foreground text-xs"> · </span>}
                    </span>
                  ))}
                </div>
              )}
            </section>

            {/* Risk meter */}
            <section className="rounded-xl border border-border bg-card p-6">
              <RiskMeter level={utility.risk_level as "safe" | "low" | "moderate" | "high" | "critical"} />
              {/* Plain-language explanation of why this risk level was assigned */}
              {openHealthViolations.length > 0 && (
                <div className="mt-4 rounded-lg border border-wur-warning/30 bg-wur-warning/5 p-4">
                  <p className="text-sm font-semibold text-foreground mb-1">
                    Why {utility.risk_level}?
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    This utility has <strong className="text-wur-warning">{openHealthViolations.length} open health-based violation{openHealthViolations.length > 1 ? "s" : ""}</strong> recorded by the EPA
                    {openContaminantNames.length > 0 && (
                      <> involving <strong className="text-foreground">{openContaminantNames.join(", ")}</strong></>
                    )}.
                    {" "}These are cases where a contaminant exceeded the EPA's legal limit and has not yet been formally resolved in the federal database.
                    {" "}Contact the utility directly or review their latest Consumer Confidence Report for current status.
                  </p>
                </div>
              )}
              {utility.risk_level === "safe" && openViolations === 0 && (
                <div className="mt-4 rounded-lg border border-wur-safe-border bg-wur-safe-bg p-4">
                  <p className="text-sm text-wur-safe leading-relaxed">
                    <strong>No open health violations</strong> on record. This utility has no active EPA violations involving contaminants exceeding legal limits. Always verify with your utility's Consumer Confidence Report for annual test results.
                  </p>
                </div>
              )}
              {showHistoricalNote && (
                <div className="mt-4 flex items-start gap-2 bg-muted/30 rounded-lg p-3 border border-border">
                  <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">All health-based violations are resolved.</strong>{" "}
                    This rating reflects historical violations that have since been corrected by the utility.
                    Current water quality may differ — check the{" "}
                    <a
                      href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wur-teal hover:underline"
                    >
                      EPA ECHO report
                    </a>{" "}
                    for the latest test results.
                  </p>
                </div>
              )}
            </section>

            {/* Key facts */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">Utility Overview</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: "Population Served", value: utility.population_served.toLocaleString(), mono: true },
                  { icon: Droplets, label: "Source Type", value: utility.service_type ?? "Unknown", mono: false },
                  { icon: Building2, label: "Ownership", value: utility.ownership_type ?? "Unknown", mono: false },
                  { icon: FileText, label: "PWSID", value: utility.pwsid, mono: true },
                ].map((fact, i) => {
                  const Icon = fact.icon;
                  return (
                    <div key={i} className="rounded-lg border border-border bg-card p-4">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground mb-1">{fact.label}</p>
                      <p className={`text-sm font-medium text-foreground leading-tight ${fact.mono ? "font-mono" : ""}`}>
                        {fact.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Contaminant data */}
            <section id="contaminants">
              <h2 className="font-display text-2xl text-foreground mb-2">Detected Contaminants</h2>
              {utility.utility_contaminants.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-5">
                    Results from the most recent Consumer Confidence Report.
                  </p>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contaminant</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Level</th>
                          <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {utility.utility_contaminants.map((uc, i) => (
                          <tr key={i} className="hover:bg-muted/30 transition-colors">
                            <td className="py-3.5 px-4">
                              <Link href={`/contaminants/${uc.contaminant.slug}`} className="font-medium text-foreground hover:text-primary transition-colors">
                                {uc.contaminant.name}
                              </Link>
                            </td>
                            <td className="py-3.5 px-4 hidden sm:table-cell">
                              {uc.detected && uc.level != null ? (
                                <span className="font-mono text-sm font-medium">
                                  {uc.level} <span className="text-muted-foreground font-normal">{uc.unit}</span>
                                </span>
                              ) : (
                                <span className="font-mono text-sm text-muted-foreground">Not detected</span>
                              )}
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize
                                ${uc.status === "safe" ? "text-wur-safe bg-wur-safe-bg" :
                                  uc.status === "low" ? "text-emerald-700 bg-emerald-50" :
                                  uc.status === "moderate" ? "text-wur-caution bg-wur-caution-bg" :
                                  "text-wur-danger bg-wur-danger-bg"}`}>
                                {uc.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="rounded-xl border border-border bg-muted/20 p-6 flex items-start gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">CCR data ingestion in progress</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Contaminant detection levels from Consumer Confidence Reports are being parsed and linked to utilities.
                      Check back soon, or view the official report directly from the EPA links below.
                    </p>
                    <a
                      href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm text-wur-teal hover:underline"
                    >
                      View on EPA ECHO <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* Violations */}
            {utility.violations.length > 0 && (
              <section id="violations">
                <div className="flex items-baseline justify-between gap-3 mb-2">
                  <h2 className="font-display text-2xl text-foreground">Violation History</h2>
                  {utility._count.violations > utility.violations.length && (
                    <a
                      href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-wur-teal transition-colors shrink-0"
                    >
                      Showing {utility.violations.length} of {utility._count.violations} — view all on EPA ECHO ↗
                    </a>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-5">
                  Sourced from EPA SDWIS. <span className="text-wur-warning font-medium">Health-based</span> violations mean a contaminant exceeded the legal limit. <span className="font-medium text-foreground">Monitoring/Reporting</span> violations mean required test results were not submitted to EPA — not necessarily that the water is unsafe.
                </p>
                <div className="space-y-2">
                  {namedOrHealthViolations.map((v, i) => {
                    const fmt = (d: Date) =>
                      d.toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });
                    const startLabel = v.violation_date ? fmt(new Date(v.violation_date)) : null;
                    const resolvedLabel = v.resolution_date ? fmt(new Date(v.resolution_date)) : null;
                    const dateLabel = startLabel
                      ? resolvedLabel && resolvedLabel !== startLabel
                        ? `${startLabel} – ${resolvedLabel}`
                        : startLabel
                      : resolvedLabel ?? null;

                    // Use code lookup as fallback when contaminant_name is missing
                    const resolvedContaminantName = v.contaminant_name
                      ?? (v.contaminant_code ? CONTAMINANT_CODE_NAMES[v.contaminant_code] ?? null : null);
                    const contaminantSlug = resolvedContaminantName
                      ? VIOLATION_TO_CONTAMINANT_SLUG[resolvedContaminantName.toLowerCase()] ?? null
                      : null;

                    return (
                      <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                        {v.is_health_based ? (
                          <AlertTriangle className="w-4 h-4 text-wur-warning mt-0.5 shrink-0" />
                        ) : (
                          <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <p className="text-sm font-medium text-foreground">
                              {displayViolationType(v.violation_type)}
                              {resolvedContaminantName && (
                                contaminantSlug ? (
                                  <Link
                                    href={`/contaminants/${contaminantSlug}`}
                                    className="text-wur-teal font-normal hover:underline"
                                  > — {resolvedContaminantName}</Link>
                                ) : (
                                  <span className="text-muted-foreground font-normal"> — {resolvedContaminantName}</span>
                                )
                              )}
                            </p>
                            {v.resolution_date ? (
                              <span className="text-xs font-medium text-wur-safe bg-wur-safe-bg border border-wur-safe-border px-2 py-0.5 rounded-full shrink-0">
                                Resolved
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-wur-caution bg-wur-caution-bg border border-wur-caution-border px-2 py-0.5 rounded-full shrink-0">
                                Open
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-muted-foreground">
                            {dateLabel && <span className="font-mono">{dateLabel}</span>}
                            {v.is_health_based ? (
                              <span className="text-wur-warning font-medium">Health-based</span>
                            ) : (
                              <span className="text-muted-foreground">Monitoring/Reporting failure</span>
                            )}
                            {v.contaminant_code && !v.contaminant_name && !CONTAMINANT_CODE_NAMES[v.contaminant_code] && (
                              <span className="font-mono text-xs">Code {v.contaminant_code}</span>
                            )}
                          </div>
                          {v.description && (
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-2">
                              {v.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {namelessAdminCount > 0 && (
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/20">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {namelessAdminCount} additional monitoring/reporting {namelessAdminCount === 1 ? "failure" : "failures"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Required test submissions not filed with EPA — no contaminant data recorded. These are administrative failures, not health violations.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* PFAS Monitoring Records */}
            {pfasRecordCount > 0 && (
              <section id="pfas-records" className="rounded-xl border border-amber-200 bg-amber-50/40 p-6">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-sm font-semibold uppercase tracking-widest text-amber-700">PFAS Monitoring</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 font-semibold">EPA UCMR 5</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  EPA UCMR 5 monitoring (2023–2025) returned <strong className="text-amber-700">{pfasRecordCount} PFAS record{pfasRecordCount !== 1 ? "s" : ""}</strong> for {displayName}. Detection is not a regulatory violation, but indicates PFAS compounds were measured during the unregulated contaminant monitoring cycle. Review the full records and compare detected levels against current EPA MCLs.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/pfas-watchlist/utility/${utility.pwsid}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-amber-300 bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors font-medium"
                  >
                    View {pfasRecordCount} PFAS record{pfasRecordCount !== 1 ? "s" : ""} →
                  </Link>
                  <Link
                    href="/treatment/reverse-osmosis"
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
                  >
                    PFAS treatment guide
                  </Link>
                  <Link
                    href={`/labs?state=${utility.state.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
                  >
                    Find a certified PFAS lab
                  </Link>
                </div>
              </section>
            )}

            {/* Water Record Interpreter — canary only */}
            {canary?.showInterpreter && (
              <WaterRecordInterpreter
                utilitySlug={utility.slug}
                pwsid={utility.pwsid}
                state={utility.state.abbreviation}
                stateSlug={utility.state.slug}
                utilityName={displayName}
                hasPfasRecords={pfasRecordCount > 0}
                hasUcmr5Records={pfasRecordCount > 0}
                hasHealthBasedViolations={healthViolations.length > 0}
                hasMonitoringViolations={utility.violations.some((v) => !v.is_health_based)}
                hasCcrUrl={!!utility.ccr_url}
              />
            )}

            {/* Treatment Recommendations */}
            {recommendedTreatments.length > 0 && !(showHistoricalNote && detectedContaminantSlugs.size === 0) && (
              <section id="treatment">
                <h2 className="font-display text-2xl text-foreground mb-2">Filtration Recommendations</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Based on {detectedContaminantSlugs.size > 0 ? "contaminants found in health-based violations" : "the overall risk level"}, these treatment methods are most relevant for residents.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recommendedTreatments.map((method) => (
                    <Link
                      key={method.slug}
                      href={`/treatment/${method.slug}`}
                      className="group flex flex-col p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <Wrench className="w-4 h-4 text-wur-teal mb-2" />
                      <h3 className="font-medium text-foreground group-hover:text-wur-teal transition-colors mb-1">
                        {method.shortName}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-1">
                        {method.summary.split(".")[0]}.
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {method.solves.slice(0, 3).map((s, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {s.split("—")[0].split("(")[0].trim()}
                          </span>
                        ))}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {similarViolationUtilities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Utilities With Similar Violations in {utility.state.name}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Other {utility.state.name} water systems with health-based violations involving the same contaminants detected at {displayName}.
                </p>
                <div className="space-y-2">
                  {similarViolationUtilities.map((u) => (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="group flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:border-wur-teal/40 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate group-hover:text-wur-teal transition-colors">
                            {normalizeName(u.name)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {u.city_served ?? utility.state.name} · {u.population_served.toLocaleString()} served
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold capitalize px-2 py-0.5 rounded-full border shrink-0 ml-3 ${
                        u.risk_level === "safe" ? "text-wur-safe bg-wur-safe-bg border-wur-safe-border" :
                        u.risk_level === "low" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                        u.risk_level === "moderate" ? "text-wur-caution bg-wur-caution-bg border-wur-caution-border" :
                        u.risk_level === "high" ? "text-wur-warning bg-wur-warning-bg border-wur-warning-border" :
                        "text-wur-danger bg-wur-danger-bg border-wur-danger-border"
                      }`}>{u.risk_level}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* What should I do next? */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl text-foreground mb-1">What should I do next?</h2>
              {pfasRecordCount > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    PFAS monitoring records are on file for {displayName}. Review the detected compounds, compare them with current regulatory guidance, and check whether your home filter is certified for PFAS reduction.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link href={`/pfas-watchlist/utility/${utility.pwsid}`} className="text-xs px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors">
                      View PFAS records
                    </Link>
                    <Link href="/treatment/reverse-osmosis" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      PFAS treatment guide
                    </Link>
                    <Link href={`/labs?state=${utility.state.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      Find a certified PFAS lab
                    </Link>
                    {nearbyUtilities[0] && (
                      <Link href={`/utilities/${nearbyUtilities[0].slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                        Compare nearby utility
                      </Link>
                    )}
                    <a href={`https://echo.epa.gov/facilities/facility-search?p_act=Y&p_sic=4941&sys_id=${utility.pwsid}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      EPA source data ↗
                    </a>
                  </div>
                </>
              ) : openViolations > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    {displayName} has {openViolations} open health-based violation{openViolations !== 1 ? "s" : ""} in the EPA dataset. Review the full violation history, check available treatment options, and compare with nearby utilities.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href="#violations" className="text-xs px-3 py-1.5 rounded-full border border-red-300 bg-red-50 text-red-700 hover:bg-red-100 transition-colors">
                      Review violations
                    </a>
                    <Link href="/treatment" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      Browse treatment options
                    </Link>
                    <Link href={`/labs?state=${utility.state.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      Find a certified lab
                    </Link>
                    {nearbyUtilities[0] && (
                      <Link href={`/utilities/${nearbyUtilities[0].slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                        Compare nearby utility
                      </Link>
                    )}
                    <Link href={`/states/${utility.state.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      {utility.state.name} state report
                    </Link>
                  </div>
                </>
              ) : utility.violations.length === 0 ? (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    Some data may be incomplete or unavailable for {displayName}. Check the official EPA source and review nearby utilities for comparison before drawing conclusions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href={`https://echo.epa.gov/facilities/facility-search?p_act=Y&p_sic=4941&sys_id=${utility.pwsid}`} target="_blank" rel="noopener noreferrer" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      EPA source data ↗
                    </a>
                    <Link href={`/labs?state=${utility.state.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      Find a certified lab
                    </Link>
                    <Link href="/methodology" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      Our methodology
                    </Link>
                    <Link href={`/states/${utility.state.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      {utility.state.name} state report
                    </Link>
                    {nearbyUtilities[0] && (
                      <Link href={`/utilities/${nearbyUtilities[0].slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                        Compare nearby utility
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground mb-4">
                    No active health-based violations are currently shown in this dataset for {displayName}. Review the full contaminant profile and last verified date before drawing conclusions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <a href="#contaminants" className="text-xs px-3 py-1.5 rounded-full border border-wur-teal/40 bg-teal-50 text-wur-teal hover:bg-teal-100 transition-colors">
                      Full contaminant profile
                    </a>
                    <Link href={`/labs?state=${utility.state.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      Find a certified lab
                    </Link>
                    <Link href="/methodology" className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      Our methodology
                    </Link>
                    {nearbyUtilities[0] && (
                      <Link href={`/utilities/${nearbyUtilities[0].slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                        Compare nearby utility
                      </Link>
                    )}
                    <Link href={`/states/${utility.state.slug}`} className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors">
                      {utility.state.name} state report
                    </Link>
                  </div>
                </>
              )}
            </section>

            <section id="faq">
              <FaqSection faqs={utilityFaqs} title={`${displayName} — Water Quality FAQs`} />
            </section>

            <ExploreSystem
              utilitySlug={utility.slug}
              displayName={displayName}
              stateSlug={utility.state.slug}
              stateName={utility.state.name}
              stateAbbr={utility.state.abbreviation}
              citySlug={exploreCitySlug}
              cityName={exploreCityRaw}
              pwsid={utility.pwsid}
              pfasRecordCount={pfasRecordCount}
              hasHealthViolations={healthViolations.length > 0}
              nearbyUtilities={nearbyUtilities.slice(0, 2)}
            />
            <RelatedWaterQuestions
              questions={utilityWaterQuestions}
              title="Common Questions About This Water System"
            />
            {/* ── CANARY: email report CTA (bottom of main column) ── */}
            {canary?.conversionCanary && (
              <EmailReportCTA
                pwsid={utility.pwsid}
                utilitySlug={utility.slug}
                utilityName={displayName}
                state={utility.state.abbreviation}
                ctaLocation="main_bottom"
                hasPfasRecords={pfasRecordCount > 0}
                hasViolationRecords={utility.violations.length > 0}
              />
            )}

            <DataLimitationsNote />
            <RelatedPages pages={relatedPages} title="Related Pages" />
            <SourcesBlock
              sources={sources}
              lastUpdated={utility.last_verification_date?.toISOString().split("T")[0] ?? utility.ingestion_date?.toISOString().split("T")[0] ?? "2025"}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              {canary?.conversionCanary ? (
                <SaveUtilityCTA
                  pwsid={utility.pwsid}
                  utilitySlug={utility.slug}
                  utilityName={displayName}
                  state={utility.state.abbreviation}
                  ctaVariant={canary.ctaVariant}
                  ctaLocation="sidebar"
                  hasPfasRecords={pfasRecordCount > 0}
                  hasViolationRecords={utility.violations.length > 0}
                  formVersion="v1"
                />
              ) : (
                <ViolationAlertForm pwsid={utility.pwsid} utilityName={displayName} />
              )}

              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">At a Glance</p>
                <div className="space-y-3">
                  {[
                    { label: "PWSID", value: utility.pwsid, mono: true },
                    { label: "State", value: utility.state.name, mono: false },
                    { label: "Risk Level", value: utility.risk_level, mono: false, color: riskTextColors[utility.risk_level] },
                    { label: "Population Served", value: utility.population_served.toLocaleString(), mono: true },
                    { label: "Open Health Violations", value: String(openViolations), mono: true, color: openViolations > 0 ? "text-wur-danger" : "text-wur-safe" },
                  ].map(({ label, value, mono, color }) => (
                    <div key={label} className="flex items-start justify-between">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className={`text-xs font-semibold capitalize ${mono ? "font-mono" : ""} ${color ?? ""}`}>{value}</span>
                    </div>
                  ))}
                </div>

                {utility.ccr_url && (
                  <div className="mt-5 pt-4 border-t border-border">
                    <a
                      href={utility.ccr_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-wur-teal text-white text-sm font-medium hover:bg-wur-teal/90 transition-colors"
                    >
                      <FileText className="w-4 h-4" /> Download Official CCR
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                )}
              </div>

              <div className="rounded-lg border border-wur-caution-border bg-wur-caution-bg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-wur-caution mt-0.5 shrink-0" />
                  <p className="text-xs text-wur-caution leading-relaxed">
                    Service area match is <strong>likely but not guaranteed</strong>. Your water bill is the most reliable way to confirm your provider.
                  </p>
                </div>
              </div>

              {nearbyUtilities.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Nearby Utilities</p>
                  <div className="space-y-2">
                    {nearbyUtilities.map((u) => (
                      <Link key={u.slug} href={`/utilities/${u.slug}`} className="flex items-center justify-between py-1 group">
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors truncate pr-2">{normalizeName(u.name)}</span>
                        <span className={`text-[10px] font-semibold capitalize shrink-0 px-1.5 py-0.5 rounded-full border ${
                          u.risk_level === "safe" ? "text-wur-safe bg-wur-safe-bg border-wur-safe-border" :
                          u.risk_level === "low" ? "text-emerald-700 bg-emerald-50 border-emerald-200" :
                          u.risk_level === "moderate" ? "text-wur-caution bg-wur-caution-bg border-wur-caution-border" :
                          u.risk_level === "high" ? "text-wur-warning bg-wur-warning-bg border-wur-warning-border" :
                          "text-wur-danger bg-wur-danger-bg border-wur-danger-border"
                        }`}>{u.risk_level}</span>
                      </Link>
                    ))}
                    <Link href={`/states/${utility.state.slug}`} className="text-xs text-wur-teal hover:underline mt-1 block">
                      All {utility.state.name} utilities →
                    </Link>
                    <Link href={`/data/pfas/${utility.state.slug}`} className="text-xs text-wur-teal hover:underline mt-1 block">
                      See all PFAS data for {utility.state.name} →
                    </Link>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Data Sources</p>
                <div className="space-y-2">
                  <a href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-wur-teal hover:underline">
                    EPA ECHO Facility Report <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://www.epa.gov/ccr" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-wur-teal hover:underline">
                    EPA CCR Search <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
