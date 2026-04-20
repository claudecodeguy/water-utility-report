import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Building2, Users, Droplets, AlertTriangle, CheckCircle2, Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import RiskMeter from "@/components/risk-meter";
import FaqSection from "@/components/faq-section";
import RelatedPages from "@/components/related-pages";
import SourcesBlock from "@/components/sources-block";
import JsonLd from "@/components/json-ld";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

// ─── Slug helpers ──────────────────────────────────────────────────────────────

function slugifyCity(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function cleanCityName(raw: string): string {
  return raw.trim().replace(/-\d{3,4}$/, "").trim();
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

  return [
    { question: `Is ${city} tap water safe to drink?`, answer: safeAnswer },
    { question: `What contaminants are in ${city} water?`, answer: contaminantAnswer },
    { question: `Does ${city} have lead in the water?`, answer: leadAnswer },
    {
      question: `Who provides water in ${city}, ${stateAbbr}?`,
      answer: `${city} is served by ${utilityCount} EPA-tracked water system${utilityCount !== 1 ? "s" : ""}. You can find each provider on this page. Your water bill is the most reliable way to confirm your specific provider.`,
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

  return {
    title: `Is ${cityName}, ${parsed.stateAbbr} Tap Water Safe? (${new Date().getFullYear()} Report)`,
    description: `Drinking water quality report for ${cityName}, ${stateName}. See EPA violation history, risk level, contaminants detected, and filtration guidance for local utilities.`,
  };
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: slugParam } = await params;
  const parsed = parseSlug(slugParam);
  if (!parsed) notFound();

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
        select: {
          contaminant_name: true, contaminant_code: true,
          resolution_date: true, violation_type: true,
        },
      },
    },
  });

  // Find utilities that include this city in their (possibly comma-separated) city_served
  const utilities = allUtilities.filter(u =>
    parseCityNames(u.city_served!).some(n => slugifyCity(n) === citySlug)
  );

  if (utilities.length === 0) notFound();

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

  // Total population
  const totalPop = utilities.reduce((sum, u) => sum + u.population_served, 0);

  // FAQs
  const faqs = buildFaqs(cityName, stateAbbr, overallRisk, openViolations.length, contaminantNames, utilities.length);

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

  const relatedPages = [
    {
      href: `/states/${stateInfo.slug}`,
      label: `${stateInfo.name} State Overview`,
      type: "state" as const,
      description: `All utilities in ${stateAbbr}`,
    },
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
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">City Water Report</p>
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">
                Is {cityName}, {stateAbbr} Tap Water Safe?
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
                Water Provider{utilities.length !== 1 ? "s" : ""} in {cityName}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                The following utilities serve {cityName} based on EPA service-area data.
                Your water bill is the most reliable way to confirm your provider.
              </p>
              <div className="space-y-3">
                {utilities.map((u) => {
                  const uRisk = u.risk_level as RiskLevel;
                  const uOpenViolations = u.violations.filter(v => !v.resolution_date).length;
                  return (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all group"
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
                  );
                })}
              </div>
            </section>

            {/* What's in the water */}
            {contaminantNames.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Active Contaminant Violations in {cityName}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  The following contaminants have exceeded EPA legal limits and remain open in the federal database.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {contaminantNames.map((name) => (
                    <div key={name} className="flex items-center gap-3 p-4 rounded-lg border border-wur-warning/30 bg-wur-warning/5">
                      <AlertTriangle className="w-4 h-4 text-wur-warning shrink-0" />
                      <span className="text-sm font-medium text-foreground">{name}</span>
                    </div>
                  ))}
                </div>
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

            {/* Data note */}
            <div className="flex items-start gap-2 bg-muted/30 rounded-lg p-3 border border-border">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Data sourced from EPA SDWIS federal compliance database. Violation status reflects
                the most recent update from EPA. Always verify current water quality with your
                utility's Consumer Confidence Report or contact them directly.
              </p>
            </div>

            <FaqSection faqs={faqs} title={`${cityName} Water FAQs`} />
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
