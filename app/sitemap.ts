import { MetadataRoute } from "next";
import stateContent from "@/lib/content/states";
import contaminants from "@/lib/content/contaminants";
import treatmentMethods from "@/lib/content/treatments";
import wellWaterGuides from "@/lib/content/well-water";
import guides from "@/lib/content/guides";
import learnArticles from "@/lib/content/learn";
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
    { url: `${BASE}/methodology`, lastModified: now, changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/methodology/data-sources`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/methodology/legal`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE}/guides`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${BASE}/labs`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
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

  return [
    ...staticPages,
    ...statePages,
    ...wellWaterPages,
    ...utilityPages,
    ...contaminantPages,
    ...treatmentPages,
    ...guidePages,
    ...learnPages,
  ];
}
