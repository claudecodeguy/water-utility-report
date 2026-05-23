import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Building2, Users, Droplets, AlertTriangle, CheckCircle2,
} from "lucide-react";
import ExploreArea from "@/components/explore-area";
import RelatedWaterQuestions, { type WaterQuestion } from "@/components/related-water-questions";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import RiskMeter from "@/components/risk-meter";
import FaqSection from "@/components/faq-section";
import RelatedPages from "@/components/related-pages";
import SourcesBlock from "@/components/sources-block";
import PageIntroBox from "@/components/page-intro-box";
import DataLimitationsNote from "@/components/data-limitations-note";
import JsonLd from "@/components/json-ld";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// ─── Slug helpers ──────────────────────────────────────────────────────────────

function slugifyCity(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cleanCityName(raw: string): string {
  return raw.trim()
    .replace(/\s+\d{3,4}\b/g, "")  // strip space-separated codes like " 1105"
    .replace(/-\d{3,4}$/, "")       // strip dash-separated codes like "-1105"
    .trim();
}

// city_served may be comma-separated (regional utilities). Returns all clean names.
function parseCityNames(cityServed: string): string[] {
  return cityServed.split(",").map(cleanCityName).filter(Boolean);
}

// Parse "charlotte-nc" → { citySlug: "charlotte", stateAbbr: "NC" }
function parseSlug(slug: string): { citySlug: string; stateAbbr: string } | null {
  const match = slug.match(/^(.+)-([a-z]{2})$/);
  if (!match) return null;
  return { citySlug: match[1], stateAbbr: match[2].toUpperCase() };
}

// ─── Risk helpers ──────────────────────────────────────────────────────────────

const RISK_ORDER = ["safe", "low", "moderate", "high", "critical"] as const;
type RiskLevel = typeof RISK_ORDER[number];

function worstRisk(levels: string[]): RiskLevel {
  let worst = 0;
  for (const l of levels) {
    const idx = RISK_ORDER.indexOf(l as RiskLevel);
    if (idx > worst) worst = idx;
  }
  return RISK_ORDER[worst];
}

const RISK_COLORS: Record<RiskLevel, string> = {
  safe:     "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  low:      "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  high:     "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
  critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
};

// ─── Contaminant names from violations ─────────────────────────────────────────

const CODE_NAMES: Record<string, string> = {
  "1005": "Total Coliform", "1006": "Fecal Coliform", "1040": "E. coli",
  "2456": "Total Trihalomethanes (TTHMs)", "2950": "Haloacetic Acids (HAA5)",
  "4006": "Nitrate", "4020": "Fluoride", "4109": "Arsenic",
  "5000": "Lead", "5100": "Copper", "3100": "PFOA", "3101": "PFOS",
};

// ─── FAQ generator ─────────────────────────────────────────────────────────────

function buildFaqs(
  city: string,
  stateAbbr: string,
  overallRisk: RiskLevel,
  openViolationCount: number,
  contaminantNames: string[],
  utilityCount: number,
  pfasUtilityCount: number,
): Array<{ question: string; answer: string }> {
  const safeAnswer =
    overallRisk === "safe" || overallRisk === "low"
      ? `Based on EPA records, tap water in ${city} currently has no open health-based violations. The water meets federal safety standards. You can verify current status with your utility's Consumer Confidence Report.`
      : `${city}'s water supply has ${openViolationCount} open health-based violation${openViolationCount !== 1 ? "s" : ""} recorded by the EPA. This means a contaminant has exceeded legal limits and has not yet been formally resolved in the federal database. Contact your utility directly for the latest status.`;

  const contaminantAnswer =
    contaminantNames.length > 0
      ? `Health-based violations in ${city} have involved: ${contaminantNames.join(", ")}. These are federally regulated contaminants with established maximum contaminant levels (MCLs). Check each utility's report page for full details.`
      : `No health-based contaminant violations are currently recorded for ${city}'s water providers. Monitoring data from Consumer Confidence Reports may show trace levels of regulated substances within legal limits.`;

  const leadAnswer = contaminantNames.some(n => /lead/i.test(n))
    ? `Yes — one or more utilities serving ${city} have open Lead violations. Lead can leach from older pipes and plumbing. A reverse osmosis or NSF-certified pitcher filter is effective at removing lead.`
    : `No open lead violations are recorded for ${city}. However, if your home was built before 1986, consider testing your tap water directly as lead can leach from household plumbing regardless of utility compliance.`;

  const pfasAnswer = pfasUtilityCount > 0
    ? `${pfasUtilityCount} of the water system${pfasUtilityCount !== 1 ? "s" : ""} serving ${city} has PFAS monitoring records in the EPA UCMR 5 dataset (2023–2025). UCMR 5 results reflect detections above the minimum reporting level — this is monitoring data, not a compliance violation or health determination. View individual utility pages for full PFAS records and source links.`
    : `No PFAS records have been located for water systems serving ${city} in the current EPA UCMR 5 dataset. This does not confirm absence of PFAS — utilities below the monitoring threshold may not have been required to test.`;

  return [
    { question: `Is ${city} tap water safe to drink?`, answer: safeAnswer },
    { question: `What contaminants are in ${city} water?`, answer: contaminantAnswer },
    { question: `Does ${city} have lead in the water?`, answer: leadAnswer },
    { question: `Is there PFAS in ${city} drinking water?`, answer: pfasAnswer },
    {
      question: `Who provides water in ${city}, ${stateAbbr}?`,
      answer: `${city} is served by ${utilityCount} EPA-tracked water system${utilityCount !== 1 ? "s" : ""}. You can find each provider on this page. Your water bill is the most reliable way to confirm your specific provider.`,
    },
    {
      question: `How do I get my water tested in ${city}, ${stateAbbr}?`,
      answer: `To test your tap water in ${city}, use a state-certified laboratory. The EPA maintains a national directory of certified labs by state and contaminant at epa.gov/dwlabcert. For PFAS testing, confirm the lab holds EPA Method 533 or 537.1 certification. For lead or well water testing, contact your ${stateAbbr} state drinking water program for its certified lab list. Find certified labs at waterutilityreport.com/labs.`,
    },
  ];
}

// ─── Metadata ──────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: slugParam } = await params;
  const parsed = parseSlug(slugParam);
  if (!parsed) return {};

  const utilities = await prisma.utility.findMany({
    where: {
      state: { abbreviation: parsed.stateAbbr },
      city_served: { not: null },
      publish_status: "published",
    },
    select: { city_served: true, state: { select: { abbreviation: true, name: true } } },
  });

  const match = utilities.find(u =>
    parseCityNames(u.city_served!).some(n => slugifyCity(n) === parsed.citySlug)
  );
  if (!match) return {};

  const cityName = parseCityNames(match.city_served!).find(n => slugifyCity(n) === parsed.citySlug) ?? match.city_served!;
  const stateName = match.state.name;

  const title = `${cityName}, ${parsed.stateAbbr} Water Quality: Utilities, PFAS & Violations (2025)`;
  const description = `Check drinking water quality in ${cityName}, ${stateName}: utilities serving the area, PFAS records, violations, contaminants, and official report links.`;
  const url = `https://waterutilityreport.com/cities/${slugParam}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slugParam } = await params;
  const parsed = parseSlug(slugParam);

  // Fallback 0: no state suffix (e.g. /cities/cloudcroft or /cities/miami)
  // Attempt a global city-name lookup and redirect to the canonical slug.
  if (!parsed) {
    const search = slugParam.replace(/-/g, " ");
    const found = await prisma.utility.findFirst({
      where: {
        city_served: { contains: search, mode: "insensitive" },
        publish_status: "published",
      },
      orderBy: { population_served: "desc" },
      select: { city_served: true, state: { select: { abbreviation: true } } },
    });
    if (found?.city_served) {
      const firstCity = parseCityNames(found.city_served)[0];
      if (firstCity) {
        redirect(`/cities/${slugifyCity(firstCity)}-${found.state.abbreviation.toLowerCase()}`);
      }
    }
    notFound();
  }

  const { citySlug, stateAbbr } = parsed;

  // Fetch all published utilities in the state with city data + their violations
  const allUtilities = await prisma.utility.findMany({
    where: {
      state: { abbreviation: stateAbbr },
      city_served: { not: null },
      publish_status: "published",
    },
    select: {
      id: true, name: true, slug: true, pwsid: true,
      risk_level: true, population_served: true, city_served: true,
      state: { select: { name: true, slug: true, abbreviation: true } },
      violations: {
        where: { is_health_based: true },
        orderBy: { violation_date: "desc" },
        select: {
          contaminant_name: true, contaminant_code: true,
          resolution_date: true, violation_type: true, violation_date: true,
        },
      },
    },
  });

  // Find utilities that include this city in their (possibly comma-separated) city_served
  const utilities = allUtilities.filter(u =>
    parseCityNames(u.city_served!).some(n => slugifyCity(n) === citySlug)
  );

  if (utilities.length === 0) {
    // Fallback 1: trailing numeric code in slug (e.g. mount-olive-twp-1427 → mount-olive-twp)
    const noCodeSlug = citySlug.replace(/-\d{3,4}$/, "");
    if (noCodeSlug !== citySlug) {
      const hit = allUtilities.find(u =>
        parseCityNames(u.city_served!).some(n => slugifyCity(n) === noCodeSlug)
      );
      if (hit) redirect(`/cities/${noCodeSlug}-${stateAbbr.toLowerCase()}`);
    }

    // Fallback 2: compound multi-city slug (e.g. griswold-lisbon → griswold)
    // Find the longest city slug that is a prefix of our slug
    const allCandidates = allUtilities
      .flatMap(u => parseCityNames(u.city_served!).map(n => slugifyCity(n)))
      .filter(s => s.length >= 4)
      .sort((a, b) => b.length - a.length); // longest first
    for (const s of allCandidates) {
      if (citySlug.startsWith(s + "-") || citySlug === s) {
        redirect(`/cities/${s}-${stateAbbr.toLowerCase()}`);
      }
    }

    notFound();
  }

  const pwsids = utilities.map(u => u.pwsid);
  const [pfasHits, allStateCityUtilities] = await Promise.all([
    prisma.pfasRecord.findMany({
      where: { pwsid: { in: pwsids }, suppressed: false, validated: true },
      select: { pwsid: true },
      distinct: ["pwsid"],
    }),
    prisma.utility.findMany({
      where: { state: { abbreviation: stateAbbr }, city_served: { not: null }, publish_status: "published" },
      select: { city_served: true },
      orderBy: { population_served: "desc" },
      take: 80,
    }),
  ]);

  const pfasPwsidSet = new Set(pfasHits.map(r => r.pwsid));
  const utilitiesWithPfas = utilities.filter(u => pfasPwsidSet.has(u.pwsid));

  const nearbyCities = Array.from(
    new Map(
      allStateCityUtilities
        .flatMap(u => parseCityNames(u.city_served!).map(c => ({ name: c, slug: slugifyCity(c) })))
        .filter(c => c.slug !== citySlug && c.name.length > 0)
        .map(c => [c.slug, c])
    ).values()
  ).slice(0, 5);

  const cityName =
    parseCityNames(utilities[0].city_served!).find(n => slugifyCity(n) === citySlug) ??
    utilities[0].city_served!;
  const stateInfo = utilities[0].state;

  // Overall risk
  const overallRisk = worstRisk(utilities.map(u => u.risk_level));

  // Open health violations across all utilities
  const openViolations = utilities.flatMap(u =>
    u.violations.filter(v => !v.resolution_date)
  );

  // Unique contaminant names from open health violations
  const contaminantNames = Array.from(new Set(
    openViolations
      .map(v => v.contaminant_name ?? (v.contaminant_code ? CODE_NAMES[v.contaminant_code] : null))
      .filter((n): n is string => !!n)
  ));

  // Map open-violation contaminant names → contaminant hub URLs
  const VIOLATION_NAME_TO_CONTAMINANT: Record<string, { href: string; label: string }> = {
    "lead": { href: "/contaminants/lead", label: "Lead contamination data and guidance" },
    "nitrate": { href: "/contaminants/nitrate", label: "Nitrate in drinking water" },
    "nitrates": { href: "/contaminants/nitrate", label: "Nitrate in drinking water" },
    "pfas": { href: "/contaminants/pfas", label: "PFAS contamination overview" },
    "pfoa": { href: "/contaminants/pfas", label: "PFAS contamination overview" },
    "pfos": { href: "/contaminants/pfas", label: "PFAS contamination overview" },
    "arsenic": { href: "/contaminants/arsenic", label: "Arsenic in drinking water" },
    "total trihalomethanes (tthms)": { href: "/contaminants/disinfection-byproducts", label: "Disinfection byproducts overview" },
    "haloacetic acids (haa5)": { href: "/contaminants/disinfection-byproducts", label: "Disinfection byproducts overview" },
  };
  const contaminantLinks = Array.from(
    new Map(
      contaminantNames
        .map(n => VIOLATION_NAME_TO_CONTAMINANT[n.toLowerCase()])
        .filter((l): l is { href: string; label: string } => !!l)
        .map(l => [l.href, l])
    ).values()
  );

  // Total population
  const totalPop = utilities.reduce((sum, u) => sum + u.population_served, 0);

  // Props for ExploreArea and RelatedWaterQuestions
  const exploreAreaUtilities = utilities.slice(0, 3).map(u => ({
    slug: u.slug,
    name: normalizeName(u.name),
    pwsid: u.pwsid,
  }));

  const cityWaterQuestions: WaterQuestion[] = [
    {
      question: `Is ${cityName} tap water safe to drink?`,
      href: openViolations.length > 0 ? "#violations" : `#`,
      description: openViolations.length > 0
        ? `${openViolations.length} open health-based violation${openViolations.length !== 1 ? "s" : ""} recorded across ${cityName} utilities`
        : `No open health-based violations recorded for ${cityName} water providers`,
      eventName: "related_question_click",
      eventParams: { question: "water_safety", city: citySlug },
    },
    {
      question: `Does ${cityName} have PFAS records?`,
      href: utilitiesWithPfas.length > 0
        ? `/pfas-watchlist/utility/${utilitiesWithPfas[0].pwsid}`
        : `/pfas-watchlist/${stateInfo.slug}`,
      description: utilitiesWithPfas.length > 0
        ? `${utilitiesWithPfas.length} water system${utilitiesWithPfas.length !== 1 ? "s" : ""} serving ${cityName} have EPA UCMR 5 PFAS records`
        : `Check the ${stateInfo.name} PFAS watchlist for monitoring data`,
      eventName: "related_question_click",
      eventParams: { question: "pfas", city: citySlug },
    },
    {
      question: `What official contamination records exist for ${cityName} utilities?`,
      href: utilities[0]
        ? `/utilities/${utilities[0].slug}/records`
        : `/states/${stateInfo.slug}`,
      description: "Official EPA SDWIS violations and UCMR 5 PFAS sampling records with source links",
      eventName: "related_question_click",
      eventParams: { question: "official_records", city: citySlug },
    },
    {
      question: `How do I get my water tested in ${stateInfo.name}?`,
      href: `/labs?state=${stateInfo.slug}`,
      description: `Find state-certified labs for PFAS, lead, nitrate, and bacteria testing in ${stateInfo.name}`,
      eventName: "related_question_click",
      eventParams: { question: "testing", state: stateInfo.slug },
    },
    {
      question: `What treatment options remove ${cityName} water contaminants?`,
      href: `/treatment`,
      description: "Reverse osmosis, activated carbon, and whole-home filtration guides",
      eventName: "related_question_click",
      eventParams: { question: "treatment", city: citySlug },
    },
    {
      question: `What is the overall water quality rating for ${cityName}?`,
      href: `/states/${stateInfo.slug}`,
      description: `${stateInfo.name} state overview — utility directory, violations, and PFAS data`,
      eventName: "related_question_click",
      eventParams: { question: "state_overview", state: stateInfo.slug },
    },
  ];

  // FAQs
  const faqs = buildFaqs(cityName, stateAbbr, overallRisk, openViolations.length, contaminantNames, utilities.length, utilitiesWithPfas.length);

  // JSON-LD — FAQPage schema for AEO
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const canonicalUrl = `https://waterutilityreport.com/cities/${slugParam}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: stateInfo.name, item: `https://waterutilityreport.com/states/${stateInfo.slug}` },
      { "@type": "ListItem", position: 3, name: cityName, item: canonicalUrl },
    ],
  };

  const collectionPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Water Quality Testing in ${cityName}, ${stateAbbr}`,
    description: `Drinking water quality data for ${cityName}, ${stateInfo.name}. Covers ${utilities.length} EPA-tracked water system${utilities.length !== 1 ? "s" : ""}, violation records, contaminant data, and official source links.`,
    url: canonicalUrl,
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Water utilities serving ${cityName}, ${stateAbbr}`,
    numberOfItems: utilities.length,
    itemListElement: utilities.map((u, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: normalizeName(u.name),
      url: `https://waterutilityreport.com/utilities/${u.slug}`,
    })),
  };

  const relatedPages = [
    {
      href: `/states/${stateInfo.slug}`,
      label: `${stateInfo.name} drinking water overview`,
      type: "state" as const,
      description: `All utilities and data in ${stateAbbr}`,
    },
    ...utilitiesWithPfas.slice(0, 3).map(u => ({
      href: `/pfas-watchlist/utility/${u.pwsid}`,
      label: `PFAS test results for ${normalizeName(u.name)}`,
      type: "contaminant" as const,
      description: "Official EPA PFAS monitoring data",
    })),
    ...contaminantLinks.map(l => ({
      href: l.href,
      label: l.label,
      type: "contaminant" as const,
      description: "Contaminant data and guidance",
    })),
  ];

  const sources = [
    { label: "EPA SDWIS — Violation & Compliance Data", url: "https://enviro.epa.gov/envirofacts/sdwis/search", note: "Federal drinking water database" },
    { label: "EPA ECHO — Facility Reports", url: `https://echo.epa.gov/` },
  ];

  const riskSummary =
    overallRisk === "safe" || overallRisk === "low"
      ? `No open health-based violations are recorded for ${cityName}'s water providers. Water meets current federal standards.`
      : `${openViolations.length} open health-based violation${openViolations.length !== 1 ? "s" : ""} recorded across ${cityName}'s water providers${contaminantNames.length > 0 ? ` involving ${contaminantNames.join(", ")}` : ""}.`;

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={collectionPageJsonLd} />
      <JsonLd data={itemListJsonLd} />

      {/* Hero */}
      <div className="bg-wur-ink text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/states/${stateInfo.slug}`} className="hover:text-white/70 transition-colors">{stateInfo.name}</Link>
            <span>/</span>
            <span className="text-white/60">{cityName}</span>
          </nav>

          <div className="flex items-start gap-3">
            <Building2 className="w-6 h-6 text-white/40 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Water Quality Testing</p>
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">
                {cityName}, {stateAbbr} Water Quality Testing Results
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-white/55 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {totalPop.toLocaleString()} residents served
                </span>
                <span>·</span>
                <span>{utilities.length} utility provider{utilities.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            <PageIntroBox
              summary={`Drinking water quality data for ${cityName}, ${stateAbbr} based on official EPA compliance records. This page covers all ${utilities.length} EPA-tracked water system${utilities.length !== 1 ? "s" : ""} serving ${cityName}.`}
              dataItems={[
                { label: "Violation & compliance history", available: true },
                { label: "PFAS monitoring records", available: utilitiesWithPfas.length > 0 },
                { label: "Active contaminant violations", available: contaminantNames.length > 0 },
              ]}
            />

            {/* Direct answer box */}
            <section className={`rounded-xl border p-6 ${
              overallRisk === "safe" || overallRisk === "low"
                ? "border-wur-safe-border bg-wur-safe-bg"
                : "border-wur-warning/30 bg-wur-warning/5"
            }`}>
              <div className="flex items-start gap-3">
                {overallRisk === "safe" || overallRisk === "low" ? (
                  <CheckCircle2 className="w-5 h-5 text-wur-safe shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-wur-warning shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {overallRisk === "safe" || overallRisk === "low"
                      ? "No current health violations on record"
                      : `${openViolations.length} open health violation${openViolations.length !== 1 ? "s" : ""} on record`}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{riskSummary}</p>
                </div>
              </div>
            </section>

            {/* Risk meter */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-5">Overall Water Quality — {cityName}</h2>
              <RiskMeter level={overallRisk} />
              <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                Overall rating reflects the worst risk level among all utilities serving {cityName}.
                Individual utility pages have full violation details.
              </p>
            </section>

            {/* Utilities */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">
                Water utilities serving {cityName}, {stateAbbr}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                The following utilities serve {cityName} based on EPA service-area data.
                Your water bill is the most reliable way to confirm your provider.
              </p>
              <div className="space-y-3">
                {utilities.map((u) => {
                  const uRisk = u.risk_level as RiskLevel;
                  const uOpenViolations = u.violations.filter(v => !v.resolution_date).length;
                  const hasRecordsPage = u.violations.length > 0 || pfasPwsidSet.has(u.pwsid);
                  return (
                    <div key={u.slug} className="rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all">
                      <Link
                        href={`/utilities/${u.slug}`}
                        className="flex items-start gap-4 p-5 group"
                      >
                        <Droplets className="w-5 h-5 text-wur-teal shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h3 className="font-semibold text-foreground group-hover:text-wur-teal transition-colors">
                              {normalizeName(u.name)}
                            </h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 capitalize ${RISK_COLORS[uRisk]}`}>
                              {uRisk}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                            <span className="font-mono">{u.pwsid}</span>
                            <span>{u.population_served.toLocaleString()} served</span>
                            {uOpenViolations > 0 && (
                              <span className="text-wur-warning font-medium">
                                {uOpenViolations} open health violation{uOpenViolations !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                      {hasRecordsPage && (
                        <div className="px-5 pb-3 flex gap-2 border-t border-border/50 pt-3">
                          <Link
                            href={`/utilities/${u.slug}/records`}
                            className="text-[11px] px-2.5 py-1 rounded border border-border text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors font-medium"
                          >
                            Official records →
                          </Link>
                          {pfasPwsidSet.has(u.pwsid) && (
                            <Link
                              href={`/pfas-watchlist/utility/${u.pwsid}`}
                              className="text-[11px] px-2.5 py-1 rounded border border-amber-200 text-amber-700 hover:border-amber-400 transition-colors font-medium"
                            >
                              PFAS records →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Active violations — per-utility table */}
            {openViolations.length > 0 && (
              <section id="violations">
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Active Drinking Water Violations in {cityName}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  The following health-based violations remain open in the EPA SDWIS federal database — the contaminant exceeded its legal limit and has not yet been formally resolved.
                </p>
                <div className="rounded-lg border border-border overflow-hidden mb-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50 border-b border-border">
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Utility</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Contaminant</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Violation date</th>
                        <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Records</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {utilities.flatMap(u =>
                        u.violations
                          .filter(v => !v.resolution_date)
                          .map((v, i) => {
                            const cName = v.contaminant_name ?? (v.contaminant_code ? CODE_NAMES[v.contaminant_code] : null) ?? "Unknown";
                            return (
                              <tr key={`${u.slug}-${i}`} className="bg-card hover:bg-muted/30 transition-colors">
                                <td className="px-4 py-3 text-xs">
                                  <Link href={`/utilities/${u.slug}`} className="font-medium text-foreground hover:text-wur-teal transition-colors">
                                    {normalizeName(u.name)}
                                  </Link>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                                  <span className="flex items-center gap-1.5">
                                    <AlertTriangle className="w-3 h-3 text-wur-warning shrink-0" />
                                    {cName}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                                  {v.violation_date ? new Date(v.violation_date).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" }) : "—"}
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <Link
                                    href={`/utilities/${u.slug}/records`}
                                    className="text-[11px] text-wur-teal hover:underline font-medium"
                                  >
                                    View records →
                                  </Link>
                                </td>
                              </tr>
                            );
                          })
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-muted-foreground">
                  Source: EPA SDWIS. Open violations indicate the utility has not yet formally resolved the finding in the federal database. Contact your utility for current status.
                </p>
              </section>
            )}

            {contaminantNames.length === 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">Water Quality in {cityName}</h2>
                <div className="flex items-start gap-3 p-5 rounded-xl border border-wur-safe-border bg-wur-safe-bg">
                  <CheckCircle2 className="w-4 h-4 text-wur-safe shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-foreground mb-1">No active contaminant violations</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      No health-based contaminant violations are currently recorded for {cityName}'s water providers.
                      Review each utility's Consumer Confidence Report for full test results.
                    </p>
                  </div>
                </div>
              </section>
            )}

            <ExploreArea
              areaType="city"
              areaName={cityName}
              stateSlug={stateInfo.slug}
              stateName={stateInfo.name}
              stateAbbr={stateAbbr}
              citySlug={citySlug}
              topUtilities={exploreAreaUtilities}
              pfasUtilityCount={utilitiesWithPfas.length}
              openViolationCount={openViolations.length}
            />
            <RelatedWaterQuestions
              questions={cityWaterQuestions}
              title={`Common Questions About ${cityName} Drinking Water`}
            />
            <DataLimitationsNote />

            {/* Labs CTA */}
            <section className="rounded-xl border border-border bg-card p-6">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Independent Water Testing</p>
              <h2 className="font-display text-lg text-foreground mb-2">Get your water tested by a certified lab</h2>
              <p className="text-sm text-muted-foreground mb-4">
                EPA compliance data shows what utilities report — an independent test confirms what&apos;s actually coming out of your tap. Certified labs in {stateInfo.name} can test for PFAS, lead, nitrates, and dozens of other contaminants.
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/labs?state=${stateInfo.slug}`}
                  className="text-xs px-3 py-1.5 rounded-full border border-wur-teal/40 bg-teal-50 text-wur-teal hover:bg-teal-100 transition-colors font-medium"
                >
                  Find certified labs in {stateInfo.name} →
                </Link>
                <Link
                  href="/treatment"
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
                >
                  Browse treatment options
                </Link>
              </div>
            </section>

            <section id="faq">
              <FaqSection faqs={faqs} title={`${cityName} Water FAQs`} />
            </section>
            <RelatedPages pages={relatedPages} title="Related Pages" />
            <SourcesBlock sources={sources} lastUpdated={new Date().toISOString().split("T")[0]} />
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  {cityName} at a Glance
                </p>
                <div className="space-y-3">
                  {[
                    { label: "State", value: stateInfo.name },
                    { label: "Utilities", value: String(utilities.length), mono: true },
                    { label: "Population Served", value: totalPop.toLocaleString(), mono: true },
                    { label: "Overall Risk", value: overallRisk, color: `capitalize font-semibold ${RISK_COLORS[overallRisk].split(" ")[0]}` },
                    { label: "Open Health Violations", value: String(openViolations.length), mono: true, color: openViolations.length > 0 ? "text-wur-danger font-semibold" : "text-wur-safe font-semibold" },
                  ].map(({ label, value, mono, color }) => (
                    <div key={label} className="flex items-start justify-between">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className={`text-xs ${mono ? "font-mono" : ""} ${color ?? "font-medium text-foreground"}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Providers</p>
                <div className="space-y-2">
                  {utilities.map(u => (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="flex items-center gap-2 text-xs text-wur-teal hover:underline"
                    >
                      <Droplets className="w-3 h-3 shrink-0" />
                      {normalizeName(u.name)}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-wur-caution-border bg-wur-caution-bg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-wur-caution mt-0.5 shrink-0" />
                  <p className="text-xs text-wur-caution leading-relaxed">
                    Service area match is <strong>likely but not guaranteed</strong>. Your water bill is the most reliable way to confirm your provider.
                  </p>
                </div>
              </div>

              {nearbyCities.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Other Cities in {stateInfo.abbreviation}
                  </p>
                  <div className="space-y-1.5">
                    {nearbyCities.map(c => (
                      <Link
                        key={c.slug}
                        href={`/cities/${c.slug}-${stateAbbr.toLowerCase()}`}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors py-0.5"
                      >
                        <Building2 className="w-3 h-3 shrink-0" />
                        {c.name}, {stateAbbr} water report
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
