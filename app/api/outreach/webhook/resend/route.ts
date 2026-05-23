import { Webhook } from "svix";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook/resend] RESEND_WEBHOOK_SECRET not set");
    return new Response("Webhook secret not configured", { status: 500 });
  }

  const svixId = request.headers.get("svix-id") ?? "";
  const svixTimestamp = request.headers.get("svix-timestamp") ?? "";
  const svixSignature = request.headers.get("svix-signature") ?? "";

  const rawBody = await request.text();

  let event: { type: string; data: { tags?: { name: string; value: string }[]; email_id?: string } };
  try {
    const wh = new Webhook(secret);
    event = wh.verify(rawBody, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as typeof event;
  } catch (err) {
    console.error("[webhook/resend] signature verification failed:", err);
    return new Response("Invalid signature", { status: 400 });
  }

  const tags: { name: string; value: string }[] = event.data.tags ?? [];
  const pitchId = tags.find((t) => t.name === "pitch_id")?.value;
  const journalistId = tags.find((t) => t.name === "journalist_id")?.value;

  try {
    if (event.type === "email.bounced") {
      if (pitchId) {
        await prisma.outreachPitch.update({
          where: { id: pitchId },
          data: { status: "bounced" },
        });
      }
      if (journalistId) {
        await prisma.outreachJournalist.update({
          where: { id: journalistId },
          data: { status: "bounced" },
        });
      }
      console.log(`[webhook/resend] bounced pitch=${pitchId} journalist=${journalistId}`);
    } else if (event.type === "email.complained") {
      if (journalistId) {
        await prisma.outreachJournalist.update({
          where: { id: journalistId },
          data: { status: "blacklisted" },
        });
      }
      console.log(`[webhook/resend] complaint — blacklisted journalist=${journalistId}`);
    } else if (event.type === "email.delivered") {
      console.log(`[webhook/resend] delivered pitch=${pitchId}`);
    }
  } catch (err) {
    console.error("[webhook/resend] DB update error:", err);
    // Still return 200 — we don't want Resend to retry endlessly on a DB blip
  }

  return new Response("ok", { status: 200 });
}
