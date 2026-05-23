import { requireAdmin } from "@/lib/outreach/auth";
import { matchJournalists } from "@/lib/outreach/matcher";

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { storyId?: string; limit?: number } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.storyId) {
    return Response.json({ ok: false, error: "storyId required" }, { status: 400 });
  }

  const limit = typeof body.limit === "number" ? Math.min(body.limit, 20) : 3;

  try {
    const journalists = await matchJournalists(body.storyId, limit);
    return Response.json({ ok: true, journalists });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
