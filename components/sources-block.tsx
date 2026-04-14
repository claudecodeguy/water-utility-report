import React from "react";
import { ExternalLink, Shield, Calendar, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Source {
  label: string;
  url?: string;
  note?: string;
}

interface SourcesBlockProps {
  sources: Source[];
  lastUpdated: string;
  confidence?: "high" | "medium" | "low";
  className?: string;
}

const confidenceConfig = {
  high: { label: "High Confidence", color: "text-wur-safe", dot: "bg-wur-safe" },
  medium: { label: "Medium Confidence", color: "text-wur-caution", dot: "bg-wur-caution" },
  low: { label: "Low Confidence — Verify Independently", color: "text-wur-warning", dot: "bg-wur-warning" },
};

export default function SourcesBlock({ sources, lastUpdated, confidence = "high", className }: SourcesBlockProps) {
  const conf = confidenceConfig[confidence];

  return (
    <section className={cn("mt-12 rounded-lg border border-border bg-muted/30 p-5", className)}>
      <div className="flex items-start gap-2 mb-4">
        <Shield className="w-4 h-4 text-wur-teal mt-0.5 shrink-0" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Data Sources & Provenance</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            All data on this page is sourced from official U.S. government or public datasets.
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {sources.map((source, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-border mt-2 shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{source.label}</span>
              {source.note && <span className="ml-1.5">— {source.note}</span>}
              {source.url && (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 inline-flex items-center gap-0.5 text-primary hover:underline"
                >
                  View source <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            Last updated: <span className="font-mono font-medium text-foreground">{lastUpdated}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("w-1.5 h-1.5 rounded-full", conf.dot)} />
          <span className={cn("text-xs font-medium", conf.color)}>{conf.label}</span>
        </div>
        <div className="flex items-center gap-1.5 ml-auto">
          <RefreshCw className="w-3 h-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Annual refresh cycle</span>
        </div>
      </div>
    </section>
  );
}
