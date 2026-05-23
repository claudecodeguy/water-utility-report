import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Droplets, FlaskConical } from "lucide-react";
import JsonLd from "@/components/json-ld";
import FaqSection from "@/components/faq-section";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How To Read Water Test Results: Interpreting Your Lab Report",
  description: "How to interpret water quality lab results — what units mean, how to compare to EPA limits, which contaminants need action, and what to do next.",
  alternates: { canonical: "https://waterutilityreport.com/labs/how-to-read-water-test-results" },
  openGraph: {
    title: "How To Read Water Test Results: Interpreting Your Lab Report",
    description: "How to interpret water quality lab results — what units mean, how to compare to EPA limits, which contaminants need action, and what to do next.",
    url: "https://waterutilityreport.com/labs/how-to-read-water-test-results",
  },
  robots: { index: true, follow: true },
};

const faqs = [
  {
    question: "What does 'ND' or 'not detected' mean on a water test?",
    answer: "ND (not detected) means the contaminant was not found at or above the laboratory's reporting limit (also called the method detection limit or MDL). It does not mean the contaminant is entirely absent — it means the level, if any, is below the threshold the method can reliably measure. For many contaminants, ND is the expected and acceptable result.",
  },
  {
    question: "What is an MCL and how does it differ from a health advisory?",
    answer: "An MCL (Maximum Contaminant Level) is an enforceable federal standard. If a public utility exceeds an MCL, it must notify customers and take corrective action. A Health Advisory (HA) is a non-enforceable guidance level set by EPA for contaminants without a finalized MCL. Health Advisories represent EPA's best estimate of a safe level but do not trigger the same regulatory obligations.",
  },
  {
    question: "My result is below the MCL — does that mean the water is safe?",
    answer: "MCLs represent a regulatory compliance threshold — they are set based on a combination of health risk and technical feasibility of treatment. Some contaminants, like lead, have an MCL goal (MCLG) of zero, meaning any level is considered to pose some risk. Being below an MCL is a positive data point but does not guarantee zero health risk for every contaminant.",
  },
  {
    question: "What does 'ppb' and 'ppm' mean in water test results?",
    answer: "ppb means parts per billion — micrograms per liter (µg/L). ppm means parts per million — milligrams per liter (mg/L). One ppm = 1,000 ppb. PFAS results are typically reported in ppt (parts per trillion) — nanograms per liter (ng/L). Lead results are typically in ppb. Nitrate results are typically in mg/L (ppm).",
  },
  {
    question: "What should I do if a contaminant is detected above the MCL?",
    answer: "Contact your state health department or local health department for guidance. For private well users, this typically means investigating the source, considering treatment options, and possibly using an alternative water source for drinking and cooking while you address the issue. For public utility users, your utility is required to notify you and take corrective action if an MCL exceedance is confirmed in compliance monitoring.",
  },
  {
    question: "Do I need a certified lab to get reliable results?",
    answer: "For health decisions, yes. State-certified or NELAP-accredited laboratories follow standardized collection, chain-of-custody, and analysis procedures that ensure accuracy and traceability. Home test kits can provide useful screening but are not equivalent to certified lab analysis for regulatory or health-decision purposes.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(f => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
    { "@type": "ListItem", position: 2, name: "Labs", item: "https://waterutilityreport.com/labs" },
    { "@type": "ListItem", position: 3, name: "How To Read Water Test Results", item: "https://waterutilityreport.com/labs/how-to-read-water-test-results" },
  ],
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "How To Read Water Test Results: Interpreting Your Lab Report",
  description: "Guide to interpreting water quality lab reports — units, MCLs, health advisories, and next steps.",
  dateModified: "2026-05-13",
  publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
};

const units = [
  { unit: "mg/L", name: "Milligrams per liter", also: "Same as ppm (parts per million)", examples: "Nitrate, nitrite, hardness, iron, manganese" },
  { unit: "µg/L", name: "Micrograms per liter", also: "Same as ppb (parts per billion)", examples: "Lead, arsenic, many VOCs, some PFAS" },
  { unit: "ng/L", name: "Nanograms per liter", also: "Same as ppt (parts per trillion)", examples: "PFAS (PFOA, PFOS, PFNA — EPA MCLs at ppt scale)" },
  { unit: "CFU/100mL", name: "Colony-forming units per 100 mL", also: "—", examples: "Coliform bacteria, E. coli" },
  { unit: "pH units", name: "Dimensionless scale 0–14", also: "7 = neutral; <7 = acidic; >7 = alkaline", examples: "pH; secondary standard 6.5–8.5" },
];

const reportElements = [
  {
    element: "Sample ID / Chain of Custody",
    what: "Unique identifier linking your sample to lab analysis records. Verify this matches your submission.",
  },
  {
    element: "Analyte name",
    what: "The contaminant or water quality parameter tested. Chemical names may differ from common names (e.g., 'perfluorooctanoic acid' = PFOA).",
  },
  {
    element: "Result / Detected value",
    what: "The measured concentration, or 'ND' (not detected) / '<MDL' (below method detection limit). ND means the contaminant was not found above the lab's detection threshold.",
  },
  {
    element: "Units",
    what: "The unit of measurement for the result (mg/L, µg/L, ng/L, etc.). Critical for correct interpretation — 10 mg/L and 10 µg/L differ by a factor of 1,000.",
  },
  {
    element: "MDL / Reporting limit",
    what: "Method Detection Limit — the lowest level the method can reliably detect. Results below this appear as ND or '<[number]'. This is not zero.",
  },
  {
    element: "MCL / Health benchmark",
    what: "The regulatory limit or reference benchmark provided by the lab. Not all labs include this — you may need to look up the MCL separately.",
  },
  {
    element: "QC / Method reference",
    what: "Quality control indicators and the EPA or standard method used. Confirms the lab followed a validated analytical procedure.",
  },
];

const contaminantRef = [
  { name: "Lead", limit: "15 ppb (action level; MCLG = 0)", units: "µg/L (ppb)", note: "No safe level per CDC" },
  { name: "Nitrate (as N)", limit: "10 mg/L MCL", units: "mg/L (ppm)", note: "Critical for infants" },
  { name: "PFOA", limit: "4 ppt MCL (2024)", units: "ng/L (ppt)", note: "Applies to public utilities" },
  { name: "PFOS", limit: "4 ppt MCL (2024)", units: "ng/L (ppt)", note: "Applies to public utilities" },
  { name: "Arsenic", limit: "10 µg/L MCL", units: "µg/L (ppb)", note: "Naturally occurring in some regions" },
  { name: "Total coliform", limit: "0 detections per 100mL (MCL)", units: "CFU/100mL or P/A", note: "Presence/absence may be reported" },
  { name: "E. coli", limit: "0 (MCL: no detectable E. coli)", units: "CFU/100mL or P/A", note: "Any detection is a violation for utilities" },
  { name: "pH", limit: "6.5–8.5 (secondary standard)", units: "pH units", note: "Affects corrosivity; non-enforceable" },
];

export default function HowToReadWaterTestResultsPage() {
  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={articleJsonLd} />

      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/labs" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-5 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Water Testing Labs
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Lab Report Guide</p>
          <h1 className="font-display text-4xl text-white mb-3">How To Read Water Test Results</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Water quality lab reports use technical units and regulatory terms that can be hard to
            interpret. This guide explains what each element of a lab report means, how to compare
            results to EPA limits, and what to do next.
          </p>
          <p className="text-white/40 text-xs mt-4 font-mono">Last updated: 2026-05-13 · Source: EPA, NELAP, state lab programs</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Direct answer */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Direct Answer</p>
          <p className="text-foreground leading-relaxed">
            A water test report shows detected concentrations (or ND = not detected) in specific units
            (mg/L, µg/L, ng/L). Compare each result to the EPA MCL for that contaminant — the lab report
            may include reference limits, or you can look them up using the table below. A result below
            the MCL is within the regulatory standard. A result of ND means the contaminant was not found
            at or above the lab&apos;s detection threshold — not that it is definitively absent.
          </p>
        </section>

        {/* Units explained */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Understanding Units in Water Test Results</h2>
          <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
            Units matter. A result of 10 mg/L and 10 µg/L differ by a factor of 1,000. Make sure you
            are comparing results to benchmarks in the same units.
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Unit</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Full Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Also Known As</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Typical Use</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {units.map((row) => (
                  <tr key={row.unit} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono font-medium text-foreground text-xs">{row.unit}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.name}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.also}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.examples}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* What each element means */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">What Each Element of a Lab Report Means</h2>
          <div className="space-y-3">
            {reportElements.map((item) => (
              <div key={item.element} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <Droplets className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground mb-0.5">{item.element}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.what}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MCL reference */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">Quick Reference: EPA Limits for Common Contaminants</h2>
          <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
            Use these benchmarks to interpret your results. MCL = Maximum Contaminant Level (enforceable).
            MCLG = Maximum Contaminant Level Goal (health-based target, not always enforceable).
          </p>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Contaminant</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">EPA Limit</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Result Units</th>
                  <th className="text-left px-4 py-3 font-semibold text-foreground text-xs">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {contaminantRef.map((row) => (
                  <tr key={row.name} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground text-xs">{row.name}</td>
                    <td className="px-4 py-3 text-foreground font-mono text-xs font-semibold">{row.limit}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.units}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Source: EPA National Primary Drinking Water Regulations (current). For the full list:{" "}
            <a
              href="https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wur-teal hover:underline inline-flex items-center gap-0.5"
            >
              EPA NPDWR <ExternalLink className="w-2.5 h-2.5" />
            </a>
          </p>
        </section>

        {/* What to do after */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">What To Do After Reviewing Results</h2>
          <div className="space-y-3">
            {[
              {
                condition: "Results are ND (not detected) for all tested contaminants",
                action: "No immediate action needed for those contaminants. Keep a copy of results for future comparison. Repeat testing annually or per state guidance for well users.",
                type: "good",
              },
              {
                condition: "A result is below the MCL but above zero",
                action: "Within regulatory standards. Note whether the contaminant has an MCLG of zero (lead, nitrite, coliform), as any level may carry some health consideration. Review whether treatment is warranted based on your specific situation.",
                type: "neutral",
              },
              {
                condition: "A result exceeds the MCL or health advisory",
                action: "Contact your state health department or local health department for guidance. Consider using an alternative water source for drinking and cooking while you investigate treatment options. For private wells: contact the certifying lab for interpretation.",
                type: "warning",
              },
              {
                condition: "You have questions about your specific results",
                action: "Contact the certifying laboratory — they can explain what the results mean for your situation. Your state drinking water program or local health department can also provide guidance.",
                type: "neutral",
              },
            ].map((item) => (
              <div
                key={item.condition}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  item.type === "good"
                    ? "border-wur-teal/20 bg-wur-teal/5"
                    : item.type === "warning"
                    ? "border-wur-warning-border bg-wur-warning-bg"
                    : "border-border bg-card"
                }`}
              >
                {item.type === "good" ? (
                  <CheckCircle2 className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                ) : item.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-wur-warning shrink-0 mt-0.5" />
                ) : (
                  <Droplets className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-sm font-semibold text-foreground mb-1">{item.condition}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Next steps */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="font-display text-xl text-foreground mb-4">Next Steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { href: "/labs/pfas-water-testing", label: "PFAS testing guide", desc: "Lab methods and interpreting PFAS results in ppt" },
              { href: "/labs/lead-water-testing", label: "Lead testing guide", desc: "First-draw protocol and what ppb results mean" },
              { href: "/labs/nitrate-water-testing", label: "Nitrate testing guide", desc: "MCL, infant risk, and what mg/L means" },
              { href: "/labs/drinking-water-test-cost", label: "Water testing cost guide", desc: "What certified lab tests cost by contaminant" },
              { href: "/treatment", label: "Water treatment options", desc: "Filters and systems matched to specific contaminants" },
              { href: "/labs", label: "Find a certified testing lab", desc: "State-certified and NELAP labs by state" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
              >
                <FlaskConical className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-wur-teal transition-colors">{item.label}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <FaqSection faqs={faqs} title="Water Test Results FAQs" />

        {/* Sources */}
        <section className="rounded-lg border border-border bg-muted/30 p-4">
          <p className="text-xs font-semibold text-foreground mb-2">Data Sources and Methodology</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Benchmarks and regulatory guidance are drawn from EPA National Primary Drinking Water Regulations,
            EPA analytical methods documentation, NELAP accreditation standards, and CDC health guidance.
            MCL values reflect current published standards as of 2026.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">Full methodology →</Link>
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[
              { label: "EPA NPDWR (full MCL list)", url: "https://www.epa.gov/ground-water-and-drinking-water/national-primary-drinking-water-regulations" },
              { label: "NELAP Accreditation", url: "https://www.nist.gov/nvlap/nelap" },
              { label: "EPA Certified Lab Directory", url: "https://www.epa.gov/dwlabcert" },
            ].map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline"
              >
                {s.label} <ExternalLink className="w-2.5 h-2.5" />
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground/60 font-mono mt-2">Last updated: 2026-05-13</p>
        </section>
      </div>
    </div>
  );
}
