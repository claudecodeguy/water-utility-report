"use client";

import { useState } from "react";
import { Play, Zap, X } from "lucide-react";

type ScoreResult = {
  scored?: number;
  skipped?: number;
  errors?: number;
};

type RunResult = {
  scored?: number;
  pitched?: number;
  drafted?: number;
  errors?: number;
};

type Mode = "score" | "run";

export default function AdminPipelineRunner() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("run");
  const [batchLimit, setBatchLimit] = useState(50);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScoreResult | RunResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setLoading(true);
    setResult(null);
    setError(null);
    const endpoint = mode === "score" ? "/api/outreach/score" : "/api/outreach/run";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchLimit }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Unknown error");
      } else {
        setResult(data);
        setTimeout(() => window.location.reload(), 2500);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const modeLabel = mode === "score" ? "Score Signals" : "Run Full Pipeline";
  const modeDesc =
    mode === "score"
      ? "Scores unscored signals with Claude. No pitches are sent."
      : "Scores signals, matches journalists, and drafts pitches. No emails sent without manual approval.";

  return (
    <>
      <button
        onClick={() => { setOpen(true); setResult(null); setError(null); }}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-wur-teal text-white hover:bg-wur-teal/90 transition-colors"
      >
        <Play className="w-4 h-4" />
        Run Pipeline
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-display text-lg font-semibold text-foreground">Run Pipeline</h2>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Mode toggle */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  {(["score", "run"] as Mode[]).map((m) => (
                    <button
                      key={m}
                      onClick={() => setMode(m)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                        mode === m
                          ? "border-wur-teal bg-wur-teal/5 text-wur-teal"
                          : "border-border text-muted-foreground hover:border-wur-teal/40"
                      }`}
                    >
                      {m === "score" ? <Zap className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {m === "score" ? "Score only" : "Full pipeline"}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{modeDesc}</p>
              </div>

              {/* Batch limit */}
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground block mb-2">
                  Signals to process
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={1}
                    max={500}
                    step={10}
                    value={batchLimit}
                    onChange={(e) => setBatchLimit(Number(e.target.value))}
                    className="flex-1 accent-wur-teal"
                  />
                  <span className="text-sm font-semibold tabular-nums w-10 text-right text-foreground">
                    {batchLimit}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Each signal costs ~1 Claude API call. 50 = ~$0.05.
                </p>
              </div>

              {/* Error */}
              {error && <p className="text-sm text-wur-danger">{error}</p>}

              {/* Result */}
              {result && (
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
                  <p className="text-sm font-semibold text-foreground">Done</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(result)
                      .filter(([k]) => k !== "ok")
                      .map(([key, val]) => (
                        <div key={key} className="bg-white rounded-lg border border-border p-2">
                          <p className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, " ")}</p>
                          <p className="text-lg font-semibold tabular-nums text-foreground">{val ?? 0}</p>
                        </div>
                      ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Refreshing page…</p>
                </div>
              )}
            </div>

            <div className="px-6 pb-5">
              {!result && (
                <button
                  onClick={handleRun}
                  disabled={loading}
                  className="w-full py-2 px-4 rounded-lg bg-wur-teal text-white text-sm font-medium hover:bg-wur-teal/90 disabled:opacity-40 transition-colors"
                >
                  {loading ? `Running ${modeLabel}…` : modeLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
