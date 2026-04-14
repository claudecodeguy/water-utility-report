import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, MapPin, Droplets, FlaskConical, ArrowLeft } from "lucide-react";
import { getStateBySlug, contaminants, states } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) return {};
  return {
    title: `${state.name} Drinking Water Quality — Utilities, Contaminants & Reports`,
    description: `Water quality overview for ${state.name}: ${state.utilitiesCount.toLocaleString()} utilities tracked, key contaminants, treatment guidance, and official report links.`,
  };
}

const riskBgs: Record<string, string> = {
  safe: "bg-wur-safe-bg text-wur-safe border-wur-safe-border",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  moderate: "bg-wur-caution-bg text-wur-caution border-wur-caution-border",
  high: "bg-wur-warning-bg text-wur-warning border-wur-warning-border",
  critical: "bg-wur-danger-bg text-wur-danger border-wur-danger-border",
};

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params;
  const state = getStateBySlug(stateSlug);
  if (!state) notFound();

  // Real utilities from DB — top 20 by population
  const dbState = await prisma.state.findUnique({ where: { abbreviation: state.abbreviation } });
  const dbUtilities = dbState
    ? await prisma.utility.findMany({
        where: { state_id: dbState.id, publish_status: "published" },
        orderBy: { population_served: "desc" },
        take: 20,
        select: {
          slug: true,
          name: true,
          pwsid: true,
          population_served: true,
          risk_level: true,
          service_type: true,
          ownership_type: true,
        },
      })
    : [];

  const dbUtilityCount = dbState
    ? await prisma.utility.count({ where: { state_id: dbState.id } })
    : 0;

  const stateContaminants = contaminants.filter((c) =>
    c.affectedStates.includes(stateSlug)
  );

  const stateFaqs = [
    {
      question: `Who provides drinking water in ${state.name}?`,
      answer: `${state.name} has ${state.utilitiesCount.toLocaleString()} public water systems ranging from large municipal utilities serving millions to small community systems. About ${state.wellWaterPercent}% of ${state.name} residents rely on private wells. Use the ZIP lookup to find your specific utility.`,
    },
    {
      question: `What are the main water quality concerns in ${state.name}?`,
      answer: `The most commonly detected or concerning contaminants in ${state.name} include ${state.topContaminants.join(", ")}. ${state.summary.split(".").slice(0, 2).join(".")}`,
    },
    {
      question: `How is ${state.name} drinking water regulated?`,
      answer: `${state.name} water utilities are regulated under the federal Safe Drinking Water Act (SDWA) and enforced by the EPA. The state drinking water program has primacy (day-to-day enforcement authority). Utilities must publish annual Consumer Confidence Reports (CCRs) disclosing contaminant levels and any violations.`,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to map
          </Link>
          <div className="flex items-start gap-4">
            <div className="text-5xl font-display text-white/30 leading-none">{state.abbreviation}</div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">State Hub</p>
              <h1 className="font-display text-4xl sm:text-5xl text-white">{state.name} Water Quality</h1>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
            <div>
              <p className="text-2xl font-mono font-semibold text-white">{dbUtilityCount.toLocaleString()}</p>
              <p className="text-xs text-white/50 mt-0.5">Utilities in database</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-white">{(state.populationServed / 1_000_000).toFixed(1)}M</p>
              <p className="text-xs text-white/50 mt-0.5">Residents served</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-white">{state.wellWaterPercent}%</p>
              <p className="text-xs text-white/50 mt-0.5">On private wells</p>
            </div>
            <div>
              <p className="text-2xl font-mono font-semibold text-white">{state.topContaminants.length}</p>
              <p className="text-xs text-white/50 mt-0.5">Key contaminants tracked</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Drinking Water in {state.name}</h2>
              <p className="text-muted-foreground leading-relaxed">{state.summary}</p>
            </section>

            {/* Utilities from DB */}
            <section>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-2xl text-foreground">
                  Utilities in {state.name}
                </h2>
                <span className="text-xs text-muted-foreground font-mono">
                  Top 20 of {dbUtilityCount.toLocaleString()} by population
                </span>
              </div>
              {dbUtilities.length > 0 ? (
                <div className="space-y-2">
                  {dbUtilities.map((utility) => (
                    <Link
                      key={utility.slug}
                      href={`/utilities/${utility.slug}`}
                      className="group flex items-center gap-4 p-4 rounded-lg border border-border bg-card hover:border-wur-teal/50 hover:shadow-sm transition-all"
                    >
                      <Droplets className="w-4 h-4 text-wur-teal shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-foreground group-hover:text-wur-teal transition-colors text-sm truncate">
                              {utility.name}
                            </p>
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">
                              {utility.pwsid} · {utility.population_served.toLocaleString()} served
                            </p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${riskBgs[utility.risk_level]}`}>
                            {utility.risk_level}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal shrink-0 transition-colors" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Loading utility data…</p>
              )}
            </section>

            {/* Contaminant concerns */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">Key Contaminant Concerns in {state.name}</h2>
              {stateContaminants.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {stateContaminants.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/contaminants/${c.slug}`}
                      className="group flex flex-col p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <FlaskConical className="w-4 h-4 text-muted-foreground" />
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${riskBgs[c.riskLevel]}`}>
                          {c.riskLevel}
                        </span>
                      </div>
                      <h3 className="font-medium text-foreground group-hover:text-wur-teal transition-colors mb-1">
                        {c.shortName}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{c.definition}</p>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">No specific contaminants tracked for this state yet.</p>
              )}
            </section>

            <FaqSection faqs={stateFaqs} title={`${state.name} Water FAQs`} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href={`/well-water/${stateSlug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                  <MapPin className="w-3.5 h-3.5 shrink-0" /> {state.name} Well Water Guide
                </Link>
                <Link href={`/labs?state=${stateSlug}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors py-1">
                  <FlaskConical className="w-3.5 h-3.5 shrink-0" /> Certified Labs in {state.abbreviation}
                </Link>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Top Contaminants in {state.abbreviation}</h3>
              <div className="flex flex-wrap gap-2">
                {state.topContaminants.map((slug) => {
                  const c = contaminants.find((x) => x.slug === slug);
                  return (
                    <Link key={slug} href={`/contaminants/${slug}`} className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground hover:bg-wur-teal hover:text-white transition-colors">
                      {c?.shortName ?? slug}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Data source:</span> Utility data from EPA SDWIS.
                {dbUtilityCount > 0 && ` ${dbUtilityCount.toLocaleString()} active community water systems ingested.`}
                {" "}CCR contaminant data ingestion in progress.
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">Last updated: {state.lastUpdated}</p>
            </div>

            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground text-sm mb-3">Other States</h3>
              <div className="space-y-1">
                {states.filter((s) => s.slug !== stateSlug).map((s) => (
                  <Link key={s.slug} href={`/states/${s.slug}`} className="flex items-center justify-between py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group">
                    <span>{s.name}</span>
                    <span className="text-xs font-mono text-muted-foreground/50 group-hover:text-primary/60">{s.utilitiesCount.toLocaleString()}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
