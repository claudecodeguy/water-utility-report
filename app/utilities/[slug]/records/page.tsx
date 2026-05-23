import { notFound } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  FileText,
  FlaskConical,
  ArrowLeft,
  ShieldAlert,
  Droplets,
  Info,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import JsonLd from "@/components/json-ld";
import DataLimitationsNote from "@/components/data-limitations-note";
import TrackedAnchor from "@/components/tracked-anchor";
import TrackedLink from "@/components/tracked-link";
import FaqSection from "@/components/faq-section";
import type { FAQ } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

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
  "3100": "PFOA",
  "3101": "PFOS",
  "1094": "Legionella",
  "1011": "Revised Total Coliform Rule (RTCR)",
  "1012": "E. coli (RTCR)",
  "1007": "Turbidity",
  "2100": "Bromate",
  "2080": "Chlorite",
};

function slugifyCity(raw: string): string {
  const clean = raw.split(",")[0].trim()
    .replace(/\s+\d{3,4}\b/g, "")
    .replace(/-\d{3,4}$/, "")
    .trim();
  return clean.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const utility = await prisma.utility.findUnique({
    where: { slug },
    select: {
      name: true,
      city_served: true,
      county_served: true,
      pwsid: true,
      state: { select: { abbreviation: true, name: true } },
      violations: { where: { is_health_based: true }, select: { id: true }, take: 1 },
    },
  });
  if (!utility) return {};

  const displayName = normalizeName(utility.name);
  const city = utility.city_served ?? utility.county_served ?? utility.state.name;
  const stateAbbr = utility.state.abbreviation;
  const hasViolations = utility.violations.length > 0;
  const pfasCount = await prisma.pfasRecord.count({
    where: { pwsid: utility.pwsid, suppressed: false, validated: true },
  });
  if (!hasViolations && pfasCount === 0) return {};

  const title = `${city} ${displayName} — Official EPA Water Contamination & Sampling Records (${stateAbbr})`;
  const description = `Official EPA SDWIS and UCMR 5 records for ${displayName} (PWSID ${utility.pwsid}) in ${city}, ${stateAbbr}. View violation history, PFAS monitoring data, sample dates, and source links.`;
  const url = `https://waterutilityreport.com/utilities/${slug}/records`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: "index, follow",
  };
}

export default async function UtilityRecordsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const utility = await prisma.utility.findUnique({
    where: { slug },
    select: {
      id: true,
      slug: true,
      name: true,
      pwsid: true,
      city_served: true,
      county_served: true,
      population_served: true,
      service_type: true,
      ownership_type: true,
      last_verification_date: true,
      ingestion_date: true,
      ccr_url: true,
      ccr_year: true,
      state: { select: { name: true, abbreviation: true, slug: true } },
      violations: {
        where: { is_health_based: true },
        orderBy: { violation_date: "desc" },
        select: {
          id: true,
          contaminant_name: true,
          contaminant_code: true,
          violation_type: true,
          violation_date: true,
          resolution_date: true,
          is_health_based: true,
          severity: true,
          source_url: true,
        },
      },
      ccr_reports: {
        orderBy: { report_year: "desc" },
        select: { report_year: true, report_url: true },
      },
    },
  });

  if (!utility) notFound();

  const pfasDetections = await prisma.pfasRecord.findMany({
    where: {
      pwsid: utility.pwsid,
      raw_detection_flag: "Detected above MRL",
      suppressed: false,
      validated: true,
    },
    include: {
      analyte: {
        select: { code: true, name: true, short_name: true, epa_mcl_ppt: true, cas_number: true },
      },
    },
    orderBy: [{ sample_date: "desc" }, { analyte: { code: "asc" } }],
    take: 100,
  });

  const [totalPfasRecords, allPfasForEvents] = await Promise.all([
    prisma.pfasRecord.count({
      where: { pwsid: utility.pwsid, suppressed: false, validated: true },
    }),
    prisma.pfasRecord.findMany({
      where: { pwsid: utility.pwsid, suppressed: false, validated: true },
      select: { sample_date: true, sample_point: true, raw_detection_flag: true },
      orderBy: { sample_date: "desc" },
      take: 500,
    }),
  ]);

  // 404 if no official records of any kind — thin page guard
  if (utility.violations.length === 0 && totalPfasRecords === 0) notFound();

  // Group PFAS records into sampling events by date + sample_point
  type SamplingEvent = { date: Date; point: string | null; total: number; detected: number };
  const eventMap = new Map<string, SamplingEvent>();
  for (const r of allPfasForEvents) {
    const key = `${r.sample_date.toISOString().split("T")[0]}|${r.sample_point ?? ""}`;
    const ev = eventMap.get(key);
    if (ev) {
      ev.total++;
      if (r.raw_detection_flag === "Detected above MRL") ev.detected++;
    } else {
      eventMap.set(key, {
        date: r.sample_date,
        point: r.sample_point,
        total: 1,
        detected: r.raw_detection_flag === "Detected above MRL" ? 1 : 0,
      });
    }
  }
  const samplingEvents = Array.from(eventMap.values()).slice(0, 25);

  const displayName = normalizeName(utility.name);
  const city = utility.city_served ?? utility.county_served ?? utility.state.name;
  const stateAbbr = utility.state.abbreviation;
  const canonical = `https://waterutilityreport.com/utilities/${slug}/records`;

  const mostRecentSample = pfasDetections.length > 0
    ? pfasDetections[0].sample_date
    : null;
  const mostRecentViolation = utility.violations.length > 0
    ? utility.violations[0].violation_date
    : null;
  const openViolations = utility.violations.filter((v) => !v.resolution_date || new Date(v.resolution_date) > new Date()).length;

  // Check if any PFAS detections exceed the EPA MCL
  const pfasExceedingMcl = pfasDetections.filter(
    (r) => r.analyte.epa_mcl_ppt != null && parseFloat(r.raw_result_value) * 1000 > r.analyte.epa_mcl_ppt
  );

  const fmtDate = (d: Date | null) =>
    d ? new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" }) : "Unknown";

  const dataRefreshed =
    utility.last_verification_date?.toISOString().split("T")[0] ??
    utility.ingestion_date?.toISOString().split("T")[0] ??
    "2025";

  // Schema
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: utility.state.name, item: `https://waterutilityreport.com/states/${utility.state.slug}` },
      { "@type": "ListItem", position: 3, name: displayName, item: `https://waterutilityreport.com/utilities/${slug}` },
      { "@type": "ListItem", position: 4, name: "Official Records", item: canonical },
    ],
  };

  const datasetJsonLd = pfasDetections.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${displayName} EPA UCMR 5 PFAS Monitoring Records`,
    description: `Official EPA UCMR 5 sampling records showing PFAS compounds detected above the minimum reporting level at ${displayName} (PWSID: ${utility.pwsid}) in ${city}, ${stateAbbr}.`,
    url: canonical,
    creator: { "@type": "Organization", name: "U.S. Environmental Protection Agency", url: "https://www.epa.gov" },
    license: "https://www.epa.gov/privacy/privacy-policy",
    temporalCoverage: "2023/2025",
    variableMeasured: pfasDetections.map((r) => r.analyte.name).filter((v, i, a) => a.indexOf(v) === i).join(", "),
  } : null;

  const faqs: FAQ[] = [
    {
      question: `What do the EPA sampling records for ${displayName} show?`,
      answer: `The EPA records for ${displayName} (PWSID: ${utility.pwsid}) show ${utility.violations.length > 0 ? `${utility.violations.length} health-based violation${utility.violations.length !== 1 ? "s" : ""} in the SDWIS compliance database` : "no health-based violations in SDWIS"}${pfasDetections.length > 0 ? ` and ${pfasDetections.length} PFAS compound detection${pfasDetections.length !== 1 ? "s" : ""} above the minimum reporting level in EPA UCMR 5 monitoring data` : ""}. Records on this page are sourced directly from EPA SDWIS and UCMR 5 datasets.`,
    },
    {
      question: "What does 'Detected above MRL' mean in PFAS records?",
      answer: "MRL stands for Minimum Reporting Level — the lowest concentration the testing equipment can reliably measure. 'Detected above MRL' means the analyte was found at a measurable concentration. Detection above MRL is not itself a regulatory violation. EPA has set Maximum Contaminant Levels (MCLs) for PFOA and PFOS at 4 ppt and for PFNA, PFHxS, and HFPO-DA at 10 ppt (April 2024 rule). Detections below those MCLs do not constitute a regulatory violation.",
    },
    {
      question: `Does this mean ${city}'s water is unsafe?`,
      answer: `These records reflect what EPA compliance monitoring and UCMR 5 sampling returned. A detection above MRL does not by itself indicate the water is unsafe. A health-based violation in SDWIS means a contaminant exceeded its legal limit during the violation period — it does not necessarily mean current water is out of compliance. For current compliance status, consult ${displayName}'s most recent Consumer Confidence Report or contact the utility directly.`,
    },
    {
      question: "How do I get an independent water test?",
      answer: `For independent verification, use a state-certified laboratory. Certified labs can test for PFAS (using EPA Method 533 or 537.1), lead, nitrates, bacteria, and dozens of other contaminants. Find certified labs in ${utility.state.name} at waterutilityreport.com/labs.`,
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

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      {datasetJsonLd && <JsonLd data={datasetJsonLd} />}
      <JsonLd data={faqJsonLd} />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="border-b border-border bg-muted/30">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Link
              href={`/utilities/${slug}`}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors mb-5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to {displayName}
            </Link>
            <div className="flex items-start gap-3 mb-3">
              <FileText className="w-5 h-5 text-wur-teal shrink-0 mt-0.5" />
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal">Official EPA Records</p>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-foreground mb-2 leading-tight">
              {displayName}
            </h1>
            <p className="text-base text-muted-foreground mb-4">
              Official EPA contamination &amp; sampling records · {city}, {stateAbbr}
            </p>
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="font-mono bg-muted px-2 py-0.5 rounded">PWSID: {utility.pwsid}</span>
              <span>{utility.population_served.toLocaleString()} people served</span>
              {utility.service_type && <span>{utility.service_type}</span>}
              <span>Data refreshed: {dataRefreshed}</span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

          {/* What official records show */}
          <section>
            <h2 className="font-display text-2xl text-foreground mb-4">What official records show</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className={`rounded-xl border p-5 ${openViolations > 0 ? "border-wur-warning/50 bg-wur-warning-bg" : "border-border bg-card"}`}>
                <div className="flex items-center gap-2 mb-2">
                  {openViolations > 0
                    ? <AlertTriangle className="w-4 h-4 text-wur-warning" />
                    : <CheckCircle2 className="w-4 h-4 text-wur-safe" />}
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Health violations</p>
                </div>
                <p className={`text-2xl font-bold mb-1 ${openViolations > 0 ? "text-wur-warning" : "text-muted-foreground"}`}>
                  {utility.violations.length > 0 ? utility.violations.length : "None"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {utility.violations.length === 0
                    ? "None recorded in EPA SDWIS"
                    : openViolations > 0
                    ? `${openViolations} open · Most recent: ${fmtDate(mostRecentViolation)}`
                    : `All ${utility.violations.length} resolved · Most recent: ${fmtDate(mostRecentViolation)}`}
                </p>
              </div>

              <div className={`rounded-xl border p-5 ${pfasDetections.length > 0 ? "border-amber-300 bg-amber-50/50" : "border-border bg-card"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className={`w-4 h-4 ${pfasDetections.length > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PFAS detected (UCMR 5)</p>
                </div>
                <p className={`text-2xl font-bold mb-1 ${pfasDetections.length > 0 ? "text-amber-700" : "text-muted-foreground"}`}>
                  {pfasDetections.length > 0
                    ? `${[...new Set(pfasDetections.map(r => r.analyte.code))].length} analytes`
                    : "None"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pfasDetections.length > 0
                    ? `From ${totalPfasRecords} total monitoring samples · Last: ${fmtDate(mostRecentSample)}`
                    : `${totalPfasRecords} monitoring samples — no detections above MRL`}
                </p>
              </div>

              <div className={`rounded-xl border p-5 ${pfasExceedingMcl.length > 0 ? "border-amber-300 bg-amber-50/50" : "border-border bg-card"}`}>
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className={`w-4 h-4 ${pfasExceedingMcl.length > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Above MCL level (monitoring)</p>
                </div>
                <p className={`text-2xl font-bold mb-1 ${pfasExceedingMcl.length > 0 ? "text-amber-700" : "text-muted-foreground"}`}>
                  {pfasExceedingMcl.length > 0
                    ? `${[...new Set(pfasExceedingMcl.map(r => r.analyte.code))].length} compound${[...new Set(pfasExceedingMcl.map(r => r.analyte.code))].length !== 1 ? "s" : ""}`
                    : "None"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pfasExceedingMcl.length > 0
                    ? `Detected above the 2024 MCL threshold in UCMR 5 data · compliance deadline 2029`
                    : "No PFAS above EPA MCL thresholds in monitoring data"}
                </p>
              </div>
            </div>

            {/* Answer-first summary */}
            <div className="rounded-xl border border-border bg-card p-6">
              <p className="text-sm leading-relaxed text-foreground">
                EPA compliance records for <strong>{displayName}</strong> (PWSID: <span className="font-mono">{utility.pwsid}</span>) in {city}, {stateAbbr} show{" "}
                {utility.violations.length > 0
                  ? <><strong>{utility.violations.length} health-based violation{utility.violations.length !== 1 ? "s" : ""}</strong> recorded in EPA SDWIS{openViolations > 0 ? `, with ${openViolations} currently open` : ", all resolved"}</>
                  : <><strong>no health-based violations</strong> in EPA SDWIS</>
                }
                {pfasDetections.length > 0
                  ? <> and <strong>{[...new Set(pfasDetections.map(r => r.analyte.code))].length} PFAS compound{[...new Set(pfasDetections.map(r => r.analyte.code))].length !== 1 ? "s" : ""} detected above the minimum reporting level</strong> in EPA UCMR 5 monitoring data (most recent sample: {fmtDate(mostRecentSample)})</>
                  : <> and no PFAS detections above the minimum reporting level in EPA UCMR 5 monitoring</>
                }.
                {pfasExceedingMcl.length > 0 && (
                  <> UCMR 5 monitoring data shows <strong className="text-amber-700">{[...new Set(pfasExceedingMcl.map(r => r.analyte.code))].join(", ")} detected above the 2024 EPA MCL threshold</strong> in at least one sampling round. Note: the EPA PFAS rule compliance deadline is 2029 — detection above the MCL level in UCMR 5 monitoring is not a regulatory violation.</>
                )}
                {" "}All records on this page are sourced from EPA SDWIS and the UCMR 5 dataset. This is official monitoring data — not a health risk determination.
              </p>
            </div>
          </section>

          {/* Violations */}
          {utility.violations.length > 0 && (
            <section id="violations">
              <h2 className="font-display text-2xl text-foreground mb-2">Health-Based Violation History</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Source: <strong>EPA SDWIS</strong> (Safe Drinking Water Information System). A health-based violation means a contaminant exceeded the legal Maximum Contaminant Level (MCL) or a required treatment technique was not met during the violation period. Resolved violations indicate the utility returned to compliance.
              </p>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contaminant</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Violation date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {utility.violations.map((v, i) => {
                      const contaminantName = v.contaminant_name
                        ?? (v.contaminant_code ? CONTAMINANT_CODE_NAMES[v.contaminant_code] ?? "Unspecified" : "Unspecified");
                      const slug_ = VIOLATION_TO_CONTAMINANT_SLUG[contaminantName.toLowerCase()] ?? null;
                      const isOpen = !v.resolution_date || new Date(v.resolution_date) > new Date();
                      const fmt = (d: Date | string) =>
                        new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

                      return (
                        <tr key={i} className="bg-card hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3.5 font-medium text-foreground">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-wur-warning shrink-0" />
                              {slug_ ? (
                                <TrackedLink
                                  href={`/contaminants/${slug_}`}
                                  eventName="internal_record_page_click"
                                  eventParams={{ destination: "contaminant", slug: slug_ }}
                                  className="hover:text-wur-teal transition-colors"
                                >
                                  {contaminantName}
                                </TrackedLink>
                              ) : contaminantName}
                            </div>
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground hidden sm:table-cell text-xs">
                            {v.violation_type ?? "MCL Violation"}
                          </td>
                          <td className="px-4 py-3.5 text-muted-foreground text-xs">
                            {v.violation_date ? fmt(v.violation_date) : "Unknown"}
                          </td>
                          <td className="px-4 py-3.5 hidden sm:table-cell">
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                              isOpen
                                ? "text-wur-warning bg-wur-warning-bg border-wur-warning-border"
                                : "text-wur-safe bg-wur-safe-bg border-wur-safe-border"
                            }`}>
                              {isOpen ? "Open" : `Resolved ${v.resolution_date ? fmt(v.resolution_date) : ""}`}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Showing {utility.violations.length} health-based violation{utility.violations.length !== 1 ? "s" : ""}.{" "}
                <TrackedAnchor
                  href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="official_source_click"
                  eventParams={{ source: "epa_echo", pwsid: utility.pwsid }}
                  className="text-wur-teal hover:underline"
                >
                  View full violation history on EPA ECHO ↗
                </TrackedAnchor>
              </p>
            </section>
          )}

          {/* Sampling events — chronological PFAS sample events */}
          {samplingEvents.length > 0 && (
            <section id="sampling-events">
              <h2 className="font-display text-2xl text-foreground mb-2">
                Official Water Sampling Events (EPA UCMR 5)
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                EPA UCMR 5 monitoring conducted <strong>{samplingEvents.length}</strong> sampling event{samplingEvents.length !== 1 ? "s" : ""} at {displayName}
                {allPfasForEvents.length === 500 ? " (showing most recent 25 of 25+ events)" : ""}.
                Each event tests water drawn from a designated sampling point for PFAS compounds.
                Source: EPA Unregulated Contaminant Monitoring Rule 5, 2023–2025.
              </p>
              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sample date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Sampling point</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Compounds tested</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Detected above MRL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {samplingEvents.map((ev, i) => {
                      const fmtEv = (d: Date) =>
                        new Date(d).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
                      return (
                        <tr key={i} className={`hover:bg-muted/30 transition-colors ${ev.detected > 0 ? "bg-amber-50/20" : "bg-card"}`}>
                          <td className="px-4 py-3 text-foreground text-xs font-medium">{fmtEv(ev.date)}</td>
                          <td className="px-4 py-3 text-muted-foreground text-xs hidden sm:table-cell">
                            {ev.point ?? <span className="text-muted-foreground/30">Not specified</span>}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-xs text-muted-foreground">{ev.total}</td>
                          <td className="px-4 py-3 text-right hidden sm:table-cell">
                            {ev.detected > 0
                              ? <span className="font-mono text-xs font-semibold text-amber-700">{ev.detected}</span>
                              : <span className="text-xs text-wur-safe">None</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Sampling events represent distinct official water sample records from EPA UCMR 5.{" "}
                <TrackedAnchor
                  href="https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule"
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="official_source_click"
                  eventParams={{ source: "ucmr5_methodology" }}
                  className="text-wur-teal hover:underline"
                >
                  Learn about UCMR 5 methodology ↗
                </TrackedAnchor>
              </p>
            </section>
          )}

          {/* PFAS monitoring — all below MRL */}
          {totalPfasRecords > 0 && pfasDetections.length === 0 && (
            <section id="pfas-monitoring" className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-wur-safe shrink-0 mt-0.5" />
                <div>
                  <h2 className="font-display text-lg text-foreground mb-2">PFAS Monitoring: No Detections Above MRL (EPA UCMR 5)</h2>
                  <p className="text-sm text-muted-foreground mb-3">
                    EPA UCMR 5 monitoring recorded <strong>{totalPfasRecords} sampling results</strong> for {displayName}. No PFAS compounds were detected above the minimum reporting level in any sample. This means measured concentrations — where present — were below the laboratory&apos;s minimum quantifiable threshold, not necessarily zero.
                  </p>
                  <TrackedLink
                    href={`/pfas-watchlist/utility/${utility.pwsid}`}
                    eventName="internal_record_page_click"
                    eventParams={{ destination: "pfas_watchlist", pwsid: utility.pwsid }}
                    className="text-xs text-wur-teal hover:underline"
                  >
                    View full PFAS monitoring table →
                  </TrackedLink>
                </div>
              </div>
            </section>
          )}

          {/* PFAS detections */}
          {pfasDetections.length > 0 && (
            <section id="pfas-detections">
              <h2 className="font-display text-2xl text-foreground mb-2">PFAS Compounds Detected (EPA UCMR 5)</h2>
              <p className="text-sm text-muted-foreground mb-5">
                Source: <strong>EPA UCMR 5</strong> (Unregulated Contaminant Monitoring Rule 5, 2023–2025). These are compounds detected above the minimum reporting level at a sampling point for this utility. A compound marked <span className="text-wur-danger font-semibold">above MCL</span> was detected at a concentration exceeding the EPA Maximum Contaminant Level finalized in April 2024.
              </p>

              {pfasExceedingMcl.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50/50 p-4 mb-5">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-800 mb-1">
                      {[...new Set(pfasExceedingMcl.map(r => r.analyte.code))].join(", ")} detected above the 2024 EPA MCL threshold in UCMR 5 monitoring
                    </p>
                    <p className="text-xs text-muted-foreground">
                      This is EPA UCMR 5 surveillance data — not a regulatory compliance finding. The EPA&apos;s April 2024 PFAS rule set MCLs for PFOA (4 ppt), PFOS (4 ppt), PFNA/PFHxS/HFPO-DA (10 ppt), but water systems have until <strong>April 2029</strong> to achieve compliance. Detection above an MCL level in UCMR 5 monitoring does not constitute a violation under current regulations.
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-lg border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Compound</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Code</th>
                      <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Result</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">EPA MCL</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden lg:table-cell">Sample date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden xl:table-cell">Sample point</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pfasDetections.map((r, i) => {
                      const resultPpt = parseFloat(r.raw_result_value) * 1000;
                      const exceedsMcl = r.analyte.epa_mcl_ppt != null && resultPpt > r.analyte.epa_mcl_ppt;
                      const fmt = (d: Date) =>
                        new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

                      return (
                        <tr key={i} className={`hover:bg-muted/30 transition-colors ${exceedsMcl ? "bg-amber-50/30" : "bg-card"}`}>
                          <td className="px-4 py-3 font-medium text-foreground text-xs">
                            <div className="flex items-center gap-1.5">
                              {exceedsMcl && <ShieldAlert className="w-3 h-3 text-amber-600 shrink-0" />}
                              <span>{r.analyte.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-muted-foreground text-xs hidden sm:table-cell">
                            {r.analyte.code}
                          </td>
                          <td className={`px-4 py-3 font-mono text-xs text-right font-semibold ${exceedsMcl ? "text-amber-700" : "text-foreground"}`}>
                            {resultPpt < 1
                              ? `${r.raw_result_value} µg/L`
                              : `${resultPpt.toFixed(1)} ppt`}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                            {r.analyte.epa_mcl_ppt != null
                              ? <span className={exceedsMcl ? "text-amber-700 font-semibold" : ""}>
                                  {r.analyte.epa_mcl_ppt} ppt {exceedsMcl ? "⚠ above" : ""}
                                </span>
                              : <span className="text-muted-foreground/50">No MCL set</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">
                            {fmt(r.sample_date)}
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground hidden xl:table-cell">
                            {r.sample_point ?? <span className="opacity-30">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                <p className="text-xs text-muted-foreground flex-1">
                  Showing {pfasDetections.length} detection{pfasDetections.length !== 1 ? "s" : ""} above MRL from {totalPfasRecords} total UCMR 5 monitoring records.{" "}
                  <TrackedLink
                    href={`/pfas-watchlist/utility/${utility.pwsid}`}
                    eventName="internal_record_page_click"
                    eventParams={{ destination: "pfas_watchlist", pwsid: utility.pwsid }}
                    className="text-wur-teal hover:underline"
                  >
                    View full PFAS monitoring table →
                  </TrackedLink>
                </p>
              </div>
            </section>
          )}

          {/* What this does NOT mean */}
          <section className="rounded-xl border border-border bg-muted/30 p-6">
            <div className="flex items-start gap-3 mb-4">
              <Info className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
              <h2 className="font-display text-lg text-foreground">What this does not mean</h2>
            </div>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/40 mt-0.5">—</span>
                <span><strong className="text-foreground">Violations do not indicate current non-compliance.</strong> A health-based violation that is marked resolved means the utility has returned to compliance per EPA records. Historic violations are shown for transparency, not to imply ongoing risk.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/40 mt-0.5">—</span>
                <span><strong className="text-foreground">PFAS detections above MRL are not themselves violations.</strong> UCMR 5 monitoring is a surveillance program. Detection does not mean the utility violated a regulation. The 2024 EPA PFAS rule (MCLs for PFOA, PFOS, etc.) has a compliance deadline of 2029.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/40 mt-0.5">—</span>
                <span><strong className="text-foreground">This page does not assess health risk.</strong> WaterUtilityReport.com presents official government records — we do not make health risk determinations, safety certifications, or compliance judgments. Consult a licensed water quality specialist or physician for health advice.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-muted-foreground/40 mt-0.5">—</span>
                <span><strong className="text-foreground">Records may be incomplete.</strong> EPA SDWIS and UCMR 5 represent what was reported to the EPA. Not all utilities or contaminants are covered. Small systems (&lt;10,000 people) may not have been required to participate in UCMR 5 monitoring.</span>
              </li>
            </ul>
          </section>

          {/* Independent testing CTA */}
          <section className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-6">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Independent Verification</p>
            <h2 className="font-display text-lg text-foreground mb-2">Get your water tested by a certified lab</h2>
            <p className="text-sm text-muted-foreground mb-4">
              EPA compliance data shows what utilities report to regulators. An independent test from a certified laboratory confirms what is actually coming out of your tap at the point of use. Labs in {utility.state.name} can test for PFAS (EPA Method 533 or 537.1), lead, nitrates, bacteria, and more.
            </p>
            <div className="flex flex-wrap gap-2">
              <TrackedLink
                href={`/labs?state=${utility.state.slug}`}
                eventName="labs_click"
                eventParams={{ from: "records_page", state: utility.state.slug }}
                className="text-xs px-3 py-1.5 rounded-full border border-wur-teal/40 bg-white text-wur-teal hover:bg-teal-50 transition-colors font-medium"
              >
                Find certified labs in {utility.state.name} →
              </TrackedLink>
              <TrackedLink
                href="/treatment/reverse-osmosis"
                eventName="treatment_click"
                eventParams={{ from: "records_page", method: "reverse-osmosis" }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
              >
                PFAS treatment guide
              </TrackedLink>
              <TrackedLink
                href="/treatment"
                eventName="treatment_click"
                eventParams={{ from: "records_page", method: "all" }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
              >
                Browse all treatment options
              </TrackedLink>
            </div>
          </section>

          {/* FAQ */}
          <section id="faq">
            <FaqSection faqs={faqs} title="Official Records FAQs" />
          </section>

          {/* Sources */}
          <section className="rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="font-display text-lg text-foreground mb-4">Official Data Sources</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">EPA SDWIS — Compliance &amp; Violations</p>
                <TrackedAnchor
                  href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="official_source_click"
                  eventParams={{ source: "epa_echo", pwsid: utility.pwsid }}
                  className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline"
                >
                  EPA ECHO: {displayName} Detailed Facility Report <ExternalLink className="w-3 h-3" />
                </TrackedAnchor>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">EPA UCMR 5 — PFAS Monitoring Data</p>
                <TrackedAnchor
                  href="https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule"
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="official_source_click"
                  eventParams={{ source: "ucmr5_methodology" }}
                  className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline"
                >
                  EPA UCMR 5 Program Overview <ExternalLink className="w-3 h-3" />
                </TrackedAnchor>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground mb-1">EPA PFAS Rule (April 2024)</p>
                <TrackedAnchor
                  href="https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas"
                  target="_blank"
                  rel="noopener noreferrer"
                  eventName="official_source_click"
                  eventParams={{ source: "epa_pfas_rule" }}
                  className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline"
                >
                  EPA PFAS in Drinking Water Rule <ExternalLink className="w-3 h-3" />
                </TrackedAnchor>
              </div>
              {(utility.ccr_reports.length > 0 || utility.ccr_url) && (
                <div>
                  <p className="text-xs font-semibold text-foreground mb-1">Consumer Confidence Reports (CCR)</p>
                  <div className="space-y-1">
                    {utility.ccr_reports.map((r) =>
                      r.report_url ? (
                        <TrackedAnchor
                          key={r.report_year}
                          href={r.report_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          eventName="official_source_click"
                          eventParams={{ source: "ccr", year: String(r.report_year), pwsid: utility.pwsid }}
                          className="flex items-center gap-1 text-xs text-wur-teal hover:underline"
                        >
                          {displayName} {r.report_year} Consumer Confidence Report <ExternalLink className="w-3 h-3" />
                        </TrackedAnchor>
                      ) : (
                        <p key={r.report_year} className="text-xs text-muted-foreground">{r.report_year} CCR on file — no direct URL</p>
                      )
                    )}
                    {utility.ccr_url && !utility.ccr_reports.some(r => r.report_url === utility.ccr_url) && (
                      <TrackedAnchor
                        href={utility.ccr_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        eventName="official_source_click"
                        eventParams={{ source: "ccr", year: String(utility.ccr_year ?? ""), pwsid: utility.pwsid }}
                        className="flex items-center gap-1 text-xs text-wur-teal hover:underline"
                      >
                        {displayName} Consumer Confidence Report{utility.ccr_year ? ` ${utility.ccr_year}` : ""} <ExternalLink className="w-3 h-3" />
                      </TrackedAnchor>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Related pages */}
          <section>
            <h2 className="font-display text-lg text-foreground mb-4">Related pages</h2>
            <div className="flex flex-wrap gap-2">
              <TrackedLink
                href={`/utilities/${slug}`}
                eventName="related_utility_click"
                eventParams={{ destination: "utility", slug }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
              >
                {displayName} full report
              </TrackedLink>
              {utility.city_served && !utility.city_served.includes(",") && (
                <TrackedLink
                  href={`/cities/${slugifyCity(utility.city_served)}-${stateAbbr.toLowerCase()}`}
                  eventName="internal_record_page_click"
                  eventParams={{ destination: "city" }}
                  className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
                >
                  {city} water quality overview
                </TrackedLink>
              )}
              <TrackedLink
                href={`/states/${utility.state.slug}`}
                eventName="internal_record_page_click"
                eventParams={{ destination: "state" }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
              >
                {utility.state.name} state report
              </TrackedLink>
              {pfasDetections.length > 0 && (
                <TrackedLink
                  href={`/pfas-watchlist/utility/${utility.pwsid}`}
                  eventName="internal_record_page_click"
                  eventParams={{ destination: "pfas_watchlist" }}
                  className="text-xs px-3 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400 transition-colors"
                >
                  PFAS monitoring records
                </TrackedLink>
              )}
              <TrackedLink
                href={`/labs?state=${utility.state.slug}`}
                eventName="labs_click"
                eventParams={{ from: "records_related" }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
              >
                Certified labs in {utility.state.name}
              </TrackedLink>
              <TrackedLink
                href="/methodology"
                eventName="methodology_click"
                eventParams={{ from: "records_page" }}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
              >
                Data methodology
              </TrackedLink>
            </div>
          </section>

          <DataLimitationsNote />
        </div>
      </div>
    </>
  );
}
