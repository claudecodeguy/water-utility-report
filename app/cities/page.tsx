import Link from "next/link";
import { ArrowRight, Building2, Users, AlertTriangle } from "lucide-react";
import { cities, utilities } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "U.S. Cities — Drinking Water Quality by City",
  description:
    "Browse drinking water quality data by city. Find your water utility, detected contaminants, violation history, and treatment options for major U.S. cities.",
};

const riskColors: Record<string, { text: string; bg: string; border: string }> = {
  safe: { text: "text-wur-safe", bg: "bg-wur-safe-bg", border: "border-wur-safe-border" },
  low: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  moderate: { text: "text-wur-caution", bg: "bg-wur-caution-bg", border: "border-wur-caution-border" },
  high: { text: "text-wur-warning", bg: "bg-wur-warning-bg", border: "border-wur-warning-border" },
  critical: { text: "text-wur-danger", bg: "bg-wur-danger-bg", border: "border-wur-danger-border" },
};

export default function CitiesPage() {
  const citiesWithData = cities.map((city) => {
    const cityUtilities = utilities.filter((u) =>
      city.utilities.includes(u.slug)
    );
    const riskOrder = ["safe", "low", "moderate", "high", "critical"] as const;
    type RLevel = (typeof riskOrder)[number];
    const overallRisk = cityUtilities.reduce<RLevel>((worst, u) => {
      return riskOrder.indexOf(u.riskLevel as RLevel) > riskOrder.indexOf(worst)
        ? (u.riskLevel as RLevel)
        : worst;
    }, "safe");
    return { city, cityUtilities, overallRisk };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Browse</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Water Quality by City
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            Find water quality summaries, utility details, and contaminant data for major
            U.S. cities. Coverage expanding quarterly — Stage 1 includes select cities across
            5 states.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {[
            { label: "Cities Tracked", value: cities.length },
            { label: "States Covered", value: "5" },
            { label: "Utilities Indexed", value: utilities.length },
            { label: "ZIP Codes Mapped", value: "12+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-xl border border-border bg-card">
              <p className="font-display text-3xl text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* City grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {citiesWithData.map(({ city, cityUtilities, overallRisk }) => {
            const rc = riskColors[overallRisk] || riskColors.safe;
            return (
              <Link
                key={city.slug}
                href={`/cities/${city.slug}`}
                className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="font-display text-xl text-foreground group-hover:text-wur-teal transition-colors">
                        {city.name}
                      </h2>
                      <span className="font-mono text-xs text-muted-foreground">{city.stateAbbr}</span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {(city.population / 1e6).toFixed(1)}M residents
                    </p>
                  </div>
                  <span className={`text-xs font-semibold capitalize px-2.5 py-1 rounded-full border ${rc.text} ${rc.bg} ${rc.border}`}>
                    {overallRisk}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {city.summary}
                </p>

                {/* Utilities */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cityUtilities.map((u) => (
                    <span
                      key={u.slug}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-secondary text-muted-foreground"
                    >
                      <Building2 className="w-3 h-3" />
                      {u.shortName}
                    </span>
                  ))}
                </div>

                {/* Top contaminants */}
                {city.topContaminants.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-auto">
                    {city.topContaminants.slice(0, 3).map((c) => (
                      <span
                        key={c}
                        className="text-xs px-2 py-0.5 rounded-full bg-wur-teal/8 text-wur-teal border border-wur-teal/15"
                      >
                        {c}
                      </span>
                    ))}
                    {city.topContaminants.length > 3 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        +{city.topContaminants.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-1.5 mt-4 text-xs text-wur-teal font-medium">
                  View city report <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Coverage note */}
        <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-wur-caution mb-1">Stage 1 Coverage</p>
              <p className="text-sm text-wur-caution/80 leading-relaxed">
                Our current database covers select major cities in California, Texas, Florida, Arizona, and Ohio.
                If your city isn&apos;t listed, check the{" "}
                <a
                  href="https://sdwis.epa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2"
                >
                  EPA&apos;s SDWIS database
                </a>{" "}
                for comprehensive national coverage. We expand monthly — check back or{" "}
                <Link href="/states" className="underline underline-offset-2">
                  browse by state
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
