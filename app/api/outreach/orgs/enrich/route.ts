import { requireAdmin, requireCronSecret } from "@/lib/outreach/auth";
import { enrichOrganization, enrichAllPending } from "@/lib/outreach/orgs/enricher";

export async function GET(request: Request) { return POST(request); }

export async function POST(request: Request) {
  if (!requireAdmin(request) && !requireCronSecret(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.OUTREACH_ORG_ENABLED !== "true") {
    return Response.json({ ok: false, error: "Org outreach pipeline is disabled" }, { status: 503 });
  }

  let body: { orgId?: string } = {};
  try { body = await request.json(); } catch { /* no body is fine */ }

  if (body.orgId) {
    try {
      const org = await enrichOrganization(body.orgId);
      const status = (org as unknown as { enrichment_status: string }).enrichment_status;
      return Response.json({ ok: true, enriched: status === "enriched" ? 1 : 0, failed: status === "failed" ? 1 : 0 });
    } catch (err) {
      return Response.json(
        { ok: false, error: err instanceof Error ? err.message : String(err) },
        { status: 500 }
      );
    }
  }

  const dailyLimit = Number(process.env.OUTREACH_ORG_DAILY_LIMIT ?? "30");
  const counts = await enrichAllPending(dailyLimit);
  return Response.json({ ok: true, ...counts });
}
