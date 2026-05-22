import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Info,
  Download,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStatePfasData } from "@/lib/data/pfas-state";
import JsonLd from "@/components/json-ld";
import Methodology from "./_components/Methodology";
import UtilitiesTable from "./_components/UtilitiesTable";
import CitationBlock from "./_components/CitationBlock";
import type { Metadata } from "next";

export const revalidate = 86400;
export const dynamicParams = false;

const BASE = "https://waterutilityreport.com";

// ── Static params — all states with PFAS data ──────────────────────────────────

export async function generateStaticParams() {
  const states = await prisma.state.findMany({
    where: {
      utilities: {
        some: {
          pfas_records: { some: { validated: true, suppressed: false } },
        },
      },
    },
    select: { slug: true },
  });
  return states.map((s) => ({ state: s.slug }));
}

// ── Metadata ───────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const data = await getStatePfasData(stateSlug);
  if (!data) return {};

  const { state, summary } = data;
  const currentYear = new Date().getFullYear();
  const title = `PFAS in ${state.name} Drinking Water: ${currentYear} Data & Statistics`;
  const description =
    `EPA monitoring data shows ${summary.utilities_with_any_detection.toLocaleString()} ` +
    `utilities in ${state.name} with PFAS detections, including ` +
    `${summary.utilities_above_pfoa_mcl.toLocaleString()} above the federal PFOA Maximum ` +
    `Contaminant Level of 4 ng/L. Data from EPA UCMR 5 (2023–2025).`;
  const url = `${BASE}/data/pfas/${state.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots:
      summary.total_records > 0 ? "index, follow" : "noindex, follow",
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function fmtYear(d: string | null) {
  return d ? String(new Date(d).getUTCFullYear()) : "—";
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function StatePfasPage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const data = await getStatePfasData(stateSlug);
  if (!data) notFound();

  const { state, summary, top_detections, analyte_breakdown, all_utilities } = data;
  const pageUrl = `${BASE}/data/pfas/${state.slug}`;
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "PFAS Data", item: `${BASE}/data/pfas` },
      { "@type": "ListItem", position: 3, name: `${state.name} PFAS Data`, item: pageUrl },
    ],
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `PFAS in ${state.name} Drinking Water — EPA UCMR 5 Monitoring Records`,
    description:
      `EPA UCMR 5 PFAS monitoring records for ${summary.total_utilities_tested} public water ` +
      `utilities in ${state.name}. Includes ${summary.total_records.toLocaleString()} records ` +
      `covering 29 PFAS compounds sampled between ${fmtYear(summary.earliest_sample_date)} and ` +
      `${fmtYear(summary.latest_sample_date)}.`,
    url: pageUrl,
    identifier: `waterutilityreport-pfas-${state.slug}`,
    keywords: ["PFAS", "drinking water", "UCMR 5", "EPA", state.name, "water quality"],
    creator: {
      "@type": "Organization",
      name: "Water Utility Report",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "Water Utility Report",
      url: BASE,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    isBasedOn: {
      "@type": "Dataset",
      name: "EPA UCMR 5 Occurrence Data",
      url: "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5",
      publisher: {
        "@type": "GovernmentOrganization",
        name: "U.S. Environmental Protection Agency",
      },
    },
    temporalCoverage: `${fmtYear(summary.earliest_sample_date)}/${fmtYear(summary.latest_sample_date)}`,
    spatialCoverage: {
      "@type": "Place",
      name: state.name,
      address: { "@type": "PostalAddress", addressRegion: state.code, addressCountry: "US" },
    },
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${pageUrl}/data.csv`,
        name: `PFAS data for ${state.name} (CSV)`,
      },
    ],
    measurementTechnique: "EPA UCMR 5 required sampling protocol",
    variableMeasured: "PFAS compound concentrations in public drinking water (ng/L)",
  };

  // ── No-data state ────────────────────────────────────────────────────────────
  if (summary.total_records === 0) {
    return (
      <div className="min-h-screen bg-background">
        <JsonLd data={breadcrumbJsonLd} />
        <section className="bg-wur-ink text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-4">
              <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">Home</Link>
              <span className="text-white/20">/</span>
              <Link href="/data/pfas" className="text-xs text-white/40 hover:text-white/70 transition-colors">PFAS Data</Link>
              <span className="text-white/20">/</span>
              <span className="text-xs text-white/60">{state.code}</span>
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
              Limited Data Available
            </p>
            <h1 className="font-display text-3xl sm:text-4xl text-white mb-3">
              PFAS in {state.name} Drinking Water
            </h1>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start gap-3 bg-secondary border border-border rounded-lg p-5 max-w-2xl">
            <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">
                No qualifying official PFAS records located for {state.name}
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                EPA UCMR 5 sampling for {state.name} water systems is incomplete or
                unreported in the current dataset. This does not establish that PFAS are absent
                — it means no qualifying record was found in the datasets this page uses.
              </p>
              <div className="mt-3 flex gap-4 text-xs">
                <a
                  href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-wur-teal hover:underline"
                >
                  EPA UCMR 5 data <ExternalLink className="w-3 h-3" />
                </a>
                <Link href="/pfas-watchlist" className="text-wur-teal hover:underline">
                  PFAS Watchlist
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Top analytes for CSS bar chart (by detection count)
  const topAnalytes = analyte_breakdown.slice(0, 8);
  const maxDetections = Math.max(...topAnalytes.map((a) => a.detections), 1);

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={datasetJsonLd} />

      {/* ── HERO ── */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <Link
              href="/pfas-watchlist"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              PFAS Watchlist
            </Link>
            <span className="text-white/20">/</span>
            <Link
              href={`/pfas-watchlist/${state.slug}`}
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              {state.code}
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/60">Data</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            EPA UCMR 5 PFAS Monitoring Data
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-2 leading-tight">
            PFAS in {state.name} Drinking Water
          </h1>
          <p className="text-white/60 text-sm mb-4">
            Detection data from EPA UCMR 5 monitoring ({fmtYear(summary.earliest_sample_date)}–
            {fmtYear(summary.latest_sample_date)})
          </p>

          {/* Last updated badge */}
          <span className="inline-flex items-center text-xs font-mono bg-white/10 text-white/70 px-3 py-1 rounded-full">
            Last updated: {today}
          </span>
        </div>
      </section>

      {/* ── DISCLOSURE BAR ── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              Monitoring results are <strong>not compliance determinations</strong>. Detection levels
              reflect a specific sample point and date. Utilities may have taken corrective action
              after sampling.{" "}
              <Link
                href="/pfas-watchlist/methodology"
                className="underline hover:text-amber-900 transition-colors"
              >
                Methodology
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Intro paragraph */}
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl mb-10">
          Under the EPA&apos;s Fifth Unregulated Contaminant Monitoring Rule (UCMR 5), public
          water systems are required to test for 29 PFAS compounds between 2023 and 2025. This
          page summarizes the monitoring results reported for{" "}
          <strong className="text-foreground">{fmt(summary.total_utilities_tested)}</strong>{" "}
          water utilities in {state.name}, drawn directly from EPA&apos;s published occurrence
          data.{" "}
          <strong className="text-foreground">
            {fmt(summary.utilities_above_any_mcl)}
          </strong>{" "}
          {summary.utilities_above_any_mcl > 0
            ? "utilities reported one or more samples above an EPA Maximum Contaminant Level for PFOA, PFOS, PFNA, PFHxS, or HFPO-DA."
            : "utilities in this dataset reported samples above an EPA Maximum Contaminant Level."}
        </p>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── MAIN (2/3) ── */}
          <div className="lg:col-span-2 space-y-10">

            {/* Top detections table */}
            <div>
              <h2 className="font-display text-xl text-foreground mb-4">
                Highest PFOA / PFOS detections reported
              </h2>

              {top_detections.length === 0 ? (
                <div className="rounded-lg border border-border bg-card p-5 text-sm text-muted-foreground">
                  No PFOA or PFOS detections above MRL found for {state.name} utilities in the
                  current dataset.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto rounded-lg border border-border bg-white">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-secondary/50">
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Utility
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                            City
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                            Population
                          </th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Analyte
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Value (ng/L)
                          </th>
                          <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                            Sample date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {top_detections.map((d, i) => (
                          <tr
                            key={`${d.pwsid}-${d.analyte_code}-${i}`}
                            className="hover:bg-secondary/30 transition-colors"
                          >
                            <td className="px-4 py-3.5">
                              <Link
                                href={`/utilities/${d.utility_slug}`}
                                className="text-sm font-medium text-foreground hover:text-wur-teal transition-colors"
                              >
                                {d.utility_name}
                              </Link>
                              <div className="text-xs font-mono text-muted-foreground mt-0.5">
                                {d.pwsid}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell text-xs text-muted-foreground">
                              {d.city ?? "—"}
                            </td>
                            <td className="px-4 py-3.5 text-right hidden md:table-cell text-xs text-muted-foreground font-mono">
                              {fmt(d.population_served)}
                            </td>
                            <td className="px-4 py-3.5">
                              <span className="font-mono text-xs font-semibold text-wur-teal">
                                {d.analyte_code}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span
                                  className={`font-mono text-xs font-semibold ${
                                    d.measured_value_ng_l > 4
                                      ? "text-amber-700"
                                      : "text-foreground"
                                  }`}
                                >
                                  {d.measured_value_ng_l.toFixed(2)}
                                </span>
                                {d.measured_value_ng_l > 4 && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                    Above MCL
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3.5 text-right hidden lg:table-cell text-xs text-muted-foreground">
                              {new Date(d.sample_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                timeZone: "UTC",
                              })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Source: EPA UCMR 5 occurrence data. Detection levels reflect a single sample
                    at a specific point in the system on the date shown. The EPA&apos;s Maximum
                    Contaminant Level for PFOA and PFOS is 4 ng/L (finalized April 2024,
                    compliance required by 2029).{" "}
                    <a
                      href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-0.5 text-wur-teal hover:underline"
                    >
                      EPA UCMR 5 <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </>
              )}
            </div>

            {/* Analyte breakdown bars */}
            {topAnalytes.length > 0 && (
              <div>
                <h2 className="font-display text-xl text-foreground mb-4">
                  PFAS analytes — detection breakdown
                </h2>
                <div className="rounded-lg border border-border bg-card p-5 space-y-3">
                  {topAnalytes.map((a) => {
                    const barPct =
                      maxDetections > 0
                        ? Math.round((a.detections / maxDetections) * 100)
                        : 0;
                    return (
                      <div key={a.analyte_code}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-wur-teal w-16 shrink-0">
                              {a.analyte_code}
                            </span>
                            <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-48">
                              {a.analyte_name}
                            </span>
                            {a.epa_mcl_ppt && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700 shrink-0">
                                MCL {a.epa_mcl_ppt} ppt
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground font-mono shrink-0 ml-2">
                            {fmt(a.detections)} / {fmt(a.total_records)}
                          </span>
                        </div>
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${barPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  <p className="text-[11px] text-muted-foreground pt-1">
                    Detections / total records per analyte. All 29 UCMR 5 analytes shown where
                    records exist for {state.name}.
                  </p>
                </div>
              </div>
            )}

            {/* Full utilities table */}
            <UtilitiesTable utilities={all_utilities} stateCode={state.code} />

            {/* Methodology */}
            <Methodology />

            {/* Citation */}
            <CitationBlock
              stateName={state.name}
              stateSlug={state.slug}
              latestSampleDate={summary.latest_sample_date}
            />

            {/* Data limitations */}
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <div className="flex items-start gap-2.5">
                <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Detection levels represent results from EPA-required compliance monitoring at
                  the time of sampling. They are not a real-time indicator of current water
                  quality. Utilities may have taken corrective action or installed treatment after
                  sampling. For current information about your water, contact your utility or
                  consult your annual Consumer Confidence Report.
                </p>
              </div>
            </div>
          </div>

          {/* ── SIDEBAR (1/3) ── */}
          <div className="space-y-4">

            {/* At-a-glance stats */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">At a Glance</h3>
              <div className="space-y-3">
                {[
                  {
                    label: "Utilities tested",
                    value: fmt(summary.total_utilities_tested),
                    sub: null,
                  },
                  {
                    label: "Total PFAS records",
                    value: fmt(summary.total_records),
                    sub: null,
                  },
                  {
                    label: "With detections",
                    value: fmt(summary.utilities_with_any_detection),
                    sub: `of ${fmt(summary.total_utilities_tested)}`,
                    highlight: summary.utilities_with_any_detection > 0,
                  },
                  {
                    label: "Above PFOA MCL (4 ng/L)",
                    value: fmt(summary.utilities_above_pfoa_mcl),
                    sub: `of ${fmt(summary.total_utilities_tested)}`,
                    highlight: summary.utilities_above_pfoa_mcl > 0,
                  },
                  {
                    label: "Above PFOS MCL (4 ng/L)",
                    value: fmt(summary.utilities_above_pfos_mcl),
                    sub: `of ${fmt(summary.total_utilities_tested)}`,
                    highlight: summary.utilities_above_pfos_mcl > 0,
                  },
                  {
                    label: "Above any individual MCL",
                    value: fmt(summary.utilities_above_any_mcl),
                    sub: `PFOA, PFOS, PFNA, PFHxS, or HFPO-DA`,
                    highlight: summary.utilities_above_any_mcl > 0,
                  },
                ].map(({ label, value, sub, highlight }) => (
                  <div key={label} className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground leading-snug">{label}</p>
                      {sub && (
                        <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold font-mono shrink-0 ${
                        highlight ? "text-amber-700" : "text-foreground"
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Earliest sample</span>
                  <span className="font-mono">{fmtDate(summary.earliest_sample_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Latest sample</span>
                  <span className="font-mono">{fmtDate(summary.latest_sample_date)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-1">Raw data</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Download all {fmt(summary.total_records)} records for {state.name} as CSV.
              </p>
              <a
                href={`/data/pfas/${state.slug}/data.csv`}
                className="flex items-center justify-center gap-2 text-xs text-wur-teal border border-wur-teal/30 rounded-md px-3 py-2 hover:bg-wur-teal/5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download CSV ({fmt(summary.total_records)} records)
              </a>
            </div>

            {/* Quick links */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Quick links</h3>
              <div className="space-y-2">
                <Link
                  href={`/pfas-watchlist/${state.slug}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors py-0.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  {state.name} PFAS Watchlist
                </Link>
                <Link
                  href={`/states/${state.slug}`}
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors py-0.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  {state.name} utilities directory
                </Link>
                <Link
                  href="/pfas-watchlist/methodology"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors py-0.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  PFAS Watchlist methodology
                </Link>
                <Link
                  href="/contaminants/pfas"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors py-0.5"
                >
                  <ArrowRight className="w-3 h-3 shrink-0" />
                  PFAS contaminant overview
                </Link>
                <a
                  href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group hover:text-wur-teal transition-colors py-0.5"
                >
                  <span className="text-xs text-muted-foreground group-hover:text-wur-teal flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 shrink-0" />
                    EPA UCMR 5 source data
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-wur-teal shrink-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FOOTER NAV ── */}
      <section className="py-8 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/pfas-watchlist"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-wur-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            PFAS Watchlist
          </Link>
          <Link
            href={`/pfas-watchlist/${state.slug}`}
            className="inline-flex items-center gap-2 text-sm text-wur-teal hover:underline"
          >
            {state.name} PFAS records
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
