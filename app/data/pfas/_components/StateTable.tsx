"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export type StateRow = {
  state: { name: string; slug: string; code: string };
  utilities_tested: number;
  utilities_with_any_detection: number;
  utilities_above_pfoa_mcl: number;
  utilities_above_pfos_mcl: number;
  utilities_above_any_mcl: number;
  latest_sample_date: string | null;
};

type SortKey = keyof Omit<StateRow, "state">;

function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    timeZone: "UTC",
  });
}

function SortIcon({ col, active, dir }: { col: string; active: boolean; dir: "asc" | "desc" }) {
  if (!active) return <ArrowUpDown className="w-3 h-3 opacity-40" />;
  return dir === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />;
}

export default function StateTable({ rows }: { rows: StateRow[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("utilities_above_any_mcl");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const va = a[sortKey] ?? 0;
    const vb = b[sortKey] ?? 0;
    const cmp = va < vb ? -1 : va > vb ? 1 : 0;
    return sortDir === "asc" ? cmp : -cmp;
  });

  const cols: { key: SortKey; label: string; right?: boolean; hidden?: string }[] = [
    { key: "utilities_tested", label: "Tested", right: true },
    { key: "utilities_with_any_detection", label: "Detections", right: true, hidden: "hidden sm:table-cell" },
    { key: "utilities_above_pfoa_mcl", label: "Above PFOA MCL", right: true, hidden: "hidden md:table-cell" },
    { key: "utilities_above_pfos_mcl", label: "Above PFOS MCL", right: true, hidden: "hidden md:table-cell" },
    { key: "utilities_above_any_mcl", label: "Above any MCL", right: true },
    { key: "latest_sample_date", label: "Latest sample", right: true, hidden: "hidden lg:table-cell" },
  ];

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-secondary/50">
            <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              State
            </th>
            {cols.map((c) => (
              <th
                key={c.key}
                className={`px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide ${c.right ? "text-right" : ""} ${c.hidden ?? ""}`}
              >
                <button
                  onClick={() => handleSort(c.key)}
                  className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  {c.label}
                  <SortIcon col={c.key} active={sortKey === c.key} dir={sortDir} />
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sorted.map((row) => (
            <tr key={row.state.slug} className="hover:bg-secondary/30 transition-colors">
              <td className="px-4 py-3.5">
                <Link
                  href={`/data/pfas/${row.state.slug}`}
                  className="text-sm font-medium text-foreground hover:text-wur-teal transition-colors"
                >
                  {row.state.name}
                </Link>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {row.state.code}
                </div>
              </td>
              <td className="px-4 py-3.5 text-right text-xs font-mono text-muted-foreground">
                {row.utilities_tested.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right text-xs font-mono text-muted-foreground hidden sm:table-cell">
                {row.utilities_with_any_detection.toLocaleString()}
              </td>
              <td className="px-4 py-3.5 text-right hidden md:table-cell">
                <span
                  className={`text-xs font-mono font-semibold ${
                    row.utilities_above_pfoa_mcl > 0 ? "text-amber-700" : "text-muted-foreground"
                  }`}
                >
                  {row.utilities_above_pfoa_mcl.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right hidden md:table-cell">
                <span
                  className={`text-xs font-mono font-semibold ${
                    row.utilities_above_pfos_mcl > 0 ? "text-amber-700" : "text-muted-foreground"
                  }`}
                >
                  {row.utilities_above_pfos_mcl.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right">
                <span
                  className={`text-xs font-mono font-semibold ${
                    row.utilities_above_any_mcl > 0 ? "text-amber-700" : "text-muted-foreground"
                  }`}
                >
                  {row.utilities_above_any_mcl.toLocaleString()}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right text-xs font-mono text-muted-foreground hidden lg:table-cell">
                {fmtDate(row.latest_sample_date)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
