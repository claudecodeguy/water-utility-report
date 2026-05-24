"use client";

import { useState, useTransition } from "react";

export type OrgPitchCardData = {
  id: string;
  subject: string;
  body: string;
  personalization_note: string | null;
  page_url: string;
  page_type: string;
  state_abbreviation: string | null;
  status: string;
  score: number;
  organization: {
    id: string;
    name: string;
    email: string;
    organization_type: string | null;
    contact_name: string | null;
    focus_areas: string[];
    contacted_count: number;
    pickup_count: number;
  };
};

const scoreColor = (score: number) =>
  score >= 9  ? "text-wur-teal bg-wur-teal/10 border-wur-teal/30" :
  score >= 7  ? "text-green-700 bg-green-50 border-green-200" :
  score >= 5  ? "text-amber-700 bg-amber-50 border-amber-200" :
               "text-muted-foreground bg-muted border-border";

const typeColors: Record<string, string> = {
  nonprofit:   "text-emerald-700 bg-emerald-50 border-emerald-200",
  extension:   "text-violet-700 bg-violet-50 border-violet-200",
  health_dept: "text-sky-700 bg-sky-50 border-sky-200",
  research:    "text-indigo-700 bg-indigo-50 border-indigo-200",
  advocacy:    "text-orange-700 bg-orange-50 border-orange-200",
  other:       "text-gray-600 bg-gray-50 border-gray-200",
};

function Chip({ label, className }: { label: string; className?: string }) {
  return (
    <span className={`inline-block text-xs border rounded px-1.5 py-0.5 ${className ?? "text-muted-foreground bg-muted border-border"}`}>
      {label}
    </span>
  );
}

export default function AdminOrgPitchCard({
  pitch,
  onRemove,
  onApprove,
}: {
  pitch: OrgPitchCardData;
  onRemove: (id: string) => void;
  onApprove?: (id: string) => void;
}) {
  const [subject, setSubject] = useState(pitch.subject);
  const [body, setBody] = useState(pitch.body);
  const [rejectReason, setRejectReason] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [saved, setSaved] = useState(false);
  const [, startTransition] = useTransition();

  const autocorrected =
    pitch.personalization_note?.startsWith("[") ?? false;

  const autocorrectedPrefixes = autocorrected
    ? pitch.personalization_note?.match(/^\[.*?\](?:\s*\[.*?\])*/)?.[0] ?? ""
    : "";

  function handleSave() {
    startTransition(async () => {
      await fetch(`/api/outreach/orgs/pitches/${pitch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
        credentials: "include",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  }

  function handleApprove() {
    startTransition(async () => {
      const res = await fetch("/api/outreach/orgs/pitches/bulk-approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitchIds: [pitch.id] }),
        credentials: "include",
      });
      if (res.ok) {
        onApprove?.(pitch.id);
      } else {
        const j = await res.json();
        alert(`Approve failed: ${j.error ?? "unknown error"}`);
      }
    });
  }

  function handleSendNow() {
    startTransition(async () => {
      const res = await fetch(`/api/outreach/orgs/pitches/${pitch.id}/send`, {
        method: "POST",
        credentials: "include",
      });
      if (res.ok) {
        onRemove(pitch.id);
      } else {
        const j = await res.json();
        alert(`Send failed: ${j.error ?? "unknown error"}`);
      }
    });
  }

  function handleReject() {
    startTransition(async () => {
      await fetch(`/api/outreach/orgs/pitches/${pitch.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", notes: rejectReason }),
        credentials: "include",
      });
      onRemove(pitch.id);
    });
  }

  return (
    <div className="rounded-xl border border-border bg-white p-5 space-y-3">
      {/* Top row — badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs font-mono border rounded px-1.5 py-0.5 ${scoreColor(pitch.score)}`}>
          score {pitch.score.toFixed(1)}
        </span>
        {pitch.organization.organization_type && (
          <Chip
            label={pitch.organization.organization_type}
            className={typeColors[pitch.organization.organization_type] ?? typeColors.other}
          />
        )}
        <Chip
          label={pitch.state_abbreviation ?? "national"}
          className="text-slate-700 bg-slate-50 border-slate-200"
        />
        {autocorrected && (
          <span
            className="inline-flex items-center gap-1 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5"
            title={autocorrectedPrefixes}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            auto-corrected
          </span>
        )}
      </div>

      {/* Org line */}
      <div className="text-sm">
        <span className="font-medium text-foreground">{pitch.organization.name}</span>
        <span className="text-muted-foreground">
          {" · "}{pitch.organization.email}
          {" · "}pickups: {pitch.organization.pickup_count}
          {" · "}contacted: {pitch.organization.contacted_count}
        </span>
        {pitch.organization.contact_name && (
          <div className="text-muted-foreground text-xs mt-0.5">
            {pitch.organization.contact_name}
          </div>
        )}
      </div>

      {/* Focus areas */}
      {pitch.organization.focus_areas.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {pitch.organization.focus_areas.slice(0, 4).map((f) => (
            <Chip key={f} label={f} />
          ))}
          {pitch.organization.focus_areas.length > 4 && (
            <Chip label={`+${pitch.organization.focus_areas.length - 4}`} />
          )}
        </div>
      )}

      {/* Subject */}
      <input
        className="w-full border border-border rounded-lg px-3 py-2 text-sm font-medium bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/40"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
      />

      {/* Body */}
      <textarea
        className="w-full border border-border rounded-lg px-3 py-2 text-sm font-mono bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/40 resize-y"
        rows={10}
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />

      {/* Personalization note */}
      {pitch.personalization_note && (
        <p className="text-xs text-muted-foreground italic">{pitch.personalization_note}</p>
      )}

      {/* Reject input */}
      {showReject && (
        <div className="flex gap-2">
          <input
            className="flex-1 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none"
            placeholder="Reason (optional)"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <button
            onClick={handleReject}
            className="text-sm px-3 py-1.5 border border-red-200 text-red-700 rounded-lg hover:bg-red-50"
          >
            Confirm reject
          </button>
          <button
            onClick={() => setShowReject(false)}
            className="text-sm px-3 py-1.5 text-muted-foreground hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center gap-3 pt-1">
        {pitch.status === "approved" ? (
          <button
            onClick={handleSendNow}
            className="text-sm px-4 py-2 rounded-lg bg-wur-teal text-white font-medium hover:bg-wur-teal/90"
          >
            Send now
          </button>
        ) : (
          <button
            onClick={handleApprove}
            className="text-sm px-4 py-2 rounded-lg bg-wur-teal text-white font-medium hover:bg-wur-teal/90"
          >
            Approve
          </button>
        )}
        <button
          onClick={handleSave}
          className="text-sm px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted"
        >
          {saved ? "Saved!" : "Save edits"}
        </button>
        {!showReject && (
          <button
            onClick={() => setShowReject(true)}
            className="text-sm text-muted-foreground hover:text-red-600"
          >
            Reject
          </button>
        )}
      </div>
    </div>
  );
}
