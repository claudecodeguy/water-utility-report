import Link from "next/link";
import { ArrowRight, Shield, AlertTriangle, ExternalLink, FlaskConical, Info } from "lucide-react";
import { prisma } from "@/lib/prisma";
import stateContent from "@/lib/content/states";
import PfasSearch from "@/components/pfas-search";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PFAS Watchlist — Official EPA Drinking Water Records | Water Utility Report",
  description:
    "Search official EPA UCMR 5 PFAS monitoring records for U.S. public water systems. Every record links to a government source. No inferred risk scores.",
};

export const revalidate = 3600;

const UCMR5_SOURCE_URL = "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5";

const faqItems = [
  {
    q: "What is PFAS?",
    a: "PFAS (per- and polyfluoroalkyl substances) are a large group of synthetic chemicals used in many products since the 1940s. Some PFAS have been found in drinking water sources. This watchlist displays only official government monitoring records — it does not make health judgments.",
  },
  {
    q: "What is EPA UCMR 5?",
    a: "UCMR 5 is the fifth Unregulated Contaminant Monitoring Rule, which required large public water systems to monitor for 29 PFAS and lithium between 2023 and 2025. EPA published the resulting occurrence data publicly. This watchlist uses only that official UCMR 5 dataset.",
  },
  {
    q: "Does an official PFAS detection mean my water is unsafe?",
    a: "No. This watchlist does not make safety determinations. An official detection means EPA monitoring records show a reported result for that analyte at that system. Whether that result has regulatory significance depends on the official EPA rules in effect at the time. See the EPA PFAS National Primary Drinking Water Regulation for current enforceable limits.",
  },
  {
    q: "What does 'official non-detect' mean?",
    a: "An official non-detect means the monitoring result was reported as not detected above the minimum reporting limit (MRL) for that analyte. It does not mean zero concentration — only that the concentration, if present, was below the detection threshold used.",
  },
  {
    q: "Does missing data mean no PFAS?",
    a: "No. Not all public water systems were required to participate in UCMR 5. Absence of a record means no qualifying official record was located in the current dataset — it does not establish that PFAS are absent.",
  },
  {
    q: "How often is this data updated?",
    a: "This watchlist refreshes each time EPA publishes updated UCMR 5 occurrence data. Each record shows its source retrieval date. Check the Sources page for current dataset versions.",
  },
];

export default async function PfasWatchlistHub() {
  const [totalRecords, totalPws, analyteCounts, analyteList, statesWithData, mostRecentRecord] = await Promise.all([
    prisma.pfasRecord.count({ where: { suppressed: false, validated: true } }),
    prisma.pfasRecord.groupBy({ by: ["pwsid"], where: { suppressed: false, validated: true } }).then((r) => r.length),
    prisma.pfasRecord.groupBy({
      by: ["analyte_id"],
      where: { suppressed: false, validated: true, raw_detection_flag: "Detected above MRL" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),
    prisma.pfasAnalyte.findMany({ orderBy: { code: "asc" } }),
    // States that have PFAS data, with record counts
    prisma.state.findMany({
      where: { utilities: { some: { pfas_records: { some: { validated: true, suppressed: false } } } } },
      select: {
        abbreviation: true,
        _count: {
          select: { utilities: { where: { pfas_records: { some: { validated: true, suppressed: false } } } } },
        },
      },
    }),
    prisma.pfasRecord.findFirst({
      orderBy: { source_retrieved_at: "desc" },
      select: { source_retrieved_at: true, source_dataset: true },
    }),
  ]);

  // Map abbr → utility count with PFAS data
  const stateDataMap = Object.fromEntries(
    statesWithData.map((s) => [s.abbreviation, s._count.utilities])
  );

  // Only show states that have PFAS data, sorted by record count desc
  const activeStates = stateContent
    .filter((s) => stateDataMap[s.abbreviation] !== undefined)
    .sort((a, b) => (stateDataMap[b.abbreviation] ?? 0) - (stateDataMap[a.abbreviation] ?? 0));

  const hasData = totalRecords > 0;

  return (
    <div className="min-h-screen bg-background">

      {/* ── HERO ── */}
      <section className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/" className="text-xs text-white/40 hover:text-white/70 transition-colors">Home</Link>
            <span className="text-white/20">/</span>
            <span className="text-xs text-white/60">PFAS Watchlist</span>
          </div>

          <div className="flex items-start gap-4 mb-8">
            <div className="w-10 h-10 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 mt-1">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-400 mb-2">
                Government Data Watchlist
              </p>
              <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
                PFAS in U.S. Drinking Water
              </h1>
              <p className="text-white/60 max-w-2xl text-base leading-relaxed">
                Official EPA UCMR 5 monitoring records for public water systems nationwide.
                Search for your water system below, or browse by state.
              </p>
            </div>
          </div>

          {/* ── LOOKUP ── */}
          <div className="max-w-xl mb-3">
            <PfasSearch />
          </div>
          <p className="text-xs text-white/30 mb-6">
            Search by utility name, city, or PWSID — {totalPws.toLocaleString()} systems with official records
          </p>

          {/* Disclosure */}
          <div className="mt-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/25 rounded-lg p-4 max-w-3xl">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200/80 leading-relaxed">
              <strong className="text-amber-300">Data disclosure:</strong> This watchlist uses only EPA UCMR 5 and official government datasets.
              Monitoring results are not compliance determinations. Missing records do not establish absence of PFAS.
              Do not use this data as a substitute for official utility communications or professional water testing.{" "}
              <Link href="/pfas-watchlist/methodology" className="underline hover:text-amber-200 transition-colors">
                Full methodology
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="bg-wur-teal text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left sm:divide-x divide-white/20">
            {[
              { value: hasData ? totalPws.toLocaleString() : "—", label: "Water systems with records", sub: "from official UCMR 5 data" },
              { value: hasData ? totalRecords.toLocaleString() : "—", label: "Official PFAS records", sub: "validated & sourced" },
              { value: analyteList.length > 0 ? analyteList.length.toString() : "29", label: "Analytes monitored", sub: "per UCMR 5 rule" },
              {
                value: mostRecentRecord
                  ? mostRecentRecord.source_retrieved_at.toLocaleDateString("en-US", { month: "short", year: "numeric" })
                  : "Pending",
                label: "Data last retrieved",
                sub: mostRecentRecord?.source_dataset ?? "EPA UCMR 5",
              },
            ].map((stat, i) => (
              <div key={i} className={i > 0 ? "sm:pl-6" : ""}>
                <div className="font-display text-3xl text-white mb-1">{stat.value}</div>
                <div className="text-sm font-semibold text-white/90">{stat.label}</div>
                <div className="text-xs text-white/50 font-mono mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY STATE ── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Browse</p>
              <h2 className="font-display text-3xl text-foreground">By State</h2>
            </div>
          </div>

          {!hasData && (
            <div className="flex items-start gap-3 bg-secondary border border-border rounded-lg p-4 mb-8">
              <Info className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                UCMR 5 data ingestion is in progress. State-level record counts will appear once the pipeline completes.
                See the{" "}
                <Link href="/pfas-watchlist/sources" className="text-wur-teal hover:underline">sources page</Link>
                {" "}for current dataset status.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {activeStates.map((state) => {
              const utilityCount = stateDataMap[state.abbreviation];
              return (
                <Link
                  key={state.slug}
                  href={`/pfas-watchlist/${state.slug}`}
                  className="group flex flex-col bg-card border border-border rounded-lg p-4 hover:border-wur-teal/50 hover:shadow-sm transition-all"
                >
                  <div className="text-2xl font-display text-wur-teal/60 mb-2">{state.abbreviation}</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors mb-1 leading-snug">
                    {state.name}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono mt-auto pt-2">
                    {utilityCount !== undefined ? `${utilityCount.toLocaleString()} systems` : "View records"}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-wur-teal transition-colors mt-1" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── ANALYTES TRACKED ── */}
      <section className="py-16 bg-wur-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">UCMR 5 Scope</p>
            <h2 className="font-display text-3xl text-foreground mb-3">Analytes Monitored</h2>
            <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
              The following PFAS analytes were monitored under EPA UCMR 5. EPA limits shown are from the{" "}
              <a
                href="https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wur-teal hover:underline inline-flex items-center gap-1"
              >
                PFAS National Primary Drinking Water Regulation <ExternalLink className="w-3 h-3" />
              </a>{" "}
              (April 2024). Results in this watchlist are monitoring data — not compliance determinations.
            </p>
          </div>

          {analyteList.length > 0 ? (
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Analyte Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">CAS #</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">EPA MCL (ppt)</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Detections</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {analyteList.map((analyte) => {
                    const detCount = analyteCounts.find((a) => a.analyte_id === analyte.id)?._count?.id;
                    return (
                      <tr key={analyte.id} className="hover:bg-secondary/30 transition-colors group">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-wur-teal">
                          <Link href={`/pfas-watchlist/analyte/${analyte.code}`} className="hover:underline">
                            {analyte.code}
                          </Link>
                        </td>
                        <td className="px-4 py-3">
                          <Link href={`/pfas-watchlist/analyte/${analyte.code}`} className="hover:text-wur-teal transition-colors">
                            <div className="font-medium text-foreground group-hover:text-wur-teal transition-colors">{analyte.name}</div>
                            {analyte.note && (
                              <div className="text-xs text-muted-foreground mt-0.5">{analyte.note}</div>
                            )}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground font-mono hidden sm:table-cell">
                          {analyte.cas_number ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {analyte.epa_mcl_ppt != null ? (
                            <span className="text-xs font-mono font-semibold text-foreground">{analyte.epa_mcl_ppt} ppt</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">See mixture rule</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right font-mono text-xs hidden md:table-cell">
                          {detCount != null ? (
                            <Link href={`/pfas-watchlist/analyte/${analyte.code}`} className="text-amber-600 hover:underline font-semibold">
                              {detCount.toLocaleString()}
                            </Link>
                          ) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            // Fallback static table before seed runs
            <div className="overflow-x-auto rounded-lg border border-border bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Code</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Analyte Name</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">EPA MCL (ppt)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {STATIC_ANALYTES.map((a) => (
                    <tr key={a.code} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-wur-teal">{a.code}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{a.name}</td>
                      <td className="px-4 py-3 text-right text-xs font-mono text-foreground">
                        {a.mcl ?? <span className="text-muted-foreground">See mixture rule</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3" />
            Source:{" "}
            <a href={UCMR5_SOURCE_URL} target="_blank" rel="noopener noreferrer" className="text-wur-teal hover:underline">
              EPA UCMR 5 Occurrence Data
            </a>
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Understanding the Data</p>
            <h2 className="font-display text-3xl text-foreground">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <div key={i} className="border border-border rounded-lg p-5 bg-card">
                <div className="flex items-start gap-3">
                  <FlaskConical className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{item.q}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY CTA ── */}
      <section className="py-14 bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                href: "/pfas-watchlist/methodology",
                label: "Methodology",
                desc: "How records are sourced, validated, and displayed. What we will never infer.",
              },
              {
                href: "/pfas-watchlist/sources",
                label: "Data Sources",
                desc: "Every dataset used, with retrieval dates, URLs, and publication cadence.",
              },
              {
                href: "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5",
                label: "EPA UCMR 5",
                desc: "Access the official UCMR 5 occurrence data directly from EPA.",
                external: true,
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="group flex flex-col bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wide">Reference</span>
                  {card.external && <ExternalLink className="w-3.5 h-3.5 text-white/30" />}
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-wur-aqua transition-colors">
                  {card.label}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">{card.desc}</p>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-wur-aqua mt-4 transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Static fallback analyte list shown before DB seed runs
const STATIC_ANALYTES: { code: string; name: string; mcl: string | null }[] = [
  { code: "PFOA", name: "Perfluorooctanoic acid", mcl: "4 ppt" },
  { code: "PFOS", name: "Perfluorooctane sulfonic acid", mcl: "4 ppt" },
  { code: "PFNA", name: "Perfluorononanoic acid", mcl: "10 ppt" },
  { code: "PFHxS", name: "Perfluorohexane sulfonic acid", mcl: "10 ppt" },
  { code: "HFPO-DA", name: "Hexafluoropropylene oxide dimer acid (GenX)", mcl: "10 ppt" },
  { code: "PFBS", name: "Perfluorobutane sulfonic acid", mcl: null },
  { code: "PFHpA", name: "Perfluoroheptanoic acid", mcl: null },
  { code: "PFHxA", name: "Perfluorohexanoic acid", mcl: null },
  { code: "PFDA", name: "Perfluorodecanoic acid", mcl: null },
  { code: "PFUnA", name: "Perfluoroundecanoic acid", mcl: null },
  { code: "PFDoA", name: "Perfluorododecanoic acid", mcl: null },
  { code: "PFTrDA", name: "Perfluorotridecanoic acid", mcl: null },
  { code: "PFTeDA", name: "Perfluorotetradecanoic acid", mcl: null },
];
