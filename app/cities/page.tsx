import Link from "next/link";
import { ArrowRight, Droplets } from "lucide-react";
import { prisma } from "@/lib/prisma";
import stateContent from "@/lib/content/states";
import StateCitiesSection from "@/components/state-cities-section";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Water Quality by City — Water Utility Report",
  description: "Find drinking water quality data for your city. See EPA violation history, risk levels, and treatment guidance for utilities in your area.",
};

function slugifyCity(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default async function CitiesPage() {
  const stateAbbrs = stateContent.map((s) => s.abbreviation);

  const citiesByState = await Promise.all(
    stateAbbrs.map(async (abbr) => {
      const rows = await prisma.utility.findMany({
        where: {
          state: { abbreviation: abbr },
          city_served: { not: null },
          publish_status: "published",
        },
        select: { city_served: true, risk_level: true, population_served: true },
      });

      const riskOrder = ["safe", "low", "moderate", "high", "critical"];
      const cityMap = new Map<string, { pop: number; worstRisk: string }>();

      for (const u of rows) {
        const city = u.city_served!;
        const existing = cityMap.get(city);
        const currentRiskIdx = riskOrder.indexOf(u.risk_level);
        const existingRiskIdx = existing ? riskOrder.indexOf(existing.worstRisk) : -1;
        cityMap.set(city, {
          pop: (existing?.pop ?? 0) + u.population_served,
          worstRisk: currentRiskIdx > existingRiskIdx ? u.risk_level : (existing?.worstRisk ?? u.risk_level),
        });
      }

      const cities = Array.from(cityMap.entries())
        .sort((a, b) => b[1].pop - a[1].pop)
        .map(([name, data]) => ({
          name,
          slug: `${slugifyCity(name)}-${abbr.toLowerCase()}`,
          pop: data.pop,
          worstRisk: data.worstRisk,
        }));

      const state = stateContent.find((s) => s.abbreviation === abbr)!;
      return { state, cities };
    })
  );

  const activeStates = citiesByState.filter(({ cities }) => cities.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-ink text-white border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Browse</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Water Quality by City
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            Find your city's water quality report. See EPA violation history, risk levels, and treatment guidance for your local utility.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {activeStates.map(({ state, cities }) => (
          <div key={state.abbreviation}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-wur-teal/10 flex items-center justify-center font-mono text-sm font-bold text-wur-teal shrink-0">
                  {state.abbreviation}
                </div>
                <div>
                  <h2 className="font-display text-xl text-foreground">{state.name}</h2>
                  <p className="text-xs text-muted-foreground">{cities.length} cities</p>
                </div>
              </div>
              <Link
                href={`/states/${state.slug}`}
                className="text-xs text-muted-foreground hover:text-wur-teal transition-colors flex items-center gap-1"
              >
                All utilities <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <StateCitiesSection cities={cities} />
          </div>
        ))}

        <div className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <div className="flex items-start gap-3">
            <Droplets className="w-4 h-4 text-wur-teal mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">Don't see your city?</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Browse your state to find your utility directly, or use the search on the homepage.
                We currently cover 25 states with more being added regularly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
