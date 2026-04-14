import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, AlertTriangle, Building2,
  Users, Droplets, FileText, Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import RiskMeter from "@/components/risk-meter";
import RelatedPages from "@/components/related-pages";
import SourcesBlock from "@/components/sources-block";
import JsonLd from "@/components/json-ld";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from "next";

// ISR — render on first request, cache 24h
export const revalidate = 86400;

// Don't pre-build 5700 pages at deploy time
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const utility = await prisma.utility.findUnique({
    where: { slug },
    select: { name: true, population_served: true, risk_level: true, state: { select: { abbreviation: true } } },
  });
  if (!utility) return {};
  return {
    title: `${utility.name} Water Quality Report — ${utility.state.abbreviation}`,
    description: `Water quality report for ${utility.name}. ${utility.population_served.toLocaleString()} residents served. Risk level: ${utility.risk_level}. View PWSID, violations, and treatment guidance.`,
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

  const utility = await prisma.utility.findUnique({
    where: { slug },
    include: {
      state: { select: { name: true, slug: true, abbreviation: true } },
      violations: {
        orderBy: { violation_date: "desc" },
        take: 10,
      },
      utility_contaminants: {
        include: { contaminant: true },
        orderBy: { confidence_score: "desc" },
      },
    },
  });

  if (!utility) notFound();
  if (utility.publish_status !== "published") notFound();

  const openViolations = utility.violations.filter(
    (v) => !v.resolution_date && v.is_health_based
  ).length;

  const relatedPages = [
    {
      href: `/states/${utility.state.slug}`,
      label: `${utility.state.name} State Overview`,
      type: "state" as const,
      description: `All utilities in ${utility.state.abbreviation}`,
    },
  ];

  const sources = [
    {
      label: "EPA SDWIS (Safe Drinking Water Information System)",
      note: `PWSID ${utility.pwsid}`,
      url: `https://enviro.epa.gov/enviro/sdw_report_v3.first_table?pws_id=${utility.pwsid}`,
    },
    {
      label: "EPA ECHO (Enforcement and Compliance History Online)",
      url: `https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`,
    },
  ];

  if (utility.ccr_url) {
    sources.push({
      label: `${utility.name} Consumer Confidence Report${utility.ccr_year ? ` (${utility.ccr_year})` : ""}`,
      url: utility.ccr_url,
    });
  }

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "GovernmentOrganization",
    name: utility.name,
    areaServed: utility.state.name,
    url: utility.website ?? utility.ccr_url ?? undefined,
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={orgJsonLd} />

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
            <span className="text-white/60 truncate">{utility.name}</span>
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
                {utility.name}
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Risk meter */}
            <section className="rounded-xl border border-border bg-card p-6">
              <RiskMeter level={utility.risk_level as "safe" | "low" | "moderate" | "high" | "critical"} />
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
            <section>
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
                      href={`https://enviro.epa.gov/enviro/sdw_report_v3.first_table?pws_id=${utility.pwsid}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-sm text-wur-teal hover:underline"
                    >
                      View on EPA SDWIS <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              )}
            </section>

            {/* Violations */}
            {utility.violations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">Violation History</h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Sourced from EPA SDWIS. Health-based violations indicate the MCL was exceeded.
                </p>
                <div className="space-y-2">
                  {utility.violations.map((v, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                      {v.is_health_based ? (
                        <AlertTriangle className="w-4 h-4 text-wur-warning mt-0.5 shrink-0" />
                      ) : (
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {v.violation_type ?? "Violation"}
                          {v.contaminant_name && ` — ${v.contaminant_name}`}
                        </p>
                        <div className="flex gap-3 mt-1 text-xs text-muted-foreground font-mono">
                          {v.violation_date && <span>{new Date(v.violation_date).getFullYear()}</span>}
                          {v.is_health_based && <span className="text-wur-warning">Health-based</span>}
                          {v.resolution_date ? (
                            <span className="text-wur-safe">Resolved</span>
                          ) : (
                            <span className="text-wur-caution">Open</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <RelatedPages pages={relatedPages} title="Related Pages" />
            <SourcesBlock
              sources={sources}
              lastUpdated={utility.last_verification_date?.toISOString().split("T")[0] ?? utility.ingestion_date?.toISOString().split("T")[0] ?? "2025"}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
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

              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Data Sources</p>
                <div className="space-y-2">
                  <a href={`https://enviro.epa.gov/enviro/sdw_report_v3.first_table?pws_id=${utility.pwsid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-wur-teal hover:underline">
                    EPA SDWIS <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href={`https://echo.epa.gov/detailed-facility-report?fid=${utility.pwsid}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-wur-teal hover:underline">
                    EPA ECHO <ExternalLink className="w-3 h-3" />
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
