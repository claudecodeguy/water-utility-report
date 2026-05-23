import pLimit from "p-limit";
import { prisma } from "@/lib/prisma";
import { scoreAllNewSignals } from "./scorer";
import { matchJournalists } from "./matcher";
import { draftPitch } from "./drafter";

export async function runFullPipeline(): Promise<{
  scored: number;
  drafts_created: number;
  errors: number;
}> {
  const { scored, errors: scoreErrors } = await scoreAllNewSignals();

  const pitchableStories = await prisma.outreachStory.findMany({
    where: {
      verdict: "pitch",
      newsworthiness_score: { gte: 70 },
      pitches: { none: {} },
    },
    select: { id: true, signal_id: true },
  });

  // Sequential (limit=1) so each drafted pitch is visible to the next
  // iteration's matcher — prevents the same journalist from being matched
  // for multiple stories in one pipeline run.
  const limit = pLimit(1);
  let drafts_created = 0;
  let errors = scoreErrors;

  await Promise.all(
    pitchableStories.map((story) =>
      limit(async () => {
        try {
          const matches = await matchJournalists(story.id, 1);
          if (matches.length === 0) {
            console.log(`[orchestrator] no journalist match for story ${story.id} — skipping`);
            return;
          }

          const journalist = matches[0];
          await draftPitch(story.id, journalist.id);

          await prisma.outreachSignal.update({
            where: { id: story.signal_id },
            data: { status: "pitched" },
          });

          drafts_created++;
        } catch (err) {
          errors++;
          console.error(
            `[orchestrator] story ${story.id} failed:`,
            err instanceof Error ? err.message : err
          );
        }
      })
    )
  );

  return { scored, drafts_created, errors };
}
