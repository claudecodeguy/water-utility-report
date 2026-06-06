// Use sendGAEvent from @next/third-parties/google — pushes to window.dataLayer
// so events are queued even if the gtag script hasn't initialized yet.
// This fixes mount-time events (CTA views, etc.) being silently dropped when
// the afterInteractive GA script loads after React hydration runs useEffects.
import { sendGAEvent } from "@next/third-parties/google";

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;
  try {
    // GA4 does not accept boolean parameter values — convert to "1"/"0"
    const safe: Record<string, string | number> = {};
    for (const [k, v] of Object.entries(params ?? {})) {
      safe[k] = typeof v === "boolean" ? (v ? "1" : "0") : v;
    }
    sendGAEvent("event", name, safe);
  } catch {
    // Silently ignore — analytics must never break the UI
  }
}

// ─── CONVERSION EVENTS ────────────────────────────────────────────────────────
// GA4 Key Events: save_utility_signup_success, email_report_success,
//                 correction_request_submitted, utility_lookup_completed
//
// Do NOT mark page views, CTA views, CTA clicks, FAQ opens, or form starts
// as key events. Do NOT send email addresses or PII to GA4.

export const trackSaveUtilityCtaView = (utilitySlug: string) =>
  trackEvent("save_utility_cta_view", { utility_slug: utilitySlug });

export const trackSaveUtilityCtaClick = (utilitySlug: string) =>
  trackEvent("save_utility_cta_click", { utility_slug: utilitySlug });

export const trackSaveUtilityFormStart = (utilitySlug: string) =>
  trackEvent("save_utility_form_start", { utility_slug: utilitySlug });

export const trackSaveUtilityFormSubmit = (utilitySlug: string) =>
  trackEvent("save_utility_form_submit", { utility_slug: utilitySlug });

export const trackSaveUtilitySignupSuccess = (utilitySlug: string) =>
  trackEvent("save_utility_signup_success", { utility_slug: utilitySlug });

export const trackSaveUtilitySignupError = (utilitySlug: string, errorCode?: string) =>
  trackEvent("save_utility_signup_error", { utility_slug: utilitySlug, ...(errorCode ? { error_code: errorCode } : {}) });

export const trackEmailReportCtaView = (utilitySlug: string) =>
  trackEvent("email_report_cta_view", { utility_slug: utilitySlug });

export const trackEmailReportCtaClick = (utilitySlug: string) =>
  trackEvent("email_report_cta_click", { utility_slug: utilitySlug });

export const trackEmailReportFormStart = (utilitySlug: string) =>
  trackEvent("email_report_form_start", { utility_slug: utilitySlug });

export const trackEmailReportFormSubmit = (utilitySlug: string) =>
  trackEvent("email_report_form_submit", { utility_slug: utilitySlug });

export const trackEmailReportSuccess = (utilitySlug: string, deliveryStatus: string) =>
  trackEvent("email_report_success", { utility_slug: utilitySlug, delivery_status: deliveryStatus });

export const trackEmailReportError = (utilitySlug: string, errorCode?: string) =>
  trackEvent("email_report_error", { utility_slug: utilitySlug, ...(errorCode ? { error_code: errorCode } : {}) });

export const trackUtilityLookupStarted = (source?: string) =>
  trackEvent("utility_lookup_started", { ...(source ? { source } : {}) });

export const trackUtilityLookupCompleted = (utilitySlug: string, source?: string) =>
  trackEvent("utility_lookup_completed", { utility_slug: utilitySlug, ...(source ? { source } : {}) });

export const trackReportIssueClick = (pageUrl: string) =>
  trackEvent("report_issue_click", { page_url: pageUrl });

export const trackCorrectionRequestSubmitted = (pageUrl: string) =>
  trackEvent("correction_request_submitted", { page_url: pageUrl });

export const trackOfficialSourceClick = (sourceLabel: string, pageUrl: string) =>
  trackEvent("official_source_click", { source_label: sourceLabel, page_url: pageUrl });

export const trackLabsClick = (destination: string) =>
  trackEvent("labs_click", { destination });

export const trackWaterRecordInterpreterView = (utilitySlug: string) =>
  trackEvent("water_record_interpreter_view", { utility_slug: utilitySlug });

export const trackWaterRecordInterpreterLinkClick = (utilitySlug: string, linkLabel: string) =>
  trackEvent("water_record_interpreter_link_click", { utility_slug: utilitySlug, link_label: linkLabel });
