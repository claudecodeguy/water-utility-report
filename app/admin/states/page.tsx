import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { states, getUtilitiesByState } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "States — Admin",
  robots: { index: false, follow: false },
};

export default function AdminStatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">States</h1>
        <p className="text-sm text-muted-foreground">{states.length} states in Stage 1</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Utilities</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Population</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Well Water %</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Updated</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {states.map((s) => {
              const tracked = getUtilitiesByState(s.slug);
              return (
                <tr key={s.slug} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg bg-wur-teal/10 flex items-center justify-center font-mono text-sm font-bold text-wur-teal shrink-0">
                        {s.abbreviation}
                      </span>
                      <p className="font-medium text-foreground">{s.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{tracked.length}</span>
                    <span className="text-xs ml-1">tracked / {s.utilitiesCount.toLocaleString()} total</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {(s.populationServed / 1e6).toFixed(1)}M
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{s.wellWaterPercent}%</td>
                  <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{s.lastUpdated}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-wur-safe">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/states/${s.slug}`} target="_blank" className="text-xs text-muted-foreground hover:text-wur-teal transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button className="text-xs text-wur-teal hover:underline">Edit</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
