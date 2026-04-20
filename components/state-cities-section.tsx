"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, ChevronDown, ChevronUp } from "lucide-react";

type City = {
  name: string;
  slug: string;
  pop: number;
  worstRisk: string;
};

const riskColors: Record<string, string> = {
  safe:     "text-wur-safe",
  low:      "text-emerald-600",
  moderate: "text-wur-caution",
  high:     "text-wur-warning",
  critical: "text-wur-danger",
};

const riskBg: Record<string, string> = {
  safe:     "bg-wur-safe/10",
  low:      "bg-emerald-50",
  moderate: "bg-amber-50",
  high:     "bg-orange-50",
  critical: "bg-red-50",
};

export default function StateCitiesSection({ cities }: { cities: City[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? cities : cities.slice(0, 10);
  const remaining = cities.length - 10;

  return (
    <>
      <ul className="divide-y divide-border rounded-xl border border-border overflow-hidden bg-card">
        {visible.map((city, i) => (
          <li key={city.slug}>
            <Link
              href={`/cities/${city.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors group"
            >
              <span className="w-5 text-xs text-muted-foreground/40 font-mono text-right shrink-0">
                {i + 1}
              </span>
              <MapPin className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0" />
              <span className="flex-1 text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">
                {city.name}
              </span>
              <span
                className={`text-xs font-medium capitalize px-2 py-0.5 rounded-full ${riskColors[city.worstRisk] ?? "text-muted-foreground"} ${riskBg[city.worstRisk] ?? "bg-muted"}`}
              >
                {city.worstRisk}
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {remaining > 0 && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-wur-teal transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Show fewer cities
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> See all {cities.length} cities in this state
            </>
          )}
        </button>
      )}
    </>
  );
}
