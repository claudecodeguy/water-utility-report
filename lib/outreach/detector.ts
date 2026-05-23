import { prisma } from "@/lib/prisma";
import type { OutreachSignal } from "./types";
import type { Prisma } from "../generated/prisma/client";

const HIGH_SEVERITY_CODES = ["MCL", "TT", "MRDL"];
const DETECTION_FLAG = "Detected above MRL";

export async function detectNewSignals(lookbackHours = 24): Promise<{
  inserted: number;
  signals: OutreachSignal[];
}> {
  const cutoff = new Date(Date.now() - lookbackHours * 60 * 60 * 1000);

  // ── 1. Query violations ──────────────────────────────────────────────────────
  const violations = await prisma.violation.findMany({
    where: {
      created_at: { gte: cutoff },
      OR: [
        { is_health_based: true },
        { severity: { in: HIGH_SEVERITY_CODES } },
      ],
    },
    include: {
      utility: {
        include: { state: true },
      },
    },
  });

  // ── 2. Query PFAS detections ─────────────────────────────────────────────────
  const pfasRecords = await prisma.pfasRecord.findMany({
    where: {
      created_at: { gte: cutoff },
      validated: true,
      suppressed: false,
      raw_detection_flag: DETECTION_FLAG,
    },
    include: {
      utility: {
        include: { state: true },
      },
      analyte: true,
    },
  });

  // ── 3. Load existing keys for dedup (pwsid + contaminant within last 24h) ───
  const recentCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const existing = await prisma.outreachSignal.findMany({
    where: { detected_at: { gte: recentCutoff } },
    select: { pwsid: true, contaminant: true },
  });
  const existingKeys = new Set(
    existing.map((s) => `${s.pwsid ?? ""}::${s.contaminant ?? ""}`)
  );

  // ── 4. Build signal payloads ─────────────────────────────────────────────────
  const toInsert: Prisma.OutreachSignalCreateManyInput[] = [];
  let insertCount = 0;

  for (const v of violations) {
    const key = `${v.utility?.pwsid ?? ""}::${v.contaminant_name ?? ""}`;
    if (existingKeys.has(key)) continue;

    insertCount++;
    toInsert.push({
      signal_type: "violation",
      pwsid: v.utility?.pwsid ?? null,
      utility_id: v.utility_id,
      state: v.utility?.state?.abbreviation ?? "",
      city: v.utility?.city_served ?? null,
      contaminant: v.contaminant_name ?? null,
      population_served: v.utility?.population_served ?? null,
      source_url: v.source_url ?? null,
      raw_data: {
        violation: {
          id: v.id,
          contaminant_code: v.contaminant_code,
          contaminant_name: v.contaminant_name,
          violation_type: v.violation_type,
          violation_date: v.violation_date,
          resolution_date: v.resolution_date,
          is_health_based: v.is_health_based,
          severity: v.severity,
          description: v.description,
        },
        utility: {
          id: v.utility?.id,
          name: v.utility?.name,
          pwsid: v.utility?.pwsid,
          population_served: v.utility?.population_served,
          city_served: v.utility?.city_served,
          state: v.utility?.state?.abbreviation,
        },
      },
    });
  }

  for (const p of pfasRecords) {
    const contaminant = p.analyte.short_name ?? p.analyte.code;
    const key = `${p.pwsid}::${contaminant}`;
    if (existingKeys.has(key)) continue;

    const measuredNum = parseFloat(p.raw_result_value);
    const threshold = p.analyte.epa_mcl_ppt != null
      ? Number(p.analyte.epa_mcl_ppt)
      : null;

    insertCount++;
    toInsert.push({
      signal_type: "pfas_detection",
      pwsid: p.pwsid,
      utility_id: p.utility?.id ?? null,
      state: p.utility?.state?.abbreviation ?? "",
      city: p.utility?.city_served ?? null,
      contaminant,
      measured_value: isNaN(measuredNum) ? null : measuredNum,
      threshold,
      units: p.raw_unit,
      population_served: p.utility?.population_served ?? null,
      source_url: p.source_url,
      raw_data: {
        pfas_record: {
          id: p.id,
          pwsid: p.pwsid,
          raw_result_value: p.raw_result_value,
          raw_unit: p.raw_unit,
          raw_detection_flag: p.raw_detection_flag,
          sample_date: p.sample_date,
          source_dataset: p.source_dataset,
        },
        analyte: {
          id: p.analyte.id,
          code: p.analyte.code,
          name: p.analyte.name,
          short_name: p.analyte.short_name,
          epa_mcl_ppt: p.analyte.epa_mcl_ppt,
        },
        utility: {
          id: p.utility?.id,
          name: p.utility?.name,
          pwsid: p.utility?.pwsid,
          population_served: p.utility?.population_served,
          city_served: p.utility?.city_served,
          state: p.utility?.state?.abbreviation,
        },
      },
    });
  }

  if (toInsert.length === 0) {
    return { inserted: 0, signals: [] };
  }

  // ── 5. Insert and return ─────────────────────────────────────────────────────
  await prisma.outreachSignal.createMany({ data: toInsert });

  const insertedSignals = await prisma.outreachSignal.findMany({
    where: { detected_at: { gte: recentCutoff } },
    orderBy: { detected_at: "desc" },
    take: toInsert.length,
  });

  return { inserted: insertCount, signals: insertedSignals as OutreachSignal[] };
}
