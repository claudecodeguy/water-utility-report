/**
 * Seeds the PfasAnalyte table with UCMR 5 analytes and EPA MCLs.
 *
 * Sources:
 *   - EPA UCMR 5 analyte list: https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule
 *   - EPA PFAS MCL rule (April 2024): https://www.epa.gov/sdwa/and-polyfluoroalkyl-substances-pfas
 *
 * MCL values as of April 2024 PFAS National Primary Drinking Water Regulation:
 *   PFOA:   4 ppt (individual)
 *   PFOS:   4 ppt (individual)
 *   PFNA:  10 ppt (individual)
 *   PFHxS: 10 ppt (individual)
 *   HFPO-DA (GenX): 10 ppt (individual)
 *   PFBS, PFHpA: mixture rule (Hazard Index ≤ 1) — no individual MCL
 *   All others monitored under UCMR 5: no MCL as of this seed date
 *
 * Usage:
 *   npx tsx scripts/seed-pfas-analytes.ts
 */

import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const ANALYTES = [
  {
    code: "PFOA",
    name: "Perfluorooctanoic acid",
    short_name: "PFOA",
    cas_number: "335-67-1",
    epa_mcl_ppt: 4,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "Individual MCL of 4 ppt finalized April 2024.",
  },
  {
    code: "PFOS",
    name: "Perfluorooctane sulfonic acid",
    short_name: "PFOS",
    cas_number: "1763-23-1",
    epa_mcl_ppt: 4,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "Individual MCL of 4 ppt finalized April 2024.",
  },
  {
    code: "PFNA",
    name: "Perfluorononanoic acid",
    short_name: "PFNA",
    cas_number: "375-95-1",
    epa_mcl_ppt: 10,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "Individual MCL of 10 ppt finalized April 2024.",
  },
  {
    code: "PFHxS",
    name: "Perfluorohexane sulfonic acid",
    short_name: "PFHxS",
    cas_number: "355-46-4",
    epa_mcl_ppt: 10,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "Individual MCL of 10 ppt finalized April 2024.",
  },
  {
    code: "HFPO-DA",
    name: "Hexafluoropropylene oxide dimer acid",
    short_name: "HFPO-DA (GenX)",
    cas_number: "13252-13-6",
    epa_mcl_ppt: 10,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "Individual MCL of 10 ppt finalized April 2024. Also known as GenX chemicals.",
  },
  {
    code: "PFBS",
    name: "Perfluorobutane sulfonic acid",
    short_name: "PFBS",
    cas_number: "375-73-5",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No individual MCL. Part of PFAS mixture Hazard Index rule (April 2024).",
  },
  {
    code: "PFHpA",
    name: "Perfluoroheptanoic acid",
    short_name: "PFHpA",
    cas_number: "375-85-9",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No individual MCL. Part of PFAS mixture Hazard Index rule (April 2024).",
  },
  {
    code: "PFHxA",
    name: "Perfluorohexanoic acid",
    short_name: "PFHxA",
    cas_number: "307-24-4",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024. Monitored under UCMR 5 for occurrence data.",
  },
  {
    code: "PFDA",
    name: "Perfluorodecanoic acid",
    short_name: "PFDA",
    cas_number: "335-76-2",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFUnA",
    name: "Perfluoroundecanoic acid",
    short_name: "PFUnA",
    cas_number: "2058-94-8",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFDoA",
    name: "Perfluorododecanoic acid",
    short_name: "PFDoA",
    cas_number: "307-55-1",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFTrDA",
    name: "Perfluorotridecanoic acid",
    short_name: "PFTrDA",
    cas_number: "72629-94-8",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFTeDA",
    name: "Perfluorotetradecanoic acid",
    short_name: "PFTeDA",
    cas_number: "376-06-7",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFBA",
    name: "Perfluorobutanoic acid",
    short_name: "PFBA",
    cas_number: "375-22-4",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFPeA",
    name: "Perfluoropentanoic acid",
    short_name: "PFPeA",
    cas_number: "2706-90-3",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFPeS",
    name: "Perfluoropentane sulfonic acid",
    short_name: "PFPeS",
    cas_number: "DOI: 10.1021/es200544a",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFHpS",
    name: "Perfluoroheptane sulfonic acid",
    short_name: "PFHpS",
    cas_number: "375-92-8",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFOS-br",
    name: "Branched Perfluorooctane sulfonic acid isomers",
    short_name: "br-PFOS",
    cas_number: null,
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "Branched isomers of PFOS. No separate MCL; part of PFOS grouping under April 2024 rule.",
  },
  {
    code: "NFDHA",
    name: "Nonafluoro-3,6-dioxaheptanoic acid",
    short_name: "NFDHA",
    cas_number: "151772-58-6",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "9Cl-PF3ONS",
    name: "9-Chlorohexadecafluoro-3-oxanone-1-sulfonic acid",
    short_name: "9Cl-PF3ONS",
    cas_number: "756426-58-1",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "11Cl-PF3OUdS",
    name: "11-Chloroeicosafluoro-3-oxaundecane-1-sulfonic acid",
    short_name: "11Cl-PF3OUdS",
    cas_number: "763051-92-9",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "4:2FTS",
    name: "4:2 Fluorotelomer sulfonic acid",
    short_name: "4:2 FTS",
    cas_number: "757124-72-4",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "6:2FTS",
    name: "6:2 Fluorotelomer sulfonic acid",
    short_name: "6:2 FTS",
    cas_number: "27619-97-2",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "8:2FTS",
    name: "8:2 Fluorotelomer sulfonic acid",
    short_name: "8:2 FTS",
    cas_number: "39108-34-4",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFECHS",
    name: "Perfluoroethylcyclohexane sulfonate",
    short_name: "PFECHS",
    cas_number: "335-24-0",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFEESA",
    name: "Perfluoro(2-ethoxyethane)sulfonic acid",
    short_name: "PFEESA",
    cas_number: "113507-82-7",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "DONA",
    name: "4,8-Dioxa-3H-perfluorononanoic acid",
    short_name: "DONA",
    cas_number: "919005-14-4",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFMBA",
    name: "Perfluoro-4-methoxybutanoic acid",
    short_name: "PFMBA",
    cas_number: "863090-89-5",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
  {
    code: "PFMPA",
    name: "Perfluoro-3-methoxypropanoic acid",
    short_name: "PFMPA",
    cas_number: "377-73-1",
    epa_mcl_ppt: null,
    epa_hal_ppt: null,
    ucmr_round: "UCMR 5",
    note: "No MCL as of April 2024.",
  },
];

async function main() {
  console.log(`\nSeeding ${ANALYTES.length} PFAS analytes...`);
  let created = 0;
  let updated = 0;

  for (const analyte of ANALYTES) {
    const existing = await prisma.pfasAnalyte.findUnique({ where: { code: analyte.code } });
    if (existing) {
      await prisma.pfasAnalyte.update({ where: { code: analyte.code }, data: analyte });
      updated++;
    } else {
      await prisma.pfasAnalyte.create({ data: analyte });
      created++;
    }
    process.stdout.write(`\r  ${created + updated}/${ANALYTES.length} · ${created} created · ${updated} updated`);
  }

  console.log(`\n\n✓ Done — ${created} created, ${updated} updated.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
