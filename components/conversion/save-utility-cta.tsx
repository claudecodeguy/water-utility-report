"use client";

import { useState, useRef, useEffect } from "react";
import { BookmarkPlus, CheckCircle2, AlertCircle, Loader2, Bell } from "lucide-react";
import { saveUtility } from "@/lib/actions/save-utility";
import { trackEvent } from "@/lib/analytics";
import type { ConversionCtaVariant } from "@/lib/canary/seo-overrides";

interface CtaCopy {
  headline: string;
  sub: string;
  bullets: string[];
  button: string;
}

const CTA_COPY: Record<ConversionCtaVariant, CtaCopy> = {
  save_utility: {
    headline: "Save this utility",
    sub: "Get notified when official records change for this utility.",
    bullets: [
      "New health-based violations",
      "PFAS / UCMR 5 sampling records",
      "Consumer Confidence Report updates",
      "Source-data or record changes",
    ],
    button: "Save this utility",
  },
  pfas_updates: {
    headline: "Get PFAS monitoring updates",
    sub: "Be the first to know when records change for this utility.",
    bullets: [
      "PFAS / UCMR 5 sampling results",
      "New health-based violations",
      "Violation status changes",
      "Source-data updates",
    ],
    button: "Get PFAS monitoring updates",
  },
  no_records: {
    headline: "Get notified if records appear",
    sub: "We'll alert you if new official data becomes available for this utility.",
    bullets: [
      "New health-based violations",
      "PFAS / UCMR 5 sampling records",
      "Consumer Confidence Report links",
      "Any new official source data",
    ],
    button: "Notify me when records appear",
  },
  email_report: {
    headline: "Save this utility",
    sub: "Get notified when official records change for this utility.",
    bullets: [
      "New health-based violations",
      "PFAS / UCMR 5 sampling records",
      "Source-data updates",
    ],
    button: "Save this utility",
  },
};

const DEFAULT_ALERT_PREFERENCES = [
  "Violation records",
  "PFAS/UCMR 5 sampling records",
  "Consumer Confidence Report updates",
  "Official source-data updates",
];

interface Props {
  pwsid: string;
  utilitySlug: string;
  utilityName: string;
  state: string;
  ctaVariant?: ConversionCtaVariant;
  ctaLocation?: string;
  hasPfasRecords?: boolean;
  hasViolationRecords?: boolean;
  formVersion?: string;
}

export default function SaveUtilityCTA({
  pwsid,
  utilitySlug,
  utilityName,
  state,
  ctaVariant = "save_utility",
  ctaLocation = "main",
  hasPfasRecords = false,
  hasViolationRecords = false,
  formVersion = "v1",
}: Props) {
  const [email, setEmail] = useState("");
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error" | "already">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [formStarted, setFormStarted] = useState(false);
  const hasTrackedView = useRef(false);
  const copy = CTA_COPY[ctaVariant];

  const sharedParams = {
    utility_slug: utilitySlug,
    utility_name: utilityName,
    pwsid,
    state,
    cta_location: ctaLocation,
    conversion_type: "save_utility",
    has_pfas_records: hasPfasRecords,
    has_violation_records: hasViolationRecords,
    form_version: formVersion,
    experiment_variant: ctaVariant,
    page_type: "utility",
  };

  useEffect(() => {
    if (hasTrackedView.current) return;
    hasTrackedView.current = true;
    trackEvent("save_utility_cta_view", { ...sharedParams, page_path: window.location.pathname });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState === "loading") return;
    setFormState("loading");

    trackEvent("save_utility_form_submit", { ...sharedParams, page_path: window.location.pathname });

    const fd = new FormData(e.currentTarget);
    fd.set("alert_preferences", JSON.stringify(DEFAULT_ALERT_PREFERENCES));
    fd.set("source_page_url", window.location.href);
    fd.set("referrer", document.referrer || "");

    const result = await saveUtility(fd);

    if ("success" in result) {
      const state_ = result.alreadySubscribed ? "already" : "success";
      setFormState(state_);
      trackEvent("save_utility_signup_success", {
        ...sharedParams,
        already_subscribed: result.alreadySubscribed ?? false,
        page_path: window.location.pathname,
      });
    } else {
      setErrorMsg(result.error);
      setFormState("error");
      trackEvent("save_utility_signup_error", {
        ...sharedParams,
        error_message: result.error,
        page_path: window.location.pathname,
      });
    }
  }

  if (formState === "success" || formState === "already") {
    return (
      <div className="rounded-xl bg-wur-ink p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-6 h-6 text-wur-aqua mt-0.5 shrink-0" />
          <div>
            <p className="text-base font-semibold text-white">
              {formState === "already" ? "Already saved" : "You're subscribed"}
            </p>
            <p className="text-sm text-white/70 mt-1 leading-relaxed">
              {formState === "already"
                ? `You're already signed up for updates on ${utilityName}.`
                : `We'll notify you when official records change for ${utilityName}.`}
            </p>
            <p className="text-xs text-white/40 mt-3 leading-relaxed">
              Record-update notifications only — not emergency alerts. Water Utility Report does not determine whether water is safe to drink.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-wur-ink p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-wur-aqua/20 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 text-wur-aqua" />
        </div>
        <p className="text-base font-bold text-white leading-snug">{copy.headline}</p>
      </div>

      <p className="text-sm text-white/70 mb-4 leading-relaxed">{copy.sub}</p>

      {/* What you'll receive */}
      <div className="mb-5 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-2">You&apos;ll be notified about</p>
        {copy.bullets.map((b) => (
          <div key={b} className="flex items-center gap-2.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-wur-aqua shrink-0" />
            <span className="text-sm text-white/85">{b}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="_hp" className="hidden" aria-hidden="true" tabIndex={-1} autoComplete="off" />
        <input type="hidden" name="utility_slug" value={utilitySlug} />
        <input type="hidden" name="utility_name" value={utilityName} />
        <input type="hidden" name="pwsid" value={pwsid} />
        <input type="hidden" name="state" value={state} />
        <input type="hidden" name="cta_location" value={ctaLocation} />
        <input type="hidden" name="form_version" value={formVersion} />
        <input type="hidden" name="experiment_variant" value={ctaVariant} />

        <input
          type="email"
          name="email"
          required
          value={email}
          onFocus={() => {
            if (!formStarted) {
              setFormStarted(true);
              trackEvent("save_utility_form_start", { ...sharedParams, page_path: window.location.pathname });
            }
          }}
          onChange={(e) => { setEmail(e.target.value); setFormState("idle"); }}
          placeholder="your@email.com"
          className="w-full h-11 px-4 rounded-lg border border-white/20 bg-white/10 text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-wur-aqua focus:border-transparent"
        />

        <button
          type="submit"
          onClick={() => trackEvent("save_utility_cta_click", { ...sharedParams, page_path: typeof window !== "undefined" ? window.location.pathname : "" })}
          disabled={formState === "loading"}
          className="h-11 w-full bg-wur-aqua text-white text-sm font-semibold rounded-lg hover:bg-wur-aqua/85 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {formState === "loading" ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
          ) : copy.button}
        </button>

        {formState === "error" && (
          <p className="flex items-center gap-1.5 text-sm text-red-300">
            <AlertCircle className="w-4 h-4 shrink-0" />{errorMsg}
          </p>
        )}
      </form>

      <p className="mt-4 text-xs text-white/35 leading-relaxed">
        Free · Unsubscribe anytime · Record-update notifications only, not emergency alerts.
      </p>
    </div>
  );
}
