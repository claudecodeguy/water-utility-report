import Link from "next/link";
import { ExternalLink, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { utilities } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilities — Admin",
  robots: { index: false, follow: false },
};

const riskColors: Record<string, string> = {
  safe: "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  high: "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
  critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
};

// Mock publish statuses
const publishStatuses: Record<string, "published" | "review" | "draft"> = {
  "los-angeles-department-of-water-and-power": "published",
  "houston-water": "published",
  "miami-dade-water-and-sewer": "published",
  "phoenix-water-services": "review",
  "columbus-division-of-water": "draft",
};

export default function AdminUtilitiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">Utilities</h1>
          <p className="text-sm text-muted-foreground">{utilities.length} utilities in Stage 1 database</p>
        </div>
        <div className="flex gap-2">
          <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>All States</option>
            <option>California</option>
            <option>Texas</option>
            <option>Florida</option>
            <option>Arizona</option>
            <option>Ohio</option>
          </select>
          <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <option>All Statuses</option>
            <option>Published</option>
            <option>Review</option>
            <option>Draft</option>
          </select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Utility</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Population</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last CCR</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {utilities.map((u) => {
              const publishStatus = publishStatuses[u.slug] ?? "draft";
              return (
                <tr key={u.slug} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-medium text-foreground">{u.shortName}</p>
                    <p className="text-xs text-muted-foreground font-mono">{u.systemId}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-xs text-muted-foreground">{u.stateAbbr}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${riskColors[u.riskLevel] || riskColors.safe}`}>
                      {u.riskLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {publishStatus === "published" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-wur-safe">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Published
                      </span>
                    ) : publishStatus === "review" ? (
                      <span className="inline-flex items-center gap-1 text-xs text-wur-caution">
                        <AlertTriangle className="w-3.5 h-3.5" /> Review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3.5 h-3.5" /> Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {(u.populationServed / 1e6).toFixed(1)}M
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                    {u.lastCCR}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/utilities/${u.slug}`}
                        target="_blank"
                        className="text-xs text-muted-foreground hover:text-wur-teal transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button className="text-xs text-wur-teal hover:underline">Edit</button>
                      {publishStatus !== "published" ? (
                        <button className="text-xs bg-wur-teal text-white px-2.5 py-1 rounded-md hover:bg-wur-teal-dark transition-colors">
                          Publish
                        </button>
                      ) : (
                        <button className="text-xs border border-border text-muted-foreground px-2.5 py-1 rounded-md hover:border-wur-danger/40 hover:text-wur-danger transition-colors">
                          Unpublish
                        </button>
                      )}
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
