"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

type Result = {
  pwsid: string;
  name: string;
  city: string | null;
  state: string;
  slug: string;
};

export default function PfasSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const search = async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/pfas-search?q=${encodeURIComponent(q.trim())}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (pwsid: string) => {
    setOpen(false);
    setQuery("");
    router.push(`/pfas-watchlist/utility/${pwsid}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (results.length > 0) handleSelect(results[0].pwsid);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="relative flex items-center">
          {loading ? (
            <Loader2 className="absolute left-4 w-4 h-4 text-white/40 animate-spin" />
          ) : (
            <Search className="absolute left-4 w-4 h-4 text-white/40" />
          )}
          <input
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder="Search by utility name, city, or PWSID…"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-amber-400/60 focus:bg-white/15 transition-all"
          />
        </div>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-wur-ink border border-white/15 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto">
          {results.map((r) => (
            <button
              key={r.pwsid}
              onClick={() => handleSelect(r.pwsid)}
              className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-0"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{r.name}</p>
                <p className="text-xs text-white/40 font-mono mt-0.5">
                  {r.pwsid} · {r.city ? `${r.city}, ` : ""}{r.state}
                </p>
              </div>
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded shrink-0 mt-0.5">
                PFAS records
              </span>
            </button>
          ))}
        </div>
      )}

      {open && !loading && query.trim().length >= 2 && results.length === 0 && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-wur-ink border border-white/15 rounded-xl shadow-xl z-50 px-4 py-3">
          <p className="text-sm text-white/40">No matching water systems with PFAS records found.</p>
        </div>
      )}
    </div>
  );
}
