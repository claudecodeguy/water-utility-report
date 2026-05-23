import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertTriangle, ArrowRight, Building2, FlaskConical, CheckCircle2, MapPin } from "lucide-react";
import stateContent from "@/lib/content/states";
import contaminants from "@/lib/content/contaminants";
import ZipLookup from "@/components/zip-lookup";
import ViolationAlertForm from "@/components/violation-alert-form";
import SearchResultsClient from "@/components/search-results-client";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const zipcodes = require("zipcodes");
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Search Water Quality by ZIP Code — Water Utility Report",
  description: "Find your water utility and drinking water quality data by ZIP code. Browse all U.S. states and utilities.",
  robots: { index: false },
};

const riskColors: Record<string, string> = {
  safe:     "text-wur-safe",
  low:      "text-emerald-600",
  moderate: "text-wur-caution",
  high:     "text-wur-warning",
  critical: "text-wur-danger",
};

const riskBgs: Record<string, string> = {
  safe:     "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  low:      "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  high:     "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
  critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
};

function slugifyCity(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

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

  // Resolve ZIP → city + state + coords
  const zipInfo = isValidZip
    ? (zipcodes.lookup(trimmedZip) as { city: string; state: string; latitude: number; longitude: number } | undefined)
    : undefined;
  const zipCity = zipInfo?.city ?? null;
  const zipState = zipInfo?.state ?? null;

  type UtilityRow = {
    slug: string; pwsid: string; name: string; population_served: number;
    risk_level: string; city_served: string | null;
    state: { abbreviation: string; slug: string; name: string };
  };

  let zipUtilities: UtilityRow[] = [];
  let cityNotCovered = false;
  let stateSlug: string | null = null;
  let stateName: string | null = null;

  if (isValidZip && zipCity && zipState) {
    const stateRecord = await prisma.state.findFirst({
      where: { abbreviation: zipState },
      select: { id: true, slug: true, name: true },
    });

    if (stateRecord) {
      stateSlug = stateRecord.slug;
      stateName = stateRecord.name;

      zipUtilities = await prisma.utility.findMany({
        where: {
          publish_status: "published",
          state_id: stateRecord.id,
          ownership_type: { notIn: ["Federal", "State"] },
          population_served: { gte: 1000 },
          OR: [
            { city_served: { contains: zipCity, mode: "insensitive" } },
            { name: { contains: zipCity, mode: "insensitive" } },
          ],
        },
        select: {
          slug: true, pwsid: true, name: true, population_served: true, risk_level: true, city_served: true,
          state: { select: { abbreviation: true, slug: true, name: true } },
        },
        orderBy: { population_served: "desc" },
        take: 10,
      });
    } else {
      cityNotCovered = true;
    }
  }

  const hasResults = zipUtilities.length > 0;

  // Check if results are real city matches (not fallback state results)
  const isCityMatch = hasResults && zipCity &&
    zipUtilities.some(u =>
      u.city_served?.toLowerCase().includes(zipCity.toLowerCase()) ||
      u.name.toLowerCase().includes(zipCity.toLowerCase())
    );

  // Auto-redirect when there's exactly one confident city match
  if (isCityMatch && zipUtilities.length === 1) {
    redirect(`/utilities/${zipUtilities[0].slug}`);
  }

  // City page slug for linking
  const cityPageSlug = zipCity && zipState
    ? `${slugifyCity(zipCity)}-${zipState.toLowerCase()}`
    : null;

  // Top utilities for sidebar when no ZIP searched
  const featuredUtilities = !isValidZip
    ? await prisma.utility.findMany({
        where: { publish_status: "published" },
        select: {
          slug: true, pwsid: true, name: true, population_served: true, risk_level: true, city_served: true,
          state: { select: { abbreviation: true, slug: true, name: true } },
        },
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
            {isValidZip
              ? `Results for ZIP ${trimmedZip}${zipCity ? ` — ${zipCity}, ${zipState}` : ""}`
              : "Find Your Water Utility"}
          </h1>
          <div className="mt-5">
            <ZipLookup variant="inline" className="max-w-sm" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ZIP results */}
        {isValidZip && (
          <div className="mb-10">
            {hasResults && isCityMatch ? (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <CheckCircle2 className="w-5 h-5 text-wur-safe" />
                  <p className="text-sm font-medium text-foreground">
                    Found {zipUtilities.length} utilit{zipUtilities.length === 1 ? "y" : "ies"} serving {zipCity}, {zipState}
                  </p>
                </div>
                <SearchResultsClient
                  utilities={zipUtilities}
                  zip={trimmedZip ?? ""}
                  city={zipCity}
                  riskBgs={riskBgs}
                />
                {zipUtilities.length > 1 && (
                  <p className="mt-4 text-xs text-muted-foreground">
                    Not sure which utility is yours? Check your water bill — your utility&apos;s name appears there.
                  </p>
                )}
                {/* City page link */}
                {cityPageSlug && (
                  <div className="mt-5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-wur-teal shrink-0" />
                    <Link
                      href={`/cities/${cityPageSlug}`}
                      className="text-sm text-wur-teal hover:underline font-medium"
                    >
                      Browse all water quality data for {zipCity}, {zipState} →
                    </Link>
                  </div>
                )}

                {/* Alert sign-up — shown for the top matched utility */}
                <div className="mt-6">
                  <ViolationAlertForm
                    pwsid={zipUtilities[0].pwsid}
                    utilityName={normalizeName(zipUtilities[0].name)}
                  />
                  {zipUtilities.length > 1 && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Alerts are for {normalizeName(zipUtilities[0].name)}. Visit any utility above to subscribe for a different one.
                    </p>
                  )}
                </div>
              </div>
            ) : isValidZip && zipCity && !cityNotCovered && !hasResults ? (
              /* No match found in a covered state */
              <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-wur-caution mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-wur-caution mb-1">
                      No utility found for {zipCity}, {zipState}
                    </p>
                    <p className="text-sm text-wur-caution/80 leading-relaxed mb-3">
                      We have data for {zipState} but couldn&apos;t match a utility to this ZIP code.
                      This sometimes happens for rural areas or ZIP codes that cross utility boundaries.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {stateSlug && (
                        <Link
                          href={`/states/${stateSlug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-caution underline underline-offset-2 hover:no-underline"
                        >
                          Browse all {stateName} utilities <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                      {cityPageSlug && (
                        <Link
                          href={`/cities/${cityPageSlug}`}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-caution underline underline-offset-2 hover:no-underline"
                        >
                          {zipCity} city water data <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : cityNotCovered ? (
              <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-wur-caution mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-wur-caution mb-1">
                      {zipCity ? `${zipCity}, ${zipState}` : `ZIP ${trimmedZip}`} isn&apos;t covered yet
                    </p>
                    <p className="text-sm text-wur-caution/80 leading-relaxed">
                      We currently cover {stateContent.length} states. Check the state browser below, or use the EPA&apos;s tool for full national coverage.
                    </p>
                    <a
                      href="https://enviro.epa.gov/envirofacts/sdwis/search"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 mt-3 text-sm text-wur-caution underline underline-offset-2 hover:no-underline"
                    >
                      Search EPA Drinking Water Data <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ) : !zipCity ? (
              <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-wur-caution mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold text-wur-caution mb-1">ZIP {trimmedZip} not recognized</p>
                    <p className="text-sm text-wur-caution/80">
                      That ZIP code wasn&apos;t found. Check the number and try again, or browse by state below.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* No ZIP entered */}
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
              Currently tracking {stateContent.length} states — expanding coverage quarterly.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stateContent.map((state) => (
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
                        {(state.populationServed / 1e6).toFixed(1)}M residents served
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
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-4 h-4 text-wur-teal" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {isValidZip && hasResults ? "Matched Utilities" : "Featured Utilities"}
                </p>
              </div>
              <div className="space-y-2">
                {(isValidZip && hasResults ? zipUtilities.slice(0, 5) : featuredUtilities).map((u) => (
                  <Link
                    key={u.slug}
                    href={`/utilities/${u.slug}`}
                    className="flex items-center justify-between py-1.5 group"
                  >
                    <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors truncate pr-2">
                      {normalizeName(u.name)}
                    </p>
                    <span className={`text-xs font-mono shrink-0 ${riskColors[u.risk_level] ?? ""}`}>
                      {u.state.abbreviation}
                    </span>
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
