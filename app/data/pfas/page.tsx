import Link from "next/link";
import { AlertTriangle, ExternalLink, Info, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getStatePfasSummary } from "@/lib/data/pfas-state";
import JsonLd from "@/components/json-ld";
import Methodology from "./[state]/_components/Methodology";
import StateTable, { type StateRow } from "./_components/StateTable";
import CitationBlock from "./[state]/_components/CitationBlock";
import type { Metadata } from "next";

export const revalidate = 86400;

const BASE = "https://waterutilityreport.com";

export async function generateMetadata(): Promise<Metadata> {
  const currentYear = new Date().getFullYear();
  const title = `PFAS in U.S. Drinking Water: ${currentYear} State-by-State Data | Water Utility Report`;
  const description =
    `EPA UCMR 5 PFAS monitoring records for public water systems across all 50 states, ` +
    `covering 29 PFAS compounds sampled 2023–2025. State-by-state detection data, ` +
    `downloadable CSVs, and citation-ready references for journalists and researchers.`;
  return {
    title,
    description,
    alternates: { canonical: `${BASE}/data/pfas` },
    openGraph: { title, description, url: `${BASE}/data/pfas`, type: "website" },
    twitter: { card: "summary_large_image", title, description },
    robots: "index, follow",
  };
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

export default async function PfasHubPage() {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentYear = new Date().getFullYear();

  // States that have PFAS data
  const statesWithData = await prisma.state.findMany({
    where: {
      utilities: {
        some: { pfas_records: { some: { validated: true, suppressed: false } } },
      },
    },
    select: { slug: true },
    orderBy: { name: "asc" },
  });

  // Fetch all state summaries in parallel
  const rawSummaries = await Promise.all(
    statesWithData.map((s) => getStatePfasSummary(s.slug))
  );
  const summaries = rawSummaries.filter(Boolean) as NonNullable<typeof rawSummaries[number]>[];

  // National aggregate stats
  const totalUtilitiesTested = summaries.reduce((s, r) => s + r.utilities_tested, 0);
  const totalWithDetections = summaries.reduce((s, r) => s + r.utilities_with_any_detection, 0);
  const totalAboveAnyMcl = summaries.reduce((s, r) => s + r.utilities_above_any_mcl, 0);

  const rows: StateRow[] = summaries.map((s) => ({
    state: s.state,
    utilities_tested: s.utilities_tested,
    utilities_with_any_detection: s.utilities_with_any_detection,
    utilities_above_pfoa_mcl: s.utilities_above_pfoa_mcl,
    utilities_above_pfos_mcl: s.utilities_above_pfos_mcl,
    utilities_above_any_mcl: s.utilities_above_any_mcl,
    latest_sample_date: s.latest_sample_date,
  }));

  const pageUrl = `${BASE}/data/pfas`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "PFAS Data", item: pageUrl },
    ],
  };

  const datasetJsonLd = {
    "@context": "https://schema.org",
    "@type": ["Dataset", "CollectionPage"],
    name: "PFAS in U.S. Drinking Water — EPA UCMR 5 State-by-State Monitoring Records",
    description:
      `State-by-state EPA UCMR 5 PFAS monitoring records for ${fmt(totalUtilitiesTested)} public water ` +
      `utilities across ${summaries.length} states, covering 29 PFAS compounds sampled 2023–2025. ` +
      `Includes downloadable CSVs and citation-ready references.`,
    url: pageUrl,
    identifier: "waterutilityreport-pfas-hub",
    keywords: ["PFAS", "drinking water", "UCMR 5", "EPA", "water quality", "United States"],
    creator: { "@type": "Organization", name: "Water Utility Report", url: BASE },
    publisher: { "@type": "Organization", name: "Water Utility Report", url: BASE },
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
    temporalCoverage: "2023/2025",
    spatialCoverage: { "@type": "Place", name: "United States", address: { "@type": "PostalAddress", addressCountry: "US" } },
    distribution: summaries.map((s) => ({
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${BASE}/data/pfas/${s.state.slug}/data.csv`,
      name: `PFAS data for ${s.state.name} (CSV)`,
    })),
    hasPart: summaries.map((s) => ({
      "@type": "Dataset",
      name: `PFAS in ${s.state.name} Drinking Water — EPA UCMR 5 Monitoring Records`,
      url: `${BASE}/data/pfas/${s.state.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={datasetJsonLd} />

      {/* ── HERO ── */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/60">PFAS Data</span>
          </div>
          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            EPA UCMR 5 PFAS Monitoring Data
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-2 leading-tight">
            PFAS in U.S. Drinking Water
          </h1>
          <p className="text-white/60 text-sm mb-4">
            State-by-state detection data from EPA monitoring (2023–2025)
          </p>
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
          Under the EPA&apos;s Fifth Unregulated Contaminant Monitoring Rule (UCMR 5), public water
          systems serving more than 3,300 people are required to test for 29 PFAS compounds between
          2023 and 2025. This page indexes monitoring results for{" "}
          <strong className="text-foreground">{summaries.length} states</strong> and{" "}
          <strong className="text-foreground">{fmt(totalUtilitiesTested)} water utilities</strong>,
          drawn directly from EPA&apos;s published occurrence data. Each state page provides full
          detection-level data, a downloadable CSV, and citable references for further reporting and
          research.
        </p>

        {/* National at-a-glance */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: "States with PFAS data", value: fmt(summaries.length) },
            { label: "Utilities tested", value: fmt(totalUtilitiesTested) },
            { label: "With any detection", value: fmt(totalWithDetections) },
            {
              label: "Above any MCL",
              value: fmt(totalAboveAnyMcl),
              highlight: totalAboveAnyMcl > 0,
            },
          ].map(({ label, value, highlight }) => (
            <div key={label} className="rounded-lg border border-border bg-card p-5 text-center">
              <div className={`font-display text-2xl mb-1 ${highlight ? "text-amber-700" : "text-foreground"}`}>
                {value}
              </div>
              <div className="text-xs text-muted-foreground leading-snug">{label}</div>
            </div>
          ))}
        </div>

        {/* State table */}
        <div className="mb-10">
          <h2 className="font-display text-xl text-foreground mb-4">
            All states — PFAS monitoring summary
          </h2>
          <StateTable rows={rows} />
          <p className="mt-3 text-xs text-muted-foreground">
            Default sort: utilities above any individual MCL, descending. Click any column header to
            sort. MCL = EPA Maximum Contaminant Level (PFOA/PFOS: 4 ng/L; PFNA/PFHxS/HFPO-DA: 10
            ng/L), finalized April 2024.
          </p>
        </div>

        {/* State grid / quick nav */}
        <div className="mb-10">
          <h2 className="font-display text-xl text-foreground mb-4">Browse by state</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {summaries
              .slice()
              .sort((a, b) => a.state.name.localeCompare(b.state.name))
              .map((s) => (
                <Link
                  key={s.state.slug}
                  href={`/data/pfas/${s.state.slug}`}
                  className="flex items-center justify-between gap-1.5 rounded-lg border border-border bg-card px-3 py-2.5 hover:border-wur-teal/40 hover:bg-wur-teal/5 transition-colors group"
                >
                  <span className="text-sm text-foreground group-hover:text-wur-teal transition-colors truncate">
                    {s.state.name}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                    {s.state.code}
                  </span>
                </Link>
              ))}
          </div>
        </div>

        {/* Methodology */}
        <div className="mb-10">
          <Methodology />
        </div>

        {/* Citation block — hub-specific */}
        <div className="mb-10">
          <CitationBlock
            stateName="U.S."
            stateSlug=""
            latestSampleDate={null}
            hubMode
          />
        </div>

        {/* Data limitations */}
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <div className="flex items-start gap-2.5">
            <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Detection levels represent results from EPA-required monitoring at the time of sampling.
              They are not a real-time indicator of current water quality. Utilities may have taken
              corrective action or installed treatment after sampling. For current information about
              your water, contact your utility or consult your annual Consumer Confidence Report.
            </p>
          </div>
        </div>

        {/* External links */}
        <div className="mt-8 flex flex-wrap gap-4 text-xs">
          <a
            href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-wur-teal hover:underline"
          >
            EPA UCMR 5 source data <ExternalLink className="w-3 h-3" />
          </a>
          <Link href="/pfas-watchlist" className="text-wur-teal hover:underline">
            PFAS Watchlist
          </Link>
          <Link href="/pfas-watchlist/methodology" className="text-wur-teal hover:underline">
            Methodology
          </Link>
        </div>
      </div>
    </div>
  );
}
