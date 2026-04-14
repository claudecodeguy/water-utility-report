import { AlertTriangle, CheckCircle2, Clock, Flag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Review Flags — Admin",
  robots: { index: false, follow: false },
};

const flags = [
  {
    id: "f1",
    type: "Utility",
    entity: "Columbus Division of Water",
    slug: "columbus-division-of-water",
    flagType: "low_confidence",
    reason: "Confidence score 0.61 — below publish threshold of 0.70. CCR PDF parse quality insufficient.",
    flaggedAt: "2025-01-12",
    priority: "high",
    status: "open",
    resolution: null,
  },
  {
    id: "f2",
    type: "Contaminant",
    entity: "Arsenic",
    slug: "arsenic",
    flagType: "regulatory_update",
    reason: "EPA updated MCLG guidance in December 2024. Page content may not reflect latest regulatory language.",
    flaggedAt: "2025-01-10",
    priority: "high",
    status: "open",
    resolution: null,
  },
  {
    id: "f3",
    type: "Utility",
    entity: "Miami-Dade Water and Sewer",
    slug: "miami-dade-water-and-sewer",
    flagType: "parse_quality",
    reason: "CCR PDF parse returned 3 unresolved fields. Contaminant levels may be incomplete.",
    flaggedAt: "2025-01-09",
    priority: "medium",
    status: "open",
    resolution: null,
  },
  {
    id: "f4",
    type: "State",
    entity: "Florida",
    slug: "florida",
    flagType: "data_refresh",
    reason: "New state CCR dataset available. 2024 batch ready for ingestion — 312 utilities affected.",
    flaggedAt: "2025-01-08",
    priority: "medium",
    status: "open",
    resolution: null,
  },
  {
    id: "f5",
    type: "Utility",
    entity: "Houston Water",
    slug: "houston-water",
    flagType: "parse_quality",
    reason: "CCR PDF parse failed on disinfection byproducts table. Manual entry required.",
    flaggedAt: "2025-01-06",
    priority: "low",
    status: "resolved",
    resolution: "Manually reviewed and corrected contaminant levels. Published 2025-01-07.",
  },
];

const priorityConfig = {
  high: { label: "High", color: "text-wur-danger bg-wur-danger-bg border-wur-danger-border", icon: AlertTriangle },
  medium: { label: "Medium", color: "text-wur-caution bg-wur-caution-bg border-wur-caution-border", icon: AlertTriangle },
  low: { label: "Low", color: "text-muted-foreground bg-secondary border-border", icon: Clock },
};

const flagTypeLabels: Record<string, string> = {
  low_confidence: "Low Confidence Score",
  regulatory_update: "Regulatory Update",
  parse_quality: "Parse Quality Issue",
  data_refresh: "Data Refresh Available",
};

export default function AdminFlagsPage() {
  const openFlags = flags.filter((f) => f.status === "open");
  const resolvedFlags = flags.filter((f) => f.status === "resolved");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">Review Flags</h1>
          <p className="text-sm text-muted-foreground">
            {openFlags.length} open · {resolvedFlags.length} resolved
          </p>
        </div>
        <select className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
          <option>All Flags</option>
          <option>Open Only</option>
          <option>High Priority</option>
          <option>Resolved</option>
        </select>
      </div>

      {/* Open flags */}
      {openFlags.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Flag className="w-4 h-4 text-wur-caution" />
            Open ({openFlags.length})
          </h2>
          <div className="space-y-3">
            {openFlags.map((flag) => {
              const pc = priorityConfig[flag.priority as keyof typeof priorityConfig];
              const Icon = pc.icon;
              return (
                <div key={flag.id} className="rounded-xl border border-border bg-white p-5">
                  <div className="flex items-start gap-4">
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${flag.priority === "high" ? "text-wur-danger" : flag.priority === "medium" ? "text-wur-caution" : "text-muted-foreground"}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{flag.type}</span>
                        <span className="text-sm font-semibold text-foreground">{flag.entity}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${pc.color}`}>
                          {pc.label}
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {flagTypeLabels[flag.flagType] ?? flag.flagType}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{flag.reason}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-muted-foreground font-mono">Flagged {flag.flaggedAt}</span>
                        <button className="text-xs bg-wur-teal text-white px-3 py-1.5 rounded-md hover:bg-wur-teal-dark transition-colors">
                          Mark Resolved
                        </button>
                        <button className="text-xs border border-border text-muted-foreground px-3 py-1.5 rounded-md hover:border-wur-teal/40 transition-colors">
                          Assign
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resolved flags */}
      {resolvedFlags.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-wur-safe" />
            Resolved ({resolvedFlags.length})
          </h2>
          <div className="space-y-3">
            {resolvedFlags.map((flag) => (
              <div key={flag.id} className="rounded-xl border border-border bg-muted/20 p-5 opacity-70">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-4 h-4 text-wur-safe mt-0.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{flag.type}</span>
                      <span className="text-sm font-semibold text-foreground">{flag.entity}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{flag.reason}</p>
                    {flag.resolution && (
                      <p className="text-xs text-wur-safe">{flag.resolution}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
