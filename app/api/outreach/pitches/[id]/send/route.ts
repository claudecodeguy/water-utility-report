import { requireAdmin } from "@/lib/outreach/auth";
import { sendPitch } from "@/lib/outreach/sender";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { messageId } = await sendPitch(id, "admin");
    return Response.json({ ok: true, messageId });
  } catch (error) {
    console.error("[pitches/send] error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
