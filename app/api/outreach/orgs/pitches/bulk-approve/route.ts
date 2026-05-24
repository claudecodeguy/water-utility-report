import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const Body = z.object({
  pitchIds: z.array(z.string().uuid()).min(1).max(200),
});

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let raw: unknown;
  try { raw = await request.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = Body.safeParse(raw);
  if (!parsed.success) {
    return Response.json({ ok: false, error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const { pitchIds } = parsed.data;

  const result = await prisma.outreachOrgPitch.updateMany({
    where: {
      id: { in: pitchIds },
      status: "draft",
    },
    data: {
      status: "approved",
      approved_at: new Date(),
      approved_by: "admin",
    },
  });

  return Response.json({ ok: true, approved: result.count });
}
