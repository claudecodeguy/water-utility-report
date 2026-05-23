"use server";

import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

// FROM: set RESEND_FROM_EMAIL in Vercel env to use a verified domain.
// Falls back to Resend's own verified domain so admin notifications always deliver.
const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL ?? "mike@clicktrends.com";

interface NotificationPayload {
  conversionType: "save_utility" | "email_report" | "record_update_alert" | "testing_checklist" | "future_partner_offer_interest";
  email: string;
  utilityName?: string;
  utilitySlug?: string;
  pwsid?: string;
  state?: string;
  sourcePageUrl?: string;
  ctaLocation?: string;
  alertPreferences?: string[];
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  referrer?: string;
  userEmailDeliveryAttempted?: boolean;
  userEmailDeliverySucceeded?: boolean;
}

export async function sendAdminNotification(payload: NotificationPayload): Promise<void> {
  const subject = `New WaterUtilityReport signup: ${payload.conversionType} — ${payload.utilityName ?? payload.sourcePageUrl ?? "unknown"}`;

  const body = [
    `Conversion type: ${payload.conversionType}`,
    `Submitted email: ${payload.email}`,
    `Utility: ${payload.utilityName ?? "—"}`,
    `Utility slug: ${payload.utilitySlug ?? "—"}`,
    `PWSID: ${payload.pwsid ?? "—"}`,
    `State: ${payload.state ?? "—"}`,
    `Source page: ${payload.sourcePageUrl ?? "—"}`,
    `CTA location: ${payload.ctaLocation ?? "—"}`,
    `Alert preferences: ${payload.alertPreferences?.join(", ") ?? "—"}`,
    `UTM source: ${payload.utmSource ?? "—"}`,
    `UTM medium: ${payload.utmMedium ?? "—"}`,
    `UTM campaign: ${payload.utmCampaign ?? "—"}`,
    `Referrer: ${payload.referrer ?? "—"}`,
    `User email delivery attempted: ${payload.userEmailDeliveryAttempted ?? false}`,
    `User email delivery succeeded: ${payload.userEmailDeliverySucceeded ?? false}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join("\n");

  let deliveryStatus = "sent";
  let errorMessage: string | undefined;

  try {
    const { error } = await resend.emails.send({
      from: `Water Utility Report <${FROM}>`,
      to: ADMIN_EMAIL,
      subject,
      text: body,
    });
    if (error) {
      deliveryStatus = "failed";
      errorMessage = typeof error === "object" ? JSON.stringify(error) : String(error);
      console.error("[AdminNotification] Resend error:", error);
    }
  } catch (e) {
    deliveryStatus = "failed";
    errorMessage = e instanceof Error ? e.message : String(e);
    console.error("[AdminNotification] Exception:", errorMessage);
  }

  // Always log the notification attempt regardless of success/failure
  try {
    await prisma.adminNotificationLog.create({
      data: {
        recipient: ADMIN_EMAIL,
        conversion_type: payload.conversionType,
        email: payload.email,
        utility_slug: payload.utilitySlug ?? null,
        pwsid: payload.pwsid ?? null,
        source_page_url: payload.sourcePageUrl ?? null,
        delivery_status: deliveryStatus,
        error_message: errorMessage ?? null,
      },
    });
  } catch (logError) {
    console.error("[AdminNotification] Failed to log notification:", logError);
  }
}
