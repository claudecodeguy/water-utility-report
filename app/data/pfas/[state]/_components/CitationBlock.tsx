"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

type Format = "apa" | "mla" | "chicago";

interface CitationBlockProps {
  stateName: string;
  stateSlug: string;
  latestSampleDate: string | null;
  hubMode?: boolean;
}

const BASE = "https://waterutilityreport.com";

export default function CitationBlock({
  stateName,
  stateSlug,
  latestSampleDate,
  hubMode = false,
}: CitationBlockProps) {
  const [activeFormat, setActiveFormat] = useState<Format>("apa");
  const [copied, setCopied] = useState(false);

  const today = new Date();
  const accessDate = today.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const accessYear = today.getFullYear();
  const url = hubMode ? `${BASE}/data/pfas` : `${BASE}/data/pfas/${stateSlug}`;
  const dataYear = latestSampleDate
    ? new Date(latestSampleDate).getUTCFullYear()
    : "2025";

  const citations: Record<Format, string> = hubMode
    ? {
        apa: `Water Utility Report. (${accessYear}). PFAS in U.S. drinking water: State-by-state data. Retrieved ${accessDate}, from ${url}`,
        mla: `"PFAS in U.S. Drinking Water: State-by-State Data." Water Utility Report, ${accessYear}, ${url}. Accessed ${accessDate}.`,
        chicago: `Water Utility Report. "PFAS in U.S. Drinking Water: State-by-State Data." Accessed ${accessDate}. ${url}.`,
      }
    : {
        apa: `Water Utility Report. (${accessYear}). PFAS in ${stateName} drinking water: EPA UCMR 5 monitoring records (${dataYear}). Retrieved ${accessDate}, from ${url}`,
        mla: `"PFAS in ${stateName} Drinking Water: EPA UCMR 5 Monitoring Records." Water Utility Report, ${accessYear}, ${url}. Accessed ${accessDate}.`,
        chicago: `Water Utility Report. "PFAS in ${stateName} Drinking Water: EPA UCMR 5 Monitoring Records." Accessed ${accessDate}. ${url}.`,
      };

  const handleCopy = () => {
    navigator.clipboard.writeText(citations[activeFormat]).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h3 className="font-semibold text-foreground text-sm mb-3">Cite this page</h3>
      <div className="flex gap-1 mb-3">
        {(["apa", "mla", "chicago"] as Format[]).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFormat(f)}
            className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors ${
              activeFormat === f
                ? "bg-wur-teal text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="relative">
        <p className="text-xs text-muted-foreground leading-relaxed bg-secondary/50 rounded-md p-3 pr-10 font-mono select-all whitespace-pre-wrap break-words">
          {citations[activeFormat]}
        </p>
        <button
          onClick={handleCopy}
          className="absolute top-2 right-2 p-1.5 rounded hover:bg-border transition-colors"
          title="Copy citation"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-600" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
}
