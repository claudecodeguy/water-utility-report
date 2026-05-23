import Link from "next/link";
import { ArrowRight, FlaskConical, Building2, MapPin, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import FaqSection from "@/components/faq-section";
import SourcesBlock from "@/components/sources-block";
import JsonLd from "@/components/json-ld";
import ZipLookup from "@/components/zip-lookup";
import { leadStateData, LEAD_SOURCES, LEAD_LAST_UPDATED } from "@/lib/content/contaminant-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Lead in Drinking Water — Utilities, Risks, and Next Steps | Water Utility Report",
  description: "How lead gets into drinking water, who is most at risk, which states and utilities have documented concerns, and what steps to take. Official EPA and CDC data.",
};

const STATE_PAGES = Object.values(leadStateData).map((s) => ({
  href: `/contaminants/lead/${s.stateSlug}`,
  name: s.stateName,
  abbr: s.stateAbbr,
}));

const faqs = [
  {
    question: "Is lead in drinking water a widespread problem in the U.S.?",
    answer: "Yes. The EPA estimates that lead plumbing materials — including lead service lines, lead solder, and lead-containing brass fixtures — are present in millions of homes across the country. Lead does not come from the source water; it leaches into water from plumbing materials between the treatment plant and the tap.",
  },
  {
    question: "What is the legal limit for lead in U.S. drinking water?",
    answer: "The EPA's lead action level is 15 micrograms per liter (µg/L). However, the EPA and CDC have established that there is no safe level of lead exposure for children. The Maximum Contaminant Level Goal (MCLG) for lead is zero.",
  },
  {
    question: "How does lead get into drinking water?",
    answer: "Lead rarely comes from source water. It enters water as it sits in or moves through lead service lines (the pipe connecting a building to the water main), lead solder used in copper plumbing before it was banned in 1986, and older brass fixtures and faucets that contain lead. Water that is soft, acidic, or low in mineral content is more likely to dissolve lead from these materials.",
  },
  {
    question: "Who is most at risk from lead in drinking water?",
    answer: "Infants and children under six are at the greatest risk because their developing nervous systems are particularly sensitive to lead. Pregnant residents also face elevated concern. Anyone living in a home built before 1986 — when lead solder was banned — faces higher risk than those in newer construction.",
  },
  {
    question: "Does boiling water remove lead?",
    answer: "No. Boiling does not remove lead and can actually concentrate it by reducing water volume. To reduce lead, use a certified point-of-use filter (NSF/ANSI Standard 53 or 58) or flush the cold-water tap for at least 30 seconds before using water for drinking or cooking if the water has been sitting in pipes.",
  },
  {
    question: "What type of filter removes lead from drinking water?",
    answer: "Filters certified to NSF/ANSI Standard 53 (solid block activated carbon) or Standard 58 (reverse osmosis) are verified to reduce lead. Look for NSF certification — not just a claim. Pitcher filters, under-sink filters, and whole-house filters must have a specific NSF/ANSI 53 or 58 certification for lead reduction.",
  },
  {
    question: "Should I flush my tap before drinking water?",
    answer: "EPA recommends flushing the cold-water tap for 30 seconds to 2 minutes before using water for drinking or cooking if the water has been sitting in pipes for 6 or more hours. This is a temporary mitigation measure — not a replacement for addressing service line or plumbing issues.",
  },
  {
    question: "How do I find out if my utility has a lead service line to my home?",
    answer: "Under the revised Lead and Copper Rule, water utilities are required to provide customers with information about whether a lead service line connects their home to the water main. Contact your utility and request your address-level service line material status. Many utilities post inventories online.",
  },
];

export default async function LeadNationalHub() {
  const utilitiesWithLeadViolations = await prisma.utility.findMany({
    where: {
      publish_status: "published",
      violations: {
        some: { contaminant_name: { contains: "lead", mode: "insensitive" } },
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
    headline: "Lead in Drinking Water — Utilities, Risks, and Next Steps",
    dateModified: LEAD_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "Lead", item: "https://waterutilityreport.com/contaminants/lead" },
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
      <div className="bg-wur-warning-bg border-b border-wur-warning-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-xs text-muted-foreground mb-4 flex items-center gap-1.5">
            <Link href="/contaminants" className="hover:text-primary transition-colors">Contaminants</Link>
            <span>›</span>
            <span className="text-foreground font-medium">Lead</span>
          </nav>
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-wur-warning mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-wur-warning">High Risk Level</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium text-wur-warning bg-wur-warning-bg border-wur-warning-border">Heavy Metals</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-3">
                Lead in Drinking Water
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Lead does not come from water sources — it enters water from aging pipes, service lines, and plumbing materials inside and outside the home. There is no safe level of lead exposure for children.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA, CDC · Last reviewed: {LEAD_LAST_UPDATED} · Data: official EPA SDWIS records
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
                Is lead in drinking water a real concern?
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Yes. EPA estimates that lead plumbing materials are present in millions of U.S. homes. Lead leaches into water from lead service lines, lead solder in pre-1986 plumbing, and older brass fixtures. The CDC and EPA have determined there is no safe level of lead exposure for children. The EPA&apos;s Maximum Contaminant Level Goal for lead is zero.
              </p>
            </section>

            {/* Key facts table */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Key Facts</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "EPA Action Level", value: "15 µg/L (micrograms per liter)" },
                      { label: "Maximum Contaminant Level Goal (MCLG)", value: "Zero — no safe level established" },
                      { label: "Primary source", value: "Lead service lines, pre-1986 lead solder, brass fixtures — not source water" },
                      { label: "Highest-risk group", value: "Children under six, infants, pregnant residents" },
                      { label: "Does boiling help?", value: "No — boiling concentrates lead. Use a certified filter." },
                      { label: "Effective treatment", value: "NSF/ANSI 53 (activated carbon) or NSF/ANSI 58 (reverse osmosis)" },
                      { label: "Pre-1986 homes", value: "Most likely to contain lead solder or lead-containing brass fittings" },
                      { label: "Federal rule", value: "Lead and Copper Rule Revisions (LCRR) — service line inventories required" },
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
              <h2 className="font-display text-2xl text-foreground mb-4">How Lead Gets Into Drinking Water</h2>
              <div className="space-y-3">
                {[
                  { title: "Lead service lines", desc: "The pipe that connects a building to the water main may be made of lead — especially in homes built before 1986. These lines can leach lead throughout the day, particularly when water has been sitting in them." },
                  { title: "Lead solder and fittings", desc: "Lead solder was commonly used to join copper pipes until it was banned for potable water systems in 1986. Homes built before that date may still have lead solder at joints and connections." },
                  { title: "Brass faucets and valves", desc: "Older brass faucets, valves, and fixtures can contain significant amounts of lead. Even 'lead-free' fixtures sold before 2014 were allowed to contain up to 8% lead under the federal standard." },
                  { title: "Water chemistry", desc: "Soft, acidic, or low-alkalinity water is more corrosive and dissolves lead from plumbing materials more readily. Utilities use corrosion control treatment (such as orthophosphate) to reduce leaching, but household plumbing beyond the meter is not treated." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                    <AlertTriangle className="w-4 h-4 text-wur-warning mt-0.5 shrink-0" />
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
                  "Families with children under six",
                  "Pregnant residents",
                  "Households in homes built before 1986",
                  "Renters who cannot inspect building plumbing",
                  "Households with a lead service line on record",
                  "Anyone who recently had plumbing work done (disturbance increases short-term risk)",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 p-3 rounded-lg bg-wur-warning-bg border border-wur-warning-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-warning mt-1.5 shrink-0" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* How to check */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How to Check Your Situation</h2>
              <ol className="space-y-3">
                {[
                  { step: "1", text: "Identify your water utility using the ZIP lookup below or via your state page." },
                  { step: "2", text: "Read your utility's page on this site — it shows recent violations and risk level based on EPA data." },
                  { step: "3", text: "Contact your utility to ask for your address-level service line material status. Under the LCRR, utilities must maintain this inventory." },
                  { step: "4", text: "Review your utility's most recent Consumer Confidence Report (CCR), which must be sent to customers annually." },
                  { step: "5", text: "Consider testing your tap water. Look for a state-certified lab — your state health department maintains a list." },
                  { step: "6", text: "If you have young children or are pregnant, consider installing a certified NSF/ANSI 53 or 58 filter as a precautionary measure while you gather information." },
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
                Lead is not removed by boiling. Effective household treatment requires a certified filter. Look for NSF/ANSI certification — a claim that a filter removes lead is not the same as a certified result.
              </p>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium text-foreground text-sm mb-1">NSF/ANSI Standard 53 — Activated Carbon Block Filters</p>
                  <p className="text-sm text-muted-foreground">Under-sink or pitcher filters certified to NSF/ANSI 53 are verified to reduce lead at the tap. This is the most accessible residential option. Replace filters according to manufacturer schedule.</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card">
                  <p className="font-medium text-foreground text-sm mb-1">NSF/ANSI Standard 58 — Reverse Osmosis</p>
                  <p className="text-sm text-muted-foreground">RO systems certified to NSF/ANSI 58 remove 95–99% of lead and a broad range of other contaminants. Under-sink installation required. More comprehensive but higher cost than Standard 53 systems.</p>
                </div>
                <div className="p-4 rounded-lg border border-wur-caution-border bg-wur-caution-bg">
                  <p className="font-medium text-wur-caution text-sm mb-1">Flushing — a temporary mitigation step only</p>
                  <p className="text-sm text-wur-caution/80">EPA recommends flushing the cold tap for 30 seconds to 2 minutes before using water that has sat in pipes for 6+ hours. This is not a substitute for addressing service line or plumbing issues.</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                See also: <Link href="/treatment/reverse-osmosis" className="text-primary hover:underline">Reverse Osmosis filtration guide</Link> · <Link href="/treatment/activated-carbon" className="text-primary hover:underline">Activated carbon filter guide</Link>
              </p>
            </section>

            {/* Utilities with lead violations */}
            {utilitiesWithLeadViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">Utilities With Lead Violation Records</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilities listed below have at least one lead violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status.
                </p>
                <div className="space-y-2">
                  {utilitiesWithLeadViolations.map((u) => (
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
              <h2 className="font-display text-2xl text-foreground mb-2">Lead in Drinking Water by State</h2>
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

            <SourcesBlock sources={LEAD_SOURCES} lastUpdated={LEAD_LAST_UPDATED} confidence="high" />
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
                <Link href="/guides/best-filter-for-lead-in-tap-water" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Best filters for lead removal</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/guides/what-does-lead-in-tap-water-actually-mean" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">What lead in tap water actually means</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/guides/does-boiling-water-remove-lead-pfas-or-nitrates" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Does boiling water remove lead?</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/guides/home-water-test-kits-vs-certified-labs" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Home test kits vs. certified labs</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
              </div>
              <div className="mt-5 pt-4 border-t border-border space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Related</p>
                <Link href="/contaminants/nitrate" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Nitrate in Drinking Water</span>
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
