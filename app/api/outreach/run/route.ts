import { requireAdminOrCron } from "@/lib/outreach/auth";
import { runFullPipeline } from "@/lib/outreach/orchestrator";

export async function GET(request: Request) { return POST(request); }

export async function POST(request: Request) {
  if (!requireAdminOrCron(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.OUTREACH_ENABLED !== "true") {
    return Response.json({ ok: false, error: "Outreach pipeline disabled" }, { status: 503 });
  }

  try {
    const counts = await runFullPipeline();
    return Response.json({ ok: true, ...counts });
  } catch (error) {
    console.error("[outreach/run] error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
