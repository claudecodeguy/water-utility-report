/**
 * Test script for the org outreach drafter.
 * Runs 8 hardcoded scenarios × 3 repetitions (24 total) through the drafter
 * module, then 10 extra runs of scenario 5 specifically.
 *
 * Usage: npx tsx scripts/test-org-drafter.ts
 * Outputs: /tmp/org-drafter-samples.txt
 */

import * as fs from "fs";
import * as path from "path";

function loadEnv() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}
loadEnv();

const SENDER = process.env.OUTREACH_SENDER_FIRST_NAME ?? "Mike";
const EXPECTED_SIGN_OFF = `${SENDER}\nWater Utility Report`;

// ─── SCENARIOS ─────────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    label: "1. State env nonprofit → state_pfas page",
    input: {
      organization_name: "Clean Water Texas",
      organization_type: "environmental_nonprofit",
      contact_name: "Sarah Chen",
      focus_areas: ["drinking water policy", "PFAS advocacy", "water access"],
      states_served: ["TX"],
      is_national: false,
      page_url: "https://waterutilityreport.com/data/pfas/texas",
      page_type: "state_pfas" as const,
      state_name: "Texas",
      state_abbreviation: "TX",
      sender_first_name: SENDER,
    },
  },
  {
    label: "2. National public health org → hub page",
    input: {
      organization_name: "American Public Health Association",
      organization_type: "public_health_nonprofit",
      contact_name: undefined,
      focus_areas: ["public health policy", "environmental health", "health equity"],
      states_served: [],
      is_national: true,
      page_url: "https://waterutilityreport.com/data/pfas",
      page_type: "hub" as const,
      state_name: undefined,
      state_abbreviation: undefined,
      sender_first_name: SENDER,
    },
  },
  {
    label: "3. Water advocacy org → utility_pfas page",
    input: {
      organization_name: "Michigan Water Stewardship Program",
      organization_type: "water_advocacy",
      contact_name: "James Kowalski",
      focus_areas: ["source water protection", "Great Lakes", "utility accountability"],
      states_served: ["MI"],
      is_national: false,
      page_url: "https://waterutilityreport.com/pfas-watchlist/utility/MI0000001",
      page_type: "utility_pfas" as const,
      state_name: "Michigan",
      state_abbreviation: "MI",
      sender_first_name: SENDER,
    },
  },
  {
    label: "4. Parent group → city page",
    input: {
      organization_name: "Moms Advocating Sustainability",
      organization_type: "parent_group",
      contact_name: "Linda Ramirez",
      focus_areas: ["children's health", "school water safety", "community advocacy"],
      states_served: ["CA", "OR", "WA"],
      is_national: false,
      page_url: "https://waterutilityreport.com/cities/los-angeles-ca",
      page_type: "city" as const,
      state_name: "California",
      state_abbreviation: "CA",
      sender_first_name: SENDER,
    },
  },
  {
    label: "5. Civic association → state_pfas page, no contact name",
    input: {
      organization_name: "New Jersey Environmental Federation",
      organization_type: "civic_association",
      contact_name: undefined,
      focus_areas: ["environmental justice", "community right-to-know", "regulatory oversight"],
      states_served: ["NJ"],
      is_national: false,
      page_url: "https://waterutilityreport.com/data/pfas/new-jersey",
      page_type: "state_pfas" as const,
      state_name: "New Jersey",
      state_abbreviation: "NJ",
      sender_first_name: SENDER,
    },
  },
  {
    label: "6. Multi-state env nonprofit → hub page",
    input: {
      organization_name: "Mississippi River Network",
      organization_type: "environmental_nonprofit",
      contact_name: "Teresa Webb",
      focus_areas: ["river basin protection", "agricultural runoff", "PFAS contamination", "drinking water monitoring"],
      states_served: ["MN", "WI", "IA", "IL", "MO", "KY", "TN", "AR", "MS", "LA"],
      is_national: false,
      page_url: "https://waterutilityreport.com/data/pfas",
      page_type: "hub" as const,
      state_name: undefined,
      state_abbreviation: undefined,
      sender_first_name: SENDER,
    },
  },
  {
    label: "7. State health policy org → contaminant page",
    input: {
      organization_name: "Ohio Consumers' Counsel",
      organization_type: "public_health_nonprofit",
      contact_name: "David Park",
      focus_areas: ["utility regulation", "consumer protection", "water affordability"],
      states_served: ["OH"],
      is_national: false,
      page_url: "https://waterutilityreport.com/contaminants/pfoa",
      page_type: "contaminant" as const,
      state_name: "Ohio",
      state_abbreviation: "OH",
      sender_first_name: SENDER,
    },
  },
  {
    label: "8. National water policy org → state_pfas page",
    input: {
      organization_name: "Environmental Defense Fund",
      organization_type: "environmental_nonprofit",
      contact_name: undefined,
      focus_areas: ["PFAS regulation", "Clean Water Act", "utility accountability", "EPA rulemaking"],
      states_served: [],
      is_national: true,
      page_url: "https://waterutilityreport.com/data/pfas/florida",
      page_type: "state_pfas" as const,
      state_name: "Florida",
      state_abbreviation: "FL",
      sender_first_name: SENDER,
    },
  },
];

// ─── CHECKLIST ─────────────────────────────────────────────────────────────────

const BANNED_PHRASES = [
  "safe to drink", "not safe to drink", "unsafe", "dangerous", "toxic",
  "poisoned", "contaminated water", "health risk", "health threat",
  "health emergency", "emergency alert", "all clear", "failed water system",
  "compliance failure", "exciting", "thrilled", "delighted", "violated", "violation",
];

interface RunResult {
  scenarioLabel: string;
  run: number;
  pass: boolean;
  failures: string[];
  urlPresent: boolean;
  signOffCorrect: boolean;
  urlAutoCorrect: boolean;
  signOffAutoCorrect: boolean;
  subject: string;
  body: string;        // post-correction
  rawBody: string;     // pre-correction snapshot (captured before drafter mutates)
  personalizationNote: string;
  error?: string;
}

function checkOutput(
  output: { subject: string; body: string; personalization_note: string },
  pageUrl: string
): { failures: string[]; urlPresent: boolean; signOffCorrect: boolean } {
  const failures: string[] = [];
  const { subject, body } = output;
  const allText = (subject + " " + body).toLowerCase();

  if (subject.length > 120) failures.push(`Subject too long: ${subject.length} chars`);
  if (subject.length < 5) failures.push("Subject too short");

  const wordCount = body.split(/\s+/).filter(Boolean).length;
  if (wordCount < 70) failures.push(`Body too short: ~${wordCount} words`);
  if (wordCount > 130) failures.push(`Body too long: ~${wordCount} words`);

  for (const phrase of BANNED_PHRASES) {
    if (allText.includes(phrase.toLowerCase())) failures.push(`Banned phrase: "${phrase}"`);
  }

  const urlPresent = body.includes(pageUrl);
  if (!urlPresent) failures.push(`Exact page_url missing: ${pageUrl}`);

  if (subject.includes("http")) failures.push("URL should not appear in subject");

  if (!allText.includes("ucmr") && !allText.includes("unregulated contaminant")) {
    failures.push("Does not reference UCMR 5 / EPA monitoring program");
  }

  const signOffCorrect = body.trimEnd().endsWith(EXPECTED_SIGN_OFF);
  if (!signOffCorrect) {
    failures.push(`Sign-off missing or wrong. Expected body to end with: ${JSON.stringify(EXPECTED_SIGN_OFF)}`);
  }

  return { failures, urlPresent, signOffCorrect };
}

// ─── RUN ONE SCENARIO ──────────────────────────────────────────────────────────

async function runOne(
  scenario: (typeof SCENARIOS)[number],
  run: number,
  draftOrgPitch: (input: (typeof SCENARIOS)[number]["input"], orgId: string) => Promise<{ output: { subject: string; body: string; personalization_note: string }; url_auto_corrected: boolean; sign_off_auto_corrected: boolean }>
): Promise<RunResult> {
  try {
    const { output, url_auto_corrected, sign_off_auto_corrected } = await draftOrgPitch(
      scenario.input,
      `test-${scenario.label.slice(0, 3)}`
    );
    const { failures, urlPresent, signOffCorrect } = checkOutput(output, scenario.input.page_url);
    return {
      scenarioLabel: scenario.label,
      run,
      pass: failures.length === 0,
      failures,
      urlPresent,
      signOffCorrect,
      urlAutoCorrect: url_auto_corrected,
      signOffAutoCorrect: sign_off_auto_corrected,
      subject: output.subject,
      body: output.body,
      rawBody: "",  // drafter doesn't surface pre-correction body; sign_off_auto_corrected flag tells us
      personalizationNote: output.personalization_note,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      scenarioLabel: scenario.label,
      run,
      pass: false,
      failures: [`Exception: ${msg}`],
      urlPresent: false,
      signOffCorrect: false,
      urlAutoCorrect: false,
      signOffAutoCorrect: false,
      subject: "", body: "", rawBody: "",
      personalizationNote: "",
      error: msg,
    };
  }
}

// ─── MAIN ──────────────────────────────────────────────────────────────────────

const RUNS_PER_SCENARIO = 3;
const SCENARIO_5_EXTRA = 10;

async function main() {
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("ANTHROPIC_API_KEY not set");
    process.exit(1);
  }

  const { draftOrgPitchFromInput: draftOrgPitch } = await import("../lib/outreach/orgs/drafter.js");

  const allResults: RunResult[] = [];
  const outputLines: string[] = [];
  let autoCorrectExample: RunResult | null = null;

  // ── Main 24-run suite ────────────────────────────────────────────────────────
  console.log(`Running ${SCENARIOS.length} scenarios × ${RUNS_PER_SCENARIO} runs = ${SCENARIOS.length * RUNS_PER_SCENARIO} total\n`);

  for (const scenario of SCENARIOS) {
    console.log(`  ${scenario.label}`);
    for (let run = 1; run <= RUNS_PER_SCENARIO; run++) {
      process.stdout.write(`    run ${run}/${RUNS_PER_SCENARIO} ... `);
      const r = await runOne(scenario, run, draftOrgPitch);
      allResults.push(r);

      const acTag = [r.urlAutoCorrect && "URL", r.signOffAutoCorrect && "sign-off"]
        .filter(Boolean).join("+");
      const tag = r.pass
        ? acTag ? `PASS (auto-corrected: ${acTag})` : "PASS"
        : `FAIL (${r.failures.length} issue${r.failures.length > 1 ? "s" : ""})`;
      console.log(tag);

      if ((r.urlAutoCorrect || r.signOffAutoCorrect) && !autoCorrectExample) {
        autoCorrectExample = r;
      }

      outputLines.push("=".repeat(80));
      outputLines.push(`SCENARIO: ${r.scenarioLabel} — Run ${r.run}`);
      outputLines.push(`STATUS: ${r.pass ? "PASS" : "FAIL"}  URL:${r.urlPresent ? "✓" : "✗"}  SIGNOFF:${r.signOffCorrect ? "✓" : "✗"}  AC:${[r.urlAutoCorrect && "url", r.signOffAutoCorrect && "signoff"].filter(Boolean).join("+") || "none"}`);
      if (!r.pass) outputLines.push(`FAILURES:\n${r.failures.map((f) => `  - ${f}`).join("\n")}`);
      outputLines.push(`\nSUBJECT: ${r.subject}`);
      outputLines.push(`\nBODY:\n${r.body}`);
      outputLines.push(`\nPERSONALIZATION NOTE: ${r.personalizationNote}`);
      outputLines.push("");
    }
    console.log();
  }

  // ── Scenario 5 × 10 extra ────────────────────────────────────────────────────
  const s5 = SCENARIOS[4];
  const s5Results: RunResult[] = [];
  console.log(`\nScenario 5 stress-test: ${SCENARIO_5_EXTRA} extra runs\n`);

  for (let run = 1; run <= SCENARIO_5_EXTRA; run++) {
    process.stdout.write(`  extra run ${run}/${SCENARIO_5_EXTRA} ... `);
    const r = await runOne(s5, RUNS_PER_SCENARIO + run, draftOrgPitch);
    s5Results.push(r);

    const acTag = [r.urlAutoCorrect && "URL", r.signOffAutoCorrect && "sign-off"]
      .filter(Boolean).join("+");
    const tag = r.pass
      ? acTag ? `PASS (auto-corrected: ${acTag})` : "PASS"
      : `FAIL (${r.failures.join("; ")})`;
    console.log(tag);

    if ((r.urlAutoCorrect || r.signOffAutoCorrect) && !autoCorrectExample) {
      autoCorrectExample = r;
    }

    outputLines.push("=".repeat(80));
    outputLines.push(`SCENARIO 5 EXTRA — Run ${run}`);
    outputLines.push(`STATUS: ${r.pass ? "PASS" : "FAIL"}  URL:${r.urlPresent ? "✓" : "✗"}  SIGNOFF:${r.signOffCorrect ? "✓" : "✗"}  AC:${[r.urlAutoCorrect && "url", r.signOffAutoCorrect && "signoff"].filter(Boolean).join("+") || "none"}`);
    if (!r.pass) outputLines.push(`FAILURES:\n${r.failures.map((f) => `  - ${f}`).join("\n")}`);
    outputLines.push(`\nBODY:\n${r.body}`);
    outputLines.push("");
  }

  // ── Summary table ─────────────────────────────────────────────────────────────
  const totalPass = allResults.filter((r) => r.pass).length;
  const totalFail = allResults.filter((r) => !r.pass).length;
  const total = allResults.length;
  const totalUrlAc = allResults.filter((r) => r.urlAutoCorrect).length;
  const totalSignOffAc = allResults.filter((r) => r.signOffAutoCorrect).length;

  const s5Pass = s5Results.filter((r) => r.pass).length;
  const s5Ac = s5Results.filter((r) => r.urlAutoCorrect || r.signOffAutoCorrect).length;

  console.log("\n" + "─".repeat(80));
  console.log("MAIN SUITE RESULTS (24 runs)\n");
  console.log("  Scenario                                         R1           R2           R3");
  console.log("  " + "─".repeat(76));

  for (const scenario of SCENARIOS) {
    const runs = allResults.filter((r) => r.scenarioLabel === scenario.label);
    const cols = runs.map((r) => {
      const ac = [r.urlAutoCorrect && "U", r.signOffAutoCorrect && "S"].filter(Boolean).join("");
      const base = r.pass ? "PASS" : "FAIL";
      return `${base}${ac ? `(${ac})` : ""}`.padEnd(11);
    });
    const label = scenario.label.slice(0, 45).padEnd(45);
    console.log(`  ${label}  ${cols.join("  ")}`);
    for (const r of runs) {
      if (!r.pass) for (const f of r.failures) console.log(`       run ${r.run} → ${f}`);
    }
  }

  console.log("  " + "─".repeat(76));
  console.log(`  Total: ${totalPass}/${total} passed, ${totalFail}/${total} failed`);
  console.log(`  URL auto-corrected: ${totalUrlAc}/${total}   Sign-off auto-corrected: ${totalSignOffAc}/${total}`);

  console.log("\n" + "─".repeat(80));
  console.log(`SCENARIO 5 STRESS-TEST (${SCENARIO_5_EXTRA} extra runs)\n`);
  console.log(`  Passed: ${s5Pass}/${SCENARIO_5_EXTRA}   Auto-corrected: ${s5Ac}/${SCENARIO_5_EXTRA}`);

  // ── Auto-correct example ──────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(80));
  if (autoCorrectExample) {
    const acTypes = [autoCorrectExample.urlAutoCorrect && "URL", autoCorrectExample.signOffAutoCorrect && "sign-off"].filter(Boolean).join(" + ");
    console.log(`AUTO-CORRECTION EXAMPLE (${acTypes} corrected)\n`);
    console.log(`Scenario: ${autoCorrectExample.scenarioLabel}`);
    console.log(`Personalization note: ${autoCorrectExample.personalizationNote}`);
    console.log(`\nPost-correction body:\n${"─".repeat(50)}`);
    console.log(autoCorrectExample.body);
    console.log("─".repeat(50));
  } else {
    console.log("No auto-corrections triggered — prompt was sufficient for all 34 runs.");
  }

  // ── Write file ────────────────────────────────────────────────────────────────
  const summaryLines = [
    "ORG DRAFTER TEST RESULTS",
    `Run at: ${new Date().toISOString()}`,
    `Sender: ${SENDER}`,
    `Main suite: ${totalPass}/${total} passed`,
    `URL auto-corrected: ${totalUrlAc}/${total}   Sign-off auto-corrected: ${totalSignOffAc}/${total}`,
    `Scenario 5 stress: ${s5Pass}/${SCENARIO_5_EXTRA}   Auto-corrected: ${s5Ac}/${SCENARIO_5_EXTRA}`,
    "",
    ...allResults.map(
      (r) =>
        `${r.pass ? "PASS" : "FAIL"}  URL:${r.urlPresent ? "✓" : "✗"}  SO:${r.signOffCorrect ? "✓" : "✗"}  ${r.scenarioLabel} — Run ${r.run}` +
        (r.pass ? "" : `\n     ${r.failures.join("\n     ")}`)
    ),
    "",
    "=".repeat(80),
    "FULL OUTPUTS",
    "=".repeat(80),
    "",
    ...outputLines,
  ];

  fs.writeFileSync("/tmp/org-drafter-samples.txt", summaryLines.join("\n"), "utf-8");
  console.log("\nFull outputs written to /tmp/org-drafter-samples.txt\n");

  // ── Gate ─────────────────────────────────────────────────────────────────────
  if (totalPass === total && s5Pass === SCENARIO_5_EXTRA) {
    console.log(`✓ ${total}/${total} main + ${s5Pass}/${SCENARIO_5_EXTRA} scenario-5 runs passed. STOPPING — ready for review.`);
  } else if (totalFail >= 4) {
    console.error(`✗ ${totalFail}/${total} runs failed. DO NOT PROCEED.`);
    process.exit(1);
  } else {
    console.log(`${totalPass}/${total} passed. Review output before proceeding.`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
