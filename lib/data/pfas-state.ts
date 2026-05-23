import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";

// ── Unit normalization ─────────────────────────────────────────────────────────

export function toNgL(rawValue: string, rawUnit: string): number | null {
  const value = parseFloat(rawValue);
  if (isNaN(value)) return null;
  const unit = rawUnit.trim().toLowerCase();
  if (unit === "ng/l" || unit === "ppt") return value;
  if (unit === "µg/l" || unit === "ug/l" || unit === "ppb") return value * 1000;
  if (unit === "mg/l" || unit === "ppm") return value * 1_000_000;
  console.warn(`[pfas-state] Unknown unit "${rawUnit}" for value "${rawValue}" — excluded`);
  return null;
}

// ── Types ──────────────────────────────────────────────────────────────────────

export type TopDetection = {
  utility_id: string;
  utility_slug: string;
  utility_name: string;
  city: string | null;
  county: string | null;
  population_served: number;
  pwsid: string;
  analyte_name: string;
  analyte_code: string;
  measured_value_ng_l: number;
  sample_date: string; // ISO string — survives unstable_cache JSON round-trip
  source_url: string;
};

export type AnalyteBreakdown = {
  analyte_code: string;
  analyte_name: string;
  epa_mcl_ppt: number | null;
  total_records: number;
  detections: number;
  max_value_ng_l: number | null;
  median_detected_ng_l: number | null;
};

export type UtilitySummary = {
  id: string;
  slug: string;
  name: string;
  pwsid: string;
  city: string | null;
  county: string | null;
  population_served: number;
  total_records: number;
  detection_count: number;
  max_pfoa_ng_l: number | null;
  max_pfos_ng_l: number | null;
  above_any_mcl: boolean;
};

export type StatePfasData = {
  state: { name: string; code: string; slug: string };
  summary: {
    total_utilities_tested: number;
    total_records: number;
    utilities_with_any_detection: number;
    utilities_above_pfoa_mcl: number;
    utilities_above_pfos_mcl: number;
    utilities_above_any_mcl: number;
    earliest_sample_date: string | null; // ISO string
    latest_sample_date: string | null;  // ISO string
    data_freshness_days: number | null;
  };
  top_detections: TopDetection[];
  analyte_breakdown: AnalyteBreakdown[];
  all_utilities: UtilitySummary[];
};

// ── Constants ──────────────────────────────────────────────────────────────────

const MCL_CODES = ["PFOA", "PFOS", "PFNA", "PFHxS", "HFPO-DA"] as const;
type MclCode = (typeof MCL_CODES)[number];

const MCL_PPT: Record<MclCode, number> = {
  PFOA: 4,
  PFOS: 4,
  PFNA: 10,
  PFHxS: 10,
  "HFPO-DA": 10,
};

// ── Data fetcher ───────────────────────────────────────────────────────────────

async function _getStatePfasData(stateSlug: string): Promise<StatePfasData | null> {
  const dbState = await prisma.state.findUnique({
    where: { slug: stateSlug },
    select: { id: true, name: true, abbreviation: true, slug: true },
  });
  if (!dbState) return null;

  // ── Phase 1: utilities in state with PFAS records ──────────────────────────
  const utilitiesInState = await prisma.utility.findMany({
    where: {
      state_id: dbState.id,
      pfas_records: { some: { validated: true, suppressed: false } },
    },
    select: {
      id: true,
      slug: true,
      name: true,
      pwsid: true,
      city_served: true,
      county_served: true,
      population_served: true,
      _count: {
        select: {
          pfas_records: { where: { validated: true, suppressed: false } },
        },
      },
    },
    orderBy: { population_served: "desc" },
  });

  const stateBase = { name: dbState.name, code: dbState.abbreviation, slug: dbState.slug };

  if (utilitiesInState.length === 0) {
    return {
      state: stateBase,
      summary: {
        total_utilities_tested: 0,
        total_records: 0,
        utilities_with_any_detection: 0,
        utilities_above_pfoa_mcl: 0,
        utilities_above_pfos_mcl: 0,
        utilities_above_any_mcl: 0,
        earliest_sample_date: null as null,
        latest_sample_date: null as null,
        data_freshness_days: null,
      },
      top_detections: [],
      analyte_breakdown: [],
      all_utilities: [],
    };
  }

  const utilityMap = new Map(utilitiesInState.map((u) => [u.pwsid, u]));

  // Use state_id filter on all PfasRecord queries — avoids large IN clause
  const stateFilter = { utility: { state_id: dbState.id } };
  const baseWhere = { ...stateFilter, validated: true, suppressed: false } as const;
  const detWhere = { ...baseWhere, raw_detection_flag: "Detected above MRL" } as const;

  // ── Phase 2: parallel aggregation queries ──────────────────────────────────
  const [
    totalRecords,
    earliestSample,
    latestSample,
    allAnalytes,
    analyteGroups,
    analyteDetGroups,
    perUtilityDetGroups,
    mclDetections,
  ] = await Promise.all([
    // Total record count
    prisma.pfasRecord.count({ where: baseWhere }),

    // Date range
    prisma.pfasRecord.findFirst({
      where: baseWhere,
      orderBy: { sample_date: "asc" },
      select: { sample_date: true },
    }),
    prisma.pfasRecord.findFirst({
      where: baseWhere,
      orderBy: { sample_date: "desc" },
      select: { sample_date: true },
    }),

    // All analytes (for breakdown lookup)
    prisma.pfasAnalyte.findMany({
      select: { id: true, code: true, name: true, epa_mcl_ppt: true },
    }),

    // Records per analyte (for breakdown totals)
    prisma.pfasRecord.groupBy({
      by: ["analyte_id"],
      where: baseWhere,
      _count: { _all: true },
    }),

    // Detections per analyte (for breakdown detections)
    prisma.pfasRecord.groupBy({
      by: ["analyte_id"],
      where: detWhere,
      _count: { _all: true },
    }),

    // Detection count per utility (for all_utilities + utilities_with_any_detection)
    prisma.pfasRecord.groupBy({
      by: ["pwsid"],
      where: detWhere,
      _count: { _all: true },
    }),

    // MCL analyte detections — for top 10 + MCL exceedances
    // Limited to 5 MCL analytes × a few hundred records per state = manageable
    prisma.pfasRecord.findMany({
      where: {
        ...detWhere,
        analyte: { code: { in: MCL_CODES as unknown as string[] } },
      },
      select: {
        pwsid: true,
        raw_result_value: true,
        raw_unit: true,
        sample_date: true,
        source_url: true,
        analyte: { select: { code: true, name: true, epa_mcl_ppt: true } },
      },
    }),
  ]);

  // ── Build lookup maps ──────────────────────────────────────────────────────
  const analyteById = new Map(allAnalytes.map((a) => [a.id, a]));
  const totalByAnalyteId = new Map(analyteGroups.map((g) => [g.analyte_id, g._count._all]));
  const detsByAnalyteId = new Map(analyteDetGroups.map((g) => [g.analyte_id, g._count._all]));
  const detsByPwsid = new Map(perUtilityDetGroups.map((g) => [g.pwsid, g._count._all]));

  // ── Process MCL detections ─────────────────────────────────────────────────
  type MclEntry = {
    abovePfoa: boolean;
    abovePfos: boolean;
    aboveAny: boolean;
    maxPfoa: number | null;
    maxPfos: number | null;
  };
  const mclByPwsid = new Map<string, MclEntry>();

  // For top detections — deduplicate to best value per utility:analyte combo
  const topMap = new Map<string, TopDetection & { sortKey: number }>();
  const maxByCode = new Map<string, number>(); // for analyte_breakdown max

  for (const rec of mclDetections) {
    const ngL = toNgL(rec.raw_result_value, rec.raw_unit);
    if (ngL === null) continue;

    const code = rec.analyte.code as MclCode;
    const mcl = MCL_PPT[code];

    // Update state-level max per analyte code
    const prevMax = maxByCode.get(code) ?? 0;
    if (ngL > prevMax) maxByCode.set(code, ngL);

    // MCL exceedance tracking
    const entry = mclByPwsid.get(rec.pwsid) ?? {
      abovePfoa: false,
      abovePfos: false,
      aboveAny: false,
      maxPfoa: null,
      maxPfos: null,
    };
    if (ngL > mcl) entry.aboveAny = true;
    if (code === "PFOA") {
      if (ngL > mcl) entry.abovePfoa = true;
      entry.maxPfoa = Math.max(entry.maxPfoa ?? 0, ngL);
    }
    if (code === "PFOS") {
      if (ngL > mcl) entry.abovePfos = true;
      entry.maxPfos = Math.max(entry.maxPfos ?? 0, ngL);
    }
    mclByPwsid.set(rec.pwsid, entry);

    // Top detection candidates (PFOA + PFOS only per spec)
    if (code === "PFOA" || code === "PFOS") {
      const utility = utilityMap.get(rec.pwsid);
      if (!utility) continue;
      const key = `${rec.pwsid}:${code}`;
      const existing = topMap.get(key);
      if (!existing || ngL > existing.sortKey) {
        topMap.set(key, {
          utility_id: utility.id,
          utility_slug: utility.slug,
          utility_name: normalizeName(utility.name),
          city: utility.city_served,
          county: utility.county_served,
          population_served: utility.population_served,
          pwsid: rec.pwsid,
          analyte_name: rec.analyte.name,
          analyte_code: code,
          measured_value_ng_l: ngL,
          sample_date: rec.sample_date.toISOString(),
          source_url: rec.source_url,
          sortKey: ngL,
        });
      }
    }
  }

  const top_detections: TopDetection[] = Array.from(topMap.values())
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 10)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map(({ sortKey: _, ...rest }) => rest);

  // ── Summary stats ──────────────────────────────────────────────────────────
  const earliestDateObj = earliestSample?.sample_date ?? null;
  const latestDateObj = latestSample?.sample_date ?? null;
  const data_freshness_days = latestDateObj
    ? Math.floor((Date.now() - latestDateObj.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const mclEntries = Array.from(mclByPwsid.values());

  // ── Analyte breakdown ──────────────────────────────────────────────────────
  const analyte_breakdown: AnalyteBreakdown[] = allAnalytes
    .map((a) => ({
      analyte_code: a.code,
      analyte_name: a.name,
      epa_mcl_ppt: a.epa_mcl_ppt,
      total_records: totalByAnalyteId.get(a.id) ?? 0,
      detections: detsByAnalyteId.get(a.id) ?? 0,
      max_value_ng_l: maxByCode.get(a.code) ?? null,
      median_detected_ng_l: null, // deferred to prompt 2
    }))
    .filter((a) => a.total_records > 0)
    .sort((a, b) => b.detections - a.detections);

  // ── All utilities ──────────────────────────────────────────────────────────
  const all_utilities: UtilitySummary[] = utilitiesInState.map((u) => {
    const mcl = mclByPwsid.get(u.pwsid);
    return {
      id: u.id,
      slug: u.slug,
      name: normalizeName(u.name),
      pwsid: u.pwsid,
      city: u.city_served,
      county: u.county_served,
      population_served: u.population_served,
      total_records: u._count.pfas_records,
      detection_count: detsByPwsid.get(u.pwsid) ?? 0,
      max_pfoa_ng_l: mcl?.maxPfoa ?? null,
      max_pfos_ng_l: mcl?.maxPfos ?? null,
      above_any_mcl: mcl?.aboveAny ?? false,
    };
  });

  return {
    state: stateBase,
    summary: {
      total_utilities_tested: utilitiesInState.length,
      total_records: totalRecords,
      utilities_with_any_detection: detsByPwsid.size,
      utilities_above_pfoa_mcl: mclEntries.filter((v) => v.abovePfoa).length,
      utilities_above_pfos_mcl: mclEntries.filter((v) => v.abovePfos).length,
      utilities_above_any_mcl: mclEntries.filter((v) => v.aboveAny).length,
      earliest_sample_date: earliestDateObj?.toISOString() ?? null,
      latest_sample_date: latestDateObj?.toISOString() ?? null,
      data_freshness_days,
    },
    top_detections,
    analyte_breakdown,
    all_utilities,
  };
}

export const getStatePfasData = unstable_cache(
  _getStatePfasData,
  ["pfas-state"],
  { revalidate: 86400, tags: ["pfas-state"] }
);

// ── Lightweight summary (hub page + nearby state cards) ────────────────────────

export type StatePfasSummary = {
  state: { name: string; slug: string; code: string };
  utilities_tested: number;
  utilities_with_any_detection: number;
  utilities_above_pfoa_mcl: number;
  utilities_above_pfos_mcl: number;
  utilities_above_any_mcl: number;
  latest_sample_date: string | null; // ISO string
};

async function _getStatePfasSummary(stateSlug: string): Promise<StatePfasSummary | null> {
  const dbState = await prisma.state.findUnique({
    where: { slug: stateSlug },
    select: { id: true, name: true, abbreviation: true, slug: true },
  });
  if (!dbState) return null;

  const baseWhere = {
    utility: { state_id: dbState.id },
    validated: true,
    suppressed: false,
  } as const;
  const detWhere = { ...baseWhere, raw_detection_flag: "Detected above MRL" } as const;

  const [utilitiesTested, utilitiesWithDetDist, latestSample, mclDetections] = await Promise.all([
    prisma.utility.count({
      where: { state_id: dbState.id, pfas_records: { some: { validated: true, suppressed: false } } },
    }),
    prisma.pfasRecord.groupBy({
      by: ["pwsid"],
      where: detWhere,
      _count: { _all: true },
    }),
    prisma.pfasRecord.findFirst({
      where: baseWhere,
      orderBy: { sample_date: "desc" },
      select: { sample_date: true },
    }),
    prisma.pfasRecord.findMany({
      where: {
        ...detWhere,
        analyte: { code: { in: MCL_CODES as unknown as string[] } },
      },
      select: {
        pwsid: true,
        raw_result_value: true,
        raw_unit: true,
        analyte: { select: { code: true } },
      },
    }),
  ]);

  const mclByPwsid = new Map<string, { abovePfoa: boolean; abovePfos: boolean; aboveAny: boolean }>();
  for (const rec of mclDetections) {
    const ngL = toNgL(rec.raw_result_value, rec.raw_unit);
    if (ngL === null) continue;
    const code = rec.analyte.code as MclCode;
    const mcl = MCL_PPT[code];
    if (ngL <= mcl) continue;
    const entry = mclByPwsid.get(rec.pwsid) ?? { abovePfoa: false, abovePfos: false, aboveAny: false };
    entry.aboveAny = true;
    if (code === "PFOA") entry.abovePfoa = true;
    if (code === "PFOS") entry.abovePfos = true;
    mclByPwsid.set(rec.pwsid, entry);
  }

  const mclEntries = Array.from(mclByPwsid.values());
  return {
    state: { name: dbState.name, slug: dbState.slug, code: dbState.abbreviation },
    utilities_tested: utilitiesTested,
    utilities_with_any_detection: utilitiesWithDetDist.length,
    utilities_above_pfoa_mcl: mclEntries.filter((v) => v.abovePfoa).length,
    utilities_above_pfos_mcl: mclEntries.filter((v) => v.abovePfos).length,
    utilities_above_any_mcl: mclEntries.filter((v) => v.aboveAny).length,
    latest_sample_date: latestSample?.sample_date.toISOString() ?? null,
  };
}

export const getStatePfasSummary = unstable_cache(
  _getStatePfasSummary,
  ["pfas-state-summary"],
  { revalidate: 86400, tags: ["pfas-state"] }
);
