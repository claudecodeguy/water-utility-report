export interface TreatmentMethod {
  slug: string;
  name: string;
  shortName: string;
  type: "point-of-use" | "point-of-entry" | "both";
  summary: string;
  description: string;
  howItWorks: string;
  solves: string[];
  doesNotSolve: string[];
  bestFor: string;
  installation: string;
  maintenance: string;
  costRange: string;
  certifications: string[];
  contaminants: string[];
  faqs: { question: string; answer: string }[];
  lastUpdated: string;
}

const treatmentMethods: TreatmentMethod[] = [
  {
    slug: "reverse-osmosis",
    name: "Reverse Osmosis Filtration",
    shortName: "Reverse Osmosis",
    type: "point-of-use",
    summary: "Reverse osmosis (RO) is the most comprehensive point-of-use water treatment technology available for residential use. It removes 90–99% of dissolved contaminants including PFAS, lead, arsenic, nitrates, and disinfection byproducts by forcing water through a semi-permeable membrane with pores of approximately 0.0001 microns.",
    description: "Reverse osmosis works by applying pressure to push water across a semi-permeable membrane that blocks dissolved salts, metals, chemicals, and most contaminants while allowing water molecules to pass through. A standard under-sink RO system includes a pre-sediment filter, a carbon pre-filter, the RO membrane, a post-carbon polishing filter, and a storage tank. Systems typically reject 3–4 gallons of water for every gallon of purified water produced.",
    howItWorks: "Household water pressure (40–80 PSI) forces water through progressively finer filtration stages. The RO membrane — the core of the system — has pores so small they block virtually all dissolved solids, bacteria, viruses, and most chemicals. The purified water collects in a pressurized storage tank under the sink; the concentrated waste water is directed to the drain.",
    solves: [
      "PFAS / PFOA / PFOS — 90–99% removal (NSF/ANSI 58 certified systems)",
      "Lead — 95–99% removal",
      "Arsenic — 90–95% removal",
      "Nitrates — 85–95% removal",
      "Total dissolved solids (TDS) — 90–95% reduction",
      "Disinfection byproducts (TTHMs, HAA5) — 90%+ removal",
      "Fluoride — 85–95% removal",
      "Chromium-6 — 80–90% removal",
      "Bacteria and viruses (as a secondary barrier)",
      "Chlorine and chloramine taste/odor",
    ],
    doesNotSolve: [
      "Does not treat the whole house — only the connected tap",
      "Does not remove dissolved gases (radon, hydrogen sulfide)",
      "Does not soften water (hardness minerals largely removed but purpose-specific softener is different)",
      "Reduces but does not eliminate all volatile organic compounds (VOCs) — carbon pre-filter handles most",
      "Wastes 3–4 gallons of water per gallon of purified water (some systems are more efficient)",
    ],
    bestFor: "Households with multiple contaminant concerns, PFAS or nitrate issues, or anyone wanting the broadest possible reduction in drinking water contaminants. Also the right choice when you want a single solution verified to address your specific water test results.",
    installation: "Standard under-sink installation requires 2–4 hours for a DIY-capable homeowner or a plumber. Requires a cold water supply line connection, a drain connection, and a small hole drilled in the sink or countertop for the dedicated faucet. No electrical connection needed for gravity-fed systems; some models have booster pumps requiring a power outlet.",
    maintenance: "Pre-filters (sediment and carbon): replace every 6–12 months. RO membrane: replace every 2–5 years depending on water quality and usage. Post-carbon filter: replace annually. Total annual filter cost typically $50–$150. Some systems have filter replacement indicator lights.",
    costRange: "$200–$600 for the unit; $50–$150/year for replacement filters. Professional installation adds $150–$300.",
    certifications: ["NSF/ANSI 58 (RO systems)", "NSF/ANSI 53 (contaminant reduction claims)", "WQA Gold Seal"],
    contaminants: ["pfas", "lead", "nitrates", "arsenic", "disinfection-byproducts"],
    faqs: [
      {
        question: "Does reverse osmosis remove PFAS?",
        answer: "Yes. RO systems certified to NSF/ANSI Standard 58 remove 90–99% of PFAS compounds including PFOA and PFOS. This makes RO one of the most effective residential technologies for the 'forever chemicals' that the EPA recently regulated.",
      },
      {
        question: "Is reverse osmosis water safe to drink?",
        answer: "Yes — RO water is very safe. It is among the purest water available from a home treatment system. Some people add a remineralization filter stage to restore beneficial minerals (calcium, magnesium) that the membrane removes. This is a preference issue, not a health necessity.",
      },
      {
        question: "How much water does reverse osmosis waste?",
        answer: "Traditional RO systems produce roughly 1 gallon of purified water for every 3–4 gallons that enter the system. High-efficiency models reduce this to 1:1 or better. The wastewater goes down the drain. In water-scarce areas, a high-efficiency model or one with a permeate pump is a more responsible choice.",
      },
      {
        question: "How do I know when to replace the RO membrane?",
        answer: "Most systems should have the membrane replaced every 2–5 years. Signs of a failing membrane include reduced water output, a noticeable decline in taste, or a TDS (total dissolved solids) meter showing the filtered water is rising in concentration. Many systems come with built-in TDS monitors.",
      },
      {
        question: "Can reverse osmosis be installed for a whole house?",
        answer: "Whole-home RO systems exist but are expensive ($1,500–$5,000+), require significant water pressure or booster pumps, and produce substantial waste water. Most experts recommend a standard RO system at the kitchen tap for drinking and cooking, with separate treatment (like a water softener) for the rest of the home.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "activated-carbon",
    name: "Activated Carbon Filtration",
    shortName: "Activated Carbon",
    type: "both",
    summary: "Activated carbon is the most widely used residential water treatment technology. It removes chlorine, taste and odor compounds, disinfection byproducts, many volatile organic compounds (VOCs), and — with NSF/ANSI 53 certification — lead and some PFAS. It is available as pitcher filters, under-sink units, and whole-house systems.",
    description: "Activated carbon is charcoal (typically made from coconut shell, coal, or wood) that has been processed to create an extremely porous surface area — one gram of activated carbon can have over 1,000 square meters of surface area. Contaminants in water adsorb (bind) to this surface as water passes through. Granular activated carbon (GAC) is common in pitcher filters and whole-house systems; carbon block filters offer finer filtration and are used in under-sink units.",
    howItWorks: "As water flows through the carbon bed or block, organic molecules, chlorine, and other compounds bind to the carbon surface through a process called adsorption. The carbon has a finite capacity — once all the binding sites are occupied, the filter stops working and must be replaced. This is why filter replacement schedules matter: an exhausted carbon filter can actually release previously captured contaminants.",
    solves: [
      "Chlorine and chloramine — virtually complete removal",
      "Taste and odor compounds — highly effective",
      "Disinfection byproducts (TTHMs, HAA5) — 85–95% reduction with carbon block",
      "PFAS — NSF/ANSI 58 certified under-sink units reduce PFAS significantly",
      "Lead — NSF/ANSI 53 certified filters reduce lead effectively",
      "Many volatile organic compounds (VOCs) including benzene and trichloroethylene",
      "Pesticides and herbicides — moderate to high reduction",
      "Radon (dissolved gas) — granular carbon is effective",
    ],
    doesNotSolve: [
      "Nitrates — carbon filters do not remove nitrate",
      "Arsenic — minimal removal; specialized media required",
      "Fluoride — not removed by standard carbon",
      "Heavy metals (other than lead with certified filters) — limited effectiveness",
      "Dissolved minerals / water hardness",
      "Bacteria and viruses — carbon is not a disinfectant",
      "Total dissolved solids (TDS)",
    ],
    bestFor: "Chlorine taste/odor, disinfection byproducts, and general water quality improvement. An NSF/ANSI 53 certified under-sink carbon block filter is an effective and affordable solution for households primarily concerned with chlorine, DBPs, and trace organics.",
    installation: "Pitcher filters require no installation. Under-sink filters take 1–2 hours to install and require a cold water line connection and a drain connection if it includes a separate faucet. Whole-house carbon systems require installation at the main water line, typically by a plumber.",
    maintenance: "Replace filters on schedule — this is critical. An overloaded carbon filter can release contaminants. Pitcher filters: every 40–60 gallons (roughly 2 months). Under-sink carbon: every 6 months. Whole-house carbon: every 6–12 months or per manufacturer specification based on water usage.",
    costRange: "Pitcher filters: $25–$60 plus $5–$10/month in replacement filters. Under-sink: $50–$300 plus $30–$80/year in filters. Whole-house: $300–$1,000 installed plus $100–$200/year in media.",
    certifications: ["NSF/ANSI 42 (aesthetic effects — taste, odor, chlorine)", "NSF/ANSI 53 (health effects — lead, cysts)", "NSF/ANSI 58 (for PFAS-rated under-sink carbon filters)"],
    contaminants: ["disinfection-byproducts", "pfas", "lead"],
    faqs: [
      {
        question: "Does a Brita or PUR filter remove PFAS?",
        answer: "Standard Brita pitcher filters (using GAC) have limited effectiveness against PFAS. However, Brita's Longlast+ filter and PUR's PLUS filter are NSF/ANSI 53/58 certified to reduce PFAS. Always check the specific product's certification — not all carbon filters are equal. Under-sink carbon block systems certified to NSF 58 offer more consistent PFAS reduction.",
      },
      {
        question: "What is the difference between granular activated carbon and carbon block?",
        answer: "Granular activated carbon (GAC) consists of loose carbon particles through which water channels find paths of least resistance, potentially bypassing some carbon. Carbon block filters compress carbon into a solid block, forcing all water through the carbon for more consistent and thorough contact. Carbon block is generally more effective for health-related contaminants.",
      },
      {
        question: "How often should I replace my carbon filter?",
        answer: "Always follow the manufacturer's schedule, but at minimum: pitcher filters every 40–60 gallons, under-sink filters every 6 months, whole-house systems every 6–12 months. An overused filter becomes a breeding ground for bacteria and can release previously captured contaminants. When in doubt, replace sooner.",
      },
      {
        question: "Does carbon filtration remove nitrates?",
        answer: "No. This is a common misconception. Activated carbon does not remove nitrates. If your water has elevated nitrates — common in agricultural areas and for private wells — you need a reverse osmosis system or an ion exchange system designed for nitrate removal.",
      },
      {
        question: "Can I use a carbon filter for well water?",
        answer: "Carbon filters can improve well water taste and odor and remove some organic compounds, but they should not be used as the sole treatment for well water unless you have confirmed that your only concerns are addressed by carbon. Well water often requires testing for bacteria, nitrates, arsenic, and other contaminants that carbon does not address.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "water-softener",
    name: "Water Softener (Ion Exchange)",
    shortName: "Water Softener",
    type: "point-of-entry",
    summary: "A salt-based water softener is the standard whole-home solution for hard water. It uses ion exchange to replace dissolved calcium and magnesium — the minerals responsible for scale, soap scum, and appliance damage — with sodium ions. Softeners protect plumbing and appliances but do not address health-based contaminants.",
    description: "Ion exchange water softeners contain a resin bed of negatively charged beads that attract and hold positively charged calcium (Ca²⁺) and magnesium (Mg²⁺) ions. As hard water passes through the resin, these hardness minerals are exchanged for sodium (Na⁺) ions. When the resin is saturated, the system regenerates automatically using a brine (salt) solution that flushes the captured minerals to the drain and recharges the resin with sodium.",
    howItWorks: "Hard water enters the resin tank and flows through millions of ion exchange resin beads. Calcium and magnesium bind to the resin, releasing sodium into the water. The softened water then flows to the home's plumbing. When the resin is depleted (typically every 3–7 days), the control valve initiates a regeneration cycle: brine from the salt tank washes the resin, releasing the hardness minerals to the drain, and the resin is recharged for another cycle.",
    solves: [
      "Scale buildup in pipes, water heaters, and appliances",
      "Soap and shampoo lathering — softened water requires significantly less soap",
      "Spots on dishes, glassware, and shower doors",
      "Skin and hair dryness associated with hard water",
      "Water heater efficiency — scale reduces efficiency by up to 30%",
      "Appliance longevity — dishwashers, washing machines, coffee makers",
      "Some heavy metals (barium, radium) are removed by ion exchange",
    ],
    doesNotSolve: [
      "PFAS, lead, nitrates, arsenic — requires separate filtration",
      "Bacteria and viruses",
      "Chlorine, taste, and odor",
      "Total dissolved solids (replaces calcium/magnesium with sodium — TDS remains similar)",
      "Disinfection byproducts",
    ],
    bestFor: "Homes with hard water (above 7 grains per gallon / 120 mg/L) experiencing scale buildup, spotty dishes, dry skin, or frequent appliance service. Nearly all of Arizona, Nevada, and Southern California benefit from softeners. Pair with a kitchen RO system for comprehensive treatment.",
    installation: "Whole-home softeners are installed at the main water line entry point, before the water heater. Installation requires: cutting the main supply line, installing bypass valves, plumbing connections, a drain line for regeneration waste, and a power outlet for the control valve. Professional installation is recommended: $300–$600.",
    maintenance: "Add water softener salt (sodium chloride or potassium chloride) to the brine tank as needed — typically every 4–6 weeks depending on water hardness and household usage. Check for salt bridges (a hardened crust that prevents brine from dissolving) annually. Resin beds last 10–20 years in most conditions.",
    costRange: "$400–$1,500 for the unit; $10–$25/month for salt depending on hardness and household size; professional installation $300–$600.",
    certifications: ["NSF/ANSI 44 (water softeners)", "WQA Gold Seal"],
    contaminants: ["hard-water"],
    faqs: [
      {
        question: "Is softened water safe to drink?",
        answer: "Yes, softened water is safe for most people. The sodium added by softening is modest — water softened from 300 mg/L hardness adds roughly 200 mg/L of sodium. People on strict sodium-restricted diets (typically <500 mg/day total) may want to use an unsoftened kitchen tap line or an RO system at the sink, which removes the added sodium.",
      },
      {
        question: "What type of salt should I use in a water softener?",
        answer: "Sodium chloride (NaCl) pellets or crystals are the most common and least expensive option. Potassium chloride (KCl) is an alternative that adds potassium instead of sodium and is environmentally preferable in areas concerned about sodium discharge to groundwater — but it costs 2–3× more. Avoid rock salt, which contains impurities that can clog the brine tank.",
      },
      {
        question: "Do water softeners remove PFAS or lead?",
        answer: "No. Ion exchange softeners are designed specifically for calcium and magnesium removal. They do not significantly remove PFAS, lead, nitrates, or most other health-based contaminants. If you have hard water AND contaminant concerns, the standard approach is a whole-home softener plus an under-sink reverse osmosis system for drinking water.",
      },
      {
        question: "How do I know what size softener I need?",
        answer: "Softener capacity is measured in grains. To size correctly, multiply your household's daily water usage (gallons per person × 80 gallons/person/day is a reasonable estimate) by your water hardness in grains per gallon (mg/L ÷ 17.1). A family of four with 15 gpg hardness needs about 4,800 grains/day capacity, so a 32,000-grain system sized for weekly regeneration is appropriate.",
      },
      {
        question: "What is the difference between a water softener and a water conditioner?",
        answer: "A traditional salt-based softener uses ion exchange to actually remove hardness minerals from the water. A 'salt-free conditioner' (template-assisted crystallization or TAC) does not remove calcium and magnesium but changes their form so they don't stick to surfaces as scale. Conditioners reduce scale but do not produce measurably soft water for soap lathering or skin feel.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "uv-purification",
    name: "UV Water Purification",
    shortName: "UV Purification",
    type: "point-of-use",
    summary: "Ultraviolet (UV) water purifiers use germicidal UV-C light to inactivate bacteria, viruses, and protozoa by damaging their DNA. UV is highly effective for microbial disinfection and leaves no chemical residue in the water. However, UV does not remove any chemical contaminants — it is a disinfection technology only, not a filtration technology.",
    description: "A UV water purifier passes water through a chamber where it is exposed to UV-C light at 254 nanometers wavelength — the optimal wavelength for microbial DNA disruption. UV light is lethal to bacteria, viruses, and protozoa (including Giardia and Cryptosporidium) but leaves no byproducts in the water. It does not change the taste, color, or chemistry of the water in any way.",
    howItWorks: "Water flows through a stainless steel chamber surrounding a UV lamp. The UV-C light penetrates the cell walls of microorganisms and disrupts their DNA, preventing reproduction. The process happens in seconds and requires no contact time — the water is ready to use immediately after passing through the chamber. UV systems require clear water to work effectively; turbid (cloudy) water blocks UV penetration.",
    solves: [
      "Bacteria — 99.9%+ inactivation (including E. coli, Salmonella, Legionella)",
      "Viruses — 99.9%+ inactivation (including norovirus, hepatitis A)",
      "Protozoa — Giardia and Cryptosporidium (which are resistant to chlorine)",
      "Algae and other microorganisms",
      "Eliminates chemical disinfection and its byproducts when used as primary disinfection",
    ],
    doesNotSolve: [
      "Chemical contaminants of any kind — PFAS, lead, nitrates, arsenic, DBPs",
      "Heavy metals, dissolved minerals",
      "Sediment, turbidity, or particulates (these must be pre-filtered)",
      "Chlorine taste or odor",
      "Hard water",
      "Fluoride",
    ],
    bestFor: "Private well owners concerned about bacterial or viral contamination — the most common well water health concern. Also used by municipalities as a secondary disinfection stage to address Cryptosporidium. UV is essential in any situation where boil water advisories have been issued or where surface water influence is suspected in well water.",
    installation: "UV systems are typically installed at the main water entry point (whole-home protection) or under the sink. Installation requires cutting the supply line, plumbing connections, and a power outlet for the lamp. Most systems include pre-sediment and carbon filters in series. Installation is a 2–4 hour project for a plumber.",
    maintenance: "Replace the UV lamp annually — even if it appears to be working, UV output degrades to below effective levels. Clean the quartz sleeve (which surrounds the lamp) every 6–12 months to remove mineral deposits that reduce UV transmission. Replace the pre-sediment filter every 3–6 months.",
    costRange: "$100–$500 for the unit; $50–$100/year for replacement lamps and sleeves.",
    certifications: ["NSF/ANSI 55 (Class A for all microorganisms; Class B for general reduction)", "NSF/ANSI 244 (microbiological water purifiers)"],
    contaminants: [],
    faqs: [
      {
        question: "Does UV purification remove PFAS or lead?",
        answer: "No. UV is a disinfection technology that targets microorganisms only. It has absolutely no effect on chemical contaminants like PFAS, lead, nitrates, arsenic, or disinfection byproducts. If you have chemical contamination concerns, you need a filtration technology (reverse osmosis or activated carbon) in addition to UV.",
      },
      {
        question: "Is UV water treatment better than chlorine?",
        answer: "UV and chlorine address the same problem (microbial disinfection) in different ways. UV is highly effective against Cryptosporidium and Giardia, which are resistant to chlorine — a significant advantage. UV leaves no chemical residual in the water (no taste, no byproducts), but it also provides no ongoing protection as water travels through pipes. Most municipal systems use both.",
      },
      {
        question: "Does my well water need UV treatment?",
        answer: "Well water is the primary application for UV systems. Unlike municipal water, private wells are not disinfected. Bacteria (E. coli, coliform), viruses, and protozoa are real risks in private wells, particularly after heavy rainfall or flooding. Annual bacteriological testing is recommended; UV treatment provides continuous protection.",
      },
      {
        question: "Why does my UV system need a pre-filter?",
        answer: "UV light cannot penetrate turbid (cloudy) water effectively. Particles and suspended solids block UV from reaching microorganisms. A sediment pre-filter (typically 5-micron) is essential before a UV unit. Many UV systems are sold as combination packages that include pre-filtration.",
      },
      {
        question: "How do I know if my UV lamp is working?",
        answer: "Most UV systems have an indicator light that shows the lamp is powered, but powered doesn't mean effective — lamp output degrades over time. Replace lamps annually regardless of appearance. Some systems include UV intensity sensors that alert you when output drops below safe levels.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
  {
    slug: "whole-house-filter",
    name: "Whole-House Water Filtration",
    shortName: "Whole-House Filter",
    type: "point-of-entry",
    summary: "Whole-house (point-of-entry) filtration systems treat all water entering a home before it reaches any tap, shower, or appliance. They are available in a range of media types targeting different contaminants. Most systems combine a sediment pre-filter with one or more treatment stages. The right system depends entirely on what contaminants are in your specific water supply.",
    description: "Whole-house filtration systems are installed at the main water supply line, ensuring every water outlet in the home receives treated water. Unlike under-sink systems that only treat drinking water, whole-house systems address dermal and inhalation exposure through bathing and showering — particularly relevant for volatile compounds like chloroform that can off-gas in showers. They are available as single-stage sediment filters, multi-stage carbon systems, iron/sulfur filters, and combination systems.",
    howItWorks: "Water from the main supply line passes through the filtration system before distribution throughout the home. Most systems have multiple stages: a sediment pre-filter catches particles and extends the life of subsequent stages; a primary treatment medium (carbon, catalytic carbon, KDF media, iron reduction media) addresses specific contaminants; and in some systems, a post-filter provides polishing. The correct configuration depends on your water test results.",
    solves: [
      "Chlorine and chloramine taste/odor throughout the home (with carbon media)",
      "Sediment, sand, and particles (with sediment pre-filter)",
      "Iron and manganese staining (with oxidizing filter media)",
      "Hydrogen sulfide odor ('rotten egg' smell from wells)",
      "Volatile organic compounds via carbon — reduced dermal/inhalation exposure in shower",
      "Disinfection byproducts — reduced throughout the home",
      "Turbidity and suspended particles",
    ],
    doesNotSolve: [
      "PFAS — standard whole-house carbon has limited PFAS capacity; specialized PFAS media exists but is expensive",
      "Lead — usually a household plumbing issue best addressed at the point of use",
      "Nitrates — requires reverse osmosis or ion exchange at point of use",
      "Bacteria and viruses — requires UV addition",
      "Hard water — requires ion exchange water softener",
    ],
    bestFor: "Homeowners on municipal water who want to reduce chlorine and DBP exposure throughout the home (including showers). Also the first treatment stage for well water, often combined with UV and an under-sink RO system for comprehensive treatment.",
    installation: "Installed at the main water supply line where it enters the home, before the water heater. Requires cutting the supply line, installing bypass valves, and plumbing in the filter housing. Professional installation is recommended; typical cost is $200–$400 in labor. Most systems fit a standard plumbing connection.",
    maintenance: "Sediment pre-filter: every 3–6 months. Carbon media: every 6–12 months for standard household use. Catalytic carbon (for chloramine): every 12 months. Iron/sulfur media: backwash regularly, replace every 5–10 years. Replace on schedule — overloaded filters reduce effectiveness and can harbor bacteria.",
    costRange: "$150–$800 for the system; $100–$300/year in replacement filters depending on system type and water quality.",
    certifications: ["NSF/ANSI 42 (aesthetic effects)", "NSF/ANSI 53 (health effects)", "NSF/ANSI 61 (drinking water system components)"],
    contaminants: ["disinfection-byproducts"],
    faqs: [
      {
        question: "Do I need a whole-house filter if I have an under-sink RO system?",
        answer: "An under-sink RO handles drinking and cooking water comprehensively, but a whole-house filter adds value for two reasons: it reduces your exposure to chlorine, DBPs, and VOCs through showering and bathing (these compounds are absorbed dermally and inhaled as steam), and it protects your plumbing and appliances from sediment.",
      },
      {
        question: "What whole-house filter do I need for well water?",
        answer: "It depends on your water test results. Common well water treatment configurations: (1) sediment filter → carbon filter → UV for bacterial protection with no major chemical issues; (2) iron filter → carbon filter → UV for iron/sulfur and bacteria; (3) water softener → carbon filter → UV for hard water with bacteria. Test your well water first — a comprehensive lab test ($50–$150) prevents buying the wrong system.",
      },
      {
        question: "How large a whole-house filter do I need?",
        answer: "Flow rate is the key sizing factor. Most households need a system rated for at least 10–15 gallons per minute (GPM). A 4.5\" × 20\" big blue filter housing provides adequate flow for most homes. Multiple bathrooms and high simultaneous use may require a larger system or parallel installation.",
      },
      {
        question: "Does a whole-house filter remove lead?",
        answer: "It can reduce some particulate lead, but lead contamination is usually from household plumbing or the service line — not the source water. A whole-house filter installed before the plumbing corrosion point won't help. For lead, an NSF/ANSI 53-certified point-of-use filter at the kitchen tap is the correct solution.",
      },
      {
        question: "How do I know what's in my water before buying a filter?",
        answer: "Start with your utility's Consumer Confidence Report (CCR), which lists what was detected and at what levels. For private well owners or anyone wanting current data, order a comprehensive water test from a state-certified lab — test for the contaminants most relevant to your area. Armed with actual test results, you can match a filter system to your specific needs rather than guessing.",
      },
    ],
    lastUpdated: "2025-01-15",
  },
];

export function getTreatmentBySlug(slug: string): TreatmentMethod | undefined {
  return treatmentMethods.find((t) => t.slug === slug);
}

export default treatmentMethods;
