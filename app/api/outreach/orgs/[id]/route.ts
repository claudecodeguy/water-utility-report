import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = new Set(["nonprofit", "extension", "health_dept", "research", "advocacy", "other"]);
const VALID_STATUSES = new Set(["active", "unsubscribed", "bounced", "blacklisted"]);

const EDITABLE_FIELDS = new Set([
  "name", "contact_name", "organization_type", "website",
  "focus_areas", "recent_topics", "states_served", "is_national", "notes", "status",
]);

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  const org = await prisma.outreachOrganization.findUnique({ where: { id } });
  if (!org) return Response.json({ ok: false, error: "Not found" }, { status: 404 });

  const pitchCounts = await prisma.outreachOrgPitch.groupBy({
    by: ["status"],
    where: { organization_id: id },
    _count: true,
  });

  const pitchStats = pitchCounts.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count;
    return acc;
  }, {});

  return Response.json({ ok: true, org, pitch_stats: pitchStats });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Strip immutable fields silently
  for (const key of ["id", "email", "enrichment_status", "enrichment_data",
    "contacted_count", "reply_count", "pickup_count", "created_at"]) {
    delete body[key];
  }

  const data: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(body)) {
    if (!EDITABLE_FIELDS.has(key)) continue;

    if (key === "organization_type" && val != null) {
      if (!VALID_TYPES.has(String(val))) {
        return Response.json({ ok: false, error: `Invalid organization_type: ${val}` }, { status: 400 });
      }
    }
    if (key === "status" && val != null) {
      if (!VALID_STATUSES.has(String(val))) {
        return Response.json({ ok: false, error: `Invalid status: ${val}` }, { status: 400 });
      }
    }
    data[key] = val;
  }

  // Editing focus_areas or states_served via PATCH marks this org as manually curated
  if ("focus_areas" in data || "states_served" in data) {
    data.enrichment_status = "manual";
  }

  if (Object.keys(data).length === 0) {
    return Response.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  try {
    const org = await prisma.outreachOrganization.update({ where: { id }, data });
    return Response.json({ ok: true, org });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await prisma.outreachOrganization.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
