"use server";

import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type Result = { success: true } | { error: string };

export async function subscribeToViolationAlerts(
  email: string,
  pwsid: string,
  utilityName: string
): Promise<Result> {
  const trimmed = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { error: "Please enter a valid email address." };
  }

  if (!pwsid) {
    return { error: "Invalid utility." };
  }

  try {
    await prisma.violationAlert.upsert({
      where: { email_pwsid: { email: trimmed, pwsid } },
      update: {},
      create: { email: trimmed, pwsid },
    });

    // FROM: set RESEND_FROM_EMAIL in Vercel env to use a verified domain (e.g. alerts@waterutilityreport.com).
    // Falls back to Resend's own verified domain so admin notifications always deliver even if the env var is missing.
    const FROM = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
    const { error: emailError } = await resend.emails.send({
      from: `Water Utility Report <${FROM}>`,
      to: "mike@clicktrends.com",
      subject: `New alert signup — ${utilityName}`,
      text: `New violation alert subscription:\n\nEmail: ${trimmed}\nUtility: ${utilityName}\nPWSID: ${pwsid}`,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
    }

    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
