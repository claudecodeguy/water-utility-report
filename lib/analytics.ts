declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params ?? {});
}

// ─── CONVERSION EVENTS ────────────────────────────────────────────────────────
// These are the only events that should be marked as GA4 Key Events.
// Key events: save_utility_signup_success, email_report_success,
//             correction_request_submitted, utility_lookup_completed
//
// Do NOT mark page views, CTA views, CTA clicks, FAQ opens, or form starts as key events.
// Do NOT send email addresses or PII to GA4.

// Save Utility flow
export const trackSaveUtilityCtaView = (utilitySlug: string) =>
  trackEvent("save_utility_cta_view", { utility_slug: utilitySlug });

export const trackSaveUtilityCtaClick = (utilitySlug: string) =>
  trackEvent("save_utility_cta_click", { utility_slug: utilitySlug });

export const trackSaveUtilityFormStart = (utilitySlug: string) =>
  trackEvent("save_utility_form_start", { utility_slug: utilitySlug });

export const trackSaveUtilityFormSubmit = (utilitySlug: string) =>
  trackEvent("save_utility_form_submit", { utility_slug: utilitySlug });

// KEY EVENT: user successfully signed up to save a utility
export const trackSaveUtilitySignupSuccess = (utilitySlug: string) =>
  trackEvent("save_utility_signup_success", { utility_slug: utilitySlug });

export const trackSaveUtilitySignupError = (utilitySlug: string, errorCode?: string) =>
  trackEvent("save_utility_signup_error", { utility_slug: utilitySlug, ...(errorCode ? { error_code: errorCode } : {}) });

// Email Report flow
export const trackEmailReportCtaView = (utilitySlug: string) =>
  trackEvent("email_report_cta_view", { utility_slug: utilitySlug });

export const trackEmailReportCtaClick = (utilitySlug: string) =>
  trackEvent("email_report_cta_click", { utility_slug: utilitySlug });

export const trackEmailReportFormStart = (utilitySlug: string) =>
  trackEvent("email_report_form_start", { utility_slug: utilitySlug });

export const trackEmailReportFormSubmit = (utilitySlug: string) =>
  trackEvent("email_report_form_submit", { utility_slug: utilitySlug });

// KEY EVENT: email report successfully requested
export const trackEmailReportSuccess = (utilitySlug: string) =>
  trackEvent("email_report_success", { utility_slug: utilitySlug });

export const trackEmailReportError = (utilitySlug: string, errorCode?: string) =>
  trackEvent("email_report_error", { utility_slug: utilitySlug, ...(errorCode ? { error_code: errorCode } : {}) });

// Utility lookup flow
export const trackUtilityLookupStarted = (source?: string) =>
  trackEvent("utility_lookup_started", { ...(source ? { source } : {}) });

// KEY EVENT: user completed a utility lookup (arrived at a utility page from search)
export const trackUtilityLookupCompleted = (utilitySlug: string, source?: string) =>
  trackEvent("utility_lookup_completed", { utility_slug: utilitySlug, ...(source ? { source } : {}) });

// Data quality / correction flow
export const trackReportIssueClick = (pageUrl: string) =>
  trackEvent("report_issue_click", { page_url: pageUrl });

// KEY EVENT: user submitted a correction request
export const trackCorrectionRequestSubmitted = (pageUrl: string) =>
  trackEvent("correction_request_submitted", { page_url: pageUrl });

// External link / source clicks
export const trackOfficialSourceClick = (sourceLabel: string, pageUrl: string) =>
  trackEvent("official_source_click", { source_label: sourceLabel, page_url: pageUrl });

export const trackLabsClick = (destination: string) =>
  trackEvent("labs_click", { destination });

// Water Record Interpreter
export const trackWaterRecordInterpreterView = (utilitySlug: string) =>
  trackEvent("water_record_interpreter_view", { utility_slug: utilitySlug });

export const trackWaterRecordInterpreterLinkClick = (utilitySlug: string, linkLabel: string) =>
  trackEvent("water_record_interpreter_link_click", { utility_slug: utilitySlug, link_label: linkLabel });
