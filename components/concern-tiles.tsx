"use client";

import Link from "next/link";
import { FlaskConical, Wrench, AlertTriangle, AlertCircle, BarChart3, Search, ChevronRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const tiles = [
  {
    icon: FlaskConical,
    title: "Check PFAS records",
    desc: "Official UCMR 5 monitoring data by utility",
    href: "/pfas-watchlist",
    color: "text-amber-600",
    ring: "hover:border-amber-300",
  },
  {
    icon: AlertCircle,
    title: "Check lead records",
    desc: "Lead action level violations and compliance history",
    href: "/contaminants/lead",
    color: "text-red-600",
    ring: "hover:border-red-300",
  },
  {
    icon: AlertTriangle,
    title: "Active violations",
    desc: "Health-based violations open in EPA SDWIS",
    href: "/states",
    color: "text-orange-600",
    ring: "hover:border-orange-300",
  },
  {
    icon: Search,
    title: "Find your utility",
    desc: "Search by ZIP, city, or utility name",
    href: "/search",
    color: "text-wur-teal",
    ring: "hover:border-teal-300",
  },
  {
    icon: Wrench,
    title: "Treatment options",
    desc: "Filter guides matched by contaminant type",
    href: "/treatment",
    color: "text-blue-600",
    ring: "hover:border-blue-300",
  },
  {
    icon: BarChart3,
    title: "Compare utilities",
    desc: "Side-by-side comparison of any two water systems",
    href: "/compare",
    color: "text-purple-600",
    ring: "hover:border-purple-300",
  },
];

export default function ConcernTiles() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {tiles.map((tile) => {
        const Icon = tile.icon;
        return (
          <Link
            key={tile.href}
            href={tile.href}
            onClick={() => trackEvent("concern_tile_clicked", { tile: tile.title })}
            className={`group flex flex-col gap-2.5 p-4 rounded-lg border border-border bg-card transition-all hover:shadow-sm ${tile.ring}`}
          >
            <Icon className={`w-5 h-5 ${tile.color} shrink-0`} />
            <div>
              <p className="font-semibold text-foreground text-sm leading-snug">{tile.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-snug hidden sm:block">{tile.desc}</p>
            </div>
            <ChevronRight className={`w-3.5 h-3.5 ${tile.color} mt-auto opacity-0 group-hover:opacity-100 transition-opacity`} />
          </Link>
        );
      })}
    </div>
  );
}
