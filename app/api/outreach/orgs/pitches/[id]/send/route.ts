import { requireAdmin } from "@/lib/outreach/auth";
import { sendOrgPitch } from "@/lib/outreach/orgs/sender";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { messageId } = await sendOrgPitch(id, "admin");
    return Response.json({ ok: true, messageId });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[org-send] pitch=${id}:`, msg);
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}
