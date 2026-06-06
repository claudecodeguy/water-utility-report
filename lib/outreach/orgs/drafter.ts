import { anthropic, MODELS } from "../anthropic";
import { prisma } from "@/lib/prisma";
import { OrgDrafterOutputSchema, type OrgDrafterInput, type OrgDrafterOutput } from "./types";
import { ORG_DRAFTER_PROMPT, ORG_DRAFTER_PROMPT_A, ORG_DRAFTER_PROMPT_B } from "./prompts";
import { getStateContentByAbbr } from "@/lib/content/states";
import type { OutreachOrgPitchModel } from "@/lib/generated/prisma/models";

// ─── FIRST-NAME EXTRACTION ────────────────────────────────────────────────────
// Preprocesses contact_name server-side so the AI always receives a clean first
// name or undefined — never a full name, title, role word, or email address.

const STRIP_TITLES = /^(dr\.?|mr\.?|mrs\.?|ms\.?|miss|prof\.?|rev\.?|hon\.?|sir|mx\.?)\s+/i;
const STRIP_SUFFIXES = /[,\s]+(jr\.?|sr\.?|ii|iii|iv|ph\.?d\.?|m\.?d\.?|esq\.?)$/i;
const ROLE_WORDS = /\b(director|manager|coordinator|officer|executive|president|chair(man|woman|person)?|founder|co-founder|admin(istrator)?|staff|team|department|dept|program|lead|head|senior|junior|associate|assistant|communications?|outreach|policy|advocacy|water|quality|environmental|public|health|science|research|education)\b/i;
const LOOKS_LIKE_NAME = /^[A-Z][a-zA-Z''-]{1,29}$/;

export function extractFirstName(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.trim();
  if (!trimmed) return undefined;

  // Reject emails
  if (trimmed.includes("@")) return undefined;

  // Strip trailing suffixes before anything else
  let name = trimmed.replace(STRIP_SUFFIXES, "").trim();

  // Strip leading titles
  name = name.replace(STRIP_TITLES, "").trim();

  // Reject if the whole string (after stripping) looks like a role/generic phrase
  if (ROLE_WORDS.test(name)) return undefined;

  // Take the first word only
  const first = name.split(/[\s,]+/)[0];

  // Must look like a proper name: starts uppercase, only letters/hyphens/apostrophes, 2-30 chars
  if (!LOOKS_LIKE_NAME.test(first)) return undefined;

  // Normalize to title case in case enricher stored it ALL CAPS or all lowercase
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export interface OrgDraftResult {
  output: OrgDrafterOutput;
  url_auto_corrected: boolean;
  sign_off_auto_corrected: boolean;
}

function sanitizeJson(raw: string): string {
  raw = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
  // Fix literal newlines inside JSON string values by processing character by character.
  // We can't use the /s flag (requires ES2018) so we handle newlines explicitly.
  let result = "";
  let inString = false;
  let escaped = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (escaped) { result += ch; escaped = false; continue; }
    if (ch === "\\") { escaped = true; result += ch; continue; }
    if (ch === '"') { inString = !inString; result += ch; continue; }
    if (inString && ch === "\n") { result += "\\n"; continue; }
    if (inString && ch === "\r") continue;
    result += ch;
  }
  return result;
}

// Build the expected two-line sign-off: "Mike\nWater Utility Report"
function expectedSignOff(senderFirstName: string): string {
  return `${senderFirstName}\nWater Utility Report`;
}

function bodyHasSignOff(body: string, senderFirstName: string): boolean {
  return body.trimEnd().endsWith(expectedSignOff(senderFirstName));
}

function injectUrl(body: string, pageUrl: string, senderFirstName: string): string {
  // Insert the URL on its own line before the sign-off block.
  const signOff = expectedSignOff(senderFirstName);
  const idx = body.lastIndexOf(signOff);
  if (idx !== -1) {
    const before = body.slice(0, idx).trimEnd();
    return `${before}\n\n${pageUrl}\n\n${signOff}`;
  }
  // Fallback: append URL then canonical sign-off
  return `${body.trimEnd()}\n\n${pageUrl}\n\n${signOff}`;
}

function injectSignOff(body: string, senderFirstName: string): string {
  const signOff = expectedSignOff(senderFirstName);
  let cleaned = body.trimEnd();
  // Remove "Water Utility Report" if present at the end without the name above it
  cleaned = cleaned.replace(/\n*Water Utility Report\s*$/i, "");
  // Remove common closer phrases that shouldn't be there
  cleaned = cleaned.replace(/\n*(Best|Thanks|Cheers|Regards|Sincerely|Warmly)[,\s]*$/i, "");
  return `${cleaned.trimEnd()}\n\n${signOff}`;
}

// Merge auto-correction flags into personalization_note without nesting brackets.
// Result format: "[URL auto-corrected] [Sign-off auto-corrected] <original note>"
function buildNote(original: string, urlFixed: boolean, signOffFixed: boolean): string {
  // Strip any existing auto-correction prefixes first so we don't double-wrap
  let base = original
    .replace(/^\[URL auto-corrected\]\s*/i, "")
    .replace(/^\[Sign-off auto-corrected\]\s*/i, "");
  const prefixes: string[] = [];
  if (urlFixed) prefixes.push("[URL auto-corrected]");
  if (signOffFixed) prefixes.push("[Sign-off auto-corrected]");
  return prefixes.length > 0 ? `${prefixes.join(" ")} ${base}` : base;
}

function selectPrompt(abVariant: "A" | "B" | null): string {
  if (abVariant === "A") return ORG_DRAFTER_PROMPT_A;
  if (abVariant === "B") return ORG_DRAFTER_PROMPT_B;
  return ORG_DRAFTER_PROMPT;
}

async function callOrgDrafter(
  input: OrgDrafterInput,
  orgId: string,
  abVariant: "A" | "B" | null = null
): Promise<OrgDraftResult> {
  const msg = await anthropic.messages.create({
    model: MODELS.drafter,
    max_tokens: 1024,
    system: selectPrompt(abVariant),
    messages: [{ role: "user", content: JSON.stringify(input, null, 2) }],
  });

  const raw = sanitizeJson((msg.content[0] as { type: string; text: string }).text.trim());

  let parsed: OrgDrafterOutput;
  try {
    parsed = OrgDrafterOutputSchema.parse(JSON.parse(raw));
  } catch (e) {
    throw new Error(
      `Drafter returned invalid output for org ${orgId}, page ${input.page_url}: ${e instanceof Error ? e.message : String(e)}\nRaw: ${raw}`
    );
  }

  const pageUrl = input.page_url;
  const senderFirstName = input.sender_first_name;
  let urlAutoCorrect = false;
  let signOffAutoCorrect = false;

  // ── URL check ────────────────────────────────────────────────────────────────
  if (!parsed.body.includes(pageUrl)) {
    console.warn(`[org-drafter] Auto-correcting missing URL for org ${orgId}, page ${pageUrl}`);
    parsed = { ...parsed, body: injectUrl(parsed.body, pageUrl, senderFirstName) };
    urlAutoCorrect = true;

    if (!parsed.body.includes(pageUrl)) {
      throw new Error(`URL auto-correction failed for org ${orgId}, page ${pageUrl}. Draft discarded.`);
    }
  }

  // ── Sign-off check ───────────────────────────────────────────────────────────
  if (!bodyHasSignOff(parsed.body, senderFirstName)) {
    console.warn(`[org-drafter] Auto-correcting missing sign-off for org ${orgId}, page ${pageUrl}`);
    parsed = { ...parsed, body: injectSignOff(parsed.body, senderFirstName) };
    signOffAutoCorrect = true;

    if (!bodyHasSignOff(parsed.body, senderFirstName)) {
      throw new Error(`Sign-off auto-correction failed for org ${orgId}, page ${pageUrl}. Draft discarded.`);
    }
  }

  // ── Merge flags into note ────────────────────────────────────────────────────
  if (urlAutoCorrect || signOffAutoCorrect) {
    parsed = {
      ...parsed,
      personalization_note: buildNote(parsed.personalization_note, urlAutoCorrect, signOffAutoCorrect),
    };
  }

  return { output: parsed, url_auto_corrected: urlAutoCorrect, sign_off_auto_corrected: signOffAutoCorrect };
}

async function callOrgDrafterWithWordCheck(
  input: OrgDrafterInput,
  orgId: string,
  abVariant: "A" | "B" | null = null
): Promise<OrgDraftResult> {
  const result = await callOrgDrafter(input, orgId, abVariant);
  const wordCount = result.output.body.trim().split(/\s+/).length;

  if (wordCount <= 145) return result;

  // ── Over limit — retry once with explicit reminder ───────────────────────────
  console.warn(`[org-drafter] Draft exceeded word limit (${wordCount} words) for org ${orgId}, page ${input.page_url}. Regenerating once with stricter prompt.`);

  const retryMsg = await anthropic.messages.create({
    model: MODELS.drafter,
    max_tokens: 1024,
    system: selectPrompt(abVariant),
    messages: [
      {
        role: "user",
        content:
          JSON.stringify(input, null, 2) +
          `\n\nSTRICT LENGTH REQUIREMENT: previous draft was ${wordCount} words. Keep this draft under 110 words total. Count before responding.`,
      },
    ],
  });

  const retryRaw = sanitizeJson((retryMsg.content[0] as { type: string; text: string }).text.trim());
  let retryParsed: OrgDrafterOutput;
  try {
    retryParsed = OrgDrafterOutputSchema.parse(JSON.parse(retryRaw));
  } catch {
    // Retry parse failed — use original, flag it
    return {
      ...result,
      output: {
        ...result.output,
        personalization_note: `[Over word limit: ${wordCount}w] ${result.output.personalization_note}`,
      },
    };
  }

  const retryWordCount = retryParsed.body.trim().split(/\s+/).length;
  if (retryWordCount > 145) {
    // Retry also over limit — accept but flag
    return {
      ...result,
      output: {
        ...result.output,
        personalization_note: `[Over word limit: ${wordCount}w] ${result.output.personalization_note}`,
      },
    };
  }

  // Retry succeeded — apply the same URL + sign-off checks to the retry output
  const pageUrl = input.page_url;
  const senderFirstName = input.sender_first_name;
  let urlAutoCorrect = result.url_auto_corrected;
  let signOffAutoCorrect = result.sign_off_auto_corrected;

  if (!retryParsed.body.includes(pageUrl)) {
    retryParsed = { ...retryParsed, body: injectUrl(retryParsed.body, pageUrl, senderFirstName) };
    urlAutoCorrect = true;
  }
  if (!bodyHasSignOff(retryParsed.body, senderFirstName)) {
    retryParsed = { ...retryParsed, body: injectSignOff(retryParsed.body, senderFirstName) };
    signOffAutoCorrect = true;
  }
  if (urlAutoCorrect || signOffAutoCorrect) {
    retryParsed = {
      ...retryParsed,
      personalization_note: buildNote(retryParsed.personalization_note, urlAutoCorrect, signOffAutoCorrect),
    };
  }

  return { output: retryParsed, url_auto_corrected: urlAutoCorrect, sign_off_auto_corrected: signOffAutoCorrect };
}

// Exported for test scripts — takes OrgDrafterInput directly, bypasses DB
export async function draftOrgPitchFromInput(
  input: OrgDrafterInput,
  orgId: string,
  abVariant: "A" | "B" | null = null
): Promise<OrgDraftResult> {
  return callOrgDrafterWithWordCheck(input, orgId, abVariant);
}

// ─── HIGH-LEVEL PIPELINE ENTRY ────────────────────────────────────────────────

export async function draftOrgPitch(
  orgId: string,
  pageUrl: string,
  pageType: "state" | "hub",
  stateAbbreviation: string | null,
  abVariant: "A" | "B" = "A"
): Promise<OutreachOrgPitchModel> {
  const org = await prisma.outreachOrganization.findUniqueOrThrow({ where: { id: orgId } });

  if (org.status !== "active") {
    throw new Error(`Org ${orgId} is not active (status: ${org.status})`);
  }
  const eligibleStatuses = ["enriched", "enriched_partial", "manual"];
  if (!eligibleStatuses.includes(org.enrichment_status)) {
    throw new Error(`Org ${orgId} enrichment_status '${org.enrichment_status}' is not eligible for drafting`);
  }

  // Duplicate guard
  const existing = await prisma.outreachOrgPitch.findFirst({
    where: { organization_id: orgId, page_url: pageUrl },
  });
  if (existing) {
    throw new Error(`already pitched: orgId=${orgId}, pageUrl=${pageUrl}`);
  }

  const stateInfo = stateAbbreviation ? getStateContentByAbbr(stateAbbreviation) : null;
  const state_name = stateInfo?.name ?? null;

  const senderFirstName = process.env.OUTREACH_SENDER_FIRST_NAME || "Mike";

  // Fetch state-level PFAS stats for stat-specific subject lines
  let page_stats: { utilities_tested: number; utilities_above_mcl: number } | undefined;
  if (pageType === "state" && stateInfo?.slug) {
    try {
      const { getStatePfasSummary } = await import("@/lib/data/pfas-state");
      const summary = await getStatePfasSummary(stateInfo.slug);
      if (summary && summary.utilities_tested > 0) {
        page_stats = {
          utilities_tested: summary.utilities_tested,
          utilities_above_mcl: summary.utilities_above_any_mcl,
        };
      }
    } catch {
      // Non-fatal — subject line falls back to generic
    }
  }

  const input: OrgDrafterInput = {
    organization_name: org.name,
    organization_type: org.organization_type ?? "other",
    contact_name: extractFirstName(org.contact_name),
    focus_areas: org.focus_areas,
    states_served: org.states_served,
    is_national: org.is_national,
    page_url: pageUrl,
    page_type: pageType === "hub" ? "hub" : "state_pfas",
    state_name: state_name ?? undefined,
    state_abbreviation: stateAbbreviation ?? undefined,
    sender_first_name: senderFirstName,
    page_stats,
  };

  const { output } = await callOrgDrafterWithWordCheck(input, orgId, abVariant);

  const pitch = await prisma.outreachOrgPitch.create({
    data: {
      organization_id: orgId,
      page_url: pageUrl,
      page_type: pageType,
      state_abbreviation: stateAbbreviation,
      state_name,
      subject: output.subject,
      body: output.body,
      personalization_note: output.personalization_note,
      status: "draft",
      ab_variant: abVariant,
    },
  });

  return pitch as unknown as OutreachOrgPitchModel;
}
