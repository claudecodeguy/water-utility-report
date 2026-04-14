import { CheckCircle2, XCircle, RefreshCw, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Data Sources — Admin",
  robots: { index: false, follow: false },
};

const sources = [
  { name: "EPA SDWIS", category: "Core", url: "https://sdwis.epa.gov/", cadence: "Quarterly", lastIngested: "2025-01-10", status: "active", records: "5 utilities" },
  { name: "EPA ECHO", category: "Compliance", url: "https://echo.epa.gov/", cadence: "Weekly", lastIngested: "2025-01-10", status: "active", records: "Violation data" },
  { name: "Consumer Confidence Reports", category: "Detection", url: "https://www.epa.gov/ccr", cadence: "Annual", lastIngested: "2025-01-08", status: "active", records: "5 CCRs parsed" },
  { name: "EPA Water Quality Portal", category: "Sampling", url: "https://www.waterqualitydata.us/", cadence: "Continuous", lastIngested: "—", status: "pending", records: "Not yet ingested" },
  { name: "State Datasets (CA, TX, FL, AZ, OH)", category: "State", url: "#", cadence: "Annual", lastIngested: "2025-01-05", status: "active", records: "5 states" },
  { name: "EPA Health Guidance", category: "Reference", url: "https://www.epa.gov/ground-water-and-drinking-water", cadence: "On update", lastIngested: "2025-01-01", status: "active", records: "6 contaminants" },
  { name: "US Census TIGER/Line", category: "Geography", url: "https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html", cadence: "Annual", lastIngested: "2025-01-01", status: "active", records: "12 ZIP matches" },
  { name: "NELAP Lab Certifications", category: "Labs", url: "https://www.epa.gov/dwlabcert", cadence: "Manual", lastIngested: "2025-01-03", status: "active", records: "8 labs" },
];

export default function AdminSourcesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Data Sources</h1>
        <p className="text-sm text-muted-foreground">{sources.length} sources registered · {sources.filter(s => s.status === "active").length} active</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Source</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Category</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cadence</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Last Ingested</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Records</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sources.map((s, i) => (
              <tr key={i} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-medium text-foreground">{s.name}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">{s.category}</span>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{s.cadence}</td>
                <td className="py-3 px-4 text-xs font-mono text-muted-foreground">{s.lastIngested}</td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{s.records}</td>
                <td className="py-3 px-4">
                  {s.status === "active" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-wur-safe">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <XCircle className="w-3.5 h-3.5" /> Pending
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {s.url !== "#" && (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-wur-teal transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline">
                      <RefreshCw className="w-3 h-3" /> Refresh
                    </button>
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
