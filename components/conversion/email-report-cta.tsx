"use client";

import { useState, useRef, useEffect } from "react";
import { FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { requestEmailReport } from "@/lib/actions/email-report";
import { trackEvent } from "@/lib/analytics";

interface Props {
  pwsid: string;
  utilitySlug: string;
  utilityName: string;
  state: string;
  ctaLocation?: string;
  hasPfasRecords?: boolean;
  hasViolationRecords?: boolean;
}

export default function EmailReportCTA({
  pwsid,
  utilitySlug,
  utilityName,
  state,
  ctaLocation = "bottom",
  hasPfasRecords = false,
  hasViolationRecords = false,
}: Props) {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formStarted, setFormStarted] = useState(false);
  const hasTrackedView = useRef(false);

  const sharedParams = {
    utility_slug: utilitySlug,
    utility_name: utilityName,
    pwsid,
    state,
    cta_location: ctaLocation,
    conversion_type: "email_report",
    has_pfas_records: hasPfasRecords ? "1" : "0",
    has_violation_records: hasViolationRecords ? "1" : "0",
    page_type: "utility",
  };

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackEvent("email_report_cta_view", { ...sharedParams, page_path: window.location.pathname });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState === "loading") return;
    setFormState("loading");

    trackEvent("email_report_form_submit", { ...sharedParams, page_path: window.location.pathname });

    const fd = new FormData(e.currentTarget);
    fd.set("source_page_url", window.location.href);

    const result = await requestEmailReport(fd);

    if ("success" in result) {
      setFormState("success");
      trackEvent("email_report_success", {
        ...sharedParams,
        delivery_status: result.deliveryStatus,
        page_path: window.location.pathname,
      });
    } else {
      setErrorMsg(result.error);
      setFormState("error");
      trackEvent("email_report_error", {
        ...sharedParams,
        error_message: result.error,
        page_path: window.location.pathname,
      });
    }
  }

  if (formState === "success") {
    return (
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-wur-safe mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-foreground">Report request saved</p>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Your report request has been saved. Email delivery is not active yet — we&apos;ll send it when available.
            </p>
            <p className="text-[10px] text-muted-foreground/60 mt-2 leading-relaxed">
              This report summarizes official records available to Water Utility Report. It is not a water-safety determination.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-5">
      <div className="flex items-center gap-2.5 mb-2">
        <div className="w-7 h-7 rounded-full bg-wur-teal/10 flex items-center justify-center shrink-0">
          <FileText className="w-3.5 h-3.5 text-wur-teal" />
        </div>
        <p className="text-sm font-semibold text-foreground">Email me this water report</p>
      </div>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
        Receive a summary of official records for {utilityName} — including source links, violation history, PFAS sampling data where available, and certified testing lab options.
      </p>

      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" name="_hp" className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="utility_slug" value={utilitySlug} />
        <input type="hidden" name="utility_name" value={utilityName} />
        <input type="hidden" name="pwsid" value={pwsid} />
        <input type="hidden" name="state" value={state} />
        <input type="hidden" name="cta_location" value={ctaLocation} />

        <input
          type="email"
          name="email"
          required
          value={email}
          onFocus={() => {
            if (!formStarted) {
              setFormStarted(true);
              trackEvent("email_report_form_start", { ...sharedParams, page_path: window.location.pathname });
            }
          }}
          onChange={(e) => { setEmail(e.target.value); setFormState("idle"); }}
          placeholder="your@email.com"
          className="w-full h-9 px-3 rounded-md border border-wur-teal/30 bg-white text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-wur-teal"
        />

        <button
          type="submit"
          onClick={() => trackEvent("email_report_cta_click", { ...sharedParams, page_path: typeof window !== "undefined" ? window.location.pathname : "" })}
          disabled={formState === "loading"}
          className="h-9 w-full bg-wur-teal text-white text-sm font-medium rounded-md hover:bg-wur-teal/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {formState === "loading" ? (
            <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Sending…</>
          ) : "Email me this water report"}
        </button>

        {formState === "error" && (
          <p className="flex items-center gap-1.5 text-xs text-red-600">
            <AlertCircle className="w-3 h-3 shrink-0" />{errorMsg}
          </p>
        )}
      </form>

      <p className="mt-3 text-[10px] text-muted-foreground/60 leading-relaxed">
        This report summarizes official records available to Water Utility Report. It is not a water-safety determination. Free · No spam.
      </p>
    </div>
  );
}
