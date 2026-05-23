import { prisma } from "@/lib/prisma";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

async function confirmBacklink(pageUrl: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(pageUrl, {
      signal: controller.signal,
      headers: { "User-Agent": "WaterUtilityReport-BacklinkChecker/1.0" },
    });
    clearTimeout(timeout);
    if (!res.ok) return false;
    const html = await res.text();
    return html.includes("waterutilityreport.com");
  } catch {
    return false;
  }
}

export async function checkOrgBacklinks(): Promise<{ checked: number; found: number }> {
  const apiKey = process.env.BING_SEARCH_API_KEY;
  if (!apiKey) {
    console.log("[backlink-checker] TODO: set BING_SEARCH_API_KEY to enable org backlink checking");
    return { checked: 0, found: 0 };
  }

  const cutoff90d = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const pitches = await prisma.outreachOrgPitch.findMany({
    where: {
      status: "sent",
      sent_at: { gte: cutoff90d },
      backlink_found: false,
    },
    include: { organization: true },
    orderBy: { sent_at: "desc" },
  });

  // Group by org website domain
  const domainMap = new Map<string, typeof pitches>();
  for (const pitch of pitches) {
    const url = pitch.organization.website;
    if (!url) continue;
    const domain = extractDomain(url);
    if (!domain) continue;
    if (!domainMap.has(domain)) domainMap.set(domain, []);
    domainMap.get(domain)!.push(pitch);
  }

  let checked = 0;
  let found = 0;

  for (const [domain, domainPitches] of domainMap.entries()) {
    checked++;

    try {
      const query = encodeURIComponent(`site:${domain} "waterutilityreport.com"`);
      const res = await fetch(
        `https://api.bing.microsoft.com/v7.0/search?q=${query}&count=10`,
        { headers: { "Ocp-Apim-Subscription-Key": apiKey } }
      );

      if (!res.ok) {
        console.error(`[backlink-checker] Bing error for org domain ${domain}:`, res.status);
        await sleep(3000);
        continue;
      }

      const data = await res.json() as {
        webPages?: { value?: { url: string }[] };
      };

      const results = data.webPages?.value ?? [];

      for (const result of results) {
        const confirmed = await confirmBacklink(result.url);
        if (!confirmed) continue;

        const match = domainPitches.sort(
          (a, b) =>
            (b.sent_at?.getTime() ?? 0) - (a.sent_at?.getTime() ?? 0)
        )[0];

        if (match) {
          await prisma.outreachOrgPitch.update({
            where: { id: match.id },
            data: {
              status: "published",
              published_url: result.url,
              backlink_found: true,
            },
          });
          await prisma.outreachOrganization.update({
            where: { id: match.organization_id },
            data: { pickup_count: { increment: 1 } },
          });
          found++;
          console.log(`[backlink-checker] confirmed org backlink on ${result.url}`);
          break;
        }
      }
    } catch (err) {
      console.error(`[backlink-checker] error for org domain ${domain}:`, err);
    }

    await sleep(3000);
  }

  return { checked, found };
}

export async function checkBacklinks(): Promise<{ checked: number; found: number }> {
  const apiKey = process.env.BING_SEARCH_API_KEY;
  if (!apiKey) {
    console.log("[backlink-checker] TODO: set BING_SEARCH_API_KEY to enable backlink checking");
    return { checked: 0, found: 0 };
  }

  const cutoff60d = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  const pitches = await prisma.outreachPitch.findMany({
    where: {
      status: "sent",
      sent_at: { gte: cutoff60d },
      backlink_found: false,
    },
    include: { journalist: true },
    orderBy: { sent_at: "desc" },
  });

  // Group by domain to avoid redundant searches
  const domainMap = new Map<string, typeof pitches>();
  for (const pitch of pitches) {
    const url = pitch.journalist.outlet_url;
    if (!url) continue;
    const domain = extractDomain(url);
    if (!domain) continue;
    if (!domainMap.has(domain)) domainMap.set(domain, []);
    domainMap.get(domain)!.push(pitch);
  }

  let checked = 0;
  let found = 0;

  for (const [domain, domainPitches] of domainMap.entries()) {
    checked++;

    try {
      const query = encodeURIComponent(`site:${domain} "waterutilityreport.com"`);
      const res = await fetch(
        `https://api.bing.microsoft.com/v7.0/search?q=${query}&count=10`,
        { headers: { "Ocp-Apim-Subscription-Key": apiKey } }
      );

      if (!res.ok) {
        console.error(`[backlink-checker] Bing error for ${domain}:`, res.status);
        await sleep(3000);
        continue;
      }

      const data = await res.json() as {
        webPages?: { value?: { url: string }[] };
      };

      const results = data.webPages?.value ?? [];

      for (const result of results) {
        const confirmed = await confirmBacklink(result.url);
        if (!confirmed) continue;

        // Find most recent sent pitch for this domain
        const match = domainPitches.sort(
          (a, b) =>
            (b.sent_at?.getTime() ?? 0) - (a.sent_at?.getTime() ?? 0)
        )[0];

        if (match) {
          await prisma.outreachPitch.update({
            where: { id: match.id },
            data: {
              status: "published",
              published_url: result.url,
              backlink_found: true,
            },
          });
          await prisma.outreachJournalist.update({
            where: { id: match.journalist_id },
            data: { pickup_count: { increment: 1 } },
          });
          found++;
          console.log(`[backlink-checker] confirmed backlink on ${result.url}`);
          break;
        }
      }
    } catch (err) {
      console.error(`[backlink-checker] error for domain ${domain}:`, err);
    }

    await sleep(3000);
  }

  return { checked, found };
}
