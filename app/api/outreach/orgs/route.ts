import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = new Set(["nonprofit", "extension", "health_dept", "research", "advocacy", "other"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try { body = await request.json(); } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();

  if (!name) return Response.json({ ok: false, error: "name is required" }, { status: 400 });
  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "valid email is required" }, { status: 400 });
  }

  const orgType = body.organization_type ? String(body.organization_type).toLowerCase() : null;
  if (orgType && !VALID_TYPES.has(orgType)) {
    return Response.json({ ok: false, error: `Invalid organization_type: ${orgType}` }, { status: 400 });
  }

  const statesServed = Array.isArray(body.states_served)
    ? (body.states_served as string[]).map((s) => s.toUpperCase())
    : [];

  const focusAreas = Array.isArray(body.focus_areas)
    ? (body.focus_areas as string[]).filter(Boolean)
    : [];

  try {
    const org = await prisma.outreachOrganization.create({
      data: {
        name,
        email,
        contact_name: body.contact_name ? String(body.contact_name).trim() : null,
        organization_type: orgType,
        website: body.website ? String(body.website).trim() : null,
        states_served: statesServed,
        focus_areas: focusAreas,
        recent_topics: [],
        is_national: statesServed.length >= 10 || body.is_national === true,
        notes: body.notes ? String(body.notes).trim() : null,
        enrichment_status: focusAreas.length > 0 ? "manual" : "pending",
      },
    });
    return Response.json({ ok: true, org }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("Unique constraint")) {
      return Response.json({ ok: false, error: "Email already exists" }, { status: 409 });
    }
    return Response.json({ ok: false, error: msg }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const p = url.searchParams;

  const type = p.get("type");
  const enrichmentStatus = p.get("enrichment_status");
  const state = p.get("state");
  const status = p.get("status");
  const search = p.get("search");
  const limit = Math.min(Number(p.get("limit") ?? "50"), 200);
  const offset = Number(p.get("offset") ?? "0");

  const where: Record<string, unknown> = {};
  if (type) where.organization_type = type;
  if (enrichmentStatus) where.enrichment_status = enrichmentStatus;
  if (status) where.status = status;
  if (state === "national") {
    where.is_national = true;
  } else if (state) {
    where.states_served = { has: state.toUpperCase() };
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [orgs, total] = await Promise.all([
    prisma.outreachOrganization.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: limit,
      skip: offset,
    }),
    prisma.outreachOrganization.count({ where }),
  ]);

  return Response.json({ ok: true, orgs, total });
}
