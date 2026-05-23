import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

export async function sendOrgPitch(
  pitchId: string,
  approverIdentifier: string
): Promise<{ messageId: string }> {
  const pitch = await prisma.outreachOrgPitch.findUnique({
    where: { id: pitchId },
    include: { organization: true },
  });

  if (!pitch) throw new Error(`Org pitch not found: ${pitchId}`);

  if (!["draft", "approved"].includes(pitch.status)) {
    throw new Error(`Pitch ${pitchId} has status '${pitch.status}' — cannot send`);
  }
  if (pitch.organization.status !== "active") {
    throw new Error(`Organization ${pitch.organization.id} is not active (status: ${pitch.organization.status})`);
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
      to: pitch.organization.email,
      ...(replyTo ? { replyTo } : {}),
      subject: pitch.subject,
      text: pitch.body,
      tags: [
        { name: "pitch_type", value: "org" },
        { name: "pitch_id", value: pitchId },
        { name: "organization_id", value: pitch.organization_id },
      ],
    });

    if (result.error) {
      const isPermanent =
        result.error.name === "validation_error" ||
        result.error.name === "invalid_api_key";

      if (isPermanent) {
        await prisma.outreachOrgPitch.update({
          where: { id: pitchId },
          data: { status: "bounced" },
        });
      }

      console.error("[org-sender] Resend error:", result.error);
      throw new Error(`Resend error: ${result.error.message}`);
    }

    messageId = result.data!.id;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith("Resend error:")) throw err;
    console.error("[org-sender] unexpected error:", err);
    throw err;
  }

  const now = new Date();

  await prisma.$transaction([
    prisma.outreachOrgPitch.update({
      where: { id: pitchId },
      data: {
        status: "sent",
        sent_at: now,
        approved_at: now,
        approved_by: approverIdentifier,
      },
    }),
    prisma.outreachOrganization.update({
      where: { id: pitch.organization_id },
      data: {
        last_contacted_at: now,
        contacted_count: { increment: 1 },
      },
    }),
  ]);

  return { messageId };
}
