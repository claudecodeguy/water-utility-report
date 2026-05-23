"use client";

import { useState } from "react";
import AdminOrgPitchCard, { type OrgPitchCardData } from "./admin-org-pitch-card";

const TYPE_OPTIONS = ["all", "nonprofit", "extension", "health_dept", "research", "advocacy", "other"] as const;
const PAGE_OPTIONS = ["all", "state", "hub"] as const;

export default function AdminOrgPitchQueue({
  initialPitches,
  dailyBudgetRemaining,
}: {
  initialPitches: OrgPitchCardData[];
  dailyBudgetRemaining: number;
}) {
  const [pitches, setPitches] = useState(initialPitches);
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");
  const [pageTypeFilter, setPageTypeFilter] = useState<string>("all");
  const [autocorrectedOnly, setAutocorrectedOnly] = useState(false);
  const [search, setSearch] = useState("");
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  const filtered = pitches.filter((p) => {
    if (typeFilter !== "all" && p.organization.organization_type !== typeFilter) return false;
    if (pageTypeFilter !== "all" && p.page_type !== pageTypeFilter) return false;
    if (stateFilter === "national" && p.state_abbreviation !== null) return false;
    if (stateFilter !== "all" && stateFilter !== "national" && p.state_abbreviation !== stateFilter) return false;
    if (autocorrectedOnly && !(p.personalization_note?.startsWith("[") ?? false)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!p.organization.name.toLowerCase().includes(q) && !p.organization.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  function removePitch(id: string) {
    setPitches((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleBulkSend() {
    setBulkLoading(true);
    const ids = filtered.map((p) => p.id);
    try {
      const res = await fetch("/api/outreach/orgs/pitches/bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchIds: ids }),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        const sentIds = new Set(ids.filter((id) => !j.failed?.find((f: { pitchId: string }) => f.pitchId === id)));
        setPitches((prev) => prev.filter((p) => !sentIds.has(p.id)));
        if (j.failed?.length > 0) {
          alert(`${j.sent} sent. ${j.failed.length} failed — check console.`);
        }
      } else {
        alert(`Bulk send failed: ${j.error}`);
      }
    } finally {
      setBulkLoading(false);
      setShowBulkConfirm(false);
    }
  }

  // Collect unique states for filter dropdown
  const allStates = Array.from(
    new Set(pitches.map((p) => p.state_abbreviation).filter(Boolean))
  ).sort() as string[];

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          {TYPE_OPTIONS.map((o) => (
            <option key={o} value={o}>{o === "all" ? "All types" : o}</option>
          ))}
        </select>

        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white"
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
        >
          <option value="all">All states</option>
          <option value="national">National</option>
          {allStates.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white"
          value={pageTypeFilter}
          onChange={(e) => setPageTypeFilter(e.target.value)}
        >
          {PAGE_OPTIONS.map((o) => (
            <option key={o} value={o}>{o === "all" ? "All pages" : o}</option>
          ))}
        </select>

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={autocorrectedOnly}
            onChange={(e) => setAutocorrectedOnly(e.target.checked)}
            className="rounded"
          />
          Auto-corrected only
        </label>

        <input
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white w-52"
          placeholder="Search org name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {pitches.length} · budget remaining: {dailyBudgetRemaining}
        </span>
      </div>

      {/* Bulk actions */}
      {filtered.length > 0 && (
        <div className="flex items-center gap-3">
          {showBulkConfirm ? (
            <>
              <span className="text-sm text-foreground">
                Send {filtered.length} pitches now?
              </span>
              <button
                onClick={handleBulkSend}
                disabled={bulkLoading}
                className="text-sm px-4 py-1.5 rounded-lg bg-wur-teal text-white font-medium hover:bg-wur-teal/90 disabled:opacity-50"
              >
                {bulkLoading ? "Sending…" : "Yes, send all"}
              </button>
              <button
                onClick={() => setShowBulkConfirm(false)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowBulkConfirm(true)}
              className="text-sm px-4 py-1.5 rounded-lg bg-wur-teal text-white font-medium hover:bg-wur-teal/90"
            >
              Bulk approve &amp; send ({filtered.length})
            </button>
          )}
        </div>
      )}

      {/* Pitch cards */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center text-sm text-muted-foreground">
          No drafts match the current filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((pitch) => (
            <AdminOrgPitchCard key={pitch.id} pitch={pitch} onRemove={removePitch} />
          ))}
        </div>
      )}
    </div>
  );
}
