import { notFound } from "next/navigation";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  Building2,
  Users,
  Droplets,
  FileText,
} from "lucide-react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import DataLimitationsNote from "@/components/data-limitations-note";
import SourcesBlock from "@/components/sources-block";

export const dynamic = "force-dynamic";
export const revalidate = 86400;

function slugifyCounty(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\bcounty\b/g, "")
    .replace(/\bco\.?\b/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatCountyName(raw: string): string {
  const stripped = raw
    .replace(/\s+\d{3,4}\b/g, "")
    .replace(/-\d{3,4}$/, "")
    .trim();
  if (/county/i.test(stripped)) return stripped;
  return `${stripped} County`;
}

const RISK_ORDER = ["safe", "low", "moderate", "high", "critical"] as const;
type RiskLevel = (typeof RISK_ORDER)[number];

function worstRisk(levels: string[]): RiskLevel {
  let worst = 0;
  for (const l of levels) {
    const idx = RISK_ORDER.indexOf(l as RiskLevel);
    if (idx > worst) worst = idx;
  }
  return RISK_ORDER[worst];
}

const RISK_COLORS: Record<RiskLevel, string> = {
  safe: "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  high: "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
  critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ state: string; county: string }>;
}): Promise<Metadata> {
  const { state: stateParam, county: countyParam } = await params;

  const stateRecord = await prisma.state.findFirst({
    where: {
      OR: [
        { slug: stateParam },
        { abbreviation: stateParam.toUpperCase() },
      ],
    },
    select: { name: true, abbreviation: true, slug: true },
  });
  if (!stateRecord) return {};

  const allCountyUtilities = await prisma.utility.findMany({
    where: {
      state: { abbreviation: stateRecord.abbreviation },
      county_served: { not: null },
      publish_status: "published",
    },
    select: { county_served: true },
    take: 300,
  });

  const matched = allCountyUtilities.find(
    (u) => u.county_served && slugifyCounty(u.county_served) === countyParam
  );
  if (!matched) return {};

  const countyDisplay = formatCountyName(matched.county_served!);
  const title = `${countyDisplay}, ${stateRecord.abbreviation} Water Contamination & Quality Records (2025)`;
  const description = `Official EPA water contamination records, violation history, and PFAS monitoring data for water utilities in ${countyDisplay}, ${stateRecord.name}. Source: EPA SDWIS and UCMR 5.`;
  const url = `https://waterutilityreport.com/counties/${stateParam}/${countyParam}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url },
    robots: "index, follow",
  };
}

export default async function CountyPage({
  params,
}: {
  params: Promise<{ state: string; county: string }>;
}) {
  const { state: stateParam, county: countyParam } = await params;

  const stateRecord = await prisma.state.findFirst({
    where: {
      OR: [
        { slug: stateParam },
        { abbreviation: stateParam.toUpperCase() },
      ],
    },
    select: { id: true, name: true, abbreviation: true, slug: true },
  });
  if (!stateRecord) notFound();

  const allStateUtilities = await prisma.utility.findMany({
    where: {
      state: { abbreviation: stateRecord.abbreviation },
      county_served: { not: null },
      publish_status: "published",
    },
    select: {
      id: true,
      slug: true,
      name: true,
      pwsid: true,
      county_served: true,
      city_served: true,
      population_served: true,
      risk_level: true,
      violations: {
        where: { is_health_based: true },
        orderBy: { violation_date: "desc" },
        select: {
          contaminant_name: true,
          contaminant_code: true,
          violation_date: true,
          resolution_date: true,
          violation_type: true,
        },
      },
    },
    take: 1000,
  });

  const utilities = allStateUtilities.filter(
    (u) => u.county_served && slugifyCounty(u.county_served) === countyParam
  );

  if (utilities.length === 0) notFound();

  const pwsids = utilities.map((u) => u.pwsid);
  const pfasHits = await prisma.pfasRecord.findMany({
    where: { pwsid: { in: pwsids }, suppressed: false, validated: true },
    select: { pwsid: true },
    distinct: ["pwsid"],
  });
  const pfasPwsidSet = new Set(pfasHits.map((r) => r.pwsid));

  const countyDisplay = formatCountyName(utilities[0].county_served!);
  const stateAbbr = stateRecord.abbreviation;
  const canonical = `https://waterutilityreport.com/counties/${stateParam}/${countyParam}`;

  const overallRisk = worstRisk(utilities.map((u) => u.risk_level));
  const openViolations = utilities.flatMap((u) =>
    u.violations.filter((v) => !v.resolution_date)
  );
  const totalPop = utilities.reduce((s, u) => s + u.population_served, 0);
  const utilitiesWithPfas = utilities.filter((u) => pfasPwsidSet.has(u.pwsid));

  const fmtDate = (d: Date | null | undefined) =>
    d
      ? new Date(d).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
          timeZone: "UTC",
        })
      : "—";

  const faqs = [
    {
      question: `What water contamination records exist for ${countyDisplay}, ${stateAbbr}?`,
      answer: `EPA records show ${utilities.length} water system${utilities.length !== 1 ? "s" : ""} serving ${countyDisplay}. ${openViolations.length > 0 ? `${openViolations.length} open health-based violation${openViolations.length !== 1 ? "s" : ""} are recorded in EPA SDWIS` : "No open health-based violations are currently recorded"}. ${utilitiesWithPfas.length > 0 ? `${utilitiesWithPfas.length} system${utilitiesWithPfas.length !== 1 ? "s" : ""} have PFAS monitoring records in the EPA UCMR 5 dataset` : "No PFAS monitoring records have been located in UCMR 5 for these systems"}.`,
    },
    {
      question: `Is ${countyDisplay} drinking water safe?`,
      answer: `This page shows official EPA compliance records — not a real-time safety determination. ${openViolations.length > 0 ? `${openViolations.length} open health-based violation${openViolations.length !== 1 ? "s" : ""} are recorded for water systems in ${countyDisplay}. Contact your specific utility for current status and remediation steps.` : `No open health-based violations are currently recorded for water systems in ${countyDisplay}, ${stateAbbr}. Water meets current federal standards per EPA records.`} For independent confirmation, use a state-certified laboratory.`,
    },
    {
      question: `Does ${countyDisplay} have PFAS in the water?`,
      answer: `${utilitiesWithPfas.length > 0 ? `${utilitiesWithPfas.length} water system${utilitiesWithPfas.length !== 1 ? "s" : ""} in ${countyDisplay} have records in the EPA UCMR 5 PFAS monitoring dataset (2023–2025). UCMR 5 monitoring detects PFAS compounds above the minimum reporting level — this is surveillance data, not a regulatory violation. EPA compliance deadlines for PFAS MCLs run through April 2029.` : `No PFAS records have been located for water systems in ${countyDisplay} in the EPA UCMR 5 dataset. Smaller systems may not have been required to participate in UCMR 5 monitoring.`}`,
    },
    {
      question: `How do I find contamination reports for my ${countyDisplay} water utility?`,
      answer: `Each water utility listed on this page has a full report at waterutilityreport.com, including violation history, PFAS monitoring records, and official source links. Your water bill confirms your specific provider. For independent testing, find state-certified laboratories at waterutilityreport.com/labs.`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: stateRecord.name,
        item: `https://waterutilityreport.com/states/${stateRecord.slug}`,
      },
      { "@type": "ListItem", position: 3, name: countyDisplay, item: canonical },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${countyDisplay}, ${stateAbbr} Water Contamination Records`,
    description: `Official EPA water quality and contamination records for ${utilities.length} water system${utilities.length !== 1 ? "s" : ""} in ${countyDisplay}, ${stateRecord.name}.`,
    url: canonical,
  };

  return (
    <>
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={collectionJsonLd} />

      <div className="min-h-screen bg-background">
        {/* Hero */}
        <div className="bg-wur-ink text-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
              <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
              <span>/</span>
              <Link href={`/states/${stateRecord.slug}`} className="hover:text-white/70 transition-colors">
                {stateRecord.name}
              </Link>
              <span>/</span>
              <span className="text-white/60">{countyDisplay}</span>
            </nav>
            <div className="flex items-start gap-3">
              <FileText className="w-6 h-6 text-white/40 mt-1 shrink-0" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">Water Contamination Records</p>
                <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">
                  {countyDisplay}, {stateAbbr} Water Contamination Records
                </h1>
                <div className="flex items-center gap-3 mt-2 text-sm text-white/55 flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {totalPop.toLocaleString()} residents served
                  </span>
                  <span>·</span>
                  <span>{utilities.length} water system{utilities.length !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Main */}
            <div className="lg:col-span-2 space-y-10">

              {/* What official records show — answer-first */}
              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">What official records show</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className={`rounded-xl border p-5 ${openViolations.length > 0 ? "border-wur-warning/50 bg-wur-warning-bg" : "border-border bg-card"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      {openViolations.length > 0
                        ? <AlertTriangle className="w-4 h-4 text-wur-warning" />
                        : <CheckCircle2 className="w-4 h-4 text-wur-safe" />}
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Open violations</p>
                    </div>
                    <p className={`text-2xl font-bold mb-1 ${openViolations.length > 0 ? "text-wur-warning" : "text-muted-foreground"}`}>
                      {openViolations.length > 0 ? openViolations.length : "None"}
                    </p>
                    <p className="text-xs text-muted-foreground">Health-based, across all utilities</p>
                  </div>

                  <div className={`rounded-xl border p-5 ${utilitiesWithPfas.length > 0 ? "border-amber-300 bg-amber-50/50" : "border-border bg-card"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Droplets className={`w-4 h-4 ${utilitiesWithPfas.length > 0 ? "text-amber-600" : "text-muted-foreground"}`} />
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">PFAS monitoring</p>
                    </div>
                    <p className={`text-2xl font-bold mb-1 ${utilitiesWithPfas.length > 0 ? "text-amber-700" : "text-muted-foreground"}`}>
                      {utilitiesWithPfas.length > 0 ? `${utilitiesWithPfas.length} system${utilitiesWithPfas.length !== 1 ? "s" : ""}` : "None"}
                    </p>
                    <p className="text-xs text-muted-foreground">EPA UCMR 5 records found</p>
                  </div>

                  <div className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Water systems</p>
                    </div>
                    <p className="text-2xl font-bold mb-1 text-foreground">{utilities.length}</p>
                    <p className="text-xs text-muted-foreground">{totalPop.toLocaleString()} people served</p>
                  </div>
                </div>

                {/* Answer-first paragraph */}
                <div className={`rounded-xl border p-6 ${openViolations.length > 0 ? "border-wur-warning/30 bg-wur-warning/5" : "border-wur-safe-border bg-wur-safe-bg"}`}>
                  <div className="flex items-start gap-3">
                    {openViolations.length > 0
                      ? <AlertTriangle className="w-4 h-4 text-wur-warning shrink-0 mt-0.5" />
                      : <CheckCircle2 className="w-4 h-4 text-wur-safe shrink-0 mt-0.5" />}
                    <p className="text-sm leading-relaxed text-foreground">
                      EPA records for water systems in <strong>{countyDisplay}, {stateAbbr}</strong> show{" "}
                      {openViolations.length > 0
                        ? <><strong className="text-wur-warning">{openViolations.length} open health-based violation{openViolations.length !== 1 ? "s" : ""}</strong> recorded in EPA SDWIS across {utilities.filter(u => u.violations.filter(v => !v.resolution_date).length > 0).length} provider{utilities.filter(u => u.violations.filter(v => !v.resolution_date).length > 0).length !== 1 ? "s" : ""}</>
                        : <><strong>no open health-based violations</strong> in EPA SDWIS</>
                      }.
                      {utilitiesWithPfas.length > 0 && <> {utilitiesWithPfas.length} system{utilitiesWithPfas.length !== 1 ? "s" : ""} have PFAS monitoring records in the EPA UCMR 5 dataset (2023–2025).</>}
                      {" "}Records on this page are sourced from EPA SDWIS and UCMR 5. This is official government data — not a health risk determination.
                    </p>
                  </div>
                </div>
              </section>

              {/* Water systems */}
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Water Systems in {countyDisplay}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  {utilities.length} EPA-tracked water system{utilities.length !== 1 ? "s" : ""} serve {countyDisplay}. Your water bill confirms your specific provider.
                </p>
                <div className="space-y-3">
                  {utilities.map((u) => {
                    const uRisk = u.risk_level as RiskLevel;
                    const uOpen = u.violations.filter((v) => !v.resolution_date).length;
                    const hasPfas = pfasPwsidSet.has(u.pwsid);
                    const hasRecordsPage = u.violations.length > 0 || hasPfas;
                    return (
                      <div key={u.slug} className="rounded-xl border border-border bg-card hover:border-wur-teal/40 transition-all">
                        <Link href={`/utilities/${u.slug}`} className="flex items-start gap-4 p-5 group">
                          <Droplets className="w-5 h-5 text-wur-teal shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h3 className="font-semibold text-foreground group-hover:text-wur-teal transition-colors">
                                {normalizeName(u.name)}
                              </h3>
                              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 capitalize ${RISK_COLORS[uRisk]}`}>
                                {uRisk}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
                              <span className="font-mono">{u.pwsid}</span>
                              <span>{u.population_served.toLocaleString()} served</span>
                              {u.city_served && <span>{u.city_served}</span>}
                              {uOpen > 0 && (
                                <span className="text-wur-warning font-medium">
                                  {uOpen} open violation{uOpen !== 1 ? "s" : ""}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                        {hasRecordsPage && (
                          <div className="px-5 pb-3 flex gap-2 border-t border-border/50 pt-3">
                            <Link
                              href={`/utilities/${u.slug}/records`}
                              className="text-[11px] px-2.5 py-1 rounded border border-border text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors font-medium"
                            >
                              Official records →
                            </Link>
                            {hasPfas && (
                              <Link
                                href={`/pfas-watchlist/utility/${u.pwsid}`}
                                className="text-[11px] px-2.5 py-1 rounded border border-amber-200 text-amber-700 hover:border-amber-400 transition-colors font-medium"
                              >
                                PFAS records →
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Active violations table */}
              {openViolations.length > 0 && (
                <section id="violations">
                  <h2 className="font-display text-2xl text-foreground mb-2">
                    Active Drinking Water Violations
                  </h2>
                  <p className="text-sm text-muted-foreground mb-5">
                    Source: EPA SDWIS. Open violations mean a contaminant exceeded its legal limit and the finding has not yet been formally resolved in the federal database.
                  </p>
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Utility</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden sm:table-cell">Contaminant</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hidden md:table-cell">Violation date</th>
                          <th className="text-right px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Records</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {utilities.flatMap((u) =>
                          u.violations
                            .filter((v) => !v.resolution_date)
                            .map((v, i) => {
                              const cName = v.contaminant_name ?? "Unknown contaminant";
                              return (
                                <tr key={`${u.slug}-${i}`} className="bg-card hover:bg-muted/30 transition-colors">
                                  <td className="px-4 py-3 text-xs">
                                    <Link href={`/utilities/${u.slug}`} className="font-medium text-foreground hover:text-wur-teal transition-colors">
                                      {normalizeName(u.name)}
                                    </Link>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">
                                    <span className="flex items-center gap-1.5">
                                      <AlertTriangle className="w-3 h-3 text-wur-warning shrink-0" />
                                      {cName}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">
                                    {fmtDate(v.violation_date)}
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <Link href={`/utilities/${u.slug}/records`} className="text-[11px] text-wur-teal hover:underline font-medium">
                                      View records →
                                    </Link>
                                  </td>
                                </tr>
                              );
                            })
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* What this does not mean */}
              <section className="rounded-xl border border-border bg-muted/30 p-6">
                <h2 className="font-display text-lg text-foreground mb-3">What this does not mean</h2>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/40 mt-0.5">—</span>
                    <span><strong className="text-foreground">Open violations do not necessarily mean current unsafe water.</strong> They indicate an unresolved regulatory finding. Contact your utility for current status.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/40 mt-0.5">—</span>
                    <span><strong className="text-foreground">PFAS monitoring records are surveillance data.</strong> EPA UCMR 5 detections above the minimum reporting level are not regulatory violations. The EPA PFAS rule compliance deadline is April 2029.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-muted-foreground/40 mt-0.5">—</span>
                    <span><strong className="text-foreground">This page does not assess health risk.</strong> WaterUtilityReport.com presents official government records only. Consult a licensed water quality specialist or physician for health advice.</span>
                  </li>
                </ul>
              </section>

              {/* Independent testing CTA */}
              <section className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-6">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">Independent Verification</p>
                <h2 className="font-display text-lg text-foreground mb-2">Get your water tested by a certified lab</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  EPA compliance data shows what utilities report to regulators. An independent certified laboratory test confirms what is actually in your tap water. Labs in {stateRecord.name} can test for PFAS (EPA Method 533 or 537.1), lead, nitrates, bacteria, and more.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/labs?state=${stateRecord.slug}`}
                    className="text-xs px-3 py-1.5 rounded-full border border-wur-teal/40 bg-white text-wur-teal hover:bg-teal-50 transition-colors font-medium"
                  >
                    Find certified labs in {stateRecord.name} →
                  </Link>
                  <Link
                    href="/treatment"
                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-colors"
                  >
                    Browse treatment options
                  </Link>
                </div>
              </section>

              <DataLimitationsNote />

              <section id="faq">
                <FaqSection faqs={faqs} title={`${countyDisplay} Water FAQs`} />
              </section>

              <SourcesBlock
                sources={[
                  { label: "EPA SDWIS — Violation & Compliance Data", url: "https://enviro.epa.gov/envirofacts/sdwis/search", note: "Federal drinking water database" },
                  { label: "EPA UCMR 5 — PFAS Monitoring Program", url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
                  { label: "EPA ECHO — Facility Reports", url: "https://echo.epa.gov/" },
                ]}
                lastUpdated={new Date().toISOString().split("T")[0]}
              />
            </div>

            {/* Sidebar */}
            <div>
              <div className="sticky top-20 space-y-5">
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    {countyDisplay} at a Glance
                  </p>
                  <div className="space-y-3">
                    {[
                      { label: "State", value: stateRecord.name },
                      { label: "Water systems", value: String(utilities.length), mono: true },
                      { label: "Population served", value: totalPop.toLocaleString(), mono: true },
                      { label: "Overall risk", value: overallRisk, color: `capitalize font-semibold ${RISK_COLORS[overallRisk].split(" ")[0]}` },
                      {
                        label: "Open violations",
                        value: String(openViolations.length),
                        mono: true,
                        color: openViolations.length > 0 ? "text-wur-warning font-semibold" : "text-wur-safe font-semibold",
                      },
                      { label: "PFAS records", value: utilitiesWithPfas.length > 0 ? `${utilitiesWithPfas.length} system${utilitiesWithPfas.length !== 1 ? "s" : ""}` : "None found", mono: true },
                    ].map(({ label, value, mono, color }) => (
                      <div key={label} className="flex items-start justify-between">
                        <span className="text-xs text-muted-foreground">{label}</span>
                        <span className={`text-xs ${mono ? "font-mono" : ""} ${color ?? "font-medium text-foreground"}`}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Water Systems</p>
                  <div className="space-y-2">
                    {utilities.map((u) => (
                      <Link
                        key={u.slug}
                        href={`/utilities/${u.slug}`}
                        className="flex items-center gap-2 text-xs text-wur-teal hover:underline"
                      >
                        <Droplets className="w-3 h-3 shrink-0" />
                        {normalizeName(u.name)}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Related</p>
                  <div className="space-y-2">
                    <Link href={`/states/${stateRecord.slug}`} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-wur-teal transition-colors">
                      <Building2 className="w-3 h-3 shrink-0" />
                      {stateRecord.name} water overview
                    </Link>
                    <Link href="/methodology" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-wur-teal transition-colors">
                      <FileText className="w-3 h-3 shrink-0" />
                      Data methodology
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
