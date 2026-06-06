import { prisma } from "@/lib/prisma";

async function main() {
  const [approved, draft, sent] = await Promise.all([
    prisma.outreachOrgPitch.count({ where: { status: "approved" } }),
    prisma.outreachOrgPitch.count({ where: { status: "draft" } }),
    prisma.outreachOrgPitch.count({ where: { status: "sent" } }),
  ]);
  const contacts = await prisma.outreachOrganization.findMany({
    where: { status: "active", contact_name: { not: null } },
    select: { contact_name: true },
    take: 40,
  });
  console.log(JSON.stringify({
    approved, draft, sent,
    sample_contacts: contacts.map((c) => c.contact_name),
  }, null, 2));
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
