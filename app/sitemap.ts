import { MetadataRoute } from "next";
import stateContent from "@/lib/content/states";
import contaminants from "@/lib/content/contaminants";
import { LEAD_STATE_SLUGS, NITRATE_STATE_SLUGS } from "@/lib/content/contaminant-state-data";
import treatmentMethods from "@/lib/content/treatments";
import wellWaterGuides from "@/lib/content/well-water";
import guides from "@/lib/content/guides";
import learnArticles from "@/lib/content/learn";
import helpArticles from "@/lib/content/help";
import { prisma } from "@/lib/prisma";

const BASE = "https://waterutilityreport.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

function slugifyCity(city: string): string {
  return city.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function normalizeCity(cityServed: string): string {
  return cityServed
    .split(",")[0]                    // first city only if comma-separated
    .replace(/\s+\d{3,4}\b/g, "")    // strip space-separated NJ codes like " 1105"
    .replace(/-\d{3,4}$/, "")        // strip dash-separated NJ codes like "-2104" (e.g. "Blairstown Twp.-2104")
    .trim();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/cities`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/states`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contaminants`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/treatment`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/well-water`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/methodology/data-sources`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/methodology/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/pfas-watchlist`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/pfas-watchlist/sources`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/pfas-watchlist/methodology`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/labs`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/labs/well-water-testing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labs/pfas-water-testing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labs/what-to-test-for-in-drinking-water`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labs/lead-water-testing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labs/nitrate-water-testing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labs/how-to-read-water-test-results`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labs/drinking-water-test-cost`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  const statePages: MetadataRoute.Sitemap = stateContent.map((s) => ({
    url: `${BASE}/states/${s.slug}`,
    lastModified: s.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const wellWaterPages: MetadataRoute.Sitemap = wellWaterGuides.map((g) => ({
    url: `${BASE}/well-water/${g.stateSlug}`,
    lastModified: g.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Only published utilities appear in sitemap
  const statesWithPfas = await prisma.state.findMany({
    where: {
      utilities: {
        some: {
          pfas_records: { some: { validated: true, suppressed: false } },
        },
      },
    },
    select: { slug: true, updated_at: true },
  });

  const pfasDataStatePages: MetadataRoute.Sitemap = statesWithPfas.map((s) => ({
    url: `${BASE}/data/pfas/${s.slug}`,
    lastModified: s.updated_at.toISOString(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  const [publishedUtilities, pfasUtilities] = await Promise.all([
    prisma.utility.findMany({
      where: { publish_status: "published" },
      select: { slug: true, last_published_at: true, updated_at: true },
      orderBy: { population_served: "desc" },
    }),
    prisma.utility.findMany({
      where: {
        publish_status: "published",
        pfas_records: { some: { suppressed: false, validated: true } },
      },
      select: { pwsid: true, last_published_at: true, updated_at: true },
    }),
  ]);

  const utilityPages: MetadataRoute.Sitemap = publishedUtilities.map((u) => ({
    url: `${BASE}/utilities/${u.slug}`,
    lastModified: (u.last_published_at ?? u.updated_at).toISOString(),
    changeFrequency: "monthly",
    priority: 0.95,
  }));

  const pfasUtilityPages: MetadataRoute.Sitemap = pfasUtilities.map((u) => ({
    url: `${BASE}/pfas-watchlist/utility/${u.pwsid}`,
    lastModified: (u.last_published_at ?? u.updated_at).toISOString(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const pfasStatePages: MetadataRoute.Sitemap = [
    "arizona", "california", "colorado", "florida", "georgia", "illinois",
    "indiana", "louisiana", "maryland", "massachusetts", "michigan", "minnesota",
    "missouri", "new-jersey", "new-york", "north-carolina", "ohio", "oregon",
    "pennsylvania", "south-carolina", "tennessee", "texas", "virginia", "washington",
    "wisconsin",
  ].map((slug) => ({
    url: `${BASE}/pfas-watchlist/${slug}`,
    lastModified: "2026-04-15",
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const contaminantPages: MetadataRoute.Sitemap = contaminants.map((c) => ({
    url: `${BASE}/contaminants/${c.slug}`,
    lastModified: c.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const leadStatePages: MetadataRoute.Sitemap = LEAD_STATE_SLUGS.map((slug) => ({
    url: `${BASE}/contaminants/lead/${slug}`,
    lastModified: "2026-04-27",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const nitrateStatePages: MetadataRoute.Sitemap = NITRATE_STATE_SLUGS.map((slug) => ({
    url: `${BASE}/contaminants/nitrate/${slug}`,
    lastModified: "2026-04-27",
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const treatmentPages: MetadataRoute.Sitemap = treatmentMethods.map((t) => ({
    url: `${BASE}/treatment/${t.slug}`,
    lastModified: t.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = guides.map((g) => ({
    url: `${BASE}/guides/${g.slug}`,
    lastModified: g.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const learnPages: MetadataRoute.Sitemap = learnArticles.map((a) => ({
    url: `${BASE}/learn/${a.slug}`,
    lastModified: a.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const helpPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/help`, lastModified: now, changeFrequency: "monthly", priority: 0.75 },
    ...helpArticles.map((a) => ({
      url: `${BASE}/help/${a.slug}`,
      lastModified: a.lastUpdated,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];

  // City pages — deduplicated by slug, one entry per city+state combination
  const cityRows = await prisma.utility.findMany({
    where: { city_served: { not: null }, publish_status: "published" },
    select: {
      city_served: true,
      state: { select: { abbreviation: true } },
      updated_at: true,
    },
  });

  const cityMap = new Map<string, string>();
  for (const r of cityRows) {
    const normalized = normalizeCity(r.city_served!);
    if (!normalized) continue;
    const slug = `${slugifyCity(normalized)}-${r.state.abbreviation.toLowerCase()}`;
    // Skip slugs that are too long — these are multi-municipality strings, not real city names
    if (slug.length > 60) continue;
    const existing = cityMap.get(slug);
    if (!existing || r.updated_at.toISOString() > existing) {
      cityMap.set(slug, r.updated_at.toISOString());
    }
  }

  const cityPages: MetadataRoute.Sitemap = Array.from(cityMap.entries()).map(([slug, lastMod]) => ({
    url: `${BASE}/cities/${slug}`,
    lastModified: lastMod,
    changeFrequency: "monthly",
    priority: 0.75,
  }));

  return [
    ...staticPages,
    ...pfasDataStatePages,
    ...statePages,
    ...wellWaterPages,
    ...utilityPages,
    ...pfasUtilityPages,
    ...pfasStatePages,
    ...contaminantPages,
    ...leadStatePages,
    ...nitrateStatePages,
    ...treatmentPages,
    ...guidePages,
    ...learnPages,
    ...helpPages,
    ...cityPages,
  ];
}
