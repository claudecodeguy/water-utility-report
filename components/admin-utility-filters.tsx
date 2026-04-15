"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface Props {
  states: { abbreviation: string; name: string }[];
  currentState: string;
  currentStatus: string;
}

export default function AdminUtilityFilters({ states, currentState, currentStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    params.delete("page"); // reset to page 1 on filter change
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <select
        value={currentState}
        onChange={(e) => update("state", e.target.value)}
        className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All States</option>
        {states.map((s) => (
          <option key={s.abbreviation} value={s.abbreviation}>{s.name}</option>
        ))}
      </select>
      <select
        value={currentStatus}
        onChange={(e) => update("status", e.target.value)}
        className="h-9 px-3 rounded-lg border border-border bg-white text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">All Statuses</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
        <option value="review">Review</option>
      </select>
    </div>
  );
}
