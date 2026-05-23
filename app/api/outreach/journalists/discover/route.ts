import { requireAdmin } from "@/lib/outreach/auth";
import { discoverJournalists, OUTLETS_BY_STATE } from "@/lib/outreach/journalist-finder";

export async function POST(request: Request) {
  if (!requireAdmin(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: { domains?: { domain: string; name: string; state: string | null }[] } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // If no domains specified, reject — require explicit selection
  if (!body.domains?.length) {
    return Response.json({ ok: false, error: "No outlets selected" }, { status: 400 });
  }

  // Validate domains are from our known list
  const allKnown = new Set(
    Object.values(OUTLETS_BY_STATE).flatMap((outlets) => outlets.map((o) => o.domain))
  );
  const unknown = body.domains.filter((d) => !allKnown.has(d.domain));
  if (unknown.length > 0) {
    return Response.json({
      ok: false,
      error: `Unknown domains: ${unknown.map((d) => d.domain).join(", ")}`,
    }, { status: 400 });
  }

  try {
    const result = await discoverJournalists(body.domains);
    return Response.json({ ok: true, ...result });
  } catch (error) {
    console.error("[journalists/discover] error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// GET: return the full outlet registry so the client can render the selector
export async function GET() {
  return Response.json({ ok: true, outlets: OUTLETS_BY_STATE });
}
