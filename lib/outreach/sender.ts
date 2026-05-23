import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export async function sendPitch(
  pitchId: string,
  approverIdentifier: string
): Promise<{ messageId: string }> {
  const pitch = await prisma.outreachPitch.findUnique({
    where: { id: pitchId },
    include: { journalist: true },
  });

  if (!pitch) throw new Error(`Pitch not found: ${pitchId}`);

  if (!["draft", "approved"].includes(pitch.status)) {
    throw new Error(`Pitch ${pitchId} has status '${pitch.status}' — cannot send`);
  }
  if (pitch.journalist.status !== "active") {
    throw new Error(`Journalist ${pitch.journalist.id} is not active (status: ${pitch.journalist.status})`);
  }

  const fromEmail = process.env.OUTREACH_FROM_EMAIL;
  const replyTo = process.env.OUTREACH_REPLY_TO;

  if (!fromEmail) throw new Error("OUTREACH_FROM_EMAIL is not set");
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");

  const resend = new Resend(process.env.RESEND_API_KEY);
  let messageId: string;

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: pitch.journalist.email,
      ...(replyTo ? { replyTo } : {}),
      subject: pitch.subject,
      text: pitch.body,
      tags: [
        { name: "pitch_id", value: pitchId },
        { name: "journalist_id", value: pitch.journalist_id },
      ],
    });

    if (result.error) {
      const isPermanent =
        result.error.name === "validation_error" ||
        result.error.name === "invalid_api_key";

      if (isPermanent) {
        await prisma.outreachPitch.update({
          where: { id: pitchId },
          data: { status: "bounced" },
        });
      }

      console.error("[sender] Resend error:", result.error);
      throw new Error(`Resend error: ${result.error.message}`);
    }

    messageId = result.data!.id;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Resend error:")) throw err;
    console.error("[sender] unexpected error:", err);
    throw err;
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.outreachPitch.update({
      where: { id: pitchId },
      data: {
        status: "sent",
        sent_at: now,
        approved_at: now,
        approved_by: approverIdentifier,
      },
    }),
    prisma.outreachJournalist.update({
      where: { id: pitch.journalist_id },
      data: {
        last_contacted_at: now,
        contacted_count: { increment: 1 },
      },
    }),
  ]);

  return { messageId };
}
