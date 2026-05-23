"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  subject: string;
  body: string[];
}

export default function EmailTemplateCopy({ subject, body }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const text = `Subject: ${subject}\n\n${body.join("\n")}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-5 my-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal">Copyable Email Template</p>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-wur-teal border border-wur-teal/30 rounded-md px-3 py-1.5 hover:bg-wur-teal/10 transition-colors"
        >
          {copied ? <><Check className="w-3.5 h-3.5" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
        </button>
      </div>
      <p className="text-xs text-muted-foreground mb-2 font-medium">Subject: {subject}</p>
      <div className="font-mono text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap bg-white/60 rounded-lg p-4 border border-border">
        {body.join("\n")}
      </div>
      <p className="text-xs text-muted-foreground mt-3 italic">
        Replace {"{Utility Name}"} and {"{PWSID if known}"} with your utility&apos;s actual name and ID before sending.
      </p>
    </div>
  );
}
