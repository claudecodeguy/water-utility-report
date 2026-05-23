import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.outreachJournalist.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  let body: { status?: string; notes?: string } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const allowedStatuses = ["active", "blacklisted", "unsubscribed", "bounced"];
  if (body.status !== undefined && !allowedStatuses.includes(body.status)) {
    return Response.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }

  const data: { status?: string; notes?: string } = {};
  if (body.status !== undefined) data.status = body.status;
  if (body.notes !== undefined) data.notes = body.notes;

  if (Object.keys(data).length === 0) {
    return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  try {
    const journalist = await prisma.outreachJournalist.update({
      where: { id },
      data,
    });
    return Response.json({ ok: true, journalist });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
