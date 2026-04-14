import Link from "next/link";
import { ArrowLeft, ExternalLink, CheckCircle2, Clock, RefreshCw, Database } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources — Water Utility Report Methodology",
  description:
    "Full list of datasets ingested by Water Utility Report, with source URLs, update cadences, and ingestion status for each official data source.",
};

const dataSources = [
  {
    name: "EPA SDWIS — Safe Drinking Water Information System",
    category: "Core Utility Data",
    url: "https://sdwis.epa.gov/",
    fields: ["Public Water System ID (PWSID)", "Utility name", "System type", "Population served", "Violation records", "Enforcement actions"],
    cadence: "Quarterly",
    format: "CSV / API",
    licenseStatus: "Public Domain — federal government data",
    notes: "Primary source for utility identity and compliance data. All utility pages use PWSID as the canonical system identifier.",
  },
  {
    name: "EPA ECHO — Enforcement and Compliance History Online",
    category: "Compliance & Enforcement",
    url: "https://echo.epa.gov/",
    fields: ["Violation details", "Enforcement actions", "Compliance schedules", "Health-based violation flags", "Resolution dates"],
    cadence: "Weekly (ECHO refreshes frequently)",
    format: "CSV / API",
    licenseStatus: "Public Domain — federal government data",
    notes: "Used for violation severity classification and health-based vs. monitoring violation distinction.",
  },
  {
    name: "Consumer Confidence Reports (CCRs)",
    category: "Contaminant Detection Data",
    url: "https://www.epa.gov/ccr",
    fields: ["Detected contaminant levels", "MCL comparisons", "Source water information", "Treatment summaries"],
    cadence: "Annual (utilities publish by July 1 each year)",
    format: "PDF / HTML (utility-published)",
    licenseStatus: "Public record — annual reports required by SDWA",
    notes: "Primary source for contaminant level data shown on utility pages. Ingestion requires PDF parsing; confidence score reflects parse quality.",
  },
  {
    name: "EPA Water Quality Portal",
    category: "Sampling Data",
    url: "https://www.waterqualitydata.us/",
    fields: ["Sampling event records", "Lab result values", "Sample location coordinates", "Analytical methods used"],
    cadence: "Continuous (portal aggregates from federal + state agencies)",
    format: "API / CSV",
    licenseStatus: "Public Domain — federal/state government data",
    notes: "Used as supplemental source for contaminant data where CCR parsing yields low confidence. Cross-referenced against CCR data.",
  },
  {
    name: "State Drinking Water Program Datasets",
    category: "State-Level Data",
    url: "https://www.epa.gov/ground-water-and-drinking-water",
    fields: ["State-specific utility details", "Service area boundaries (where available)", "State MCLs where stricter than federal"],
    cadence: "Varies by state — annual to real-time",
    format: "Varies by state (CSV, API, GIS)",
    licenseStatus: "Public records — verified per state terms before ingestion",
    notes: "Not all states publish granular datasets. Terms verified before ingestion. California, Texas, and Florida have robust open datasets.",
  },
  {
    name: "EPA and CDC Health Guidance Documents",
    category: "Health Reference Data",
    url: "https://www.epa.gov/ground-water-and-drinking-water",
    fields: ["MCL values", "MCLG values", "Health effect descriptions", "Treatment technique requirements"],
    cadence: "As published (regulatory updates)",
    format: "HTML / PDF",
    licenseStatus: "Public Domain — federal government publications",
    notes: "Source for all regulatory limits, MCLG values, and health-effect language on contaminant pages. Changes tracked with versioning.",
  },
  {
    name: "U.S. Census Bureau — TIGER/Line Shapefiles",
    category: "Geography & Population",
    url: "https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html",
    fields: ["ZIP code tabulation areas (ZCTAs)", "City/place boundaries", "Population estimates", "County boundaries"],
    cadence: "Annual (TIGER updates; ACS population annual)",
    format: "Shapefile / GeoJSON",
    licenseStatus: "Public Domain — federal government data",
    notes: "Used for ZIP→utility matching (spatial join of ZCTA polygons with utility service area boundaries). Match confidence reflects overlap percentage.",
  },
  {
    name: "NELAP / State Lab Certification Databases",
    category: "Lab Directory",
    url: "https://www.epa.gov/dwlabcert",
    fields: ["Lab name", "NELAP accreditation status", "State certifications", "Analyte scopes"],
    cadence: "Manually verified — labs are not in a single machine-readable federal dataset",
    format: "HTML (state program pages)",
    licenseStatus: "Public record — state-published certification lists",
    notes: "Lab entries are manually verified from state certification pages. Labs are flagged for re-verification annually. Not a comprehensive directory.",
  },
];

const statusBadge = (cadence: string) => {
  if (cadence.startsWith("Annual")) return { label: "Annual", color: "text-wur-safe bg-wur-safe-bg border-wur-safe-border" };
  if (cadence.startsWith("Quarterly")) return { label: "Quarterly", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
  if (cadence.startsWith("Weekly") || cadence.startsWith("Continuous")) return { label: "Frequent", color: "text-wur-teal bg-wur-teal/8 border-wur-teal/20" };
  return { label: "Manual", color: "text-wur-caution bg-wur-caution-bg border-wur-caution-border" };
};

export default function DataSourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Methodology
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Methodology</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Data Sources
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            Every dataset ingested by Water Utility Report, with source URLs, update
            cadences, data formats, and license status. Updated when ingestion pipelines change.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
        {/* Summary stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Data Sources", value: dataSources.length, icon: Database },
            { label: "Public Domain", value: "7/8", icon: CheckCircle2 },
            { label: "Refresh Cadences", value: "4", icon: RefreshCw },
            { label: "Prohibited Sources", value: "5", icon: Clock },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-5 rounded-xl border border-border bg-card text-center">
              <Icon className="w-4 h-4 text-wur-teal mx-auto mb-2" />
              <p className="font-display text-2xl text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Source cards */}
        {dataSources.map((source, i) => {
          const badge = statusBadge(source.cadence);
          return (
            <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{source.category}</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>
                    <h2 className="font-semibold text-foreground text-lg">{source.name}</h2>
                  </div>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-wur-teal hover:underline shrink-0"
                  >
                    Source <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Update Cadence</p>
                    <p className="text-foreground">{source.cadence}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Format</p>
                    <p className="text-foreground">{source.format}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">License</p>
                    <p className="text-foreground text-xs leading-relaxed">{source.licenseStatus}</p>
                  </div>
                </div>

                {/* Fields */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Fields Ingested</p>
                  <div className="flex flex-wrap gap-1.5">
                    {source.fields.map((field, j) => (
                      <span
                        key={j}
                        className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground font-mono"
                      >
                        {field}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/30 rounded-lg p-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wur-teal mt-0.5 shrink-0" />
                  <p className="leading-relaxed">{source.notes}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Back link */}
        <div className="pt-4 border-t border-border flex gap-6">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Methodology
          </Link>
          <Link
            href="/methodology/legal"
            className="inline-flex items-center gap-1.5 text-sm text-wur-teal hover:underline transition-colors"
          >
            Legal & Usage Boundaries →
          </Link>
        </div>
      </div>
    </div>
  );
}
