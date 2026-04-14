export interface Contaminant {
  slug: string;
  name: string;
  shortName: string;
  category: string;
  riskLevel: "safe" | "low" | "moderate" | "high" | "critical";
  summary: string;
  definition: string;
  whyCare: string;
  whoIsAffected: string;
  healthEffects: string[];
  sources: string[];
  epaLimit: string;
  epaLimitNote: string;
  detection: string;
  treatments: string[];
  affectedStates: string[];
  wellWaterRelevant: boolean;
  faqs: { question: string; answer: string }[];
  lastUpdated: string;
}

const contaminants: Contaminant[] = [
  {
    slug: "pfas",
    name: "Per- and Polyfluoroalkyl Substances (PFAS)",
    shortName: "PFAS",
    category: "Synthetic Chemicals",
    riskLevel: "high",
    summary: "PFAS are a group of thousands of man-made chemicals that have been used in industrial and consumer products since the 1940s. They do not break down in the environment or the human body, earning the name 'forever chemicals.' In April 2024, the EPA set the first-ever federal limits for six PFAS compounds in drinking water.",
    definition: "Per- and polyfluoroalkyl substances (PFAS) are a class of over 12,000 synthetic chemicals characterized by strong carbon-fluorine bonds that resist degradation. The two most studied — PFOA (perfluorooctanoic acid) and PFOS (perfluorooctane sulfonic acid) — have been phased out of U.S. manufacturing but persist widely in the environment.",
    whyCare: "PFAS contamination affects an estimated 200 million Americans' drinking water. Because they accumulate in the body over time, even low-level chronic exposure is associated with serious health outcomes including cancer, immune system disruption, and hormonal effects.",
    whoIsAffected: "People near military bases (which used PFAS-containing firefighting foam), industrial sites, and communities that have received contaminated biosolid fertilizer face the highest exposure. Infants, pregnant women, and people with compromised immune systems are most vulnerable.",
    healthEffects: [
      "Increased risk of kidney and testicular cancer",
      "Thyroid disease and hormonal disruption",
      "Immune system suppression — reduced vaccine effectiveness",
      "High cholesterol and cardiovascular effects",
      "Developmental delays and low birth weight in infants",
      "Liver damage at high exposure levels",
    ],
    sources: [
      "Industrial manufacturing facilities (chemical plants, refineries)",
      "Military bases and airports using AFFF firefighting foam",
      "Non-stick cookware and food packaging manufacturing",
      "Stain-resistant fabric and carpet treatments",
      "Landfill leachate from consumer product disposal",
      "Biosolid (sewage sludge) land application on farmland",
    ],
    epaLimit: "4 ppt",
    epaLimitNote: "In April 2024, the EPA finalized the first federal Maximum Contaminant Levels (MCLs) for PFAS: 4 parts per trillion (ppt) each for PFOA and PFOS individually; 10 ppt for PFNA, PFHxS, and HFPO-DA; and a Hazard Index for mixtures. Water systems must comply by 2029. The MCL goal (MCLG) for PFOA and PFOS is zero.",
    detection: "PFAS are detected through EPA Method 533 or Method 537.1 laboratory analysis. The EPA requires public water systems serving 10,000+ people to test for PFAS under the Fifth Unregulated Contaminant Monitoring Rule (UCMR 5). Check your annual Consumer Confidence Report (CCR) or contact your utility for test results.",
    treatments: ["reverse-osmosis", "activated-carbon"],
    affectedStates: ["california", "texas", "florida", "arizona", "ohio"],
    wellWaterRelevant: true,
    faqs: [
      {
        question: "Is PFAS in my tap water?",
        answer: "Possibly. The EPA's UCMR 5 monitoring found PFAS in approximately 45% of U.S. tap water samples. The best way to know for certain is to check your utility's Consumer Confidence Report (CCR), search the EPA's PFAS Analytical Tools database, or order a certified lab test for your specific address.",
      },
      {
        question: "What water filter removes PFAS?",
        answer: "Reverse osmosis (RO) systems are the most effective, removing 90–99% of PFAS compounds. Activated carbon filters certified to NSF/ANSI Standard 58 also provide significant reduction. Standard pitcher filters, sediment filters, and water softeners do NOT remove PFAS.",
      },
      {
        question: "What is the EPA's new PFAS drinking water limit?",
        answer: "In April 2024, the EPA set MCLs of 4 parts per trillion (ppt) for PFOA and PFOS — the two most studied PFAS compounds. This is the first federal legal limit for any PFAS in drinking water. Water systems have until 2029 to comply.",
      },
      {
        question: "Are PFAS only in public water systems?",
        answer: "No. Private wells can also be contaminated, especially near military bases, airports, or industrial sites. Unlike public water systems, private wells are not regulated by the EPA and are not required to be tested. If you have a private well near a known contamination site, testing is strongly recommended.",
      },
      {
        question: "How do PFAS get into drinking water?",
        answer: "PFAS enter water supplies primarily through industrial discharge, firefighting foam use at military bases and airports, leaching from manufacturing facilities, and runoff from land treated with PFAS-contaminated biosolids. They are highly mobile in groundwater and surface water.",
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
    summary: "Lead enters drinking water primarily through corrosion of lead service lines and lead-containing plumbing fixtures — not typically from the water source itself. There is no safe level of lead exposure for children. The EPA is revising its Lead and Copper Rule to eliminate lead service lines nationwide by 2037.",
    definition: "Lead is a naturally occurring heavy metal that was widely used in plumbing infrastructure until it was banned for new installations in 1986. An estimated 9.2 million lead service lines still connect homes to public water mains across the United States, along with millions of homes with lead solder in their internal plumbing.",
    whyCare: "Lead exposure causes irreversible neurological damage in children, with no threshold below which effects are absent. The Flint, Michigan crisis (2014–2019) demonstrated how quickly lead contamination can escalate when corrosion control is inadequate.",
    whoIsAffected: "Children under 6 and pregnant women face the greatest risk. Homes built before 1986 are most likely to have lead plumbing. Renters and low-income households in older urban housing stock face disproportionate exposure.",
    healthEffects: [
      "Permanent cognitive and behavioral impairment in children",
      "Reduced IQ and learning disabilities",
      "Hyperactivity and attention problems",
      "Slowed growth and developmental delays",
      "High blood pressure and kidney disease in adults",
      "Miscarriage and premature birth risk during pregnancy",
    ],
    sources: [
      "Lead service lines connecting street main to the home",
      "Lead solder in household plumbing (pre-1986 construction)",
      "Brass faucets and fixtures with lead content",
      "Lead-lined storage tanks in older buildings",
      "Corrosive water chemistry that dissolves lead from pipes",
    ],
    epaLimit: "15 ppb (action level)",
    epaLimitNote: "The EPA's Lead and Copper Rule sets an Action Level of 15 parts per billion (ppb) — if more than 10% of tap samples exceed this, utilities must take corrective action. The Maximum Contaminant Level Goal (MCLG) is zero, meaning no level of lead is considered safe. The 2024 Lead and Copper Rule Improvements require utilities to replace all lead service lines within 10 years.",
    detection: "Lead testing requires a 'first draw' sample — water that has sat in pipes for at least 6 hours. Testing kits are available from certified labs. Many utilities offer free testing for residents. Because lead contamination is highly localized (it depends on your specific pipes, not just the source water), individual testing is more meaningful than utility-wide results.",
    treatments: ["reverse-osmosis", "activated-carbon"],
    affectedStates: ["california", "texas", "florida", "arizona", "ohio"],
    wellWaterRelevant: false,
    faqs: [
      {
        question: "Does my city's water contain lead?",
        answer: "Utility-level testing may show low or no lead at the treatment plant, but lead can still leach into your water from your home's plumbing or the service line connecting your home to the street. The only way to know your personal exposure is to test your tap water directly.",
      },
      {
        question: "What removes lead from tap water?",
        answer: "Reverse osmosis (RO) systems and NSF/ANSI 53-certified activated carbon filters are both effective at removing lead. Look specifically for the NSF/ANSI 53 certification for lead reduction — not all carbon filters are certified for lead. Simple pitcher filters must be certified for lead specifically.",
      },
      {
        question: "How do I reduce lead exposure while waiting for a filter?",
        answer: "Flush your tap for 30–60 seconds before using water for drinking or cooking, especially after water has sat overnight. Use cold water only (hot water leaches more lead). This doesn't eliminate lead but reduces your exposure.",
      },
      {
        question: "Does my home have a lead service line?",
        answer: "Homes built before 1986 are most likely to have lead service lines or lead solder. Many utilities now offer lead service line replacement programs. Contact your water utility to request a service line material record or schedule an inspection.",
      },
      {
        question: "Is lead in well water a concern?",
        answer: "Lead is rarely found in groundwater naturally. Well water lead exposure almost always comes from lead in the well pump, pressure tank, or household plumbing — not the aquifer. Testing your well water is still recommended if you have older plumbing.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "nitrates",
    name: "Nitrates in Drinking Water",
    shortName: "Nitrates",
    category: "Agricultural Chemicals",
    riskLevel: "moderate",
    summary: "Nitrates are colorless, odorless compounds that occur naturally in soil but reach dangerous levels in water primarily from agricultural fertilizer runoff and septic system leakage. They pose a serious risk to infants under 6 months, who can develop methemoglobinemia (blue baby syndrome). The EPA MCL is 10 mg/L as nitrogen.",
    definition: "Nitrate (NO₃⁻) is a nitrogen-containing compound that forms naturally through the decomposition of organic matter. At elevated concentrations — almost always from human activity — nitrate interferes with the blood's ability to carry oxygen. The United States produces over 23 million tons of nitrogen fertilizer annually, making agricultural runoff the dominant source of nitrate contamination.",
    whyCare: "Nitrate is the most widespread agricultural contaminant in U.S. groundwater. The USGS estimates that 4% of private wells exceed the EPA limit, with much higher rates in agricultural regions of the Midwest, California's Central Valley, and the Southeast.",
    whoIsAffected: "Infants under 6 months are at critical risk because their digestive systems convert nitrate to nitrite more readily. Pregnant women, the elderly, and people with certain enzyme deficiencies are also more vulnerable. Adults with normal health can tolerate the EPA limit without acute effects, though long-term exposure research is ongoing.",
    healthEffects: [
      "Methemoglobinemia ('blue baby syndrome') in infants — potentially fatal",
      "Reduced oxygen-carrying capacity of blood",
      "Potential increased cancer risk with long-term exposure (IARC Group 2A)",
      "Adverse reproductive outcomes at high levels during pregnancy",
      "Thyroid disruption with chronic high-level exposure",
    ],
    sources: [
      "Agricultural fertilizer runoff — the dominant source in rural areas",
      "Livestock operations and feedlot runoff",
      "Leaking or improperly sited septic systems",
      "Sewage treatment plant effluent",
      "Natural soil nitrogen mineralization",
      "Urban lawn fertilizer and storm runoff",
    ],
    epaLimit: "10 mg/L",
    epaLimitNote: "The EPA Maximum Contaminant Level (MCL) for nitrate is 10 milligrams per liter (mg/L) measured as nitrogen — equivalent to 10 parts per million (ppm). A separate limit of 1 mg/L applies to nitrite. The MCL was set in 1991 primarily to protect infants. Some health researchers argue the standard should be lower given emerging evidence of cancer risk at sub-MCL levels.",
    detection: "Nitrate is readily detectable through standard water quality tests available from certified labs. Many utilities test regularly and report results in Consumer Confidence Reports. Home test strips can indicate elevated nitrate but are less accurate than lab analysis. Public water systems are required to notify customers if levels exceed the MCL.",
    treatments: ["reverse-osmosis"],
    affectedStates: ["california", "texas", "florida", "arizona", "ohio"],
    wellWaterRelevant: true,
    faqs: [
      {
        question: "What is the safe nitrate level in drinking water?",
        answer: "The EPA legal limit is 10 mg/L as nitrogen. For healthy adults, this level is generally considered safe for short-term exposure. However, water should not exceed 10 mg/L for infants under 6 months or be used to prepare infant formula. Some researchers advocate for a lower limit based on cancer risk data.",
      },
      {
        question: "Does boiling water remove nitrates?",
        answer: "No. Boiling does not remove nitrates and actually concentrates them as water evaporates. Never use boiling as a solution for nitrate-contaminated water, especially for infant formula preparation.",
      },
      {
        question: "What filter removes nitrates?",
        answer: "Reverse osmosis (RO) systems are the most reliable, reducing nitrate by 85–95%. Ion exchange systems specifically designed for nitrate removal are also effective. Standard carbon block filters, pitcher filters, and whole-house sediment filters do not remove nitrate.",
      },
      {
        question: "Is my well water at risk for nitrates?",
        answer: "Wells in agricultural areas, especially shallow wells under 100 feet, carry the highest nitrate risk. The USGS estimates that 4% of private wells exceed EPA limits — much higher in farming regions. Annual testing is recommended for any well near cropland or livestock operations.",
      },
      {
        question: "Can nitrates be detected by taste or smell?",
        answer: "No. Nitrate is completely colorless and odorless. The only way to know if your water contains nitrate is through laboratory testing. This is particularly important for well owners, since wells are not subject to routine regulatory monitoring.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "disinfection-byproducts",
    name: "Disinfection Byproducts (DBPs)",
    shortName: "DBPs",
    category: "Disinfection Byproducts",
    riskLevel: "moderate",
    summary: "Disinfection byproducts form when chlorine or other disinfectants react with naturally occurring organic matter in source water. The two main regulated groups are total trihalomethanes (TTHMs) and haloacetic acids (HAA5). They are an unavoidable tradeoff of water disinfection — the risk of not disinfecting far outweighs the risk of DBPs, but minimizing exposure is prudent.",
    definition: "When utilities add chlorine to water to kill pathogens, it reacts with dissolved organic matter — leaves, algae, soil — to produce disinfection byproducts (DBPs). Over 600 DBPs have been identified. The EPA regulates two groups: total trihalomethanes (TTHMs, including chloroform) and haloacetic acids (HAA5). DBP levels tend to be highest in surface water systems and in warm months when organic matter is elevated.",
    whyCare: "While DBPs are present at low levels in virtually all chlorinated water systems, long-term exposure has been associated with increased bladder cancer risk and reproductive effects. The EPA sets running annual averages to limit exposure, but individual quarterly samples can exceed averages.",
    whoIsAffected: "Everyone on chlorinated public water has some DBP exposure. People who drink large amounts of tap water, swim in chlorinated pools, or take long showers in chlorinated water (which allows inhalation and skin absorption) have greater exposure. Pregnant women are advised to minimize exposure.",
    healthEffects: [
      "Increased bladder cancer risk with decades of high-level exposure",
      "Adverse reproductive outcomes — miscarriage, low birth weight (at elevated levels)",
      "Possible colorectal cancer association (research ongoing)",
      "Liver and kidney stress at high concentrations",
    ],
    sources: [
      "Reaction between chlorine disinfectant and natural organic matter",
      "Surface water sources (rivers, reservoirs) with high organic content",
      "Seasonal algae blooms increasing precursor material",
      "Chloramines (alternative disinfectant) producing different DBP profile",
      "Distribution system aging — water that sits longer forms more DBPs",
    ],
    epaLimit: "80 µg/L (TTHMs) / 60 µg/L (HAA5)",
    epaLimitNote: "The EPA limits total trihalomethanes (TTHMs) to 80 micrograms per liter (µg/L) and haloacetic acids (HAA5) to 60 µg/L, measured as annual running averages across all monitoring points in the system. These limits were set under the Stage 2 Disinfectants and Disinfection Byproducts Rule (2006). Some international standards are more stringent.",
    detection: "DBPs are routinely monitored by public water systems and reported in Consumer Confidence Reports. Results are reported as system-wide running annual averages. Individual samples at your tap may vary — distribution system age and distance from the treatment plant affect DBP levels.",
    treatments: ["activated-carbon", "reverse-osmosis"],
    affectedStates: ["california", "texas", "florida", "arizona", "ohio"],
    wellWaterRelevant: false,
    faqs: [
      {
        question: "Are disinfection byproducts dangerous?",
        answer: "At the levels found in regulated public water systems, the health risk from DBPs is relatively low — and far lower than the risk from the pathogens that disinfection prevents. Long-term high-level exposure is associated with modest increases in bladder cancer risk. Prudent precautions include using a carbon filter, which significantly reduces DBP levels.",
      },
      {
        question: "What filter removes disinfection byproducts?",
        answer: "Activated carbon filters (NSF/ANSI 53 certified) are highly effective at removing TTHMs and HAA5 — the two main regulated DBP groups. Reverse osmosis also removes DBPs but is less commonly installed just for this purpose. Letting tap water sit in an open pitcher for a few hours also allows volatile THMs to off-gas.",
      },
      {
        question: "Why does my tap water smell like chlorine?",
        answer: "The chlorine smell comes from the disinfectant itself, which is added intentionally to kill bacteria. A stronger smell doesn't always mean higher DBP levels — freshly treated water often smells more strongly of chlorine but may have lower DBPs than older water in the distribution system. A carbon filter will eliminate the taste and odor.",
      },
      {
        question: "Are DBPs worse in summer?",
        answer: "Generally yes. Warm weather increases algae growth and organic matter in source water, providing more precursor material for DBP formation. Warm water also speeds the chemical reactions. Many utilities see their highest DBP readings in late summer and early fall.",
      },
      {
        question: "Do DBPs form in well water?",
        answer: "DBPs form specifically as a result of chemical disinfection. Private wells that use chlorine shocking or have inline chlorination can develop DBPs. Untreated wells do not contain DBPs but may have microbial risks instead.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "arsenic",
    name: "Arsenic in Drinking Water",
    shortName: "Arsenic",
    category: "Heavy Metals",
    riskLevel: "moderate",
    summary: "Arsenic is a naturally occurring metalloid found in geological deposits across the western United States, New England, and the Midwest. It can also enter water through industrial processes. Long-term exposure is strongly linked to bladder, lung, and skin cancer. The EPA reduced the arsenic MCL from 50 ppb to 10 ppb in 2001, though some researchers advocate for an even lower limit.",
    definition: "Arsenic (As) occurs naturally in rock and soil, dissolving into groundwater through natural weathering processes. Inorganic arsenic — the form found in drinking water — is a known human carcinogen. The western United States has particularly arsenic-rich geological formations, but elevated levels have been found in 48 states. Arsenic is tasteless and odorless.",
    whyCare: "An estimated 2.1 million Americans drink water from private wells with arsenic above 10 ppb. Small public water systems in rural areas also struggle to meet the MCL. Even at the legal limit of 10 ppb, some epidemiological studies suggest meaningful cancer risk with lifetime exposure.",
    whoIsAffected: "Rural residents relying on private wells in the western U.S., New England, and parts of the Midwest face the highest risk. Populations in areas with natural arsenic-rich geology (volcanic rock, marine sedimentary deposits) are disproportionately affected.",
    healthEffects: [
      "Bladder, lung, and skin cancer — the most well-established associations",
      "Skin thickening (keratosis) and dark spots with chronic high exposure",
      "Peripheral neuropathy and cardiovascular disease",
      "Type 2 diabetes association at elevated levels",
      "Developmental and cognitive effects in children",
      "Immune system disruption",
    ],
    sources: [
      "Natural geological weathering of arsenic-rich rock and sediment",
      "Mining operations and smelter waste",
      "Agricultural pesticides and herbicides (historical use)",
      "Coal-fired power plant ash and waste",
      "Industrial effluent discharge",
      "Geothermal water in volcanic regions",
    ],
    epaLimit: "10 ppb",
    epaLimitNote: "The EPA MCL for arsenic is 10 parts per billion (ppb), effective since January 2006 — reduced from the previous 50 ppb limit. The Maximum Contaminant Level Goal (MCLG) is zero, meaning no exposure is considered risk-free. Compliance is particularly challenging for small water systems in rural areas. The 10 ppb standard is 5× higher than WHO's guideline value of 10 µg/L for developed countries.",
    detection: "Arsenic testing requires a certified laboratory — home test strips are unreliable for arsenic at regulatory levels. Private well owners in high-risk areas should test annually. Public water systems report arsenic levels in Consumer Confidence Reports. The EPA's EJScreen and ECHO tools allow you to look up monitoring data for public systems.",
    treatments: ["reverse-osmosis", "activated-carbon"],
    affectedStates: ["california", "arizona"],
    wellWaterRelevant: true,
    faqs: [
      {
        question: "What states have the most arsenic in drinking water?",
        answer: "States with the highest arsenic in groundwater include Arizona, Nevada, Idaho, Montana, Wyoming, Utah, South Dakota, and parts of New England (Maine, New Hampshire). The western U.S. has naturally high arsenic due to volcanic and hydrothermal geology. Parts of Michigan, Wisconsin, and Minnesota also have elevated groundwater arsenic.",
      },
      {
        question: "What is the best filter for arsenic?",
        answer: "Reverse osmosis (RO) systems are the most effective, removing 90–95% of arsenic. Activated alumina and iron-based media filters are also highly effective for arsenic specifically. Adsorptive media point-of-entry systems can treat whole-home water. Standard carbon block filters provide minimal arsenic removal.",
      },
      {
        question: "Is 10 ppb arsenic safe to drink?",
        answer: "Technically legal, but not without risk. At exactly 10 ppb over a lifetime, some epidemiological models suggest a bladder cancer risk of roughly 1 in 500. The EPA set the limit at 10 ppb partly because of compliance cost concerns for small utilities. If your water tests near 10 ppb, a point-of-use RO filter is a prudent precaution.",
      },
      {
        question: "Can arsenic be removed by boiling water?",
        answer: "No. Boiling does not remove arsenic. As water evaporates, the arsenic concentration actually increases. Never use boiling as a treatment for arsenic-contaminated water.",
      },
      {
        question: "Does arsenic occur in well water?",
        answer: "Yes, and this is a major concern. An estimated 2.1 million Americans have private well water exceeding 10 ppb arsenic. Unlike public water systems, private wells are not federally regulated and are not required to be tested. Testing is strongly recommended for any private well, especially in the western U.S. and New England.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "hard-water",
    name: "Hard Water",
    shortName: "Hard Water",
    category: "Minerals",
    riskLevel: "low",
    summary: "Hard water contains elevated levels of dissolved calcium and magnesium. It is not a health risk and is associated with some cardiovascular benefits, but it causes scale buildup in pipes and appliances, soap scum, and reduces the effectiveness of detergents. Approximately 85% of U.S. homes have hard water. It is an aesthetic and infrastructure issue, not a regulatory one.",
    definition: "Water hardness is a measure of dissolved calcium (Ca²⁺) and magnesium (Mg²⁺) ions, expressed in milligrams per liter (mg/L) as calcium carbonate (CaCO₃) or grains per gallon (gpg). Water below 60 mg/L is considered soft; 61–120 mg/L is moderately hard; 121–180 mg/L is hard; above 180 mg/L is very hard. The Colorado River, which supplies water to much of the Southwest, is among the hardest source waters in the U.S.",
    whyCare: "While hard water is not a health hazard, it has significant practical consequences: scale buildup reduces water heater efficiency by up to 30%, clogs showerheads and faucets, shortens appliance lifespan, and increases soap and detergent usage. Very hard water areas spend meaningfully more on plumbing maintenance.",
    whoIsAffected: "Residents in the Southwest (Arizona, Nevada, Southern California), the Midwest (Indiana, Illinois, Kansas), and parts of Texas and Florida typically have the hardest water. Groundwater is almost always harder than surface water because it has more contact time with rock and soil.",
    healthEffects: [
      "No known negative health effects — hard water is safe to drink",
      "Some epidemiological studies suggest modest cardiovascular benefit from magnesium and calcium intake",
      "Very hard water may worsen eczema in sensitive individuals (dermatological research is mixed)",
      "High calcium intake from very hard water may contribute to kidney stones in susceptible individuals",
    ],
    sources: [
      "Dissolution of limestone and dolomite rock formations",
      "Groundwater contact with calcium- and magnesium-rich geology",
      "Colorado River and its tributaries (exceptionally hard source water)",
      "Agricultural return flows adding mineral content",
    ],
    epaLimit: "No federal limit",
    epaLimitNote: "There is no EPA Maximum Contaminant Level for hardness — it is classified as a secondary (aesthetic) standard, not a primary health standard. The EPA's Secondary Maximum Contaminant Level (SMCL) recommendation for total dissolved solids (TDS), which correlates with hardness, is 500 mg/L for taste purposes only. Hard water does not trigger regulatory action.",
    detection: "Water hardness can be measured with inexpensive test strips, drop-count test kits, or through certified lab analysis. Your utility's Consumer Confidence Report typically includes hardness data. Most utilities also provide hardness information on their websites because it is a common customer question.",
    treatments: ["water-softener"],
    affectedStates: ["california", "arizona", "texas"],
    wellWaterRelevant: true,
    faqs: [
      {
        question: "Is hard water safe to drink?",
        answer: "Yes. Hard water is completely safe to drink. It contains beneficial minerals (calcium and magnesium) and is associated with modest cardiovascular health benefits in some studies. Hard water is an aesthetic and infrastructure issue, not a health concern.",
      },
      {
        question: "How do I soften hard water?",
        answer: "The most effective whole-home solution is a salt-based ion exchange water softener, which replaces calcium and magnesium ions with sodium. For drinking water only, reverse osmosis systems also produce soft water. Salt-free conditioners (template-assisted crystallization) reduce scale but do not technically 'soften' water.",
      },
      {
        question: "What is considered very hard water?",
        answer: "Water above 180 mg/L (or 10.5 grains per gallon) is classified as very hard. Phoenix, Las Vegas, and parts of the Texas Hill Country regularly measure 300–500 mg/L. These areas see the most significant scale and appliance problems.",
      },
      {
        question: "Does hard water damage appliances?",
        answer: "Yes. Scale deposits from hard water reduce water heater efficiency by up to 30% and can shorten appliance lifespan significantly. Dishwashers, washing machines, coffee makers, and tankless water heaters are particularly susceptible. In very hard water areas, the payback period for a water softener can be under 3 years.",
      },
      {
        question: "Is softened water safe to drink?",
        answer: "Softened water replaces calcium and magnesium with sodium. The sodium addition is modest — softening water at 300 mg/L hardness adds approximately 200 mg/L of sodium. People on low-sodium diets may prefer to use a separate non-softened line for drinking water or a reverse osmosis system at the kitchen tap.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
];

export function getContaminantBySlug(slug: string): Contaminant | undefined {
  return contaminants.find((c) => c.slug === slug);
}

export default contaminants;
