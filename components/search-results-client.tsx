"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { normalizeName } from "@/lib/normalize-name";

interface UtilityResult {
  slug: string;
  pwsid: string;
  name: string;
  population_served: number;
  risk_level: string;
  city_served: string | null;
  state: { abbreviation: string; slug: string; name: string };
}

interface Props {
  utilities: UtilityResult[];
  zip: string;
  city: string | null;
  riskBgs: Record<string, string>;
}

export default function SearchResultsClient({ utilities, zip, city, riskBgs }: Props) {
  useEffect(() => {
    if (utilities.length > 0) {
      trackEvent("zip_lookup_completed", { zip, city: city ?? "", result_count: utilities.length });
    }
  }, [utilities.length, zip, city]);

  return (
    <div className="space-y-2">
      {utilities.map((u, idx) => (
        <Link
          key={u.slug}
          href={`/utilities/${u.slug}`}
          onClick={() =>
            trackEvent("search_result_clicked", {
              slug: u.slug,
              zip,
              position: idx + 1,
              risk_level: u.risk_level,
            })
          }
          className="group flex items-center justify-between p-4 rounded-xl border border-border bg-white hover:border-wur-teal/40 hover:shadow-sm transition-all"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Building2 className="w-4 h-4 text-wur-teal shrink-0" />
            <div className="min-w-0">
              <p className="font-medium text-foreground group-hover:text-wur-teal transition-colors text-sm truncate">
                {normalizeName(u.name)}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {u.city_served ?? u.state.name} ·{" "}
                {u.population_served >= 1_000_000
                  ? `${(u.population_served / 1_000_000).toFixed(1)}M served`
                  : `${(u.population_served / 1_000).toFixed(0)}K served`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span
              className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${riskBgs[u.risk_level] ?? riskBgs.safe}`}
            >
              {u.risk_level}
            </span>
            <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors" />
          </div>
        </Link>
      ))}
    </div>
  );
}
