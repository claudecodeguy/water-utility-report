import { requireCronSecret } from "@/lib/outreach/auth";
import { checkOrgBacklinks } from "@/lib/outreach/backlink-checker";

export async function POST(request: Request) {
  if (!requireCronSecret(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const counts = await checkOrgBacklinks();
    return Response.json({ ok: true, ...counts });
  } catch (error) {
    console.error("[org-check-backlinks] error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
