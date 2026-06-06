import { prisma } from "@/lib/prisma";

const SLUGS = [
  "labette-co-rwd-5",
  "labette-co-rwd-7",
  "bloomington-township-pwd-west-phase",
  "farmer-city",
  "ada-village",
  "vermilion-city",
  "aqua-pa-hamilton-water-co",
  "enfield",
  "norris-city",
  "watsonville-city-of",
];

const CITY_SLUGS = [
  "watsonville-ca",
  "parkland-fl",
  "enfield-il",
  "middletown-de",
  "crossville-il",
  "mexico-mo",
  "north-miami-beach-fl",
];

async function main() {
  const utilities = await prisma.utility.findMany({
    where: { slug: { in: SLUGS } },
    select: {
      slug: true,
      name: true,
      pwsid: true,
      population_served: true,
      city_served: true,
      county_served: true,
      state: { select: { abbreviation: true, name: true } },
      violations: {
        select: {
          violation_type: true,
          contaminant_name: true,
          is_health_based: true,
          violation_date: true,
          resolution_date: true,
        },
        orderBy: { violation_date: "desc" },
        take: 5,
      },
      pfas_records: {
        select: {
          analyte: { select: { code: true, name: true, epa_mcl_ppt: true } },
          raw_result_value: true,
          raw_detection_flag: true,
          sample_date: true,
        },
        orderBy: { sample_date: "desc" },
        take: 8,
      },
    },
  });

  // Cities — look up by finding utilities that serve each city
  // Parse "watsonville-ca" → citySlug="watsonville", stateAbbr="CA"
  const cityResults: Array<{ slug: string; utilities: typeof utilities }> = [];
  for (const citySlug of CITY_SLUGS) {
    const match = citySlug.match(/^(.+)-([a-z]{2})$/);
    if (!match) continue;
    const [, name, stateCode] = match;
    const cityName = name.replace(/-/g, " ");
    const utils = await prisma.utility.findMany({
      where: {
        state: { abbreviation: stateCode.toUpperCase() },
        city_served: { contains: cityName, mode: "insensitive" },
      },
      select: {
        slug: true,
        name: true,
        pwsid: true,
        population_served: true,
        city_served: true,
        state: { select: { abbreviation: true, name: true } },
        pfas_records: {
          select: {
            analyte: { select: { code: true, name: true, epa_mcl_ppt: true } },
            raw_result_value: true,
            raw_detection_flag: true,
            sample_date: true,
          },
          orderBy: { sample_date: "desc" },
          take: 5,
        },
        violations: {
          select: {
            violation_type: true,
            contaminant_name: true,
            is_health_based: true,
            violation_date: true,
            resolution_date: true,
          },
          orderBy: { violation_date: "desc" },
          take: 3,
        },
      },
      take: 5,
    });
    cityResults.push({ slug: citySlug, utilities: utils });
  }

  // PFAS watchlist utility NJ1514002
  const pfasUtility = await prisma.utility.findUnique({
    where: { pwsid: "NJ1514002" },
    select: {
      slug: true,
      name: true,
      pwsid: true,
      population_served: true,
      city_served: true,
      county_served: true,
      state: { select: { abbreviation: true, name: true } },
      pfas_records: {
        select: {
          analyte: { select: { code: true, name: true, epa_mcl_ppt: true } },
          raw_result_value: true,
          raw_detection_flag: true,
          sample_date: true,
        },
        orderBy: { sample_date: "desc" },
        take: 10,
      },
      violations: {
        select: {
          violation_type: true,
          contaminant_name: true,
          is_health_based: true,
          violation_date: true,
          resolution_date: true,
        },
        take: 5,
      },
    },
  });

  console.log(JSON.stringify({ utilities, cityResults, pfasUtility }, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
