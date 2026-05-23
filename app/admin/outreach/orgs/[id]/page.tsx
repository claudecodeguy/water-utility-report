"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ExternalLink } from "lucide-react";

const ORG_TYPES = ["nonprofit", "extension", "health_dept", "research", "advocacy", "other"] as const;
const ORG_STATUSES = ["active", "unsubscribed", "bounced", "blacklisted"] as const;

type Org = {
  id: string; name: string; email: string; contact_name: string | null;
  organization_type: string | null; website: string | null;
  focus_areas: string[]; recent_topics: string[]; states_served: string[];
  is_national: boolean; enrichment_status: string; enrichment_data: Record<string, unknown> | null;
  notes: string | null; status: string;
  contacted_count: number; reply_count: number; pickup_count: number;
  created_at: string;
};

type Pitch = {
  id: string; page_url: string; state_name: string | null; subject: string;
  status: string; draft_created_at: string; sent_at: string | null;
  reply_sentiment: string | null; published_url: string | null;
};

const pitchStatusColors: Record<string, string> = {
  draft:     "text-gray-600 bg-gray-50 border-gray-200",
  approved:  "text-blue-700 bg-blue-50 border-blue-200",
  sent:      "text-amber-700 bg-amber-50 border-amber-200",
  replied:   "text-green-700 bg-green-50 border-green-200",
  published: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

function ArrayEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [raw, setRaw] = useState(value.join("; "));
  return (
    <input
      value={raw}
      onChange={(e) => { setRaw(e.target.value); onChange(e.target.value.split(";").map((s) => s.trim()).filter(Boolean)); }}
      className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30"
      placeholder="semicolon-separated"
    />
  );
}

export default function AdminOrgDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [org, setOrg] = useState<Org | null>(null);
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [pitchStats, setPitchStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [enriching, setEnriching] = useState(false);
  const [enrichMsg, setEnrichMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [enrichOpen, setEnrichOpen] = useState(false);

  // Editable draft
  const [draft, setDraft] = useState<Partial<Org>>({});

  useEffect(() => {
    async function load() {
      const [orgRes, pitchRes] = await Promise.all([
        fetch(`/api/outreach/orgs/${id}`),
        fetch(`/api/outreach/orgs/${id}/pitches`),
      ]);
      const orgData = await orgRes.json();
      if (orgData.ok) {
        setOrg(orgData.org);
        setPitchStats(orgData.pitch_stats ?? {});
        setDraft(orgData.org);
      }
      if (pitchRes.ok) {
        const pd = await pitchRes.json();
        if (pd.ok) setPitches(pd.pitches ?? []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const res = await fetch(`/api/outreach/orgs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: draft.name,
        contact_name: draft.contact_name,
        organization_type: draft.organization_type,
        website: draft.website,
        focus_areas: draft.focus_areas,
        recent_topics: draft.recent_topics,
        states_served: draft.states_served,
        is_national: draft.is_national,
        notes: draft.notes,
        status: draft.status,
      }),
    });
    const data = await res.json();
    if (data.ok) { setOrg(data.org); setEditing(false); }
    else setSaveError(data.error ?? "Save failed");
    setSaving(false);
  }

  async function handleEnrich() {
    setEnriching(true);
    setEnrichMsg(null);
    const res = await fetch("/api/outreach/orgs/enrich", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orgId: id }),
    });
    const data = await res.json();
    setEnriching(false);
    if (data.ok) {
      setEnrichMsg(data.enriched === 1 ? "Enriched successfully" : "Enrichment failed — check data below");
      const refreshed = await fetch(`/api/outreach/orgs/${id}`);
      const rd = await refreshed.json();
      if (rd.ok) { setOrg(rd.org); setDraft(rd.org); }
    } else {
      setEnrichMsg(data.error ?? "Enrichment error");
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/outreach/orgs/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/outreach/orgs");
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
    );
  }
  if (!org) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">Organization not found.</div>
    );
  }

  const enrichData = org.enrichment_data as Record<string, unknown> | null;

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Breadcrumb */}
      <Link href="/admin/outreach/orgs" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="w-4 h-4" /> Organizations
      </Link>

      {/* ── SECTION 1: ORG DETAILS ─────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-white p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl text-foreground mb-0.5">{org.name}</h1>
            <p className="text-sm text-muted-foreground">{org.email}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            {org.enrichment_status !== "manual" && (
              <button
                onClick={handleEnrich}
                disabled={enriching}
                className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted/50 disabled:opacity-50 transition-colors"
              >
                {enriching ? "Enriching…" : "Re-enrich"}
              </button>
            )}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="px-3 py-1.5 text-sm rounded-lg bg-wur-teal text-white hover:bg-wur-teal/90 transition-colors"
              >
                Edit
              </button>
            ) : (
              <>
                <button onClick={() => { setEditing(false); setDraft(org); }}
                  className="px-3 py-1.5 text-sm rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="px-3 py-1.5 text-sm rounded-lg bg-wur-teal text-white hover:bg-wur-teal/90 disabled:opacity-50 transition-colors">
                  {saving ? "Saving…" : "Save"}
                </button>
              </>
            )}
          </div>
        </div>

        {enrichMsg && (
          <p className="text-sm text-muted-foreground border border-border rounded-lg px-3 py-2 bg-muted/30">
            {enrichMsg}
          </p>
        )}
        {saveError && <p className="text-sm text-wur-danger">{saveError}</p>}

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Name", key: "name", type: "text" },
            { label: "Contact name", key: "contact_name", type: "text" },
            { label: "Website", key: "website", type: "url" },
          ].map(({ label, key, type }) => (
            <div key={key} className={key === "website" ? "col-span-2" : ""}>
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              {editing ? (
                <input
                  type={type}
                  value={(draft[key as keyof Org] as string) ?? ""}
                  onChange={(e) => setDraft((d) => ({ ...d, [key]: e.target.value || null }))}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30"
                />
              ) : (
                <p className="text-sm text-foreground">
                  {key === "website" && org.website ? (
                    <a href={org.website} target="_blank" rel="noopener noreferrer"
                      className="text-wur-teal hover:underline inline-flex items-center gap-1">
                      {org.website} <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    (org[key as keyof Org] as string) ?? <span className="text-muted-foreground">—</span>
                  )}
                </p>
              )}
            </div>
          ))}

          <div>
            <p className="text-xs text-muted-foreground mb-1">Type</p>
            {editing ? (
              <select value={draft.organization_type ?? ""}
                onChange={(e) => setDraft((d) => ({ ...d, organization_type: e.target.value || null }))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/30">
                <option value="">—</option>
                {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            ) : (
              <p className="text-sm text-foreground">{org.organization_type ?? <span className="text-muted-foreground">—</span>}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            {editing ? (
              <select value={draft.status ?? "active"}
                onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-wur-teal/30">
                {ORG_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            ) : (
              <p className="text-sm text-foreground">{org.status}</p>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">National?</p>
            {editing ? (
              <input type="checkbox" checked={draft.is_national ?? false}
                onChange={(e) => setDraft((d) => ({ ...d, is_national: e.target.checked }))}
                className="mt-1" />
            ) : (
              <p className="text-sm text-foreground">{org.is_national ? "Yes" : "No"}</p>
            )}
          </div>

          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-1">States served</p>
            {editing ? (
              <ArrayEditor value={draft.states_served ?? []} onChange={(v) => setDraft((d) => ({ ...d, states_served: v }))} />
            ) : (
              <p className="text-sm text-foreground">{org.states_served.join(", ") || <span className="text-muted-foreground">—</span>}</p>
            )}
          </div>

          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Focus areas</p>
            {editing ? (
              <ArrayEditor value={draft.focus_areas ?? []} onChange={(v) => setDraft((d) => ({ ...d, focus_areas: v }))} />
            ) : (
              <p className="text-sm text-foreground">{org.focus_areas.join("; ") || <span className="text-muted-foreground">—</span>}</p>
            )}
          </div>

          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Recent topics (AI-inferred)</p>
            {editing ? (
              <ArrayEditor value={draft.recent_topics ?? []} onChange={(v) => setDraft((d) => ({ ...d, recent_topics: v }))} />
            ) : (
              <p className="text-sm text-foreground">{org.recent_topics.join("; ") || <span className="text-muted-foreground">—</span>}</p>
            )}
          </div>

          <div className="col-span-2">
            <p className="text-xs text-muted-foreground mb-1">Notes</p>
            {editing ? (
              <textarea value={draft.notes ?? ""} rows={2}
                onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value || null }))}
                className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30 resize-none" />
            ) : (
              <p className="text-sm text-foreground">{org.notes ?? <span className="text-muted-foreground">—</span>}</p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            Enrichment: <span className="font-medium">{org.enrichment_status}</span>
            {" · "}Activity: {org.contacted_count} contacted · {org.reply_count} replied · {org.pickup_count} pickup
          </p>
          {!showDeleteConfirm ? (
            <button onClick={() => setShowDeleteConfirm(true)}
              className="text-sm text-wur-danger hover:underline">
              Delete organization
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Are you sure?</span>
              <button onClick={handleDelete}
                className="px-3 py-1 text-sm rounded-lg bg-wur-danger text-white hover:bg-wur-danger/90 transition-colors">
                Yes, delete
              </button>
              <button onClick={() => setShowDeleteConfirm(false)}
                className="px-3 py-1 text-sm rounded-lg border border-border hover:bg-muted/50 transition-colors">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── SECTION 2: ENRICHMENT DATA ────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <button
          onClick={() => setEnrichOpen((v) => !v)}
          className="w-full flex items-center justify-between px-6 py-4 text-sm font-medium text-foreground hover:bg-muted/20 transition-colors"
        >
          <span>Enrichment data</span>
          <span className="text-muted-foreground">{enrichOpen ? "▲" : "▼"}</span>
        </button>
        {enrichOpen && (
          <div className="px-6 pb-6 space-y-3 border-t border-border">
            {enrichData ? (
              <>
                {enrichData.enriched_at && (
                  <p className="text-xs text-muted-foreground pt-3">
                    Enriched: {new Date(enrichData.enriched_at as string).toLocaleString()}
                  </p>
                )}
                {(enrichData.scraped_urls as string[] | undefined)?.length && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Scraped URLs:</p>
                    {(enrichData.scraped_urls as string[]).map((u) => (
                      <a key={u} href={u} target="_blank" rel="noopener noreferrer"
                        className="block text-xs text-wur-teal hover:underline truncate">{u}</a>
                    ))}
                  </div>
                )}
                {enrichData.notes && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">LLM notes:</p>
                    <p className="text-sm text-foreground">{enrichData.notes as string}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Raw LLM output:</p>
                  <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(enrichData, null, 2)}
                  </pre>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground pt-3">No enrichment data yet.</p>
            )}
          </div>
        )}
      </div>

      {/* ── SECTION 3: PITCH HISTORY ──────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Pitch history</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {Object.entries(pitchStats).map(([s, n]) => `${n} ${s}`).join(" · ") || "0 pitches"}
          </p>
        </div>
        {pitches.length === 0 ? (
          <p className="px-6 py-6 text-sm text-muted-foreground">
            No pitches yet. Pitches are created automatically once the organization is enriched and the daily orchestrator runs.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {["Page", "State", "Subject", "Status", "Sent", "Sentiment", "Backlink"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pitches.map((p) => (
                <tr key={p.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 max-w-[160px]">
                    <span className="text-xs text-muted-foreground truncate block" title={p.page_url}>
                      {p.page_url.replace("https://waterutilityreport.com", "")}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{p.state_name ?? "—"}</td>
                  <td className="py-3 px-4 max-w-[200px] text-xs text-foreground truncate">{p.subject}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${pitchStatusColors[p.status] ?? pitchStatusColors.draft}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                    {p.sent_at ? new Date(p.sent_at).toLocaleDateString() : "—"}
                  </td>
                  <td className="py-3 px-4 text-xs text-muted-foreground">{p.reply_sentiment ?? "—"}</td>
                  <td className="py-3 px-4 text-xs">
                    {p.published_url ? (
                      <a href={p.published_url} target="_blank" rel="noopener noreferrer"
                        className="text-wur-teal hover:underline inline-flex items-center gap-0.5">
                        link <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
