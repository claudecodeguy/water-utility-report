"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

type City = {
  name: string;
  slug: string;
  pop: number;
  worstRisk: string;
};

const riskDot: Record<string, string> = {
  safe:     "bg-wur-safe",
  low:      "bg-emerald-500",
  moderate: "bg-amber-400",
  high:     "bg-orange-500",
  critical: "bg-red-500",
};

const INITIAL_SHOW = 40;

export default function StateCitiesSection({ cities }: { cities: City[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? cities : cities.slice(0, INITIAL_SHOW);
  const remaining = cities.length - INITIAL_SHOW;

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 xl:columns-6 gap-x-4">
        {visible.map((city) => (
          <Link
            key={city.slug}
            href={`/cities/${city.slug}`}
            className="flex items-center gap-1.5 py-1 group break-inside-avoid"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${riskDot[city.worstRisk] ?? "bg-muted-foreground"}`}
            />
            <span className="text-sm text-foreground group-hover:text-wur-teal transition-colors truncate">
              {city.name}
            </span>
          </Link>
        ))}
      </div>

      {remaining > 0 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" /> Show fewer</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" /> Show {remaining} more cities</>
          )}
        </button>
      )}
    </div>
  );
}
