import Link from "next/link";
import { ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import { contaminants } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contaminants — Admin",
  robots: { index: false, follow: false },
};

const riskColors: Record<string, string> = {
  safe: "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  high: "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
  critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
};

export default function AdminContaminantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">Contaminants</h1>
          <p className="text-sm text-muted-foreground">{contaminants.length} contaminants indexed</p>
        </div>
        <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option>All Categories</option>
          <option>PFAS / Forever Chemicals</option>
          <option>Heavy Metals</option>
          <option>Nitrates</option>
          <option>Disinfection Byproducts</option>
          <option>Minerals</option>
        </select>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Contaminant</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">EPA Limit</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Well Relevant</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Updated</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {contaminants.map((c) => (
              <tr key={c.slug} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-medium text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{c.slug}</p>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{c.category}</td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${riskColors[c.riskLevel] || riskColors.safe}`}>
                    {c.riskLevel}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{c.epaLimit}</td>
                <td className="py-3 px-4">
                  {c.wellWaterRelevant ? (
                    <CheckCircle2 className="w-4 h-4 text-wur-caution" />
                  ) : (
                    <span className="text-xs text-muted-foreground">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{c.lastUpdated}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/contaminants/${c.slug}`}
                      target="_blank"
                      className="text-xs text-muted-foreground hover:text-wur-teal transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button className="text-xs text-wur-teal hover:underline">Edit</button>
                    <span className="inline-flex items-center gap-1 text-xs text-wur-safe">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Live
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
