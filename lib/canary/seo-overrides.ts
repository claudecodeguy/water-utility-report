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
