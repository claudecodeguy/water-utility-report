import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RunResult {
  sent: number;
  drafts_created: number;
  errors: number;
  skipped: number;
  daily_budget_used: number;
}

export async function sendRunSummary(result: RunResult): Promise<void> {
  const to = process.env.OUTREACH_REPLY_TO ?? "mike@clicktrends.com";
  const from = process.env.OUTREACH_FROM_EMAIL ?? "mike@waterutilityreport.com";

  // Pull today's A/B split from DB for context
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [sentA, sentB, totalSentAllTime, totalBacklinks] = await Promise.all([
    prisma.outreachOrgPitch.count({
      where: { ab_variant: "A", status: "sent", sent_at: { gte: todayStart } },
    }),
    prisma.outreachOrgPitch.count({
      where: { ab_variant: "B", status: "sent", sent_at: { gte: todayStart } },
    }),
    prisma.outreachOrgPitch.count({ where: { status: "sent" } }),
    prisma.outreachOrgPitch.count({ where: { backlink_found: true } }),
  ]);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
    timeZone: "America/New_York",
  });
  const timeStr = now.toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", timeZoneName: "short",
    timeZone: "America/New_York",
  });

  const backlinkRate = totalSentAllTime > 0
    ? `${((totalBacklinks / totalSentAllTime) * 100).toFixed(1)}%`
    : "—";

  const subject = `Outreach run: ${result.sent} sent today — ${dateStr}`;

  const body = [
    `Outreach pipeline run — ${dateStr} at ${timeStr}`,
    "",
    "TODAY'S RUN",
    `  Emails sent:      ${result.sent}`,
    `    Variant A:      ${sentA}`,
    `    Variant B:      ${sentB}`,
    `  Drafts created:   ${result.drafts_created}`,
    `  Errors:           ${result.errors}`,
    `  Skipped:          ${result.skipped}`,
    `  Budget used:      ${result.daily_budget_used} / ${process.env.OUTREACH_ORG_DAILY_LIMIT ?? 50}`,
    "",
    "ALL TIME",
    `  Total sent:       ${totalSentAllTime}`,
    `  Backlinks found:  ${totalBacklinks} (${backlinkRate})`,
    "",
    "A/B REPORT",
    `  https://waterutilityreport.com/admin/outreach/orgs/ab-report`,
    "",
    result.errors > 0
      ? `⚠ ${result.errors} error(s) occurred — check Vercel logs for details.`
      : "✓ No errors.",
  ].join("\n");

  try {
    const { error } = await resend.emails.send({
      from: `Water Utility Report <${from}>`,
      to,
      subject,
      text: body,
    });
    if (error) {
      console.error("[run-summary] Resend error:", error);
    }
  } catch (err) {
    // Non-fatal — don't let a summary email failure break the cron response
    console.error("[run-summary] Failed to send summary:", err);
  }
}
