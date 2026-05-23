import Link from "next/link";
import { ArrowRight, FlaskConical, Building2, MapPin, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import FaqSection from "@/components/faq-section";
import SourcesBlock from "@/components/sources-block";
import JsonLd from "@/components/json-ld";
import ZipLookup from "@/components/zip-lookup";
import { nitrateStateData, NITRATE_SOURCES, NITRATE_LAST_UPDATED } from "@/lib/content/contaminant-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Nitrate in Drinking Water — Utilities, Risks, and Next Steps | Water Utility Report",
  description: "How nitrate gets into drinking water, who is most at risk, which states and utilities have documented concerns, and what steps to take. Official EPA and state data.",
};

const STATE_PAGES = Object.values(nitrateStateData).map((s) => ({
  href: `/contaminants/nitrate/${s.stateSlug}`,
  name: s.stateName,
  abbr: s.stateAbbr,
}));

const faqs = [
  {
    question: "Is nitrate in drinking water a widespread problem in the U.S.?",
    answer: "Yes. Nitrate contamination is one of the most common drinking water quality issues in the United States, particularly in agricultural regions. The EPA estimates millions of people are served by public water systems that have detected nitrate, and private well users in farming areas face even greater risk. Elevated nitrate most often traces to fertilizer runoff, animal waste, and failing septic systems.",
  },
  {
    question: "What is the legal limit for nitrate in U.S. drinking water?",
    answer: "The EPA Maximum Contaminant Level (MCL) for nitrate is 10 mg/L measured as nitrate-nitrogen (NO3-N). This is a hard enforceable limit — unlike lead's 'action level.' Public water systems are required to notify customers promptly and take corrective action if nitrate exceeds 10 mg/L.",
  },
  {
    question: "How does nitrate get into drinking water?",
    answer: "Nitrate enters drinking water through several pathways: agricultural fertilizer and animal waste runoff that leaches into groundwater and surface water; septic system effluent near water sources; and natural soil deposits in some regions. Surface water supplies can spike after rain events in agricultural areas. Groundwater wells may show persistent elevated nitrate that changes slowly over seasons.",
  },
  {
    question: "Who is most at risk from nitrate in drinking water?",
    answer: "Infants under six months of age face the most serious risk. High nitrate interferes with the blood's ability to carry oxygen, causing a condition called methemoglobinemia — commonly called 'blue baby syndrome' — which can be life-threatening. Pregnant residents, people with certain enzyme deficiencies, and immunocompromised individuals also face elevated concern. Adults in good health generally tolerate nitrate at levels at or near the MCL, but long-term exposure at elevated levels has been associated with increased cancer risk in some studies.",
  },
  {
    question: "Does boiling water remove nitrate?",
    answer: "No. Boiling does not remove nitrate and actually concentrates it by evaporating water. Nitrate is only effectively removed by reverse osmosis (NSF/ANSI Standard 58), distillation, or ion exchange — not by boiling, carbon filtration, or UV treatment.",
  },
  {
    question: "What type of filter removes nitrate from drinking water?",
    answer: "Reverse osmosis systems certified to NSF/ANSI Standard 58 are the most accessible residential option for nitrate removal, achieving 85–95% reduction. Distillation units and anion exchange systems also remove nitrate effectively. Standard activated carbon (pitcher or under-sink) filters do NOT remove nitrate and should not be used for this purpose.",
  },
  {
    question: "Are private wells regulated for nitrate?",
    answer: "No. Private wells are not regulated under the Safe Drinking Water Act. Homeowners with private wells are responsible for testing their own water. In agricultural regions, state health departments and land-grant universities often offer subsidized nitrate testing. The EPA and CDC recommend private well owners test for nitrate at least once per year.",
  },
  {
    question: "How do I find out if my utility has had nitrate violations?",
    answer: "Look up your utility on this site using the ZIP lookup below. Each utility page shows violations from EPA's SDWIS database, including nitrate violations, the year they occurred, and whether they are open or resolved. You can also review your utility's most recent Consumer Confidence Report (CCR), which must disclose any MCL violations in the past year.",
  },
];

export default async function NitrateNationalHub() {
  const utilitiesWithNitrateViolations = await prisma.utility.findMany({
    where: {
      publish_status: "published",
      violations: {
        some: { contaminant_name: { contains: "nitrate", mode: "insensitive" } },
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
    headline: "Nitrate in Drinking Water — Utilities, Risks, and Next Steps",
    dateModified: NITRATE_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "Nitrate", item: "https://waterutilityreport.com/contaminants/nitrate" },
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
      <div className="bg-wur-caution-bg border-b border-wur-caution-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
            <Link href="/contaminants" className="hover:text-primary transition-colors">Contaminants</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Nitrate</span>
          </nav>
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-wur-caution mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-wur-caution">Moderate–High Risk</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium text-wur-caution bg-wur-caution-bg border-wur-caution-border">Agricultural Contaminant</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-3">
                Nitrate in Drinking Water
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Nitrate is one of the most common drinking water contaminants in the United States. It enters water primarily from fertilizer runoff, animal waste, and septic systems — and poses an immediate, life-threatening risk to infants under six months.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA, CDC · Last reviewed: {NITRATE_LAST_UPDATED} · Data: official EPA SDWIS records
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
                Is nitrate in drinking water a real concern?
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Yes — particularly in agricultural states and for households on private wells. The EPA&apos;s MCL for nitrate is 10 mg/L as nitrogen. Exceeding this level poses an immediate risk to infants under six months, who can develop methemoglobinemia (blue baby syndrome) — a potentially fatal condition. Long-term elevated exposure has been linked to increased colorectal cancer risk in adults in some epidemiological studies.
              </p>
            </section>

            {/* Key facts table */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Key Facts</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "EPA Maximum Contaminant Level (MCL)", value: "10 mg/L as nitrate-nitrogen (NO3-N)" },
                      { label: "Is there a safe level?", value: "Below 10 mg/L is considered safe for adults; infants under 6 months should not drink water above this threshold" },
                      { label: "Primary sources", value: "Agricultural fertilizer and manure runoff; septic system effluent; natural soil deposits" },
                      { label: "Highest-risk group", value: "Infants under 6 months (methemoglobinemia risk); also pregnant residents and immunocompromised individuals" },
                      { label: "Does boiling help?", value: "No — boiling concentrates nitrate. Do not boil nitrate-contaminated water for infant use." },
                      { label: "Effective treatment", value: "Reverse osmosis (NSF/ANSI 58), distillation, or anion exchange — NOT carbon filters" },
                      { label: "Private wells", value: "Not regulated under SDWA — owners must test independently. Annual testing is recommended in agricultural areas." },
                      { label: "Federal rule", value: "Safe Drinking Water Act — public systems must notify customers within 24 hours of exceeding the MCL" },
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

            {/* How it gets in */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How Nitrate Gets Into Drinking Water</h2>
              <div className="space-y-3">
                {[
                  { title: "Agricultural fertilizer and manure runoff", desc: "Nitrogen-based fertilizers and animal waste applied to cropland can leach through soil into groundwater or run off into surface water supplies — particularly after rain events. This is the dominant pathway in most U.S. regions with elevated nitrate." },
                  { title: "Septic system effluent", desc: "Failing or poorly sited septic systems can release nitrogen-rich wastewater near drinking water wells. Homes on older septic systems in rural areas, and areas with high well density, face elevated risk." },
                  { title: "Concentrated animal feeding operations (CAFOs)", desc: "Large livestock operations generate significant quantities of animal waste. Lagoon leaks, overapplication of manure to fields, and proximity to water sources can create localized hotspots of nitrate contamination." },
                  { title: "Natural geological deposits", desc: "In some regions, naturally occurring nitrogen compounds in soil and rock contribute background levels of nitrate to groundwater. This is less common than agricultural sources but can affect otherwise rural areas." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                    <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-foreground text-sm">{title}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Who should pay attention */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Who Should Pay Closest Attention</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Households with infants under six months",
                  "Pregnant residents",
                  "Anyone on a private well in an agricultural area",
                  "Households near livestock operations or CAFOs",
                  "Residents in areas with older or failing septic systems",
                  "Rural households on shallow groundwater wells",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 p-3 rounded-lg bg-wur-caution-bg border border-wur-caution-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-caution mt-1.5 shrink-0" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Infant warning callout */}
            <section className="rounded-xl border-2 border-wur-danger-border bg-wur-danger-bg p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-danger mb-2">Critical — Infants Under 6 Months</p>
              <p className="text-sm text-foreground leading-relaxed">
                Do not use water that exceeds 10 mg/L nitrate-nitrogen to prepare infant formula or feed infants under six months. Do not boil this water — boiling concentrates nitrate. Use bottled water, a reverse osmosis system certified to NSF/ANSI 58, or a distillation unit until the issue is resolved. Contact your utility or local health department immediately if you receive a nitrate exceedance notice.
              </p>
            </section>

            {/* How to check */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How to Check Your Situation</h2>
              <ol className="space-y-3">
                {[
                  { step: "1", text: "Identify your water utility using the ZIP lookup below or via your state page." },
                  { step: "2", text: "Read your utility's page on this site — it shows recent nitrate violations and risk level based on EPA SDWIS data." },
                  { step: "3", text: "Review your utility's most recent Consumer Confidence Report (CCR), which must disclose any MCL exceedances in the past year." },
                  { step: "4", text: "If you are on a private well, arrange independent testing at a state-certified lab. In agricultural areas, test annually. Your state health department maintains a list of certified labs." },
                  { step: "5", text: "If you have an infant under six months, take immediate precautionary steps — use bottled water or a certified RO system — while you gather information." },
                  { step: "6", text: "If you receive an official nitrate exceedance notice from your utility, follow their guidance and do not use tap water for infants until the issue is resolved." },
                ].map(({ step, text }) => (
                  <li key={step} className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full bg-wur-teal/10 text-wur-teal font-bold text-sm flex items-center justify-center shrink-0">{step}</span>
                    <p className="text-sm text-muted-foreground pt-1">{text}</p>
                  </li>
                ))}
              </ol>
            </section>

            {/* Treatment */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Treatment Options</h2>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Nitrate is not removed by activated carbon filters, boiling, or UV treatment. Only the options below are effective.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium text-foreground text-sm mb-1">NSF/ANSI Standard 58 — Reverse Osmosis</p>
                  <p className="text-sm text-muted-foreground">RO systems certified to NSF/ANSI 58 reduce nitrate by 85–95% at the point of use. Under-sink installation is required. This is the most practical residential option for households with nitrate concerns.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium text-foreground text-sm mb-1">Distillation</p>
                  <p className="text-sm text-muted-foreground">Counter-top or under-sink distillation units effectively remove nitrate along with most other contaminants. Produces small quantities of water — suitable for drinking and cooking, not whole-house use.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium text-foreground text-sm mb-1">Anion Exchange</p>
                  <p className="text-sm text-muted-foreground">Ion exchange systems designed for nitrate removal use a resin that exchanges nitrate ions for chloride. Effective but requires periodic resin regeneration and monitoring. Most practical as a point-of-entry system.</p>
                </div>
                <div className="p-4 rounded-lg border-2 border-wur-danger-border bg-wur-danger-bg">
                  <p className="font-medium text-wur-danger text-sm mb-1">Carbon filters do NOT remove nitrate</p>
                  <p className="text-sm text-wur-danger/80">Standard pitcher filters, faucet filters, and activated carbon under-sink filters — including those certified to NSF/ANSI 42 or 53 — are not certified to remove nitrate and should not be used for this purpose.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                See also: <Link href="/treatment/reverse-osmosis" className="text-primary hover:underline">Reverse Osmosis filtration guide</Link>
              </p>
            </section>

            {/* Utilities with nitrate violations */}
            {utilitiesWithNitrateViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">Utilities With Nitrate Violation Records</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilities listed below have at least one nitrate violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status.
                </p>
                <div className="space-y-2">
                  {utilitiesWithNitrateViolations.map((u) => (
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
              <h2 className="font-display text-2xl text-foreground mb-2">Nitrate in Drinking Water by State</h2>
              <p className="text-sm text-muted-foreground mb-4">
                State-specific guides covering local utilities, regulatory context, and relevant resources.
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

            <SourcesBlock sources={NITRATE_SOURCES} lastUpdated={NITRATE_LAST_UPDATED} confidence="high" />
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
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Guides</p>
                <Link href="/guides/what-are-nitrates-in-water" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">What are nitrates in drinking water?</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/guides/does-boiling-water-remove-lead-pfas-or-nitrates" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Does boiling water remove nitrates?</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/guides/home-water-test-kits-vs-certified-labs" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Home test kits vs. certified labs</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
              </div>
              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Related</p>
                <Link href="/contaminants/lead" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Lead in Drinking Water</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/treatment/reverse-osmosis" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Reverse Osmosis Guide</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/well-water" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Well Water Guide</span>
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
