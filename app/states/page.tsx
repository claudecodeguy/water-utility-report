import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { states } from "@/lib/mock-data";
import contaminants from "@/lib/content/contaminants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse U.S. Drinking Water by State",
  description: "Browse water quality, utilities, and contaminant concerns by U.S. state. Currently tracking 5 states.",
};

export default function StatesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Directory</p>
          <h1 className="font-display text-4xl text-white mb-3">Browse by State</h1>
          <p className="text-white/60 max-w-xl">
            Stage 1 coverage: 5 states, {states.reduce((s, st) => s + st.utilitiesCount, 0).toLocaleString()}+ utilities tracked.
            More states launching in Phase 2.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => {
            // Show the most common contaminants as context tags (all are nationally relevant)
            const stateContaminants = contaminants.slice(0, 3);
            return (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group relative flex flex-col bg-card border border-border rounded-xl p-6 hover:border-wur-teal/50 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 text-[80px] font-display text-wur-teal/5 group-hover:text-wur-teal/10 transition-colors leading-none select-none">
                  {state.abbreviation}
                </div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <MapPin className="w-4 h-4 text-wur-teal" />
                    <span className="text-xs font-mono text-muted-foreground">
                      {state.utilitiesCount.toLocaleString()} utilities
                    </span>
                  </div>
                  <h2 className="font-display text-2xl text-foreground group-hover:text-wur-teal transition-colors mb-1">
                    {state.name}
                  </h2>
                  <p className="text-xs text-muted-foreground font-mono mb-4">
                    {(state.populationServed / 1_000_000).toFixed(1)}M residents served
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{state.summary}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {stateContaminants.slice(0, 3).map((c) => (
                      <span key={c.slug} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {c.shortName}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-xs font-medium text-wur-teal mt-4">
                    View {state.name} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-xl border border-border bg-muted/30 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            More states are planned for Phase 2 (10–15 states) and Phase 3 (national coverage).
            Each state requires data QA, legal review, and content validation before launch.
          </p>
        </div>
      </div>
    </div>
  );
}
