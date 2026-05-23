"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function publishStateAction(stateId: string) {
  await prisma.utility.updateMany({
    where: { state_id: stateId, publish_status: { not: "published" } },
    data: { publish_status: "published", last_published_at: new Date() },
  });
  revalidatePath("/admin/states");
  revalidatePath("/admin");
}

export async function unpublishStateAction(stateId: string) {
  await prisma.utility.updateMany({
    where: { state_id: stateId, publish_status: "published" },
    data: { publish_status: "draft", last_published_at: null },
  });
  revalidatePath("/admin/states");
  revalidatePath("/admin");
}
