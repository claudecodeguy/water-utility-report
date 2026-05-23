import { prisma } from "@/lib/prisma";

// ── Outlet registry ────────────────────────────────────────────────────────────

export type Outlet = { domain: string; name: string; tier: "national" | "state" | "metro" };

export const OUTLETS_BY_STATE: Record<string, Outlet[]> = {
  National: [
    { domain: "propublica.org",    name: "ProPublica",             tier: "national" },
    { domain: "theguardian.com",   name: "The Guardian US",        tier: "national" },
    { domain: "apnews.com",        name: "AP News",                tier: "national" },
    { domain: "reuters.com",       name: "Reuters",                tier: "national" },
    { domain: "bloomberg.com",     name: "Bloomberg",              tier: "national" },
    { domain: "politico.com",      name: "Politico",               tier: "national" },
    { domain: "npr.org",           name: "NPR",                    tier: "national" },
    { domain: "ewg.org",           name: "Environmental Working Group", tier: "national" },
  ],
  TN: [
    { domain: "tennessean.com",          name: "The Tennessean",                tier: "state" },
    { domain: "knoxnews.com",            name: "Knoxville News Sentinel",       tier: "state" },
    { domain: "timesfreepress.com",      name: "Chattanooga Times Free Press",  tier: "metro" },
    { domain: "commercialappeal.com",    name: "Memphis Commercial Appeal",     tier: "metro" },
    { domain: "nashvillescene.com",      name: "Nashville Scene",               tier: "metro" },
    { domain: "wpln.org",                name: "WPLN Nashville Public Radio",   tier: "metro" },
  ],
  KY: [
    { domain: "courier-journal.com",     name: "Louisville Courier Journal",    tier: "state" },
    { domain: "kentucky.com",            name: "Lexington Herald-Leader",       tier: "state" },
    { domain: "wkyt.com",               name: "WKYT News",                     tier: "metro" },
    { domain: "leoweekly.com",           name: "LEO Weekly",                    tier: "metro" },
  ],
  TX: [
    { domain: "texastribune.org",        name: "Texas Tribune",                 tier: "state" },
    { domain: "dallasnews.com",          name: "Dallas Morning News",           tier: "state" },
    { domain: "chron.com",              name: "Houston Chronicle",             tier: "metro" },
    { domain: "statesman.com",           name: "Austin American-Statesman",     tier: "metro" },
    { domain: "expressnews.com",         name: "San Antonio Express-News",      tier: "metro" },
    { domain: "star-telegram.com",       name: "Fort Worth Star-Telegram",      tier: "metro" },
    { domain: "texasmonthly.com",        name: "Texas Monthly",                 tier: "state" },
  ],
  FL: [
    { domain: "tampabay.com",            name: "Tampa Bay Times",               tier: "state" },
    { domain: "miamiherald.com",         name: "Miami Herald",                  tier: "state" },
    { domain: "orlandosentinel.com",     name: "Orlando Sentinel",              tier: "metro" },
    { domain: "sun-sentinel.com",        name: "South Florida Sun Sentinel",    tier: "metro" },
    { domain: "jacksonville.com",        name: "Florida Times-Union",           tier: "metro" },
    { domain: "floridaphoenix.com",      name: "Florida Phoenix",               tier: "state" },
  ],
  CA: [
    { domain: "latimes.com",             name: "Los Angeles Times",             tier: "national" },
    { domain: "sfchronicle.com",         name: "San Francisco Chronicle",       tier: "state" },
    { domain: "sacbee.com",             name: "Sacramento Bee",                tier: "state" },
    { domain: "sandiegouniontribune.com",name: "San Diego Union-Tribune",       tier: "metro" },
    { domain: "calmatters.org",          name: "CalMatters",                    tier: "state" },
    { domain: "kqed.org",               name: "KQED News",                     tier: "metro" },
  ],
  OH: [
    { domain: "dispatch.com",            name: "Columbus Dispatch",             tier: "state" },
    { domain: "cleveland.com",           name: "Cleveland Plain Dealer",        tier: "state" },
    { domain: "cincinnati.com",          name: "Cincinnati Enquirer",           tier: "metro" },
    { domain: "ohio.com",               name: "Akron Beacon Journal",          tier: "metro" },
    { domain: "statehousenews.com",      name: "Ohio Statehouse News Bureau",   tier: "state" },
    { domain: "ideastream.org",          name: "Ideastream Public Media",       tier: "metro" },
  ],
  PA: [
    { domain: "inquirer.com",            name: "Philadelphia Inquirer",         tier: "state" },
    { domain: "post-gazette.com",        name: "Pittsburgh Post-Gazette",       tier: "state" },
    { domain: "pennlive.com",            name: "PennLive / Patriot-News",       tier: "state" },
    { domain: "witf.org",               name: "WITF Public Media",             tier: "metro" },
    { domain: "spotlightpa.org",         name: "Spotlight PA",                  tier: "state" },
  ],
  NY: [
    { domain: "nytimes.com",             name: "New York Times",                tier: "national" },
    { domain: "gothamist.com",           name: "Gothamist",                     tier: "metro" },
    { domain: "buffalonews.com",         name: "Buffalo News",                  tier: "metro" },
    { domain: "timesunion.com",          name: "Albany Times Union",            tier: "metro" },
    { domain: "democratandchronicle.com",name: "Rochester Democrat & Chronicle",tier: "metro" },
  ],
  IL: [
    { domain: "chicagotribune.com",      name: "Chicago Tribune",               tier: "state" },
    { domain: "suntimes.com",           name: "Chicago Sun-Times",             tier: "state" },
    { domain: "wbez.org",               name: "WBEZ Chicago",                  tier: "metro" },
    { domain: "illinoistimes.com",       name: "Illinois Times",                tier: "metro" },
    { domain: "bnd.com",                name: "Belleville News-Democrat",       tier: "metro" },
  ],
  MI: [
    { domain: "freep.com",              name: "Detroit Free Press",            tier: "state" },
    { domain: "bridgemi.com",            name: "Bridge Michigan",               tier: "state" },
    { domain: "mlive.com",              name: "MLive",                         tier: "state" },
    { domain: "detroitnews.com",         name: "Detroit News",                  tier: "state" },
    { domain: "mpr.org",                name: "Michigan Public Radio",         tier: "state" },
  ],
  NC: [
    { domain: "newsobserver.com",        name: "News & Observer (Raleigh)",     tier: "state" },
    { domain: "charlotteobserver.com",   name: "Charlotte Observer",            tier: "state" },
    { domain: "wral.com",               name: "WRAL News",                     tier: "metro" },
    { domain: "nc-newsline.com",         name: "NC Newsline",                   tier: "state" },
  ],
  GA: [
    { domain: "ajc.com",                name: "Atlanta Journal-Constitution",   tier: "state" },
    { domain: "savannahnow.com",         name: "Savannah Morning News",         tier: "metro" },
    { domain: "georgiarecorder.com",     name: "Georgia Recorder",              tier: "state" },
  ],
  VA: [
    { domain: "washingtonpost.com",      name: "Washington Post",               tier: "national" },
    { domain: "pilotonline.com",         name: "The Virginian-Pilot",           tier: "state" },
    { domain: "insidenova.com",          name: "Inside NoVa",                   tier: "metro" },
    { domain: "virginiamercury.com",     name: "Virginia Mercury",              tier: "state" },
  ],
  WV: [
    { domain: "wvgazettemail.com",       name: "WV Gazette-Mail",               tier: "state" },
    { domain: "herald-dispatch.com",     name: "The Herald-Dispatch",           tier: "metro" },
    { domain: "wvpublic.org",            name: "WV Public Broadcasting",        tier: "state" },
  ],
  WI: [
    { domain: "jsonline.com",            name: "Milwaukee Journal Sentinel",    tier: "state" },
    { domain: "madison.com",             name: "Wisconsin State Journal",       tier: "metro" },
    { domain: "wpr.org",                name: "Wisconsin Public Radio",        tier: "state" },
    { domain: "wiseye.org",             name: "WisEye",                        tier: "state" },
  ],
  MN: [
    { domain: "startribune.com",         name: "Star Tribune",                  tier: "state" },
    { domain: "mprnews.org",             name: "MPR News",                      tier: "state" },
    { domain: "minnpost.com",            name: "MinnPost",                      tier: "state" },
  ],
  CO: [
    { domain: "denverpost.com",          name: "Denver Post",                   tier: "state" },
    { domain: "coloradosun.com",         name: "Colorado Sun",                  tier: "state" },
    { domain: "cpr.org",                name: "Colorado Public Radio",         tier: "state" },
  ],
  AZ: [
    { domain: "azcentral.com",           name: "Arizona Republic",              tier: "state" },
    { domain: "tucson.com",             name: "Arizona Daily Star",            tier: "metro" },
    { domain: "azcapitoltimes.com",      name: "Arizona Capitol Times",         tier: "state" },
  ],
  NJ: [
    { domain: "nj.com",                 name: "NJ.com / Star-Ledger",          tier: "state" },
    { domain: "northjersey.com",         name: "North Jersey / The Record",     tier: "metro" },
    { domain: "njspotlightnews.org",     name: "NJ Spotlight News",             tier: "state" },
  ],
};

export const ALL_STATES = Object.keys(OUTLETS_BY_STATE).sort((a, b) =>
  a === "National" ? -1 : b === "National" ? 1 : a.localeCompare(b)
);

// ── Beat keywords ──────────────────────────────────────────────────────────────

// Positions that indicate editorial staff (reporters, writers, editors)
const EDITORIAL_ROLES = [
  "reporter", "editor", "writer", "journalist", "correspondent",
  "bureau", "staff", "columnist", "producer", "anchor", "contributor",
];

// Non-editorial roles to exclude even if they contain an editorial keyword
const EXCLUDED_ROLES = [
  "director", "manager", "developer", "marketing", "operations",
  "finance", "sales", "hr ", "administrator", "coordinator", "intern",
  "president", "ceo", "cto", "vp ", "vice president", "accountant",
  "recruiter", "legal", "counsel",
];

// Higher-value beat keywords — these alone qualify someone
const BEAT_KEYWORDS = [
  "environment", "water", "health", "investigative", "public health",
  "climate", "science", "consumer", "watchdog", "energy", "pollution",
  "sustainability", "environmental",
];

function matchesBeat(position: string | null | undefined): boolean {
  if (!position) return false;
  const lower = position.toLowerCase();

  // Explicit beat match — always include
  if (BEAT_KEYWORDS.some((k) => lower.includes(k))) return true;

  // Generic editorial role — include unless explicitly non-editorial
  if (EXCLUDED_ROLES.some((k) => lower.includes(k))) return false;
  if (EDITORIAL_ROLES.some((k) => lower.includes(k))) return true;

  return false;
}

// ── Hunter.io types ───────────────────────────────────────────────────────────

type HunterEmail = {
  value: string;
  type: string;
  confidence: number;
  first_name: string | null;
  last_name: string | null;
  position: string | null;
  department: string | null;
  linkedin: string | null;
};

type HunterResponse = {
  data?: {
    domain: string;
    organization: string | null;
    emails: HunterEmail[];
  };
  errors?: { id: string; code: number; details: string }[];
};

// ── Discovery ─────────────────────────────────────────────────────────────────

export type DiscoverResult = {
  outlets_searched: number;
  emails_found: number;
  beat_matched: number;
  inserted: number;
  updated: number;
  skipped: number;
  quota_used: number;
  errors: { domain: string; message: string }[];
  journalists: { name: string; email: string; outlet: string; position: string | null }[];
};

export async function discoverJournalists(
  domains: { domain: string; name: string; state: string | null }[]
): Promise<DiscoverResult> {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) throw new Error("HUNTER_API_KEY is not set");

  const result: DiscoverResult = {
    outlets_searched: 0,
    emails_found: 0,
    beat_matched: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    quota_used: 0,
    errors: [],
    journalists: [],
  };

  for (const { domain, name: outletName, state } of domains) {
    result.outlets_searched++;

    try {
      const url = `https://api.hunter.io/v2/domain-search?domain=${encodeURIComponent(domain)}&api_key=${apiKey}&limit=10&type=personal`;
      const res = await fetch(url);
      result.quota_used++;

      if (!res.ok) {
        const text = await res.text();
        result.errors.push({ domain, message: `HTTP ${res.status}: ${text.slice(0, 120)}` });
        continue;
      }

      const json: HunterResponse = await res.json();

      if (json.errors?.length) {
        result.errors.push({ domain, message: json.errors[0].details });
        continue;
      }

      const emails = json.data?.emails ?? [];
      result.emails_found += emails.length;

      for (const email of emails) {
        if (!matchesBeat(email.position)) {
          result.skipped++;
          continue;
        }

        result.beat_matched++;

        const firstName = email.first_name ?? "";
        const lastName = email.last_name ?? "";
        const fullName = [firstName, lastName].filter(Boolean).join(" ") || email.value.split("@")[0];

        try {
          const existing = await prisma.outreachJournalist.findUnique({
            where: { email: email.value.toLowerCase() },
          });

          if (existing) {
            await prisma.outreachJournalist.update({
              where: { email: email.value.toLowerCase() },
              data: {
                outlet: outletName,
                outlet_url: `https://${domain}`,
                beat: email.position ?? existing.beat,
                state: state ?? existing.state,
              },
            });
            result.updated++;
          } else {
            await prisma.outreachJournalist.create({
              data: {
                name: fullName,
                email: email.value.toLowerCase(),
                outlet: outletName,
                outlet_url: `https://${domain}`,
                beat: email.position,
                state,
              },
            });
            result.inserted++;
          }

          result.journalists.push({
            name: fullName,
            email: email.value,
            outlet: outletName,
            position: email.position,
          });
        } catch (err) {
          result.errors.push({
            domain,
            message: `DB error for ${email.value}: ${err instanceof Error ? err.message : String(err)}`,
          });
        }
      }

      // Respect Hunter.io rate limit
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      result.errors.push({
        domain,
        message: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return result;
}
