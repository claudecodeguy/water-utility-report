import { requireAdmin, requireCronSecret } from "@/lib/outreach/auth";
import { runOrgPipelineHealthCheck } from "@/lib/outreach/health-check";

export async function GET(request: Request) { return POST(request); }

export async function POST(request: Request) {
  if (!requireAdmin(request) && !requireCronSecret(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runOrgPipelineHealthCheck();
    return Response.json({ ok: true, ...result });
  } catch (err) {
    console.error("[org-health] error:", err);
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
