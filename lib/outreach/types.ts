import { z } from "zod";
import type {
  OutreachSignalModel,
  OutreachStoryModel,
  OutreachJournalistModel,
  OutreachPitchModel,
} from "../generated/prisma/models";

export type OutreachSignal = OutreachSignalModel;
export type OutreachStory = OutreachStoryModel;
export type OutreachJournalist = OutreachJournalistModel;
export type OutreachPitch = OutreachPitchModel;

// ─── SCORER ────────────────────────────────────────────────────────────────────

export const ScorerOutputSchema = z.object({
  score: z.number().int().min(0).max(100),
  verdict: z.enum(["pitch", "skip", "watchlist"]),
  primary_angle: z.string(),
  headline_suggestion: z.string(),
  key_stat: z.string(),
  population_affected: z.number().int(),
  target_outlet_tier: z.enum(["national", "state", "metro", "local"]),
  comparable_context: z.string(),
  reasoning: z.string(),
});

export type ScorerOutput = z.infer<typeof ScorerOutputSchema>;

// ─── DRAFTER ───────────────────────────────────────────────────────────────────

export const DrafterOutputSchema = z.object({
  subject: z.string().min(5).max(120),
  body: z.string().min(50).max(2000),
  personalization_note: z.string(),
});

export type DrafterOutput = z.infer<typeof DrafterOutputSchema>;

// ─── REPLY CLASSIFIER ──────────────────────────────────────────────────────────

export const ReplyClassifierOutputSchema = z.object({
  sentiment: z.enum(["positive", "neutral", "negative", "unsubscribe"]),
  reasoning: z.string(),
});

export type ReplyClassifierOutput = z.infer<typeof ReplyClassifierOutputSchema>;

// ─── SIGNAL INPUT ──────────────────────────────────────────────────────────────

export const SignalInputSchema = z.object({
  signal_type: z.enum([
    "violation",
    "pfas_detection",
    "contaminant_exceedance",
    "news_event",
  ]),
  pwsid: z.string().optional(),
  utility_id: z.string().optional(),
  state: z.string(),
  city: z.string().optional(),
  contaminant: z.string().optional(),
  measured_value: z.number().optional(),
  threshold: z.number().optional(),
  units: z.string().optional(),
  population_served: z.number().int().optional(),
  raw_data: z.record(z.string(), z.unknown()),
  source_url: z.string().url().optional(),
});

export type SignalInput = z.infer<typeof SignalInputSchema>;
