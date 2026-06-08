import { requireCronSecret } from "@/lib/outreach/auth";
import { detectNewSignals } from "@/lib/outreach/detector";

export async function GET(request: Request) { return POST(request); }

export async function POST(request: Request) {
  if (!requireCronSecret(request)) {
    return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  if (process.env.OUTREACH_ENABLED !== "true") {
    return Response.json({ ok: false, error: "Outreach pipeline disabled" }, { status: 503 });
  }

  // Optional override for seeding/testing — ignored in normal cron runs
  let lookbackHours = 24;
  try {
    const body = await request.json().catch(() => ({}));
    if (typeof body?.lookbackHours === "number") {
      lookbackHours = Math.min(body.lookbackHours, 8760); // cap at 1 year
    }
  } catch {
    // non-JSON body is fine; use default
  }

  try {
    const { inserted, signals } = await detectNewSignals(lookbackHours);
    return Response.json({
      ok: true,
      inserted,
      lookbackHours,
      sample: signals.slice(0, 5),
    });
  } catch (error) {
    console.error("[outreach/detect] error:", error);
    return Response.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
