import type { State, Utility, Contaminant, TreatmentMethod, City, ZipUtilityMatch, Lab } from "./types";

// ─── STATES ────────────────────────────────────────────────────────────────────

export const states: State[] = [
  {
    slug: "california",
    name: "California",
    abbreviation: "CA",
    utilitiesCount: 2842,
    populationServed: 36400000,
    topContaminants: ["pfas", "arsenic", "disinfection-byproducts", "nitrates"],
    summary: "California's drinking water comes from a complex mix of surface water (rivers, reservoirs) and groundwater. The state has some of the strictest water quality regulations in the U.S., but still faces challenges from agricultural runoff, legacy industrial contamination, and aging infrastructure in older cities.",
    wellWaterPercent: 15,
    lastUpdated: "2025-01-10",
  },
  {
    slug: "texas",
    name: "Texas",
    abbreviation: "TX",
    utilitiesCount: 6700,
    populationServed: 29000000,
    topContaminants: ["arsenic", "nitrates", "radium", "disinfection-byproducts"],
    summary: "Texas has more public water systems than any other state. Groundwater from the Ogallala and Edwards aquifers serves millions of Texans. Naturally occurring arsenic and radium are elevated in parts of the state, and agricultural nitrate contamination is a concern in rural areas.",
    wellWaterPercent: 22,
    lastUpdated: "2025-01-10",
  },
  {
    slug: "florida",
    name: "Florida",
    abbreviation: "FL",
    utilitiesCount: 3100,
    populationServed: 21500000,
    topContaminants: ["disinfection-byproducts", "lead", "nitrates", "pfas"],
    summary: "Florida relies almost entirely on groundwater from the Floridan Aquifer System, one of the world's most productive aquifers. High organic content in Florida's water creates elevated disinfection byproduct (DBP) levels. Lead remains a concern in older structures. PFAS contamination has been found near military bases.",
    wellWaterPercent: 10,
    lastUpdated: "2025-01-10",
  },
  {
    slug: "arizona",
    name: "Arizona",
    abbreviation: "AZ",
    utilitiesCount: 990,
    populationServed: 7200000,
    topContaminants: ["arsenic", "pfas", "hard-water", "disinfection-byproducts"],
    summary: "Arizona's water supply depends heavily on the Colorado River (via the Central Arizona Project) and local groundwater. Naturally occurring arsenic is a significant issue in rural areas. Hard water and PFAS contamination near military installations are also documented concerns.",
    wellWaterPercent: 18,
    lastUpdated: "2025-01-10",
  },
  {
    slug: "ohio",
    name: "Ohio",
    abbreviation: "OH",
    utilitiesCount: 1530,
    populationServed: 11700000,
    topContaminants: ["lead", "nitrates", "disinfection-byproducts", "pfas"],
    summary: "Ohio draws water from Lake Erie and inland rivers. Lead contamination in older housing stock (particularly in cities like Toledo and Cleveland) is a documented concern. Agricultural runoff contributes nitrate loading, particularly near Lake Erie. Several communities near industrial sites have documented PFAS issues.",
    wellWaterPercent: 12,
    lastUpdated: "2025-01-10",
  },
];

// ─── UTILITIES ─────────────────────────────────────────────────────────────────

export const utilities: Utility[] = [
  {
    slug: "los-angeles-department-of-water-and-power",
    name: "Los Angeles Department of Water and Power",
    shortName: "LA DWP",
    systemId: "CA1910067",
    state: "california",
    stateAbbr: "CA",
    cities: ["Los Angeles", "Beverly Hills Adjacent", "Culver City Adjacent"],
    populationServed: 4000000,
    waterSource: "Surface water (Colorado River via Metropolitan Water District, State Water Project Aqueduct) and local groundwater wells",
    riskLevel: "low",
    riskScore: 22,
    violations: 0,
    lastCCR: "2024",
    ccrUrl: "https://www.ladwp.com/water-quality",
    serviceAreaDescription: "Los Angeles city limits and several nearby communities served under contract. Service area covers approximately 469 square miles.",
    lastUpdated: "2025-01-15",
    sourceConfidence: "high",
    treatmentProcesses: ["Coagulation/flocculation", "Sedimentation", "Filtration", "Chloramination", "UV disinfection", "Fluoridation"],
    contaminants: [
      {
        slug: "pfas",
        name: "PFAS",
        detected: true,
        level: "3.1",
        unit: "ppt",
        mcl: "4 ppt (EPA 2024)",
        status: "low",
        note: "Detected below the new EPA MCL of 4 ppt. LA DWP has implemented treatment at affected wells.",
      },
      {
        slug: "disinfection-byproducts",
        name: "Haloacetic Acids (HAAs)",
        detected: true,
        level: "18",
        unit: "µg/L",
        mcl: "60 µg/L",
        status: "low",
        note: "Well within regulatory limit. Typical of chloraminated surface water systems.",
      },
      {
        slug: "lead",
        name: "Lead",
        detected: true,
        level: "2.4",
        unit: "ppb",
        mcl: "15 ppb (action level)",
        status: "safe",
        note: "90th percentile sample well below EPA action level. Risk primarily from older household plumbing.",
      },
      {
        slug: "arsenic",
        name: "Arsenic",
        detected: false,
        level: "ND",
        unit: "µg/L",
        mcl: "10 µg/L",
        status: "safe",
        note: "Not detected at treatment plant effluent.",
      },
      {
        slug: "nitrates",
        name: "Nitrates",
        detected: true,
        level: "1.2",
        unit: "mg/L",
        mcl: "10 mg/L",
        status: "safe",
        note: "Far below the MCL. Naturally low in imported surface water.",
      },
    ],
    faqs: [
      {
        question: "Is Los Angeles tap water safe to drink?",
        answer: "Yes, LA DWP water consistently meets or exceeds federal and California drinking water standards. The 2024 Consumer Confidence Report shows zero health-based violations. However, households with older lead pipes (pre-1986 construction) should consider testing their tap water directly.",
      },
      {
        question: "Does LA tap water contain PFAS?",
        answer: "PFAS has been detected at low levels in some LA DWP source wells. As of 2024, all measured levels are below the EPA's new 4 ppt maximum contaminant level. LA DWP has installed granular activated carbon treatment at affected wells.",
      },
      {
        question: "Why does LA tap water taste or smell like chlorine?",
        answer: "LA DWP uses chloramines (a combination of chlorine and ammonia) as a disinfectant — a common practice in large surface water systems. Letting water run briefly or refrigerating it open can reduce the taste. An activated carbon pitcher filter will remove chloramine entirely.",
      },
      {
        question: "How do I confirm LA DWP is my water provider?",
        answer: "Check your water bill — the utility name is printed on it. You can also use LA DWP's online service area map at ladwp.com, or call 1-800-DIAL-DWP.",
      },
      {
        question: "What type of water filter should I use for LA tap water?",
        answer: "For the primary detected concerns (PFAS at low levels, chloramine taste/odor, mild disinfection byproducts), a certified NSF/ANSI 58 reverse osmosis system or a certified NSF/ANSI 42/53 activated carbon filter is effective. Check certification labels before buying.",
      },
    ],
    relatedUtilities: ["metropolitan-water-district-southern-california", "long-beach-water-department"],
  },
  {
    slug: "houston-water",
    name: "City of Houston Water & Wastewater Operations",
    shortName: "Houston Water",
    systemId: "TX1014001",
    state: "texas",
    stateAbbr: "TX",
    cities: ["Houston", "Humble Adjacent", "Bellaire Adjacent"],
    populationServed: 2300000,
    waterSource: "Surface water from Lake Houston, Lake Conroe (via Trinity River Authority), and Lake Livingston (via San Jacinto River Authority)",
    riskLevel: "moderate",
    riskScore: 48,
    violations: 1,
    lastCCR: "2024",
    ccrUrl: "https://www.publicworks.houstontx.gov/water-quality",
    serviceAreaDescription: "City of Houston incorporated limits plus service contracts with nearby municipalities. One of the largest water utilities in the U.S.",
    lastUpdated: "2025-01-10",
    sourceConfidence: "high",
    treatmentProcesses: ["Coagulation", "Flocculation", "Sedimentation", "Granular activated carbon", "Chlorination", "Fluoridation", "pH adjustment"],
    contaminants: [
      {
        slug: "disinfection-byproducts",
        name: "Total Trihalomethanes (TTHMs)",
        detected: true,
        level: "52",
        unit: "µg/L",
        mcl: "80 µg/L",
        status: "moderate",
        note: "Elevated but within MCL. Houston's surface water has high organic content which generates more DBPs during chlorine disinfection.",
      },
      {
        slug: "disinfection-byproducts",
        name: "Haloacetic Acids (HAAs)",
        detected: true,
        level: "38",
        unit: "µg/L",
        mcl: "60 µg/L",
        status: "low",
        note: "Within regulatory limit. Monitoring continues across distribution zones.",
      },
      {
        slug: "lead",
        name: "Lead",
        detected: true,
        level: "6",
        unit: "ppb",
        mcl: "15 ppb (action level)",
        status: "low",
        note: "Below action level. Lead service line replacement program active in older neighborhoods.",
      },
      {
        slug: "arsenic",
        name: "Arsenic",
        detected: true,
        level: "2.1",
        unit: "µg/L",
        mcl: "10 µg/L",
        status: "safe",
        note: "Low level, well within regulatory limit.",
      },
    ],
    faqs: [
      {
        question: "Is Houston tap water safe to drink?",
        answer: "Houston Water meets all current federal Safe Drinking Water Act standards. The utility recorded one minor procedural violation in 2023 (related to monitoring reporting, not a health-based exceedance). Total trihalomethanes are elevated compared to best-in-class systems — sensitive individuals (pregnant women, infants) may wish to use a carbon-block or reverse osmosis filter.",
      },
      {
        question: "Why are disinfection byproducts elevated in Houston water?",
        answer: "Houston draws surface water from bayou-fed reservoirs with naturally high dissolved organic carbon content. When chlorine reacts with organics, it forms trihalomethanes (TTHMs) and haloacetic acids. The utility uses granular activated carbon pre-treatment to reduce this, but levels remain in the upper portion of the regulatory range.",
      },
      {
        question: "What happened with Houston's water crisis in 2021?",
        answer: "During Winter Storm Uri (February 2021), widespread pipe freezing caused a boil-water notice affecting most of Houston for several weeks. The water infrastructure has since been under scrutiny and upgrade programs, though vulnerability to extreme weather remains a concern.",
      },
    ],
    relatedUtilities: ["fort-bend-water"],
  },
  {
    slug: "miami-dade-water-and-sewer",
    name: "Miami-Dade Water and Sewer Department",
    shortName: "WASD Miami-Dade",
    systemId: "FL4131000",
    state: "florida",
    stateAbbr: "FL",
    cities: ["Miami", "Miami Beach Adjacent", "Coral Gables", "Homestead"],
    populationServed: 2500000,
    waterSource: "Groundwater from the Biscayne Aquifer (a shallow, unconfined limestone aquifer)",
    riskLevel: "low",
    riskScore: 30,
    violations: 0,
    lastCCR: "2024",
    ccrUrl: "https://www.miamidade.gov/water/annual-report",
    serviceAreaDescription: "Miami-Dade County serving approximately 2.5 million residents across 27 municipalities plus unincorporated areas.",
    lastUpdated: "2025-01-08",
    sourceConfidence: "high",
    treatmentProcesses: ["Lime softening", "Filtration", "Chloramination", "Fluoridation", "Sulfate addition (corrosion control)"],
    contaminants: [
      {
        slug: "disinfection-byproducts",
        name: "Total Trihalomethanes (TTHMs)",
        detected: true,
        level: "41",
        unit: "µg/L",
        mcl: "80 µg/L",
        status: "low",
        note: "Moderate level typical for Florida groundwater with high organic content after lime softening.",
      },
      {
        slug: "hard-water",
        name: "Total Hardness",
        detected: true,
        level: "150",
        unit: "mg/L as CaCO₃",
        mcl: "No federal MCL",
        status: "low",
        note: "Moderately hard. Lime softening reduces hardness at plant but residual hardness remains.",
      },
      {
        slug: "lead",
        name: "Lead",
        detected: true,
        level: "1.8",
        unit: "ppb",
        mcl: "15 ppb (action level)",
        status: "safe",
        note: "Very low. WASD's corrosion control program is effective.",
      },
    ],
    faqs: [
      {
        question: "Is Miami-Dade tap water safe to drink?",
        answer: "Yes, Miami-Dade WASD water meets all state and federal drinking water standards with zero health-based violations in 2024. The main consumer concerns are moderate hardness (scale buildup), mild chloramine taste, and low-level disinfection byproducts — none at levels that trigger regulatory action.",
      },
      {
        question: "Why is Miami water hard?",
        answer: "Miami's water comes from the Biscayne Aquifer, a porous limestone formation. As water moves through limestone, it dissolves calcium and magnesium carbonate — the minerals that cause hardness. WASD treats for hardness at the plant (lime softening), but the delivered water remains moderately hard at ~150 mg/L.",
      },
    ],
    relatedUtilities: ["city-of-miami-beach-water"],
  },
  {
    slug: "phoenix-water-services",
    name: "City of Phoenix Water Services Department",
    shortName: "Phoenix Water",
    systemId: "AZ0400001",
    state: "arizona",
    stateAbbr: "AZ",
    cities: ["Phoenix", "Ahwatukee", "Maryvale"],
    populationServed: 1700000,
    waterSource: "Colorado River (via Salt River Project and Central Arizona Project), Salt and Verde Rivers, and groundwater",
    riskLevel: "moderate",
    riskScore: 45,
    violations: 0,
    lastCCR: "2024",
    ccrUrl: "https://www.phoenix.gov/waterservices/waterquality",
    serviceAreaDescription: "City of Phoenix limits — approximately 517 square miles. One of the fastest-growing major water utilities in the U.S.",
    lastUpdated: "2025-01-12",
    sourceConfidence: "high",
    treatmentProcesses: ["Coagulation/flocculation", "Sedimentation", "Filtration", "Granular activated carbon", "Chloramination", "Fluoridation", "Lime softening"],
    contaminants: [
      {
        slug: "pfas",
        name: "PFAS",
        detected: true,
        level: "5.8",
        unit: "ppt",
        mcl: "4 ppt (EPA 2024)",
        status: "moderate",
        note: "Detected above the new EPA MCL at some source points. Phoenix Water is actively evaluating treatment upgrades. Blending with unaffected sources currently reduces delivered levels.",
      },
      {
        slug: "arsenic",
        name: "Arsenic",
        detected: true,
        level: "3.2",
        unit: "µg/L",
        mcl: "10 µg/L",
        status: "low",
        note: "Below MCL. Naturally occurring from geological formations in the Arizona basin.",
      },
      {
        slug: "hard-water",
        name: "Total Hardness",
        detected: true,
        level: "220",
        unit: "mg/L as CaCO₃",
        mcl: "No federal MCL",
        status: "moderate",
        note: "Phoenix water is notably hard. This causes scale buildup in pipes and appliances but is not a health hazard.",
      },
      {
        slug: "disinfection-byproducts",
        name: "Total Trihalomethanes (TTHMs)",
        detected: true,
        level: "36",
        unit: "µg/L",
        mcl: "80 µg/L",
        status: "safe",
        note: "Within acceptable range.",
      },
    ],
    faqs: [
      {
        question: "Is Phoenix tap water safe to drink?",
        answer: "Phoenix Water met all federal standards in 2024 with no health-based violations. However, PFAS levels at some source points exceed the new EPA limit (4 ppt), and Phoenix Water is implementing treatment upgrades. Delivered water currently meets the MCL through blending. Residents with concerns about PFAS exposure may want to use a certified NSF/ANSI 58 reverse osmosis filter.",
      },
      {
        question: "Why is Phoenix water so hard?",
        answer: "Phoenix sources water from the Colorado River and local rivers, all of which travel through calcium-rich geological formations in the desert Southwest. The resulting hardness (around 220 mg/L) is classified as 'very hard.' A whole-home water softener is the most effective solution for households bothered by scale buildup.",
      },
    ],
    relatedUtilities: ["scottsdale-water", "tempe-water"],
  },
  {
    slug: "columbus-division-of-water",
    name: "Columbus Division of Water",
    shortName: "Columbus Water",
    systemId: "OH4900008",
    state: "ohio",
    stateAbbr: "OH",
    cities: ["Columbus", "Westerville Adjacent", "Dublin Adjacent", "Hilliard Adjacent"],
    populationServed: 1200000,
    waterSource: "Surface water from the Scioto River (Griggs and O'Shaughnessy reservoirs) and Big Walnut Creek (Hoover Reservoir)",
    riskLevel: "low",
    riskScore: 25,
    violations: 0,
    lastCCR: "2024",
    ccrUrl: "https://utilities.columbus.gov/water-quality",
    serviceAreaDescription: "City of Columbus and approximately 30 surrounding communities in Franklin County and adjacent counties.",
    lastUpdated: "2025-01-05",
    sourceConfidence: "high",
    treatmentProcesses: ["Coagulation", "Sedimentation", "Filtration", "Chlorination", "Fluoridation", "Corrosion control (orthophosphate)"],
    contaminants: [
      {
        slug: "lead",
        name: "Lead",
        detected: true,
        level: "4",
        unit: "ppb",
        mcl: "15 ppb (action level)",
        status: "low",
        note: "Below action level. Columbus uses orthophosphate corrosion control. Active lead service line inventory and replacement program underway.",
      },
      {
        slug: "nitrates",
        name: "Nitrates",
        detected: true,
        level: "2.8",
        unit: "mg/L",
        mcl: "10 mg/L",
        status: "safe",
        note: "Well within the MCL. Agricultural runoff contributes to baseline levels in the Scioto River watershed.",
      },
      {
        slug: "disinfection-byproducts",
        name: "Total Trihalomethanes (TTHMs)",
        detected: true,
        level: "28",
        unit: "µg/L",
        mcl: "80 µg/L",
        status: "safe",
        note: "Low level. Columbus water is well-treated at source.",
      },
    ],
    faqs: [
      {
        question: "Is Columbus tap water safe to drink?",
        answer: "Yes. Columbus Division of Water consistently meets all Safe Drinking Water Act requirements. The water scores in the low-concern range across major contaminant categories. Lead levels are below the action level, though households in older Columbus neighborhoods (pre-1986) with original plumbing should consider testing their specific tap.",
      },
      {
        question: "Does Columbus have lead pipes?",
        answer: "Columbus is conducting a full Lead Service Line (LSL) inventory as required by the EPA Lead and Copper Rule Revisions. Some service lines in older neighborhoods (particularly pre-1960 construction) may still be lead. The city's replacement program is active. Contact Columbus Water to check your specific address.",
      },
    ],
    relatedUtilities: ["westerville-water", "delaware-county-water"],
  },
];

// ─── CONTAMINANTS ──────────────────────────────────────────────────────────────

export const contaminants: Contaminant[] = [
  {
    slug: "pfas",
    name: "PFAS (Per- and Polyfluoroalkyl Substances)",
    shortName: "PFAS",
    category: "Industrial Chemicals",
    riskLevel: "high",
    summary: "PFAS are a group of thousands of man-made chemicals that do not break down in the environment or the human body — hence the nickname 'forever chemicals.' They have been detected in public water systems across the U.S., and the EPA established new strict limits in 2024.",
    definition: "PFAS (per- and polyfluoroalkyl substances) are a class of over 12,000 synthetic chemicals characterized by strong carbon-fluorine bonds, which make them resistant to heat, oil, water, and biological degradation. PFOA and PFOS are the most studied and historically most prevalent in drinking water.",
    whyCare: "Long-term exposure to certain PFAS has been associated with increased risk of kidney and testicular cancer, thyroid disruption, immune system effects, high cholesterol, and developmental effects in children. The EPA's new 2024 MCL of 4 ppt for PFOA and PFOS reflects the agency's conclusion that there is no safe level of exposure for these compounds.",
    sources: ["Firefighting foam (AFFF) used at military bases and airports", "Industrial manufacturing sites (Teflon, food packaging)", "Stain-resistant textiles and carpeting", "Some food packaging materials", "Wastewater from industrial discharge"],
    whoIsAffected: "Communities near military bases, airports, and certain industrial sites face the highest risk. Nationally, PFAS has been detected in water systems serving an estimated 200 million Americans at some level.",
    healthEffects: ["Increased cancer risk (kidney, testicular) at elevated levels", "Thyroid hormone disruption", "Immune system effects, including reduced vaccine response", "Elevated cholesterol", "Developmental effects in infants and young children", "Liver enzyme changes"],
    epaLimit: "4 ppt (parts per trillion) for PFOA and PFOS individually (EPA MCL, effective 2024)",
    epaLimitNote: "The EPA finalized these limits in April 2024 — the first federal PFAS drinking water standards. Utilities have until 2029 to comply.",
    detection: "EPA Method 533 or EPA Method 537.1 for individual PFAS compounds. Certified labs required for accurate results. Standard home test kits are generally not reliable for PFAS.",
    treatments: ["reverse-osmosis", "activated-carbon"],
    wellWaterRelevant: true,
    affectedStates: ["california", "arizona", "ohio", "michigan", "new-jersey", "new-hampshire"],
    faqs: [
      {
        question: "Does my water system have PFAS?",
        answer: "Check your utility's most recent Consumer Confidence Report (CCR), which must disclose PFAS results under the 2024 EPA rule. You can also search the EWG Tap Water Database or the EPA's UCMR5 data portal for your system's ID.",
      },
      {
        question: "What water filter removes PFAS?",
        answer: "Reverse osmosis (RO) systems certified to NSF/ANSI Standard 58 are the most effective, removing 90–99% of PFAS. Granular activated carbon (GAC) and carbon block filters certified to NSF/ANSI P473 can also significantly reduce PFAS. Standard pitcher filters (e.g., basic Brita) are NOT effective against PFAS.",
      },
      {
        question: "Should I stop drinking my tap water if PFAS is detected?",
        answer: "If your utility's reported levels are at or below the new EPA MCL (4 ppt for PFOA/PFOS), the EPA considers it safe under current standards. However, given that no 'safe' threshold has been established, households with infants, pregnant women, or immunocompromised individuals may reasonably choose to use a certified RO filter as a precaution.",
      },
      {
        question: "Can I shower in water with PFAS?",
        answer: "Dermal absorption and inhalation from showering are considered minor exposure routes compared to drinking and cooking. Current EPA and public health guidance focuses on ingestion as the primary concern.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "lead",
    name: "Lead in Drinking Water",
    shortName: "Lead",
    category: "Heavy Metals",
    riskLevel: "high",
    summary: "Lead has no safe level of exposure for children. It enters drinking water primarily through corrosion of lead service lines and lead-containing plumbing fixtures — not from the water source itself. The EPA's Lead and Copper Rule Revisions require utilities to replace lead service lines by 2037.",
    definition: "Lead (Pb) is a naturally occurring heavy metal that was widely used in plumbing materials — service lines, solder, fixtures, and brass fittings — until it was largely phased out in 1986. Today, lead contamination in drinking water is almost entirely a distribution/plumbing problem, not a source water problem.",
    whyCare: "There is no established safe level of blood lead in children. Even low lead exposure causes irreversible cognitive and developmental harm. Adults face increased risk of cardiovascular disease and kidney damage at elevated exposures. The EPA action level of 15 ppb is not a safety threshold — it is a management trigger.",
    sources: ["Lead service lines (pipes connecting the water main to a home)", "Lead solder used in home plumbing before 1986", "Brass faucets and fixtures (even 'lead-free' brass can contain up to 0.25% lead)", "Lead-lined fixtures in older public buildings", "Pre-1986 construction plumbing in general"],
    whoIsAffected: "Households in pre-1986 buildings, particularly in older Midwest and Northeast cities with large stocks of pre-1960 housing. Renters and lower-income households are disproportionately affected due to older housing stock. First-draw water (after water sits in pipes) poses the highest risk.",
    healthEffects: ["Cognitive and developmental delays in children (irreversible)", "Behavioral problems and reduced IQ in children", "Cardiovascular disease in adults", "Kidney damage at elevated exposures", "Hypertension", "Reproductive harm"],
    epaLimit: "15 ppb (EPA action level — not an MCL). The EPA's 2024 LCRR sets a new action level trigger at 10 ppb, effective 2024.",
    epaLimitNote: "The EPA does not set a maximum contaminant level for lead. Instead, it uses an 'action level': if 10% of samples (90th percentile) exceed 15 ppb, the utility must take corrective action. The 2024 rule lowers this to 10 ppb.",
    detection: "First-draw sampling (after water sits ≥6 hours) using EPA Method 200.8 or equivalent. Home lead test kits provide only rough screening — certified lab analysis is recommended for infants and young children.",
    treatments: ["reverse-osmosis", "activated-carbon"],
    wellWaterRelevant: true,
    affectedStates: ["ohio", "michigan", "pennsylvania", "illinois", "new-york"],
    faqs: [
      {
        question: "How do I know if I have lead pipes?",
        answer: "Check your water meter — if the pipe leading to it is dull gray and scratches silver with a key, it is likely lead. You can also request a lead service line inventory from your utility (utilities are now required to maintain these). A certified plumber can inspect your home's interior plumbing.",
      },
      {
        question: "What filter removes lead from tap water?",
        answer: "Filters certified to NSF/ANSI Standard 53 (for health effects) that specifically list lead reduction on the label. Reverse osmosis systems certified to NSF/ANSI 58 are highly effective (95–99% reduction). Basic filters without NSF/ANSI 53 certification do NOT reliably remove lead.",
      },
      {
        question: "Should I run the tap before drinking?",
        answer: "Yes — if you have lead pipes or old brass fixtures, letting the tap run for 30 seconds to 2 minutes flushes water that has been sitting in contact with lead-containing materials. This is called 'flushing' and reduces lead exposure significantly. Cold water from the tap (not from the hot water heater) should always be used for drinking and cooking.",
      },
      {
        question: "My utility says lead is below the action level — is my home safe?",
        answer: "Utility monitoring reflects a sample of homes in the system — not your specific home. Homes with lead service lines, old brass fixtures, or pre-1986 soldering can have much higher first-draw levels than the system average. If you have young children, consider testing your specific tap with a certified lab.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "nitrates",
    name: "Nitrates",
    shortName: "Nitrates",
    category: "Agricultural Runoff",
    riskLevel: "moderate",
    summary: "Nitrates are the most common groundwater contaminant in agricultural areas. They pose serious risk to infants under 6 months and are increasingly linked to colorectal cancer at chronic low levels. Levels spike seasonally following heavy rains and fertilizer application.",
    definition: "Nitrates (NO₃⁻) are naturally occurring compounds that become problematic at elevated concentrations. Agricultural fertilizers, animal waste, and septic systems are the primary sources of elevated nitrate levels in drinking water, particularly in rural groundwater wells.",
    whyCare: "Infants who ingest high-nitrate water can develop methemoglobinemia ('blue baby syndrome') — a potentially fatal condition in which hemoglobin can no longer carry oxygen. Emerging research also links chronic low-level nitrate exposure in adults to elevated colorectal cancer risk.",
    sources: ["Agricultural fertilizers (synthetic and organic)", "Animal feeding operations (CAFOs)", "Septic systems", "Urban stormwater runoff", "Natural geological sources in some areas"],
    whoIsAffected: "Households relying on private wells in agricultural areas face the highest risk. Infants under 6 months are the most vulnerable population. Rural Midwestern and California Central Valley communities are among the most affected.",
    healthEffects: ["Blue baby syndrome (methemoglobinemia) in infants under 6 months", "Potential increased colorectal cancer risk with chronic exposure", "Thyroid disruption at elevated levels", "Adverse pregnancy outcomes (emerging research)"],
    epaLimit: "10 mg/L (MCL) for nitrate as nitrogen",
    epaLimitNote: "The EPA MCL of 10 mg/L is primarily designed to protect infants from methemoglobinemia. Some researchers and state agencies suggest this limit may be too high for adults with chronic exposure concerns.",
    detection: "Standard laboratory nitrate test (EPA Method 300.0 or 353.2). Home test strips provide rough screening but should be confirmed with lab testing for infant-feeding water.",
    treatments: ["reverse-osmosis", "ion-exchange"],
    wellWaterRelevant: true,
    affectedStates: ["california", "texas", "iowa", "illinois", "nebraska", "ohio"],
    faqs: [
      {
        question: "Can I give tap water to my baby if nitrates are present?",
        answer: "Infants under 6 months should not consume water with nitrate levels above 10 mg/L (the EPA MCL). Even at levels below 10 mg/L, some pediatricians recommend using filtered or bottled water for formula preparation. Consult your pediatrician and consider testing your water.",
      },
      {
        question: "Does boiling water remove nitrates?",
        answer: "No. Boiling does NOT remove nitrates — it actually concentrates them as water evaporates. The only effective treatments are reverse osmosis, distillation, or ion exchange.",
      },
      {
        question: "Why do nitrate levels change seasonally?",
        answer: "Nitrate levels typically spike in spring and early summer following fertilizer application and heavy rain events that drive runoff into surface water and groundwater recharge zones. Private well owners in agricultural areas should test their water at least annually, ideally after spring rains.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    slug: "arsenic",
    name: "Arsenic",
    shortName: "Arsenic",
    category: "Naturally Occurring",
    riskLevel: "moderate",
    summary: "Arsenic is a naturally occurring metalloid found in groundwater across the western U.S. Long-term exposure to arsenic in drinking water is a well-established cause of bladder and lung cancer, with risks at levels near the current MCL.",
    definition: "Arsenic (As) occurs naturally in rocks and soils. It dissolves into groundwater as water moves through arsenic-bearing geological formations — particularly common in the arid Southwest, parts of the Mountain West, and pockets of New England. Elevated arsenic can also result from mining, smelting, and agricultural pesticide use.",
    whyCare: "Arsenic is a Group 1 carcinogen (IARC) — an established human carcinogen via drinking water exposure. Long-term consumption is causally linked to bladder, lung, and skin cancers. Effects are dose-dependent and cumulative over years of exposure.",
    sources: ["Natural dissolution from geological formations (primary cause in U.S.)", "Mining and smelting discharge", "Agricultural pesticides (historically)", "Coal combustion waste"],
    whoIsAffected: "Rural households relying on private wells in the Southwest, Mountain West, and parts of New England face the greatest risk. Small public water systems in these regions also commonly exceed or approach the MCL.",
    healthEffects: ["Bladder cancer (well-established causal link)", "Lung cancer", "Skin lesions (keratosis, hyperpigmentation)", "Cardiovascular disease", "Type 2 diabetes (emerging evidence)", "Cognitive effects in children"],
    epaLimit: "10 µg/L (MCL, established 2001)",
    epaLimitNote: "The EPA MCL of 10 µg/L was lowered from 50 µg/L in 2001. Some public health researchers argue the current limit remains too high given cancer risk estimates at levels between 5–10 µg/L.",
    detection: "EPA Method 200.8 (ICP-MS) or Method 200.9 (GFAA). Home test kits are not reliable for arsenic at regulatory levels — certified lab analysis is required.",
    treatments: ["reverse-osmosis", "activated-alumina", "ion-exchange"],
    wellWaterRelevant: true,
    affectedStates: ["arizona", "california", "texas", "nevada", "new-mexico", "michigan"],
    faqs: [
      {
        question: "My arsenic level is at or near 10 µg/L — should I be concerned?",
        answer: "The EPA's MCL of 10 µg/L represents an estimated cancer risk of approximately 1 in 500 over a lifetime of daily consumption — significantly higher than the typical 1-in-10,000 risk target used for other contaminants. Households with levels at or near 10 µg/L have a reasonable basis for using a certified reverse osmosis filter.",
      },
      {
        question: "What filter removes arsenic from drinking water?",
        answer: "Reverse osmosis systems certified to NSF/ANSI Standard 58 and specifically rated for arsenic reduction are most effective (typically 90–99%). Activated alumina filters (NSF/ANSI 62) are also effective for pentavalent arsenic (As(V)) but less effective for trivalent arsenic (As(III)) without pre-oxidation.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    slug: "disinfection-byproducts",
    name: "Disinfection Byproducts (DBPs)",
    shortName: "DBPs",
    category: "Treatment Byproducts",
    riskLevel: "low",
    summary: "Disinfection byproducts form when chlorine or chloramine reacts with naturally occurring organic matter in water. They are found in virtually all chlorinated public water systems. While necessary disinfection prevents far greater acute health risks, chronic DBP exposure at elevated levels has been linked to cancer and adverse pregnancy outcomes.",
    definition: "Disinfection byproducts (DBPs) are chemical compounds that form unintentionally when disinfectants (chlorine, chloramine, ozone, chlorine dioxide) react with organic and inorganic matter in source water. The two regulated DBP classes are total trihalomethanes (TTHMs) and haloacetic acids (HAA5s).",
    whyCare: "TTHMs and HAAs have been associated with increased bladder cancer risk, adverse birth outcomes (low birth weight, preterm birth), and colorectal cancer at chronically elevated levels. The risks are well below those of not disinfecting water, but they are relevant for ongoing optimization.",
    sources: ["Chlorination of water with high natural organic matter (NOM)", "Chloramination as secondary disinfection", "High-organic source water (rivers, shallow reservoirs)"],
    whoIsAffected: "Residents served by large surface water systems using chlorine disinfection — common in major metropolitan areas. Pregnant women, infants, and individuals with compromised immune systems are most vulnerable at elevated levels.",
    healthEffects: ["Bladder cancer (elevated risk at higher chronic exposures)", "Adverse pregnancy outcomes (low birth weight, preterm birth)", "Colorectal cancer (emerging evidence)", "Rectal cancer"],
    epaLimit: "80 µg/L (MCL for TTHMs) / 60 µg/L (MCL for HAA5s)",
    epaLimitNote: "These limits are running annual averages across monitoring sites. Spot levels at individual taps can vary. The EPA is under pressure to lower these limits based on updated epidemiological evidence.",
    detection: "Standard EPA methods (502.2, 524.2, 552.3). Covered by the utility's CCR reporting — most residents don't need independent testing unless concerned about specific system performance.",
    treatments: ["activated-carbon", "reverse-osmosis"],
    wellWaterRelevant: false,
    affectedStates: ["florida", "texas", "ohio", "california", "louisiana"],
    faqs: [
      {
        question: "Should I worry about disinfection byproducts in my tap water?",
        answer: "If your utility's TTHMs are well below 80 µg/L (say, under 40 µg/L), the associated risk is low. At levels between 60–80 µg/L, pregnant women and frequent tap-water drinkers may reasonably consider a certified carbon block or reverse osmosis filter. Disinfection itself protects against acute illness from pathogens — the risk-benefit calculation strongly favors maintaining disinfection.",
      },
      {
        question: "Does a standard carbon pitcher filter (like Brita) remove DBPs?",
        answer: "Basic pitcher filters with granular activated carbon provide partial reduction of chlorine taste and odor, and some reduction of TTHMs. For consistent, significant DBP reduction, look for filters certified to NSF/ANSI Standard 53 that specifically list TTHM reduction on their certification.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    slug: "hard-water",
    name: "Hard Water (Calcium & Magnesium)",
    shortName: "Hard Water",
    category: "Minerals",
    riskLevel: "low",
    summary: "Hard water contains elevated calcium and magnesium minerals dissolved from geological formations. It is not a health risk — in fact, some evidence suggests minerals in water may benefit cardiovascular health. However, hardness causes scale buildup, shortens appliance lifespan, and creates skin and hair issues for many households.",
    definition: "Water hardness measures the concentration of dissolved calcium and magnesium ions, expressed in milligrams per liter (mg/L) as calcium carbonate (CaCO₃) or grains per gallon (GPG). Water above 120 mg/L is generally considered 'hard'; above 180 mg/L is 'very hard.'",
    whyCare: "Hard water is not a health hazard. However, it causes significant household and economic impacts: scale accumulation in pipes and water heaters (reducing efficiency and lifespan), soap scum, poor detergent performance, dry skin and hair, and spotty dishes and fixtures.",
    sources: ["Natural dissolution of limestone, chalk, and dolomite formations", "Dissolution of gypsum deposits", "Natural groundwater chemistry (universal in arid/semi-arid regions)"],
    whoIsAffected: "Residents in Arizona, Nevada, California (Southern), Texas, Colorado, and Florida — areas with naturally calcium-rich geology and limited rainfall to dilute mineral content.",
    healthEffects: ["Not a health hazard at normal hardness levels", "Some evidence suggests moderate hardness may benefit cardiovascular health", "Very soft water (low mineral content) can be more aggressive to plumbing and may leach lead more readily"],
    epaLimit: "No federal MCL. Secondary standards suggest aesthetic issues above 500 mg/L.",
    epaLimitNote: "The EPA sets no health-based MCL for hardness. Hardness above 500 mg/L triggers a secondary standard (aesthetic/taste), but this is rarely reached in U.S. water systems.",
    detection: "Simple home hardness test strips (reasonably accurate for consumer purposes). Lab analysis for precise levels. Many water utilities report hardness in their CCR.",
    treatments: ["water-softener"],
    wellWaterRelevant: true,
    affectedStates: ["arizona", "california", "florida", "texas", "nevada", "colorado"],
    faqs: [
      {
        question: "Is hard water safe to drink?",
        answer: "Yes. Hard water is safe to drink for the vast majority of people. There is no established health risk from drinking hard water within the range found in U.S. water systems. Some research suggests moderate water hardness may actually be beneficial.",
      },
      {
        question: "What is the best solution for very hard water?",
        answer: "A whole-home ion-exchange water softener (salt-based) is the gold standard for household hardness treatment. It replaces calcium and magnesium ions with sodium, dramatically reducing scale. Electronic descalers are a popular option but have limited peer-reviewed evidence of effectiveness. Template assisted crystallization (TAC) systems are an increasingly popular salt-free alternative.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
];

// ─── TREATMENT METHODS ─────────────────────────────────────────────────────────

export const treatmentMethods: TreatmentMethod[] = [
  {
    slug: "reverse-osmosis",
    name: "Reverse Osmosis (RO)",
    shortName: "Reverse Osmosis",
    type: "point-of-use",
    summary: "Reverse osmosis forces water through a semi-permeable membrane under pressure, blocking the vast majority of dissolved contaminants. It is the broadest-spectrum point-of-use treatment available for drinking water — effective against PFAS, lead, arsenic, nitrates, fluoride, and most dissolved solids.",
    description: "Reverse osmosis uses pressure to push water across a membrane with pores small enough (0.0001 microns) to block virtually all dissolved contaminants, including heavy metals, fluoride, nitrates, PFAS, microplastics, and dissolved salts. A complete RO system typically includes a sediment pre-filter, carbon pre-filter, RO membrane, carbon post-filter, and a storage tank. Under-sink systems are the most common residential installation.",
    solves: [
      "PFAS (90–99% reduction)",
      "Lead (95–99%)",
      "Arsenic (85–95%)",
      "Nitrates (85–95%)",
      "Fluoride (85–92%)",
      "Microplastics (effectively complete)",
      "Most dissolved solids (TDS)",
      "Radium and uranium",
      "Chlorine, chloramine, and disinfection byproducts",
    ],
    doesNotSolve: [
      "Some volatile organic compounds (VOCs) — a carbon post-filter addresses these",
      "Bacteria and viruses — only if an RO system includes UV or is used with properly disinfected water",
      "Dissolved gases (e.g., hydrogen sulfide taste/odor) — pre-treatment needed",
    ],
    bestFor: "Households with multiple contamination concerns, PFAS or arsenic, infants or immunocompromised individuals, or communities where source water safety is uncertain.",
    maintenance: "Sediment and carbon pre-filters: every 6–12 months. RO membrane: every 2–3 years. Post-filter: annually. Storage tank: inspect annually. Cost of replacement filters: $50–$150/year.",
    costRange: "$150–$600 for under-sink systems (installed). Countertop models $100–$300. Whole-home RO systems $1,000–$3,000+.",
    installationType: "Under-sink (most common for drinking water), countertop, or whole-home. Under-sink systems require a separate faucet at the sink.",
    contaminants: ["pfas", "lead", "arsenic", "nitrates", "disinfection-byproducts", "hard-water"],
    faqs: [
      {
        question: "Does reverse osmosis remove everything from water?",
        answer: "No filter removes 100% of everything. RO removes 90–99% of most dissolved contaminants. A few volatile organic compounds (VOCs) can pass through the membrane — these are addressed by the carbon post-filter included in most complete systems. Some dissolved minerals are also removed, leading to slightly more acidic water.",
      },
      {
        question: "Is RO water healthy to drink long-term?",
        answer: "Yes. The mineral loss from RO water (calcium, magnesium) is not nutritionally significant for people with balanced diets — you get far more minerals from food. However, very low-TDS water can taste flat to some people; a remineralization post-filter can address this if desired.",
      },
      {
        question: "How wasteful is reverse osmosis?",
        answer: "Traditional RO systems produce 3–5 gallons of wastewater per gallon of filtered water — a notable downside. Modern 'high-efficiency' or 'permeate pump' systems have improved this to a 1:1 or 2:1 ratio. This is worth considering in water-scarce regions.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "activated-carbon",
    name: "Activated Carbon Filtration",
    shortName: "Carbon Filter",
    type: "both",
    summary: "Activated carbon is the workhorse of home water filtration — effective for improving taste, removing chlorine and chloramine, and reducing many organic contaminants including some PFAS and DBPs. It does not remove heavy metals, nitrates, or fluoride unless specifically engineered for those purposes.",
    description: "Activated carbon filters work through adsorption: contaminants adhere to the surface of the porous carbon material. Granular activated carbon (GAC) is used in pitcher filters and whole-home units; carbon block (compressed carbon) is more effective per unit and used in under-sink and inline systems. Both forms are widely certified and tested.",
    solves: [
      "Chlorine and chloramine (taste/odor — highly effective)",
      "Trihalomethanes and haloacetic acids (DBPs)",
      "Volatile organic compounds (VOCs)",
      "Some PFAS compounds (certified block carbon)",
      "Pesticides and herbicides",
      "Hydrogen sulfide (rotten egg odor)",
      "General taste and odor improvement",
    ],
    doesNotSolve: [
      "Lead (only carbon blocks certified specifically to NSF/ANSI 53 for lead)",
      "Nitrates",
      "Fluoride",
      "Arsenic",
      "Heavy metals in general (without specific certification)",
      "Bacteria and viruses",
      "Dissolved salts and total dissolved solids",
    ],
    bestFor: "Households primarily concerned with chlorine taste/odor, DBPs, or VOCs. A good first-tier filter in well-treated systems with no heavy contaminant concerns. Also effective as pre- or post-treatment in combination with RO.",
    maintenance: "Pitcher filters: every 40–60 gallons (2 months for average household). Under-sink cartridges: every 6 months. Whole-home GAC: every 12 months. Critical: do not use expired filters — exhausted carbon can release adsorbed contaminants back into water.",
    costRange: "$20–$60 (pitcher filters, annual cartridge cost). Under-sink carbon block: $80–$300 installed, $30–$80/year in cartridges. Whole-home GAC: $400–$1,200 installed.",
    installationType: "Pitcher/countertop (most accessible), under-sink inline, whole-home (point-of-entry), or refrigerator-line inline.",
    contaminants: ["disinfection-byproducts", "pfas"],
    faqs: [
      {
        question: "Does my Brita remove lead?",
        answer: "Standard Brita pitchers use granular activated carbon which is NOT certified for lead removal. Brita's 'Longlast+' filter IS certified for lead reduction (NSF/ANSI 53). Always check the specific filter model's NSF certification — the brand name alone does not guarantee lead removal.",
      },
      {
        question: "How do I know when to replace my carbon filter?",
        answer: "Follow manufacturer replacement schedules — don't wait for taste changes. Once a carbon filter is saturated, it can release previously captured contaminants. For families with health concerns, err on the side of earlier replacement. Many under-sink systems include a filter-change indicator light.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "water-softener",
    name: "Ion Exchange Water Softener",
    shortName: "Water Softener",
    type: "point-of-entry",
    summary: "A whole-home salt-based water softener is the gold standard for treating hard water. It replaces calcium and magnesium ions with sodium, preventing scale buildup throughout the entire home's plumbing system. It does not address most health-based contaminants.",
    description: "Ion exchange water softeners pass water through a resin bed charged with sodium (or potassium) ions. Calcium and magnesium ions in the water swap places with sodium ions on the resin — leaving soft water. The resin is periodically regenerated by flushing with salt brine. Most systems install at the main water line (point-of-entry), treating all water in the home.",
    solves: [
      "Calcium and magnesium (hardness) — highly effective",
      "Some dissolved iron and manganese (at low concentrations)",
      "Scale formation in pipes, water heaters, and appliances",
      "Soap scum issues",
      "Dry skin and hair from hard water",
      "Spotty dishes and fixtures",
    ],
    doesNotSolve: [
      "PFAS",
      "Lead and other heavy metals",
      "Nitrates",
      "Bacteria and viruses",
      "Chlorine, DBPs, or organic contaminants",
      "Arsenic",
    ],
    bestFor: "Households in hard-water areas (Arizona, Southern California, Texas, Florida) with scale buildup in appliances, water heaters, and fixtures. Often paired with an under-sink RO or carbon filter for drinking water quality.",
    maintenance: "Salt refill every 1–3 months depending on water hardness and usage. Resin cleaning with iron-out cleaner annually if iron is present. System head service every 5–10 years. Salt cost: $50–$150/year.",
    costRange: "$400–$800 (unit cost). $800–$1,500 professionally installed. $50–$150/year ongoing salt cost.",
    installationType: "Whole-home point-of-entry, installed at the main water line before distribution throughout the house. Requires a drain connection for brine regeneration discharge.",
    contaminants: ["hard-water"],
    faqs: [
      {
        question: "Is softened water safe to drink?",
        answer: "Softened water is generally safe to drink. However, sodium-exchange softeners add a small amount of sodium to the water — typically 20–50 mg/L depending on hardness. This is not a concern for most people, but individuals on severely sodium-restricted diets or with hypertension may prefer a bypass line for drinking water or use a potassium-chloride salt alternative.",
      },
      {
        question: "Do I still need an RO filter if I have a water softener?",
        answer: "For drinking water safety, yes — a water softener only treats hardness. A softener does not remove PFAS, lead, arsenic, nitrates, or other health-based contaminants. Many homeowners with hard water install a water softener for the whole home plus an under-sink RO system for drinking and cooking water.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "uv-purification",
    name: "UV Ultraviolet Purification",
    shortName: "UV Purification",
    type: "point-of-use",
    summary: "UV purification uses ultraviolet light to destroy the DNA of bacteria, viruses, and protozoa in water, rendering them unable to reproduce. It is highly effective for microbial disinfection but does nothing to address chemical contaminants, heavy metals, or dissolved solids.",
    description: "UV water purifiers expose water to UV-C light (typically 254 nm wavelength) as it flows through a chamber. At the correct dosage (typically 40 mJ/cm²), UV radiation is lethal to bacteria, viruses, Giardia, Cryptosporidium, and other pathogens. It does not alter water chemistry, add anything to the water, or remove dissolved contaminants.",
    solves: [
      "Bacteria (E. coli, coliform, Salmonella, etc.) — highly effective",
      "Viruses (99.99% reduction at proper dosage)",
      "Giardia and Cryptosporidium (protozoa)",
      "Algae",
    ],
    doesNotSolve: [
      "Chemical contaminants (PFAS, lead, nitrates, arsenic, DBPs)",
      "Heavy metals",
      "Hardness",
      "Turbidity or sediment (turbidity must be <1 NTU for effective UV treatment)",
      "Taste and odor issues",
    ],
    bestFor: "Private well water users concerned about bacterial contamination; households in areas with aging distribution systems; post-flood water treatment; travel or remote water use. Most effective when combined with carbon filtration.",
    maintenance: "UV lamp replacement annually (lamp output degrades even if still lit). Quartz sleeve cleaning every 3–6 months. Sleeve replacement every 2–3 years. Lamp cost: $30–$80/year.",
    costRange: "$100–$300 (point-of-use counter/under-sink). $500–$1,500 (whole-home point-of-entry systems). $30–$80/year lamp replacement.",
    installationType: "Under-sink (inline) for drinking water, or whole-home point-of-entry. Must be installed after particle/turbidity removal (sediment pre-filter required).",
    contaminants: [],
    faqs: [
      {
        question: "Can I use UV purification as my only water treatment?",
        answer: "Only if your water concern is exclusively microbial (bacteria/viruses) and your source water is otherwise clean and clear. Most households with chemical contamination concerns (PFAS, lead, nitrates) need carbon or RO filtration in addition to UV. UV is best used as a component of a multi-stage system.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    slug: "whole-home-filtration",
    name: "Whole-Home Filtration System",
    shortName: "Whole-Home Filter",
    type: "point-of-entry",
    summary: "Whole-home filtration systems treat all water entering the home, addressing taste, odor, sediment, and sometimes chemical concerns at every tap. Performance varies enormously by system type and certification — the term 'whole-home filter' is not standardized.",
    description: "Whole-home (point-of-entry or POE) filtration systems install at the main water line and treat all water distributed throughout the home. A typical system includes a sediment pre-filter plus a GAC (granular activated carbon) or carbon block stage. Some systems add additional stages (catalytic carbon for chloramine, KDF media for heavy metals, softening resin). Performance is entirely dependent on the specific stages included.",
    solves: [
      "Sediment, turbidity, and particulates",
      "Chlorine and chloramine taste/odor (with appropriate carbon stage)",
      "Some VOCs and organic contaminants",
      "Some DBPs (with appropriate carbon)",
      "Depends heavily on specific media types included",
    ],
    doesNotSolve: [
      "PFAS (unless system is specifically rated and certified for PFAS removal)",
      "Lead and heavy metals (unless KDF or catalytic carbon stage is included and certified)",
      "Nitrates",
      "Bacteria and viruses (unless UV stage is included)",
      "Hardness (unless softening stage included)",
    ],
    bestFor: "Households wanting system-wide sediment and chlorine removal; rural well users needing basic protection; homes with seasonal particulate issues; as a foundation layer paired with under-sink RO for drinking water.",
    maintenance: "Varies by system. Sediment pre-filters: every 3–6 months. Carbon stages: every 6–12 months. Full system service: annually. Filter cost: $100–$400/year depending on system complexity.",
    costRange: "$300–$800 (basic 2-stage systems). $800–$2,500 (multi-stage or specialty systems). Installation: $200–$600. Annual filter cost: $100–$400.",
    installationType: "Point-of-entry (whole home). Installed at main water supply line, typically in utility room or garage.",
    contaminants: ["disinfection-byproducts"],
    faqs: [
      {
        question: "Is a whole-home filter enough, or do I also need an under-sink filter?",
        answer: "It depends on your contaminants. A whole-home carbon system handles chlorine, taste, and sediment system-wide. For PFAS, lead, nitrates, or arsenic, you also need an under-sink reverse osmosis filter for drinking and cooking water — because a typical whole-home carbon filter does not address these contaminants effectively.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
];

// ─── CITIES ────────────────────────────────────────────────────────────────────

export const cities: City[] = [
  {
    slug: "los-angeles",
    name: "Los Angeles",
    state: "california",
    stateAbbr: "CA",
    population: 3900000,
    utilities: ["los-angeles-department-of-water-and-power"],
    topContaminants: ["pfas", "disinfection-byproducts", "lead"],
    summary: "Los Angeles is served primarily by the Los Angeles Department of Water and Power (LA DWP), one of the largest municipal utilities in the country. Water quality is generally rated low-concern, with PFAS and mild DBPs as the primary monitored contaminants.",
    serviceNote: "Most of Los Angeles is served by LA DWP. However, some neighborhoods near city boundaries (Burbank, Glendale, San Fernando) are served by separate utilities. Your water bill is the most reliable confirmation of your provider.",
    faqs: [
      {
        question: "Who provides water to Los Angeles?",
        answer: "The Los Angeles Department of Water and Power (LA DWP) serves most of the city. Some adjacent areas are served by Metropolitan Water District member agencies, Las Virgenes Municipal Water District (Calabasas area), or the cities of Beverly Hills, Culver City, Burbank, and Glendale — all independent utilities.",
      },
      {
        question: "Is Los Angeles water hard or soft?",
        answer: "LA water is moderately hard, typically ranging from 100–180 mg/L depending on the source blend at your specific distribution zone. Imported Colorado River water is harder than water from the local Owens Valley Aqueduct. A whole-home water softener or a simple under-sink filter can address hardness concerns.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "houston",
    name: "Houston",
    state: "texas",
    stateAbbr: "TX",
    population: 2300000,
    utilities: ["houston-water"],
    topContaminants: ["disinfection-byproducts", "lead"],
    summary: "Houston is served by one of the largest surface-water utilities in Texas. Water quality has improved substantially since the addition of granular activated carbon treatment, but disinfection byproducts remain elevated compared to best-in-class systems due to high organic content in source reservoirs.",
    serviceNote: "Houston Water serves the incorporated city. Adjacent municipalities (Sugar Land, Katy, The Woodlands, Pearland) operate their own utilities or are served by Fort Bend County water suppliers.",
    faqs: [
      {
        question: "Why does Houston's water sometimes smell or taste unusual?",
        answer: "Houston's water is drawn from surface reservoirs that have naturally high organic content, particularly algae. During warm months, algal blooms can produce geosmin and 2-methylisoborneol (MIB) — compounds that cause earthy or musty odors at extremely low concentrations. These compounds are not harmful but are detectable at very low thresholds. An activated carbon pitcher filter effectively removes these tastes and odors.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    slug: "phoenix",
    name: "Phoenix",
    state: "arizona",
    stateAbbr: "AZ",
    population: 1600000,
    utilities: ["phoenix-water-services"],
    topContaminants: ["pfas", "arsenic", "hard-water"],
    summary: "Phoenix is served by the City of Phoenix Water Services Department, which draws from the Colorado River and local rivers. Phoenix water is notably hard (around 220 mg/L) and PFAS has been detected above the new EPA limit at some source points, with the utility actively implementing treatment upgrades.",
    serviceNote: "Phoenix Water serves the city limits. Scottsdale, Tempe, Mesa, Chandler, and other Valley cities maintain separate water utilities.",
    faqs: [
      {
        question: "Does Phoenix have PFAS in its water?",
        answer: "Yes. PFAS has been detected in some Phoenix Water source wells at levels above the EPA's new 4 ppt MCL (effective 2024). Phoenix Water is currently implementing treatment upgrades (granular activated carbon and ion exchange resin) at affected wellfields. Delivered water is currently blended to meet the MCL, but households with infants or elevated health concerns may want to use a certified RO filter for drinking water.",
      },
    ],
    lastUpdated: "2025-01-12",
  },
  {
    slug: "miami",
    name: "Miami",
    state: "florida",
    stateAbbr: "FL",
    population: 450000,
    utilities: ["miami-dade-water-and-sewer"],
    topContaminants: ["disinfection-byproducts", "hard-water"],
    summary: "Miami is primarily served by Miami-Dade Water and Sewer Department, which draws from the Biscayne Aquifer. Water quality is generally rated low-concern. The main household concerns are moderate hardness and mild chloramine taste.",
    serviceNote: "Miami-Dade WASD serves Miami, Coral Gables, and most county municipalities. The City of Miami Beach is served separately by WASD under contract. Hialeah has its own system.",
    faqs: [
      {
        question: "Why is Miami water hard?",
        answer: "Miami's water comes from the Biscayne Aquifer, a shallow limestone formation. Water dissolves calcium carbonate as it moves through limestone, resulting in moderate hardness (~150 mg/L as CaCO₃). WASD softens the water at treatment plants, but residual hardness remains in delivered water.",
      },
    ],
    lastUpdated: "2025-01-08",
  },
];

// ─── ZIP → UTILITY MAP ─────────────────────────────────────────────────────────

export const zipUtilityMatches: ZipUtilityMatch[] = [
  { zip: "90001", utilitySlug: "los-angeles-department-of-water-and-power", confidence: "high" },
  { zip: "90210", utilitySlug: "los-angeles-department-of-water-and-power", confidence: "medium" },
  { zip: "90024", utilitySlug: "los-angeles-department-of-water-and-power", confidence: "high" },
  { zip: "77001", utilitySlug: "houston-water", confidence: "high" },
  { zip: "77002", utilitySlug: "houston-water", confidence: "high" },
  { zip: "77019", utilitySlug: "houston-water", confidence: "high" },
  { zip: "33101", utilitySlug: "miami-dade-water-and-sewer", confidence: "high" },
  { zip: "33130", utilitySlug: "miami-dade-water-and-sewer", confidence: "high" },
  { zip: "85001", utilitySlug: "phoenix-water-services", confidence: "high" },
  { zip: "85016", utilitySlug: "phoenix-water-services", confidence: "high" },
  { zip: "43201", utilitySlug: "columbus-division-of-water", confidence: "high" },
  { zip: "43215", utilitySlug: "columbus-division-of-water", confidence: "high" },
];

// ─── HELPER FUNCTIONS ──────────────────────────────────────────────────────────

export function getStateBySlug(slug: string): State | undefined {
  return states.find(s => s.slug === slug);
}

export function getUtilityBySlug(slug: string): Utility | undefined {
  return utilities.find(u => u.slug === slug);
}

export function getContaminantBySlug(slug: string): Contaminant | undefined {
  return contaminants.find(c => c.slug === slug);
}

export function getTreatmentBySlug(slug: string): TreatmentMethod | undefined {
  return treatmentMethods.find(t => t.slug === slug);
}

export function getCityBySlug(slug: string): City | undefined {
  return cities.find(c => c.slug === slug);
}

export function getUtilitiesByState(stateSlug: string): Utility[] {
  return utilities.filter(u => u.state === stateSlug);
}

export function lookupByZip(zip: string): ZipUtilityMatch | undefined {
  return zipUtilityMatches.find(z => z.zip === zip);
}

// ─── LABS ──────────────────────────────────────────────────────────────────────

export const labs: Lab[] = [
  {
    slug: "national-testing-laboratories-ca",
    name: "National Testing Laboratories (CA)",
    state: "california",
    certifications: ["California ELAP", "EPA-approved"],
    testsOffered: ["PFAS (EPA 533/537.1)", "Lead & Copper", "Nitrates", "Arsenic", "Full panel"],
    serviceArea: "California statewide, mail-in nationwide",
    website: "https://www.ntllabs.com",
    lastUpdated: "2025-01-01",
  },
  {
    slug: "clean-water-testing-ca",
    name: "Clean Water Testing (Los Angeles)",
    state: "california",
    certifications: ["California ELAP", "AIHA-LAP"],
    testsOffered: ["Bacteria & coliform", "Heavy metals", "PFAS", "Pesticides", "General chemistry"],
    serviceArea: "Southern California; mail-in available",
    website: "https://www.cleanwatertesting.com",
    lastUpdated: "2025-01-01",
  },
  {
    slug: "pace-analytical-tx",
    name: "Pace Analytical (Houston)",
    state: "texas",
    certifications: ["TCEQ certified", "EPA-approved", "NELAP"],
    testsOffered: ["Full SDWA panel", "PFAS", "Radionuclides", "Lead", "Nitrates", "VOCs"],
    serviceArea: "Texas statewide; national mail-in",
    website: "https://www.pacelabs.com",
    lastUpdated: "2025-01-01",
  },
  {
    slug: "environmental-testing-solutions-tx",
    name: "Environmental Testing Solutions (Austin)",
    state: "texas",
    certifications: ["TCEQ certified", "NELAP accredited"],
    testsOffered: ["Well water basic panel", "Arsenic", "Nitrates", "Coliform", "Hardness"],
    serviceArea: "Central Texas; mail-in statewide",
    website: "#",
    lastUpdated: "2025-01-01",
  },
  {
    slug: "florida-dept-health-certified-lab",
    name: "Florida DOH Certified Labs Network",
    state: "florida",
    certifications: ["Florida NELAP certified"],
    testsOffered: ["PFAS", "Lead", "Coliform", "Nitrates", "Hardness", "Full panel"],
    serviceArea: "Statewide via certified lab locator",
    website: "https://www.floridahealth.gov/environmental-health/drinking-water/",
    lastUpdated: "2025-01-01",
  },
  {
    slug: "desert-analytical-az",
    name: "Desert Analytical & Consulting (Phoenix)",
    state: "arizona",
    certifications: ["ADEQ certified", "NELAP accredited"],
    testsOffered: ["Arsenic", "PFAS", "Hardness", "Radionuclides", "Full drinking water panel"],
    serviceArea: "Arizona statewide",
    website: "#",
    lastUpdated: "2025-01-01",
  },
  {
    slug: "ohio-epa-certified-labs",
    name: "Ohio EPA Certified Labs Network",
    state: "ohio",
    certifications: ["Ohio EPA certified", "NELAP"],
    testsOffered: ["Lead & Copper", "PFAS", "Nitrates", "Coliform", "Full panel"],
    serviceArea: "Ohio statewide via certified lab locator",
    website: "https://epa.ohio.gov/divisions-and-offices/drinking-and-ground-waters/lab-certification",
    lastUpdated: "2025-01-01",
  },
  {
    slug: "aegion-water-testing-oh",
    name: "Eurofins TestAmerica (Columbus)",
    state: "ohio",
    certifications: ["Ohio EPA certified", "NELAP", "A2LA accredited"],
    testsOffered: ["PFAS (EPA 537.1/533)", "Lead & Copper", "VOCs", "Nitrates", "Full SDWA panel"],
    serviceArea: "Ohio and Midwest; national mail-in",
    website: "https://www.testamericainc.com",
    lastUpdated: "2025-01-01",
  },
];

export function getLabsByState(stateSlug: string): Lab[] {
  return labs.filter(l => l.state === stateSlug);
}

// ─── WELL WATER GUIDES ─────────────────────────────────────────────────────────

export interface WellWaterGuide {
  stateSlug: string;
  stateName: string;
  stateAbbr: string;
  summary: string;
  annualTestingGuidance: string;
  whatToTestFor: string[];
  commonRisks: string[];
  stateLabProgram: string;
  stateLabUrl: string;
  epaGuidanceUrl: string;
  faqs: import("./types").FAQ[];
  lastUpdated: string;
}

export const wellWaterGuides: WellWaterGuide[] = [
  {
    stateSlug: "california",
    stateName: "California",
    stateAbbr: "CA",
    summary: "Approximately 15% of Californians rely on private wells. Unlike public water systems, private wells are not regulated by the California State Water Resources Control Board — testing and treatment are the homeowner's responsibility. Arsenic, nitrates (from agricultural runoff), and coliform bacteria are the most common well-water concerns in California.",
    annualTestingGuidance: "California Department of Public Health recommends annual testing for coliform bacteria and nitrates at minimum. Arsenic testing is strongly recommended in rural areas of the San Joaquin Valley, Southern California desert regions, and parts of the Bay Area. Test after any flooding, new construction nearby, or changes in water taste/odor.",
    whatToTestFor: [
      "Coliform bacteria (annual — primary health concern)",
      "Nitrates (annual — especially in agricultural areas)",
      "Arsenic (every 3–5 years, or immediately if in high-risk area)",
      "pH and hardness (for equipment and plumbing health)",
      "PFAS if near military bases, airports, or industrial sites",
      "Manganese and iron (for water quality)",
      "Total Dissolved Solids (TDS)",
    ],
    commonRisks: [
      "Agricultural nitrate runoff (San Joaquin Valley, Salinas Valley)",
      "Naturally occurring arsenic (desert regions, volcanic geology)",
      "PFAS from military base contamination plumes",
      "Iron bacteria causing taste/odor issues",
      "Hard water in arid regions",
    ],
    stateLabProgram: "California Environmental Laboratory Accreditation Program (ELAP)",
    stateLabUrl: "https://www.waterboards.ca.gov/drinking_water/certlic/labs/",
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    faqs: [
      {
        question: "Is my California private well regulated?",
        answer: "No. Private domestic wells in California are exempt from state drinking water regulations that apply to public systems. You are responsible for your own well's testing and maintenance. County environmental health departments may provide guidance and some offer low-cost testing programs.",
      },
      {
        question: "How often should I test my California well water?",
        answer: "At minimum: annually for coliform bacteria and nitrates. Every 3–5 years for a broader panel including arsenic, metals, and organic chemicals. Immediately after: flooding, nearby construction, changes in taste/color/odor, or if a neighbor's well is contaminated.",
      },
      {
        question: "Where can I find a certified lab in California?",
        answer: "Use the California ELAP certified lab search at waterboards.ca.gov. Many labs offer mail-in sampling kits. For general well screening, a basic bacteria + nitrates + metals panel typically costs $100–$300 depending on the lab.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    stateSlug: "texas",
    stateName: "Texas",
    stateAbbr: "TX",
    summary: "Texas has more private well users than almost any other state — an estimated 2 million Texans rely on private groundwater. The geology varies dramatically: naturally occurring arsenic and radium are elevated in some aquifers (especially the Ogallala and Trinity), while nitrate contamination from agriculture and livestock is a statewide concern in rural areas.",
    annualTestingGuidance: "Texas A&M AgriLife Extension and TCEQ recommend annual testing for coliform bacteria and nitrates as a baseline. Radionuclide testing (radium-226/228, uranium) is recommended for wells in Central Texas and the High Plains. Arsenic testing is recommended for wells in West Texas and areas relying on the Ogallala or Bone Spring-Victorio Aquifer.",
    whatToTestFor: [
      "Coliform bacteria (annual)",
      "Nitrates (annual — widespread agricultural risk)",
      "Arsenic (initial screen; retest every 5 years)",
      "Radionuclides — radium, uranium (Central Texas, High Plains)",
      "Fluoride (naturally elevated in some Texas aquifers)",
      "PFAS if near military installations (Killeen, San Antonio area)",
      "Hardness and TDS",
    ],
    commonRisks: [
      "Naturally occurring arsenic (West Texas, Edwards Aquifer System)",
      "Radium and uranium (Central Texas karst geology)",
      "Nitrate contamination from livestock and crop agriculture",
      "Fluoride in some Central and South Texas aquifers",
      "PFAS near military bases (Fort Hood, Joint Base San Antonio)",
    ],
    stateLabProgram: "Texas Commission on Environmental Quality (TCEQ) Certified Laboratory Program",
    stateLabUrl: "https://www.tceq.texas.gov/agency/water_main.html",
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    faqs: [
      {
        question: "Is arsenic a problem in Texas well water?",
        answer: "Yes, in specific areas. West Texas and parts of the Hill Country have naturally elevated arsenic in groundwater due to geological formations. If your well is in one of these areas and you have never tested for arsenic, testing is strongly recommended. A reverse osmosis filter certified to NSF/ANSI 58 is effective for arsenic reduction if levels are elevated.",
      },
      {
        question: "Does Texas offer free or low-cost well testing?",
        answer: "Texas A&M AgriLife Extension offers water testing through county offices, often at reduced cost. Some county health departments also have programs. TCEQ does not directly test private wells but maintains a list of certified commercial laboratories.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    stateSlug: "florida",
    stateName: "Florida",
    stateAbbr: "FL",
    summary: "Florida's private well users draw primarily from shallow unconfined aquifers, particularly the Surficial and Floridan Aquifer Systems. The shallow depth of many Florida wells makes them susceptible to contamination from surface sources: septic systems, agricultural chemicals, and saltwater intrusion in coastal areas.",
    annualTestingGuidance: "Florida Department of Health recommends annual testing for coliform bacteria and nitrates. For coastal or low-lying areas, saltwater intrusion (chlorides, conductivity) should be tested periodically. PFAS testing is recommended near military installations (Tyndall AFB, NAS Jacksonville, MacDill AFB).",
    whatToTestFor: [
      "Coliform bacteria (annual)",
      "Nitrates (annual — especially near agricultural areas)",
      "Saltwater intrusion: chlorides, conductivity (coastal wells, annually)",
      "Arsenic (initial screen)",
      "PFAS (if near military installations)",
      "Hardness and pH (Florida aquifer water is often hard and acidic)",
      "Radon (elevated in north and central Florida)",
    ],
    commonRisks: [
      "Saltwater intrusion in coastal areas (Miami-Dade, Broward, coastal counties)",
      "Septic system contamination (nitrates, bacteria)",
      "PFAS from military bases (NAS Jacksonville, Tyndall AFB, MacDill AFB)",
      "Radon from phosphate-rich geology in central Florida",
      "Agricultural chemical runoff (Lake Okeechobee watershed)",
    ],
    stateLabProgram: "Florida Department of Health — NELAP Certified Laboratories",
    stateLabUrl: "https://www.floridahealth.gov/environmental-health/drinking-water/",
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    faqs: [
      {
        question: "Is saltwater intrusion a risk to my Florida well?",
        answer: "If your well is in a coastal county (Miami-Dade, Broward, Collier, Sarasota, etc.), saltwater intrusion is a real and growing risk due to sea-level rise and aquifer overdrawing. Signs include salty or brackish taste. Testing for chlorides and conductivity annually is recommended. Reverse osmosis is the primary treatment for saltwater-affected well water.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
  {
    stateSlug: "arizona",
    stateName: "Arizona",
    stateAbbr: "AZ",
    summary: "Arizona's private well users rely almost entirely on groundwater. The arid climate means shallow wells are common, and naturally occurring contaminants — arsenic, uranium, fluoride, and hard water — are widespread concerns. Arizona does regulate private wells for construction standards, but water quality testing remains the owner's responsibility.",
    annualTestingGuidance: "ADEQ recommends annual coliform and nitrate testing as a baseline. Arsenic testing is critical for wells in rural areas, particularly the Phoenix Basin, Prescott area, and southern Arizona mining regions. Uranium and fluoride testing is recommended in Holbrook Basin and parts of northern Arizona.",
    whatToTestFor: [
      "Coliform bacteria (annual)",
      "Arsenic (critical — test immediately if not done recently)",
      "Nitrates (annual)",
      "Uranium (northern Arizona, Holbrook Basin)",
      "Fluoride (naturally elevated in some Arizona aquifers)",
      "PFAS (near Phoenix-area military installations, Luke AFB)",
      "Hardness (virtually all Arizona groundwater is hard to very hard)",
      "Total Dissolved Solids (TDS)",
    ],
    commonRisks: [
      "Naturally occurring arsenic (statewide, especially Phoenix Basin and southern AZ)",
      "Uranium from geological formations (northern Arizona)",
      "PFAS contamination from Luke AFB and other military sites",
      "Very hard water (calcium/magnesium from limestone)",
      "Fluoride in some Northern Arizona aquifers",
    ],
    stateLabProgram: "Arizona Department of Environmental Quality (ADEQ) Certified Laboratory Program",
    stateLabUrl: "https://www.azdeq.gov/environ/water/dw/lab_certification.html",
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    faqs: [
      {
        question: "Is arsenic testing really necessary for Arizona wells?",
        answer: "Yes — this is probably the most important test for Arizona private well owners. Arizona has some of the highest naturally occurring groundwater arsenic levels in the U.S., particularly in the Phoenix Basin, Prescott area, and southeastern mining regions. Arsenic is a confirmed carcinogen, causes no taste or odor, and is undetectable without testing. If you've never tested your well for arsenic, do so immediately.",
      },
    ],
    lastUpdated: "2025-01-12",
  },
  {
    stateSlug: "ohio",
    stateName: "Ohio",
    stateAbbr: "OH",
    summary: "Ohio has an estimated 800,000+ private wells, primarily in rural areas of the state. Nitrate contamination from agricultural runoff is the most widespread concern. Lead contamination from older well casings and household plumbing is a secondary issue. Some areas near industrial sites have documented PFAS impacts to private groundwater.",
    annualTestingGuidance: "Ohio Department of Health recommends annual coliform bacteria and nitrate testing for all private wells. Lead testing is recommended for any home with pre-1986 plumbing or if children under 6 or pregnant women are in the household. PFAS testing is recommended for wells near known contamination sites (Dayton area, southeastern Ohio).",
    whatToTestFor: [
      "Coliform bacteria (annual)",
      "Nitrates (annual — widespread agricultural concern)",
      "Lead (especially homes with pre-1986 plumbing or old well casings)",
      "PFAS (near industrial sites, Dayton area, Wright-Patterson AFB)",
      "Iron and manganese (common in Ohio groundwater, aesthetic issue)",
      "Hardness",
      "pH",
    ],
    commonRisks: [
      "Nitrate contamination from row-crop agriculture (northwest Ohio)",
      "PFAS from industrial sites and Wright-Patterson AFB (Dayton area)",
      "Lead from old well casings or household plumbing",
      "Iron and manganese causing taste/odor and staining",
      "Coliform from aging septic systems near wells",
    ],
    stateLabProgram: "Ohio EPA Certified Laboratory Program",
    stateLabUrl: "https://epa.ohio.gov/divisions-and-offices/drinking-and-ground-waters/lab-certification",
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    faqs: [
      {
        question: "How close can a septic system be to a well in Ohio?",
        answer: "Ohio law requires a minimum setback of 50 feet between a septic system and a private well, though many counties have stricter local rules. Older properties may not meet current standards. If your well and septic are close, annual coliform testing is especially important. A well inspection by a licensed driller can identify contamination risks.",
      },
      {
        question: "Is PFAS a concern for Ohio private wells?",
        answer: "In specific areas, yes. Ohio has documented PFAS groundwater contamination near Wright-Patterson Air Force Base (Dayton area), several industrial sites in northeast Ohio, and some former firefighting training facilities. If your well is within 5 miles of a military base, industrial park, or airport, PFAS testing is recommended.",
      },
    ],
    lastUpdated: "2025-01-10",
  },
];
