import Link from "next/link";
import { ArrowRight, FlaskConical, Building2, MapPin, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import FaqSection from "@/components/faq-section";
import SourcesBlock from "@/components/sources-block";
import JsonLd from "@/components/json-ld";
import ZipLookup from "@/components/zip-lookup";
import { pfasStateData, PFAS_SOURCES, PFAS_LAST_UPDATED } from "@/lib/content/pfas-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "PFAS in Drinking Water — Forever Chemicals, EPA 4 ppt Limit & State Guides | Water Utility Report",
  description: "PFAS 'forever chemicals' in U.S. drinking water: the EPA's 2024 MCL of 4 ppt, where PFAS comes from, which states have the worst contamination, how to filter PFAS, and state-by-state guides.",
};

const STATE_PAGES = Object.values(pfasStateData).map((s) => ({
  href: `/contaminants/pfas/${s.stateSlug}`,
  name: s.stateName,
  abbr: s.stateAbbr,
}));

const faqs = [
  {
    question: "What are PFAS and why are they called 'forever chemicals'?",
    answer: "PFAS (per- and polyfluoroalkyl substances) are a class of over 12,000 synthetic chemicals characterized by extremely strong carbon-fluorine bonds that do not break down in the environment or in the human body under normal conditions. They have been used since the 1940s in non-stick cookware, stain-resistant textiles, food packaging, and AFFF firefighting foam. Because they persist indefinitely in the environment and accumulate in living organisms, they have been nicknamed 'forever chemicals.'",
  },
  {
    question: "What is the EPA limit for PFAS in drinking water?",
    answer: "The EPA finalized Maximum Contaminant Levels (MCLs) for PFAS in April 2024 — the first federal enforceable limits for PFAS in drinking water. The MCL is 4 parts per trillion (ppt) for PFOA and PFOS individually — the most protective drinking water standard ever set. The EPA also set limits for PFNA (10 ppt), PFHxS (10 ppt), HFPO-DA/GenX (10 ppt), and a hazard index for mixtures. Public water systems must comply by 2027. The MCLG (the goal, not just the limit) is zero for PFOA and PFOS.",
  },
  {
    question: "Where does PFAS in drinking water come from?",
    answer: "The two dominant sources of PFAS in U.S. drinking water are: (1) Military installations — AFFF (aqueous film-forming foam) used at Air Force, Navy, and Army installations for aircraft fire suppression and fire training has contaminated groundwater at hundreds of U.S. military bases over the past 60 years. This is the largest single category of PFAS contamination. (2) Industrial manufacturing — 3M, DuPont/Chemours, Saint-Gobain, Tyco Fire Products, and dozens of other manufacturers produced or used PFAS chemicals and discharged them into the environment.",
  },
  {
    question: "Which states have the most serious PFAS contamination?",
    answer: "States with the most documented PFAS contamination include Michigan (Wolverine World Wide/Rockford and Wurtsmith AFB), Minnesota (3M East Metro), New York (Hoosick Falls, Newburgh, Long Island), New Jersey (DuPont legacy, military bases), Pennsylvania (Horsham/Warminster military cluster), North Carolina (Chemours Fayetteville Works/Cape Fear River), West Virginia (DuPont Washington Works), Colorado (Peterson/Buckley/Schriever Air Force bases), Massachusetts (Otis/Cape Cod, South Weymouth NAS), and New Hampshire (Saint-Gobain Merrimack, Pease ANG Base).",
  },
  {
    question: "Does PFAS have health effects?",
    answer: "Yes — PFAS are associated with serious health effects at very low concentrations. The EPA's 2024 PFAS MCL is based on evidence linking PFAS exposure to kidney cancer, testicular cancer, thyroid disease, immune system suppression (including reduced vaccine effectiveness), high cholesterol, pregnancy complications, and developmental effects in children. PFOA and PFOS are classified as possible human carcinogens. The MCLG of zero for PFOA and PFOS reflects the scientific conclusion that there is no safe level of exposure.",
  },
  {
    question: "Does a Brita or standard pitcher filter remove PFAS?",
    answer: "Most standard pitcher filters provide limited PFAS reduction but are not certified for PFAS removal. For reliable protection: (1) Reverse osmosis systems certified to NSF/ANSI 58 remove 90–99% of PFAS. (2) Under-sink activated carbon block filters certified to NSF/ANSI 53 or 58 for PFAS reduction provide significant removal. Always verify the specific product's NSF certification for PFAS — a general carbon filter claim is not sufficient. Replace filters on schedule.",
  },
  {
    question: "Does boiling water remove PFAS?",
    answer: "No. Boiling does not remove PFAS. Because PFAS chemicals have high thermal stability (that's one reason they were commercially valuable), boiling has no significant effect on PFAS concentrations. Boiling can actually concentrate PFAS slightly by reducing water volume through evaporation.",
  },
  {
    question: "How do I know if my water has PFAS?",
    answer: "Request your utility's most recent Consumer Confidence Report (CCR) — it is required to be sent to customers annually and must include PFAS monitoring results. Under EPA's UCMR5 program, public water systems have been required to test for PFAS since 2023. For private well owners, PFAS is unregulated — you must order a certified lab test yourself. State-certified labs typically charge $150–$400 for a PFAS panel covering multiple compounds.",
  },
];

export default async function PfasNationalHub() {
  const utilitiesWithPfasViolations = await prisma.utility.findMany({
    where: {
      publish_status: "published",
      violations: {
        some: {
          OR: [
            { contaminant_name: { contains: "pfas", mode: "insensitive" } },
            { contaminant_name: { contains: "pfoa", mode: "insensitive" } },
            { contaminant_name: { contains: "pfos", mode: "insensitive" } },
          ],
        },
      },
    },
    select: {
      slug: true, name: true, risk_level: true, population_served: true,
      state: { select: { abbreviation: true, slug: true } },
    },
    orderBy: { population_served: "desc" },
    take: 10,
  });

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "PFAS in Drinking Water — Forever Chemicals, EPA Limit & State Guides",
    dateModified: PFAS_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "PFAS", item: "https://waterutilityreport.com/contaminants/pfas" },
    ],
  };

  const riskBgs: Record<string, string> = {
    safe: "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
    low: "text-emerald-700 bg-emerald-50 border-emerald-200",
    moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
    high: "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
    critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <div className="bg-wur-danger-bg border-b border-wur-danger-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
            <Link href="/contaminants" className="hover:text-primary transition-colors">Contaminants</Link>
            <span>›</span>
            <span className="text-foreground font-medium">PFAS</span>
          </nav>
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-wur-danger mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-wur-danger">Critical Risk Level</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium text-wur-danger bg-wur-danger-bg border-wur-danger-border">Forever Chemicals</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-3">
                PFAS in Drinking Water
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                PFAS — per- and polyfluoroalkyl substances — are synthetic chemicals used for decades in industrial and military applications. They do not break down in the environment or the human body. In April 2024, the EPA finalized the first federal drinking water standard for PFAS: 4 parts per trillion for PFOA and PFOS.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA, CDC, USGS · Last reviewed: {PFAS_LAST_UPDATED} · Data: official EPA SDWIS records
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">

            {/* Quick answer */}
            <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Quick Answer</p>
              <p className="text-foreground leading-relaxed font-medium mb-2">
                Is PFAS in drinking water a real concern in the U.S.?
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Yes — PFAS contamination of U.S. drinking water is one of the most significant public health issues in the country. The EPA&apos;s own data from the UCMR5 monitoring program found PFAS at detectable levels in approximately 45% of U.S. public water systems tested. PFAS from military AFFF foam and industrial manufacturing has contaminated groundwater near hundreds of installations and facilities. The EPA&apos;s 2024 MCL of 4 ppt for PFOA and PFOS — the most protective water standard ever set — will require hundreds of utilities to install new treatment.
              </p>
            </section>

            {/* Key facts */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Key Facts</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "EPA MCL (PFOA, PFOS)", value: "4 ppt (parts per trillion) — finalized April 2024; utilities must comply by 2027" },
                      { label: "EPA MCL (PFNA, PFHxS, HFPO-DA/GenX)", value: "10 ppt each — also part of the 2024 final rule" },
                      { label: "MCLG (health goal)", value: "Zero for PFOA and PFOS — no safe level established" },
                      { label: "Primary source in water", value: "AFFF firefighting foam at military bases and airports; industrial manufacturing (3M, DuPont, Chemours, Saint-Gobain)" },
                      { label: "Does boiling help?", value: "No — boiling concentrates PFAS. Use certified reverse osmosis or activated carbon." },
                      { label: "Effective treatment", value: "NSF/ANSI 58 certified reverse osmosis (90–99% removal); NSF/ANSI 53/58 certified activated carbon" },
                      { label: "Compliance deadline for utilities", value: "2027 — public water systems must meet the 4 ppt MCL" },
                      { label: "Private wells", value: "Unregulated — owners near military bases or industrial sites should test independently" },
                    ].map(({ label, value }, i) => (
                      <tr key={i} className={i % 2 === 0 ? "bg-muted/30" : "bg-background"}>
                        <td className="px-4 py-3 font-medium text-foreground w-1/3 align-top">{label}</td>
                        <td className="px-4 py-3 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* What PFAS is */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">What Are PFAS?</h2>
              <div className="space-y-3">
                {[
                  { title: "A class of over 12,000 synthetic chemicals", desc: "PFAS is not a single chemical — it is a family of substances all sharing the carbon-fluorine bond structure. The most studied are PFOA (used in Teflon manufacturing) and PFOS (used in 3M Scotchgard). Newer 'short-chain' PFAS and 'next-generation' replacements like HFPO-DA (GenX) are now also regulated." },
                  { title: "AFFF firefighting foam — the dominant contamination source", desc: "Aqueous Film-Forming Foam was standard firefighting equipment at U.S. Air Force, Navy, and Army installations from the 1970s onward. Fire training exercises and aircraft emergency responses used enormous quantities of AFFF, which soaked into soil and groundwater. The DoD has identified over 700 installations with known or suspected PFAS contamination." },
                  { title: "Industrial manufacturing", desc: "3M manufactured PFOA and PFOS for decades at its Cottage Grove, MN facility. DuPont used PFOA to manufacture Teflon at its Washington Works plant in Parkersburg, WV. Saint-Gobain used PFAS in industrial tape manufacturing in Merrimack, NH and Bennington, VT. These industrial sources contaminated communities near their facilities." },
                  { title: "Health effects at extremely low concentrations", desc: "The EPA's 2024 MCL of 4 ppt reflects evidence that PFAS causes harm at concentrations measured in parts per trillion — equivalent to about 4 drops in an Olympic swimming pool. Health effects linked to PFAS include kidney and testicular cancer, thyroid disruption, immune suppression, high cholesterol, and developmental effects in children." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                    <AlertTriangle className="w-4 h-4 text-wur-danger mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Utilities with violations */}
            {utilitiesWithPfasViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">Utilities With PFAS Violation Records</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilities listed below have at least one PFAS violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status.
                </p>
                <div className="space-y-2">
                  {utilitiesWithPfasViolations.map((u) => (
                    <Link
                      key={u.slug}
                      href={`/utilities/${u.slug}`}
                      className="group flex items-center justify-between p-4 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Building2 className="w-4 h-4 text-wur-teal shrink-0" />
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{normalizeName(u.name)}</p>
                          <p className="text-xs text-muted-foreground">{u.state.abbreviation} · {u.population_served.toLocaleString()} served</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${riskBgs[u.risk_level] ?? riskBgs.safe}`}>{u.risk_level}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* State pages */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">PFAS in Drinking Water by State</h2>
              <p className="text-sm text-muted-foreground mb-4">
                State-specific guides covering local contamination sources, utilities, regulatory context, and resources.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {STATE_PAGES.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group flex items-center gap-2 p-3 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5 text-wur-teal shrink-0" />
                    <span className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">{s.name}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal ml-auto transition-colors" />
                  </Link>
                ))}
              </div>
            </section>

            {/* FAQ */}
            <FaqSection faqs={faqs} />

            <SourcesBlock sources={PFAS_SOURCES} lastUpdated={PFAS_LAST_UPDATED} confidence="high" />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-lg border border-border bg-card p-5 sticky top-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Find Your Utility</p>
              <ZipLookup variant="inline" />
              <div className="mt-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">State Guides</p>
                {STATE_PAGES.slice(0, 8).map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="flex items-center justify-between py-1.5 group"
                  >
                    <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">{s.name}</span>
                    <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                  </Link>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Related</p>
                <Link href="/contaminants/arsenic" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Arsenic in Drinking Water</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/treatment/reverse-osmosis" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Reverse Osmosis Guide</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/treatment/activated-carbon" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Activated Carbon Filter Guide</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/contaminants" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">All Contaminants</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
