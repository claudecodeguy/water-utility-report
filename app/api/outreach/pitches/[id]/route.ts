import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { subject?: string; body?: string; status?: string; notes?: string } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const allowedStatuses = ["rejected"];
  if (body.status !== undefined && !allowedStatuses.includes(body.status)) {
    return Response.json({ ok: false, error: "Invalid status — use the send endpoint to mark as sent" }, { status: 400 });
  }

  const data: Record<string, unknown> = {};
  if (body.subject !== undefined) data.subject = body.subject;
  if (body.body !== undefined) data.body = body.body;
  if (body.status !== undefined) data.status = body.status;
  if (body.notes !== undefined) data.notes = body.notes;

  if (Object.keys(data).length === 0) {
    return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  try {
    const pitch = await prisma.outreachPitch.update({
      where: { id },
      data,
    });
    return Response.json({ ok: true, pitch });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
