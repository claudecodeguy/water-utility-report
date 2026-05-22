import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const CSV_HEADERS =
  "pwsid,utility_name,city,county,population_served,analyte_code,analyte_name," +
  "detection_flag,original_value,original_unit,max_value_ng_l,sample_date,source_url";

const BATCH = 1000;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ state: string }> }
) {
  const { state: stateSlug } = await params;

  const dbState = await prisma.state.findUnique({
    where: { slug: stateSlug },
    select: { id: true },
  });

  if (!dbState) {
    return new NextResponse("State not found", { status: 404 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const filename = `pfas-data-${stateSlug}-${today}.csv`;

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      controller.enqueue(enc.encode(CSV_HEADERS + "\n"));

      let cursor: string | undefined;
      let hasMore = true;

      while (hasMore) {
        const records = await prisma.pfasRecord.findMany({
          where: {
            utility: { state_id: dbState.id },
            validated: true,
            suppressed: false,
          },
          select: {
            id: true,
            pwsid: true,
            raw_result_value: true,
            raw_unit: true,
            raw_detection_flag: true,
            sample_date: true,
            source_url: true,
            analyte: { select: { code: true, name: true } },
            utility: {
              select: {
                name: true,
                city_served: true,
                county_served: true,
                population_served: true,
              },
            },
          },
          orderBy: { id: "asc" },
          take: BATCH,
          ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        });

        if (records.length < BATCH) hasMore = false;
        if (records.length > 0) cursor = records[records.length - 1].id;

        for (const r of records) {
          if (!r.utility) continue;
          const rawVal = parseFloat(r.raw_result_value);
          let ngL: number | null = null;
          if (!isNaN(rawVal)) {
            const unit = r.raw_unit.trim().toLowerCase();
            if (unit === "ng/l" || unit === "ppt") ngL = rawVal;
            else if (unit === "µg/l" || unit === "ug/l" || unit === "ppb") ngL = rawVal * 1000;
            else if (unit === "mg/l" || unit === "ppm") ngL = rawVal * 1_000_000;
          }

          const row = [
            escapeCsv(r.pwsid),
            escapeCsv(r.utility.name),
            escapeCsv(r.utility.city_served),
            escapeCsv(r.utility.county_served),
            escapeCsv(r.utility.population_served),
            escapeCsv(r.analyte.code),
            escapeCsv(r.analyte.name),
            escapeCsv(r.raw_detection_flag),
            escapeCsv(r.raw_result_value),
            escapeCsv(r.raw_unit),
            escapeCsv(ngL !== null ? ngL.toFixed(4) : null),
            escapeCsv(r.sample_date.toISOString().slice(0, 10)),
            escapeCsv(r.source_url),
          ].join(",");

          controller.enqueue(enc.encode(row + "\n"));
        }
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
