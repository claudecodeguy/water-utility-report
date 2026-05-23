import Link from "next/link";
import { ArrowRight, FlaskConical, Building2, MapPin, AlertTriangle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
import FaqSection from "@/components/faq-section";
import SourcesBlock from "@/components/sources-block";
import JsonLd from "@/components/json-ld";
import ZipLookup from "@/components/zip-lookup";
import { arsenicStateData, ARSENIC_SOURCES, ARSENIC_LAST_UPDATED } from "@/lib/content/arsenic-state-data";
import type { Metadata } from "next";

export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Arsenic in Drinking Water — Sources, Testing, Treatment & State Guides | Water Utility Report",
  description: "Arsenic in U.S. drinking water: natural geological sources, the EPA 10 ppb MCL, which states have the highest risk, how to test your well water, and how to remove arsenic. State-by-state guides for all 50 states.",
};

const STATE_PAGES = Object.values(arsenicStateData).map((s) => ({
  href: `/contaminants/arsenic/${s.stateSlug}`,
  name: s.stateName,
  abbr: s.stateAbbr,
}));

const faqs = [
  {
    question: "Is arsenic in drinking water a widespread problem in the U.S.?",
    answer: "Yes. Arsenic is one of the most frequently detected contaminants in U.S. drinking water — particularly in private wells and small public water systems in the West, Southwest, New England, and upper Midwest. The EPA estimates that approximately 2 million Americans are served by public water systems that have historically exceeded the arsenic MCL of 10 ppb. Many more rely on private wells that are never tested for arsenic.",
  },
  {
    question: "Where does arsenic in drinking water come from?",
    answer: "Most arsenic in U.S. drinking water is naturally occurring. It originates from arsenic-bearing minerals in rock and soil — particularly in granite, volcanic, geothermal, and some sedimentary geological formations. Groundwater slowly dissolves arsenic from these minerals. Mining (gold, silver, copper, coal) can amplify naturally occurring arsenic through acid mine drainage. Agricultural pesticides and poultry operations have historically added arsenic to soils in some regions.",
  },
  {
    question: "What is the legal limit for arsenic in U.S. drinking water?",
    answer: "The EPA Maximum Contaminant Level (MCL) for arsenic in public drinking water is 10 micrograms per liter (µg/L), also expressed as 10 parts per billion (ppb). This standard applies to public water systems — private wells are not regulated at the federal level. The MCLG (Maximum Contaminant Level Goal — the health-based target with no risk) is zero, reflecting that arsenic is a known human carcinogen at any level.",
  },
  {
    question: "Which states have the most arsenic in drinking water?",
    answer: "States with the highest naturally occurring arsenic in groundwater include: Nevada, New Mexico, Arizona, and Utah (geothermal/volcanic geology); Maine, New Hampshire, Vermont, Massachusetts, and Connecticut (granite/metamorphic bedrock); Wisconsin, Minnesota, Iowa, and Michigan (glacial aquifer geology); Montana (Butte-Anaconda mining legacy); and western Texas and western Kansas (Ogallala Aquifer). New England has the highest arsenic occurrence in private bedrock wells east of the Mississippi.",
  },
  {
    question: "Does arsenic in water have health effects?",
    answer: "Yes — arsenic is a Group A human carcinogen, meaning the EPA has determined it causes cancer in humans. Long-term exposure to arsenic in drinking water is associated with bladder cancer, lung cancer, and skin cancer — among the most strongly established environmental cancer risks. Arsenic also increases risk of cardiovascular disease, diabetes, and developmental effects in children. The cancer risk from arsenic at concentrations above the MCL is considered significant.",
  },
  {
    question: "Does my private well have arsenic?",
    answer: "You cannot know without testing. Private wells are not regulated or monitored by any government agency for arsenic content. The only way to determine if your well has elevated arsenic is to test it at a state-certified laboratory. A basic arsenic test costs $15–$40. Testing is especially important in New England (granite bedrock), the upper Midwest (glacial aquifer states), the Southwest (volcanic and geothermal geology), and near historic mining districts anywhere in the country.",
  },
  {
    question: "What filter removes arsenic from drinking water?",
    answer: "Standard activated carbon filters (Brita, refrigerator filters, most pitcher filters) do NOT effectively remove arsenic. The effective treatment options are: (1) Reverse osmosis (RO) systems certified to NSF/ANSI 58 — removes 85–95% of arsenic; (2) Activated alumina filters — specifically designed for arsenic and fluoride removal; (3) Iron/manganese oxidation filters — effective when arsenic co-occurs with high iron levels (common in Midwest well water). Always choose products with NSF International or WQA certification specifically for arsenic reduction.",
  },
  {
    question: "Does boiling water remove arsenic?",
    answer: "No — boiling concentrates arsenic. As water boils and volume decreases through steam, the concentration of dissolved minerals including arsenic increases. Boiling is not a treatment for arsenic. Only certified filtration (reverse osmosis, activated alumina, or certified ion exchange) effectively reduces arsenic.",
  },
];

export default async function ArsenicNationalHub() {
  const utilitiesWithArsenicViolations = await prisma.utility.findMany({
    where: {
      publish_status: "published",
      violations: {
        some: { contaminant_name: { contains: "arsenic", mode: "insensitive" } },
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
    headline: "Arsenic in Drinking Water — Sources, Testing, Treatment & State Guides",
    dateModified: ARSENIC_LAST_UPDATED,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Contaminants", item: "https://waterutilityreport.com/contaminants" },
      { "@type": "ListItem", position: 3, name: "Arsenic", item: "https://waterutilityreport.com/contaminants/arsenic" },
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
            <span className="text-foreground font-medium">Arsenic</span>
          </nav>
          <div className="flex items-start gap-3">
            <FlaskConical className="w-6 h-6 text-wur-warning mt-1 shrink-0" />
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-wur-warning">High Risk Level</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium text-wur-warning bg-wur-warning-bg border-wur-warning-border">Heavy Metals</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-3">
                Arsenic in Drinking Water
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                Arsenic is a naturally occurring heavy metal that leaches from rock and soil into groundwater across much of the United States. It is a known human carcinogen. The EPA MCL is 10 ppb — but the health-based goal is zero. Private well owners face the greatest risk, as wells are unregulated for arsenic.
              </p>
              <p className="text-xs text-muted-foreground mt-3">
                Source: EPA, USGS, CDC · Last reviewed: {ARSENIC_LAST_UPDATED} · Data: official EPA SDWIS records
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
                Is arsenic in drinking water a real concern?
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Yes. Arsenic is one of the most frequently detected drinking water contaminants in the U.S. — particularly for private well users. It is naturally occurring in geology across much of the country, including New England&apos;s granite bedrock, the Southwest&apos;s volcanic formations, the upper Midwest&apos;s glacial aquifers, and the western U.S.&apos;s geothermal regions. The EPA MCL of 10 ppb applies only to public water systems — private wells are unregulated and untested unless the owner acts. Arsenic is a known human carcinogen with no established safe level.
              </p>
            </section>

            {/* Key facts */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Key Facts</h2>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <tbody>
                    {[
                      { label: "EPA MCL", value: "10 µg/L (10 ppb) — applies to public water systems only" },
                      { label: "MCLG (health goal)", value: "Zero — no safe level established; arsenic is a Group A human carcinogen" },
                      { label: "Primary source", value: "Naturally occurring in granite, volcanic, geothermal, and sedimentary geology; mining legacy sites" },
                      { label: "Highest-risk regions", value: "New England (granite bedrock), Southwest (volcanic/geothermal), upper Midwest (glacial aquifer), Mountain West (geothermal)" },
                      { label: "Private well risk", value: "Unregulated — well owners must test and treat independently; testing costs $15–$40" },
                      { label: "Does boiling help?", value: "No — boiling concentrates arsenic. Use certified filtration." },
                      { label: "Standard pitcher filter (Brita)?", value: "Does NOT remove arsenic. Only use NSF-certified RO or activated alumina." },
                      { label: "Effective treatment", value: "Reverse osmosis (NSF/ANSI 58) or activated alumina; iron/manganese oxidation in iron-rich water" },
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
              <h2 className="font-display text-2xl text-foreground mb-4">How Arsenic Gets Into Drinking Water</h2>
              <div className="space-y-3">
                {[
                  { title: "Natural geology — the dominant pathway", desc: "Most U.S. arsenic in drinking water is naturally occurring. Granite, volcanic tuff, geothermal deposits, and some sedimentary formations contain arsenic-bearing minerals that slowly dissolve into groundwater over geological time. There is no contamination event to blame — the arsenic is inherent in the geology." },
                  { title: "Reducing geochemical conditions", desc: "Arsenic is most easily mobilized when groundwater is low in oxygen (reducing conditions). These conditions are common in deep confined aquifers, wetland sediments, and organic-rich formations. In reducing conditions, iron oxide minerals that bind arsenic dissolve, releasing arsenic into the water supply." },
                  { title: "Mining legacy", desc: "Historic metal mining — especially gold, silver, copper, and coal — can release arsenic from pyrite and other sulfide minerals when they oxidize. Acid mine drainage from abandoned mines in Appalachia, the Rocky Mountains, and the Southwest continues releasing arsenic decades after mining ends." },
                  { title: "Agricultural inputs", desc: "Historic use of arsenic-based pesticides in orchards and the use of arsenic-containing feed additives in poultry operations (since phased out) have left residual arsenic in soils in some regions. This can leach into shallow groundwater in agricultural areas." },
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

            {/* Utilities with violations */}
            {utilitiesWithArsenicViolations.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">Utilities With Arsenic Violation Records</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilities listed below have at least one arsenic violation on record in EPA&apos;s SDWIS database. Violations may be open or resolved — see individual utility pages for current status.
                </p>
                <div className="space-y-2">
                  {utilitiesWithArsenicViolations.map((u) => (
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
              <h2 className="font-display text-2xl text-foreground mb-2">Arsenic in Drinking Water by State</h2>
              <p className="text-sm text-muted-foreground mb-4">
                State-specific guides covering local geological sources, private well risk, regulatory agencies, and testing resources.
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

            <SourcesBlock sources={ARSENIC_SOURCES} lastUpdated={ARSENIC_LAST_UPDATED} confidence="high" />
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
                <Link href="/contaminants/pfas" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">PFAS in Drinking Water</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/contaminants/lead" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Lead in Drinking Water</span>
                  <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal" />
                </Link>
                <Link href="/treatment/reverse-osmosis" className="flex items-center justify-between py-1.5 group">
                  <span className="text-sm text-muted-foreground group-hover:text-primary transition-colors">Reverse Osmosis Guide</span>
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
