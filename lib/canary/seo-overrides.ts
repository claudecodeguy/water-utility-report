export type ConversionCtaVariant = "save_utility" | "pfas_updates" | "no_records" | "email_report";

export interface CanaryOverride {
  title: string;
  description: string;
  answerHeadline: string;
  introSentence: string;
  recordsFacts: string;
  sourceNote: string;
  links: { href: string; label: string }[];
  // Conversion canary — gated UI additions. Does not affect SEO fields above.
  conversionCanary?: boolean;
  ctaVariant?: ConversionCtaVariant;
  // Interpreter canary — shows WaterRecordInterpreter module. Does not affect SEO fields.
  showInterpreter?: boolean;
}

// ─── PFAS WATCHLIST CANARY OVERRIDES ─────────────────────────────────────────
// Keyed by uppercase PWSID. Applied only to /pfas-watchlist/utility/[pwsid] pages.

export const PFAS_WATCHLIST_CANARY_OVERRIDES: Record<string, CanaryOverride> = {
  // Lakewood Township MUA (NJ) — 495 impressions, PFOA 4.3 ppt (above 4 ppt EPA MCL)
  NJ1514002: {
    conversionCanary: true,
    ctaVariant: "pfas_updates",
    showInterpreter: true,
    title: "Lakewood Township MUA PFAS Records — PFOA Detection & EPA UCMR 5 Data",
    description:
      "Check official EPA UCMR 5 PFAS monitoring records for Lakewood Township MUA (PWSID NJ1514002), including PFOA detection data, analyte results, source records, and testing options.",
    answerHeadline: "Official PFAS Monitoring Records For Lakewood Township MUA",
    introSentence:
      "This section summarizes official EPA UCMR 5 PFAS monitoring records available for Lakewood Township Municipal Utilities Authority (PWSID NJ1514002), serving approximately 27,614 residents in Ocean County, New Jersey.",
    recordsFacts:
      "EPA UCMR 5 sampling records for Lakewood Township MUA (PWSID NJ1514002) include results sampled April 3, 2024. PFOA was recorded at 0.0043 µg/L (4.3 parts per trillion), detected above the minimum reporting level. The EPA maximum contaminant level for PFOA is 4 ppt. PFOS was sampled and returned a value of 0.004 µg/L — not detected above the minimum reporting level. Six additional PFAS analytes — PFHxS, PFHpS, PFBS, PFDoA, and others — were sampled and all returned values below the minimum reporting level. These are monitoring records under the Unregulated Contaminant Monitoring Rule, Round 5. UCMR 5 detection records are distinct from SDWIS violation records. Confirm current compliance status via EPA ECHO.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset (2023–2025). PWSID NJ1514002. Confirm current PFAS compliance action status via EPA ECHO or New Jersey DEP.",
    links: [
      { href: "/pfas-watchlist/new-jersey", label: "New Jersey PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/learn/ucmr5-pfas-water-sampling-explained", label: "How UCMR 5 sampling works" },
      { href: "/learn/pfas-detected-but-no-violation", label: "Detection records vs. violations explained" },
      { href: "/labs/pfas-water-testing", label: "PFAS water testing guidance" },
    ],
  },
};

// Protected canary allowlist.
// Eligibility: impressions ≥ 100, clicks = 0, avg position ≤ 10.
// Do NOT add pages that already generate organic clicks.
// Do NOT use safety determinations (safe / unsafe / dangerous / contaminated).
// UCMR 5 data is monitoring data — do not frame as a violation unless matched to an SDWIS violation record.
export const CANARY_OVERRIDES: Record<string, CanaryOverride> = {
  centerville: {
    conversionCanary: true,
    ctaVariant: "pfas_updates",
    showInterpreter: true,
    title: "Centerville GA PFAS Sampling & EPA Water Records",
    description:
      "Check official water records for Centerville, GA, including UCMR 5 PFAS sampling, PWSID, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For Centerville",
    introSentence:
      "This section summarizes official drinking-water records available for Centerville (PWSID GA1530000), including PFAS/UCMR 5 sampling records, violation history, and source links.",
    recordsFacts:
      "EPA UCMR 5 sampling records for Centerville (PWSID GA1530000) include a PFOA reading of 5 ppt, recorded July 10, 2024. PFOS was sampled at 4 ppt on the same date, at the minimum reporting level. These are monitoring records under the Unregulated Contaminant Monitoring Rule, Round 5. EPA SDWIS records for this system show historical violation records — a coliform monitoring record (2017, resolved) and a nitrate monitoring record (2002, resolved). No open health-based violation records are currently shown in the datasets used by this site. The utility serves approximately 11,459 residents in Centerville, Houston County, Georgia.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset; EPA SDWIS compliance records. PWSID GA1530000. Confirm current status via EPA ECHO.",
    links: [
      { href: "/utilities/centerville/records", label: "Official source records" },
      { href: "/pfas-watchlist/georgia", label: "Georgia PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/treatment/reverse-osmosis", label: "Treatment guidance" },
      { href: "/labs?state=georgia", label: "Certified water testing labs in Georgia" },
    ],
  },

  "billerica-water-works": {
    conversionCanary: true,
    ctaVariant: "pfas_updates",
    showInterpreter: true,
    title: "Billerica Water Works PFAS Records & EPA Violation History",
    description:
      "Check official water records for Billerica Water Works, including PFAS sampling, violation history where available, PWSID, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For Billerica Water Works",
    introSentence:
      "This section summarizes official drinking-water records available for Billerica Water Works (PWSID MA3031000), including PFAS/UCMR 5 sampling records, violation history, and source links.",
    recordsFacts:
      "EPA UCMR 5 sampling records for Billerica Water Works (PWSID MA3031000) include a PFPeA (perfluoropentanoic acid) reading detected above the minimum reporting level as of August 7, 2025. Additional analytes sampled on the same date — PFHpS, 8:2FTS, PFMPA, and PFPeS — returned values below the minimum reporting level. Separately, EPA SDWIS records for this system include three health-based MCL violation records (the source identifies them as health-based) spanning 2022 through 2026; two do not have a resolution date in the datasets used by this site. The contaminant associated with those records is not identified in the current dataset. The utility serves approximately 42,000 residents in Billerica, Middlesex County, Massachusetts.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset; EPA SDWIS compliance records. PWSID MA3031000. Confirm current status via EPA ECHO.",
    links: [
      { href: "/utilities/billerica-water-works/records", label: "Official source records" },
      { href: "/pfas-watchlist/massachusetts", label: "Massachusetts PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/labs/pfas-water-testing", label: "PFAS water testing guidance" },
      { href: "/treatment/reverse-osmosis", label: "Treatment guidance" },
    ],
  },

  "berkeley-twp-mua": {
    conversionCanary: true,
    ctaVariant: "save_utility",
    showInterpreter: true,
    title: "Berkeley Township MUA Water Quality & Violation Records",
    description:
      "Check official water records for Berkeley Township MUA, including violation history, PFAS sampling records, PWSID, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For Berkeley Township MUA",
    introSentence:
      "This section summarizes official drinking-water records available for Berkeley Township MUA (PWSID NJ1505004), including PFAS/UCMR 5 sampling records, violation history, and source links.",
    recordsFacts:
      "EPA SDWIS records for Berkeley Township MUA (PWSID NJ1505004) show a nitrate-related violation record opened July 1, 2024, with a resolution date of August 22, 2024. That record is classified as a monitoring and reporting record, not a health-based violation. Prior records include a coliform monitoring record (October 2022, resolved) and a nitrate monitoring record (July 2021, resolved). No health-based violation records are currently shown for this system in the datasets used by this site. EPA UCMR 5 sampling records from June 10, 2024 show five PFAS analytes sampled — PFTrDA, PFDA, NEtFOSAA, NMeFOSAA, and PFMPA — all returned values below the minimum reporting level. The utility serves approximately 11,800 residents in Berkeley Township, Ocean County, New Jersey.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID NJ1505004. Confirm current status via EPA ECHO.",
    links: [
      { href: "/utilities/berkeley-twp-mua/records", label: "Official source records" },
      { href: "/pfas-watchlist/new-jersey", label: "New Jersey PFAS monitoring records" },
      { href: "/contaminants/nitrates", label: "Nitrate records and guidance" },
      { href: "/labs?state=new-jersey", label: "Certified water testing labs in New Jersey" },
      { href: "/states/new-jersey", label: "New Jersey state water records" },
    ],
  },

  "city-of-watsonville": {
    conversionCanary: true,
    ctaVariant: "save_utility",
    showInterpreter: true,
    title: "City of Watsonville UCMR 5 Sampling & Water Records",
    description:
      "Check official water records for the City of Watsonville, including UCMR 5 PFAS sampling, PWSID, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For City of Watsonville",
    introSentence:
      "This section summarizes official drinking-water records available for the City of Watsonville (PWSID CA4410011), including PFAS/UCMR 5 sampling records, violation history, and source links.",
    recordsFacts:
      "EPA UCMR 5 sampling records for the City of Watsonville (PWSID CA4410011) include results for five PFAS analytes as of October 9, 2024 — PFTeDA, PFMPA, PFPeA, PFTrDA, and 8:2FTS — all returned values below the minimum reporting level. No violation records of any type are currently shown for this system in the datasets used by this site. The utility serves approximately 65,000 residents in Santa Cruz County, California.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset (2023–2025); EPA SDWIS compliance records. PWSID CA4410011. Confirm current status via EPA ECHO.",
    links: [
      { href: "/utilities/city-of-watsonville/records", label: "Official source records" },
      { href: "/pfas-watchlist/california", label: "California PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/labs?state=california", label: "Certified water testing labs in California" },
      { href: "/states/california", label: "California state water records" },
    ],
  },

  "medway-water-department": {
    conversionCanary: true,
    ctaVariant: "save_utility",
    showInterpreter: true,
    title: "Medway Water Department PFAS Sampling & EPA Records",
    description:
      "Check official water records for Medway Water Department, including PFAS sampling, monitoring/reporting records where available, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For Medway Water Department",
    introSentence:
      "This section summarizes official drinking-water records available for Medway Water Department (PWSID MA2177000), including PFAS/UCMR 5 sampling records, violation history, and source links.",
    recordsFacts:
      "EPA UCMR 5 sampling records for Medway Water Department (PWSID MA2177000) include results for five PFAS analytes as of November 4, 2025 — 8:2FTS, PFMPA, PFBS, 4:2FTS, and PFPeA — all returned values below the minimum reporting level. EPA SDWIS records show three monitoring and reporting records opened July 2023, without resolution dates in the current dataset. Those records are classified as monitoring and reporting records, not health-based violations. No contaminant is identified for those records in the datasets used by this site. The utility serves approximately 13,000 residents in Medway, Norfolk County, Massachusetts.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset; EPA SDWIS compliance records. PWSID MA2177000. Confirm current status via EPA ECHO.",
    links: [
      { href: "/utilities/medway-water-department/records", label: "Official source records" },
      { href: "/pfas-watchlist/massachusetts", label: "Massachusetts PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/labs/pfas-water-testing", label: "PFAS water testing guidance" },
      { href: "/labs?state=massachusetts", label: "Certified water testing labs in Massachusetts" },
    ],
  },

  // ── Labette County RWD 5 (KS) — 3342 impressions, "labette county water contamination" ──
  "labette-co-rwd-5": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "Labette County RWD 5 Water Records & EPA Source Data — Kansas",
    description:
      "Check official water records for Labette County Rural Water District 5, including PWSID KS2009906, source links, violation history, and testing options for Oswego and Labette County, Kansas.",
    answerHeadline: "Official Drinking Water Records For Labette County RWD 5",
    introSentence:
      "This section summarizes official drinking-water records available for Labette County Rural Water District 5 (PWSID KS2009906), serving approximately 1,635 residents in Oswego and the surrounding Labette County area, Kansas.",
    recordsFacts:
      "No PFAS detection records from EPA UCMR 5 sampling have been located for Labette County RWD 5 (PWSID KS2009906) in the datasets currently used by this site. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The absence of a record in this dataset does not confirm a contaminant was absent — federal datasets may be incomplete or lag behind local conditions. For current information, the utility or Kansas Department of Health and Environment is the authoritative source.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID KS2009906. Confirm current status via EPA ECHO or KDHE.",
    links: [
      { href: "/utilities/labette-co-rwd-5/records", label: "Official source records" },
      { href: "/pfas-watchlist/kansas", label: "Kansas PFAS monitoring records" },
      { href: "/help/no-pfas-record-found-meaning", label: "What a missing PFAS record means" },
      { href: "/labs?state=kansas", label: "Certified water testing labs in Kansas" },
      { href: "/states/kansas", label: "Kansas state water records" },
    ],
  },

  // ── Labette County RWD 7 (KS) — 412 impressions, same Labette query cluster ──
  "labette-co-rwd-7": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "Labette County RWD 7 Water Records & EPA Source Data — Kansas",
    description:
      "Check official water records for Labette County Rural Water District 7, including PWSID KS2009912, source links, violation history, and testing options for Labette County, Kansas.",
    answerHeadline: "Official Drinking Water Records For Labette County RWD 7",
    introSentence:
      "This section summarizes official drinking-water records available for Labette County Rural Water District 7 (PWSID KS2009912), serving approximately 540 residents in Labette County, Kansas.",
    recordsFacts:
      "No PFAS detection records from EPA UCMR 5 sampling have been located for Labette County RWD 7 (PWSID KS2009912) in the datasets currently used by this site. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The absence of a record does not confirm a contaminant was absent — federal datasets may be incomplete or lag behind local conditions. For current information, contact the utility or the Kansas Department of Health and Environment directly.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID KS2009912. Confirm current status via EPA ECHO or KDHE.",
    links: [
      { href: "/utilities/labette-co-rwd-7/records", label: "Official source records" },
      { href: "/utilities/labette-co-rwd-5", label: "Labette County RWD 5 records" },
      { href: "/pfas-watchlist/kansas", label: "Kansas PFAS monitoring records" },
      { href: "/help/no-pfas-record-found-meaning", label: "What a missing PFAS record means" },
      { href: "/labs?state=kansas", label: "Certified water testing labs in Kansas" },
    ],
  },

  // ── Bloomington Township PWD West Phase (IL) — 1355 impressions ──
  "bloomington-township-pwd-west-phase": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "Bloomington Township PWD West Phase Water Records — Illinois",
    description:
      "Check official water records for Bloomington Township PWD West Phase, including PWSID IL1130040, source links, violation history, and testing options for McLean County, Illinois.",
    answerHeadline: "Official Drinking Water Records For Bloomington Township PWD West Phase",
    introSentence:
      "This section summarizes official drinking-water records available for Bloomington Township PWD West Phase (PWSID IL1130040), serving approximately 1,800 residents in McLean County, Illinois.",
    recordsFacts:
      "No PFAS detection records from EPA UCMR 5 sampling have been located for Bloomington Township PWD West Phase (PWSID IL1130040) in the datasets currently used by this site. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The absence of a record does not confirm a contaminant was absent — federal monitoring datasets may be incomplete or lag behind local conditions. For current records, contact the utility or the Illinois EPA directly.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID IL1130040. Confirm current status via EPA ECHO or Illinois EPA.",
    links: [
      { href: "/utilities/bloomington-township-pwd-west-phase/records", label: "Official source records" },
      { href: "/pfas-watchlist/illinois", label: "Illinois PFAS monitoring records" },
      { href: "/help/no-pfas-record-found-meaning", label: "What a missing PFAS record means" },
      { href: "/labs?state=illinois", label: "Certified water testing labs in Illinois" },
      { href: "/states/illinois", label: "Illinois state water records" },
    ],
  },

  // ── Farmer City (IL) — 1256 impressions, pos 6.08 ──
  "farmer-city": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "Farmer City Water Records & EPA Source Data — Illinois",
    description:
      "Check official water records for Farmer City, including PWSID IL0390150, source links, violation history, and testing options for De Witt County, Illinois.",
    answerHeadline: "Official Drinking Water Records For Farmer City",
    introSentence:
      "This section summarizes official drinking-water records available for Farmer City (PWSID IL0390150), serving approximately 2,055 residents in Farmer City, De Witt County, Illinois.",
    recordsFacts:
      "No PFAS detection records from EPA UCMR 5 sampling have been located for Farmer City (PWSID IL0390150) in the datasets currently used by this site. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The absence of a record in this dataset does not confirm that a contaminant was absent — federal datasets may be incomplete or may not yet reflect recent sampling. For current records, contact the utility or Illinois EPA.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID IL0390150. Confirm current status via EPA ECHO or Illinois EPA.",
    links: [
      { href: "/utilities/farmer-city/records", label: "Official source records" },
      { href: "/pfas-watchlist/illinois", label: "Illinois PFAS monitoring records" },
      { href: "/help/no-pfas-record-found-meaning", label: "What a missing PFAS record means" },
      { href: "/labs?state=illinois", label: "Certified water testing labs in Illinois" },
      { href: "/states/illinois", label: "Illinois state water records" },
    ],
  },

  // ── Ada Village (OH) — 802 impressions, 8 PFAS sampled all below MRL ──
  "ada-village": {
    conversionCanary: true,
    ctaVariant: "pfas_updates",
    showInterpreter: true,
    title: "Ada Village UCMR 5 Sampling & EPA Water Records — Ohio",
    description:
      "Check official water records for Ada Village, including UCMR 5 PFAS sampling records, PWSID OH3300012, source links, and testing options for Hardin County, Ohio.",
    answerHeadline: "Official Drinking Water Records For Ada Village",
    introSentence:
      "This section summarizes official drinking-water records available for Ada Village (PWSID OH3300012), serving approximately 5,334 residents in Hardin County, Ohio, including PFAS/UCMR 5 sampling records and violation history.",
    recordsFacts:
      "EPA UCMR 5 sampling records for Ada Village (PWSID OH3300012) include results for eight PFAS analytes sampled October 18, 2023 — PFNA, 9Cl-PF3ONS, PFHpS, PFTeDA, HFPO-DA, and three additional compounds. All eight analytes returned values below the minimum reporting level. No analytes were detected above the MRL in the current dataset. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The utility serves approximately 5,334 residents in Hardin County, Ohio.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset (2023–2025); EPA SDWIS compliance records. PWSID OH3300012. Confirm current status via EPA ECHO or Ohio EPA.",
    links: [
      { href: "/utilities/ada-village/records", label: "Official source records" },
      { href: "/pfas-watchlist/ohio", label: "Ohio PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/learn/ucmr5-pfas-water-sampling-explained", label: "How UCMR 5 sampling works" },
      { href: "/labs?state=ohio", label: "Certified water testing labs in Ohio" },
    ],
  },

  // ── Vermilion City (OH) — 553 impressions, PFAS below MRL, nitrate/reporting violations ──
  "vermilion-city": {
    conversionCanary: true,
    ctaVariant: "save_utility",
    showInterpreter: true,
    title: "Vermilion Water Records — PFAS Sampling, Violations & EPA Source Data",
    description:
      "Check official water records for Vermilion, Ohio, including UCMR 5 PFAS sampling, violation history, PWSID OH2201511, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For Vermilion",
    introSentence:
      "This section summarizes official drinking-water records available for Vermilion (PWSID OH2201511), serving approximately 10,594 residents in Erie County, Ohio, including PFAS/UCMR 5 sampling records and violation history.",
    recordsFacts:
      "EPA UCMR 5 sampling records for Vermilion (PWSID OH2201511) include results for eight PFAS analytes sampled September 5, 2024 — NMeFOSAA, PFBS, PFHpA, PFHxS, PFHpS, and three additional compounds. All eight analytes returned values below the minimum reporting level. EPA SDWIS records for this system include monitoring and reporting records: a reporting record opened July 2, 2025 (no resolution date in current data), a nitrate-related monitoring record opened December 2, 2024, and a prior nitrate monitoring record from July 2020. All are classified as monitoring and reporting records, not health-based violations. The utility serves approximately 10,594 residents in Erie County, Ohio.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset; EPA SDWIS compliance records. PWSID OH2201511. Confirm current status via EPA ECHO or Ohio EPA.",
    links: [
      { href: "/utilities/vermilion-city/records", label: "Official source records" },
      { href: "/pfas-watchlist/ohio", label: "Ohio PFAS monitoring records" },
      { href: "/contaminants/nitrates", label: "Nitrate monitoring records" },
      { href: "/help/monitoring-reporting-violation-meaning", label: "What a monitoring record means" },
      { href: "/labs?state=ohio", label: "Certified water testing labs in Ohio" },
    ],
  },

  // ── Aqua PA Hamilton Water Co (PA) — 528 impressions, no data ──
  "aqua-pa-hamilton-water-co": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "Aqua PA Hamilton Water Co — EPA Records & Utility Lookup",
    description:
      "Check official water records for Aqua PA Hamilton Water Co, including PWSID PA2450044, source links, violation history, and testing options for Hamilton Township, Pennsylvania.",
    answerHeadline: "Official Drinking Water Records For Aqua PA Hamilton Water Co",
    introSentence:
      "This section summarizes official drinking-water records available for Aqua PA Hamilton Water Co (PWSID PA2450044), serving approximately 1,500 residents in Hamilton Township, Pennsylvania.",
    recordsFacts:
      "No PFAS detection records from EPA UCMR 5 sampling have been located for Aqua PA Hamilton Water Co (PWSID PA2450044) in the datasets currently used by this site. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The absence of a record does not confirm a contaminant was absent — federal datasets may be incomplete or may not yet reflect recent sampling. For current records, contact Aqua Pennsylvania or the Pennsylvania Department of Environmental Protection.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID PA2450044. Confirm current status via EPA ECHO or PA DEP.",
    links: [
      { href: "/utilities/aqua-pa-hamilton-water-co/records", label: "Official source records" },
      { href: "/pfas-watchlist/pennsylvania", label: "Pennsylvania PFAS monitoring records" },
      { href: "/help/no-pfas-record-found-meaning", label: "What a missing PFAS record means" },
      { href: "/labs?state=pennsylvania", label: "Certified water testing labs in Pennsylvania" },
      { href: "/states/pennsylvania", label: "Pennsylvania state water records" },
    ],
  },

  // ── Enfield (IL) — 467 impressions, no data ──
  "enfield": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "Enfield Illinois Water Records — EPA Source Data & PWSID IL1930200",
    description:
      "Check official water records for Enfield, Illinois, including PWSID IL1930200, source links, violation history, and testing options for White County, Illinois.",
    answerHeadline: "Official Drinking Water Records For Enfield",
    introSentence:
      "This section summarizes official drinking-water records available for Enfield (PWSID IL1930200), serving approximately 1,064 residents in Enfield, White County, Illinois.",
    recordsFacts:
      "No PFAS detection records from EPA UCMR 5 sampling have been located for Enfield (PWSID IL1930200) in the datasets currently used by this site. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The absence of a record in this dataset does not confirm that a contaminant was absent. For current information, contact the utility or the Illinois Environmental Protection Agency.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID IL1930200. Confirm current status via EPA ECHO or Illinois EPA.",
    links: [
      { href: "/utilities/enfield/records", label: "Official source records" },
      { href: "/pfas-watchlist/illinois", label: "Illinois PFAS monitoring records" },
      { href: "/help/no-pfas-record-found-meaning", label: "What a missing PFAS record means" },
      { href: "/labs?state=illinois", label: "Certified water testing labs in Illinois" },
      { href: "/states/illinois", label: "Illinois state water records" },
    ],
  },

  // ── Norris City (IL) — 416 impressions, no data ──
  "norris-city": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "Norris City Water Records — EPA Source Data & PWSID IL1930350",
    description:
      "Check official water records for Norris City, Illinois, including PWSID IL1930350, source links, violation history, and testing options for White County, Illinois.",
    answerHeadline: "Official Drinking Water Records For Norris City",
    introSentence:
      "This section summarizes official drinking-water records available for Norris City (PWSID IL1930350), serving approximately 2,155 residents in Norris City, White County, Illinois.",
    recordsFacts:
      "No PFAS detection records from EPA UCMR 5 sampling have been located for Norris City (PWSID IL1930350) in the datasets currently used by this site. No violation records of any type are currently shown for this system in EPA SDWIS records available to this site. The absence of a record in this dataset does not confirm that a contaminant was absent. Federal datasets may be incomplete or may not yet reflect recent local sampling or monitoring. For current information, contact the utility or the Illinois Environmental Protection Agency.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 monitoring dataset. PWSID IL1930350. Confirm current status via EPA ECHO or Illinois EPA.",
    links: [
      { href: "/utilities/norris-city/records", label: "Official source records" },
      { href: "/utilities/enfield", label: "Enfield water records (White County)" },
      { href: "/pfas-watchlist/illinois", label: "Illinois PFAS monitoring records" },
      { href: "/help/no-pfas-record-found-meaning", label: "What a missing PFAS record means" },
      { href: "/labs?state=illinois", label: "Certified water testing labs in Illinois" },
    ],
  },

  // ── Watsonville City Of (CA) — 1039 impressions — slug alias for city-of-watsonville ──
  "watsonville-city-of": {
    conversionCanary: true,
    ctaVariant: "save_utility",
    showInterpreter: true,
    title: "City of Watsonville UCMR 5 Sampling & Water Records",
    description:
      "Check official water records for the City of Watsonville, including UCMR 5 PFAS sampling, PWSID CA4410011, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For City of Watsonville",
    introSentence:
      "This section summarizes official drinking-water records available for the City of Watsonville (PWSID CA4410011), including PFAS/UCMR 5 sampling records, violation history, and source links.",
    recordsFacts:
      "EPA UCMR 5 sampling records for the City of Watsonville (PWSID CA4410011) include results for five PFAS analytes as of October 9, 2024 — PFTeDA, PFMPA, PFPeA, PFTrDA, and 8:2FTS — all returned values below the minimum reporting level. No violation records of any type are currently shown for this system in the datasets used by this site. The utility serves approximately 65,000 residents in Santa Cruz County, California.",
    sourceNote:
      "EPA UCMR 5 monitoring dataset (2023–2025); EPA SDWIS compliance records. PWSID CA4410011. Confirm current status via EPA ECHO.",
    links: [
      { href: "/utilities/watsonville-city-of/records", label: "Official source records" },
      { href: "/pfas-watchlist/california", label: "California PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/labs?state=california", label: "Certified water testing labs in California" },
      { href: "/states/california", label: "California state water records" },
    ],
  },

  "north-miami-beach": {
    conversionCanary: true,
    ctaVariant: "no_records",
    showInterpreter: true,
    title: "North Miami Beach UCMR 5 & EPA Water Records",
    description:
      "Check official water records for North Miami Beach, including UCMR 5 records, violation history where available, PWSID, source links, and testing options.",
    answerHeadline: "Official Drinking Water Records For North Miami Beach",
    introSentence:
      "This section summarizes official drinking-water records available for North Miami Beach (PWSID FL4131618), including PFAS/UCMR 5 sampling records, violation history, and source links.",
    recordsFacts:
      "EPA SDWIS records for North Miami Beach (PWSID FL4131618) show three monitoring and reporting records as of the latest data available to this site — two classified as total coliform monitoring records (opened June 2024 and December 2024) and one classified as an E. coli monitoring record (opened January 2024), all without resolution dates in the current dataset. All three are classified as monitoring and reporting records, not health-based violations. No PFAS detection records from EPA UCMR 5 sampling have been located for this utility in the datasets currently used by this site; this does not confirm PFAS was absent. The utility serves approximately 180,000 residents in North Miami Beach, Florida.",
    sourceNote:
      "EPA SDWIS compliance records; EPA UCMR 5 dataset. PWSID FL4131618. Confirm UCMR 5 participation status and current records via EPA ECHO.",
    links: [
      { href: "/utilities/north-miami-beach/records", label: "Official source records" },
      { href: "/pfas-watchlist/florida", label: "Florida PFAS monitoring records" },
      { href: "/contaminants/pfas", label: "PFAS monitoring guidance" },
      { href: "/labs?state=florida", label: "Certified water testing labs in Florida" },
      { href: "/states/florida", label: "Florida state water records" },
    ],
  },
};
