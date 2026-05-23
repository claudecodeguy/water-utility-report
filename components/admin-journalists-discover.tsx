"use client";

import { useState, useEffect } from "react";
import { Search, X, ChevronDown, ChevronRight, CheckSquare, Square } from "lucide-react";

type Outlet = { domain: string; name: string; tier: string };
type OutletsByState = Record<string, Outlet[]>;

type DiscoverResult = {
  outlets_searched: number;
  emails_found: number;
  beat_matched: number;
  inserted: number;
  updated: number;
  skipped: number;
  quota_used: number;
  errors: { domain: string; message: string }[];
  journalists: { name: string; email: string; outlet: string; position: string | null }[];
};

const TIER_LABELS: Record<string, string> = {
  national: "National",
  state: "State",
  metro: "Metro",
};

export default function AdminJournalistsDiscover() {
  const [open, setOpen] = useState(false);
  const [outlets, setOutlets] = useState<OutletsByState>({});
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingOutlets, setLoadingOutlets] = useState(false);
  const [result, setResult] = useState<DiscoverResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && Object.keys(outlets).length === 0) {
      setLoadingOutlets(true);
      fetch("/api/outreach/journalists/discover")
        .then((r) => r.json())
        .then((d) => { if (d.ok) setOutlets(d.outlets); })
        .finally(() => setLoadingOutlets(false));
    }
  }, [open, outlets]);

  function toggleState(state: string) {
    const stateDomains = (outlets[state] ?? []).map((o) => o.domain);
    const allSelected = stateDomains.every((d) => selected.has(d));
    setSelected((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        stateDomains.forEach((d) => next.delete(d));
      } else {
        stateDomains.forEach((d) => next.add(d));
      }
      return next;
    });
  }

  function toggleOutlet(domain: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(domain) ? next.delete(domain) : next.add(domain);
      return next;
    });
  }

  function toggleExpanded(state: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(state) ? next.delete(state) : next.add(state);
      return next;
    });
  }

  function stateCheckState(state: string): "all" | "some" | "none" {
    const domains = (outlets[state] ?? []).map((o) => o.domain);
    const count = domains.filter((d) => selected.has(d)).length;
    if (count === 0) return "none";
    if (count === domains.length) return "all";
    return "some";
  }

  const selectedDomains = Array.from(selected);
  const selectedOutlets = Object.entries(outlets).flatMap(([state, list]) =>
    list
      .filter((o) => selected.has(o.domain))
      .map((o) => ({ ...o, state: state === "National" ? null : state }))
  );

  async function handleDiscover() {
    if (selectedOutlets.length === 0) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch("/api/outreach/journalists/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domains: selectedOutlets }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Discovery failed");
      } else {
        setResult(data);
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  const states = Object.keys(outlets);

  return (
    <>
      <button
        onClick={() => { setOpen(true); setResult(null); setError(null); }}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-white text-foreground hover:border-wur-teal/40 transition-colors"
      >
        <Search className="w-4 h-4" />
        Discover
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">Discover Journalists</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Uses Hunter.io to find environment &amp; water reporters at selected outlets.
                  Each outlet = 1 API search.
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Outlet selector */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-1">
              {loadingOutlets ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Loading outlets…</p>
              ) : (
                states.map((state) => {
                  const stateOutlets = outlets[state] ?? [];
                  const checkState = stateCheckState(state);
                  const isExpanded = expanded.has(state);
                  return (
                    <div key={state}>
                      {/* State row */}
                      <div className="flex items-center gap-2 py-1.5 hover:bg-muted/30 rounded-lg px-2 -mx-2 group">
                        <button
                          onClick={() => toggleExpanded(state)}
                          className="text-muted-foreground hover:text-foreground shrink-0"
                        >
                          {isExpanded
                            ? <ChevronDown className="w-4 h-4" />
                            : <ChevronRight className="w-4 h-4" />}
                        </button>
                        <button onClick={() => toggleState(state)} className="shrink-0">
                          {checkState === "all"
                            ? <CheckSquare className="w-4 h-4 text-wur-teal" />
                            : checkState === "some"
                            ? <CheckSquare className="w-4 h-4 text-wur-teal/50" />
                            : <Square className="w-4 h-4 text-muted-foreground" />}
                        </button>
                        <button
                          onClick={() => toggleExpanded(state)}
                          className="flex-1 text-left text-sm font-medium text-foreground"
                        >
                          {state}
                        </button>
                        <span className="text-xs text-muted-foreground">
                          {stateOutlets.filter((o) => selected.has(o.domain)).length}/{stateOutlets.length} selected
                        </span>
                      </div>

                      {/* Outlet rows */}
                      {isExpanded && (
                        <div className="ml-10 space-y-0.5 mb-1">
                          {stateOutlets.map((outlet) => (
                            <label
                              key={outlet.domain}
                              className="flex items-center gap-2.5 py-1 px-2 -mx-2 rounded-lg hover:bg-muted/20 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={selected.has(outlet.domain)}
                                onChange={() => toggleOutlet(outlet.domain)}
                                className="accent-wur-teal"
                              />
                              <span className="text-sm text-foreground flex-1">{outlet.name}</span>
                              <span className="text-xs text-muted-foreground font-mono">{outlet.domain}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded-full border ${
                                outlet.tier === "national"
                                  ? "bg-purple-50 text-purple-700 border-purple-200"
                                  : outlet.tier === "state"
                                  ? "bg-blue-50 text-blue-700 border-blue-200"
                                  : "bg-muted text-muted-foreground border-border"
                              }`}>
                                {TIER_LABELS[outlet.tier] ?? outlet.tier}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border shrink-0 space-y-3">
              {/* Selection summary */}
              {selectedDomains.length > 0 && !result && (
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-foreground font-medium">
                    {selectedDomains.length} outlet{selectedDomains.length !== 1 ? "s" : ""} selected
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">
                    {selectedDomains.length} Hunter.io API search{selectedDomains.length !== 1 ? "es" : ""}
                  </span>
                  <button
                    onClick={() => setSelected(new Set())}
                    className="ml-auto text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear
                  </button>
                </div>
              )}

              {/* Error */}
              {error && (
                <p className="text-sm text-wur-danger">{error}</p>
              )}

              {/* Results */}
              {result && (
                <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-3">
                  <p className="text-sm font-semibold text-foreground">Discovery complete</p>

                  {/* Counts grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Outlets searched", value: result.outlets_searched },
                      { label: "Emails found", value: result.emails_found },
                      { label: "Beat matched", value: result.beat_matched },
                      { label: "Inserted", value: result.inserted, highlight: true },
                      { label: "Updated", value: result.updated },
                      { label: "Skipped (no beat)", value: result.skipped },
                    ].map(({ label, value, highlight }) => (
                      <div key={label} className="bg-white rounded-lg border border-border p-2.5">
                        <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                        <p className={`text-lg font-semibold tabular-nums ${highlight && value > 0 ? "text-wur-teal" : "text-foreground"}`}>
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* New journalists list */}
                  {result.journalists.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                        Added / updated
                      </p>
                      <div className="space-y-1 max-h-32 overflow-y-auto">
                        {result.journalists.map((j) => (
                          <div key={j.email} className="flex items-center gap-2 text-xs">
                            <span className="font-medium text-foreground">{j.name}</span>
                            <span className="text-muted-foreground">·</span>
                            <span className="text-muted-foreground">{j.outlet}</span>
                            {j.position && (
                              <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-muted-foreground italic">{j.position}</span>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Errors */}
                  {result.errors.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-wur-caution mb-1">
                        {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
                      </p>
                      <div className="space-y-0.5 max-h-24 overflow-y-auto">
                        {result.errors.map((e, i) => (
                          <p key={i} className="text-xs text-muted-foreground">
                            <span className="font-mono">{e.domain}</span>: {e.message}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-muted-foreground">
                    Used {result.quota_used} Hunter.io search{result.quota_used !== 1 ? "es" : ""} · Refreshing page…
                  </p>
                </div>
              )}

              {/* Action button */}
              {!result && (
                <button
                  onClick={handleDiscover}
                  disabled={loading || selectedDomains.length === 0}
                  className="w-full py-2 px-4 rounded-lg bg-wur-teal text-white text-sm font-medium hover:bg-wur-teal/90 disabled:opacity-40 transition-colors"
                >
                  {loading
                    ? `Searching ${selectedDomains.length} outlet${selectedDomains.length !== 1 ? "s" : ""}…`
                    : selectedDomains.length === 0
                    ? "Select outlets to search"
                    : `Discover from ${selectedDomains.length} outlet${selectedDomains.length !== 1 ? "s" : ""}`}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
