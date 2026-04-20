import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, ExternalLink, FlaskConical,
  AlertTriangle, CheckCircle2, BarChart3, Droplets,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>;
}): Promise<Metadata> {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).toUpperCase();
  const analyte = await prisma.pfasAnalyte.findUnique({
    where: { code },
    select: { name: true, code: true },
  });
  if (!analyte) return {};
  return {
    title: `${analyte.code} (${analyte.name}) — PFAS Monitoring Data | Water Utility Report`,
    description: `Official EPA UCMR 5 monitoring records for ${analyte.name} (${analyte.code}). Detection rates, top states, and water systems with confirmed detections.`,
  };
}

export default async function AnalytePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code: rawCode } = await params;
  const code = decodeURIComponent(rawCode).toUpperCase();

  const analyte = await prisma.pfasAnalyte.findUnique({ where: { code } });
  if (!analyte) notFound();

  const WHERE_BASE = { analyte_id: analyte.id, validated: true, suppressed: false };
  const WHERE_DETECTED = { ...WHERE_BASE, raw_detection_flag: "Detected above MRL" };

  const [
    totalRecords,
    detectionCount,
    systemsMonitored,
    systemsDetected,
    topStates,
    topUtilities,
    sampleDateRange,
  ] = await Promise.all([
    prisma.pfasRecord.count({ where: WHERE_BASE }),
    prisma.pfasRecord.count({ where: WHERE_DETECTED }),
    prisma.pfasRecord.groupBy({ by: ["pwsid"], where: WHERE_BASE }).then((r) => r.length),
    prisma.pfasRecord.groupBy({ by: ["pwsid"], where: WHERE_DETECTED }).then((r) => r.length),

    // Top states by detection count — join via utility
    prisma.pfasRecord.groupBy({
      by: ["pwsid"],
      where: WHERE_DETECTED,
      _count: { id: true },
    }).then(async (rows) => {
      const pwsids = rows.map((r) => r.pwsid);
      const utilities = await prisma.utility.findMany({
        where: { pwsid: { in: pwsids } },
        select: { pwsid: true, state: { select: { abbreviation: true, name: true, slug: true } } },
      });
      const stateMap = new Map<string, { name: string; slug: string; count: number }>();
      for (const u of utilities) {
        const abbr = u.state?.abbreviation ?? "??";
        const det = rows.find((r) => r.pwsid === u.pwsid)?._count?.id ?? 0;
        const existing = stateMap.get(abbr);
        stateMap.set(abbr, {
          name: u.state?.name ?? abbr,
          slug: u.state?.slug ?? abbr.toLowerCase(),
          count: (existing?.count ?? 0) + det,
        });
      }
      return Array.from(stateMap.entries())
        .map(([abbr, v]) => ({ abbr, ...v }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);
    }),

    // Top 15 utilities by detection count
    prisma.pfasRecord.groupBy({
      by: ["pwsid"],
      where: WHERE_DETECTED,
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 15,
    }).then(async (rows) => {
      const pwsids = rows.map((r) => r.pwsid);
      const utilities = await prisma.utility.findMany({
        where: { pwsid: { in: pwsids } },
        select: {
          pwsid: true, name: true, slug: true,
          population_served: true,
          state: { select: { abbreviation: true } },
        },
      });
      return rows.map((r) => {
        const u = utilities.find((u) => u.pwsid === r.pwsid);
        return {
          pwsid: r.pwsid,
          name: u ? normalizeName(u.name) : r.pwsid,
          slug: u?.slug ?? null,
          population: u?.population_served ?? 0,
          stateAbbr: u?.state?.abbreviation ?? "",
          detections: r._count.id,
        };
      }).sort((a, b) => b.detections - a.detections);
    }),

    prisma.pfasRecord.aggregate({
      where: WHERE_BASE,
      _min: { sample_date: true },
      _max: { sample_date: true },
    }),
  ]);

  const detectionRate = totalRecords > 0 ? (detectionCount / totalRecords) * 100 : 0;
  const systemDetectionRate = systemsMonitored > 0 ? (systemsDetected / systemsMonitored) * 100 : 0;

  const hasEpaLimit = analyte.epa_mcl_ppt != null;
  const isRegulated = hasEpaLimit;

  const fmt = (d: Date | null) =>
    d ? d.toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "—";

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6 flex-wrap">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/pfas-watchlist" className="hover:text-white/70 transition-colors">PFAS Watchlist</Link>
            <span>/</span>
            <span className="text-white/60">{analyte.code}</span>
          </nav>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1">
              <FlaskConical className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                PFAS Analyte · UCMR 5
              </p>
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-1">
                {analyte.code}
              </h1>
              <p className="text-white/50 text-base mb-3">{analyte.name}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/40 font-mono">
                {analyte.cas_number && <span>CAS {analyte.cas_number}</span>}
                {analyte.ucmr_round && <span>· {analyte.ucmr_round}</span>}
                {isRegulated ? (
                  <span className="text-amber-400 font-semibold">· EPA MCL: {analyte.epa_mcl_ppt} ppt</span>
                ) : (
                  <span>· No individual MCL set</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-wur-teal text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left sm:divide-x divide-white/20">
            {[
              { value: systemsMonitored.toLocaleString(), label: "Systems monitored", sub: "with official records" },
              { value: systemsDetected.toLocaleString(), label: "Systems with detections", sub: `${systemDetectionRate.toFixed(1)}% detection rate` },
              { value: detectionCount.toLocaleString(), label: "Detected samples", sub: `of ${totalRecords.toLocaleString()} total samples` },
              { value: `${fmt(sampleDateRange._min.sample_date)} – ${fmt(sampleDateRange._max.sample_date)}`, label: "Monitoring period", sub: "per UCMR 5 schedule" },
            ].map((s, i) => (
              <div key={i} className={i > 0 ? "sm:pl-6" : ""}>
                <div className="font-display text-2xl sm:text-3xl text-white mb-1 leading-tight">{s.value}</div>
                <div className="text-sm font-semibold text-white/90">{s.label}</div>
                <div className="text-xs text-white/50 font-mono mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* Detection rate bar */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-5 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-wur-teal" />
                Detection Rate — {analyte.code}
              </h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Systems with any detection</span>
                    <span className="font-mono font-semibold text-foreground">{systemDetectionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all"
                      style={{ width: `${Math.min(systemDetectionRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {systemsDetected.toLocaleString()} of {systemsMonitored.toLocaleString()} monitored systems
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>Sample-level detection rate</span>
                    <span className="font-mono font-semibold text-foreground">{detectionRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-2.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-wur-teal rounded-full transition-all"
                      style={{ width: `${Math.min(detectionRate, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {detectionCount.toLocaleString()} detections across {totalRecords.toLocaleString()} total samples
                  </p>
                </div>
              </div>
            </section>

            {/* Top states */}
            {topStates.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-5">
                  States with Most {analyte.code} Detections
                </h2>
                <div className="space-y-2">
                  {topStates.map((s, i) => (
                    <Link
                      key={s.abbr}
                      href={`/pfas-watchlist/${s.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-wur-teal/50 hover:shadow-sm transition-all"
                    >
                      <span className="w-6 text-xs text-muted-foreground/40 font-mono text-right shrink-0">{i + 1}</span>
                      <div className="w-9 h-9 rounded-lg bg-wur-teal/10 flex items-center justify-center font-mono text-sm font-bold text-wur-teal shrink-0">
                        {s.abbr}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">
                          {s.name}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          {s.count.toLocaleString()} detection{s.count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Top utilities */}
            {topUtilities.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Water Systems with Most {analyte.code} Detections
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  Systems ranked by number of samples detected above the minimum reporting limit.
                  Detection count reflects monitoring frequency, not concentration level.
                </p>
                <div className="space-y-2">
                  {topUtilities.map((u, i) => (
                    u.slug ? (
                      <Link
                        key={u.pwsid}
                        href={`/pfas-watchlist/utility/${u.pwsid}`}
                        className="group flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-wur-teal/50 hover:shadow-sm transition-all"
                      >
                        <span className="w-6 text-xs text-muted-foreground/40 font-mono text-right shrink-0">{i + 1}</span>
                        <Droplets className="w-4 h-4 text-wur-teal shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors truncate">
                            {u.name}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            {u.pwsid} · {u.stateAbbr}
                            {u.population > 0 && ` · ${u.population.toLocaleString()} served`}
                          </p>
                        </div>
                        <span className="text-xs font-mono bg-amber-500/15 text-amber-600 px-2 py-1 rounded shrink-0">
                          {u.detections} detected
                        </span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal shrink-0 transition-colors" />
                      </Link>
                    ) : (
                      <div key={u.pwsid} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-card">
                        <span className="w-6 text-xs text-muted-foreground/40 font-mono text-right shrink-0">{i + 1}</span>
                        <Droplets className="w-4 h-4 text-muted-foreground/30 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-muted-foreground font-mono">{u.pwsid}</p>
                          <p className="text-xs text-muted-foreground/50 mt-0.5">Not in utility database</p>
                        </div>
                        <span className="text-xs font-mono bg-amber-500/15 text-amber-600 px-2 py-1 rounded shrink-0">
                          {u.detections} detected
                        </span>
                      </div>
                    )
                  ))}
                </div>
              </section>
            )}

            {detectionCount === 0 && (
              <section className="rounded-xl border border-border bg-card p-8 text-center">
                <CheckCircle2 className="w-8 h-8 text-wur-safe mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">No detections above MRL in dataset</p>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  No official UCMR 5 records for {analyte.code} show a result above the minimum reporting limit.
                  This does not establish that {analyte.code} is absent — it means no qualifying detection was reported.
                </p>
              </section>
            )}

            {/* Disclosure */}
            <div className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                All records are from official EPA UCMR 5 monitoring data. Detection counts reflect
                the number of samples where the analyte was reported above the minimum reporting limit (MRL).
                They are <strong>not compliance determinations</strong> and do not imply a health violation.
                {isRegulated && ` The EPA MCL for ${analyte.code} is ${analyte.epa_mcl_ppt} ppt under the PFAS National Primary Drinking Water Regulation (April 2024).`}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  {analyte.code} at a Glance
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Full Name", value: analyte.name },
                    analyte.cas_number ? { label: "CAS Number", value: analyte.cas_number, mono: true } : null,
                    { label: "UCMR Round", value: analyte.ucmr_round ?? "UCMR 5" },
                    {
                      label: "EPA MCL",
                      value: analyte.epa_mcl_ppt != null ? `${analyte.epa_mcl_ppt} ppt` : "See mixture rule",
                      mono: true,
                      highlight: analyte.epa_mcl_ppt != null,
                    },
                    analyte.epa_hal_ppt != null
                      ? { label: "Health Advisory", value: `${analyte.epa_hal_ppt} ppt`, mono: true }
                      : null,
                    { label: "Systems Monitored", value: systemsMonitored.toLocaleString(), mono: true },
                    { label: "Systems Detected", value: systemsDetected.toLocaleString(), mono: true },
                    { label: "Detection Rate", value: `${systemDetectionRate.toFixed(1)}%`, mono: true },
                  ].filter(Boolean).map((row) => {
                    const r = row!;
                    return (
                      <div key={r.label} className="flex items-start justify-between gap-2">
                        <span className="text-xs text-muted-foreground shrink-0">{r.label}</span>
                        <span className={`text-xs text-right ${r.mono ? "font-mono" : ""} ${r.highlight ? "text-amber-600 font-semibold" : "font-medium text-foreground"}`}>
                          {r.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {analyte.note && (
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Note</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{analyte.note}</p>
                </div>
              )}

              <a
                href="https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-wur-teal hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                EPA PFAS Drinking Water Regulation
              </a>
              <a
                href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-wur-teal hover:underline"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                EPA UCMR 5 Source Data
              </a>

              <Link
                href="/pfas-watchlist"
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to PFAS Watchlist
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
