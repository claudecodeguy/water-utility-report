import { prisma } from "@/lib/prisma";
import { draftOrgPitch } from "./drafter";
import { sendOrgPitch } from "./sender";
import stateContent from "@/lib/content/states";

// ─── STATE HELPERS ─────────────────────────────────────────────────────────────

const STATE_POPULATION: Record<string, number> = Object.fromEntries(
  stateContent.map((s) => [s.abbreviation, s.populationServed])
);

const STATE_SLUG: Record<string, string> = Object.fromEntries(
  stateContent.map((s) => [s.abbreviation, s.slug])
);

function statePageUrl(abbr: string): string | null {
  const slug = STATE_SLUG[abbr];
  return slug ? `https://waterutilityreport.com/data/pfas/${slug}` : null;
}

const HUB_URL = "https://waterutilityreport.com/data/pfas";

// ─── SCORING ──────────────────────────────────────────────────────────────────

function scoreCandidate(org: {
  focus_areas: string[];
  recent_topics: string[];
  organization_type: string | null;
  enrichment_status: string;
  contacted_count: number;
}): number {
  let score = 0;
  const waterTerms = /water|environment|public health|drinking water|pfas/i;

  if (org.focus_areas.some((f) => waterTerms.test(f))) score += 5;
  if (org.recent_topics.some((t) => /pfas|drinking water|water quality|contamination/i.test(t))) score += 3;
  if (org.organization_type === "nonprofit") score += 2;
  if (org.organization_type === "extension") score += 1;
  if (org.organization_type === "health_dept") score += 1;
  if (org.contacted_count === 0) score += 0.5;
  if (org.enrichment_status === "enriched_partial") score -= 2;

  return score;
}

// ─── ORCHESTRATOR ─────────────────────────────────────────────────────────────

export async function runOrgPipeline(): Promise<{
  drafts_created: number;
  sent: number;
  errors: number;
  skipped: number;
  daily_budget_used: number;
}> {
  const dailyLimit = parseInt(process.env.OUTREACH_ORG_DAILY_LIMIT || "30", 10);

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const sentToday = await prisma.outreachOrgPitch.count({
    where: { status: "sent", sent_at: { gte: todayStart } },
  });

  let sendBudget = dailyLimit - sentToday;

  // ── Step 1: Auto-send approved pitches (up to send budget) ────────────────
  let sent = 0;
  let sendErrors = 0;

  if (sendBudget > 0) {
    const approvedPitches = await prisma.outreachOrgPitch.findMany({
      where: { status: "approved" },
      orderBy: { approved_at: "asc" },
      take: sendBudget,
      select: { id: true },
    });

    const pLimit = (await import("p-limit")).default;
    const limit2 = pLimit(2);

    await Promise.all(
      approvedPitches.map((p) =>
        limit2(async () => {
          try {
            await sendOrgPitch(p.id, "cron");
            sent++;
          } catch (err) {
            sendErrors++;
            console.error(`[org-orchestrator] send error pitch=${p.id}:`, err);
          }
        })
      )
    );

    sendBudget -= sent;
  }

  // ── Step 2: Draft new pitches for remaining budget ─────────────────────────
  const alreadyInPipeline = sentToday + sent + (await prisma.outreachOrgPitch.count({
    where: { status: { in: ["draft", "approved"] } },
  }));

  const targetDrafts = Math.max(0, dailyLimit - alreadyInPipeline);
  if (targetDrafts <= 0) {
    return { drafts_created: 0, sent, errors: sendErrors, skipped: 0, daily_budget_used: alreadyInPipeline };
  }

  // ── Load eligible orgs ─────────────────────────────────────────────────────
  const cutoff90d = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

  const orgs = await prisma.outreachOrganization.findMany({
    where: {
      status: "active",
      enrichment_status: { in: ["enriched", "enriched_partial", "manual"] },
      OR: [
        { last_contacted_at: null },
        { last_contacted_at: { lt: cutoff90d } },
      ],
    },
    select: {
      id: true,
      name: true,
      focus_areas: true,
      recent_topics: true,
      organization_type: true,
      enrichment_status: true,
      contacted_count: true,
      is_national: true,
      states_served: true,
    },
  });

  // Pre-load existing (org, page_url) pairs to avoid DB round-trips per candidate
  const existingPitches = await prisma.outreachOrgPitch.findMany({
    where: { organization_id: { in: orgs.map((o) => o.id) } },
    select: { organization_id: true, page_url: true },
  });
  const pitchedSet = new Set(
    existingPitches.map((p) => `${p.organization_id}::${p.page_url}`)
  );

  // ── Build candidate pairs ──────────────────────────────────────────────────
  type Candidate = {
    orgId: string;
    pageUrl: string;
    pageType: "state" | "hub";
    stateAbbr: string | null;
    score: number;
  };

  const candidates: Candidate[] = [];
  const seenOrgsInBatch = new Set<string>();

  for (const org of orgs) {
    const baseScore = scoreCandidate(org);
    const orgCandidates: Omit<Candidate, "score">[] = [];

    if (org.is_national) {
      orgCandidates.push({ orgId: org.id, pageUrl: HUB_URL, pageType: "hub", stateAbbr: null });
    } else if (org.states_served.length === 0) {
      continue; // no page to pitch
    } else {
      const states =
        org.states_served.length <= 3
          ? org.states_served
          : [...org.states_served]
              .sort((a, b) => (STATE_POPULATION[b] ?? 0) - (STATE_POPULATION[a] ?? 0))
              .slice(0, 3);

      for (const abbr of states) {
        const url = statePageUrl(abbr);
        if (!url) continue;
        orgCandidates.push({ orgId: org.id, pageUrl: url, pageType: "state", stateAbbr: abbr });
      }
    }

    for (const c of orgCandidates) {
      if (pitchedSet.has(`${c.orgId}::${c.pageUrl}`)) continue;
      candidates.push({ ...c, score: baseScore });
    }
  }

  // Sort by score descending; dedupe so only one candidate per org enters the queue today
  candidates.sort((a, b) => b.score - a.score);

  const dedupedCandidates: Candidate[] = [];
  for (const c of candidates) {
    if (seenOrgsInBatch.has(c.orgId)) continue;
    seenOrgsInBatch.add(c.orgId);
    dedupedCandidates.push(c);
  }

  // ── Cohort-balanced selection ──────────────────────────────────────────────
  // Group candidates by org cohort (organization_type), then round-robin fill
  // the queue so each cohort gets an equal share of draft slots.
  const orgTypes = await prisma.outreachOrganization.findMany({
    where: { id: { in: dedupedCandidates.map((c) => c.orgId) } },
    select: { id: true, organization_type: true },
  });
  const typeByOrg = new Map(orgTypes.map((o) => [o.id, o.organization_type ?? "other"]));

  const byType: Map<string, Candidate[]> = new Map();
  for (const c of dedupedCandidates) {
    const t = typeByOrg.get(c.orgId) ?? "other";
    if (!byType.has(t)) byType.set(t, []);
    byType.get(t)!.push(c);
  }

  // Round-robin across cohorts until we hit targetDrafts
  const queue: Candidate[] = [];
  const typeQueues = Array.from(byType.values());
  const indices = typeQueues.map(() => 0);
  let round = 0;
  while (queue.length < targetDrafts) {
    let added = false;
    for (let i = 0; i < typeQueues.length; i++) {
      if (queue.length >= targetDrafts) break;
      const tq = typeQueues[i];
      if (indices[i] < tq.length) {
        queue.push(tq[indices[i]]);
        indices[i]++;
        added = true;
      }
    }
    if (!added) break; // all cohorts exhausted
    round++;
    void round; // suppress unused warning
  }

  // ── Generate drafts ────────────────────────────────────────────────────────
  const pLimit = (await import("p-limit")).default;
  const limit3 = pLimit(3);

  let drafts_created = 0;
  let errors = 0;
  let skipped = 0;

  await Promise.all(
    queue.map((c) =>
      limit3(async () => {
        try {
          await draftOrgPitch(c.orgId, c.pageUrl, c.pageType, c.stateAbbr);
          drafts_created++;
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.startsWith("already pitched:")) {
            skipped++;
            console.log(`[org-orchestrator] skipped: ${msg}`);
          } else {
            errors++;
            console.error(`[org-orchestrator] error drafting org=${c.orgId} page=${c.pageUrl}:`, msg);
          }
        }
      })
    )
  );

  return {
    drafts_created,
    sent,
    errors: errors + sendErrors,
    skipped,
    daily_budget_used: drafts_created + alreadyInPipeline,
  };
}
