import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

export interface HealthCheckResult {
  status: "ok" | "warn" | "error";
  findings: string[];
}

export async function runOrgPipelineHealthCheck(): Promise<HealthCheckResult> {
  const findings: string[] = [];
  const now = new Date();
  const ago48h = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  const ago7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const ago30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // ── 1. Active org count ──────────────────────────────────────────────────────
  const activeOrgs = await prisma.outreachOrganization.count({
    where: { status: "active" },
  });
  if (activeOrgs < 5) {
    findings.push(`warn: low contact universe — only ${activeOrgs} active orgs`);
  } else {
    findings.push(`ok: ${activeOrgs} active orgs`);
  }

  // ── 2. Orchestrator activity — drafts created in last 48h ────────────────────
  const recentDrafts = await prisma.outreachOrgPitch.count({
    where: { draft_created_at: { gte: ago48h } },
  });
  if (recentDrafts === 0) {
    findings.push("warn: orchestrator not generating drafts — no pitches created in last 48h");
  } else {
    findings.push(`ok: ${recentDrafts} pitches created in last 48h`);
  }

  // ── 3. Bounce rate (7d) ──────────────────────────────────────────────────────
  const [sent7d, bounced7d] = await Promise.all([
    prisma.outreachOrgPitch.count({ where: { sent_at: { gte: ago7d } } }),
    prisma.outreachOrgPitch.count({ where: { status: "bounced", sent_at: { gte: ago7d } } }),
  ]);
  if (sent7d > 0) {
    const bounceRate = (bounced7d / sent7d) * 100;
    if (bounceRate > 10) {
      findings.push(`warn: bounce rate ${bounceRate.toFixed(1)}% over last 7d (${bounced7d}/${sent7d} sent)`);
    } else {
      findings.push(`ok: bounce rate ${bounceRate.toFixed(1)}% over last 7d (${bounced7d}/${sent7d} sent)`);
    }
  } else {
    findings.push("info: no pitches sent in last 7d");
  }

  // ── 4. Reply rate (30d) — informational only ─────────────────────────────────
  const [sent30d, replied30d] = await Promise.all([
    prisma.outreachOrgPitch.count({ where: { sent_at: { gte: ago30d } } }),
    prisma.outreachOrgPitch.count({ where: { replied_at: { gte: ago30d } } }),
  ]);
  if (sent30d > 0) {
    const replyRate = (replied30d / sent30d) * 100;
    findings.push(`info: reply rate ${replyRate.toFixed(1)}% over last 30d (${replied30d}/${sent30d} sent)`);
  } else {
    findings.push("info: no pitches sent in last 30d");
  }

  // ── 5. Stale drafts ──────────────────────────────────────────────────────────
  const staleDrafts = await prisma.outreachOrgPitch.count({
    where: { status: "draft", draft_created_at: { lt: ago7d } },
  });
  if (staleDrafts > 0) {
    findings.push(`warn: stale drafts — ${staleDrafts} drafts older than 7d not yet approved`);
  }

  // ── 6. Auto-correction count (7d) ────────────────────────────────────────────
  const recentWithAutoCorrect = await prisma.outreachOrgPitch.count({
    where: {
      draft_created_at: { gte: ago7d },
      personalization_note: { startsWith: "[" },
    },
  });
  if (recentWithAutoCorrect > 0) {
    findings.push(`info: ${recentWithAutoCorrect} drafts in last 7d had URL or sign-off auto-corrections`);
  }

  // ── Determine overall status ─────────────────────────────────────────────────
  const status: "ok" | "warn" | "error" = findings.some((f) => f.startsWith("warn:") || f.startsWith("error:"))
    ? "warn"
    : "ok";

  // ── Notify on warn/error ──────────────────────────────────────────────────────
  if (status !== "ok") {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.OUTREACH_FROM_EMAIL;
    if (apiKey && fromEmail) {
      try {
        const resend = new Resend(apiKey);
        await resend.emails.send({
          from: fromEmail,
          to: "mike@clicktrends.com",
          subject: `[org-outreach] health check: ${status}`,
          text: findings.join("\n"),
        });
      } catch (err) {
        console.error("[health-check] notification send failed:", err);
      }
    }
  }

  return { status, findings };
}
