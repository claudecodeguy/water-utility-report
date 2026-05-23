import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { anthropic, MODELS } from "@/lib/outreach/anthropic";
import { REPLY_CLASSIFIER_PROMPT } from "@/lib/outreach/prompts";
import { ReplyClassifierOutputSchema } from "@/lib/outreach/types";

const ReplyBodySchema = z.object({
  from_email: z.string().email(),
  subject: z.string().optional(),
  body: z.string(),
  in_reply_to: z.string().optional(),
  references: z.string().optional(),
});

export async function POST(request: Request) {
  const secret = process.env.REPLY_WEBHOOK_SECRET;
  if (!secret) {
    return new Response("REPLY_WEBHOOK_SECRET not configured", { status: 500 });
  }

  const provided = request.headers.get("x-reply-webhook-secret");
  if (provided !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = ReplyBodySchema.safeParse(raw);
  if (!parsed.success) {
    return new Response("Invalid payload", { status: 400 });
  }
  const { from_email, body, in_reply_to, references } = parsed.data;

  // ── 1. Identify the pitch ────────────────────────────────────────────────────

  let pitchId: string | null = null;

  // Try message-id match via in_reply_to / references
  // (We don't store Resend message-ids yet, so this is future-proofing.)
  // The IDs look like <resend-msg-id@resend.dev> — strip angle brackets
  const referencedIds = [in_reply_to, references]
    .filter(Boolean)
    .flatMap((s) => s!.split(/\s+/))
    .map((id) => id.replace(/^<|>$/g, "").trim())
    .filter(Boolean);

  if (referencedIds.length > 0) {
    // Future: query a message_id column once we start storing it
    // For now, fall through to email match
  }

  if (!pitchId) {
    // Fallback: journalist email + most recent sent pitch within 14 days
    const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    const journalist = await prisma.outreachJournalist.findUnique({
      where: { email: from_email.toLowerCase() },
    });

    if (journalist) {
      const pitch = await prisma.outreachPitch.findFirst({
        where: {
          journalist_id: journalist.id,
          status: "sent",
          sent_at: { gte: cutoff },
        },
        orderBy: { sent_at: "desc" },
      });
      if (pitch) pitchId = pitch.id;
    }
  }

  if (!pitchId) {
    console.log(`[webhook/reply] no pitch match for ${from_email} — logging and ignoring`);
    return Response.json({ ok: true, matched: false });
  }

  // ── 2. Update pitch + journalist ─────────────────────────────────────────────
  const pitch = await prisma.outreachPitch.update({
    where: { id: pitchId },
    data: {
      status: "replied",
      replied_at: new Date(),
      reply_text: body,
    },
    include: { journalist: true },
  });

  await prisma.outreachJournalist.update({
    where: { id: pitch.journalist_id },
    data: { reply_count: { increment: 1 } },
  });

  // ── 3. Classify sentiment ────────────────────────────────────────────────────
  try {
    const response = await anthropic.messages.create({
      model: MODELS.classifier,
      max_tokens: 256,
      system: REPLY_CLASSIFIER_PROMPT,
      messages: [{ role: "user", content: body }],
    });

    const rawText = (response.content[0] as { type: string; text: string }).text;
    const cleaned = rawText
      .replace(/^```(?:json)?\n?/m, "")
      .replace(/\n?```$/m, "")
      .trim();

    const classification = ReplyClassifierOutputSchema.parse(JSON.parse(cleaned));

    await prisma.outreachPitch.update({
      where: { id: pitchId },
      data: { reply_sentiment: classification.sentiment },
    });

    if (classification.sentiment === "unsubscribe") {
      await prisma.outreachJournalist.update({
        where: { id: pitch.journalist_id },
        data: { status: "unsubscribed" },
      });
      console.log(`[webhook/reply] journalist ${pitch.journalist_id} unsubscribed`);
    }
  } catch (err) {
    console.error("[webhook/reply] classifier error:", err);
    // Don't fail the whole webhook for a classifier error
  }

  return Response.json({ ok: true, matched: true, pitchId });
}
