import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const pitches = await prisma.outreachOrgPitch.findMany({
    where: { organization_id: id },
    orderBy: { draft_created_at: "desc" },
  });

  return Response.json({ ok: true, pitches });
}
