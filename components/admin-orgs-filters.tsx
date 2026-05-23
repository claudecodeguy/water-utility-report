"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

const ORG_TYPES = ["nonprofit", "extension", "health_dept", "research", "advocacy", "other"];
const ENRICH_STATUSES = ["pending", "enriched", "failed", "manual"];
const ORG_STATUSES = ["active", "unsubscribed", "bounced", "blacklisted"];
const US_STATES = [
  "national",
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export default function AdminOrgsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = {
    type: searchParams.get("type") ?? "",
    enrichment_status: searchParams.get("enrichment_status") ?? "",
    state: searchParams.get("state") ?? "",
    status: searchParams.get("status") ?? "",
    search: searchParams.get("search") ?? "",
  };

  const isFiltered = Object.values(current).some(Boolean);

  const set = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) { params.set(key, value); } else { params.delete(key); }
      params.delete("offset");
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={current.type}
        onChange={(e) => set("type", e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/30"
      >
        <option value="">All types</option>
        {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
      </select>

      <select
        value={current.enrichment_status}
        onChange={(e) => set("enrichment_status", e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/30"
      >
        <option value="">All enrichment</option>
        {ENRICH_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select
        value={current.state}
        onChange={(e) => set("state", e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/30"
      >
        <option value="">All states</option>
        {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <select
        value={current.status}
        onChange={(e) => set("status", e.target.value)}
        className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/30"
      >
        <option value="">All statuses</option>
        {ORG_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <input
        type="search"
        value={current.search}
        onChange={(e) => set("search", e.target.value)}
        placeholder="Search name or email…"
        className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/30 min-w-[180px]"
      />

      {isFiltered && (
        <button
          onClick={() => router.push(pathname)}
          className="text-sm text-muted-foreground hover:text-foreground underline underline-offset-2"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
