import Link from "next/link";
import { ArrowLeft, ExternalLink, Clock, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PFAS Watchlist Data Sources — Water Utility Report",
  description: "Every official government data source used by the PFAS Watchlist, with retrieval dates, URLs, and publication cadence.",
};

export const revalidate = 3600;

const STATIC_SOURCES = [
  {
    id: "epa-ucmr5",
    name: "EPA UCMR 5 Occurrence Data",
    publisher: "U.S. Environmental Protection Agency",
    url: "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5",
    dataUrl: "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5",
    purpose: "Primary PFAS monitoring data source. All displayed PFAS occurrence records originate from this dataset.",
    cadence: "Released by EPA as UCMR 5 monitoring data is finalized. Check EPA page for latest release date.",
    termsNote: "Publicly released U.S. government data.",
    fields: ["PWSID", "PWSName", "State", "AnalyteCode", "AnalyteName", "Result", "Unit", "MRL", "DetectionCondition", "SampleDate", "SamplePointID"],
  },
  {
    id: "epa-sdwis",
    name: "EPA Safe Drinking Water Information System (SDWIS)",
    publisher: "U.S. Environmental Protection Agency",
    url: "https://www.epa.gov/enviro/sdwis-search",
    dataUrl: "https://www.epa.gov/enviro/sdwis-search",
    purpose: "Canonical utility registry. Used to match PWSID to utility name, service area, population served, and system type.",
    cadence: "Ingested quarterly.",
    termsNote: "Publicly released U.S. government data.",
    fields: ["PWSID", "PWSName", "State", "PopulationServed", "ServiceConnections", "PWSType", "OwnerType"],
  },
  {
    id: "epa-echo",
    name: "EPA ECHO — Enforcement and Compliance History Online",
    publisher: "U.S. Environmental Protection Agency",
    url: "https://echo.epa.gov",
    dataUrl: "https://echo.epa.gov",
    purpose: "Supplemental official enforcement context. Referenced by direct link for per-utility official enforcement records.",
    cadence: "Referenced by direct link; not bulk-ingested into this system.",
    termsNote: "Publicly released U.S. government data.",
    fields: ["FacilityID", "ComplianceStatus", "ViolationCodes", "EnforcementActions"],
  },
];

export default async function PfasSourcesPage() {
  // Get last ingest status from DB
  const lastRecord = await prisma.pfasRecord.findFirst({
    orderBy: { source_retrieved_at: "desc" },
    select: { source_retrieved_at: true, source_dataset: true, source_version: true },
  });

  const totalRecords = await prisma.pfasRecord.count({ where: { suppressed: false, validated: true } });
  const suppressedCount = await prisma.pfasRecord.count({ where: { suppressed: true } });
  const failedValidation = await prisma.pfasRecord.count({ where: { validated: false } });

  return (
    <div className="min-h-screen bg-background">

      {/* ── HEADER ── */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/pfas-watchlist" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              PFAS Watchlist
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/60">Sources</span>
          </div>
          <h1 className="font-display text-4xl text-white mb-3">Data Sources</h1>
          <p className="text-white/60 max-w-2xl">
            Every dataset used by the PFAS Watchlist. All sources are official U.S. government publications.
            No commercial, NGO, or non-government sources are used.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">

        {/* Pipeline status */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">Pipeline Status</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Published records",
                value: totalRecords.toLocaleString(),
                icon: CheckCircle2,
                color: "text-wur-safe",
              },
              {
                label: "Suppressed records",
                value: suppressedCount.toLocaleString(),
                icon: Clock,
                color: "text-wur-caution",
              },
              {
                label: "Failed validation",
                value: failedValidation.toLocaleString(),
                icon: Clock,
                color: "text-muted-foreground",
              },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-lg border border-border bg-card p-4 text-center">
                <Icon className={`w-4 h-4 ${color} mx-auto mb-2`} />
                <div className="font-display text-2xl text-foreground mb-1">{value}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          {lastRecord ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              Last source retrieval:{" "}
              <strong className="text-foreground">
                {lastRecord.source_retrieved_at.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </strong>
              {lastRecord.source_dataset && <> · {lastRecord.source_dataset}</>}
              {lastRecord.source_version && <> · v{lastRecord.source_version}</>}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              No records ingested yet. Run{" "}
              <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded">
                npx tsx scripts/ingest-ucmr5.ts
              </code>
              {" "}to load UCMR 5 data.
            </div>
          )}
        </section>

        {/* Source details */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">Official Sources Used</h2>
          <div className="space-y-6">
            {STATIC_SOURCES.map((source) => (
              <div key={source.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-semibold text-foreground">{source.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">{source.publisher}</p>
                    </div>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline shrink-0"
                    >
                      Official source <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{source.purpose}</p>
                </div>
                <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Refresh cadence
                    </p>
                    <p className="text-sm text-foreground">{source.cadence}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                      Terms
                    </p>
                    <p className="text-sm text-foreground">{source.termsNote}</p>
                  </div>
                </div>
                <div className="px-5 pb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                    Key fields used
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {source.fields.map((f) => (
                      <span key={f} className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Disallowed sources */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Disallowed Sources</h2>
          <div className="rounded-lg border border-border bg-secondary/30 p-5">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              The following source types are never used in this watchlist, regardless of their
              content quality or reputation:
            </p>
            <ul className="space-y-1.5">
              {[
                "Commercial databases or data aggregators",
                "Environmental or advocacy NGOs",
                "News stories or journalism",
                "Utility marketing pages or CCR summaries",
                "Crowdsourced or community-contributed data",
                "University or academic summaries (unless republished by a government authority)",
                "Modeled or inferred contamination risk data (unless published by a government authority and clearly labeled as modeled)",
                "Private laboratory result databases or marketplaces",
              ].map((s) => (
                <li key={s} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-wur-danger shrink-0" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Link
            href="/pfas-watchlist"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-wur-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            PFAS Watchlist
          </Link>
          <Link href="/pfas-watchlist/methodology" className="text-sm text-wur-teal hover:underline">
            Read methodology →
          </Link>
        </div>
      </div>
    </div>
  );
}
