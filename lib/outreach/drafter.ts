import { prisma } from "@/lib/prisma";
import { anthropic, MODELS } from "./anthropic";
import { DRAFTER_PROMPT } from "./prompts";
import { DrafterOutputSchema } from "./types";
import type { OutreachPitch } from "./types";

export async function draftPitch(
  storyId: string,
  journalistId: string
): Promise<OutreachPitch> {
  const [story, journalist] = await Promise.all([
    prisma.outreachStory.findUnique({
      where: { id: storyId },
      include: {
        signal: {
          include: { utility: true },
        },
      },
    }),
    prisma.outreachJournalist.findUnique({ where: { id: journalistId } }),
  ]);

  if (!story) throw new Error(`Story not found: ${storyId}`);
  if (!journalist) throw new Error(`Journalist not found: ${journalistId}`);

  const signal = story.signal;

  const wurUrl =
    signal.signal_type === "pfas_detection" && signal.pwsid
      ? `https://waterutilityreport.com/pfas-watchlist/utility/${signal.pwsid}`
      : signal.utility?.slug
      ? `https://waterutilityreport.com/utilities/${signal.utility.slug}`
      : null;

  const input = {
    story: {
      primary_angle: story.primary_angle,
      key_stat: story.key_stat,
      headline_suggestion: story.headline_suggestion,
      comparable_context: story.comparable_context,
      population_affected: story.population_affected,
    },
    journalist: {
      name: journalist.name,
      outlet: journalist.outlet,
      beat: journalist.beat,
      state: journalist.state,
      recent_topics: journalist.recent_topics,
    },
    sender_first_name: process.env.OUTREACH_SENDER_NAME ?? "Mike",
    sources: {
      epa_url: signal.source_url,
      wur_url: wurUrl,
    },
    utility: {
      name: signal.utility?.name ?? null,
      city: signal.city,
      state: signal.state,
      contaminant: signal.contaminant,
      // All values pre-converted to ppt (ng/L) so Claude does no unit math.
      // DB stores µg/L; EPA MCL thresholds are in ppt. 1 µg/L = 1,000 ppt.
      measured_value_ppt:
        signal.measured_value != null
          ? Math.round(Number(signal.measured_value) * 1_000 * 10) / 10
          : null,
      threshold_ppt:
        signal.threshold != null ? Number(signal.threshold) : null,
      times_over_limit:
        signal.measured_value != null && signal.threshold != null
          ? Math.round((Number(signal.measured_value) * 1_000) / Number(signal.threshold) * 10) / 10
          : null,
    },
  };

  const response = await anthropic.messages.create({
    model: MODELS.drafter,
    max_tokens: 1024,
    system: DRAFTER_PROMPT,
    messages: [{ role: "user", content: JSON.stringify(input) }],
  });

  const rawText = (response.content[0] as { type: string; text: string }).text;
  const cleaned = rawText
    .replace(/^```(?:json)?\n?/m, "")
    .replace(/\n?```$/m, "")
    .trim();

  let parsed: ReturnType<typeof DrafterOutputSchema.parse>;
  try {
    parsed = DrafterOutputSchema.parse(JSON.parse(cleaned));
  } catch (err) {
    throw new Error(
      `DrafterOutput validation failed.\nRaw text: ${rawText}\nError: ${err}`
    );
  }

  const pitch = await prisma.outreachPitch.create({
    data: {
      story_id: storyId,
      journalist_id: journalistId,
      subject: parsed.subject,
      body: parsed.body,
      personalization_note: parsed.personalization_note,
      status: "draft",
    },
  });

  return pitch as OutreachPitch;
}
