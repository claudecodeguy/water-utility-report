import { MetadataRoute } from "next";
import { states, contaminants, treatmentMethods, cities } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

const BASE = "https://waterutilityreport.com";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/states`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/contaminants`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/treatment`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/well-water`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/labs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/methodology/data-sources`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/methodology/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];

  const statePages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${BASE}/states/${s.slug}`,
    lastModified: s.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const wellWaterPages: MetadataRoute.Sitemap = states.map((s) => ({
    url: `${BASE}/well-water/${s.slug}`,
    lastModified: s.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Only published utilities appear in sitemap
  const publishedUtilities = await prisma.utility.findMany({
    where: { publish_status: "published" },
    select: { slug: true, last_published_at: true, updated_at: true },
    orderBy: { population_served: "desc" },
  });

  const utilityPages: MetadataRoute.Sitemap = publishedUtilities.map((u) => ({
    url: `${BASE}/utilities/${u.slug}`,
    lastModified: (u.last_published_at ?? u.updated_at).toISOString(),
    changeFrequency: "monthly",
    priority: 0.95,
  }));

  const contaminantPages: MetadataRoute.Sitemap = contaminants.map((c) => ({
    url: `${BASE}/contaminants/${c.slug}`,
    lastModified: c.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const treatmentPages: MetadataRoute.Sitemap = treatmentMethods.map((t) => ({
    url: `${BASE}/treatment/${t.slug}`,
    lastModified: t.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const cityPages: MetadataRoute.Sitemap = cities.map((c) => ({
    url: `${BASE}/cities/${c.slug}`,
    lastModified: c.lastUpdated,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  return [
    ...staticPages,
    ...statePages,
    ...wellWaterPages,
    ...utilityPages,
    ...contaminantPages,
    ...treatmentPages,
    ...cityPages,
  ];
}
