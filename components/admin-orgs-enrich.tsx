"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function AdminOrgsEnrich({ pendingCount }: { pendingCount: number }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ enriched: number; failed: number } | null>(null);

  if (pendingCount === 0 && !result) return null;

  async function handleEnrich() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/outreach/orgs/enrich", { method: "POST", body: "{}" });
      const data = await res.json();
      if (data.ok) {
        setResult({ enriched: data.enriched ?? 0, failed: data.failed ?? 0 });
        setTimeout(() => window.location.reload(), 2500);
      }
    } catch {
      // silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleEnrich}
        disabled={loading}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-white text-foreground hover:bg-muted/50 disabled:opacity-50 transition-colors"
      >
        <Sparkles className="w-4 h-4 text-amber-500" />
        {loading ? "Enriching…" : `Enrich pending (${pendingCount})`}
      </button>
      {result && (
        <span className="text-sm text-muted-foreground">
          Enriched {result.enriched}{result.failed > 0 ? `, failed ${result.failed}` : ""}
        </span>
      )}
    </div>
  );
}
