import Link from "next/link";
import { ArrowRight, BarChart3, Building2, MapPin, FlaskConical, Info } from "lucide-react";
import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Compare Water Quality — Utilities, States & Contaminants | Water Utility Report",
  description:
    "Side-by-side drinking water quality comparisons. Compare any two U.S. water utilities, states, or contaminants by risk level, violations, PFAS records, and treatment options.",
};

const featuredUtilityComparisons = [
  { a: "new-york-city-system", b: "chicago", labelA: "New York City", labelB: "Chicago" },
  { a: "los-angeles-city-dept-of-water-power", b: "city-of-houston", labelA: "Los Angeles", labelB: "Houston" },
  { a: "city-of-phoenix", b: "las-vegas-valley-water-district", labelA: "Phoenix", labelB: "Las Vegas" },
  { a: "philadelphia-water-department", b: "city-of-baltimore", labelA: "Philadelphia", labelB: "Baltimore" },
  { a: "mwra", b: "washington-suburban-sanitary-commission", labelA: "Boston (MWRA)", labelB: "Washington DC (WSSC)" },
  { a: "san-antonio-water-system", b: "city-of-phoenix", labelA: "San Antonio", labelB: "Phoenix" },
];

const featuredStateComparisons = [
  { a: "california", b: "texas", labelA: "California", labelB: "Texas" },
  { a: "new-york", b: "florida", labelA: "New York", labelB: "Florida" },
  { a: "ohio", b: "michigan", labelA: "Ohio", labelB: "Michigan" },
  { a: "illinois", b: "pennsylvania", labelA: "Illinois", labelB: "Pennsylvania" },
  { a: "arizona", b: "nevada", labelA: "Arizona", labelB: "Nevada" },
  { a: "washington", b: "oregon", labelA: "Washington", labelB: "Oregon" },
  { a: "new-jersey", b: "connecticut", labelA: "New Jersey", labelB: "Connecticut" },
  { a: "north-carolina", b: "virginia", labelA: "North Carolina", labelB: "Virginia" },
];

const featuredContaminantComparisons = [
  { a: "pfas", b: "lead", labelA: "PFAS", labelB: "Lead", note: "Health risk & treatment" },
  { a: "pfas", b: "arsenic", labelA: "PFAS", labelB: "Arsenic", note: "Forever chemicals vs. natural" },
  { a: "lead", b: "arsenic", labelA: "Lead", labelB: "Arsenic", note: "EPA limits & health effects" },
  { a: "nitrates", b: "lead", labelA: "Nitrates", labelB: "Lead", note: "Agricultural vs. infrastructure" },
  { a: "pfas", b: "nitrates", labelA: "PFAS", labelB: "Nitrates", note: "Industrial vs. agricultural" },
  { a: "arsenic", b: "nitrates", labelA: "Arsenic", labelB: "Nitrates", note: "Geologic vs. agricultural" },
];

export default function ComparePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Compare Water Quality | Water Utility Report",
    description:
      "Side-by-side drinking water quality comparisons for U.S. utilities, states, and contaminants.",
    url: "https://waterutilityreport.com/compare",
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
        { "@type": "ListItem", position: 2, name: "Compare", item: "https://waterutilityreport.com/compare" },
      ],
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <main className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Compare</span>
        </div>

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-3">
            <BarChart3 className="w-7 h-7 text-wur-teal shrink-0" />
            <h1 className="font-display text-3xl sm:text-4xl text-foreground">
              Compare Water Quality
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Side-by-side comparisons of U.S. drinking water systems, states, and contaminants.
            See risk levels, violation counts, PFAS records, and treatment options together.
          </p>
        </div>

        {/* What you can compare */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          <div className="p-5 rounded-xl border border-border bg-card">
            <Building2 className="w-6 h-6 text-wur-teal mb-3" />
            <h2 className="font-semibold text-foreground mb-1">Water Utilities</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Compare two public water systems: risk level, violations, PFAS records,
              population served, and primary contaminants.
            </p>
            <div className="flex flex-col gap-1 mt-2">
              {featuredUtilityComparisons.slice(0, 3).map(({ a, b, labelA, labelB }) => (
                <Link
                  key={`${a}-${b}`}
                  href={`/compare/utilities/${a}/${b}`}
                  className="text-xs text-wur-teal hover:underline flex items-center gap-1"
                >
                  {labelA} vs {labelB} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <MapPin className="w-6 h-6 text-purple-600 mb-3" />
            <h2 className="font-semibold text-foreground mb-1">States</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Compare statewide water quality: violation rates, PFAS prevalence,
              high-risk and safest water systems.
            </p>
            <div className="flex flex-col gap-1 mt-2">
              {featuredStateComparisons.slice(0, 3).map(({ a, b, labelA, labelB }) => (
                <Link
                  key={`${a}-${b}`}
                  href={`/compare/states/${a}/${b}`}
                  className="text-xs text-wur-teal hover:underline flex items-center gap-1"
                >
                  {labelA} vs {labelB} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
          <div className="p-5 rounded-xl border border-border bg-card">
            <FlaskConical className="w-6 h-6 text-wur-warning mb-3" />
            <h2 className="font-semibold text-foreground mb-1">Contaminants</h2>
            <p className="text-sm text-muted-foreground mb-3">
              Compare EPA limits, health effects, treatment options, and number of
              affected utilities for any two contaminants.
            </p>
            <div className="flex flex-col gap-1 mt-2">
              {featuredContaminantComparisons.slice(0, 3).map(({ a, b, labelA, labelB }) => (
                <Link
                  key={`${a}-${b}`}
                  href={`/compare/contaminants/${a}/${b}`}
                  className="text-xs text-wur-teal hover:underline flex items-center gap-1"
                >
                  {labelA} vs {labelB} <ArrowRight className="w-3 h-3" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Utility Comparisons */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-wur-teal" />
            Utility Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredUtilityComparisons.map(({ a, b, labelA, labelB }) => (
              <Link
                key={`${a}-${b}`}
                href={`/compare/utilities/${a}/${b}`}
                className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-medium text-foreground text-sm group-hover:text-wur-teal transition-colors">
                    {labelA} vs {labelB}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Risk level, violations & PFAS records
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-wur-teal group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Find any utility on its{" "}
            <Link href="/search" className="text-wur-teal hover:underline">utility page</Link>
            {" "}and use the Compare button to run a custom comparison.
          </p>
        </section>

        {/* Featured State Comparisons */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            State Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredStateComparisons.map(({ a, b, labelA, labelB }) => (
              <Link
                key={`${a}-${b}`}
                href={`/compare/states/${a}/${b}`}
                className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-purple-300 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-medium text-foreground text-sm group-hover:text-purple-700 transition-colors">
                    {labelA} vs {labelB}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Water quality comparison
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* Featured Contaminant Comparisons */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5 flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-wur-warning" />
            Contaminant Comparisons
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {featuredContaminantComparisons.map(({ a, b, labelA, labelB, note }) => (
              <Link
                key={`${a}-${b}`}
                href={`/compare/contaminants/${a}/${b}`}
                className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-amber-300 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-medium text-foreground text-sm group-hover:text-amber-700 transition-colors">
                    {labelA} vs {labelB}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{note}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* How comparisons work */}
        <section className="p-6 rounded-xl bg-wur-teal/5 border border-wur-teal/20">
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-wur-teal" />
            How Comparisons Work
          </h2>
          <div className="grid sm:grid-cols-3 gap-5 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">Data Source</p>
              <p>
                Violation and risk data comes from EPA SDWIS and UCMR 5 monitoring databases,
                covering all community water systems serving 25+ people.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Risk Levels</p>
              <p>
                Risk is calculated from open health-based violations, contaminant severity,
                and population affected. Five tiers: Safe, Low, Moderate, High, Critical.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Limitations</p>
              <p>
                Data reflects reported violations only. Unmonitored contaminants, private wells,
                and point-of-use conditions are not captured.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
