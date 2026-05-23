import { requireAdmin } from "@/lib/outreach/auth";
import { sendOrgPitch } from "@/lib/outreach/orgs/sender";
import { z } from "zod";

const Body = z.object({
  pitchIds: z.array(z.string()).min(1).max(50),
});

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.message }, { status: 400 });
  }

  const { pitchIds } = parsed.data;

  if (pitchIds.length > 50) {
    return Response.json({ ok: false, error: "Batch too large — max 50 pitches" }, { status: 400 });
  }

  const pLimit = (await import("p-limit")).default;
  const limit2 = pLimit(2);

  let sent = 0;
  const failed: { pitchId: string; error: string }[] = [];

  await Promise.all(
    pitchIds.map((pitchId) =>
      limit2(async () => {
        try {
          await sendOrgPitch(pitchId, "admin");
          sent++;
        } catch (err) {
          const error = err instanceof Error ? err.message : String(err);
          console.error(`[org-bulk-send] pitch=${pitchId}:`, error);
          failed.push({ pitchId, error });
        }
      })
    )
  );

  return Response.json({ ok: true, sent, failed });
}
