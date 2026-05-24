"use client";

import { useState } from "react";
import AdminOrgPitchCard, { type OrgPitchCardData } from "./admin-org-pitch-card";

export type CohortStat = {
  cohort: string;
  sent: number;
  replied: number;
  draft: number;
  approved: number;
};

const COHORT_OPTIONS = ["all", "extension", "nonprofit", "health_dept", "research", "advocacy", "other"] as const;
const PAGE_OPTIONS = ["all", "state", "hub"] as const;

function replyRateLabel(sent: number, replied: number) {
  if (sent === 0) return "—";
  return `${((replied / sent) * 100).toFixed(1)}%`;
}

function phaseLabel(sent: number) {
  if (sent < 30) return { label: `${sent}/30 collecting`, color: "text-muted-foreground" };
  if (sent < 75) return { label: `${sent}/75 preliminary`, color: "text-amber-600" };
  if (sent < 150) return { label: `${sent}/150 decision`, color: "text-blue-600" };
  return { label: `${sent} ✓ significant`, color: "text-emerald-600" };
}

function CohortStatsBar({ stats }: { stats: CohortStat[] }) {
  if (stats.length === 0) return null;
  const active = stats.filter((s) => s.sent > 0 || s.draft > 0 || s.approved > 0);
  if (active.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-white p-4 space-y-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Cohort performance</p>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-xs text-muted-foreground border-b border-border">
            <th className="text-left pb-1.5 font-medium">Cohort</th>
            <th className="text-right pb-1.5 font-medium">Sent</th>
            <th className="text-right pb-1.5 font-medium">Replied</th>
            <th className="text-right pb-1.5 font-medium">Reply rate</th>
            <th className="text-right pb-1.5 font-medium">Draft</th>
            <th className="text-right pb-1.5 font-medium">Approved</th>
            <th className="text-right pb-1.5 font-medium">Phase</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {active.map((s) => {
            const phase = phaseLabel(s.sent);
            return (
              <tr key={s.cohort}>
                <td className="py-1.5 font-medium capitalize">{s.cohort.replace("_", " ")}</td>
                <td className="py-1.5 text-right tabular-nums">{s.sent}</td>
                <td className="py-1.5 text-right tabular-nums">{s.replied}</td>
                <td className="py-1.5 text-right tabular-nums font-medium">{replyRateLabel(s.sent, s.replied)}</td>
                <td className="py-1.5 text-right tabular-nums text-muted-foreground">{s.draft}</td>
                <td className="py-1.5 text-right tabular-nums text-amber-600">{s.approved}</td>
                <td className={`py-1.5 text-right text-xs ${phase.color}`}>{phase.label}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="text-xs text-muted-foreground">
        Decision points: 30 sent (directional) → 75 (pause underperformers) → 150 (statistical significance, p≈0.05)
      </p>
    </div>
  );
}

export default function AdminOrgPitchQueue({
  draftPitches,
  approvedPitches,
  cohortStats,
  dailyBudgetRemaining,
}: {
  draftPitches: OrgPitchCardData[];
  approvedPitches: OrgPitchCardData[];
  cohortStats: CohortStat[];
  dailyBudgetRemaining: number;
}) {
  const [drafts, setDrafts] = useState(draftPitches);
  const [approved, setApproved] = useState(approvedPitches);
  const [activeTab, setActiveTab] = useState<"draft" | "approved">("draft");
  const [cohortFilter, setCohortFilter] = useState<string>("all");
  const [pageTypeFilter, setPageTypeFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [bulkApproveConfirm, setBulkApproveConfirm] = useState(false);
  const [bulkSendConfirm, setBulkSendConfirm] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);

  function filterPitches(pitches: OrgPitchCardData[]) {
    return pitches.filter((p) => {
      if (cohortFilter !== "all" && p.organization.organization_type !== cohortFilter) return false;
      if (pageTypeFilter !== "all" && p.page_type !== pageTypeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.organization.name.toLowerCase().includes(q) && !p.organization.email.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }

  const filteredDrafts = filterPitches(drafts);
  const filteredApproved = filterPitches(approved);
  const activePitches = activeTab === "draft" ? filteredDrafts : filteredApproved;

  function removeDraft(id: string) {
    setDrafts((prev) => prev.filter((p) => p.id !== id));
  }

  function moveToApproved(id: string) {
    const pitch = drafts.find((p) => p.id === id);
    if (pitch) {
      setDrafts((prev) => prev.filter((p) => p.id !== id));
      setApproved((prev) => [...prev, { ...pitch, status: "approved" }]);
    }
  }

  function removeApproved(id: string) {
    setApproved((prev) => prev.filter((p) => p.id !== id));
  }

  async function handleBulkApprove() {
    setBulkLoading(true);
    const ids = filteredDrafts.map((p) => p.id);
    try {
      const res = await fetch("/api/outreach/orgs/pitches/bulk-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchIds: ids }),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        const approvedIds = new Set(ids);
        const nowApproved = drafts.filter((p) => approvedIds.has(p.id)).map((p) => ({ ...p, status: "approved" }));
        setDrafts((prev) => prev.filter((p) => !approvedIds.has(p.id)));
        setApproved((prev) => [...prev, ...nowApproved]);
        setActiveTab("approved");
      } else {
        alert(`Bulk approve failed: ${j.error}`);
      }
    } finally {
      setBulkLoading(false);
      setBulkApproveConfirm(false);
    }
  }

  async function handleBulkSend() {
    setBulkLoading(true);
    const ids = filteredApproved.map((p) => p.id);
    try {
      const res = await fetch("/api/outreach/orgs/pitches/bulk-send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchIds: ids }),
        credentials: "include",
      });
      const j = await res.json();
      if (j.ok) {
        const sentIds = new Set<string>(ids.filter((id) => !j.failed?.find((f: { pitchId: string }) => f.pitchId === id)));
        setApproved((prev) => prev.filter((p) => !sentIds.has(p.id)));
        if (j.failed?.length > 0) {
          alert(`${j.sent} sent. ${j.failed.length} failed — check console.`);
        }
      } else {
        alert(`Bulk send failed: ${j.error}`);
      }
    } finally {
      setBulkLoading(false);
      setBulkSendConfirm(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Cohort stats */}
      <CohortStatsBar stats={cohortStats} />

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-border">
        {(["draft", "approved"] as const).map((tab) => {
          const count = tab === "draft" ? drafts.length : approved.length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab
                  ? "border-wur-teal text-wur-teal"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "draft" ? "Needs Review" : "Approved"}
              {count > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                  activeTab === tab ? "bg-wur-teal/15 text-wur-teal" : "bg-muted text-muted-foreground"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white"
          value={cohortFilter}
          onChange={(e) => setCohortFilter(e.target.value)}
        >
          {COHORT_OPTIONS.map((o) => (
            <option key={o} value={o}>{o === "all" ? "All cohorts" : o.replace("_", " ")}</option>
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

        <input
          className="text-sm border border-border rounded-lg px-3 py-1.5 bg-white w-52"
          placeholder="Search org name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="text-xs text-muted-foreground ml-auto">
          {activePitches.length} shown · daily budget remaining: {dailyBudgetRemaining}
        </span>
      </div>

      {/* Bulk actions */}
      {activeTab === "draft" && filteredDrafts.length > 0 && (
        <div className="flex items-center gap-3">
          {bulkApproveConfirm ? (
            <>
              <span className="text-sm text-foreground">
                Approve {filteredDrafts.length} pitches? They&apos;ll queue for the daily cron send.
              </span>
              <button
                onClick={handleBulkApprove}
                disabled={bulkLoading}
                className="text-sm px-4 py-1.5 rounded-lg bg-wur-teal text-white font-medium hover:bg-wur-teal/90 disabled:opacity-50"
              >
                {bulkLoading ? "Approving…" : "Yes, approve all"}
              </button>
              <button onClick={() => setBulkApproveConfirm(false)} className="text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setBulkApproveConfirm(true)}
              className="text-sm px-4 py-1.5 rounded-lg bg-wur-teal text-white font-medium hover:bg-wur-teal/90"
            >
              Bulk approve ({filteredDrafts.length})
            </button>
          )}
        </div>
      )}

      {activeTab === "approved" && filteredApproved.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            Approved pitches send automatically via daily cron (up to daily limit). Or:
          </span>
          {bulkSendConfirm ? (
            <>
              <span className="text-sm text-foreground">Send {filteredApproved.length} now?</span>
              <button
                onClick={handleBulkSend}
                disabled={bulkLoading}
                className="text-sm px-4 py-1.5 rounded-lg bg-wur-teal text-white font-medium hover:bg-wur-teal/90 disabled:opacity-50"
              >
                {bulkLoading ? "Sending…" : "Yes, send now"}
              </button>
              <button onClick={() => setBulkSendConfirm(false)} className="text-sm text-muted-foreground hover:text-foreground">
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setBulkSendConfirm(true)}
              className="text-sm px-4 py-1.5 rounded-lg border border-border text-foreground hover:bg-muted font-medium"
            >
              Send all now ({filteredApproved.length})
            </button>
          )}
        </div>
      )}

      {/* Pitch cards */}
      {activePitches.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center text-sm text-muted-foreground">
          {activeTab === "draft"
            ? "No drafts to review. The orchestrator runs daily at 10am UTC."
            : "No approved pitches. Approve drafts from the Needs Review tab."}
        </div>
      ) : (
        <div className="space-y-4">
          {activePitches.map((pitch) => (
            <AdminOrgPitchCard
              key={pitch.id}
              pitch={pitch}
              onRemove={activeTab === "draft" ? removeDraft : removeApproved}
              onApprove={activeTab === "draft" ? moveToApproved : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
