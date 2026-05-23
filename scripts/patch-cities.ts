/**
 * patch-cities.ts
 *
 * Infers city_served for major cities by matching utility names.
 * Works for any state, including those where EPA GEOGRAPHIC_AREA returns nothing.
 *
 * For each city in a state, searches for utilities whose name contains the city
 * name (or known alias patterns) and sets city_served if currently null.
 *
 * Usage:
 *   npx tsx scripts/patch-cities.ts --state MA
 *   npx tsx scripts/patch-cities.ts --state MA --dry-run
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// city → name fragments to search for in utility names (case-insensitive)
// Order matters: first match wins for a given utility
const CITY_PATTERNS: Record<string, Array<{ city: string; patterns: string[] }>> = {
  MA: [
    { city: "Boston",       patterns: ["BOSTON WATER", "BOSTON WSC", "BWSC"] },
    { city: "Worcester",    patterns: ["WORCESTER"] },
    { city: "Springfield",  patterns: ["SPRINGFIELD WATER", "SPRINGFIELD WTR"] },
    { city: "Lowell",       patterns: ["LOWELL"] },
    { city: "Cambridge",    patterns: ["CAMBRIDGE WATER"] },
    { city: "New Bedford",  patterns: ["NEW BEDFORD"] },
    { city: "Brockton",     patterns: ["BROCKTON"] },
    { city: "Quincy",       patterns: ["QUINCY"] },
    { city: "Lynn",         patterns: ["LYNN WATER"] },
    { city: "Fall River",   patterns: ["FALL RIVER"] },
    { city: "Newton",       patterns: ["NEWTON"] },
    { city: "Somerville",   patterns: ["SOMERVILLE"] },
    { city: "Lawrence",     patterns: ["LAWRENCE WATER"] },
    { city: "Waltham",      patterns: ["WALTHAM"] },
    { city: "Haverhill",    patterns: ["HAVERHILL"] },
    { city: "Malden",       patterns: ["MALDEN"] },
    { city: "Medford",      patterns: ["MEDFORD"] },
    { city: "Taunton",      patterns: ["TAUNTON"] },
    { city: "Chicopee",     patterns: ["CHICOPEE"] },
    { city: "Everett",      patterns: ["EVERETT"] },
  ],
  MD: [
    { city: "Baltimore",    patterns: ["BALTIMORE CITY", "CITY OF BALTIMORE"] },
    { city: "Silver Spring", patterns: ["WSSC", "WASHINGTON SUBURBAN SANIT"] },
    { city: "Bethesda",     patterns: ["WSSC", "WASHINGTON SUBURBAN SANIT"] },
    { city: "Frederick",    patterns: ["FREDERICK"] },
    { city: "Rockville",    patterns: ["ROCKVILLE"] },
    { city: "Gaithersburg", patterns: ["GAITHERSBURG"] },
    { city: "Bowie",        patterns: ["BOWIE"] },
    { city: "Germantown",   patterns: ["GERMANTOWN"] },
    { city: "Columbia",     patterns: ["COLUMBIA"] },
    { city: "Annapolis",    patterns: ["ANNAPOLIS"] },
    { city: "Waldorf",      patterns: ["WALDORF"] },
    { city: "Ellicott City", patterns: ["ELLICOTT"] },
    { city: "Dundalk",      patterns: ["DUNDALK"] },
    { city: "Hagerstown",   patterns: ["HAGERSTOWN"] },
    { city: "Towson",       patterns: ["TOWSON"] },
  ],
  MN: [
    { city: "Minneapolis",  patterns: ["MINNEAPOLIS WATER", "CITY OF MINNEAPOLIS"] },
    { city: "Saint Paul",   patterns: ["SAINT PAUL", "ST PAUL", "ST. PAUL"] },
    { city: "Rochester",    patterns: ["ROCHESTER"] },
    { city: "Duluth",       patterns: ["DULUTH"] },
    { city: "Bloomington",  patterns: ["BLOOMINGTON"] },
    { city: "Brooklyn Park", patterns: ["BROOKLYN PARK"] },
    { city: "Plymouth",     patterns: ["PLYMOUTH"] },
    { city: "Maple Grove",  patterns: ["MAPLE GROVE"] },
    { city: "Woodbury",     patterns: ["WOODBURY"] },
    { city: "St. Cloud",    patterns: ["SAINT CLOUD", "ST CLOUD", "ST. CLOUD"] },
    { city: "Eagan",        patterns: ["EAGAN"] },
    { city: "Burnsville",   patterns: ["BURNSVILLE"] },
    { city: "Eden Prairie", patterns: ["EDEN PRAIRIE"] },
    { city: "Coon Rapids",  patterns: ["COON RAPIDS"] },
    { city: "Minnetonka",   patterns: ["MINNETONKA"] },
  ],
  WI: [
    { city: "Milwaukee",    patterns: ["MILWAUKEE WATER", "CITY OF MILWAUKEE"] },
    { city: "Madison",      patterns: ["MADISON WATER", "CITY OF MADISON"] },
    { city: "Green Bay",    patterns: ["GREEN BAY"] },
    { city: "Kenosha",      patterns: ["KENOSHA"] },
    { city: "Racine",       patterns: ["RACINE"] },
    { city: "Appleton",     patterns: ["APPLETON"] },
    { city: "Waukesha",     patterns: ["WAUKESHA"] },
    { city: "Oshkosh",      patterns: ["OSHKOSH"] },
    { city: "Eau Claire",   patterns: ["EAU CLAIRE"] },
    { city: "Janesville",   patterns: ["JANESVILLE"] },
    { city: "West Allis",   patterns: ["WEST ALLIS"] },
    { city: "La Crosse",    patterns: ["LA CROSSE", "LACROSSE"] },
    { city: "Sheboygan",    patterns: ["SHEBOYGAN"] },
    { city: "Wauwatosa",    patterns: ["WAUWATOSA"] },
    { city: "Wausau",       patterns: ["WAUSAU"] },
  ],
  TN: [
    { city: "Nashville",    patterns: ["NASHVILLE", "METRO WATER SERVICES"] },
    { city: "Memphis",      patterns: ["MEMPHIS"] },
    { city: "Knoxville",    patterns: ["KNOXVILLE"] },
    { city: "Chattanooga",  patterns: ["CHATTANOOGA"] },
    { city: "Clarksville",  patterns: ["CLARKSVILLE"] },
    { city: "Murfreesboro", patterns: ["MURFREESBORO"] },
    { city: "Franklin",     patterns: ["FRANKLIN WATER", "CITY OF FRANKLIN"] },
    { city: "Jackson",      patterns: ["JACKSON ENERGY", "JACKSON UTILITY"] },
    { city: "Johnson City", patterns: ["JOHNSON CITY"] },
    { city: "Bartlett",     patterns: ["BARTLETT"] },
    { city: "Hendersonville", patterns: ["HENDERSONVILLE"] },
    { city: "Kingsport",    patterns: ["KINGSPORT"] },
    { city: "Collierville", patterns: ["COLLIERVILLE"] },
    { city: "Smyrna",       patterns: ["SMYRNA"] },
    { city: "Cleveland",    patterns: ["CLEVELAND UTILITIES"] },
  ],
  // ── Previously built states (supplement geo-area data) ──────────────────────
  PA: [
    { city: "Philadelphia", patterns: ["PHILADELPHIA WATER", "PWSA", "PHILA WATER"] },
    { city: "Pittsburgh",   patterns: ["PITTSBURGH WATER", "PWSA", "CITY OF PITTSBURGH"] },
    { city: "Allentown",    patterns: ["ALLENTOWN"] },
    { city: "Erie",         patterns: ["ERIE WATER", "CITY OF ERIE"] },
    { city: "Reading",      patterns: ["READING"] },
    { city: "Scranton",     patterns: ["SCRANTON"] },
    { city: "Bethlehem",    patterns: ["BETHLEHEM"] },
    { city: "Lancaster",    patterns: ["LANCASTER"] },
    { city: "Harrisburg",   patterns: ["HARRISBURG"] },
    { city: "Altoona",      patterns: ["ALTOONA"] },
    { city: "York",         patterns: ["YORK WATER"] },
    { city: "Wilkes-Barre", patterns: ["WILKES-BARRE", "WILKES BARRE"] },
  ],
  NJ: [
    { city: "Newark",       patterns: ["NEWARK", "NEWARK DEPT"] },
    { city: "Jersey City",  patterns: ["JERSEY CITY"] },
    { city: "Paterson",     patterns: ["PATERSON"] },
    { city: "Elizabeth",    patterns: ["ELIZABETH"] },
    { city: "Lakewood",     patterns: ["LAKEWOOD"] },
    { city: "Edison",       patterns: ["EDISON"] },
    { city: "Woodbridge",   patterns: ["WOODBRIDGE"] },
    { city: "Toms River",   patterns: ["TOMS RIVER"] },
    { city: "Hamilton",     patterns: ["HAMILTON TWP"] },
    { city: "Trenton",      patterns: ["TRENTON WATER"] },
    { city: "Camden",       patterns: ["CAMDEN"] },
    { city: "Clifton",      patterns: ["CLIFTON"] },
  ],
  VA: [
    { city: "Virginia Beach", patterns: ["VIRGINIA BEACH"] },
    { city: "Norfolk",       patterns: ["NORFOLK"] },
    { city: "Chesapeake",    patterns: ["CHESAPEAKE"] },
    { city: "Richmond",      patterns: ["RICHMOND"] },
    { city: "Arlington",     patterns: ["ARLINGTON"] },
    { city: "Newport News",  patterns: ["NEWPORT NEWS"] },
    { city: "Alexandria",    patterns: ["ALEXANDRIA"] },
    { city: "Hampton",       patterns: ["HAMPTON"] },
    { city: "Roanoke",       patterns: ["ROANOKE"] },
    { city: "Portsmouth",    patterns: ["PORTSMOUTH"] },
    { city: "Suffolk",       patterns: ["SUFFOLK"] },
    { city: "Lynchburg",     patterns: ["LYNCHBURG"] },
    { city: "Fairfax",       patterns: ["FAIRFAX"] },
    { city: "Charlottesville", patterns: ["CHARLOTTESVILLE"] },
  ],
  WA: [
    { city: "Seattle",       patterns: ["SEATTLE PUBLIC UTIL", "SEATTLE WATER"] },
    { city: "Spokane",       patterns: ["SPOKANE"] },
    { city: "Tacoma",        patterns: ["TACOMA"] },
    { city: "Vancouver",     patterns: ["VANCOUVER"] },
    { city: "Bellevue",      patterns: ["BELLEVUE"] },
    { city: "Kent",          patterns: ["KENT"] },
    { city: "Renton",        patterns: ["RENTON"] },
    { city: "Kirkland",      patterns: ["KIRKLAND"] },
    { city: "Everett",       patterns: ["EVERETT"] },
    { city: "Bellingham",    patterns: ["BELLINGHAM"] },
    { city: "Marysville",    patterns: ["MARYSVILLE"] },
    { city: "Auburn",        patterns: ["AUBURN"] },
  ],
  CO: [
    { city: "Denver",        patterns: ["DENVER WATER", "CITY OF DENVER"] },
    { city: "Colorado Springs", patterns: ["COLORADO SPRINGS"] },
    { city: "Aurora",        patterns: ["AURORA WATER", "CITY OF AURORA"] },
    { city: "Fort Collins",  patterns: ["FORT COLLINS"] },
    { city: "Lakewood",      patterns: ["LAKEWOOD"] },
    { city: "Thornton",      patterns: ["THORNTON"] },
    { city: "Arvada",        patterns: ["ARVADA"] },
    { city: "Westminster",   patterns: ["WESTMINSTER"] },
    { city: "Pueblo",        patterns: ["PUEBLO"] },
    { city: "Boulder",       patterns: ["BOULDER"] },
    { city: "Highlands Ranch", patterns: ["HIGHLANDS RANCH"] },
    { city: "Greeley",       patterns: ["GREELEY"] },
    { city: "Longmont",      patterns: ["LONGMONT"] },
  ],
};

async function main() {
  const args = process.argv.slice(2);
  const stateIdx = args.indexOf("--state");
  const state = stateIdx !== -1 ? args[stateIdx + 1]?.toUpperCase() : null;
  const dryRun = args.includes("--dry-run");

  if (!state) {
    console.error("Usage: npx tsx scripts/patch-cities.ts --state MA [--dry-run]");
    process.exit(1);
  }

  const patterns = CITY_PATTERNS[state];
  if (!patterns) {
    console.log(`No city patterns defined for ${state} — skipping.`);
    await prisma.$disconnect();
    return;
  }

  console.log(`\nPatch cities — ${state}${dryRun ? " [DRY RUN]" : ""}`);

  // Get all utilities for this state (any publish status)
  const utilities = await prisma.utility.findMany({
    where: { state: { abbreviation: state } },
    select: { id: true, pwsid: true, name: true, city_served: true },
  });

  let updated = 0;
  let skipped = 0;

  for (const { city, patterns: namePatterns } of patterns) {
    // Find utilities matching any name pattern
    const matches = utilities.filter(u =>
      namePatterns.some(p => u.name.toUpperCase().includes(p.toUpperCase()))
    );

    for (const u of matches) {
      if (u.city_served === city) { skipped++; continue; }
      // Don't overwrite an existing city_served with a different city
      if (u.city_served && u.city_served !== city) {
        console.log(`  SKIP ${u.pwsid} ${u.name}: already has city "${u.city_served}"`);
        continue;
      }
      if (!dryRun) {
        await prisma.utility.update({ where: { id: u.id }, data: { city_served: city } });
      }
      console.log(`  ${dryRun ? "[dry]" : "✓"} ${u.pwsid} ${u.name} → "${city}"`);
      updated++;
    }
  }

  console.log(`\n  Updated: ${updated}`);
  console.log(`  Already set: ${skipped}`);
  console.log(`  ${dryRun ? "Dry run — no changes written." : "Done."}\n`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
