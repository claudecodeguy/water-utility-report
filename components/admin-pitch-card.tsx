"use client";

import { useState, useTransition } from "react";

type PitchCardData = {
  id: string;
  subject: string;
  body: string;
  personalization_note: string | null;
  story: {
    newsworthiness_score: number;
    primary_angle: string | null;
    key_stat: string | null;
    signal: {
      state: string;
      contaminant: string | null;
    };
  };
  journalist: {
    name: string;
    outlet: string;
    beat: string | null;
    state: string | null;
    pickup_count: number;
  };
};

function scoreBadgeClass(score: number) {
  if (score >= 90) return "bg-wur-teal/10 text-wur-teal border-wur-teal/30";
  if (score >= 80) return "bg-wur-safe-bg text-wur-safe border-wur-safe-border";
  return "bg-amber-50 text-amber-700 border-amber-200";
}

export default function AdminPitchCard({ pitch: initial }: { pitch: PitchCardData }) {
  const [subject, setSubject] = useState(initial.subject);
  const [body, setBody] = useState(initial.body);
  const [status, setStatus] = useState<"draft" | "saved" | "rejected" | "sent" | "sending">("draft");
  const [toast, setToast] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleSave() {
    startTransition(async () => {
      const res = await fetch(`/api/outreach/pitches/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      });
      if (res.ok) {
        setStatus("saved");
        showToast("Edits saved.");
      } else {
        showToast("Save failed.");
      }
    });
  }

  function handleReject() {
    const reason = window.prompt("Rejection reason (optional):");
    startTransition(async () => {
      const res = await fetch(`/api/outreach/pitches/${initial.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rejected", notes: reason ?? undefined }),
      });
      if (res.ok) {
        setStatus("rejected");
        showToast("Pitch rejected.");
      } else {
        showToast("Reject failed.");
      }
    });
  }

  function handleSend() {
    if (status === "sending") return;
    setStatus("sending");
    startTransition(async () => {
      try {
        const res = await fetch(`/api/outreach/pitches/${initial.id}/send`, {
          method: "POST",
        });
        const data = await res.json();
        if (data.ok) {
          setStatus("sent");
          showToast("Sent. Check your inbox.");
        } else {
          setStatus("draft");
          showToast(data.error ?? "Send failed.");
        }
      } catch {
        setStatus("draft");
        showToast("Network error — send failed.");
      }
    });
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-wur-safe-border bg-wur-safe-bg p-4 text-sm text-wur-safe">
        Pitch sent to {initial.journalist.name} at {initial.journalist.outlet}.
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="rounded-xl border border-border bg-muted/30 p-4 opacity-50 text-sm text-muted-foreground">
        Pitch rejected.
      </div>
    );
  }

  const { story, journalist } = initial;

  return (
    <div className="rounded-xl border border-border bg-white p-5 space-y-4 relative">
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 right-4 z-10 text-xs px-3 py-1.5 rounded-lg bg-wur-ink text-white shadow">
          {toast}
        </div>
      )}

      {/* Top row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border tabular-nums ${scoreBadgeClass(story.newsworthiness_score)}`}>
          {story.newsworthiness_score}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground font-mono">
          {story.signal.state}
        </span>
        {story.signal.contaminant && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
            {story.signal.contaminant}
          </span>
        )}
        {status === "saved" && (
          <span className="text-xs text-wur-safe ml-auto">Saved</span>
        )}
      </div>

      {/* Story summary */}
      {story.primary_angle && (
        <p className="text-sm font-medium text-foreground leading-snug">{story.primary_angle}</p>
      )}
      {story.key_stat && (
        <p className="text-xs text-muted-foreground">{story.key_stat}</p>
      )}

      {/* Journalist */}
      <p className="text-xs text-muted-foreground">
        <span className="text-foreground font-medium">{journalist.name}</span>
        {" — "}{journalist.outlet}
        {journalist.beat && ` (${journalist.beat}`}
        {journalist.state && journalist.beat && `, ${journalist.state})`}
        {journalist.state && !journalist.beat && ` (${journalist.state})`}
        {journalist.beat && !journalist.state && `)`}
        {"  ·  prior pickups: "}{journalist.pickup_count}
      </p>

      {/* Editable subject */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-wur-teal/30"
        />
      </div>

      {/* Editable body */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Body</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={12}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-wur-teal/30 resize-y"
        />
      </div>

      {/* Personalization note */}
      {initial.personalization_note && (
        <p className="text-xs text-muted-foreground italic">
          AI rationale: {initial.personalization_note}
        </p>
      )}

      {/* Footer buttons */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleSend}
          disabled={status === "sending"}
          className="px-3 py-1.5 text-sm font-medium rounded-lg bg-wur-teal text-white hover:bg-wur-teal/90 disabled:opacity-50 transition-colors"
        >
          {status === "sending" ? "Sending…" : "Approve & Send"}
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-white text-foreground hover:border-wur-teal/40 transition-colors"
        >
          Save edits
        </button>
        <button
          onClick={handleReject}
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border bg-white text-wur-danger hover:border-wur-danger/40 transition-colors ml-auto"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
