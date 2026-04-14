export interface WellWaterGuide {
  stateSlug: string;
  stateName: string;
  stateAbbr: string;
  summary: string;
  annualTestingGuidance: string;
  whatToTestFor: string[];
  commonRisks: string[];
  epaGuidanceUrl: string;
  stateLabUrl: string;
  faqs: { question: string; answer: string }[];
  lastUpdated: string;
}

const wellWaterGuides: WellWaterGuide[] = [
  {
    stateSlug: "california",
    stateName: "California",
    stateAbbr: "CA",
    summary: "Approximately 10% of Californians — over 4 million people — rely on private wells for drinking water. California's diverse geology creates region-specific contamination risks: naturally occurring arsenic and uranium in the Central Valley and foothills, nitrate contamination from intensive agriculture, PFAS near military installations, and hexavalent chromium (chromium-6) in several inland regions. The State Water Resources Control Board oversees small water systems, but private domestic wells are the responsibility of the homeowner.",
    annualTestingGuidance: "California recommends testing private wells at least annually for coliform bacteria and nitrates. Additional testing is strongly advised for arsenic and uranium (Central Valley and Sierra foothills), chromium-6 (Mojave Desert, Hinkley area, parts of the Central Valley), PFAS (within 1 mile of military bases, airports, or industrial sites), and manganese (agricultural regions). After significant rainfall, flooding, or nearby construction, bacterial re-testing is recommended regardless of your regular schedule.",
    whatToTestFor: [
      "Total coliform bacteria and E. coli — annual minimum for all wells",
      "Nitrates — annual for wells near agriculture or septic systems",
      "Arsenic — all Central Valley, Sierra foothills, and Mojave Desert wells",
      "Uranium — Central Valley wells, especially Tulare, Kings, Fresno, and San Joaquin counties",
      "Hexavalent chromium (chromium-6) — San Bernardino County, Central Valley, and areas near chrome plating operations",
      "PFAS — wells within 2 miles of military bases (Vandenberg, Edwards, Camp Pendleton, March ARB) and major airports",
      "Manganese — agricultural Central Valley wells; can cause neurological effects at high levels",
      "1,2,3-Trichloropropane (1,2,3-TCP) — Central Valley; industrial solvent contaminant",
      "pH, hardness, and total dissolved solids — baseline water chemistry",
    ],
    commonRisks: [
      "Arsenic from natural geological sources — among the highest natural arsenic groundwater concentrations in the U.S., particularly in the eastern San Joaquin Valley",
      "Nitrate contamination from agricultural fertilizers — the Central Valley has some of the highest nitrate concentrations in the nation's groundwater",
      "PFAS from military and industrial sites — multiple Superfund sites and military installations across Southern California and the Central Valley",
      "Hexavalent chromium (chromium-6) — naturally occurring in serpentinite rock in the Coast Ranges and from industrial contamination in the Mojave Desert",
      "Uranium from natural sources — granitic bedrock in the Sierra Nevada foothills releases uranium into groundwater",
      "Saltwater intrusion in coastal areas — overdraft of aquifers near the coast allows seawater to infiltrate groundwater in Santa Barbara, Ventura, and parts of the Bay Area",
      "1,2,3-TCP industrial contamination — widespread in the southern San Joaquin Valley from historical pesticide manufacturing byproducts",
    ],
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    stateLabUrl: "https://www.waterboards.ca.gov/drinking_water/certlic/labs/",
    faqs: [
      {
        question: "Does California regulate private wells?",
        answer: "California does not regulate individual private domestic wells at the state level — that responsibility falls on individual counties. Some counties (Santa Clara, San Mateo, Contra Costa) have more stringent local well programs, while others have minimal oversight. The State Water Resources Control Board oversees small community water systems (serving 5+ connections) but not single-family domestic wells.",
      },
      {
        question: "Is arsenic a common problem in California well water?",
        answer: "Yes — California has some of the highest naturally occurring arsenic concentrations in groundwater in the United States. The eastern San Joaquin Valley (Tulare, Kings, Fresno counties) is particularly affected, where arsenic-rich marine sediments dissolved over thousands of years. The USGS has mapped elevated arsenic in over 20% of tested wells in some Central Valley areas. Reverse osmosis or adsorptive media filtration is recommended for affected wells.",
      },
      {
        question: "How do I find a certified water testing lab in California?",
        answer: "The State Water Resources Control Board maintains a searchable database of ELAP (Environmental Laboratory Accreditation Program) certified labs at waterboards.ca.gov. Look for labs with certification for drinking water analysis. Many labs offer mail-in kits — you collect the sample and mail it to the lab. Sampling instructions must be followed precisely, especially for bacterial testing.",
      },
      {
        question: "What is chromium-6 and is it in California well water?",
        answer: "Hexavalent chromium (Cr-6) is a carcinogenic form of chromium that occurs both naturally (from serpentinite rock weathering) and from industrial contamination. The Hinkley, CA contamination case (made famous by the Erin Brockovich case) involved Cr-6. California set its own Cr-6 MCL of 10 ppb, which was later rescinded due to legal challenges, leaving the federal total chromium limit of 100 ppb in place. Well owners in San Bernardino County, parts of the Mojave, and near chrome plating facilities should test specifically for Cr-6.",
      },
      {
        question: "Should I test my California well for PFAS?",
        answer: "If your well is within 2 miles of a military installation (Vandenberg, Edwards, March, Camp Pendleton, Travis, Beale, others), a major airport, or a known industrial PFAS source, testing is strongly recommended. California has numerous identified PFAS plumes from AFFF firefighting foam use at military and civil aviation facilities. PFAS testing requires a specialized lab — not all standard water quality labs are equipped for it.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    stateSlug: "texas",
    stateName: "Texas",
    stateAbbr: "TX",
    summary: "Texas has approximately 1.5 million private water wells, with rural and suburban residents across the Hill Country, West Texas, and the Panhandle commonly relying on groundwater. The state's primary well water concerns include naturally occurring arsenic (particularly in West Texas and the Hill Country), high nitrates from agricultural and septic sources, radium and uranium in granite-dominated regions, and bacterial contamination in shallow alluvial wells. The Texas Commission on Environmental Quality (TCEQ) oversees public water systems; private wells are the landowner's responsibility.",
    annualTestingGuidance: "TCEQ and Texas A&M AgriLife Extension recommend testing private wells annually for bacteria and nitrates as a minimum. Additional testing should be conducted for arsenic (West Texas and Hill Country), radium (Llano Uplift and granitic bedrock areas), fluoride (Trans-Pecos and parts of West Texas), iron and manganese (East Texas), hydrogen sulfide (Permian Basin and some Gulf Coast areas), and PFAS near military installations or industrial areas. New wells should receive a comprehensive baseline test before first use.",
    whatToTestFor: [
      "Total coliform bacteria and E. coli — annual minimum for all wells",
      "Nitrates — annual for wells near agriculture or septic systems",
      "Arsenic — West Texas, Hill Country (Edwards Plateau), and Trans-Pecos wells",
      "Radium-226 and Radium-228 — Llano Uplift (Llano, Mason, Gillespie counties) and granite rock regions",
      "Uranium — Hill Country and West Texas granitic geology",
      "Fluoride — Trans-Pecos region and parts of West Texas (naturally elevated)",
      "Iron and manganese — East Texas Pineywoods and Post Oak Savanna regions",
      "Hydrogen sulfide — Permian Basin and Gulf Coast areas",
      "PFAS — near military installations (Fort Hood, Dyess, Sheppard, Lackland, and others)",
      "Total dissolved solids (TDS) — West Texas; some areas exceed 1,000 mg/L",
    ],
    commonRisks: [
      "Arsenic from natural geological sources — Permian Basin brines and West Texas groundwater rank among the highest arsenic concentrations in the nation",
      "Radium from Llano Uplift granite — radioactive radium isotopes in groundwater from weathered Precambrian granite across the Texas Hill Country",
      "Nitrate contamination — intensive agriculture in the Panhandle High Plains (Ogallala aquifer region) creates elevated nitrate risk; also common near feedlots",
      "Fluoride — naturally elevated fluoride in many West Texas aquifers, including parts of the Edwards-Trinity and Cenozoic Pecos alluvium",
      "Hydrogen sulfide ('rotten egg' odor) — common in Permian Basin groundwater and some Gulf Coast shallow wells",
      "Saltwater intrusion near the Gulf Coast — aquifer depletion in the Houston-Galveston area has historically caused saltwater encroachment",
      "PFAS contamination — multiple military installations across Texas used AFFF firefighting foam with documented groundwater impacts",
    ],
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    stateLabUrl: "https://www.tceq.texas.gov/agency/water_main.html",
    faqs: [
      {
        question: "Is radium a concern in Texas well water?",
        answer: "Yes, particularly in the Llano Uplift region of the Hill Country (Llano, Mason, Gillespie, Blanco, and surrounding counties). Precambrian granite in this area contains naturally occurring uranium and thorium that decay into radium isotopes, which leach into groundwater. TCEQ data has documented radium exceeding the EPA MCL of 5 pCi/L in numerous public water systems in this region; private wells likely reflect similar patterns. Reverse osmosis and ion exchange systems are effective for radium removal.",
      },
      {
        question: "What is the water quality of the Ogallala aquifer?",
        answer: "The Ogallala (High Plains) aquifer generally provides good quality drinking water in its deeper zones, with the primary concern being nitrate contamination from decades of agricultural fertilizer use. Some areas of the Texas Panhandle have documented nitrate levels above the EPA MCL of 10 mg/L. The aquifer is also being depleted at a rate much faster than natural recharge — a long-term availability concern separate from quality.",
      },
      {
        question: "Does Texas regulate private wells?",
        answer: "Texas has minimal regulation of private domestic wells. The state requires permits for new well construction (through TCEQ and groundwater conservation districts), but there is no routine state testing or monitoring requirement for private domestic wells. Some groundwater conservation districts offer well testing assistance programs. Well owners are entirely responsible for their own water quality monitoring.",
      },
      {
        question: "How do I test my well water in Texas?",
        answer: "Texas A&M AgriLife Extension offers subsidized well water testing kits through county extension offices — one of the most cost-effective options in the state. Private TCEQ-certified labs also accept samples. For comprehensive testing (arsenic, radium, heavy metals, pesticides), a certified lab is necessary. Basic bacterial and nitrate testing kits are available through many county extension offices for as little as $25.",
      },
      {
        question: "Is hydrogen sulfide in Texas well water harmful?",
        answer: "The 'rotten egg' smell from hydrogen sulfide (H2S) is detected by smell at concentrations well below harmful levels — the odor threshold is about 0.5 ppb, while the EPA aesthetic guideline is 250 ppb. At typical well water concentrations, hydrogen sulfide is primarily an aesthetic problem, not a health hazard. Aeration (a simple air injection system) effectively removes H2S. However, if your well suddenly develops an H2S smell it didn't have before, test for bacterial contamination — sulfur-reducing bacteria can produce H2S.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    stateSlug: "florida",
    stateName: "Florida",
    stateAbbr: "FL",
    summary: "Florida has over 1 million private wells, with use concentrated in rural areas of North and Central Florida. Florida's unique geology — primarily porous karst limestone (the Floridan Aquifer System) — creates both the state's water abundance and its contamination vulnerabilities. Key concerns include naturally occurring radium, uranium, and radon from phosphate-rich limestone, nitrate and bacterial contamination from septic systems and agricultural runoff, and legacy contamination from the phosphate mining industry in the central state.",
    annualTestingGuidance: "The Florida Department of Health recommends annual testing for bacteria and nitrates. Given Florida's karst geology (limestone with sinkholes and direct conduits to the aquifer), bacterial testing after heavy rainfall is especially important. Annual testing for radium and uranium is recommended for wells in the phosphate mining belt (Polk, Hillsborough, Manatee, Hardee, DeSoto counties). PFAS testing is advised near military bases and airports. All new wells should receive a comprehensive baseline test.",
    whatToTestFor: [
      "Total coliform bacteria and E. coli — annual minimum; re-test after flooding",
      "Nitrates — annual for wells near agricultural land or septic systems",
      "Radium-226 and Radium-228 — Polk, Hillsborough, Manatee, Hardee counties (phosphate region)",
      "Uranium — phosphate mining belt in Central Florida",
      "Radon — Florida has some of the highest residential radon from phosphate geology; water can be a secondary source",
      "Arsenic — some areas of North and Central Florida",
      "Iron and manganese — common throughout Florida; aesthetic issue but affects water quality",
      "Hydrogen sulfide — common in Florida's sulfur-containing aquifer formations",
      "PFAS — near Tyndall, Eglin, MacDill, Patrick, and other Florida military installations",
      "Total dissolved solids and hardness — baseline; water in South Florida is typically very hard",
    ],
    commonRisks: [
      "Radium and uranium from phosphate geology — Central Florida's phosphate deposits contain naturally occurring radioactive materials (NORM) that leach into the Floridan Aquifer",
      "Karst vulnerability — Florida's limestone geology means surface contaminants can reach groundwater quickly through sinkholes and fractures; this makes bacterial contamination after flooding a significant risk",
      "Nitrate contamination from septic systems — Florida's high water table and sandy soils in many areas mean septic system effluent can reach wells, particularly those less than 75 feet deep",
      "Iron and hydrogen sulfide — the sulfate-reducing environment of Florida's aquifers produces hydrogen sulfide odor and dissolved iron in many wells, particularly in the Hawthorn Formation",
      "Agricultural chemical runoff — cattle operations in the Kissimmee Valley, citrus in the Ridge, and vegetable farming in the south contribute to nitrate and pesticide contamination",
      "PFAS from military installations — multiple Florida bases (Tyndall, Eglin, Patrick, MacDill) used AFFF firefighting foam with documented impacts on surrounding groundwater",
      "Saltwater intrusion — South Florida's overpumped aquifers face serious saltwater intrusion; some areas near the coast have groundwater with TDS well above drinking water standards",
    ],
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    stateLabUrl: "https://www.floridahealth.gov/environmental-health/drinking-water/private-well-program.html",
    faqs: [
      {
        question: "Why does my Florida well water smell like sulfur?",
        answer: "Hydrogen sulfide (H2S) — the 'rotten egg' smell — is extremely common in Florida well water due to the sulfate-rich Floridan Aquifer limestone geology. Sulfur-reducing bacteria and chemical reactions in the aquifer naturally produce H2S. It is primarily an aesthetic issue, not a health hazard at typical concentrations. Chlorination or aeration systems effectively eliminate the odor. However, a sudden onset of sulfur smell in a well that previously had none warrants bacterial testing.",
      },
      {
        question: "Is radioactivity a concern in Florida well water?",
        answer: "In the phosphate mining belt of Central Florida (Polk, Hillsborough, Manatee, Hardee, and DeSoto counties), yes. Florida's phosphate rock contains naturally occurring uranium, radium, and their decay products. The Floridan Aquifer in this region has documented radium levels that sometimes exceed the EPA MCL of 5 pCi/L. If your well is in this region, annual radium testing and a reverse osmosis or ion exchange system for drinking water is advisable.",
      },
      {
        question: "How does Florida's karst geology affect well water safety?",
        answer: "Florida's limestone bedrock is riddled with fractures, conduits, and sinkholes that allow surface water — and its contaminants — to bypass natural filtration and reach groundwater quickly. This is why bacterial contamination risk spikes after heavy rain in Florida. Septic system leakage, agricultural runoff, and even surface flooding can reach a well within hours in karst terrain. Regular bacterial testing and a UV disinfection system provide important protection.",
      },
      {
        question: "Does Florida regulate private wells?",
        answer: "Florida county health departments regulate private well construction and permitting, but not ongoing water quality monitoring. Well construction standards (setback from septic systems, casing requirements, grouting) are regulated, but testing after construction is complete is largely the homeowner's responsibility. The Florida Department of Health provides free or low-cost testing assistance through some county programs.",
      },
      {
        question: "Is iron in my Florida well water a health concern?",
        answer: "Iron at levels typically found in Florida wells (1–5 mg/L) is not a health hazard — the EPA's secondary standard is 0.3 mg/L, set for aesthetic reasons (staining and taste), not health. However, high iron can cause orange-brown staining of fixtures and laundry, affect taste significantly, and promote iron bacteria growth. Iron filtration (oxidizing filter or aeration + filtration) effectively removes iron.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    stateSlug: "arizona",
    stateName: "Arizona",
    stateAbbr: "AZ",
    summary: "Arizona's private well users — primarily in rural areas outside the Phoenix and Tucson metro served areas — face some of the most challenging well water conditions in the nation. The state's arid geology concentrates naturally occurring contaminants including arsenic, uranium, fluoride, and chromium-6 in groundwater. Aquifer overdraft is also a serious concern, with many rural Arizona wells experiencing declining water levels. The Arizona Department of Environmental Quality (ADEQ) regulates public water systems; private domestic wells (fewer than 5 service connections) are minimally regulated.",
    annualTestingGuidance: "ADEQ and University of Arizona Extension recommend annual testing for bacteria and nitrates as a minimum. Given Arizona's geology, arsenic testing is strongly recommended for all wells — Arizona has documented some of the highest naturally occurring arsenic in groundwater in the United States. Testing for uranium, fluoride, and chromium-6 is advised based on location. All new wells and wells that haven't been tested in 3+ years should receive a comprehensive panel including heavy metals, radiologicals, and VOCs.",
    whatToTestFor: [
      "Total coliform bacteria and E. coli — annual minimum for all wells",
      "Arsenic — all Arizona wells; state ranks among highest naturally occurring arsenic in the nation",
      "Uranium — granitic geology areas; southeastern Arizona, Prescott region",
      "Fluoride — many rural Arizona aquifers have naturally elevated fluoride; some areas exceed the EPA MCL of 4 mg/L",
      "Chromium-6 — Prescott Valley area, Gila River basin, and near industrial sites",
      "Nitrates — wells near agricultural areas, feedlots, or septic systems",
      "Perchlorate — Phoenix metro area, Litchfield Park, and areas with aerospace/defense industry history",
      "Total dissolved solids and hardness — Arizona groundwater is typically very hard (200–600+ mg/L)",
      "PFAS — near Luke Air Force Base, Davis-Monthan, Fort Huachuca, and other military installations",
      "Iron and manganese — some rural areas of central and eastern Arizona",
    ],
    commonRisks: [
      "Arsenic — Arizona consistently reports among the highest naturally occurring arsenic concentrations in U.S. groundwater; volcanic and sedimentary geology releases arsenic across much of the state",
      "Uranium from granitic and sedimentary rock — southeastern Arizona and the Prescott region have documented uranium in groundwater from naturally occurring ore deposits",
      "Fluoride from volcanic geology — naturally elevated fluoride occurs in many areas; the Tucson Basin, parts of Yavapai County, and eastern Arizona have documented levels at or above the EPA MCL",
      "Perchlorate in the Phoenix area — legacy aerospace and defense industry contamination has left perchlorate plumes affecting groundwater in parts of the West Valley",
      "Aquifer depletion — many rural Arizona aquifers are being pumped faster than natural recharge, causing water quality changes (increased mineral concentration, arsenic mobilization) as water tables drop",
      "PFAS from military and aviation — Luke AFB, Davis-Monthan, Fort Huachuca, and commercial airports have documented PFAS releases affecting surrounding groundwater",
      "Extreme water hardness — Arizona groundwater is among the hardest in the nation; scale buildup in pipes and appliances is nearly universal without treatment",
    ],
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    stateLabUrl: "https://www.azdeq.gov/environ/water/dw/wellowner.html",
    faqs: [
      {
        question: "Is arsenic in Arizona well water a serious problem?",
        answer: "Yes — this is the most significant well water health concern in Arizona. The USGS and ADEQ have documented arsenic above the EPA MCL of 10 ppb in a substantial percentage of Arizona private wells, particularly in areas with volcanic and basin-fill geology. In some rural areas of eastern and southern Arizona, naturally occurring arsenic can reach 50–200 ppb without treatment. A reverse osmosis system at the kitchen tap is the recommended solution and effectively reduces arsenic to below 1 ppb.",
      },
      {
        question: "What is perchlorate and is it in Arizona well water?",
        answer: "Perchlorate is a chemical used in rocket propellants, fireworks, and explosives that disrupts thyroid function. The Phoenix metro's West Valley (Goodyear, Litchfield Park, Buckeye, Tolleson) has documented perchlorate groundwater contamination from aerospace industry operations dating to the 1950s–1970s. The EPA set a federal MCL for perchlorate of 0.056 mg/L in 2023. Well owners in the West Valley should test specifically for perchlorate.",
      },
      {
        question: "How hard is well water in Arizona?",
        answer: "Very hard — among the hardest in the United States. Arizona groundwater typically ranges from 200 to 600+ mg/L as CaCO₃, compared to the 'moderately hard' threshold of 120 mg/L. Phoenix area water averages over 250 mg/L; parts of Maricopa and Pinal counties exceed 400 mg/L. A whole-home water softener is nearly universal in well-served Arizona households to prevent scale damage to plumbing and appliances.",
      },
      {
        question: "Does Arizona regulate private well water quality?",
        answer: "Arizona regulates well construction (drilling permits through ADWR) and some Assured Water Supply requirements, but does not mandate testing or treatment of private domestic wells. The Arizona Department of Environmental Quality regulates public water systems. Private well owners in Arizona have essentially no regulatory safety net and are solely responsible for their water quality. Given the state's significant natural contamination risks, routine testing is strongly advisable.",
      },
      {
        question: "How do I find water in rural Arizona?",
        answer: "Arizona Department of Water Resources (ADWR) maintains the Water Well Registry database, which includes historical well logs, water levels, and pump test data for registered wells across the state. This is a useful resource for understanding your aquifer and local groundwater conditions before drilling a new well or evaluating an existing one. Many rural Arizona areas are experiencing significant water table declines due to overdraft.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    stateSlug: "ohio",
    stateName: "Ohio",
    stateAbbr: "OH",
    summary: "Ohio has over 800,000 private wells serving approximately 2 million residents, concentrated in rural areas outside municipal water service areas. Ohio's glacial geology, agricultural intensity, and legacy industrial history create a complex contamination landscape. Primary concerns include nitrate from agriculture and septic systems, bacteria from karst geology in northwest Ohio and the limestone belt, lead from older well pump and pressure tank components, and PFAS from industrial sources concentrated in the northeastern and central portions of the state.",
    annualTestingGuidance: "Ohio EPA and Ohio State University Extension recommend testing private wells annually for bacteria (total coliform and E. coli) and nitrates. Additional testing is advised for: radon (Ohio ranks among the higher radon states — test indoor air first, then water if air levels are elevated), PFAS (near Scioto and Muskingum River industrial corridors, near military installations), arsenic (southern Ohio, particularly in areas with Ordovician shale), and volatile organic compounds (near legacy industrial sites in northeastern Ohio). All new wells should receive a baseline comprehensive test.",
    whatToTestFor: [
      "Total coliform bacteria and E. coli — annual minimum for all wells",
      "Nitrates — annual for wells near cropland or septic systems; Ohio agriculture is intensive",
      "Lead — older pressure tanks, well pumps, and household plumbing; Ohio has significant pre-1986 housing stock",
      "Radon — Ohio has elevated geological radon; test indoor air first, then water if air levels warrant",
      "PFAS — near industrial sites in northeastern Ohio, military installations (Wright-Patterson AFB, Rickenbacker, LIMA tank plant area)",
      "Arsenic — southern Ohio shale geology; lower risk than western states but worth testing",
      "Atrazine and agricultural pesticides — Ohio's intensive corn and soybean agriculture creates pesticide runoff risk",
      "Iron and manganese — common throughout Ohio, particularly in glacial aquifers and bedrock wells",
      "Hardness and TDS — baseline water chemistry; Ohio water ranges from moderately hard to very hard",
      "Volatile organic compounds (VOCs) — northeastern Ohio industrial corridor (Akron, Canton, Cleveland exurbs)",
    ],
    commonRisks: [
      "Nitrate from agriculture — Ohio is one of the nation's most intensively farmed states; shallow wells in agricultural areas face significant nitrate risk, especially in the flat northwestern counties where tile drainage is prevalent",
      "Bacterial contamination from karst and shallow wells — northwest Ohio's limestone karst geology (Findlay Arch region) allows rapid movement of surface contaminants to groundwater; heavy rains can drive bacterial contamination into wells",
      "PFAS from industrial sources — northeastern Ohio has a dense industrial history; PFAS contamination from manufacturing, chrome plating, and firefighting foam use has been documented in several communities",
      "Radon — Ohio's glacial till and bedrock geology produces elevated radon; while primarily an indoor air concern, wells can be a secondary source of radon exposure in some areas",
      "Agricultural pesticides and herbicides — atrazine, acetochlor, and metolachlor are commonly detected in Ohio groundwater near corn and soybean operations",
      "Lead from older well components — Ohio's older rural housing stock frequently has lead-containing well pump fittings, pressure tanks, and galvanized pipes that can leach lead",
      "Legacy industrial contamination — the Mahoning Valley (Youngstown), the Rubber Capital (Akron), and other northeastern Ohio industrial areas have documented groundwater contamination plumes affecting some private wells",
    ],
    epaGuidanceUrl: "https://www.epa.gov/privatewells",
    stateLabUrl: "https://www.epa.ohio.gov/divisions-and-offices/drinking-and-ground-waters/private-water-systems",
    faqs: [
      {
        question: "How often should I test my Ohio well?",
        answer: "Annual testing for bacteria and nitrates is the Ohio EPA minimum recommendation. If your well has had any issues in the past, if you've had flooding, if you've noticed changes in taste, odor, or color, or if you live near agricultural land or a known contamination site, more frequent testing is warranted. A comprehensive test every 3–5 years (covering metals, VOCs, pesticides, and radiologicals) is recommended even if annual basic tests are clean.",
      },
      {
        question: "Is radon in Ohio well water a concern?",
        answer: "Ohio has moderately elevated geological radon, ranking in the upper half of states for indoor radon. Well water can contribute radon to indoor air when the water is used (showering releases dissolved radon as gas). Ohio EPA recommends testing indoor air radon first (test kits available for under $20). If indoor air exceeds 4 pCi/L, and you have a private well, testing water for radon as a possible contributing source makes sense. Aeration or granular activated carbon systems remove radon from water.",
      },
      {
        question: "What pesticides should I test for in Ohio well water?",
        answer: "Ohio's dominant crops (corn and soybeans) use atrazine, acetochlor, metolachlor, and glyphosate as primary herbicides. Atrazine and its breakdown products are the most commonly detected pesticides in Ohio groundwater. The EPA MCL for atrazine is 3 ppb. A comprehensive VOC/pesticide panel from a certified lab will detect these compounds. Testing is most valuable for shallow wells (under 100 feet) near row crop agriculture.",
      },
      {
        question: "Does Ohio have a well testing assistance program?",
        answer: "Ohio State University Extension offices in many counties offer subsidized or free well testing programs, particularly for bacteria and nitrates. The Ohio EPA also coordinates with county health departments on private well programs. Some counties (Licking, Delaware, Franklin exurbs) have specific programs given their rapid development and proximity to both agriculture and urban contamination sources. Contact your county health department for local resources.",
      },
      {
        question: "Is PFAS in Ohio well water?",
        answer: "PFAS contamination has been documented in Ohio groundwater in several areas: near Wright-Patterson Air Force Base in Dayton (one of the most significant PFAS plumes in the Midwest), near Rickenbacker in Columbus, and near various industrial sites in northeastern Ohio. The Ohio EPA has been expanding PFAS monitoring. Well owners within 2 miles of these sites or near any chrome plating, foam manufacturing, or AFFF-using facility should test for PFAS using a certified lab.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
];

export function getWellWaterGuideBySlug(slug: string): WellWaterGuide | undefined {
  return wellWaterGuides.find((g) => g.stateSlug === slug);
}

export default wellWaterGuides;
