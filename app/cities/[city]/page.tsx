import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Users, Droplets, FlaskConical, AlertTriangle } from "lucide-react";
import { getCityBySlug, getUtilityBySlug, getContaminantBySlug, getStateBySlug, cities } from "@/lib/mock-data";
import RiskMeter from "@/components/risk-meter";
import FaqSection from "@/components/faq-section";
import RelatedPages from "@/components/related-pages";
import SourcesBlock from "@/components/sources-block";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) return {};
  return {
    title: `${city.name}, ${city.stateAbbr} Tap Water Quality — Utilities & Contaminants`,
    description: `Drinking water quality in ${city.name}, ${city.stateAbbr}. Find your utility, key contaminants, and treatment options.`,
  };
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const state = getStateBySlug(city.state);
  const cityUtilities = city.utilities.map((slug) => getUtilityBySlug(slug)).filter(Boolean);
  const cityContaminants = city.topContaminants.map((slug) => getContaminantBySlug(slug)).filter(Boolean);

  // Overall risk = worst utility risk
  const riskOrder = ["safe", "low", "moderate", "high", "critical"] as const;
  type RLevel = typeof riskOrder[number];
  const overallRisk = cityUtilities.reduce<RLevel>((worst, u) => {
    const current = riskOrder.indexOf((u?.riskLevel ?? "safe") as RLevel);
    const prev = riskOrder.indexOf(worst);
    return current > prev ? ((u?.riskLevel ?? "safe") as RLevel) : worst;
  }, "safe");

  const relatedPages = [
    ...(state ? [{ href: `/states/${state.slug}`, label: `${state.name} State Overview`, type: "state" as const }] : []),
    ...cityUtilities.map((u) => ({
      href: `/utilities/${u!.slug}`,
      label: u!.name,
      type: "utility" as const,
      description: `${u!.riskLevel} risk · ${u!.populationServed.toLocaleString()} served`,
    })),
    ...cityContaminants.map((c) => ({
      href: `/contaminants/${c!.slug}`,
      label: c!.name,
      type: "contaminant" as const,
      description: c!.category,
    })),
  ];

  const sources = [
    { label: "EPA SDWIS Service Area Boundaries", note: "Utility-to-city mapping", url: "https://sdwis.epa.gov/" },
    { label: "U.S. Census Bureau — City Population Estimates" },
    ...(cityUtilities[0] ? [{ label: `${cityUtilities[0].name} CCR ${cityUtilities[0].lastCCR}`, url: cityUtilities[0].ccrUrl }] : []),
  ];

  const riskBgs: Record<string, string> = {
    safe: "bg-wur-safe-bg text-wur-safe border-wur-safe-border",
    low: "bg-emerald-50 text-emerald-700 border-emerald-200",
    moderate: "bg-wur-caution-bg text-wur-caution border-wur-caution-border",
    high: "bg-wur-warning-bg text-wur-warning border-wur-warning-border",
    critical: "bg-wur-danger-bg text-wur-danger border-wur-danger-border",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-br from-wur-teal-dark to-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            {state && (
              <>
                <Link href={`/states/${state.slug}`} className="hover:text-white/70 transition-colors">{state.name}</Link>
                <span>/</span>
              </>
            )}
            <span className="text-white/60">{city.name}</span>
          </nav>

          <div className="flex items-start gap-3">
            <Building2 className="w-6 h-6 text-white/40 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">City Water Report</p>
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight">
                {city.name}, {city.stateAbbr}
              </h1>
              <div className="flex items-center gap-3 mt-2 text-sm text-white/55">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  {city.population.toLocaleString()} residents
                </span>
                <span>·</span>
                <span>{cityUtilities.length} utility provider{cityUtilities.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Direct answer */}
            <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Summary</p>
              <p className="text-foreground leading-relaxed">{city.summary}</p>
            </section>

            {/* Risk overview */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-semibold text-foreground mb-5">Overall Water Quality Assessment</h2>
              <RiskMeter level={overallRisk} />
              <div className="mt-4 p-3 rounded-lg bg-wur-caution-bg border border-wur-caution-border">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-wur-caution mt-0.5 shrink-0" />
                  <p className="text-xs text-wur-caution leading-relaxed">
                    <strong>Service may vary by neighborhood.</strong> {city.serviceNote}
                  </p>
                </div>
              </div>
            </section>

            {/* Utilities */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">
                Water Provider{cityUtilities.length !== 1 ? "s" : ""} for {city.name}
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                The following utilities likely serve {city.name} based on EPA service-area data.
                Your water bill is the most reliable confirmation.
              </p>
              <div className="space-y-4">
                {cityUtilities.map((u) => u && (
                  <Link
                    key={u.slug}
                    href={`/utilities/${u.slug}`}
                    className="group flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-md transition-all"
                  >
                    <Droplets className="w-5 h-5 text-wur-teal shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-semibold text-foreground group-hover:text-wur-teal transition-colors">
                          {u.name}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${riskBgs[u.riskLevel]}`}>
                          {u.riskLevel}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-3">
                        <div>
                          <span className="text-xs text-muted-foreground">System ID</span>
                          <span className="ml-2 text-xs font-mono">{u.systemId}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Served</span>
                          <span className="ml-2 text-xs font-mono">{u.populationServed.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Violations</span>
                          <span className={`ml-2 text-xs font-mono font-semibold ${u.violations === 0 ? "text-wur-safe" : "text-wur-danger"}`}>
                            {u.violations}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">Source</span>
                          <span className="ml-2 text-xs">{u.waterSource.split("(")[0].trim().split(",")[0]}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {u.contaminants
                          .filter((c) => c.detected && c.status !== "safe")
                          .slice(0, 3)
                          .map((c, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                              {c.name}
                            </span>
                          ))}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Contaminants */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">
                Key Water Quality Issues in {city.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cityContaminants.map((c) => c && (
                  <Link
                    key={c.slug}
                    href={`/contaminants/${c.slug}`}
                    className="group flex flex-col p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 transition-all"
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
                    <p className="text-xs font-mono text-muted-foreground mt-2">
                      EPA limit: {c.epaLimit}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            <FaqSection faqs={city.faqs} title={`${city.name} Water FAQs`} />
            <RelatedPages pages={relatedPages} />
            <SourcesBlock sources={sources} lastUpdated={city.lastUpdated} />
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-5">
              {/* Quick links */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Quick Links</p>
                <div className="space-y-2">
                  {cityUtilities.map((u) => u && (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Droplets className="w-3.5 h-3.5 shrink-0" />
                      {u.shortName} — Full Report
                    </Link>
                  ))}
                  {state && (
                    <Link
                      href={`/states/${state.slug}`}
                      className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                      {state.name} State Hub
                    </Link>
                  )}
                </div>
              </div>

              {/* Summary stats */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  City At a Glance
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Population</p>
                    <p className="text-lg font-mono font-semibold text-foreground">
                      {city.population.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Utilities serving city</p>
                    <p className="text-lg font-mono font-semibold text-foreground">{cityUtilities.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contaminants monitored</p>
                    <p className="text-lg font-mono font-semibold text-foreground">{city.topContaminants.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Overall risk</p>
                    <p className={`text-sm font-semibold capitalize ${
                      overallRisk === "safe" ? "text-wur-safe" :
                      overallRisk === "low" ? "text-emerald-600" :
                      overallRisk === "moderate" ? "text-wur-caution" :
                      "text-wur-danger"
                    }`}>
                      {overallRisk}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contaminant chips */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Tracked Contaminants
                </p>
                <div className="flex flex-wrap gap-2">
                  {cityContaminants.map((c) => c && (
                    <Link
                      key={c.slug}
                      href={`/contaminants/${c.slug}`}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground hover:bg-wur-teal hover:text-white transition-colors"
                    >
                      {c.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
