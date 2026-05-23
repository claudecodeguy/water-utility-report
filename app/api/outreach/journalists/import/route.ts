import Papa from "papaparse";
import { requireAdmin } from "@/lib/outreach/auth";
import { prisma } from "@/lib/prisma";

interface CsvRow {
  name?: string;
  email?: string;
  outlet?: string;
  outlet_url?: string;
  beat?: string;
  state?: string;
  city?: string;
  recent_topics?: string;
}

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return Response.json({ ok: false, error: "No file provided" }, { status: 400 });
  }

  const text = await file.text();
  const { data } = Papa.parse<CsvRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, "_"),
  });

  let inserted = 0;
  let updated = 0;
  const errors: { row: number; message: string }[] = [];

  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    const rowNum = i + 2; // 1-indexed, accounting for header

    if (!row.email?.trim()) {
      errors.push({ row: rowNum, message: "Missing email" });
      continue;
    }
    if (!row.name?.trim()) {
      errors.push({ row: rowNum, message: "Missing name" });
      continue;
    }
    if (!row.outlet?.trim()) {
      errors.push({ row: rowNum, message: "Missing outlet" });
      continue;
    }

    const recentTopics = row.recent_topics
      ? row.recent_topics.split(";").map((t) => t.trim()).filter(Boolean)
      : [];

    try {
      const existing = await prisma.outreachJournalist.findUnique({
        where: { email: row.email.trim().toLowerCase() },
      });

      if (existing) {
        await prisma.outreachJournalist.update({
          where: { email: row.email.trim().toLowerCase() },
          data: {
            outlet: row.outlet.trim(),
            outlet_url: row.outlet_url?.trim() || null,
            beat: row.beat?.trim() || null,
            state: row.state?.trim().toUpperCase() || null,
            city: row.city?.trim() || null,
            recent_topics: recentTopics,
          },
        });
        updated++;
      } else {
        await prisma.outreachJournalist.create({
          data: {
            name: row.name.trim(),
            email: row.email.trim().toLowerCase(),
            outlet: row.outlet.trim(),
            outlet_url: row.outlet_url?.trim() || null,
            beat: row.beat?.trim() || null,
            state: row.state?.trim().toUpperCase() || null,
            city: row.city?.trim() || null,
            recent_topics: recentTopics,
          },
        });
        inserted++;
      }
    } catch (err) {
      errors.push({
        row: rowNum,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return Response.json({ ok: true, inserted, updated, errors });
}
