/**
 * Ingests city_served and county_served from EPA GEOGRAPHIC_AREA for each utility.
 *
 * Usage:
 *   npx tsx scripts/ingest-geo-area.ts              # all utilities
 *   npx tsx scripts/ingest-geo-area.ts --state CA   # one state
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });
const SDWIS_BASE = "https://data.epa.gov/efservice";
const DELAY_MS = 150;

interface GeoArea {
  city_served: string | null;
  county_served: string | null;
  zip_code_served: string | null;
}

async function fetchGeoArea(pwsid: string): Promise<GeoArea | null> {
  try {
    const res = await fetch(`${SDWIS_BASE}/GEOGRAPHIC_AREA/PWSID/${pwsid}/JSON`, {
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    // Prefer records with city populated
    const withCity = data.find((r: GeoArea) => r.city_served) ?? data[0];
    return withCity as GeoArea;
  } catch {
    return null;
  }
}

function toTitleCase(str: string): string {
  return str.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const stateFilter = stateIdx !== -1 ? args[stateIdx + 1] : null;

  const where = stateFilter
    ? { state: { abbreviation: stateFilter.toUpperCase() } }
    : {};

  const utilities = await prisma.utility.findMany({
    where,
    select: { id: true, pwsid: true, name: true },
    orderBy: { population_served: "desc" },
  });

  console.log(`\nGeo area ingestion`);
  console.log(`Utilities: ${utilities.length}${stateFilter ? ` (state: ${stateFilter})` : ""}`);
  console.log(`Starting...\n`);

  let updated = 0;
  let skipped = 0;

  for (let i = 0; i < utilities.length; i++) {
    const util = utilities[i];
    const geo = await fetchGeoArea(util.pwsid);

    if (geo?.city_served) {
      await prisma.utility.update({
        where: { id: util.id },
        data: {
          city_served: toTitleCase(geo.city_served.trim()),
          county_served: geo.county_served ? toTitleCase(geo.county_served.trim()) : undefined,
        },
      });
      updated++;
    } else {
      skipped++;
    }

    if ((i + 1) % 50 === 0 || i === utilities.length - 1) {
      process.stdout.write(`\r  ${i + 1}/${utilities.length} · ${updated} updated · ${skipped} no city`);
    }

    await new Promise((r) => setTimeout(r, DELAY_MS));
  }

  console.log(`\n\n✓ Done — ${updated} utilities with city data.`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
