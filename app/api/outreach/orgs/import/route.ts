import Papa from "papaparse";
import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = new Set(["nonprofit", "extension", "health_dept", "research", "advocacy", "other"]);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface CsvRow {
  name?: string;
  email?: string;
  contact_name?: string;
  organization_type?: string;
  website?: string;
  states_served?: string;
  focus_areas_override?: string;
  notes?: string;
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) return Response.json({ ok: false, error: "No file provided" }, { status: 400 });

  const text = await file.text();
  const { data } = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  let inserted = 0;
  let updated = 0;
  const skipped: { row_number: number; email: string | undefined; reason: string }[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 2;
    const email = row.email?.trim().toLowerCase();
    const name = row.name?.trim();

    if (!name) {
      skipped.push({ row_number: rowNum, email, reason: "missing_name" });
      continue;
    }
    if (!email || !EMAIL_RE.test(email)) {
      skipped.push({ row_number: rowNum, email, reason: "invalid_email" });
      continue;
    }

    const orgType = row.organization_type?.trim().toLowerCase();
    const validatedType = orgType && VALID_TYPES.has(orgType) ? orgType : null;

    const statesRaw = row.states_served?.trim();
    const statesServed = statesRaw
      ? statesRaw.split(";").map((s) => s.trim().toUpperCase()).filter(Boolean)
      : [];

    const focusOverrideRaw = row.focus_areas_override?.trim();
    const focusOverride = focusOverrideRaw
      ? focusOverrideRaw.split(";").map((f) => f.trim()).filter(Boolean)
      : null;

    const isNational = statesServed.length >= 10;

    try {
      const existing = await prisma.outreachOrganization.findUnique({
        where: { email },
        select: { id: true, enrichment_status: true },
      });

      if (existing) {
        // On update: preserve enrichment_status, update only explicitly provided fields
        const updateData: Record<string, unknown> = {};
        if (name) updateData.name = name;
        if (row.contact_name?.trim()) updateData.contact_name = row.contact_name.trim();
        if (validatedType != null) updateData.organization_type = validatedType;
        if (row.website?.trim()) updateData.website = row.website.trim();
        if (statesServed.length > 0) updateData.states_served = statesServed;
        if (focusOverride) updateData.focus_areas = focusOverride;
        if (row.notes?.trim()) updateData.notes = row.notes.trim();

        await prisma.outreachOrganization.update({ where: { email }, data: updateData });
        updated++;
      } else {
        await prisma.outreachOrganization.create({
          data: {
            name,
            email,
            contact_name: row.contact_name?.trim() || null,
            organization_type: validatedType,
            website: row.website?.trim() || null,
            states_served: statesServed,
            focus_areas: focusOverride ?? [],
            recent_topics: [],
            is_national: isNational,
            notes: row.notes?.trim() || null,
            enrichment_status: focusOverride ? "manual" : "pending",
          },
        });
        inserted++;
      }
    } catch (err) {
      skipped.push({
        row_number: rowNum,
        email,
        reason: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return Response.json({ ok: true, inserted, updated, skipped });
}
