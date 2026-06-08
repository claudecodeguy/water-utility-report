import { requireAdminOrCron } from "@/lib/outreach/auth";
import { scoreSignal, scoreAllNewSignals } from "@/lib/outreach/scorer";

export async function GET(request: Request) { return POST(request); }

export async function POST(request: Request) {
  if (!requireAdminOrCron(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.OUTREACH_ENABLED !== "true") {
    return Response.json({ ok: false, error: "Outreach pipeline disabled" }, { status: 503 });
  }

  let body: { signalId?: string; batchLimit?: number } = {};
  try {
    body = await request.json().catch(() => ({}));
  } catch {
    // non-JSON body is fine; use defaults
  }

  try {
    if (typeof body.signalId === "string") {
      const story = await scoreSignal(body.signalId);
      return Response.json({ ok: true, story });
    }

    const batchLimit = typeof body.batchLimit === "number"
      ? Math.min(body.batchLimit, 500)
      : 50;

    const counts = await scoreAllNewSignals(batchLimit);
    return Response.json({ ok: true, ...counts });
  } catch (error) {
    console.error("[outreach/score] error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
