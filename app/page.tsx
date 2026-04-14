import Link from "next/link";
import { ArrowRight, FlaskConical, Wrench, MapPin, ShieldCheck, Database, BookOpen } from "lucide-react";
import ZipLookup from "@/components/zip-lookup";
import { states, contaminants, treatmentMethods } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const featuredContaminants = ["pfas", "lead", "nitrates", "disinfection-byproducts"];

const trustStats = (totalUtilities: number) => [
  { value: totalUtilities.toLocaleString(), label: "Utilities tracked", sub: "across 5 launch states" },
  { value: "6", label: "Contaminants mapped", sub: "with treatment guidance" },
  { value: "100%", label: "Official data sources", sub: "EPA, SDWIS, ECHO, WQP" },
];

const howItWorks = [
  {
    step: "01",
    title: "Enter your ZIP code",
    desc: "We match your ZIP to your likely public water utility using EPA service-area data.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "See what's in your water",
    desc: "We surface the key contaminants detected, their levels, and what they mean in plain English.",
    icon: FlaskConical,
  },
  {
    step: "03",
    title: "Understand your options",
    desc: "Matched treatment guidance, official report links, certified labs, and clear next steps.",
    icon: Wrench,
  },
];

const methodologyPoints = [
  { icon: Database, label: "EPA SDWIS/ECHO datasets", desc: "Core utility and violation data" },
  { icon: BookOpen, label: "Consumer Confidence Reports", desc: "Annual CCR data from utilities" },
  { icon: ShieldCheck, label: "EPA Water Quality Portal", desc: "Supporting sampling data" },
  { icon: ShieldCheck, label: "State regulatory datasets", desc: "Where terms allow public use" },
];

export default async function HomePage() {
  const [dbStates, totalUtilities] = await Promise.all([
    prisma.state.findMany({
      select: { abbreviation: true, _count: { select: { utilities: true } } },
    }),
    prisma.utility.count(),
  ]);
  const dbCountMap = Object.fromEntries(
    dbStates.map((s) => [s.abbreviation, s._count.utilities])
  );

  const featuredContaminantData = contaminants.filter((c) =>
    featuredContaminants.includes(c.slug)
  );

  const riskColors: Record<string, string> = {
    safe: "text-wur-safe",
    low: "text-emerald-600",
    moderate: "text-wur-caution",
    high: "text-wur-warning",
    critical: "text-wur-danger",
  };

  const riskBgs: Record<string, string> = {
    safe: "bg-wur-safe-bg border-wur-safe-border",
    low: "bg-emerald-50 border-emerald-200",
    moderate: "bg-wur-caution-bg border-wur-caution-border",
    high: "bg-wur-warning-bg border-wur-warning-border",
    critical: "bg-wur-danger-bg border-wur-danger-border",
  };

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="topo-bg relative min-h-screen -mt-16 pt-16 flex items-center overflow-hidden">
        {/* Gradient fade bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            {/* Tag line */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-wur-aqua animate-pulse" />
              <span className="text-xs text-white/70 font-medium tracking-wide">
                5 states · 5 utilities · official data only
              </span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl text-white leading-[1.05] mb-6 animate-fade-up opacity-0 stagger-1">
              Know What&apos;s in{" "}
              <em className="text-wur-aqua not-italic block">Your Water.</em>
            </h1>

            <p className="text-lg text-white/65 leading-relaxed mb-10 max-w-lg animate-fade-up opacity-0 stagger-2">
              Search your ZIP code to find your water utility, understand the key
              contaminants in your area, and see matched treatment options —
              built from official EPA data.
            </p>

            <div className="animate-fade-up opacity-0 stagger-3">
              <ZipLookup variant="hero" />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 animate-fade-up opacity-0 stagger-4">
              <span className="text-xs text-white/30 uppercase tracking-widest">Or browse by</span>
              {states.map((state) => (
                <Link
                  key={state.slug}
                  href={`/states/${state.slug}`}
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  {state.name}
                </Link>
              ))}
              <span className="text-white/20">···</span>
            </div>
          </div>
        </div>

        {/* Decorative element */}
        <div className="absolute right-0 top-0 w-1/2 h-full opacity-[0.04] pointer-events-none hidden xl:block">
          <svg viewBox="0 0 600 800" className="w-full h-full" fill="none">
            <circle cx="300" cy="400" r="280" stroke="white" strokeWidth="0.5" />
            <circle cx="300" cy="400" r="220" stroke="white" strokeWidth="0.5" />
            <circle cx="300" cy="400" r="160" stroke="white" strokeWidth="0.5" />
            <circle cx="300" cy="400" r="100" stroke="white" strokeWidth="0.5" />
            <circle cx="300" cy="400" r="40" stroke="white" strokeWidth="0.5" />
          </svg>
        </div>
      </section>

      {/* ── TRUST STATS ──────────────────────────────────────────────────── */}
      <section className="bg-wur-teal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left sm:divide-x divide-white/20">
            {trustStats(totalUtilities).map((stat, i) => (
              <div key={i} className={i > 0 ? "sm:pl-8" : ""}>
                <div className="font-display text-4xl text-white mb-1">{stat.value}</div>
                <div className="text-base font-semibold text-white/90">{stat.label}</div>
                <div className="text-xs text-white/50 mt-0.5 font-mono">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY STATE ──────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Stage 1 Coverage</p>
              <h2 className="font-display text-4xl text-foreground">Browse by State</h2>
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">
              More states coming in Phase 2
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {states.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group relative flex flex-col bg-card border border-border rounded-lg p-5 hover:border-wur-teal/50 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-wur-teal/5 group-hover:bg-wur-teal/10 transition-colors" />
                <div className="text-3xl font-display text-wur-teal/60 mb-3">{state.abbreviation}</div>
                <div className="font-semibold text-foreground group-hover:text-wur-teal transition-colors mb-1">
                  {state.name}
                </div>
                <div className="text-xs text-muted-foreground font-mono mb-3">
                  {(dbCountMap[state.abbreviation] ?? state.utilitiesCount).toLocaleString()} utilities
                </div>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {state.topContaminants.slice(0, 2).map((c) => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {c.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-wur-teal" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CONTAMINANTS ─────────────────────────────────────────── */}
      <section className="py-20 bg-wur-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Common Concerns</p>
            <h2 className="font-display text-4xl text-foreground mb-3">
              What Are People Worried About?
            </h2>
            <p className="text-muted-foreground max-w-xl">
              These contaminants appear most frequently in U.S. public water systems and generate the most consumer questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredContaminantData.map((c) => (
              <Link
                key={c.slug}
                href={`/contaminants/${c.slug}`}
                className="group flex flex-col bg-white rounded-lg border border-border p-6 hover:border-wur-teal/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-widest ${riskColors[c.riskLevel]}`}>
                      {c.riskLevel} risk level
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-wur-teal transition-colors">
                      {c.shortName}
                    </h3>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${riskBgs[c.riskLevel]} ${riskColors[c.riskLevel]}`}>
                    {c.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {c.summary}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-wur-teal font-medium mt-auto">
                  Learn about {c.shortName}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/contaminants"
              className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal hover:text-wur-teal/80 transition-colors"
            >
              View all {contaminants.length} contaminant guides
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">How WUR Works</p>
            <h2 className="font-display text-4xl text-foreground">
              From ZIP Code to Answer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-wur-teal/10 border border-wur-teal/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-wur-teal" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TREATMENT METHODS PREVIEW ─────────────────────────────────────── */}
      <section className="py-20 bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Treatment Guidance</p>
              <h2 className="font-display text-4xl text-white">
                Find the Right Filter
              </h2>
              <p className="text-white/55 mt-2 max-w-lg text-sm">
                Not all filters solve all problems. Matched treatment guides tell you exactly what each technology removes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {treatmentMethods.slice(0, 3).map((method) => (
              <Link
                key={method.slug}
                href={`/treatment/${method.slug}`}
                className="group flex flex-col bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 hover:border-wur-aqua/40 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wide">
                    {method.type === "point-of-use" ? "Under-sink / countertop" :
                      method.type === "point-of-entry" ? "Whole-home" : "Point-of-use or whole-home"}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-wur-aqua transition-colors">
                  {method.shortName}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">{method.summary}</p>
                <div className="mt-auto">
                  <p className="text-xs text-white/35 mb-1.5">Addresses:</p>
                  <div className="flex flex-wrap gap-1">
                    {method.solves.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                        {s.split("(")[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link
              href="/treatment"
              className="inline-flex items-center gap-2 text-sm font-medium text-wur-aqua hover:text-wur-aqua/80 transition-colors"
            >
              View all {treatmentMethods.length} treatment guides
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY TRUST ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Built on Official Data</p>
              <h2 className="font-display text-4xl text-foreground mb-4 leading-tight">
                What We Use and What We Won&apos;t
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Water Utility Report is built entirely on official U.S. government datasets and public
                regulatory records. We do not scrape competitor databases, republish third-party
                certification data without authorization, or publish content that hasn&apos;t been
                reviewed for legal and scientific accuracy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Every data point preserves its source provenance, ingestion date, and confidence level.
                We separate what the data says from what it means — and we tell you which is which.
              </p>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal border border-wur-teal/40 rounded-md px-4 py-2.5 hover:bg-wur-teal/5 transition-colors"
              >
                Read our full methodology <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {methodologyPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <div key={i} className="p-5 rounded-lg border border-border bg-card">
                    <Icon className="w-5 h-5 text-wur-teal mb-3" />
                    <p className="text-sm font-semibold text-foreground mb-1">{point.label}</p>
                    <p className="text-xs text-muted-foreground">{point.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="py-16 bg-wur-parchment border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl text-foreground mb-3">
            Ready to check your water?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Enter your ZIP code to find your utility and see what&apos;s been detected in your area.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ZipLookup variant="inline" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
