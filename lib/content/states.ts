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
  {
    slug: "illinois",
    name: "Illinois",
    abbreviation: "IL",
    populationServed: 11973534,
    wellWaterPercent: 20,
    topContaminants: ["lead","disinfection-byproducts","nitrates"],
    summary:
      "Illinois has 1,134 community water systems serving approximately 12.0 million residents. Primary water sources include groundwater. The most commonly reported contaminants include lead, disinfection byproducts, nitrates. 20% of Illinois residents rely on private wells. IEPA holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-17",
  },
  {
    slug: "georgia",
    name: "Georgia",
    abbreviation: "GA",
    populationServed: 10418690,
    wellWaterPercent: 28,
    topContaminants: ["disinfection-byproducts","nitrates","arsenic"],
    summary:
      "Georgia has 565 community water systems serving approximately 10.4 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates, arsenic. 28% of Georgia residents rely on private wells. EPD holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-17",
  },
  {
    slug: "michigan",
    name: "Michigan",
    abbreviation: "MI",
    populationServed: 7300000,
    wellWaterPercent: 42,
    topContaminants: ["lead", "disinfection-byproducts"],
    summary:
      "Michigan has 667 community water systems serving approximately 7.3 million residents. Primary water sources include groundwater. The most commonly reported contaminants include lead, disinfection byproducts. 42% of Michigan residents rely on private wells. EGLE holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-17",
  },
  {
    slug: "north-carolina",
    name: "North Carolina",
    abbreviation: "NC",
    populationServed: 9400000,
    wellWaterPercent: 35,
    topContaminants: ["disinfection-byproducts", "lead"],
    summary:
      "North Carolina has 624 community water systems serving approximately 9.4 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, lead. 35% of North Carolina residents rely on private wells. NCDEQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-17",
  },
  {
    slug: "new-york",
    name: "New York",
    abbreviation: "NY",
    populationServed: 18300000,
    wellWaterPercent: 25,
    topContaminants: ["disinfection-byproducts", "lead", "nitrates"],
    summary:
      "New York has 883 community water systems serving approximately 18.3 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, lead, nitrates. 25% of New York residents rely on private wells. NYSDOH holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-17",
  },
  {
    slug: "pennsylvania",
    name: "Pennsylvania",
    abbreviation: "PA",
    populationServed: 11298972,
    wellWaterPercent: 30,
    topContaminants: ["disinfection-byproducts","lead","nitrates"],
    summary:
      "Pennsylvania has 812 community water systems serving approximately 11.3 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead, nitrates. 30% of Pennsylvania residents rely on private wells. DEP holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-18",
  },
  {
    slug: "new-jersey",
    name: "New Jersey",
    abbreviation: "NJ",
    populationServed: 8860901,
    wellWaterPercent: 20,
    topContaminants: ["disinfection-byproducts","lead","arsenic"],
    summary:
      "New Jersey has 361 community water systems serving approximately 8.9 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead, arsenic. 20% of New Jersey residents rely on private wells. DEP holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-18",
  },
  {
    slug: "virginia",
    name: "Virginia",
    abbreviation: "VA",
    populationServed: 7342539,
    wellWaterPercent: 28,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Virginia has 391 community water systems serving approximately 7.3 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, nitrates. 28% of Virginia residents rely on private wells. DEQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-18",
  },
  {
    slug: "washington",
    name: "Washington",
    abbreviation: "WA",
    populationServed: 9197069,
    wellWaterPercent: 22,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "Washington has 569 community water systems serving approximately 9.2 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead. 22% of Washington residents rely on private wells. DOH holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-18",
  },
  {
    slug: "colorado",
    name: "Colorado",
    abbreviation: "CO",
    populationServed: 7068096,
    wellWaterPercent: 25,
    topContaminants: ["disinfection-byproducts","lead","arsenic"],
    summary:
      "Colorado has 423 community water systems serving approximately 7.1 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, lead, arsenic. 25% of Colorado residents rely on private wells. CDPHE holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-18",
  },
  {
    slug: "massachusetts",
    name: "Massachusetts",
    abbreviation: "MA",
    populationServed: 10024286,
    wellWaterPercent: 18,
    topContaminants: ["lead","disinfection-byproducts","nitrates"],
    summary:
      "Massachusetts has 328 community water systems serving approximately 10.0 million residents. Primary water sources include surface water. The most commonly reported contaminants include lead, disinfection byproducts, nitrates. 18% of Massachusetts residents rely on private wells. DEP holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "maryland",
    name: "Maryland",
    abbreviation: "MD",
    populationServed: 5482215,
    wellWaterPercent: 25,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "Maryland has 184 community water systems serving approximately 5.5 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead. 25% of Maryland residents rely on private wells. MDE holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "minnesota",
    name: "Minnesota",
    abbreviation: "MN",
    populationServed: 4587852,
    wellWaterPercent: 35,
    topContaminants: ["arsenic","lead"],
    summary:
      "Minnesota has 492 community water systems serving approximately 4.6 million residents. Primary water sources include groundwater. The most commonly reported contaminants include arsenic, lead. 35% of Minnesota residents rely on private wells. MDH holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "wisconsin",
    name: "Wisconsin",
    abbreviation: "WI",
    populationServed: 4149031,
    wellWaterPercent: 38,
    topContaminants: ["arsenic","lead","disinfection-byproducts"],
    summary:
      "Wisconsin has 493 community water systems serving approximately 4.1 million residents. Primary water sources include groundwater. The most commonly reported contaminants include arsenic, lead, disinfection byproducts. 38% of Wisconsin residents rely on private wells. DNR holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "tennessee",
    name: "Tennessee",
    abbreviation: "TN",
    populationServed: 7845692,
    wellWaterPercent: 22,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Tennessee has 403 community water systems serving approximately 7.8 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, nitrates. 22% of Tennessee residents rely on private wells. TDEC holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "indiana",
    name: "Indiana",
    abbreviation: "IN",
    populationServed: 5189852,
    wellWaterPercent: 30,
    topContaminants: ["disinfection-byproducts","lead","nitrates"],
    summary:
      "Indiana has 513 community water systems serving approximately 5.2 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead, nitrates. 30% of Indiana residents rely on private wells. IDEM holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "missouri",
    name: "Missouri",
    abbreviation: "MO",
    populationServed: 5520269,
    wellWaterPercent: 30,
    topContaminants: ["disinfection-byproducts","arsenic","nitrates"],
    summary:
      "Missouri has 652 community water systems serving approximately 5.5 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, arsenic, nitrates. 30% of Missouri residents rely on private wells. MoDNR holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "oregon",
    name: "Oregon",
    abbreviation: "OR",
    populationServed: 3658175,
    wellWaterPercent: 32,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "Oregon has 277 community water systems serving approximately 3.7 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, lead. 32% of Oregon residents rely on private wells. OHA holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "south-carolina",
    name: "South Carolina",
    abbreviation: "SC",
    populationServed: 4650217,
    wellWaterPercent: 30,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "South Carolina has 300 community water systems serving approximately 4.7 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, lead. 30% of South Carolina residents rely on private wells. DHEC holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "louisiana",
    name: "Louisiana",
    abbreviation: "LA",
    populationServed: 5168448,
    wellWaterPercent: 18,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Louisiana has 643 community water systems serving approximately 5.2 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates. 18% of Louisiana residents rely on private wells. DEQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-19",
  },
  {
    slug: "alabama",
    name: "Alabama",
    abbreviation: "AL",
    populationServed: 6282599,
    wellWaterPercent: 28,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Alabama has 470 community water systems serving approximately 6.3 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates. 28% of Alabama residents rely on private wells. ADEM holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "kentucky",
    name: "Kentucky",
    abbreviation: "KY",
    populationServed: 5006431,
    wellWaterPercent: 32,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Kentucky has 345 community water systems serving approximately 5.0 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, nitrates. 32% of Kentucky residents rely on private wells. DWR holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "oklahoma",
    name: "Oklahoma",
    abbreviation: "OK",
    populationServed: 3572079,
    wellWaterPercent: 25,
    topContaminants: ["disinfection-byproducts","nitrates","arsenic"],
    summary:
      "Oklahoma has 537 community water systems serving approximately 3.6 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, nitrates, arsenic. 25% of Oklahoma residents rely on private wells. DEQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "connecticut",
    name: "Connecticut",
    abbreviation: "CT",
    populationServed: 2675985,
    wellWaterPercent: 22,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "Connecticut has 121 community water systems serving approximately 2.7 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead. 22% of Connecticut residents rely on private wells. DPH holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "utah",
    name: "Utah",
    abbreviation: "UT",
    populationServed: 3652696,
    wellWaterPercent: 12,
    topContaminants: ["nitrates","lead"],
    summary:
      "Utah has 257 community water systems serving approximately 3.7 million residents. Primary water sources include groundwater. The most commonly reported contaminants include nitrates, lead. 12% of Utah residents rely on private wells. DWQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "nevada",
    name: "Nevada",
    abbreviation: "NV",
    populationServed: 3103429,
    wellWaterPercent: 10,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "Nevada has 77 community water systems serving approximately 3.1 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead. 10% of Nevada residents rely on private wells. NDEP holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "iowa",
    name: "Iowa",
    abbreviation: "IA",
    populationServed: 2892980,
    wellWaterPercent: 35,
    topContaminants: ["disinfection-byproducts","arsenic"],
    summary:
      "Iowa has 498 community water systems serving approximately 2.9 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, arsenic. 35% of Iowa residents rely on private wells. DNR holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "arkansas",
    name: "Arkansas",
    abbreviation: "AR",
    populationServed: 3009804,
    wellWaterPercent: 32,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Arkansas has 501 community water systems serving approximately 3.0 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, nitrates. 32% of Arkansas residents rely on private wells. ADH holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "kansas",
    name: "Kansas",
    abbreviation: "KS",
    populationServed: 2780776,
    wellWaterPercent: 38,
    topContaminants: ["disinfection-byproducts","nitrates","lead"],
    summary:
      "Kansas has 412 community water systems serving approximately 2.8 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates, lead. 38% of Kansas residents rely on private wells. KDHE holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "mississippi",
    name: "Mississippi",
    abbreviation: "MS",
    populationServed: 3144309,
    wellWaterPercent: 30,
    topContaminants: ["disinfection-byproducts","lead","nitrates"],
    summary:
      "Mississippi has 794 community water systems serving approximately 3.1 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead, nitrates. 30% of Mississippi residents rely on private wells. MDEQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "new-mexico",
    name: "New Mexico",
    abbreviation: "NM",
    populationServed: 1861828,
    wellWaterPercent: 30,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "New Mexico has 184 community water systems serving approximately 1.9 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates. 30% of New Mexico residents rely on private wells. NMED holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "nebraska",
    name: "Nebraska",
    abbreviation: "NE",
    populationServed: 1634835,
    wellWaterPercent: 40,
    topContaminants: ["disinfection-byproducts","lead","nitrates"],
    summary:
      "Nebraska has 221 community water systems serving approximately 1.6 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead, nitrates. 40% of Nebraska residents rely on private wells. DHHS holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "west-virginia",
    name: "West Virginia",
    abbreviation: "WV",
    populationServed: 1528132,
    wellWaterPercent: 38,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "West Virginia has 299 community water systems serving approximately 1.5 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, lead. 38% of West Virginia residents rely on private wells. BPH holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "idaho",
    name: "Idaho",
    abbreviation: "ID",
    populationServed: 1480366,
    wellWaterPercent: 40,
    topContaminants: ["arsenic","nitrates"],
    summary:
      "Idaho has 174 community water systems serving approximately 1.5 million residents. Primary water sources include groundwater. The most commonly reported contaminants include arsenic, nitrates. 40% of Idaho residents rely on private wells. DEQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "hawaii",
    name: "Hawaii",
    abbreviation: "HI",
    populationServed: 1499441,
    wellWaterPercent: 18,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "Hawaii has 75 community water systems serving approximately 1.5 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, lead. 18% of Hawaii residents rely on private wells. DOH holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "new-hampshire",
    name: "New Hampshire",
    abbreviation: "NH",
    populationServed: 836487,
    wellWaterPercent: 55,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "New Hampshire has 131 community water systems serving approximately 0.8 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates. 55% of New Hampshire residents rely on private wells. DES holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-22",
  },
  {
    slug: "maine",
    name: "Maine",
    abbreviation: "ME",
    populationServed: 662155,
    wellWaterPercent: 48,
    topContaminants: ["lead","nitrates"],
    summary:
      "Maine has 121 community water systems serving approximately 0.7 million residents. Primary water sources include groundwater. The most commonly reported contaminants include lead, nitrates. 48% of Maine residents rely on private wells. DHHS holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "montana",
    name: "Montana",
    abbreviation: "MT",
    populationServed: 700569,
    wellWaterPercent: 48,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Montana has 145 community water systems serving approximately 0.7 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates. 48% of Montana residents rely on private wells. MDEQ holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "rhode-island",
    name: "Rhode Island",
    abbreviation: "RI",
    populationServed: 1052459,
    wellWaterPercent: 12,
    topContaminants: ["disinfection-byproducts","lead"],
    summary:
      "Rhode Island has 38 community water systems serving approximately 1.1 million residents. Primary water sources include surface water. The most commonly reported contaminants include disinfection byproducts, lead. 12% of Rhode Island residents rely on private wells. DEM holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-23",
  },
  {
    slug: "delaware",
    name: "Delaware",
    abbreviation: "DE",
    populationServed: 997436,
    wellWaterPercent: 24,
    topContaminants: ["disinfection-byproducts","nitrates"],
    summary:
      "Delaware has 79 community water systems serving approximately 1.0 million residents. Primary water sources include groundwater. The most commonly reported contaminants include disinfection byproducts, nitrates. 24% of Delaware residents rely on private wells. DNREC holds primary enforcement authority under the Safe Drinking Water Act.",
    lastUpdated: "2026-04-23",
  },
];

export default stateContent;

export function getStateContentBySlug(slug: string): StateContent | undefined {
  return stateContent.find((s) => s.slug === slug);
}

export function getStateContentByAbbr(abbr: string): StateContent | undefined {
  return stateContent.find((s) => s.abbreviation === abbr.toUpperCase());
}
