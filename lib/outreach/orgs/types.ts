import { z } from "zod";
import type {
  OutreachOrganizationModel,
  OutreachOrgPitchModel,
} from "../../generated/prisma/models";

export type OutreachOrganization = OutreachOrganizationModel;
export type OutreachOrgPitch = OutreachOrgPitchModel;

// ─── DRAFTER OUTPUT ────────────────────────────────────────────────────────────

export const OrgDrafterOutputSchema = z.object({
  subject: z.string().min(5).max(120),
  body: z.string().min(50).max(2000),
  personalization_note: z.string(),
});

export type OrgDrafterOutput = z.infer<typeof OrgDrafterOutputSchema>;

// ─── ENRICHMENT OUTPUT ─────────────────────────────────────────────────────────

// enrichment_status values:
//   pending          — not yet processed
//   enriched         — full scrape + LLM enrichment succeeded
//   enriched_partial — all fetches failed; LLM used domain name + email domain only (lower confidence)
//   failed           — unrecoverable error (no website, API error, parse failure)
//   manual           — hand-curated; skip auto-enrichment

export const OrgEnrichmentOutputSchema = z.object({
  contact_name: z.string().nullable().optional(),
  organization_type: z.enum(["nonprofit", "extension", "health_dept", "research", "advocacy", "other"]).nullable().optional(),
  focus_areas: z.array(z.string()),
  recent_topics: z.array(z.string()),
  states_served: z.array(z.string()),
  is_national: z.boolean(),
  notes: z.string().nullable().optional(),
});

export type OrgEnrichmentOutput = z.infer<typeof OrgEnrichmentOutputSchema>;

// ─── DRAFTER INPUT ─────────────────────────────────────────────────────────────

export const OrgDrafterInputSchema = z.object({
  organization_name: z.string(),
  organization_type: z.string(),
  contact_name: z.string().optional(),
  focus_areas: z.array(z.string()),
  states_served: z.array(z.string()),
  is_national: z.boolean(),
  page_url: z.string().url(),
  page_type: z.enum(["state_pfas", "utility_pfas", "hub", "contaminant", "city"]),
  state_name: z.string().optional(),
  state_abbreviation: z.string().optional(),
  sender_first_name: z.string().min(1),
  page_stats: z.object({
    utilities_tested: z.number(),
    utilities_above_mcl: z.number(),
  }).optional(),
});

export type OrgDrafterInput = z.infer<typeof OrgDrafterInputSchema>;
