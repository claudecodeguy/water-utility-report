"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import type { UtilitySummary } from "@/lib/data/pfas-state";

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

function ngLCell(v: number | null) {
  if (v === null) return <span className="text-muted-foreground">—</span>;
  return (
    <span className={v > 4 ? "text-amber-700 font-semibold" : "text-foreground"}>
      {v.toFixed(2)}
    </span>
  );
}

export default function UtilitiesTable({
  utilities,
  stateCode,
}: {
  utilities: UtilitySummary[];
  stateCode: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const PREVIEW = 10;
  const shown = expanded ? utilities : utilities.slice(0, PREVIEW);

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-xl text-foreground">
          All {stateCode} utilities with PFAS records
        </h2>
        <span className="text-xs text-muted-foreground">{fmt(utilities.length)} systems</span>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Water System
              </th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                PWSID
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                Records
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                Detections
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                Max PFOA (ng/L)
              </th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">
                Max PFOS (ng/L)
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {shown.map((u) => (
              <tr
                key={u.pwsid}
                className={`hover:bg-secondary/30 transition-colors ${u.above_any_mcl ? "bg-amber-50/40" : ""}`}
              >
                <td className="px-4 py-3.5">
                  <div className="font-medium text-foreground text-sm">{u.name}</div>
                  {u.city && (
                    <div className="text-xs text-muted-foreground mt-0.5">{u.city}</div>
                  )}
                  {u.above_any_mcl && (
                    <span className="inline-block mt-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      Above MCL
                    </span>
                  )}
                </td>
                <td className="px-4 py-3.5 hidden sm:table-cell">
                  <span className="font-mono text-xs text-muted-foreground">{u.pwsid}</span>
                </td>
                <td className="px-4 py-3.5 text-right hidden md:table-cell font-mono text-xs text-foreground">
                  {fmt(u.total_records)}
                </td>
                <td className="px-4 py-3.5 text-right hidden md:table-cell">
                  {u.detection_count > 0 ? (
                    <span className="text-xs font-semibold text-amber-700">
                      {fmt(u.detection_count)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">0</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right hidden lg:table-cell font-mono text-xs">
                  {ngLCell(u.max_pfoa_ng_l)}
                </td>
                <td className="px-4 py-3.5 text-right hidden lg:table-cell font-mono text-xs">
                  {ngLCell(u.max_pfos_ng_l)}
                </td>
                <td className="px-4 py-3.5 text-right">
                  {u.slug ? (
                    <Link
                      href={`/utilities/${u.slug}`}
                      className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline font-medium"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  ) : (
                    <Link
                      href={`/pfas-watchlist/utility/${u.pwsid}`}
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:underline"
                    >
                      PFAS <ArrowRight className="w-3 h-3" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {utilities.length > PREVIEW && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 w-full flex items-center justify-center gap-2 text-sm text-wur-teal border border-wur-teal/30 rounded-lg px-4 py-2.5 hover:bg-wur-teal/5 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              Show fewer
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              Show all {fmt(utilities.length)} utilities
            </>
          )}
        </button>
      )}
    </div>
  );
}
