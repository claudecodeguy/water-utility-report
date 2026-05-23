"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

type ImportResult = {
  inserted: number;
  updated: number;
  skipped: { row_number: number; email?: string; reason: string }[];
};

export default function AdminOrgsImport() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleOpen() {
    setOpen(true);
    setResult(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) return;

    setLoading(true);
    setResult(null);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/outreach/orgs/import", { method: "POST", body: formData });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Import failed");
      } else {
        setResult(data);
        setTimeout(() => window.location.reload(), 1800);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-wur-teal text-white hover:bg-wur-teal/90 transition-colors"
      >
        <Upload className="w-4 h-4" /> Import CSV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
            <h2 className="font-display text-lg font-semibold text-foreground mb-1">Import Organizations</h2>
            <p className="text-sm text-muted-foreground mb-1">
              Required columns: <code className="text-xs bg-muted px-1 py-0.5 rounded">name</code>, <code className="text-xs bg-muted px-1 py-0.5 rounded">email</code>
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Optional: <code className="text-xs bg-muted px-1 py-0.5 rounded">contact_name, organization_type, website, states_served, focus_areas_override, notes</code>.
              Use semicolons for multi-value fields (e.g. <code className="text-xs bg-muted px-1 py-0.5 rounded">TX;OK;LA</code>).
              Existing emails are updated without resetting enrichment.
            </p>
            <form onSubmit={handleUpload} className="space-y-4">
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                required
                className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-muted/70 cursor-pointer"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg bg-wur-teal text-white text-sm font-medium hover:bg-wur-teal/90 disabled:opacity-50 transition-colors"
              >
                {loading ? "Uploading…" : "Upload"}
              </button>
            </form>

            {error && <p className="mt-3 text-sm text-wur-danger">{error}</p>}

            {result && (
              <div className="mt-4 rounded-lg bg-wur-safe-bg border border-wur-safe-border p-3 text-sm text-wur-safe space-y-1">
                <p className="font-medium">Import complete</p>
                <p>{result.inserted} inserted · {result.updated} updated · {result.skipped.length} skipped</p>
                {result.skipped.length > 0 && (
                  <div className="mt-2 text-wur-caution space-y-0.5 max-h-32 overflow-y-auto">
                    {result.skipped.map((s) => (
                      <p key={s.row_number} className="text-xs">
                        Row {s.row_number}{s.email ? ` (${s.email})` : ""}: {s.reason}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
