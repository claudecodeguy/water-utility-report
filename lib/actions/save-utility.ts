"use server";

import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "./send-admin-notification";

const CONSENT_TEXT =
  "You can unsubscribe later. We will use your email to send requested record updates or report information. These are record-update notifications, not emergency alerts.";

const DEFAULT_PREFERENCES = [
  "Violation records",
  "PFAS/UCMR 5 sampling records",
  "Consumer Confidence Report updates",
  "Official source-data updates",
];

type SaveResult =
  | { success: true; alreadySubscribed?: boolean }
  | { error: string };

export async function saveUtility(formData: FormData): Promise<SaveResult> {
  // Honeypot — bots fill hidden fields; humans don't
  const honeypot = formData.get("_hp") as string | null;
  if (honeypot) return { success: true }; // Silent accept, don't process

  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const utilitySlug = (formData.get("utility_slug") as string | null)?.trim() ?? "";
  const utilityName = (formData.get("utility_name") as string | null)?.trim() ?? "";
  const pwsid = (formData.get("pwsid") as string | null)?.trim() || null;
  const state = (formData.get("state") as string | null)?.trim() || null;
  const sourcePageUrl = (formData.get("source_page_url") as string | null)?.trim() || null;
  const ctaLocation = (formData.get("cta_location") as string | null)?.trim() || null;
  const formVersion = (formData.get("form_version") as string | null)?.trim() || "v1";
  const experimentVariant = (formData.get("experiment_variant") as string | null)?.trim() || null;
  const utmSource = (formData.get("utm_source") as string | null)?.trim() || null;
  const utmMedium = (formData.get("utm_medium") as string | null)?.trim() || null;
  const utmCampaign = (formData.get("utm_campaign") as string | null)?.trim() || null;
  const referrer = (formData.get("referrer") as string | null)?.trim() || null;

  // Parse alert preferences — sent as JSON string
  let alertPreferences: string[] = DEFAULT_PREFERENCES;
  const rawPrefs = formData.get("alert_preferences") as string | null;
  if (rawPrefs) {
    try {
      const parsed = JSON.parse(rawPrefs);
      if (Array.isArray(parsed) && parsed.length > 0) alertPreferences = parsed;
    } catch { /* keep defaults */ }
  }

  // Server-side validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }
  if (!utilitySlug) {
    return { error: "Utility information is missing." };
  }

  try {
    // Rate limit: check for recent submission from same email+utility (last 60 min)
    const recentSub = await prisma.utilitySubscription.findUnique({
      where: { email_utility_slug: { email, utility_slug: utilitySlug } },
    });

    // Upsert subscriber
    const subscriber = await prisma.emailSubscriber.upsert({
      where: { email },
      update: { updated_at: new Date() },
      create: {
        email,
        consent_text: CONSENT_TEXT,
        consent_timestamp: new Date(),
        source_page_url: sourcePageUrl,
        source_cta: "save_utility",
        source_context: ctaLocation,
        first_utility_slug: utilitySlug,
        first_pwsid: pwsid,
        first_state: state,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        referrer,
      },
    });

    // Create or update the subscription record
    await prisma.utilitySubscription.upsert({
      where: { email_utility_slug: { email, utility_slug: utilitySlug } },
      update: {
        alert_preferences: alertPreferences,
        updated_at: new Date(),
      },
      create: {
        email_subscriber_id: subscriber.id,
        email,
        utility_slug: utilitySlug,
        utility_name: utilityName || null,
        pwsid,
        state,
        alert_preferences: alertPreferences,
        source_page_url: sourcePageUrl,
        source_cta: "save_utility",
        cta_location: ctaLocation,
        form_version: formVersion,
        experiment_variant: experimentVariant,
      },
    });

    // Store monetization interest signals for opted-in preferences
    const monetizationMap: Record<string, string> = {
      "Testing/lab guidance": "certified_lab",
      "Treatment guidance": "treatment_guidance",
      "PFAS/UCMR 5 sampling records": "PFAS_testing",
    };
    for (const pref of alertPreferences) {
      const interestType = monetizationMap[pref];
      if (interestType) {
        await prisma.monetizationInterestSignal.create({
          data: {
            email_subscriber_id: subscriber.id,
            email,
            utility_slug: utilitySlug,
            pwsid,
            state,
            interest_type: interestType,
            source_page_url: sourcePageUrl,
            source_cta: "save_utility",
          },
        }).catch(() => { /* non-critical — don't fail the submission */ });
      }
    }

    await sendAdminNotification({
      conversionType: "save_utility",
      email,
      utilityName,
      utilitySlug,
      pwsid: pwsid ?? undefined,
      state: state ?? undefined,
      sourcePageUrl: sourcePageUrl ?? undefined,
      ctaLocation: ctaLocation ?? undefined,
      alertPreferences,
      utmSource: utmSource ?? undefined,
      utmMedium: utmMedium ?? undefined,
      utmCampaign: utmCampaign ?? undefined,
      referrer: referrer ?? undefined,
      userEmailDeliveryAttempted: false,
      userEmailDeliverySucceeded: false,
    });

    return { success: true, alreadySubscribed: !!recentSub };
  } catch (e) {
    console.error("[saveUtility] Error:", e);
    return { error: "Something went wrong. Please try again." };
  }
}
