"use server";

import { prisma } from "@/lib/prisma";
import { sendAdminNotification } from "./send-admin-notification";

// User-facing email delivery is not yet configured.
// Report requests are stored and admin is notified; the user receives a truthful confirmation.
const USER_EMAIL_DELIVERY_CONFIGURED = false;

type ReportResult =
  | { success: true; deliveryStatus: "not_configured" | "sent" }
  | { error: string };

export async function requestEmailReport(formData: FormData): Promise<ReportResult> {
  // Honeypot
  const honeypot = formData.get("_hp") as string | null;
  if (honeypot) return { success: true, deliveryStatus: "not_configured" };

  const email = (formData.get("email") as string | null)?.trim().toLowerCase() ?? "";
  const utilitySlug = (formData.get("utility_slug") as string | null)?.trim() || null;
  const utilityName = (formData.get("utility_name") as string | null)?.trim() || null;
  const pwsid = (formData.get("pwsid") as string | null)?.trim() || null;
  const state = (formData.get("state") as string | null)?.trim() || null;
  const sourcePageUrl = (formData.get("source_page_url") as string | null)?.trim() || null;
  const ctaLocation = (formData.get("cta_location") as string | null)?.trim() || null;

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Please enter a valid email address." };
  }

  try {
    // Upsert subscriber
    const subscriber = await prisma.emailSubscriber.upsert({
      where: { email },
      update: { updated_at: new Date() },
      create: {
        email,
        source_page_url: sourcePageUrl,
        source_cta: "email_report",
        first_utility_slug: utilitySlug ?? undefined,
        first_pwsid: pwsid ?? undefined,
        first_state: state ?? undefined,
      },
    });

    // Rate limit: max 3 report requests per email per day
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const recentCount = await prisma.emailReportRequest.count({
      where: { email, created_at: { gte: today } },
    });
    if (recentCount >= 3) {
      return { error: "You've already requested several reports today. Please try again tomorrow." };
    }

    await prisma.emailReportRequest.create({
      data: {
        email_subscriber_id: subscriber.id,
        email,
        utility_slug: utilitySlug,
        utility_name: utilityName,
        pwsid,
        state,
        delivery_status: USER_EMAIL_DELIVERY_CONFIGURED ? "pending" : "not_configured",
        source_page_url: sourcePageUrl,
        cta_location: ctaLocation,
      },
    });

    await sendAdminNotification({
      conversionType: "email_report",
      email,
      utilityName: utilityName ?? undefined,
      utilitySlug: utilitySlug ?? undefined,
      pwsid: pwsid ?? undefined,
      state: state ?? undefined,
      sourcePageUrl: sourcePageUrl ?? undefined,
      ctaLocation: ctaLocation ?? undefined,
      userEmailDeliveryAttempted: USER_EMAIL_DELIVERY_CONFIGURED,
      userEmailDeliverySucceeded: false,
    });

    return { success: true, deliveryStatus: "not_configured" };
  } catch (e) {
    console.error("[requestEmailReport] Error:", e);
    return { error: "Something went wrong. Please try again." };
  }
}
