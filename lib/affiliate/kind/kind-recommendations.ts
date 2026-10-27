import {
  KIND_PRODUCTS,
  isValidKindAffiliateUrl,
  type KindProduct,
} from "./kind-products";

export type KindPageType = "utility-report" | "pfas-utility" | "well-water";

export interface KindContaminantDetection {
  key: string;
  name: string;
  detected: boolean;
  level: number | null;
  unit: string | null;
}

export interface KindRecommendationContext {
  pageType: KindPageType;
  pageIdentifier: string;
  detections?: readonly KindContaminantDetection[];
  pfasDetected?: boolean;
  wellWholeHouseScaleContext?: boolean;
}

export interface KindRecommendation {
  product: KindProduct;
  triggers: readonly string[];
  placement: "utility-report" | "pfas-utility" | "well-water-guide";
  pageType: KindPageType;
  pageIdentifier: string;
}

const PFAS_KEYS = new Set(["pfas"]);
const NITRATE_KEYS = new Set(["nitrate", "nitrates"]);
const IRON_KEYS = new Set(["iron"]);
const MANGANESE_KEYS = new Set(["manganese"]);
const HYDROGEN_SULFIDE_KEYS = new Set(["hydrogen-sulfide"]);
const PH_KEYS = new Set(["ph"]);
const CITY_CARBON_KEYS = new Set(["chlorine", "atrazine"]);
const HARDNESS_KEYS = new Set(["hardness"]);
const COMBINED_IRON_MANGANESE_KEYS = new Set(["iron-and-manganese"]);
const MICROBIAL_KEYS = new Set([
  "coliform-bacteria",
  "total-coliform",
  "fecal-coliform",
  "e-coli",
  "giardia",
  "legionella",
]);

function normalizeKey(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function hasDetection(
  detections: readonly KindContaminantDetection[],
  keys: ReadonlySet<string>
): boolean {
  return detections.some((item) => item.detected && keys.has(normalizeKey(item.key)));
}

function detectedRows(
  detections: readonly KindContaminantDetection[],
  keys: ReadonlySet<string>
): readonly KindContaminantDetection[] {
  return detections.filter((item) => item.detected && keys.has(normalizeKey(item.key)));
}

function toMgL(level: number | null, unit: string | null): number | null {
  if (level === null || !Number.isFinite(level) || !unit) return null;
  const normalizedUnit = unit.trim().toLowerCase().replaceAll("μ", "µ");
  if (normalizedUnit === "mg/l" || normalizedUnit === "mg/l as fe" || normalizedUnit === "mg/l as mn") {
    return level;
  }
  if (normalizedUnit === "ppm") return level;
  if (["µg/l", "ug/l", "mcg/l"].includes(normalizedUnit)) return level / 1000;
  return null;
}

function aioEligible(
  detections: readonly KindContaminantDetection[],
  product: KindProduct
): boolean {
  if (hasDetection(detections, COMBINED_IRON_MANGANESE_KEYS)) return false;

  const limits = [
    { keys: IRON_KEYS, max: product.maxIronMgL },
    { keys: MANGANESE_KEYS, max: product.maxManganeseMgL },
    { keys: HYDROGEN_SULFIDE_KEYS, max: product.maxHydrogenSulfideMgL },
  ];

  for (const { keys, max } of limits) {
    const rows = detectedRows(detections, keys);
    if (rows.length === 0) continue;
    if (max === undefined) return false;
    for (const row of rows) {
      const measuredMgL = toMgL(row.level, row.unit);
      if (measuredMgL === null || measuredMgL > max) return false;
    }
  }

  const phRows = detections.filter((item) => PH_KEYS.has(normalizeKey(item.key)));
  if (phRows.length > 0) {
    if (product.minPh === undefined || product.maxPh === undefined) return false;
    for (const row of phRows) {
      if (row.level === null || !Number.isFinite(row.level)) return false;
      if (row.level < product.minPh || row.level > product.maxPh) return false;
    }
  }

  return true;
}

function findProduct(key: KindProduct["key"]): KindProduct | undefined {
  const product = KIND_PRODUCTS.find((item) => item.key === key);
  if (!product || !product.enabled) return undefined;
  if (!isValidKindAffiliateUrl(product)) {
    console.error(`Kind affiliate product ${product.key} is suppressed: AWIN URL is missing or invalid.`);
    return undefined;
  }
  return product;
}

function recommendation(
  productKey: KindProduct["key"],
  triggers: readonly string[],
  context: KindRecommendationContext
): KindRecommendation | undefined {
  const product = findProduct(productKey);
  if (!product) return undefined;
  const placement =
    context.pageType === "pfas-utility"
      ? "pfas-utility"
      : context.pageType === "well-water"
        ? "well-water-guide"
        : "utility-report";
  return {
    product,
    triggers,
    placement,
    pageType: context.pageType,
    pageIdentifier: context.pageIdentifier,
  };
}

export function getKindRecommendations(
  context: KindRecommendationContext,
  featureEnabled = true
): KindRecommendation[] {
  if (!featureEnabled || !context.pageIdentifier) return [];

  const detections = context.detections ?? [];
  const isPfasPage = context.pageType === "pfas-utility";
  const recommendations: KindRecommendation[] = [];

  if (isPfasPage) {
    if (context.pfasDetected) {
      const item = recommendation("pro-ro", ["PFAS detected"], context);
      if (item) recommendations.push(item);
    }
    return recommendations;
  }

  const pfasDetected =
    context.pfasDetected || hasDetection(detections, PFAS_KEYS);
  const nitrateDetected = hasDetection(detections, NITRATE_KEYS);
  if (pfasDetected || nitrateDetected) {
    const triggers = [
      ...(pfasDetected ? ["PFAS detected"] : []),
      ...(nitrateDetected ? ["Nitrates detected"] : []),
    ];
    const item = recommendation("pro-ro", triggers, context);
    if (item) recommendations.push(item);
  }

  const aioRows = [
    ...detectedRows(detections, IRON_KEYS),
    ...detectedRows(detections, MANGANESE_KEYS),
    ...detectedRows(detections, HYDROGEN_SULFIDE_KEYS),
  ];
  const aioProduct =
    aioRows.length > 0 ? findProduct("ws-aio") : undefined;
  if (aioProduct && aioEligible(detections, aioProduct)) {
    const triggers = [
      ...(detectedRows(detections, IRON_KEYS).length > 0 ? ["Iron detected"] : []),
      ...(detectedRows(detections, MANGANESE_KEYS).length > 0 ? ["Manganese detected"] : []),
      ...(detectedRows(detections, HYDROGEN_SULFIDE_KEYS).length > 0
        ? ["Hydrogen sulfide detected"]
        : []),
    ];
    recommendations.push({
      product: aioProduct,
      triggers,
      placement:
        context.pageType === "well-water" ? "well-water-guide" : "utility-report",
      pageType: context.pageType,
      pageIdentifier: context.pageIdentifier,
    });
  }

  if (context.pageType === "well-water") {
    if (context.wellWholeHouseScaleContext) {
      const hasMicrobialDetection = hasDetection(detections, MICROBIAL_KEYS);
      const productKey = hasMicrobialDetection ? "ws-6000uv" : "ws-6000";
      const triggers = [
        "Well-water whole-house filtration and scale-conditioning context",
        ...(hasMicrobialDetection ? ["Microbial detection supports UV treatment"] : []),
      ];
      const item = recommendation(productKey, triggers, context);
      if (item) recommendations.push(item);
    }
    return recommendations;
  }

  const carbonRows = detectedRows(detections, CITY_CARBON_KEYS);
  const hardnessRows = detectedRows(detections, HARDNESS_KEYS);
  if (carbonRows.length > 0 && hardnessRows.length > 0) {
    const hasMicrobialDetection = hasDetection(detections, MICROBIAL_KEYS);
    const productKey = hasMicrobialDetection ? "e-3000uv" : "e-3000";
    const triggers = [
      ...carbonRows.map((item) => `${item.name} detected`),
      ...hardnessRows.map((item) => `${item.name} detected`),
      ...(hasMicrobialDetection ? ["Microbial detection supports UV treatment"] : []),
    ];
    const item = recommendation(productKey, triggers, context);
    if (item) recommendations.push(item);
  } else {
    if (carbonRows.length > 0) {
      const item = recommendation(
        "e-1000",
        carbonRows.map((detection) => `${detection.name} detected`),
        context
      );
      if (item) recommendations.push(item);
    }
    if (hardnessRows.length > 0) {
      const item = recommendation(
        "e-2000",
        hardnessRows.map((detection) => `${detection.name} detected`),
        context
      );
      if (item) recommendations.push(item);
    }
  }

  return recommendations;
}
