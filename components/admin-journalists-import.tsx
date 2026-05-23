"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";

type ImportResult = {
  inserted: number;
  updated: number;
  errors: { row: number; message: string }[];
};

export default function AdminJournalistsImport() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
      const res = await fetch("/api/outreach/journalists/import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error ?? "Import failed");
      } else {
        setResult(data);
        // Refresh the page after a short delay so the table updates
        setTimeout(() => window.location.reload(), 1500);
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
        onClick={() => { setOpen(true); setResult(null); setError(null); }}
        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-wur-teal text-white hover:bg-wur-teal/90 transition-colors"
      >
        <Upload className="w-4 h-4" />
        Import CSV
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-display text-lg font-semibold text-foreground mb-1">
              Import Journalists
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              CSV columns: <code className="text-xs bg-muted px-1 py-0.5 rounded">name, email, outlet, outlet_url, beat, state, city, recent_topics</code>.
              Use semicolons to separate multiple topics. Existing emails are updated without resetting counts.
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

            {error && (
              <p className="mt-3 text-sm text-wur-danger">{error}</p>
            )}

            {result && (
              <div className="mt-4 rounded-lg bg-wur-safe-bg border border-wur-safe-border p-3 text-sm text-wur-safe space-y-1">
                <p className="font-medium">Import complete</p>
                <p>{result.inserted} inserted · {result.updated} updated</p>
                {result.errors.length > 0 && (
                  <div className="mt-2 text-wur-caution space-y-0.5">
                    {result.errors.map((e) => (
                      <p key={e.row} className="text-xs">Row {e.row}: {e.message}</p>
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
