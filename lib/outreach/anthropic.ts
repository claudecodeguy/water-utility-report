import Anthropic from "@anthropic-ai/sdk";

export const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export const MODELS = {
  scorer: "claude-sonnet-4-6",
  drafter: "claude-sonnet-4-6",
  classifier: "claude-haiku-4-5-20251001",
} as const;
