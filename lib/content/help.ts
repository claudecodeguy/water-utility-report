export type HelpBlock =
  | { t: "p"; c: string }
  | { t: "h2"; c: string }
  | { t: "h3"; c: string }
  | { t: "ul"; items: string[] }
  | { t: "ol"; items: string[] }
  | { t: "callout"; c: string; variant?: "info" | "warning" | "highlight" }
  | { t: "email-template"; subject: string; body: string[] };

export type HelpGroup =
  | "understanding"
  | "pfas"
  | "violations"
  | "testing"
  | "utility-contact";

export interface HelpCheckNext {
  label: string;
  href: string;
  desc?: string;
  cta?: boolean; // marks save-utility / email-report CTAs for client-side rendering
}

export interface HelpArticle {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishDate: string;
  lastUpdated: string;
  group: HelpGroup;
  intro: string;
  helpsWith: string[];
  officialRecordsCanShow: string[];
  officialRecordsMayNotShow: string[];
  blocks: HelpBlock[];
  whatToCheckNext: HelpCheckNext[];
  faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  relatedPages: { href: string; label: string; desc?: string }[];
}

export const helpGroupMeta: Record<HelpGroup, { label: string; desc: string }> = {
  understanding: {
    label: "Understanding Water Records",
    desc: "What official records mean and how to read them correctly.",
  },
  pfas: {
    label: "PFAS and Sampling Records",
    desc: "PFAS detections, UCMR 5 monitoring, and what sampling records show.",
  },
  violations: {
    label: "Violations and Reporting Records",
    desc: "The difference between health-based violations and monitoring/reporting records.",
  },
  testing: {
    label: "Testing and Household Next Steps",
    desc: "When and how to test your own water, and what to look for.",
  },
  "utility-contact": {
    label: "Utility Contact and Source Verification",
    desc: "How to find your utility, request records, and verify source data.",
  },
};

const helpArticles: HelpArticle[] = [
  // ── 1 ─────────────────────────────────────────────────────────────────────
  {
    slug: "what-to-do-after-reading-water-report",
    title: "What to Do After Reading Your Utility's Water Records",
    metaTitle: "What to Do After Reading Your Water Utility Report | Water Records Help",
    metaDescription:
      "After reviewing a utility's official records, here is the recommended order of steps: confirm the utility, check source links, review PFAS and violation records, and decide on testing.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "understanding",
    intro:
      "After reviewing a utility's records on Water Utility Report, the most useful next step is to check which record types are present, verify the official source, and decide whether household-specific testing makes sense.",
    helpsWith: [
      "Understanding the order in which to review official records",
      "Knowing what to verify directly with your utility",
      "Deciding whether a third-party water test is relevant",
      "Saving your utility to get future record updates",
      "Understanding what these records do and do not tell you",
    ],
    officialRecordsCanShow: [
      "Violation history reported to EPA through the Safe Drinking Water Information System (SDWIS)",
      "PFAS and other contaminant sampling records from UCMR 5 and other monitoring programs",
      "Consumer Confidence Report links where available in EPA-tracked databases",
      "Public water system identification numbers (PWSID) and service area information",
    ],
    officialRecordsMayNotShow: [
      "Federal records may lag weeks to months behind current local conditions",
      "Local utility notices, boil-water advisories, and press releases are not part of federal SDWIS records",
      "Missing or incomplete records do not confirm a contaminant is absent",
      "Utility-level records reflect sampling at official monitoring points, not at every household tap",
      "Private wells are not covered by public utility records",
    ],
    blocks: [
      { t: "h2", c: "Recommended order of review" },
      { t: "ol", items: [
        "Confirm the utility name and PWSID match your actual water provider.",
        "Check source links — verify whether a Consumer Confidence Report or official data source is linked.",
        "Review PFAS and UCMR 5 sampling records if present. Note that detections are not automatically violations.",
        "Review the violation history. Note whether violations are health-based or monitoring/reporting in nature.",
        "Read the 'What this does not mean' section on any record type you are unsure about.",
        "Check your utility's own website or Consumer Confidence Report for context on treatment and compliance plans.",
        "Consider independent testing if your concern is household-specific — for example, if you have an older home with lead plumbing.",
        "Save this utility to receive notifications when official records change.",
      ]},
      { t: "h2", c: "How to confirm you have the right utility" },
      { t: "p", c: "Water Utility Report pages are organized by PWSID — the public water system identifier assigned by EPA. If you are unsure which utility serves your address, use the address or ZIP search. Some addresses are served by a sub-utility or a reseller that has its own PWSID, so the utility name on your bill and the PWSID in federal records may differ slightly." },
      { t: "h2", c: "When records look confusing or incomplete" },
      { t: "p", c: "Official federal records are updated on reporting cycles that can vary from monthly to annually. A gap in records is not evidence of a problem — it may reflect a reporting lag, a system that is not required to monitor for a specific contaminant, or data that has not yet been synced to the federal database. For the most current picture, contact your utility directly or check your state drinking water agency's records." },
      { t: "callout", c: "Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink. For current safety guidance, check your utility, state drinking water agency, local health department, or a certified laboratory.", variant: "info" },
    ],
    whatToCheckNext: [
      { label: "Search your utility", href: "/search", desc: "Look up records by address, city, or utility name" },
      { label: "Find a certified testing lab", href: "/labs", desc: "State-certified labs for tap and well water testing" },
      { label: "PFAS next steps", href: "/help/pfas-detection-next-steps", desc: "What a PFAS detection in records means" },
      { label: "What a health-based violation means", href: "/help/health-based-violation-record-meaning" },
      { label: "How to contact your utility", href: "/help/how-to-contact-your-water-utility-about-records" },
      { label: "Our data sources and methodology", href: "/methodology/data-sources" },
    ],
    faqs: [
      {
        question: "How do I know which water utility serves my address?",
        answer: "Use the address or ZIP search on Water Utility Report. If you are unsure, your water bill should include the utility name and often the PWSID. Your state drinking water agency also maintains a directory of public water systems by service area.",
      },
      {
        question: "What is a PWSID?",
        answer: "A PWSID (Public Water System Identifier) is a unique code assigned by EPA to every public water system in the United States. It is the primary identifier used in federal databases including SDWIS. Water Utility Report pages are organized by PWSID.",
      },
      {
        question: "Should I test my water even if the utility has no violations?",
        answer: "Utility-level records reflect compliance monitoring at official sampling points. They do not describe conditions at every tap in the service area. If you have an older home with lead plumbing or a service line of unknown material, household testing can provide information that utility records cannot. Contact a state-certified laboratory for guidance.",
      },
      {
        question: "How often are Water Utility Report records updated?",
        answer: "Water Utility Report syncs with federal databases including EPA SDWIS and UCMR 5. Update frequency varies by record type — violation records are updated as utilities report to EPA, which occurs on state-specific schedules. PFAS sampling records from UCMR 5 are updated as EPA publishes new data.",
      },
      {
        question: "What does 'no records found' mean?",
        answer: "It means no records of that type appeared in the federal datasets Water Utility Report aggregates for this system. It does not mean the contaminant is absent. The system may not have been required to monitor, the data may not yet be in federal databases, or local records may differ. Check with your utility or state agency.",
      },
      {
        question: "Where can I find my utility's Consumer Confidence Report?",
        answer: "Water Utility Report displays CCR links where they appear in EPA-tracked databases. If no link is shown, check your utility's website directly. Many utilities post their CCR as a PDF on their official site. See the help article on missing CCRs for more steps.",
      },
    ],
    sources: [
      { label: "EPA — Safe Drinking Water Information System (SDWIS)", url: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting" },
      { label: "EPA — Consumer Confidence Reports", url: "https://www.epa.gov/ccr" },
    ],
    relatedPages: [
      { href: "/help/pfas-detection-next-steps", label: "PFAS Detection: Next Steps", desc: "What a PFAS detection in records means" },
      { href: "/help/health-based-violation-record-meaning", label: "Health-Based Violation Records", desc: "What a health-based violation record indicates" },
      { href: "/help/consumer-confidence-report-not-found", label: "CCR Not Found", desc: "Steps when a CCR link is missing" },
      { href: "/labs", label: "Find a Certified Lab", desc: "State-certified water testing labs" },
      { href: "/methodology", label: "Our Methodology", desc: "How Water Utility Report sources and displays data" },
    ],
  },

  // ── 2 ─────────────────────────────────────────────────────────────────────
  {
    slug: "pfas-detection-next-steps",
    title: "PFAS Detection in Water Records: What It Means and What to Check Next",
    metaTitle: "PFAS Detection in Water Records: Next Steps | Water Records Help",
    metaDescription:
      "A PFAS detection in official monitoring records is not automatically a violation. Learn what UCMR 5 sampling records mean, how detections relate to MCLs, and what to check next.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "pfas",
    intro:
      "A PFAS detection in official monitoring records means a compound was measured above the minimum reporting level at a utility sampling point. It is not automatically a regulatory violation.",
    helpsWith: [
      "Understanding what a PFAS detection record means versus a violation",
      "Learning how UCMR 5 sampling records relate to EPA's 2024 PFAS rule",
      "Understanding minimum reporting levels (MRLs) and maximum contaminant levels (MCLs)",
      "Deciding whether household testing is relevant for your situation",
      "Saving your utility for future PFAS record updates",
    ],
    officialRecordsCanShow: [
      "UCMR 5 sampling records showing PFAS compounds detected above the minimum reporting level",
      "Whether a utility was required to participate in UCMR 5 monitoring",
      "Violation records if a utility exceeded a regulatory MCL after the compliance deadline",
      "The PWSID and system type (community vs. non-community) that determines monitoring requirements",
    ],
    officialRecordsMayNotShow: [
      "UCMR 5 does not cover all PFAS compounds — only the 29 compounds required by the monitoring program",
      "Detections below the minimum reporting level are recorded as non-detects — not as absence",
      "Federal records may lag behind current local monitoring results",
      "Utility-level sampling records do not describe conditions at every household tap",
      "Treatment changes after the sampling date will not appear in historical records",
    ],
    blocks: [
      { t: "h2", c: "Detection vs. violation: the core distinction" },
      { t: "p", c: "A PFAS detection means a lab measured a compound at or above the Minimum Reporting Level (MRL) — the lowest concentration a certified lab can reliably quantify. A violation means a utility exceeded a regulatory Maximum Contaminant Level (MCL) after the applicable compliance deadline. Under EPA's April 2024 PFAS rule, utilities have until April 2029 to achieve compliance. During this transition period, PFAS detections may appear in records without a corresponding violation." },
      { t: "h2", c: "What UCMR 5 records cover" },
      { t: "p", c: "EPA's Unregulated Contaminant Monitoring Rule 5 (UCMR 5) required public water systems serving 3,300 or more people to test for 29 PFAS compounds from 2023 through 2025. The results are public. Not all systems were required to participate, and UCMR 5 does not cover all known PFAS compounds." },
      { t: "h2", c: "The 2024 PFAS MCLs and the compliance window" },
      { t: "p", c: "EPA finalized Maximum Contaminant Levels for PFOA and PFOS at 4 parts per trillion, and set limits for PFNA, PFHxS, HFPO-DA (GenX), and a hazard index for certain mixtures. Utilities must complete initial monitoring by April 2026 and meet MCLs by April 2029. A detection above 4 ppt during this period is a monitoring record, not automatically a violation." },
      { t: "callout", c: "Water Utility Report displays PFAS records as monitoring data, clearly labeled by record type. These are not compliance determinations. Water Utility Report does not determine whether water is safe to drink.", variant: "info" },
      { t: "h2", c: "Should you consider household testing?" },
      { t: "p", c: "Household-level PFAS testing requires a laboratory certified under EPA Method 533 or 537.1. Utility sampling records reflect conditions at official monitoring points, not necessarily at your tap. If you want household-specific information, a certified lab test can provide it. Contact your state's laboratory certification program for a list of certified labs." },
    ],
    whatToCheckNext: [
      { label: "Search your utility's PFAS records", href: "/search", desc: "Look up UCMR 5 data for your system" },
      { label: "PFAS water testing guide", href: "/labs/pfas-water-testing", desc: "Lab methods, costs, and what results include" },
      { label: "Find a certified lab", href: "/labs", desc: "Search state-certified labs for PFAS testing" },
      { label: "MRL vs MCL explained", href: "/learn/mrl-vs-mcl-drinking-water-results", desc: "What those numbers in water records actually mean" },
      { label: "PFAS no record found", href: "/help/no-pfas-record-found-meaning", desc: "What it means when no PFAS data appears" },
      { label: "Our PFAS data methodology", href: "/pfas-watchlist/methodology" },
    ],
    faqs: [
      {
        question: "Does a PFAS detection mean my utility is in violation?",
        answer: "Not automatically. A PFAS detection means a compound was measured above the minimum reporting level. Under EPA's 2024 PFAS rule, utilities have until April 2029 to meet MCLs. A detection during this transition period is a monitoring record, not a violation, unless a formal violation has been issued and recorded in SDWIS.",
      },
      {
        question: "What is the minimum reporting level (MRL)?",
        answer: "The MRL is the lowest concentration a certified laboratory can reliably detect and quantify. Results at or above the MRL are reported as detections. Results below the MRL are recorded as non-detects — this does not mean the compound is completely absent.",
      },
      {
        question: "Which PFAS compounds does UCMR 5 test for?",
        answer: "UCMR 5 covers 29 PFAS compounds, including PFOA, PFOS, PFNA, PFHxS, HFPO-DA (GenX), and several others. It does not cover all known PFAS compounds, which number in the thousands.",
      },
      {
        question: "My utility has PFAS records but no violations. Is that normal?",
        answer: "Yes. During the 2024–2029 compliance transition period, utilities may have PFAS detections in their monitoring records without formal violations. Once the April 2029 deadline passes, systems still exceeding MCLs will be subject to formal enforcement.",
      },
      {
        question: "Can I filter PFAS out of my tap water?",
        answer: "Water Utility Report does not recommend specific products. NSF/ANSI 58-certified reverse osmosis systems and NSF/ANSI 53-certified filters that are specifically rated for PFAS can reduce certain compounds at the tap. Consult NSF International's certified product listings and verify that a product covers the specific PFAS compounds of concern.",
      },
      {
        question: "Where does Water Utility Report get its PFAS data?",
        answer: "From EPA's UCMR 5 database and the Safe Drinking Water Information System (SDWIS), both public federal sources. Data is synced as EPA publishes updates.",
      },
    ],
    sources: [
      { label: "EPA — UCMR 5 Overview", url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
      { label: "EPA — PFAS National Primary Drinking Water Regulation (April 2024)", url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas" },
    ],
    relatedPages: [
      { href: "/learn/ucmr5-pfas-water-sampling-explained", label: "UCMR 5 Sampling Explained", desc: "Deep dive on what UCMR 5 records show" },
      { href: "/learn/pfas-detected-but-no-violation", label: "PFAS Detected But No Violation", desc: "Why that combination is possible" },
      { href: "/learn/mrl-vs-mcl-drinking-water-results", label: "MRL vs MCL", desc: "What those numbers mean" },
      { href: "/labs/pfas-water-testing", label: "PFAS Water Testing Guide" },
      { href: "/contaminants/pfas", label: "PFAS Contaminant Overview" },
      { href: "/help/no-pfas-record-found-meaning", label: "No PFAS Record Found" },
    ],
  },

  // ── 3 ─────────────────────────────────────────────────────────────────────
  {
    slug: "monitoring-reporting-violation-meaning",
    title: "What a Monitoring or Reporting Violation Record Means",
    metaTitle: "Monitoring and Reporting Violation Record Meaning | Water Records Help",
    metaDescription:
      "A monitoring or reporting violation means a utility failed to collect or submit required samples on schedule — not that a contaminant exceeded a health-based limit.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "violations",
    intro:
      "A monitoring or reporting violation in official records means a utility failed to collect, analyze, or report required samples on schedule — not that a contaminant exceeded a health-based limit.",
    helpsWith: [
      "Understanding the difference between monitoring/reporting violations and health-based violations",
      "Knowing why these records appear and what they indicate",
      "Finding the official source record for more context",
      "Understanding when to contact your utility for additional information",
    ],
    officialRecordsCanShow: [
      "Whether a utility missed required monitoring periods or failed to submit results to the state on time",
      "Which contaminants or rules the monitoring/reporting obligation applied to",
      "The dates associated with the missed or late monitoring event",
      "Whether a monitoring/reporting violation was subsequently resolved",
    ],
    officialRecordsMayNotShow: [
      "Whether the missed monitoring period coincided with any actual contaminant exceedance",
      "The utility's explanation for the missed monitoring (equipment issues, administrative errors, etc.)",
      "State agency communications or enforcement actions that may not yet be in federal records",
      "Whether corrective action has already been completed at the time you are viewing the record",
    ],
    blocks: [
      { t: "h2", c: "What monitoring and reporting violations are" },
      { t: "p", c: "Under the Safe Drinking Water Act, public water systems are required to collect water samples at specified intervals and report results to their state drinking water program. A monitoring violation occurs when a system misses a required sampling event. A reporting violation occurs when a system collects samples but fails to submit results to the state on time. Neither type is the same as a health-based violation — they do not mean a contaminant was found above a regulatory limit." },
      { t: "h2", c: "Why these violations matter" },
      { t: "p", c: "Monitoring and reporting violations are significant because they represent gaps in the data record. When a required test is not conducted or reported, regulators cannot confirm compliance during that period. Repeated monitoring violations can be an indicator of system management or resource issues, even if no contaminant exceedances have been detected." },
      { t: "h2", c: "How to read these records" },
      { t: "p", c: "When reviewing a monitoring or reporting violation record, note the contaminant or rule the requirement applied to, the period of the missed monitoring, and whether the record shows the violation as resolved or unresolved. For full context, check the official source record linked from the utility's page, or contact your state drinking water program." },
      { t: "callout", c: "A monitoring or reporting violation is a procedural record — it documents a missed obligation, not a measured exceedance. Water Utility Report does not determine whether water is safe to drink based on any record type.", variant: "info" },
    ],
    whatToCheckNext: [
      { label: "Search your utility's records", href: "/search" },
      { label: "What a health-based violation means", href: "/help/health-based-violation-record-meaning", desc: "How health-based violations differ" },
      { label: "How to contact your utility", href: "/help/how-to-contact-your-water-utility-about-records" },
      { label: "EPA SDWIS violation records", href: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting", desc: "Official federal violation database" },
      { label: "Our methodology", href: "/methodology" },
    ],
    faqs: [
      {
        question: "Does a monitoring violation mean my water is unsafe?",
        answer: "No. A monitoring violation means a required test was not conducted or reported on schedule. It does not mean a contaminant was found above a regulatory limit. Water Utility Report does not make safety determinations based on any record type.",
      },
      {
        question: "How common are monitoring and reporting violations?",
        answer: "Monitoring and reporting violations are among the most common violation types recorded in EPA's SDWIS database. They occur across systems of all sizes and can result from administrative issues, staffing changes, or equipment problems.",
      },
      {
        question: "What happens after a monitoring violation is issued?",
        answer: "State drinking water agencies typically require utilities to conduct the missed monitoring and may issue administrative orders or penalties. The utility must also notify customers if the violation meets public notification thresholds under EPA's public notification rule.",
      },
      {
        question: "How do I find out if a monitoring violation was resolved?",
        answer: "The official source record — accessible through EPA's SDWIS or your state drinking water program's records — will show whether a violation is open or resolved. Water Utility Report links to source records where available. You can also contact your utility or state agency directly.",
      },
      {
        question: "Is a monitoring violation the same as a health-based violation?",
        answer: "No. A monitoring or reporting violation is procedural — a missed test or late report. A health-based violation means a measured contaminant level exceeded a regulatory Maximum Contaminant Level (MCL) after the compliance deadline. These are distinct record types in EPA's SDWIS database.",
      },
    ],
    sources: [
      { label: "EPA — Safe Drinking Water Information System (SDWIS)", url: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting" },
      { label: "EPA — Safe Drinking Water Act (SDWA)", url: "https://www.epa.gov/sdwa" },
    ],
    relatedPages: [
      { href: "/help/health-based-violation-record-meaning", label: "Health-Based Violation Records" },
      { href: "/help/what-to-do-after-reading-water-report", label: "What to Do After Reading Your Report" },
      { href: "/help/how-to-contact-your-water-utility-about-records", label: "How to Contact Your Utility" },
      { href: "/methodology/data-sources", label: "Our Data Sources" },
    ],
  },

  // ── 4 ─────────────────────────────────────────────────────────────────────
  {
    slug: "health-based-violation-record-meaning",
    title: "What a Health-Based Violation Record Means",
    metaTitle: "Health-Based Violation Record Meaning | Water Records Help",
    metaDescription:
      "A health-based violation record in official databases means a utility was found to have exceeded a regulatory MCL. Learn what to check and what these records do not tell you.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "violations",
    intro:
      "A health-based violation record in official databases means a utility was officially found to have exceeded a regulatory Maximum Contaminant Level (MCL) or treatment technique requirement during the recorded period.",
    helpsWith: [
      "Understanding what a health-based violation record officially indicates",
      "Knowing the difference between an active and a resolved violation",
      "Finding official source records for the violation",
      "Knowing what questions to ask your utility or state agency",
      "Understanding what Water Utility Report does and does not determine from these records",
    ],
    officialRecordsCanShow: [
      "The contaminant and MCL associated with the violation, as officially classified by EPA or the state",
      "The period during which the violation was recorded",
      "Whether the violation is listed as resolved or unresolved in federal records",
      "Public notification records if the utility was required to notify customers",
    ],
    officialRecordsMayNotShow: [
      "The current status of the violation if it was recently resolved but not yet updated in federal records",
      "What remediation or corrective actions the utility has taken since the violation was recorded",
      "Whether the violation affected your specific address or service area within the system",
      "Local state agency actions, enforcement orders, or compliance schedules that may not be in federal databases",
    ],
    blocks: [
      { t: "h2", c: "What a health-based violation record officially indicates" },
      { t: "p", c: "A health-based violation means EPA or a state drinking water agency officially determined that a measured contaminant level exceeded a regulatory Maximum Contaminant Level (MCL) or a treatment technique requirement. These records are entered into EPA's Safe Drinking Water Information System (SDWIS) following the state's review and enforcement process." },
      { t: "h2", c: "Active vs. resolved violations" },
      { t: "p", c: "Health-based violations can be listed as open (active) or resolved in federal records. A resolved violation means the utility returned to compliance as confirmed by the state agency. However, federal records may lag behind state records — a violation may have been resolved in state systems before the update appears in EPA databases." },
      { t: "h2", c: "What to check officially" },
      { t: "ul", items: [
        "Check the official source record linked from the utility's page for the specific contaminant and MCL involved.",
        "Search your state drinking water agency's records — they are typically more current than federal records.",
        "Contact your utility to ask about the current compliance status and any remediation actions underway.",
        "Check whether a public notification was issued — utilities are required to notify customers of certain violation types.",
      ]},
      { t: "callout", c: "Water Utility Report displays health-based violation records as officially classified in federal databases. It does not independently verify current compliance status, and it does not determine whether water is safe to drink. Always verify current status with your utility or state drinking water agency.", variant: "warning" },
      { t: "h2", c: "What to ask your utility" },
      { t: "p", c: "If you see a health-based violation record for your utility, reasonable questions to ask include: Is this violation currently active or resolved? What was the contaminant and level involved? What corrective actions have been taken? Has a public notification been issued? What is the current compliance plan?" },
    ],
    whatToCheckNext: [
      { label: "Search your utility's records", href: "/search" },
      { label: "Monitoring vs. health-based violations", href: "/help/monitoring-reporting-violation-meaning" },
      { label: "How to contact your utility", href: "/help/how-to-contact-your-water-utility-about-records" },
      { label: "Find a certified testing lab", href: "/labs", desc: "For household-specific testing if needed" },
      { label: "EPA SDWIS search", href: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting", desc: "Official federal violation records" },
      { label: "Our methodology and limitations", href: "/methodology/legal" },
    ],
    faqs: [
      {
        question: "Does a health-based violation mean I should not use my tap water?",
        answer: "Water Utility Report does not make that determination. If you have an active health-based violation and want current guidance, contact your utility, local health department, or state drinking water agency. They can advise on whether any protective measures apply to your situation.",
      },
      {
        question: "How current are the violation records on Water Utility Report?",
        answer: "Water Utility Report syncs with EPA's SDWIS database, which is updated as states report violations to EPA. There can be a lag between a state-level determination and its appearance in federal records. For the most current status, check your state drinking water agency's records directly.",
      },
      {
        question: "Can a violation appear in records but already be resolved?",
        answer: "Yes. Violations that have been resolved may still appear in historical records. The violation record will note whether it is open or resolved based on the most recent federal database update. If you believe a record is outdated, you can check with your state agency or use the 'Report a data issue' link on the utility page.",
      },
      {
        question: "What is a Maximum Contaminant Level (MCL)?",
        answer: "An MCL is an enforceable limit set by EPA under the Safe Drinking Water Act. It is the highest level of a contaminant allowed in public drinking water. MCLs are set based on health effects research and treatment feasibility.",
      },
      {
        question: "Are all health-based violations the same severity?",
        answer: "No. Health-based violations cover a range of contaminants and MCLs, which have different underlying risk profiles. Not all exceedances represent the same conditions. The specific contaminant, level, duration, and the utility's response are all relevant to context — which is why checking official source records and contacting the utility is important.",
      },
      {
        question: "What is a public notification requirement?",
        answer: "Under EPA's Public Notification Rule, utilities must notify customers of certain violations, including health-based violations, within specified timeframes. The notification form and timeline depend on the type and severity of the violation.",
      },
    ],
    sources: [
      { label: "EPA — Safe Drinking Water Information System (SDWIS)", url: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting" },
      { label: "EPA — Safe Drinking Water Act (SDWA)", url: "https://www.epa.gov/sdwa" },
      { label: "EPA — Public Notification Rule", url: "https://www.epa.gov/dwreginfo/public-notification-rule" },
    ],
    relatedPages: [
      { href: "/help/monitoring-reporting-violation-meaning", label: "Monitoring and Reporting Violations" },
      { href: "/help/what-to-do-after-reading-water-report", label: "What to Do After Reading Your Report" },
      { href: "/help/how-to-contact-your-water-utility-about-records", label: "How to Contact Your Utility" },
      { href: "/labs", label: "Find a Certified Lab" },
      { href: "/methodology/legal", label: "Legal and Disclaimer" },
    ],
  },

  // ── 5 ─────────────────────────────────────────────────────────────────────
  {
    slug: "no-pfas-record-found-meaning",
    title: "No PFAS Record Found: What That Means for Your Utility",
    metaTitle: "No PFAS Record Found in Water Records | Water Records Help",
    metaDescription:
      "No PFAS record found does not mean PFAS is absent. Learn why PFAS data may be missing, which systems were required to monitor, and what to do next.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "pfas",
    intro:
      "No PFAS record found on Water Utility Report means no PFAS sampling data appeared in the federal datasets Water Utility Report aggregates for this system. It does not mean PFAS is absent from the water supply.",
    helpsWith: [
      "Understanding why PFAS records may be missing for a utility",
      "Knowing which systems were and were not required to monitor under UCMR 5",
      "Recognizing that absence of a record is not the same as confirmed absence of a contaminant",
      "Finding alternative sources for PFAS information",
      "Deciding whether household PFAS testing makes sense",
    ],
    officialRecordsCanShow: [
      "Whether a system participated in UCMR 5 monitoring and submitted results",
      "Detections above the minimum reporting level for the 29 UCMR 5 compounds",
      "The system size and type that determined UCMR 5 participation requirements",
    ],
    officialRecordsMayNotShow: [
      "PFAS monitoring conducted at the state level that has not been entered into federal databases",
      "Results for PFAS compounds not included in the 29-compound UCMR 5 panel",
      "Historical PFAS data from utility-commissioned testing not reported to EPA",
      "PFAS from sources other than the water system (household plumbing, point-of-use exposure, etc.)",
    ],
    blocks: [
      { t: "h2", c: "Why PFAS records may be absent" },
      { t: "ul", items: [
        "UCMR 5 required systems serving 3,300 or more people to participate. Smaller systems were not required, and only a representative sample of smaller systems was included.",
        "Some systems completed monitoring but results have not yet been synced to EPA's public database.",
        "A system may have tested for PFAS at the state level without reporting to the UCMR 5 federal program.",
        "The utility may serve source water not considered high-risk under UCMR 5 site selection criteria.",
      ]},
      { t: "h2", c: "Absence of a record is not confirmed absence" },
      { t: "p", c: "In epidemiology and environmental monitoring, the absence of data is not evidence of absence. A utility with no PFAS records may simply be outside the coverage of current federal monitoring programs. This is particularly relevant for smaller systems and those using groundwater sources in certain geographic areas." },
      { t: "callout", c: "Water Utility Report can only display records that exist in the federal databases it aggregates. If a system was not required to monitor, or if state-level data has not been submitted to EPA, no record will appear. This is a data gap, not a clearance.", variant: "info" },
      { t: "h2", c: "Alternative sources to check" },
      { t: "ul", items: [
        "Your state environmental agency may maintain PFAS monitoring data for systems not covered by UCMR 5.",
        "Your utility's Consumer Confidence Report may reference PFAS testing conducted independently.",
        "EWG's Tap Water Database aggregates some state-level PFAS data not yet in EPA federal records.",
        "A certified household water test using EPA Method 533 or 537.1 can provide PFAS information specific to your tap.",
      ]},
    ],
    whatToCheckNext: [
      { label: "PFAS water testing guide", href: "/labs/pfas-water-testing", desc: "Lab methods and what to expect" },
      { label: "Find a certified PFAS testing lab", href: "/labs" },
      { label: "PFAS detection next steps", href: "/help/pfas-detection-next-steps", desc: "If your utility does have PFAS records" },
      { label: "UCMR 5 explained", href: "/learn/ucmr5-pfas-water-sampling-explained" },
      { label: "Contact your utility", href: "/help/how-to-contact-your-water-utility-about-records" },
    ],
    faqs: [
      {
        question: "Does no PFAS record mean my water is free of PFAS?",
        answer: "No. The absence of a PFAS record in Water Utility Report means no data appeared in the federal databases we aggregate for this system. It does not confirm that PFAS is absent. The system may not have been required to monitor, or state-level data may not be in federal databases.",
      },
      {
        question: "Which utilities were required to participate in UCMR 5?",
        answer: "All community water systems and non-transient non-community systems serving 3,300 or more people were required to participate. EPA also selected a random sample of smaller systems for inclusion.",
      },
      {
        question: "Where can I find PFAS data for small utilities not in UCMR 5?",
        answer: "Check your state environmental agency's drinking water records. Some states have conducted their own PFAS monitoring programs covering smaller systems. Your utility may also have conducted voluntary testing — ask them directly.",
      },
      {
        question: "Can I test my own water for PFAS even if the utility has no records?",
        answer: "Yes. A certified laboratory using EPA Method 533 or 537.1 can test a sample from your tap for PFAS compounds. This provides information about your specific tap, independent of utility-level sampling records.",
      },
      {
        question: "Will more utilities get PFAS records in the future?",
        answer: "EPA's 2024 PFAS MCLs require all covered public water systems to conduct initial monitoring by April 2026. More monitoring data will be submitted to federal databases as this monitoring is completed.",
      },
    ],
    sources: [
      { label: "EPA — UCMR 5 Overview", url: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
      { label: "EPA — PFAS National Primary Drinking Water Regulation", url: "https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas" },
    ],
    relatedPages: [
      { href: "/help/pfas-detection-next-steps", label: "PFAS Detection Next Steps" },
      { href: "/learn/ucmr5-pfas-water-sampling-explained", label: "UCMR 5 Explained" },
      { href: "/labs/pfas-water-testing", label: "PFAS Water Testing Guide" },
      { href: "/contaminants/pfas", label: "PFAS Contaminant Overview" },
      { href: "/pfas-watchlist", label: "PFAS Watchlist" },
    ],
  },

  // ── 6 ─────────────────────────────────────────────────────────────────────
  {
    slug: "what-to-test-for-after-utility-report",
    title: "What to Test for After Reviewing Your Utility's Records",
    metaTitle: "What to Test for After Reviewing Utility Water Records | Water Records Help",
    metaDescription:
      "Deciding what to test for depends on your water source, utility records, and household situation. This page explains key considerations and links to testing guides.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "testing",
    intro:
      "Whether to test your water and what to test for depends on your water source, your utility's records, and your household situation. Utility records are a starting point — they describe sampling at official monitoring points, not at every tap.",
    helpsWith: [
      "Understanding when household testing is relevant beyond utility records",
      "Knowing which contaminants are most commonly tested after reviewing utility records",
      "Understanding the difference between public water and private well testing priorities",
      "Finding a certified lab for the tests that match your situation",
    ],
    officialRecordsCanShow: [
      "Which contaminants your utility is required to monitor and has recently tested",
      "Whether PFAS, lead, nitrate, or other contaminants have appeared in utility-level sampling records",
      "The type of water source (surface water, groundwater) your utility uses, which affects contamination patterns",
    ],
    officialRecordsMayNotShow: [
      "Lead levels at your specific tap — lead enters water through household plumbing and service lines, not at the treatment plant",
      "Contaminants not covered by current federal monitoring requirements",
      "Conditions in your building's private plumbing after the utility meter",
      "Private well conditions — private wells are not regulated by the Safe Drinking Water Act",
    ],
    blocks: [
      { t: "h2", c: "Common tests to consider after reviewing utility records" },
      { t: "h3", c: "Lead" },
      { t: "p", c: "Lead enters water from household plumbing, lead solder, and service lines — not from the treatment plant. Utility-level lead records reflect sampling at selected high-risk sites under EPA's Lead and Copper Rule protocols, not at every address. If your home was built before 1986, has lead solder, or has an unknown service line material, household lead testing is worth considering regardless of utility-level results." },
      { t: "h3", c: "PFAS" },
      { t: "p", c: "If your utility has PFAS sampling records showing detections, or if no PFAS records exist for a smaller system, a certified PFAS test using EPA Method 533 or 537.1 provides household-level information. Confirm the lab is certified for these methods before submitting a sample." },
      { t: "h3", c: "Nitrate" },
      { t: "p", c: "Nitrate in drinking water is particularly relevant in agricultural areas. Public utilities are required to monitor and report nitrate levels. If your utility is in an agricultural area and has had nitrate records, additional information on your tap-level results may be relevant." },
      { t: "h3", c: "Bacteria (coliform)" },
      { t: "p", c: "For public water systems, bacterial contamination is addressed through treatment and monitored continuously. For private wells, annual coliform testing is widely recommended. For public systems, coliform testing at the tap is rarely needed unless there has been a boil-water advisory or system disruption." },
      { t: "callout", c: "Water Utility Report does not recommend specific tests or determine whether any specific test is necessary for your household. For guidance tailored to your situation, contact a state-certified laboratory or your state drinking water program.", variant: "info" },
      { t: "h2", c: "Finding a certified lab" },
      { t: "p", c: "Use a state-certified or NELAP-accredited laboratory. The EPA maintains a national directory of certified labs searchable by state and contaminant. Confirm the lab's certification covers the specific contaminants you want tested before submitting a sample." },
    ],
    whatToCheckNext: [
      { label: "Find a certified testing lab", href: "/labs" },
      { label: "PFAS testing guide", href: "/labs/pfas-water-testing" },
      { label: "Lead testing guide", href: "/labs/lead-water-testing" },
      { label: "What to test for in drinking water", href: "/labs/what-to-test-for-in-drinking-water" },
      { label: "Private well vs public water records", href: "/help/private-well-vs-public-water-records" },
      { label: "Treatment methods overview", href: "/treatment" },
    ],
    faqs: [
      {
        question: "Do I need to test my water if my utility has no violations?",
        answer: "Utility records reflect compliance at official monitoring points. If you have an older home with lead plumbing, an unknown service line, or a specific health concern, household testing can provide information that utility records cannot. The decision is yours — a certified lab can advise on which tests are appropriate.",
      },
      {
        question: "What is a NELAP-accredited laboratory?",
        answer: "NELAP (National Environmental Laboratory Accreditation Program) accreditation indicates a lab meets standardized quality requirements for environmental testing. State-certified labs and NELAP-accredited labs both meet federal and state standards for drinking water testing.",
      },
      {
        question: "How do I collect a water sample for testing?",
        answer: "The collection protocol depends on what you are testing for. Labs provide sampling kits with specific instructions. For lead, a first-draw sample (collected after water has sat stagnant for at least 6 hours) is standard. For PFAS, labs provide specific containers and collection guidance to prevent contamination. Always follow the lab's chain-of-custody instructions.",
      },
      {
        question: "Can I use a home test kit instead of a certified lab?",
        answer: "Home test strips and kits can provide quick screening but are not certified, not quantitative for most contaminants, and not accepted for regulatory or legal purposes. For results that matter beyond general curiosity, use a state-certified or NELAP-accredited laboratory.",
      },
      {
        question: "Does my health insurance cover water testing?",
        answer: "Generally, no. Water testing is typically an out-of-pocket expense. Some state and local health departments offer free or subsidized testing for qualifying households. Contact your state drinking water program or local health department to ask about assistance programs.",
      },
    ],
    sources: [
      { label: "EPA — National Certified Laboratory Directory", url: "https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water" },
      { label: "EPA — Lead and Copper Rule Improvements", url: "https://www.epa.gov/ground-water-and-drinking-water/lead-and-copper-rule-improvements" },
    ],
    relatedPages: [
      { href: "/labs", label: "Find a Certified Lab" },
      { href: "/labs/pfas-water-testing", label: "PFAS Testing Guide" },
      { href: "/labs/lead-water-testing", label: "Lead Testing Guide" },
      { href: "/labs/what-to-test-for-in-drinking-water", label: "What to Test For" },
      { href: "/help/private-well-vs-public-water-records", label: "Private Well vs Public Water" },
      { href: "/treatment", label: "Treatment Methods" },
    ],
  },

  // ── 7 ─────────────────────────────────────────────────────────────────────
  {
    slug: "private-well-vs-public-water-records",
    title: "Private Well vs. Public Water Records: What Applies to You",
    metaTitle: "Private Well vs Public Water Records | Water Records Help",
    metaDescription:
      "Water Utility Report covers public water systems regulated under the Safe Drinking Water Act. If you use a private well, those records do not apply to your water supply.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "testing",
    intro:
      "Public water utility records on Water Utility Report apply to public water systems regulated under the Safe Drinking Water Act. If your household uses a private well, those records do not describe your water supply.",
    helpsWith: [
      "Understanding whether utility records apply to your household",
      "Knowing what federal protections apply to private wells",
      "Understanding why private well testing is the owner's responsibility",
      "Finding resources for private well testing guidance",
    ],
    officialRecordsCanShow: [
      "Records for public community water systems and non-transient non-community systems registered with EPA",
      "Whether a public water system serves your address based on EPA service area data",
      "Sampling, violation, and CCR records for the public water system associated with your PWSID",
    ],
    officialRecordsMayNotShow: [
      "Any information about private wells — these are not regulated by the Safe Drinking Water Act and do not have SDWIS records",
      "Conditions in your home's plumbing after the point where water enters from a public system",
      "Water quality for households that use hauled water, cisterns, or rainwater collection",
    ],
    blocks: [
      { t: "h2", c: "What the Safe Drinking Water Act covers" },
      { t: "p", c: "The federal Safe Drinking Water Act (SDWA) regulates public water systems — community water systems serving 25 or more people or 15 or more service connections, and non-transient non-community systems. It does not regulate private wells. Approximately 13% of U.S. households use private wells as their primary drinking water source." },
      { t: "h2", c: "Private well users: what this means for your records search" },
      { t: "p", c: "If you use a private well, searching for a utility on Water Utility Report will find records for nearby public systems — but those records do not describe your water supply. Your well is a separate source not included in EPA's SDWIS database, and its quality is your responsibility to monitor." },
      { t: "h2", c: "What private well users typically test for" },
      { t: "p", c: "The CDC and state health agencies widely recommend that private well owners test annually at minimum for coliform bacteria, nitrate, and pH. Depending on your location and land use history, additional testing may be warranted for PFAS, arsenic, radon, pesticides, and other contaminants. Use a state-certified laboratory for well water testing." },
      { t: "callout", c: "Private wells are the owner's responsibility. There are no federal regulatory requirements for private well testing. Water Utility Report does not display records for private wells and does not determine whether private well water is safe to drink.", variant: "info" },
      { t: "h2", c: "How to find your well's water quality information" },
      { t: "ul", items: [
        "Test with a state-certified laboratory — at minimum for bacteria, nitrate, and pH annually.",
        "Check with your state environmental or health agency for information on known contamination in your area.",
        "Review EPA's private well resources for guidance on what to test and how often.",
        "Ask your county health department whether there are known groundwater quality issues near your property.",
      ]},
    ],
    whatToCheckNext: [
      { label: "Private well testing guide", href: "/labs/well-water-testing" },
      { label: "Find a certified lab", href: "/labs" },
      { label: "What to test for in drinking water", href: "/labs/what-to-test-for-in-drinking-water" },
      { label: "Well water state guides", href: "/well-water" },
      { label: "EPA private well resources", href: "https://www.epa.gov/privatewells", desc: "Federal guidance for private well owners" },
    ],
    faqs: [
      {
        question: "How do I know if my household uses a public water system or a private well?",
        answer: "If you receive a water bill from a utility and a Consumer Confidence Report, you are likely on a public water system. If your home has its own well and pump equipment, you are likely on a private well. Your county health department or property records can confirm.",
      },
      {
        question: "Are there federal regulations for private wells?",
        answer: "No. The Safe Drinking Water Act does not regulate private wells. Testing, maintenance, and treatment are the sole responsibility of the well owner. Some states have their own regulations for new well construction, but operational testing is typically voluntary.",
      },
      {
        question: "What does it cost to test a private well?",
        answer: "A basic bacterial and nitrate panel typically costs $30–$80. A comprehensive panel covering 50+ parameters can cost $200–$500. Some state and county health departments offer subsidized testing for qualifying households.",
      },
      {
        question: "How often should I test my private well?",
        answer: "The CDC and most state health agencies recommend annual testing at minimum for coliform bacteria, nitrate, and pH. More frequent or broader testing is recommended if you notice changes in taste, odor, or appearance, or if there has been flooding, nearby land disturbance, or a known contamination event.",
      },
      {
        question: "Can I search Water Utility Report to find out about contamination near my private well?",
        answer: "You can search for nearby public water systems to understand what contaminants have been detected in the area's groundwater or surface water sources. However, conditions at your well may differ significantly from nearby public systems. For information specific to your well, test with a certified laboratory.",
      },
    ],
    sources: [
      { label: "EPA — Private Drinking Water Wells", url: "https://www.epa.gov/privatewells" },
      { label: "CDC — Private Well Water", url: "https://www.cdc.gov/drinking-water/" },
    ],
    relatedPages: [
      { href: "/labs/well-water-testing", label: "Private Well Testing Guide" },
      { href: "/well-water", label: "Well Water State Guides" },
      { href: "/labs", label: "Find a Certified Lab" },
      { href: "/help/what-to-test-for-after-utility-report", label: "What to Test For" },
    ],
  },

  // ── 8 ─────────────────────────────────────────────────────────────────────
  {
    slug: "how-to-contact-your-water-utility-about-records",
    title: "How to Contact Your Water Utility About Official Records",
    metaTitle: "How to Contact Your Water Utility About Records | Water Records Help",
    metaDescription:
      "Your utility is the authoritative source for current records, Consumer Confidence Reports, PFAS data, and recent notices. This page includes a copyable email template.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "utility-contact",
    intro:
      "Your water utility is the authoritative source for current records, service area information, and recent notices. Most utilities respond to direct inquiries about Consumer Confidence Reports, PWSID, and current compliance status.",
    helpsWith: [
      "Knowing what to ask your utility when reviewing official records",
      "Finding your utility's contact information",
      "Using a clear email template to request records information",
      "Understanding what response to expect and where to escalate if needed",
    ],
    officialRecordsCanShow: [
      "The utility's PWSID and official service area as registered with EPA",
      "Contact information for the utility when available in EPA records",
      "Whether a Consumer Confidence Report link has been submitted to EPA's CCR database",
    ],
    officialRecordsMayNotShow: [
      "Direct contact information for the utility's records or compliance staff",
      "Recent correspondence, notices, or public statements not entered into federal databases",
      "Current compliance status if a violation was recently resolved but not yet updated in federal records",
    ],
    blocks: [
      { t: "h2", c: "How to find your utility's contact information" },
      { t: "ul", items: [
        "Check your most recent water bill — it typically includes a customer service phone number and mailing address.",
        "Search the utility's name on Water Utility Report — contact information is displayed when available in EPA records.",
        "Search your state drinking water agency's utility directory — most states maintain a searchable database.",
        "Use EPA's SDWIS public search to look up contact details by PWSID.",
      ]},
      { t: "h2", c: "What to ask" },
      { t: "ul", items: [
        "The utility's PWSID if you are not certain you have the right system.",
        "A link to or copy of the most recent Consumer Confidence Report.",
        "Whether the utility has conducted PFAS or UCMR 5 sampling, and where results are published.",
        "The current status of any violation records you have identified in official databases.",
        "Who to contact for ongoing record-specific questions.",
      ]},
      {
        t: "email-template",
        subject: "Question about official water records for {Utility Name}",
        body: [
          "Hello,",
          "",
          "I am a customer in your service area and I have a question about official water records for {Utility Name} (PWSID: {PWSID if known}).",
          "",
          "Could you please help me with the following:",
          "",
          "1. A link to or copy of your most recent Consumer Confidence Report (CCR).",
          "2. Whether your system has conducted PFAS or UCMR 5 sampling, and where the results are published.",
          "3. The current status of any open violation records in EPA's SDWIS database.",
          "4. Contact information for the correct department to follow up on records questions.",
          "5. Confirmation of your service area boundaries and the best way to verify whether my address is served by your system.",
          "",
          "I understand that federal records may not always reflect the most current status, which is why I am reaching out directly.",
          "",
          "Thank you for your time.",
        ],
      },
      { t: "h2", c: "If your utility does not respond" },
      { t: "p", c: "If you do not receive a response within a reasonable period, contact your state drinking water program. States are responsible for overseeing public water systems and can assist with records requests. You can find your state drinking water program contact through EPA's SDWA contacts page." },
    ],
    whatToCheckNext: [
      { label: "Search your utility", href: "/search" },
      { label: "Consumer Confidence Report not found", href: "/help/consumer-confidence-report-not-found" },
      { label: "EPA SDWIS search", href: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting", desc: "Find contact info and records by PWSID" },
      { label: "EPA SDWA state contacts", href: "https://www.epa.gov/sdwa", desc: "Your state's drinking water program" },
      { label: "Report a data issue", href: "/contact", desc: "Flag outdated or incorrect records on Water Utility Report" },
    ],
    faqs: [
      {
        question: "Is my water utility required to answer my questions about records?",
        answer: "Under EPA's Public Notification Rule, utilities must notify customers of certain violations. Consumer Confidence Reports must be provided to all customers annually. For general records inquiries, utilities are generally responsive, but there is no federal requirement to respond to every individual inquiry.",
      },
      {
        question: "What is a PWSID and where do I find it?",
        answer: "A Public Water System Identifier (PWSID) is a unique code assigned by EPA to each public water system. It appears on Water Utility Report pages. It may also appear on your water bill, Consumer Confidence Report, or in your state's utility directory.",
      },
      {
        question: "What is a Consumer Confidence Report?",
        answer: "A Consumer Confidence Report (CCR) is an annual report that community water systems must provide to customers. It describes the water source, treatment process, and results of required monitoring. CCRs must be delivered or made available to customers by July 1 each year for the preceding calendar year.",
      },
      {
        question: "Who do I contact if my utility is unresponsive?",
        answer: "Contact your state drinking water program. States are responsible for overseeing public water systems and have authority to require utilities to respond to compliance questions. EPA's SDWA contacts page lists state drinking water program contacts.",
      },
      {
        question: "Can I request records under public records laws?",
        answer: "Many utility records are public under state open records or FOIA laws. If a utility is publicly operated, you may be able to submit a public records request. Contact your state's records office or state drinking water agency for guidance specific to your state.",
      },
    ],
    sources: [
      { label: "EPA — Safe Drinking Water Act (SDWA)", url: "https://www.epa.gov/sdwa" },
      { label: "EPA — Consumer Confidence Reports", url: "https://www.epa.gov/ccr" },
    ],
    relatedPages: [
      { href: "/help/consumer-confidence-report-not-found", label: "CCR Not Found" },
      { href: "/help/health-based-violation-record-meaning", label: "Health-Based Violation Records" },
      { href: "/help/what-to-do-after-reading-water-report", label: "What to Do After Reading Your Report" },
      { href: "/methodology/data-sources", label: "Our Data Sources" },
      { href: "/contact", label: "Contact Water Utility Report" },
    ],
  },

  // ── 9 ─────────────────────────────────────────────────────────────────────
  {
    slug: "boil-water-advisory-vs-water-quality-violation",
    title: "Boil-Water Advisory vs. Water Quality Violation: What's the Difference",
    metaTitle: "Boil-Water Advisory vs Water Quality Violation | Water Records Help",
    metaDescription:
      "A boil-water advisory is a local emergency notice. A water quality violation is a federal compliance record. These are different record types — and Water Utility Report is not a real-time advisory system.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "understanding",
    intro:
      "A boil-water advisory is a local emergency notice issued by a utility or health agency. A water quality violation is a regulatory compliance record in federal databases. These are different record types and are not always correlated.",
    helpsWith: [
      "Understanding the difference between a boil-water advisory and a federal violation record",
      "Knowing where to find current advisories (not on Water Utility Report)",
      "Understanding why Water Utility Report is not a real-time emergency system",
      "Finding the right sources for current water status in your area",
    ],
    officialRecordsCanShow: [
      "Historical violation records entered into EPA's SDWIS database, which may include violations that triggered advisories",
      "Whether a utility has a pattern of violations associated with bacterial contamination or treatment disruptions",
      "Public notification records if they have been entered into federal databases",
    ],
    officialRecordsMayNotShow: [
      "Current or recently resolved boil-water advisories — these are issued locally and may not appear in federal records for weeks",
      "Local health department or utility press releases and emergency communications",
      "Real-time water system operational status",
      "Advisories issued and resolved before data was synced to federal databases",
    ],
    blocks: [
      { t: "h2", c: "What a boil-water advisory is" },
      { t: "p", c: "A boil-water advisory is a public health notice issued by a water utility or local or state health department advising customers to boil tap water before using it for drinking, cooking, or other consumption-related purposes. Advisories are typically issued in response to a detected or suspected contamination event, a pressure loss, a main break, or other operational disruption. They are local notices — not federal compliance records." },
      { t: "h2", c: "What a water quality violation is" },
      { t: "p", c: "A water quality violation is a formal compliance record entered into EPA's Safe Drinking Water Information System (SDWIS) after a state drinking water agency determines that a utility exceeded a regulatory limit or failed a compliance obligation. Violations are reported on state-specific schedules and can lag significantly behind real-time events." },
      { t: "h2", c: "Why they may not align" },
      { t: "p", c: "A utility can issue a boil-water advisory as a precautionary measure without any federal violation occurring. Conversely, a health-based violation record in federal databases may reflect an event that was already resolved and communicated to customers without triggering a current advisory. The two record types exist in different systems and on different timelines." },
      { t: "callout", c: "Water Utility Report is not a real-time emergency advisory system. It does not display current boil-water advisories. For current safety notices, check your utility's official website, your local health department, or your state drinking water agency.", variant: "warning" },
      { t: "h2", c: "Where to find current boil-water advisories" },
      { t: "ul", items: [
        "Your utility's official website — most utilities post current advisories prominently.",
        "Your local or county health department.",
        "Your state's drinking water agency or emergency management system.",
        "Local news sources that cover utility announcements.",
        "Emergency notification systems — many utilities maintain opt-in text or email alert systems.",
      ]},
    ],
    whatToCheckNext: [
      { label: "Search your utility", href: "/search", desc: "Review historical records for your system" },
      { label: "Health-based violation records", href: "/help/health-based-violation-record-meaning" },
      { label: "Monitoring and reporting violations", href: "/help/monitoring-reporting-violation-meaning" },
      { label: "How to contact your utility", href: "/help/how-to-contact-your-water-utility-about-records" },
      { label: "Our methodology and limitations", href: "/methodology/legal" },
    ],
    faqs: [
      {
        question: "Does Water Utility Report show current boil-water advisories?",
        answer: "No. Water Utility Report displays historical compliance records from federal databases. It is not a real-time emergency notification system. For current boil-water advisories, check your utility's official website, your local health department, or your state drinking water agency.",
      },
      {
        question: "If there's no violation in the records, does that mean there's no advisory?",
        answer: "Not necessarily. Boil-water advisories are issued locally and may not produce a federal violation record, or may not appear in federal records until weeks after the event. The absence of a violation record does not confirm the absence of a current advisory.",
      },
      {
        question: "How long does a boil-water advisory typically last?",
        answer: "Duration varies by the cause and the utility's verification process. Advisories issued for pressure loss or main breaks are often lifted within 24–72 hours after the system is restored and testing confirms acceptable bacterial levels. Advisories for contamination events may last longer.",
      },
      {
        question: "Will a boil-water advisory eventually appear in Water Utility Report's records?",
        answer: "If an advisory was associated with a formal violation, that violation may eventually appear in EPA's SDWIS database. Advisories without formal violations, or those resolved before state reporting cycles, may never appear in federal records.",
      },
      {
        question: "How do I sign up for utility emergency alerts?",
        answer: "Contact your utility directly to ask about emergency notification opt-in programs. Many utilities offer text or email alerts for advisories. Check your utility's website for enrollment information.",
      },
    ],
    sources: [
      { label: "EPA — Safe Drinking Water Information System (SDWIS)", url: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting" },
      { label: "EPA — Public Notification Rule", url: "https://www.epa.gov/dwreginfo/public-notification-rule" },
    ],
    relatedPages: [
      { href: "/help/health-based-violation-record-meaning", label: "Health-Based Violation Records" },
      { href: "/help/monitoring-reporting-violation-meaning", label: "Monitoring and Reporting Violations" },
      { href: "/help/what-to-do-after-reading-water-report", label: "What to Do After Reading Your Report" },
      { href: "/methodology/legal", label: "Legal and Disclaimer" },
      { href: "/help/how-to-contact-your-water-utility-about-records", label: "How to Contact Your Utility" },
    ],
  },

  // ── 10 ────────────────────────────────────────────────────────────────────
  {
    slug: "consumer-confidence-report-not-found",
    title: "Consumer Confidence Report Not Found: What to Do",
    metaTitle: "Consumer Confidence Report Not Found | Water Records Help",
    metaDescription:
      "If no CCR link appears on a utility's page, it does not mean the utility hasn't published one. Learn why CCR links may be missing and how to find your utility's report.",
    publishDate: "2026-05-21",
    lastUpdated: "2026-05-21",
    group: "utility-contact",
    intro:
      "If no Consumer Confidence Report link appears on a utility's page, it does not mean the utility has not published one. CCR links may be missing from Water Utility Report's records due to data lag, format differences, or utilities publishing outside EPA-tracked systems.",
    helpsWith: [
      "Understanding why a CCR link may be missing on Water Utility Report",
      "Finding your utility's Consumer Confidence Report through other sources",
      "Knowing what a CCR contains and why it is useful",
      "Reporting a missing or outdated CCR link to Water Utility Report",
    ],
    officialRecordsCanShow: [
      "CCR links where they have been submitted to EPA's centralized CCR database",
      "The utility's PWSID, which can be used to search for CCR records in EPA systems",
      "Whether the utility is a community water system required to publish an annual CCR",
    ],
    officialRecordsMayNotShow: [
      "CCRs published on utility websites outside of EPA's centralized CCR tracking system",
      "CCRs published in PDF formats or non-standard URLs that are not indexed in federal databases",
      "Recently published CCRs that have not yet been synced to Water Utility Report",
    ],
    blocks: [
      { t: "h2", c: "What is a Consumer Confidence Report?" },
      { t: "p", c: "A Consumer Confidence Report (CCR), also called an Annual Water Quality Report, is an annual report that community water systems serving 25 or more people must provide to customers. It covers the source of the water, treatment processes, and results of required contaminant monitoring for the preceding calendar year. Utilities must deliver or make CCRs available to customers by July 1 each year." },
      { t: "h2", c: "Why a CCR link may be missing" },
      { t: "ul", items: [
        "The utility publishes its CCR on its own website but has not submitted a link to EPA's centralized database.",
        "The CCR was published recently and has not yet been indexed in the sources Water Utility Report aggregates.",
        "The utility serves a very small population and uses a different delivery method (mailed copies, for example).",
        "The CCR link submitted to EPA is broken or no longer valid.",
        "The utility is a wholesale system that does not directly serve residential customers and may not publish a public-facing CCR.",
      ]},
      { t: "h2", c: "How to find your utility's CCR" },
      { t: "ol", items: [
        "Search the utility's name plus 'water quality report' or 'CCR' in a web browser.",
        "Visit the utility's official website directly — most utilities post CCRs in a dedicated water quality or reports section.",
        "Search EPA's CCR database at epa.gov/ccr using your utility's name or PWSID.",
        "Contact the utility directly and request a copy of the most recent CCR.",
        "Contact your state drinking water agency — they often maintain a directory of CCR links for systems in their state.",
      ]},
      { t: "h2", c: "How to report a missing or broken CCR link" },
      { t: "p", c: "If you find your utility's CCR and notice that Water Utility Report's records are missing or outdated, you can report it using the contact or correction form. This helps keep the site's records accurate for other users." },
      { t: "callout", c: "A missing CCR link on Water Utility Report does not mean a utility has failed to publish its CCR. Always check the utility's official website and EPA's CCR database before concluding a report is unavailable.", variant: "info" },
    ],
    whatToCheckNext: [
      { label: "Search your utility", href: "/search" },
      { label: "How to contact your utility", href: "/help/how-to-contact-your-water-utility-about-records" },
      { label: "EPA CCR database", href: "https://www.epa.gov/ccr", desc: "Search for CCR links by utility name or PWSID" },
      { label: "Report a data issue", href: "/contact", desc: "Flag missing or incorrect records on Water Utility Report" },
      { label: "Our data sources", href: "/methodology/data-sources" },
    ],
    faqs: [
      {
        question: "Are utilities required to publish a Consumer Confidence Report?",
        answer: "Yes. Community water systems serving 25 or more people are required by EPA to publish an annual CCR covering the previous calendar year's monitoring results. The CCR must be delivered to customers or made available by July 1 each year.",
      },
      {
        question: "What does a CCR typically contain?",
        answer: "A CCR includes the source of the water supply (groundwater, surface water, purchased), a description of treatment processes, results of required contaminant monitoring, any violations that occurred during the year, and educational information. It provides useful context for interpreting monitoring records.",
      },
      {
        question: "Can I request a CCR directly from my utility?",
        answer: "Yes. Utilities are required to provide a CCR upon request. Contact your utility's customer service department and ask for the most recent annual water quality report.",
      },
      {
        question: "What if my utility's CCR is outdated?",
        answer: "CCRs must be published annually for the preceding calendar year. If a utility appears to have not published a CCR for the current or prior year, this may be a compliance issue. Contact your state drinking water agency to report the concern.",
      },
      {
        question: "Does the CCR tell me about PFAS in my water?",
        answer: "Starting with CCRs for the 2025 calendar year, utilities that detected PFAS above MCLs are required to report this in their CCR. For prior years, PFAS may appear voluntarily or may not be included. For UCMR 5 sampling results, check Water Utility Report's PFAS records or EPA's UCMR 5 database directly.",
      },
      {
        question: "How do I report a broken or missing CCR link on Water Utility Report?",
        answer: "Use the contact or correction form linked from any utility page or from the Help Center. Include the utility name, PWSID, and the correct CCR link if you have found it. This helps us update records for all users.",
      },
    ],
    sources: [
      { label: "EPA — Consumer Confidence Reports", url: "https://www.epa.gov/ccr" },
      { label: "EPA — Safe Drinking Water Information System (SDWIS)", url: "https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting" },
    ],
    relatedPages: [
      { href: "/help/how-to-contact-your-water-utility-about-records", label: "How to Contact Your Utility" },
      { href: "/help/what-to-do-after-reading-water-report", label: "What to Do After Reading Your Report" },
      { href: "/methodology/data-sources", label: "Our Data Sources" },
      { href: "/contact", label: "Contact Water Utility Report" },
    ],
  },
];

export function getHelpArticleBySlug(slug: string): HelpArticle | undefined {
  return helpArticles.find((a) => a.slug === slug);
}

export function helpArticlesByGroup(group: HelpGroup): HelpArticle[] {
  return helpArticles.filter((a) => a.group === group);
}

export default helpArticles;
