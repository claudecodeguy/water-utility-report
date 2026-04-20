import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, AlertTriangle, ExternalLink, Info } from "lucide-react";
import { getStateContentBySlug } from "@/lib/content/states";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string }>;
}): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateContentBySlug(stateSlug);
  if (!state) return {};
  return {
    title: `${state.name} PFAS Watchlist — Official EPA Drinking Water Records`,
    description: `Official EPA UCMR 5 PFAS monitoring records for public water systems in ${state.name}. Source-backed, no inferred risk scores.`,
  };
}

export default async function PfasStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: stateSlug } = await params;
  const stateContent = getStateContentBySlug(stateSlug);
  if (!stateContent) notFound();

  // Look up DB state record
  const dbState = await prisma.state.findUnique({
    where: { abbreviation: stateContent.abbreviation },
  });

  // Get utilities in this state that have PFAS records
  type UtilityWithPfas = {
    id: string;
    slug: string;
    name: string;
    pwsid: string;
    population_served: number;
    city_served: string | null;
    pfas_records: {
      id: string;
      raw_detection_flag: string;
      analyte: { code: string; name: string };
      sample_date: Date;
      source_retrieved_at: Date;
    }[];
  };

  let utilitiesWithPfas: UtilityWithPfas[] = [];
  let totalUtilitiesInState = 0;

  if (dbState) {
    [utilitiesWithPfas, totalUtilitiesInState] = await Promise.all([
      prisma.utility.findMany({
        where: {
          state_id: dbState.id,
          pfas_records: { some: { suppressed: false, validated: true } },
        },
        select: {
          id: true,
          slug: true,
          name: true,
          pwsid: true,
          population_served: true,
          city_served: true,
          pfas_records: {
            where: { suppressed: false, validated: true },
            select: {
              id: true,
              raw_detection_flag: true,
              analyte: { select: { code: true, name: true } },
              sample_date: true,
              source_retrieved_at: true,
            },
            orderBy: { sample_date: "desc" },
          },
        },
        orderBy: { population_served: "desc" },
      }) as Promise<UtilityWithPfas[]>,
      prisma.utility.count({ where: { state_id: dbState.id } }),
    ]);
  }

  const mostRecentRetrieval = utilitiesWithPfas
    .flatMap((u) => u.pfas_records.map((r) => r.source_retrieved_at))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const hasData = utilitiesWithPfas.length > 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ── HEADER ── */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <Link href="/pfas-watchlist" className="text-xs text-white/40 hover:text-white/70 transition-colors">PFAS Watchlist</Link>
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/60">{stateContent.abbreviation}</span>
          </div>

          <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
            Official PFAS Records
          </p>
          <h1 className="font-display text-4xl text-white mb-3">
            {stateContent.name} PFAS Watchlist
          </h1>
          <p className="text-white/60 max-w-2xl">
            Official EPA UCMR 5 PFAS monitoring records for public water systems in {stateContent.name}.
            {hasData
              ? ` ${utilitiesWithPfas.length.toLocaleString()} water system${utilitiesWithPfas.length !== 1 ? "s" : ""} with qualifying official records.`
              : " No qualifying official PFAS records located in the current dataset."}
          </p>

          {mostRecentRetrieval && (
            <p className="text-xs text-white/35 font-mono mt-3">
              Source retrieved: {mostRecentRetrieval.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} ·{" "}
              <Link href="/pfas-watchlist/sources" className="underline hover:text-white/60 transition-colors">
                EPA UCMR 5
              </Link>
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
              Monitoring results are not compliance determinations. Missing records do not establish absence of PFAS.{" "}
              <Link href="/pfas-watchlist/methodology" className="underline hover:text-amber-900 transition-colors">
                Methodology
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Stats row */}
          {hasData && (
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[
                { value: utilitiesWithPfas.length.toLocaleString(), label: "Systems with records" },
                {
                  value: utilitiesWithPfas.flatMap((u) => u.pfas_records).length.toLocaleString(),
                  label: "Total records",
                },
                {
                  value: utilitiesWithPfas
                    .flatMap((u) => u.pfas_records.filter((r) => r.raw_detection_flag === "Detected above MRL"))
                    .length.toLocaleString(),
                  label: "Official detections",
                },
              ].map((s, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-4 text-center">
                  <div className="font-display text-2xl text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!hasData && (
            <div className="flex items-start gap-3 bg-secondary border border-border rounded-lg p-5 mb-8">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  No qualifying official PFAS records located
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  No official PFAS records for {stateContent.name} water systems were found in the current
                  EPA UCMR 5 dataset. This does not establish that PFAS are absent — it means no qualifying
                  record was located in the datasets this watchlist uses.{" "}
                  {totalUtilitiesInState > 0 && (
                    <>
                      {stateContent.name} has {totalUtilitiesInState.toLocaleString()} tracked utilities.{" "}
                    </>
                  )}
                  <Link href="/pfas-watchlist/sources" className="text-wur-teal hover:underline">
                    View data sources
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Utility table */}
          {hasData && (
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Water System</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">PWSID</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Analytes in records</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Records</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Detections</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {utilitiesWithPfas.map((u) => {
                    const detections = u.pfas_records.filter((r) =>
                      r.raw_detection_flag === "Detected above MRL"
                    );
                    const uniqueAnalytes = [...new Set(u.pfas_records.map((r) => r.analyte.code))];
                    return (
                      <tr key={u.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3.5">
                          <div className="font-medium text-foreground">{normalizeName(u.name)}</div>
                          {u.city_served && (
                            <div className="text-xs text-muted-foreground mt-0.5">{u.city_served}</div>
                          )}
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="font-mono text-xs text-muted-foreground">{u.pwsid}</span>
                        </td>
                        <td className="px-4 py-3.5 hidden md:table-cell">
                          <div className="flex flex-wrap gap-1">
                            {uniqueAnalytes.slice(0, 5).map((code) => (
                              <span
                                key={code}
                                className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-semibold ${
                                  detections.some((d) => d.analyte.code === code)
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-secondary text-muted-foreground"
                                }`}
                              >
                                {code}
                              </span>
                            ))}
                            {uniqueAnalytes.length > 5 && (
                              <span className="text-[10px] text-muted-foreground">+{uniqueAnalytes.length - 5}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right font-mono text-xs text-foreground">
                          {u.pfas_records.length}
                        </td>
                        <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                          {detections.length > 0 ? (
                            <span className="text-xs font-semibold text-amber-700">
                              {detections.length} detected
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">0</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Link
                            href={`/pfas-watchlist/utility/${u.pwsid}`}
                            className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline font-medium"
                          >
                            View <ArrowRight className="w-3 h-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Source note */}
          <div className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground">
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
            {" "}·{" "}
            <Link href="/pfas-watchlist/methodology" className="text-wur-teal hover:underline">
              Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* ── BACK NAV ── */}
      <section className="py-8 border-t border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link
            href="/pfas-watchlist"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-wur-teal transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All states
          </Link>
          <Link
            href={`/states/${stateSlug}`}
            className="inline-flex items-center gap-2 text-sm text-wur-teal hover:underline"
          >
            {stateContent.name} utility directory
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
