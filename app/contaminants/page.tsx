import Link from "next/link";
import { FlaskConical, ArrowRight } from "lucide-react";
import contaminants from "@/lib/content/contaminants";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contaminants in U.S. Drinking Water — Guide & Health Effects",
  description: "Plain-English guides to PFAS, lead, nitrates, arsenic, disinfection byproducts, and more — including sources, health effects, EPA limits, and treatment options.",
};

const categories = [...new Set(contaminants.map((c) => c.category))];

const riskBgs: Record<string, string> = {
  safe: "bg-wur-safe-bg text-wur-safe border-wur-safe-border",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  moderate: "bg-wur-caution-bg text-wur-caution border-wur-caution-border",
  high: "bg-wur-warning-bg text-wur-warning border-wur-warning-border",
  critical: "bg-wur-danger-bg text-wur-danger border-wur-danger-border",
};

export default function ContaminantsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Reference Library</p>
          <h1 className="font-display text-4xl text-white mb-3">Contaminant Guides</h1>
          <p className="text-white/60 max-w-xl">
            Plain-English explanations of the most common U.S. drinking water contaminants —
            what they are, where they come from, health effects, and how to address them.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {categories.map((category) => {
          const catContaminants = contaminants.filter((c) => c.category === category);
          return (
            <div key={category} className="mb-12">
              <h2 className="font-display text-2xl text-foreground mb-5">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catContaminants.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/contaminants/${c.slug}`}
                    className="group flex items-start gap-4 p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                  >
                    <FlaskConical className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-foreground group-hover:text-wur-teal transition-colors">
                          {c.shortName}
                        </h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium shrink-0 ${riskBgs[c.riskLevel]}`}>
                          {c.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">{c.summary}</p>
                      <p className="text-xs font-mono text-muted-foreground mt-2">
                        EPA limit: {c.epaLimit}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors mt-0.5 shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
