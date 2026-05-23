"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function CopyPwsid({ pwsid }: { pwsid: string }) {
  const [copied, setCopied] = useState(false);

  function handleClick() {
    navigator.clipboard?.writeText(pwsid).catch(() => {});
    trackEvent("copy_pwsid", { pwsid });
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button
      onClick={handleClick}
      className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground hover:text-wur-teal transition-colors cursor-copy"
      title="Copy PWSID"
    >
      {pwsid}
      {copied ? (
        <Check className="w-3 h-3 text-wur-safe" />
      ) : (
        <Copy className="w-3 h-3 opacity-40 hover:opacity-80" />
      )}
    </button>
  );
}
