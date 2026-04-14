export interface StateContent {
  slug: string;
  name: string;
  abbreviation: string;
  populationServed: number; // census estimate
  wellWaterPercent: number; // % of residents on private wells (USGS/EPA estimate)
  topContaminants: string[]; // slugs matching lib/content/contaminants
  summary: string;
  lastUpdated: string;
}

const stateContent: StateContent[] = [
  {
    slug: "california",
    name: "California",
    abbreviation: "CA",
    populationServed: 36400000,
    wellWaterPercent: 15,
    topContaminants: ["pfas", "arsenic", "disinfection-byproducts", "nitrates"],
    summary:
      "California's drinking water comes from a complex mix of surface water (rivers, reservoirs) and groundwater. The state has some of the strictest water quality regulations in the U.S., but still faces challenges from agricultural runoff, legacy industrial contamination, and aging infrastructure in older cities. The State Water Resources Control Board maintains primacy for Safe Drinking Water Act enforcement.",
    lastUpdated: "2025-01-10",
  },
  {
    slug: "texas",
    name: "Texas",
    abbreviation: "TX",
    populationServed: 29000000,
    wellWaterPercent: 22,
    topContaminants: ["arsenic", "nitrates", "disinfection-byproducts"],
    summary:
      "Texas has more public water systems than any other state. Groundwater from the Ogallala and Edwards aquifers serves millions of Texans. Naturally occurring arsenic is elevated in parts of West Texas, and agricultural nitrate contamination is a documented concern in rural areas. TCEQ holds primary enforcement authority over Texas water systems.",
    lastUpdated: "2025-01-10",
  },
  {
    slug: "florida",
    name: "Florida",
    abbreviation: "FL",
    populationServed: 21500000,
    wellWaterPercent: 10,
    topContaminants: ["disinfection-byproducts", "lead", "nitrates", "pfas"],
    summary:
      "Florida relies almost entirely on groundwater from the Floridan Aquifer System, one of the world's most productive aquifers. High organic content in Florida's source water creates elevated disinfection byproduct (DBP) formation. Lead remains a concern in older structures. PFAS contamination has been found near military installations. FDEP holds primary enforcement authority.",
    lastUpdated: "2025-01-10",
  },
  {
    slug: "arizona",
    name: "Arizona",
    abbreviation: "AZ",
    populationServed: 7200000,
    wellWaterPercent: 18,
    topContaminants: ["arsenic", "pfas", "hard-water", "disinfection-byproducts"],
    summary:
      "Arizona's water supply depends heavily on the Colorado River (delivered via the Central Arizona Project) and local groundwater. Naturally occurring arsenic is a significant issue in rural areas — Arizona has some of the highest naturally occurring arsenic levels in the U.S. Hard water and PFAS contamination near military installations are also documented. ADEQ holds primary enforcement authority.",
    lastUpdated: "2025-01-10",
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbreviation: "OH",
    populationServed: 11700000,
    wellWaterPercent: 12,
    topContaminants: ["lead", "nitrates", "disinfection-byproducts", "pfas"],
    summary:
      "Ohio draws water from Lake Erie and inland rivers. Lead contamination in older housing stock — particularly in cities like Toledo and Cleveland — is a documented concern. Agricultural runoff contributes nitrate loading near Lake Erie. Several communities near industrial sites have documented PFAS detections. Ohio EPA holds primary enforcement authority.",
    lastUpdated: "2025-01-10",
  },
];

export default stateContent;

export function getStateContentBySlug(slug: string): StateContent | undefined {
  return stateContent.find((s) => s.slug === slug);
}

export function getStateContentByAbbr(abbr: string): StateContent | undefined {
  return stateContent.find((s) => s.abbreviation === abbr.toUpperCase());
}
