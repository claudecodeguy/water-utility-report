import { prisma } from "@/lib/prisma";
import type { OutreachJournalist } from "./types";

const ENVIRONMENT_BEATS = [
  "environment",
  "health",
  "investigative",
  "public health",
  "consumer",
  "watchdog",
];

const WATER_TOPICS = [
  "water",
  "epa",
  "pfas",
  "lead",
  "drinking water",
  "contamination",
  "pollution",
];

export async function matchJournalists(
  storyId: string,
  limit = 3
): Promise<OutreachJournalist[]> {
  const story = await prisma.outreachStory.findUnique({
    where: { id: storyId },
    include: { signal: true },
  });

  if (!story) throw new Error(`Story not found: ${storyId}`);

  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const stateFilter =
    story.target_outlet_tier === "national"
      ? {}
      : {
          OR: [
            { state: story.signal.state },
            { state: null },
          ],
        };

  const candidates = await prisma.outreachJournalist.findMany({
    where: {
      status: "active",
      OR: [
        { last_contacted_at: null },
        { last_contacted_at: { lt: cutoff } },
      ],
      // Exclude journalists who already have an unsent pitch — prevents all
      // stories in a single pipeline run routing to the same top-scorer.
      pitches: {
        none: {
          status: { in: ["draft", "approved"] },
        },
      },
      ...stateFilter,
    },
  });

  const scored = candidates.map((j) => {
    let score = 0;

    // Beat match
    if (j.beat) {
      const beatLower = j.beat.toLowerCase();
      if (ENVIRONMENT_BEATS.some((b) => beatLower.includes(b))) score += 10;
    }

    // Topic overlap
    const topicsLower = (j.recent_topics ?? []).map((t) => t.toLowerCase());
    if (WATER_TOPICS.some((t) => topicsLower.some((rt) => rt.includes(t)))) score += 5;

    // Pickup count
    score += 3 * Math.log(1 + j.pickup_count);

    // Domain authority
    score += 1 * Math.log(1 + (j.outlet_da ?? 0));

    return { journalist: j, score };
  });

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.journalist) as OutreachJournalist[];
}
