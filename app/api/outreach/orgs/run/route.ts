import { requireAdmin, requireCronSecret } from "@/lib/outreach/auth";
import { runOrgPipeline } from "@/lib/outreach/orgs/orchestrator";

export async function POST(request: Request) {
  if (!requireAdmin(request) && !requireCronSecret(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.OUTREACH_ORG_ENABLED !== "true") {
    return Response.json({ ok: false, error: "Org outreach pipeline is disabled" }, { status: 503 });
  }

  try {
    const result = await runOrgPipeline();
    return Response.json({ ok: true, ...result });
  } catch (err) {
    console.error("[org-run] error:", err);
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
