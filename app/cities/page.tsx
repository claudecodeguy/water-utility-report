import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import stateContent from "@/lib/content/states";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Quality by City — Water Utility Report",
  description: "Find drinking water quality data for your city. Browse by state to find your local utility, contaminant levels, and treatment guidance.",
  robots: { index: false, follow: true },
};

export default function CitiesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Browse</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Water Quality by City
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            City-level water quality pages are expanding in Phase 2. For now, browse by state
            to find your utility and local water quality data.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">How to find your city</p>
          <p className="text-foreground leading-relaxed">
            Select your state below to browse all tracked utilities. Each utility page lists the cities
            and communities it serves, contaminant detection history, violation records, and treatment guidance.
            You can also use the ZIP code search on the homepage.
          </p>
        </div>

        <h2 className="font-display text-2xl text-foreground mb-5">Browse by State</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stateContent.map((state) => (
            <Link
              key={state.slug}
              href={`/states/${state.slug}`}
              className="group flex items-center justify-between p-5 rounded-xl border border-border bg-card hover:border-wur-teal/50 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-wur-teal/10 flex items-center justify-center font-mono text-sm font-bold text-wur-teal shrink-0">
                  {state.abbreviation}
                </div>
                <div>
                  <p className="font-semibold text-foreground group-hover:text-wur-teal transition-colors">
                    {state.name}
                  </p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {(state.populationServed / 1e6).toFixed(1)}M residents
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
