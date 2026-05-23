"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export type OrgRow = {
  id: string;
  name: string;
  email: string;
  organization_type: string | null;
  states_served: string[];
  focus_areas: string[];
  enrichment_status: string;
  contacted_count: number;
  reply_count: number;
  pickup_count: number;
  status: string;
  created_at: string;
};

const STATUS_OPTIONS = ["active", "unsubscribed", "bounced", "blacklisted"] as const;

const enrichColors: Record<string, string> = {
  pending:          "text-amber-700 bg-amber-50 border-amber-200",
  enriched:         "text-green-700 bg-green-50 border-green-200",
  enriched_partial: "text-amber-700 bg-amber-50 border-amber-200",
  failed:           "text-red-700 bg-red-50 border-red-200",
  manual:           "text-blue-700 bg-blue-50 border-blue-200",
};

const typeColors: Record<string, string> = {
  nonprofit:   "text-emerald-700 bg-emerald-50 border-emerald-200",
  extension:   "text-violet-700 bg-violet-50 border-violet-200",
  health_dept: "text-sky-700 bg-sky-50 border-sky-200",
  research:    "text-indigo-700 bg-indigo-50 border-indigo-200",
  advocacy:    "text-orange-700 bg-orange-50 border-orange-200",
  other:       "text-gray-600 bg-gray-50 border-gray-200",
};

const statusColors: Record<string, string> = {
  active:       "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  blacklisted:  "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
  unsubscribed: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  bounced:      "text-muted-foreground bg-muted border-border",
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "today";
  if (d === 1) return "1d ago";
  if (d < 30) return `${d}d ago`;
  const m = Math.floor(d / 30);
  return `${m}mo ago`;
}

function ChipList({ items, max, className }: { items: string[]; max: number; className?: string }) {
  if (items.length === 0) return <span className="text-xs text-muted-foreground">—</span>;
  const visible = items.slice(0, max);
  const overflow = items.length - max;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((item) => (
        <span key={item} className={`text-xs px-1.5 py-0.5 rounded border ${className ?? "text-muted-foreground bg-muted border-border"}`}>
          {item}
        </span>
      ))}
      {overflow > 0 && (
        <span className="text-xs text-muted-foreground" title={items.slice(max).join(", ")}>
          +{overflow}
        </span>
      )}
    </div>
  );
}

export default function AdminOrgsTable({ orgs: initial }: { orgs: OrgRow[] }) {
  const [rows, setRows] = useState(initial);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleStatusChange(id: string, status: string) {
    setRows((prev) => prev.map((o) => o.id === id ? { ...o, status } : o));
    startTransition(async () => {
      await fetch(`/api/outreach/orgs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    });
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}" and all its pitches? This cannot be undone.`)) return;
    setDeleting(id);
    startTransition(async () => {
      const res = await fetch(`/api/outreach/orgs/${id}`, { method: "DELETE" });
      if (res.ok) setRows((prev) => prev.filter((o) => o.id !== id));
      setDeleting(null);
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-12 text-center text-sm text-muted-foreground">
        No organizations yet. Use <strong>Import CSV</strong> to add a batch or <strong>Add manually</strong> for a single entry.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {["Name", "Type", "States", "Focus areas", "Enriched", "Activity", "Status", "Added", ""].map((h) => (
              <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((o) => (
            <tr key={o.id} className="hover:bg-muted/20 transition-colors group">
              <td className="py-3 px-4 max-w-[180px]">
                <Link href={`/admin/outreach/orgs/${o.id}`} className="font-medium text-foreground hover:text-wur-teal truncate block">
                  {o.name}
                </Link>
                <p className="text-xs text-muted-foreground truncate">{o.email}</p>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                {o.organization_type ? (
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${typeColors[o.organization_type] ?? typeColors.other}`}>
                    {o.organization_type}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </td>
              <td className="py-3 px-4 max-w-[120px]">
                <ChipList items={o.states_served} max={4} className="text-muted-foreground bg-muted border-border font-mono" />
              </td>
              <td className="py-3 px-4 max-w-[180px]">
                <ChipList items={o.focus_areas} max={3} />
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${enrichColors[o.enrichment_status] ?? enrichColors.pending}`}>
                  {o.enrichment_status}
                </span>
              </td>
              <td className="py-3 px-4 whitespace-nowrap">
                <span
                  className="text-xs text-muted-foreground tabular-nums"
                  title="contacted · replied · pickup"
                >
                  {o.contacted_count} · {o.reply_count} · {o.pickup_count}
                </span>
              </td>
              <td className="py-3 px-4">
                <select
                  value={o.status}
                  onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border cursor-pointer bg-transparent ${statusColors[o.status] ?? statusColors.active}`}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                {relativeTime(o.created_at)}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleDelete(o.id, o.name)}
                  disabled={deleting === o.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-wur-danger disabled:opacity-30"
                  title="Delete organization"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
