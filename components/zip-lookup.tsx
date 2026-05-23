"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { zipUtilityMatches } from "@/lib/mock-data";
import { trackEvent } from "@/lib/analytics";

interface ZipLookupProps {
  variant?: "hero" | "inline";
  className?: string;
}

export default function ZipLookup({ variant = "hero", className }: ZipLookupProps) {
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = zip.trim();

    if (!/^\d{5}$/.test(trimmed)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    setError("");
    trackEvent("zip_lookup_submitted", { zip: trimmed });
    trackEvent("utility_search_completed", { zip: trimmed });
    router.push(`/search?zip=${trimmed}`);
  };

  const handleFocus = () => {
    trackEvent("zip_lookup_started");
    trackEvent("utility_search_started");
  };

  if (variant === "inline") {
    return (
      <div className={cn("flex flex-col gap-1.5", className)}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              value={zip}
              onChange={(e) => { setZip(e.target.value.replace(/\D/g, "")); setError(""); }}
              onFocus={handleFocus}
              placeholder="Enter ZIP code"
              className={cn(
                "w-full pl-9 pr-4 h-10 rounded-md border bg-white text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wur-teal",
                error ? "border-red-400" : "border-gray-300"
              )}
            />
          </div>
          <button
            type="submit"
            className="h-10 px-4 bg-wur-teal text-white text-sm font-medium rounded-md hover:bg-wur-teal/90 transition-colors flex items-center gap-1.5 shrink-0"
          >
            Search <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>
        {error && (
          <p className="text-xs text-red-300 flex items-center gap-1.5">
            <AlertCircle className="w-3 h-3 shrink-0" />{error}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-lg", className)}>
      <form onSubmit={handleSubmit}>
        <div className="flex rounded-xl overflow-hidden shadow-2xl shadow-black/30 ring-1 ring-white/20">
          <div className="relative flex-1">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={5}
              value={zip}
              onChange={(e) => { setZip(e.target.value.replace(/\D/g, "")); setError(""); }}
              onFocus={handleFocus}
              placeholder="Enter your ZIP code"
              className="w-full h-14 bg-white text-wur-ink text-base px-5 focus:outline-none placeholder:text-gray-400 font-sans"
              aria-label="ZIP code"
            />
          </div>
          <button
            type="submit"
            className="h-14 px-6 bg-wur-aqua text-white font-medium text-sm flex items-center gap-2 hover:bg-wur-aqua/90 transition-colors shrink-0"
          >
            <Search className="w-4 h-4" />
            <span>Find My Utility</span>
          </button>
        </div>
        {error && (
          <p className="mt-2.5 text-sm text-red-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {error}
          </p>
        )}
        <p className="mt-3 text-xs text-white/40">
          Try: 90001 (LA), 77001 (Houston), 33101 (Miami), 85001 (Phoenix), 43201 (Columbus)
        </p>
      </form>
    </div>
  );
}
