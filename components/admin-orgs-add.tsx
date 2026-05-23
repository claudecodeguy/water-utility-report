"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

const ORG_TYPES = ["nonprofit", "extension", "health_dept", "research", "advocacy", "other"] as const;
const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC",
];

export default function AdminOrgsAdd() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactName, setContactName] = useState("");
  const [orgType, setOrgType] = useState("");
  const [website, setWebsite] = useState("");
  const [statesServed, setStatesServed] = useState<string[]>([]);
  const [focusAreasRaw, setFocusAreasRaw] = useState("");
  const [notes, setNotes] = useState("");

  function reset() {
    setName(""); setEmail(""); setContactName(""); setOrgType("");
    setWebsite(""); setStatesServed([]); setFocusAreasRaw(""); setNotes("");
    setError(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const focusAreas = focusAreasRaw
      .split(";")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/outreach/orgs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          contact_name: contactName || undefined,
          organization_type: orgType || undefined,
          website: website || undefined,
          states_served: statesServed,
          focus_areas: focusAreas,
          notes: notes || undefined,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Failed to create organization");
      } else {
        setOpen(false);
        reset();
        window.location.reload();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  function toggleState(s: string) {
    setStatesServed((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); reset(); }}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-border bg-white text-foreground hover:bg-muted/50 transition-colors"
      >
        <Plus className="w-4 h-4" /> Add manually
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Add Organization</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
                  <input value={name} onChange={(e) => setName(e.target.value)} required
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30" />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Email *</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Contact name</label>
                  <input value={contactName} onChange={(e) => setContactName(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Type</label>
                  <select value={orgType} onChange={(e) => setOrgType(e.target.value)}
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30 bg-white">
                    <option value="">— let AI infer —</option>
                    {ORG_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Website</label>
                  <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://example.org"
                    className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  States served <span className="font-normal">(click to select, leave empty to let AI infer)</span>
                </label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 border border-border rounded-lg">
                  {US_STATES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleState(s)}
                      className={`text-xs px-1.5 py-0.5 rounded border font-mono transition-colors ${
                        statesServed.includes(s)
                          ? "bg-wur-teal text-white border-wur-teal"
                          : "text-muted-foreground border-border hover:border-wur-teal/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">
                  Focus areas override <span className="font-normal">(semicolon-separated — leave empty to use AI enrichment)</span>
                </label>
                <input value={focusAreasRaw} onChange={(e) => setFocusAreasRaw(e.target.value)}
                  placeholder="PFAS policy; drinking water access; environmental justice"
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30" />
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
                  className="w-full border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-wur-teal/30 resize-none" />
              </div>

              {error && <p className="text-sm text-wur-danger">{error}</p>}

              <button type="submit" disabled={loading}
                className="w-full py-2 px-4 rounded-lg bg-wur-teal text-white text-sm font-medium hover:bg-wur-teal/90 disabled:opacity-50 transition-colors">
                {loading ? "Creating…" : "Create organization"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
