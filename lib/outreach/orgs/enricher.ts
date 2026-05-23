import { prisma } from "@/lib/prisma";
import { anthropic, MODELS } from "../anthropic";
import { OrgEnrichmentOutputSchema } from "./types";
import { ORG_ENRICHMENT_PROMPT } from "./prompts";
import type { OutreachOrganizationModel } from "../../generated/prisma/models";

// ─── HTML HELPERS ─────────────────────────────────────────────────────────────

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function findAboutUrl(html: string, baseUrl: string): string | null {
  const aboutPatterns = [
    /\/about(?:-us)?(?:[/?#"']|$)/i,
    /\/who-we-are(?:[/?#"']|$)/i,
    /\/mission(?:[/?#"']|$)/i,
  ];
  const hrefRegex = /href=["']([^"'#][^"']*?)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];
    for (const pattern of aboutPatterns) {
      if (pattern.test(href)) {
        try {
          const resolved = new URL(href, baseUrl).toString();
          // Don't follow external domains
          if (new URL(resolved).hostname === new URL(baseUrl).hostname) return resolved;
        } catch {
          // malformed href — skip
        }
      }
    }
  }
  return null;
}

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
};

async function robustFetch(url: string, attempt = 1): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    const res = await fetch(url, { headers: BROWSER_HEADERS, signal: controller.signal, redirect: "follow" });
    clearTimeout(timeout);
    if (res.ok) return await res.text();
    if (attempt === 1 && [403, 429, 503].includes(res.status)) {
      await new Promise(r => setTimeout(r, 2000));
      return robustFetch(url, 2);
    }
    return null;
  } catch {
    if (attempt === 1) {
      await new Promise(r => setTimeout(r, 2000));
      return robustFetch(url, 2);
    }
    return null;
  }
}

async function scrapeText(url: string): Promise<{ html: string; text: string } | null> {
  const html = await robustFetch(url);
  if (!html) return null;
  const text = stripHtml(html).slice(0, 8_000);
  return { html, text };
}

// ─── ENRICH ONE ───────────────────────────────────────────────────────────────

export async function enrichOrganization(orgId: string): Promise<OutreachOrganizationModel> {
  const org = await prisma.outreachOrganization.findUniqueOrThrow({ where: { id: orgId } });

  // Idempotent — skip if already enriched (full or partial) or manually curated
  if (
    org.enrichment_status === "enriched" ||
    org.enrichment_status === "enriched_partial" ||
    org.enrichment_status === "manual"
  ) {
    return org as unknown as OutreachOrganizationModel;
  }

  if (!org.website) {
    return (await prisma.outreachOrganization.update({
      where: { id: orgId },
      data: { enrichment_status: "failed", notes: org.notes ?? "no website" },
    })) as unknown as OutreachOrganizationModel;
  }

  // ── Fetch homepage ─────────────────────────────────────────────────────────
  const homepage = await scrapeText(org.website);

  // ── Try to find and fetch About page ─────────────────────────────────────
  let websiteText = "";
  let aboutUrl: string | null = null;
  let domainOnlyFallback = false;

  if (homepage) {
    websiteText = homepage.text;
    aboutUrl = findAboutUrl(homepage.html, org.website);
    if (aboutUrl) {
      const about = await scrapeText(aboutUrl);
      if (about) {
        websiteText = websiteText + "\n\n--- ABOUT PAGE ---\n\n" + about.text;
      }
    }
    // Cap combined text at 8,000 chars
    websiteText = websiteText.slice(0, 8_000);
  } else {
    // Both homepage and about failed — fall back to domain-only enrichment
    domainOnlyFallback = true;
    console.warn(`[enricher] All fetches failed for org ${orgId} (${org.website}); using domain-only fallback`);
  }

  const emailDomain = org.email.split("@")[1] ?? "";

  // ── Call Anthropic ─────────────────────────────────────────────────────────
  let rawOutput = "";
  try {
    const msg = await anthropic.messages.create({
      model: MODELS.scorer,
      max_tokens: 1024,
      system: ORG_ENRICHMENT_PROMPT,
      messages: [
        {
          role: "user",
          content: JSON.stringify({
            organization_name: org.name,
            organization_email_domain: emailDomain,
            website_text: websiteText,
            ...(domainOnlyFallback && { fallback_mode: "domain_only" }),
          }),
        },
      ],
    });
    rawOutput = (msg.content[0] as { type: string; text: string }).text.trim();
    rawOutput = rawOutput.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  } catch (err) {
    return (await prisma.outreachOrganization.update({
      where: { id: orgId },
      data: {
        enrichment_status: "failed",
        enrichment_data: { error: "anthropic api error", message: String(err) },
      },
    })) as unknown as OutreachOrganizationModel;
  }

  // ── Parse output ──────────────────────────────────────────────────────────
  let parsed: Awaited<ReturnType<typeof OrgEnrichmentOutputSchema.parseAsync>>;
  try {
    parsed = OrgEnrichmentOutputSchema.parse(JSON.parse(rawOutput));
  } catch (err) {
    console.error(`[enricher] Validation failed for org ${orgId}:`, err);
    return (await prisma.outreachOrganization.update({
      where: { id: orgId },
      data: {
        enrichment_status: "failed",
        enrichment_data: { error: "validation_failed", raw: rawOutput },
      },
    })) as unknown as OutreachOrganizationModel;
  }

  // ── Update DB ─────────────────────────────────────────────────────────────
  const finalStatus = domainOnlyFallback ? "enriched_partial" : "enriched";
  const updated = await prisma.outreachOrganization.update({
    where: { id: orgId },
    data: {
      focus_areas: parsed.focus_areas,
      recent_topics: parsed.recent_topics,
      is_national: parsed.is_national,
      // Only overwrite if current value is empty/null
      ...(org.states_served.length === 0 && { states_served: parsed.states_served }),
      ...(org.organization_type == null && parsed.organization_type != null && {
        organization_type: parsed.organization_type,
      }),
      enrichment_status: finalStatus,
      enrichment_data: {
        ...parsed,
        ...(domainOnlyFallback
          ? { fallback_mode: "domain_only", fetch_failed_url: org.website }
          : { scraped_urls: [org.website, ...(aboutUrl ? [aboutUrl] : [])] }),
        enriched_at: new Date().toISOString(),
      },
    },
  });

  return updated as unknown as OutreachOrganizationModel;
}

// ─── ENRICH BATCH ─────────────────────────────────────────────────────────────

export async function enrichAllPending(
  limit = 25
): Promise<{ enriched: number; failed: number; skipped: number }> {
  const pending = await prisma.outreachOrganization.findMany({
    where: { enrichment_status: "pending" },
    take: limit,
    select: { id: true },
  });

  if (pending.length === 0) return { enriched: 0, failed: 0, skipped: 0 };

  const pLimit = (await import("p-limit")).default;
  const limit3 = pLimit(3);

  let enriched = 0;
  let failed = 0;
  const skipped = 0;

  await Promise.all(
    pending.map((org) =>
      limit3(async () => {
        try {
          const result = await enrichOrganization(org.id);
          const s = (result as unknown as { enrichment_status: string }).enrichment_status;
          if (s === "enriched" || s === "enriched_partial") {
            enriched++;
          } else {
            failed++;
          }
        } catch (err) {
          console.error(`[enricher] Uncaught error for org ${org.id}:`, err);
          failed++;
        }
      })
    )
  );

  return { enriched, failed, skipped };
}
