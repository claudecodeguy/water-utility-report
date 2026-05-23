"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";

type Journalist = {
  id: string;
  name: string;
  email: string;
  outlet: string;
  state: string | null;
  beat: string | null;
  status: string;
  contacted_count: number;
  reply_count: number;
  pickup_count: number;
  last_contacted_at: string | null;
};

type SortKey = keyof Journalist;

const STATUS_OPTIONS = ["active", "blacklisted", "unsubscribed", "bounced"] as const;

const statusColors: Record<string, string> = {
  active:       "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  blacklisted:  "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
  unsubscribed: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  bounced:      "text-muted-foreground bg-muted border-border",
};

function SortableHeader({
  label, col, sort, dir, onSort,
}: {
  label: string; col: SortKey; sort: SortKey; dir: "asc" | "desc"; onSort: (col: SortKey) => void;
}) {
  return (
    <th
      className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors"
      onClick={() => onSort(col)}
    >
      {label}
      {sort === col && <span className="ml-1 opacity-50">{dir === "asc" ? "↑" : "↓"}</span>}
    </th>
  );
}

export default function AdminJournalistsTable({ journalists: initial }: { journalists: Journalist[] }) {
  const [rows, setRows] = useState(initial);
  const [sort, setSort] = useState<SortKey>("name");
  const [dir, setDir] = useState<"asc" | "desc">("asc");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleSort(col: SortKey) {
    const nextDir = sort === col && dir === "asc" ? "desc" : "asc";
    setSort(col);
    setDir(nextDir);
    setRows((prev) =>
      [...prev].sort((a, b) => {
        const cmp = String(a[col] ?? "").localeCompare(String(b[col] ?? ""), undefined, { numeric: true });
        return nextDir === "asc" ? cmp : -cmp;
      })
    );
  }

  function handleStatusChange(id: string, status: string) {
    setRows((prev) => prev.map((j) => j.id === id ? { ...j, status } : j));
    startTransition(async () => {
      await fetch(`/api/outreach/journalists/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
    });
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    startTransition(async () => {
      const res = await fetch(`/api/outreach/journalists/${id}`, { method: "DELETE" });
      if (res.ok) {
        setRows((prev) => prev.filter((j) => j.id !== id));
      }
      setDeleting(null);
    });
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-white p-12 text-center text-sm text-muted-foreground">
        No journalists yet. Use <strong>Discover</strong> to find reporters or <strong>Import CSV</strong> to add manually.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-white overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <SortableHeader label="Name"         col="name"             sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="Outlet"        col="outlet"           sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="State"         col="state"            sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="Beat"          col="beat"             sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="Status"        col="status"           sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="Contacted"     col="contacted_count"  sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="Replies"       col="reply_count"      sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="Pickups"       col="pickup_count"     sort={sort} dir={dir} onSort={handleSort} />
            <SortableHeader label="Last Contact"  col="last_contacted_at" sort={sort} dir={dir} onSort={handleSort} />
            <th className="py-3 px-4 w-10" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((j) => (
            <tr key={j.id} className="hover:bg-muted/20 transition-colors group">
              <td className="py-3 px-4">
                <p className="font-medium text-foreground">{j.name}</p>
                <p className="text-xs text-muted-foreground">{j.email}</p>
              </td>
              <td className="py-3 px-4 text-sm text-muted-foreground max-w-[160px] truncate">{j.outlet}</td>
              <td className="py-3 px-4">
                {j.state
                  ? <span className="font-mono text-xs text-muted-foreground">{j.state}</span>
                  : <span className="text-xs text-muted-foreground">—</span>}
              </td>
              <td className="py-3 px-4 text-xs text-muted-foreground max-w-[140px] truncate" title={j.beat ?? ""}>
                {j.beat ?? "—"}
              </td>
              <td className="py-3 px-4">
                <select
                  value={j.status}
                  onChange={(e) => handleStatusChange(j.id, e.target.value)}
                  className={`text-xs font-semibold px-2 py-0.5 rounded-full border cursor-pointer bg-transparent ${statusColors[j.status] ?? statusColors.active}`}
                >
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="py-3 px-4 text-center text-sm tabular-nums text-muted-foreground">{j.contacted_count}</td>
              <td className="py-3 px-4 text-center text-sm tabular-nums text-muted-foreground">{j.reply_count}</td>
              <td className="py-3 px-4 text-center text-sm tabular-nums text-muted-foreground">{j.pickup_count}</td>
              <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                {j.last_contacted_at ? new Date(j.last_contacted_at).toLocaleDateString() : "Never"}
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={() => handleDelete(j.id, j.name)}
                  disabled={deleting === j.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-wur-danger disabled:opacity-30"
                  title="Delete journalist"
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
