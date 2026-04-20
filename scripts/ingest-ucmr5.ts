/**
 * Ingest EPA UCMR 5 PFAS occurrence data into the PfasRecord table.
 *
 * Source: EPA UCMR 5 Occurrence Data (UCMR5_All.txt)
 * URL: https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5
 *
 * Actual UCMR5_All.txt column layout (24 columns, tab-separated):
 *   PWSID, PWSName, Size, FacilityID, FacilityName, FacilityWaterType,
 *   SamplePointID, SamplePointName, SamplePointType,
 *   AssociatedFacilityID, AssociatedSamplePointID,
 *   CollectionDate, SampleID, Contaminant, MRL, Units, MethodID,
 *   AnalyticalResultsSign, AnalyticalResultValue,
 *   SampleEventCode, MonitoringRequirement, Region, State, UCMR1SampleType
 *
 * Detection logic:
 *   AnalyticalResultsSign = "<"  → "Not Detected above MRL"
 *   AnalyticalResultsSign = ""   → "Detected above MRL"
 *
 * Notes:
 *   - "lithium" rows are skipped (not PFAS)
 *   - Units are µg/L (preserved exactly from source — not converted)
 *   - Unknown analytes are auto-created in PfasAnalyte table
 *
 * Usage:
 *   npx tsx scripts/ingest-ucmr5.ts --file ~/Downloads/ucmr5-occurrence-data/UCMR5_All.txt
 *   npx tsx scripts/ingest-ucmr5.ts --file ~/Downloads/ucmr5-occurrence-data/UCMR5_All.txt --dry-run
 */

import "dotenv/config";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const SOURCE_DATASET = "EPA UCMR 5";
const SOURCE_URL = "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5";
const SOURCE_VERSION = new Date().toISOString().slice(0, 7);

// ── Arguments ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const fileIdx = args.indexOf("--file");
const dryRun = args.includes("--dry-run");
const filePath = fileIdx !== -1 ? args[fileIdx + 1] : null;

if (!filePath) {
  console.error("Error: --file <path> is required.");
  process.exit(1);
}
const resolvedPath = path.resolve(filePath);
if (!fs.existsSync(resolvedPath)) {
  console.error(`Error: File not found: ${resolvedPath}`);
  process.exit(1);
}

// ── UCMR5 contaminant name → analyte code normalization ───────────────────────
// Maps names exactly as they appear in the EPA file to the code used in our DB.

const UCMR5_NAME_TO_CODE: Record<string, string> = {
  "4:2 FTS": "4:2FTS",
  "6:2 FTS": "6:2FTS",
  "8:2 FTS": "8:2FTS",
  "PFTA":    "PFTeDA",   // Perfluorotetradecanoic acid — same compound, different abbreviation
  "ADONA":   "DONA",     // Ammonium 4,8-dioxa-3H-perfluorononanoate = DONA
};

// Analytes in the UCMR5 file not in our initial seed — will be created on the fly
const UCMR5_EXTRA_ANALYTES: Record<string, { name: string; note: string }> = {
  NEtFOSAA: {
    name: "N-Ethyl perfluorooctane sulfonamido acetic acid",
    note: "PFAS precursor. No MCL as of April 2024. Monitored under UCMR 5.",
  },
  NMeFOSAA: {
    name: "N-Methyl perfluorooctane sulfonamido acetic acid",
    note: "PFAS precursor. No MCL as of April 2024. Monitored under UCMR 5.",
  },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseDate(raw: string): Date | null {
  if (!raw?.trim()) return null;
  // M/D/YYYY or MM/DD/YYYY
  const parts = raw.trim().split("/");
  if (parts.length === 3) {
    const [m, d, y] = parts;
    const dt = new Date(`${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`);
    if (!isNaN(dt.getTime())) return dt;
  }
  const dt = new Date(raw.trim());
  return isNaN(dt.getTime()) ? null : dt;
}

function computeHash(payload: Record<string, string>): string {
  const str = JSON.stringify(
    Object.entries(payload)
      .filter(([, v]) => v !== "")
      .sort(([a], [b]) => a.localeCompare(b))
  );
  return crypto.createHash("sha256").update(str).digest("hex");
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\nUCMR 5 Ingest${dryRun ? " [DRY RUN]" : ""}`);
  console.log(`File: ${resolvedPath}\n`);

  // Build analyte lookup: DB code → id, plus normalized name aliases
  const dbAnalytes = await prisma.pfasAnalyte.findMany({ select: { id: true, code: true } });
  if (dbAnalytes.length === 0) {
    console.error("No analytes in DB. Run: npx tsx scripts/seed-pfas-analytes.ts");
    process.exit(1);
  }
  // Map: normalized-code → id
  const analyteMap = new Map<string, string>(
    dbAnalytes.map((a) => [a.code.toUpperCase().replace(/\s/g, ""), a.id])
  );
  console.log(`Loaded ${dbAnalytes.length} analytes from DB.`);

  // Read file (force latin1 to handle Windows-1252 special chars like µ)
  const raw = fs.readFileSync(resolvedPath, "latin1");
  const lines = raw.split(/\r?\n/);
  const headerLine = lines[0];
  const headers = headerLine.split("\t").map((h) => h.trim());

  // Column index lookup by name
  const ci = (name: string) => {
    const idx = headers.indexOf(name);
    if (idx === -1) throw new Error(`Column not found: ${name}. Headers: ${headers.join(", ")}`);
    return idx;
  };

  const COL = {
    PWSID:               ci("PWSID"),
    CollectionDate:      ci("CollectionDate"),
    SamplePointID:       ci("SamplePointID"),
    Contaminant:         ci("Contaminant"),
    MRL:                 ci("MRL"),
    Units:               ci("Units"),
    AnalyticalResultsSign:  ci("AnalyticalResultsSign"),
    AnalyticalResultValue:  ci("AnalyticalResultValue"),
  };

  console.log(`Columns confirmed: ${headers.length} columns detected.`);

  const dataLines = lines.slice(1).filter((l) => l.trim());
  const retrievedAt = new Date();

  const BATCH_SIZE = 1000;

  // Pre-create any unknown analytes before batching (scan once up front)
  if (!dryRun) {
    const unknownContaminants = new Set<string>();
    for (const line of dataLines) {
      const cols = line.split("\t");
      const raw = cols[COL.Contaminant]?.trim() ?? "";
      if (!raw || raw.toLowerCase() === "lithium") continue;
      const mapped = UCMR5_NAME_TO_CODE[raw] ?? raw;
      const key = mapped.toUpperCase().replace(/\s/g, "");
      if (!analyteMap.has(key)) unknownContaminants.add(raw);
    }
    if (unknownContaminants.size > 0) {
      console.log(`Auto-creating ${unknownContaminants.size} unknown analyte(s)...`);
      for (const raw of unknownContaminants) {
        const mapped = UCMR5_NAME_TO_CODE[raw] ?? raw;
        const key = mapped.toUpperCase().replace(/\s/g, "");
        const extraInfo = UCMR5_EXTRA_ANALYTES[raw];
        const created = await prisma.pfasAnalyte.upsert({
          where: { code: mapped },
          create: {
            code: mapped,
            name: extraInfo?.name ?? raw,
            ucmr_round: "UCMR 5",
            note: extraInfo?.note ?? `Auto-created from UCMR 5 source. No MCL as of April 2024.`,
          },
          update: {},
        });
        analyteMap.set(key, created.id);
        console.log(`  Created: ${mapped}`);
      }
    }
  }

  let processed = 0, inserted = 0, skipped = 0, failed = 0;
  const errors: string[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let batch: any[] = [];

  const flushBatch = async () => {
    if (batch.length === 0) return;
    try {
      const result = await prisma.pfasRecord.createMany({ data: batch, skipDuplicates: true });
      inserted += result.count;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      failed += batch.length;
      if (errors.length < 5) errors.push(`Batch DB error: ${msg.slice(0, 120)}`);
    }
    batch = [];
  };

  for (const line of dataLines) {
    const cols = line.split("\t");
    const pwsid = cols[COL.PWSID]?.trim().toUpperCase() ?? "";
    const contaminantRaw = cols[COL.Contaminant]?.trim() ?? "";
    const collectionDate = cols[COL.CollectionDate]?.trim() ?? "";
    const samplePoint = cols[COL.SamplePointID]?.trim() || null;
    const mrl = cols[COL.MRL]?.trim() ?? "";
    const unit = cols[COL.Units]?.trim() ?? "";
    const sign = cols[COL.AnalyticalResultsSign]?.trim() ?? "";
    const resultVal = cols[COL.AnalyticalResultValue]?.trim() ?? "";

    // Skip non-PFAS (lithium is also in UCMR5)
    if (contaminantRaw.toLowerCase() === "lithium") { skipped++; continue; }
    if (!pwsid || pwsid.length < 7) { skipped++; continue; }

    processed++;

    // Resolve analyte ID
    const mappedCode = UCMR5_NAME_TO_CODE[contaminantRaw] ?? contaminantRaw;
    const lookupKey = mappedCode.toUpperCase().replace(/\s/g, "");
    const analyteId = analyteMap.get(lookupKey) ?? null;

    // Build detection flag
    const isNonDetect = sign === "<" || sign.toLowerCase() === "nd";
    const detectionFlag = isNonDetect ? "Not Detected above MRL" : "Detected above MRL";
    const rawResultValue = isNonDetect ? (mrl || "ND") : (resultVal || mrl || "ND");

    const sampleDate = parseDate(collectionDate);

    // Validate
    const validationErrors: string[] = [];
    if (!contaminantRaw) validationErrors.push("missing_contaminant");
    if (!analyteId) validationErrors.push("unknown_analyte");
    if (!sampleDate) validationErrors.push("invalid_sample_date");
    if (!unit) validationErrors.push("missing_unit");
    const isValid = validationErrors.length === 0;

    if (!isValid) {
      failed++;
      if (errors.length < 10) errors.push(`Row ${processed}: [${validationErrors.join(",")}] PWSID=${pwsid} analyte=${contaminantRaw}`);
    }

    if (dryRun) {
      inserted++;
    } else if (analyteId) {
      const rawPayload: Record<string, string> = {
        PWSID: pwsid,
        Contaminant: contaminantRaw,
        CollectionDate: collectionDate,
        SamplePointID: samplePoint ?? "",
        MRL: mrl,
        Units: unit,
        AnalyticalResultsSign: sign,
        AnalyticalResultValue: resultVal,
      };
      const sourceHash = computeHash({ ...rawPayload, source_dataset: SOURCE_DATASET });

      batch.push({
        pwsid,
        analyte_id: analyteId,
        raw_result_value: rawResultValue,
        raw_unit: unit,
        raw_detection_flag: detectionFlag,
        raw_reporting_limit: mrl || null,
        sample_date: sampleDate ?? new Date("2023-01-01"),
        sample_point: samplePoint,
        source_dataset: SOURCE_DATASET,
        source_version: SOURCE_VERSION,
        source_url: SOURCE_URL,
        source_published_at: null,
        source_retrieved_at: retrievedAt,
        source_hash: sourceHash,
        raw_payload: rawPayload,
        validated: isValid,
        validation_errors: validationErrors,
        suppressed: false,
        last_seen_at: retrievedAt,
      });

      if (batch.length >= BATCH_SIZE) {
        await flushBatch();
      }
    }

    if (processed % 50000 === 0) {
      process.stdout.write(
        `\r  Processed: ${processed.toLocaleString()} · Written: ${inserted.toLocaleString()} · Failed: ${failed} · Skipped: ${skipped.toLocaleString()}`
      );
    }
  }

  // Flush remaining
  await flushBatch();

  process.stdout.write(
    `\r  Processed: ${processed.toLocaleString()} · Written: ${inserted.toLocaleString()} · Failed: ${failed} · Skipped: ${skipped.toLocaleString()}\n`
  );

  if (errors.length > 0) {
    console.log("\nSample errors:");
    errors.forEach((e) => console.log("  ✗", e));
  }

  console.log(`\n${dryRun ? "Dry run complete." : `✓ Done — ${inserted.toLocaleString()} records written, ${failed} failed.`}`);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
