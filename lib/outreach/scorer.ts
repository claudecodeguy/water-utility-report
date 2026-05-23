import pLimit from "p-limit";
import { prisma } from "@/lib/prisma";
import { anthropic, MODELS } from "./anthropic";
import { SCORER_PROMPT } from "./prompts";
import { ScorerOutputSchema } from "./types";
import type { OutreachStory } from "./types";

export async function scoreSignal(signalId: string): Promise<OutreachStory> {
  const signal = await prisma.outreachSignal.findUnique({
    where: { id: signalId },
    include: {
      utility: { include: { state: true } },
      story: true,
    },
  });

  if (!signal) throw new Error(`Signal not found: ${signalId}`);
  if (signal.status !== "new") {
    if (signal.story) return signal.story as OutreachStory;
    throw new Error(`Signal ${signalId} has status '${signal.status}' but no story`);
  }

  const input = {
    signal_type: signal.signal_type,
    contaminant: signal.contaminant,
    measured_value: signal.measured_value != null ? Number(signal.measured_value) : null,
    threshold: signal.threshold != null ? Number(signal.threshold) : null,
    units: signal.units,
    utility_name: signal.utility?.name ?? null,
    city: signal.city ?? signal.utility?.city_served ?? null,
    state: signal.utility?.state?.name ?? signal.state,
    state_abbreviation: signal.utility?.state?.abbreviation ?? signal.state,
    population_served: signal.population_served ?? signal.utility?.population_served ?? null,
    source_url: signal.source_url,
    detected_at: signal.detected_at,
    pwsid: signal.pwsid,
  };

  const response = await anthropic.messages.create({
    model: MODELS.scorer,
    max_tokens: 1024,
    system: SCORER_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(input) }],
  });

  const rawText = (response.content[0] as { type: string; text: string }).text;
  const cleaned = rawText.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();

  let parsed: ReturnType<typeof ScorerOutputSchema.parse>;
  try {
    parsed = ScorerOutputSchema.parse(JSON.parse(cleaned));
  } catch (err) {
    throw new Error(`ScorerOutput validation failed.\nRaw text: ${rawText}\nError: ${err}`);
  }

  const story = await prisma.outreachStory.create({
    data: {
      signal_id: signalId,
      newsworthiness_score: parsed.score,
      verdict: parsed.verdict,
      primary_angle: parsed.primary_angle,
      headline_suggestion: parsed.headline_suggestion,
      key_stat: parsed.key_stat,
      population_affected: parsed.population_affected,
      target_outlet_tier: parsed.target_outlet_tier,
      comparable_context: parsed.comparable_context,
      reasoning: parsed.reasoning,
    },
  });

  const newStatus =
    parsed.verdict === "skip" ? "skipped" : "scored";

  await prisma.outreachSignal.update({
    where: { id: signalId },
    data: { status: newStatus },
  });

  return story as OutreachStory;
}

export async function scoreAllNewSignals(
  batchLimit = 50
): Promise<{ scored: number; skipped: number; errors: number }> {
  const signals = await prisma.outreachSignal.findMany({
    where: { status: "new" },
    orderBy: { detected_at: "asc" },
    take: batchLimit,
    select: { id: true },
  });

  const limit = pLimit(3);
  let scored = 0;
  let skipped = 0;
  let errors = 0;

  await Promise.all(
    signals.map((s) =>
      limit(async () => {
        try {
          const story = await scoreSignal(s.id);
          if ((story as { verdict?: string }).verdict === "skip") {
            skipped++;
          } else {
            scored++;
          }
        } catch (err) {
          errors++;
          console.error(`[scorer] signal ${s.id} failed:`, err instanceof Error ? err.message : err);
        }
      })
    )
  );

  return { scored, skipped, errors };
}
