import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  CheckCircle2,
  XCircle,
  FileText,
  Users,
  Droplets,
  Building2,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pwsid: string }>;
}): Promise<Metadata> {
  const { pwsid } = await params;
  const utility = await prisma.utility.findUnique({
    where: { pwsid: pwsid.toUpperCase() },
    select: { name: true, pwsid: true },
  });
  if (!utility) return {};
  return {
    title: `${normalizeName(utility.name)} PFAS Records — Official EPA Monitoring Data`,
    description: `Official EPA UCMR 5 PFAS monitoring records for ${normalizeName(utility.name)} (PWSID: ${utility.pwsid}). Source-backed, no inferred risk scores.`,
  };
}

export default async function PfasUtilityPage({
  params,
}: {
  params: Promise<{ pwsid: string }>;
}) {
  const { pwsid: rawPwsid } = await params;
  const pwsid = rawPwsid.toUpperCase();

  const [utility, pfasRecords, officialStatuses] = await Promise.all([
    prisma.utility.findUnique({
      where: { pwsid },
      select: {
        slug: true,
        name: true,
        pwsid: true,
        population_served: true,
        service_type: true,
        ownership_type: true,
        city_served: true,
        county_served: true,
        state: { select: { name: true, abbreviation: true, slug: true } },
      },
    }),
    prisma.pfasRecord.findMany({
      where: { pwsid, suppressed: false, validated: true },
      include: { analyte: { select: { code: true, name: true } } },
      orderBy: [{ sample_date: "desc" }, { analyte: { code: "asc" } }],
    }),
    prisma.pfasOfficialStatus.findMany({
      where: { pwsid },
      orderBy: { effective_date: "desc" },
    }),
  ]);

  // Utility must be in our DB OR have PFAS records to show this page
  if (!utility && pfasRecords.length === 0) notFound();

  const detections = pfasRecords.filter((r) =>
    r.raw_detection_flag === "Detected above MRL"
  );
  const nonDetects = pfasRecords.filter((r) =>
    r.raw_detection_flag.toLowerCase().includes("not detected")
  );

  const mostRecentRetrieval = pfasRecords.reduce<Date | null>((latest, r) => {
    if (!latest || r.source_retrieved_at > latest) return r.source_retrieved_at;
    return latest;
  }, null);

  const stateSlug = utility?.state?.slug;
  const utilityName = utility ? normalizeName(utility.name) : pwsid;

  return (
    <div className="min-h-screen bg-background">

      {/* ── HEADER ── */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <Link href="/pfas-watchlist" className="text-xs text-white/40 hover:text-white/70 transition-colors">PFAS Watchlist</Link>
            {utility?.state && stateSlug && (
              <>
                <span className="text-white/20">/</span>
                <Link href={`/pfas-watchlist/${stateSlug}`} className="text-xs text-white/40 hover:text-white/70 transition-colors">
                  {utility.state.abbreviation}
                </Link>
              </>
            )}
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/60 font-mono">{pwsid}</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            Official PFAS Records — {utility?.state?.abbreviation ?? ""}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-2 leading-tight">
            {utilityName}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-3">
            <span className="text-xs font-mono bg-white/10 px-2.5 py-1 rounded-full text-white/70">
              PWSID: {pwsid}
            </span>
            {utility?.city_served && (
              <span className="text-xs text-white/50">{utility.city_served}</span>
            )}
            {utility && (
              <Link
                href={`/utilities/${utility.slug}`}
                className="text-xs text-wur-aqua hover:underline inline-flex items-center gap-1"
              >
                View full utility profile <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          {mostRecentRetrieval && (
            <p className="text-xs text-white/35 font-mono mt-3">
              Source data retrieved:{" "}
              {mostRecentRetrieval.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </section>

      {/* ── DISCLOSURE ── */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-800">
              UCMR 5 monitoring results are <strong>not compliance determinations</strong>. Detection does not
              imply regulatory violation or health risk determination.{" "}
              <Link href="/pfas-watchlist/methodology" className="underline hover:text-amber-900">
                Methodology
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── MAIN: PFAS RECORDS TABLE ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Summary */}
            <div className="p-5 rounded-lg border border-border bg-card">
              <h2 className="font-semibold text-foreground mb-2">Official Record Summary</h2>
              {pfasRecords.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No qualifying official PFAS record was located in the current allowed government
                  datasets for this water system.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Official EPA monitoring records show{" "}
                  <strong className="text-foreground">{pfasRecords.length} PFAS result{pfasRecords.length !== 1 ? "s" : ""}</strong>
                  {" "}for this water system in the UCMR 5 dataset.
                  {detections.length > 0 && (
                    <>
                      {" "}
                      <strong className="text-amber-700">{detections.length} result{detections.length !== 1 ? "s" : ""}</strong>{" "}
                      reported as detected above the minimum reporting limit.
                    </>
                  )}
                  {nonDetects.length > 0 && (
                    <>
                      {" "}
                      <strong className="text-foreground">{nonDetects.length}</strong>{" "}
                      reported as not detected above MRL.
                    </>
                  )}
                </p>
              )}
            </div>

            {/* Records table */}
            {pfasRecords.length > 0 && (
              <div>
                <h2 className="font-display text-xl text-foreground mb-4">PFAS Monitoring Records</h2>
                <div className="overflow-x-auto rounded-lg border border-border bg-white">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-secondary/50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Analyte</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Result</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Status</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Sample Date</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Sample Point</th>
                        <th className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden xl:table-cell">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {pfasRecords.map((record) => {
                        const isDetected = record.raw_detection_flag === "Detected above MRL";

                        return (
                          <tr key={record.id} className="hover:bg-secondary/30 transition-colors">
                            <td className="px-4 py-3.5">
                              <div className="font-mono text-xs font-semibold text-wur-teal">{record.analyte.code}</div>
                              <div className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{record.analyte.name}</div>
                            </td>
                            <td className="px-4 py-3.5 hidden sm:table-cell">
                              <span className="font-mono text-xs text-foreground">
                                {record.raw_result_value} {record.raw_unit}
                              </span>
                              {record.raw_reporting_limit && (
                                <div className="text-xs text-muted-foreground">MRL: {record.raw_reporting_limit}</div>
                              )}
                            </td>
                            <td className="px-4 py-3.5">
                              {isDetected ? (
                                <div className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span className="text-xs font-semibold text-amber-700">Official detection</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5">
                                  <XCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                                  <span className="text-xs text-muted-foreground">Official non-detect</span>
                                </div>
                              )}
                            </td>
                            <td className="px-4 py-3.5 hidden md:table-cell">
                              <span className="text-xs text-muted-foreground">
                                {record.sample_date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 hidden lg:table-cell">
                              <span className="text-xs text-muted-foreground font-mono">
                                {record.sample_point ?? "—"}
                              </span>
                            </td>
                            <td className="px-4 py-3.5 hidden xl:table-cell">
                              <a
                                href={record.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline"
                              >
                                {record.source_dataset} <ExternalLink className="w-3 h-3" />
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Source attribution */}
                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <ExternalLink className="w-3 h-3" />
                  Source:{" "}
                  <a
                    href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wur-teal hover:underline"
                  >
                    EPA UCMR 5 Occurrence Data
                  </a>
                  {mostRecentRetrieval && (
                    <>
                      {" "}· Retrieved{" "}
                      {mostRecentRetrieval.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Official status records */}
            {officialStatuses.length > 0 && (
              <div>
                <h2 className="font-display text-xl text-foreground mb-4">Official Enforcement Context</h2>
                <div className="space-y-3">
                  {officialStatuses.map((s) => (
                    <div
                      key={s.id}
                      className="rounded-lg border border-border bg-card p-4 flex items-start gap-3"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{s.raw_status_label}</span>
                          <span className="text-xs font-mono text-muted-foreground shrink-0">
                            {s.source_dataset}
                          </span>
                        </div>
                        {s.raw_status_reason && (
                          <p className="text-xs text-muted-foreground mb-2">{s.raw_status_reason}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {s.effective_date && (
                            <span>
                              Effective:{" "}
                              {s.effective_date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                            </span>
                          )}
                          <a
                            href={s.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-wur-teal hover:underline"
                          >
                            Source <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── SIDEBAR ── */}
          <div className="space-y-4">

            {/* At a glance */}
            {utility && (
              <div className="rounded-lg border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground text-sm mb-4">Water System</h3>
                <div className="space-y-3">
                  {[
                    { icon: FileText, label: "PWSID", value: utility.pwsid, mono: true },
                    { icon: Building2, label: "State", value: utility.state?.name },
                    {
                      icon: Users,
                      label: "Population served",
                      value: utility.population_served.toLocaleString(),
                    },
                    { icon: Droplets, label: "System type", value: utility.service_type ?? "—" },
                  ].map(({ icon: Icon, label, value, mono }) => (
                    <div key={label} className="flex items-start gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className={`text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}>
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <Link
                    href={`/utilities/${utility.slug}`}
                    className="w-full flex items-center justify-center gap-2 text-xs text-wur-teal border border-wur-teal/30 rounded-md px-3 py-2 hover:bg-wur-teal/5 transition-colors"
                  >
                    Full utility profile <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* PFAS summary */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">PFAS Record Summary</h3>
              <div className="space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Total records</span>
                  <span className="text-sm font-semibold text-foreground font-mono">{pfasRecords.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Official detections</span>
                  <span className={`text-sm font-semibold font-mono ${detections.length > 0 ? "text-amber-700" : "text-foreground"}`}>
                    {detections.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Official non-detects</span>
                  <span className="text-sm font-semibold text-foreground font-mono">{nonDetects.length}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Monitoring results from EPA UCMR 5 are not compliance determinations.
                </p>
              </div>
            </div>

            {/* External links */}
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Official Sources</h3>
              <div className="space-y-2.5">
                {[
                  {
                    label: "EPA ECHO Facility Report",
                    href: `https://echo.epa.gov/detailed-facility-report?fid=${pwsid}`,
                  },
                  {
                    label: "UCMR 5 Data Finder",
                    href: "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5",
                  },
                  {
                    label: "EPA PFAS Rule",
                    href: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas",
                  },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between group hover:text-wur-teal transition-colors"
                  >
                    <span className="text-xs text-muted-foreground group-hover:text-wur-teal transition-colors">
                      {link.label}
                    </span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground/40 group-hover:text-wur-teal transition-colors shrink-0" />
                  </a>
                ))}
              </div>
            </div>

            {/* Methodology */}
            <div className="rounded-lg border border-border p-4 bg-secondary/30">
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                This page shows only official government PFAS records. No risk scores, safety judgments,
                or inferred compliance determinations are generated by this system.{" "}
                <Link href="/pfas-watchlist/methodology" className="text-wur-teal hover:underline">
                  Read methodology
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── BACK NAV ── */}
      <section className="py-8 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href={stateSlug ? `/pfas-watchlist/${stateSlug}` : "/pfas-watchlist"}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-wur-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {stateSlug ? `${utility?.state?.name ?? "State"} PFAS records` : "PFAS Watchlist"}
          </Link>
          <Link
            href="/pfas-watchlist/methodology"
            className="text-sm text-wur-teal hover:underline"
          >
            Methodology
          </Link>
        </div>
      </section>
    </div>
  );
}
