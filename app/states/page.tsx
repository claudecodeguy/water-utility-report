import stateContent from "@/lib/content/states";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import JsonLd from "@/components/json-ld";
import StatesDirectory, { type StateRow } from "@/components/states-directory";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "U.S. Drinking Water by State — All 50 States | Water Utility Report",
  description:
    "Browse drinking water quality, utility counts, PFAS records, and active violations for all 50 U.S. states. Official EPA SDWIS and UCMR 5 data.",
};

const REGION_MAP: Record<string, string> = {
  CT: "Northeast", ME: "Northeast", MA: "Northeast", NH: "Northeast",
  NJ: "Northeast", NY: "Northeast", PA: "Northeast", RI: "Northeast", VT: "Northeast",
  AL: "Southeast", AR: "Southeast", DE: "Southeast", FL: "Southeast", GA: "Southeast",
  KY: "Southeast", LA: "Southeast", MD: "Southeast", MS: "Southeast", NC: "Southeast",
  SC: "Southeast", TN: "Southeast", VA: "Southeast", WV: "Southeast",
  IL: "Midwest", IN: "Midwest", IA: "Midwest", KS: "Midwest", MI: "Midwest",
  MN: "Midwest", MO: "Midwest", NE: "Midwest", ND: "Midwest", OH: "Midwest",
  SD: "Midwest", WI: "Midwest",
  AZ: "Southwest", NM: "Southwest", OK: "Southwest", TX: "Southwest",
  AK: "West", CA: "West", CO: "West", HI: "West", ID: "West", MT: "West",
  NV: "West", OR: "West", UT: "West", WA: "West", WY: "West",
};

export default async function StatesPage() {
  const dbStates = await prisma.state.findMany({
    select: { abbreviation: true, _count: { select: { utilities: true } } },
  });

  const utilityCountByAbbr: Record<string, number> = {};
  for (const s of dbStates) {
    utilityCountByAbbr[s.abbreviation] = s._count.utilities;
  }

  const totalUtilities = Object.values(utilityCountByAbbr).reduce((a, b) => a + b, 0);

  const rows: StateRow[] = stateContent.map((s) => ({
    slug: s.slug,
    name: s.name,
    abbreviation: s.abbreviation,
    populationServed: s.populationServed,
    utilityCount: utilityCountByAbbr[s.abbreviation] ?? 0,
    topContaminants: s.topContaminants ?? [],
    region: REGION_MAP[s.abbreviation] ?? "Other",
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "U.S. Drinking Water by State",
    description:
      "Directory of drinking water quality data for all 50 U.S. states, sourced from EPA SDWIS and UCMR 5.",
    url: "https://waterutilityreport.com/states",
    numberOfItems: stateContent.length,
    itemListElement: stateContent.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `${s.name} drinking water utilities`,
      url: `https://waterutilityreport.com/states/${s.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-wur-teal text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-white/50 mb-4">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <span className="text-white/80">States</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-6 h-6 text-white/70 shrink-0" />
              <h1 className="font-display text-4xl text-white">U.S. Drinking Water by State</h1>
            </div>
            <p className="text-white/65 max-w-2xl leading-relaxed">
              Browse drinking water quality data, utility counts, and contaminant concerns for all 50 U.S.
              states. Data sourced from EPA SDWIS, EPA ECHO, and UCMR 5 federal monitoring records.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/50 font-mono">
              <span>{stateContent.length} states</span>
              <span>·</span>
              <span>{totalUtilities > 0 ? `${totalUtilities.toLocaleString()}+` : "10,000+"} utilities tracked</span>
              <span>·</span>
              <span>EPA SDWIS · UCMR 5 · EPA ECHO</span>
            </div>
          </div>
        </div>

        {/* Directory */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <StatesDirectory states={rows} />
        </div>

        {/* Data note */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="rounded-xl border border-border bg-muted/30 p-5 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Data source:</strong> Utility counts and violation data from{" "}
              <a
                href="https://www.epa.gov/ground-water-and-drinking-water/safe-drinking-water-information-system-sdwis-federal-reporting"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wur-teal hover:underline"
              >
                EPA SDWIS
              </a>
              . PFAS monitoring records from{" "}
              <a
                href="https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule"
                target="_blank"
                rel="noopener noreferrer"
                className="text-wur-teal hover:underline"
              >
                EPA UCMR 5
              </a>
              . Data reflects community water systems only; private wells are not included.{" "}
              <Link href="/methodology" className="text-wur-teal hover:underline">
                Full methodology →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
