import { prisma } from "@/lib/prisma";

async function main() {
  const rows = await prisma.adminNotificationLog.findMany({ orderBy: { sent_at: "desc" }, take: 5 });
  console.log(JSON.stringify(rows, null, 2));
  await prisma.$disconnect();
}

main().catch(console.error);
