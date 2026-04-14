import Link from "next/link";
import { AlertTriangle, ArrowRight, Building2, FlaskConical } from "lucide-react";
import { states, contaminants } from "@/lib/mock-data";
import ZipLookup from "@/components/zip-lookup";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Water Quality by ZIP Code — Water Utility Report",
  description: "Find your water utility and drinking water quality data by ZIP code. Browse all U.S. states and utilities.",
  robots: { index: false },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ zip?: string }>;
}) {
  return <SearchPageContent searchParams={searchParams} />;
}

async function SearchPageContent({
  searchParams,
}: {
  searchParams: Promise<{ zip?: string }>;
}) {
  const { zip } = await searchParams;
  const trimmedZip = zip?.trim();
  const isValidZip = trimmedZip && /^\d{5}$/.test(trimmedZip);

  // Query DB for published utilities — show top results by population
  const dbUtilities = isValidZip
    ? await prisma.utility.findMany({
        where: { publish_status: "published" },
        select: { slug: true, name: true, population_served: true, state: { select: { abbreviation: true } } },
        orderBy: { population_served: "desc" },
        take: 5,
      })
    : [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">ZIP Lookup</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-4">
            {isValidZip ? `Results for ZIP ${trimmedZip}` : "Find Your Water Utility"}
          </h1>
          <div className="mt-5">
            <ZipLookup variant="inline" className="max-w-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ZIP not in database */}
        {isValidZip && !match && (
          <div className="mb-10">
            <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6 mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-wur-caution mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-wur-caution mb-1">
                    ZIP {trimmedZip} isn&apos;t in our database yet
                  </p>
                  <p className="text-sm text-wur-caution/80 leading-relaxed">
                    We&apos;re currently tracking utilities in 5 states (CA, TX, FL, AZ, OH).
                    Use the state browser below to find your utility, or check the EPA&apos;s
                    official Safe Drinking Water Information System for full coverage.
                  </p>
                  <a
                    href="https://sdwis.epa.gov/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-wur-caution underline underline-offset-2 hover:no-underline"
                  >
                    Search EPA SDWIS <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* No ZIP entered at all */}
        {!isValidZip && !zip && (
          <div className="mb-10 rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter a 5-digit ZIP code above to find the water utility serving that address and view
              contaminant detection levels, violation history, and treatment recommendations.
            </p>
          </div>
        )}

        {/* Invalid format */}
        {zip && !isValidZip && (
          <div className="mb-10 rounded-xl border border-wur-danger-border bg-wur-danger-bg p-6">
            <p className="text-sm text-wur-danger">
              &ldquo;{zip}&rdquo; is not a valid ZIP code. Please enter exactly 5 digits.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* State browse */}
          <div className="lg:col-span-2">
            <h2 className="font-display text-2xl text-foreground mb-2">Browse by State</h2>
            <p className="text-sm text-muted-foreground mb-5">
              Currently tracking {states.length} states — expanding coverage quarterly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {states.map((state) => (
                <Link
                  key={state.slug}
                  href={`/states/${state.slug}`}
                  className="group flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-10 h-10 rounded-lg bg-wur-teal/10 flex items-center justify-center font-mono text-sm font-bold text-wur-teal shrink-0">
                      {state.abbreviation}
                    </span>
                    <div>
                      <p className="font-medium text-foreground group-hover:text-wur-teal transition-colors text-sm">
                        {state.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {state.utilitiesCount.toLocaleString()} utilities · {(state.populationServed / 1e6).toFixed(1)}M served
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-wur-teal transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Featured utilities */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-wur-teal" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Featured Utilities
                </p>
              </div>
              <div className="space-y-2">
                {dbUtilities.map((u) => (
                  <Link
                    key={u.slug}
                    href={`/utilities/${u.slug}`}
                    className="flex items-center justify-between py-1.5 group"
                  >
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors truncate pr-2">
                      {u.name}
                    </p>
                    <span className="text-xs font-mono text-muted-foreground/60 shrink-0">{u.state.abbreviation}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contaminants */}
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <FlaskConical className="w-4 h-4 text-wur-teal" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Key Contaminants
                </p>
              </div>
              <div className="space-y-2">
                {contaminants.slice(0, 5).map((c) => (
                  <Link
                    key={c.slug}
                    href={`/contaminants/${c.slug}`}
                    className="flex items-center justify-between py-1.5 group"
                  >
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors truncate pr-2">
                      {c.shortName}
                    </p>
                    <span className={`text-xs font-mono shrink-0 ${
                      c.riskLevel === "high" || c.riskLevel === "critical" ? "text-wur-danger" :
                      c.riskLevel === "moderate" ? "text-wur-caution" : "text-wur-safe"
                    }`}>
                      {c.riskLevel}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
