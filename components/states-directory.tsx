"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpDown, Search, ChevronUp, ChevronDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export interface StateRow {
  slug: string;
  name: string;
  abbreviation: string;
  populationServed: number;
  utilityCount: number;
  topContaminants: string[];
  region: string;
}

interface StatesDirectoryProps {
  states: StateRow[];
}

type SortKey = "name" | "utilityCount" | "populationServed";
type SortDir = "asc" | "desc";

const REGIONS = ["All Regions", "Northeast", "Southeast", "Midwest", "Southwest", "West"];

export default function StatesDirectory({ states }: StatesDirectoryProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let rows = states;
    if (query.trim()) {
      const q = query.toLowerCase();
      rows = rows.filter(
        (s) => s.name.toLowerCase().includes(q) || s.abbreviation.toLowerCase().includes(q)
      );
    }
    if (region !== "All Regions") {
      rows = rows.filter((s) => s.region === region);
    }
    rows = [...rows].sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "utilityCount") cmp = a.utilityCount - b.utilityCount;
      else if (sortKey === "populationServed") cmp = a.populationServed - b.populationServed;
      return sortDir === "asc" ? cmp : -cmp;
    });
    return rows;
  }, [states, query, region, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    const newDir = sortKey === key ? (sortDir === "asc" ? "desc" : "asc") : (key === "name" ? "asc" : "desc");
    setSortKey(key);
    setSortDir(newDir);
    trackEvent("state_sort_used", { sort_key: key, sort_dir: newDir });
  }

  function handleRegionChange(r: string) {
    setRegion(r);
    trackEvent("state_filter_used", { region: r });
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground/40 ml-1 inline" />;
    return sortDir === "asc"
      ? <ChevronUp className="w-3.5 h-3.5 text-wur-teal ml-1 inline" />
      : <ChevronDown className="w-3.5 h-3.5 text-wur-teal ml-1 inline" />;
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by state name…"
            className="w-full pl-9 pr-4 h-9 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-wur-teal"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {REGIONS.map((r) => (
            <button
              key={r}
              onClick={() => handleRegionChange(r)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                region === r
                  ? "bg-wur-teal text-white border-wur-teal"
                  : "border-border text-muted-foreground hover:border-wur-teal/50 hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3">
        {filtered.length} {filtered.length === 1 ? "state" : "states"}
      </p>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-foreground">
                  <button
                    onClick={() => toggleSort("name")}
                    className="flex items-center hover:text-wur-teal transition-colors"
                  >
                    State <SortIcon col="name" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                  <button
                    onClick={() => toggleSort("utilityCount")}
                    className="flex items-center hover:text-wur-teal transition-colors"
                  >
                    Utilities <SortIcon col="utilityCount" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                  <button
                    onClick={() => toggleSort("populationServed")}
                    className="flex items-center hover:text-wur-teal transition-colors"
                  >
                    Population served <SortIcon col="populationServed" />
                  </button>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-foreground hidden lg:table-cell">
                  Top contaminants
                </th>
                <th className="text-right px-4 py-3 font-semibold text-foreground">
                  Report
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((state) => (
                <tr
                  key={state.slug}
                  className="bg-card hover:bg-muted/30 transition-colors group"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-muted-foreground w-6 shrink-0">
                        {state.abbreviation}
                      </span>
                      <Link
                        href={`/states/${state.slug}`}
                        className="font-semibold text-foreground group-hover:text-wur-teal transition-colors"
                      >
                        {state.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {state.utilityCount > 0 ? state.utilityCount.toLocaleString() : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {state.populationServed >= 1_000_000
                      ? `${(state.populationServed / 1_000_000).toFixed(1)}M`
                      : state.populationServed >= 1_000
                      ? `${(state.populationServed / 1_000).toFixed(0)}K`
                      : state.populationServed.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {state.topContaminants.slice(0, 3).map((c) => (
                        <span
                          key={c}
                          className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize"
                        >
                          {c.replace(/-/g, " ")}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/states/${state.slug}`}
                      onClick={() => trackEvent("state_result_clicked", { state_slug: state.slug })}
                      className="inline-flex items-center gap-1 text-xs font-medium text-wur-teal hover:text-wur-teal/80 transition-colors"
                    >
                      View report <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No states match your filter.</p>
          <button
            onClick={() => { setQuery(""); setRegion("All Regions"); }}
            className="mt-2 text-sm text-wur-teal hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
