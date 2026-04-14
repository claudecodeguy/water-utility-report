export type RiskLevel = "safe" | "low" | "moderate" | "high" | "critical";
export type PublishStatus = "draft" | "review" | "published" | "archived";

export interface State {
  slug: string;
  name: string;
  abbreviation: string;
  utilitiesCount: number;
  populationServed: number;
  topContaminants: string[];
  summary: string;
  wellWaterPercent: number;
  lastUpdated: string;
}

export interface Utility {
  slug: string;
  name: string;
  shortName: string;
  systemId: string;
  state: string;
  stateAbbr: string;
  cities: string[];
  populationServed: number;
  waterSource: string;
  riskLevel: RiskLevel;
  riskScore: number; // 0–100
  contaminants: UtilityContaminant[];
  violations: number;
  lastCCR: string;
  ccrUrl: string;
  serviceAreaDescription: string;
  lastUpdated: string;
  sourceConfidence: "high" | "medium" | "low";
  treatmentProcesses: string[];
  faqs: FAQ[];
  relatedUtilities: string[];
}

export interface UtilityContaminant {
  slug: string;
  name: string;
  detected: boolean;
  level: string;
  unit: string;
  mcl: string;
  status: RiskLevel;
  note: string;
}

export interface Contaminant {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  riskLevel: RiskLevel;
  summary: string;
  definition: string;
  whyCare: string;
  sources: string[];
  whoIsAffected: string;
  healthEffects: string[];
  epaLimit: string;
  epaLimitNote: string;
  detection: string;
  treatments: string[];
  wellWaterRelevant: boolean;
  affectedStates: string[];
  faqs: FAQ[];
  lastUpdated: string;
}

export interface TreatmentMethod {
  slug: string;
  name: string;
  shortName: string;
  type: "point-of-use" | "point-of-entry" | "both";
  summary: string;
  description: string;
  solves: string[];
  doesNotSolve: string[];
  bestFor: string;
  maintenance: string;
  costRange: string;
  installationType: string;
  contaminants: string[];
  faqs: FAQ[];
  lastUpdated: string;
}

export interface City {
  slug: string;
  name: string;
  state: string;
  stateAbbr: string;
  population: number;
  utilities: string[];
  topContaminants: string[];
  summary: string;
  serviceNote: string;
  faqs: FAQ[];
  lastUpdated: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Lab {
  slug: string;
  name: string;
  state: string;
  certifications: string[];
  testsOffered: string[];
  serviceArea: string;
  website: string;
  lastUpdated: string;
}

export interface ZipUtilityMatch {
  zip: string;
  utilitySlug: string;
  confidence: "high" | "medium" | "low";
}

export const riskConfig: Record<RiskLevel, {
  label: string;
  color: string;
  bg: string;
  border: string;
  barColor: string;
  position: number;
}> = {
  safe: {
    label: "No Concerns Detected",
    color: "text-wur-safe",
    bg: "bg-wur-safe-bg",
    border: "border-wur-safe-border",
    barColor: "#166534",
    position: 8,
  },
  low: {
    label: "Low Concern",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    barColor: "#4ADE80",
    position: 28,
  },
  moderate: {
    label: "Moderate Concern",
    color: "text-wur-caution",
    bg: "bg-wur-caution-bg",
    border: "border-wur-caution-border",
    barColor: "#F59E0B",
    position: 52,
  },
  high: {
    label: "High Concern",
    color: "text-wur-warning",
    bg: "bg-wur-warning-bg",
    border: "border-wur-warning-border",
    barColor: "#EA580C",
    position: 74,
  },
  critical: {
    label: "Action Required",
    color: "text-wur-danger",
    bg: "bg-wur-danger-bg",
    border: "border-wur-danger-border",
    barColor: "#B91C1C",
    position: 92,
  },
};
