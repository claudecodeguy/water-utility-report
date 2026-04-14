import Link from "next/link";
import { Wrench, ArrowRight } from "lucide-react";
import { treatmentMethods } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Treatment Methods — Reverse Osmosis, Carbon Filters & More",
  description: "Guides to home water treatment methods — what each technology removes, what it doesn't, cost, maintenance, and when to use it.",
};

const typeLabels: Record<string, string> = {
  "point-of-use": "Under-sink / Countertop",
  "point-of-entry": "Whole-Home",
  "both": "Flexible",
};

export default function TreatmentIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Treatment Guidance</p>
          <h1 className="font-display text-4xl text-white mb-3">Water Treatment Methods</h1>
          <p className="text-white/60 max-w-xl">
            Not all filters solve all problems. These guides explain exactly what each
            technology removes, what it doesn&apos;t, and when to use it.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {treatmentMethods.map((method) => (
            <Link
              key={method.slug}
              href={`/treatment/${method.slug}`}
              className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <Wrench className="w-4 h-4 text-wur-teal" />
                <span className="text-xs text-muted-foreground font-mono">{typeLabels[method.type]}</span>
              </div>
              <h3 className="font-semibold text-foreground text-lg group-hover:text-wur-teal transition-colors mb-2">
                {method.shortName}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3 flex-1 mb-4">{method.summary}</p>

              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide">Addresses</p>
                <div className="flex flex-wrap gap-1">
                  {method.solves.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-wur-safe-bg text-wur-safe border border-wur-safe-border">
                      {s.split("(")[0].trim()}
                    </span>
                  ))}
                  {method.solves.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      +{method.solves.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <span className="text-xs font-mono text-muted-foreground">{method.costRange.split(".")[0]}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
