import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { normalizeName } from "@/lib/normalize-name";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  // Check if query looks like a PWSID (starts with 2 letters/digits + numbers)
  const isPwsid = /^[A-Z0-9]{2}\d{5,}/i.test(q);

  const utilities = await prisma.utility.findMany({
    where: {
      pfas_records: { some: { validated: true, suppressed: false } },
      ...(isPwsid
        ? { pwsid: { startsWith: q.toUpperCase() } }
        : {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { city_served: { contains: q, mode: "insensitive" } },
              { pwsid: { startsWith: q.toUpperCase() } },
            ],
          }),
    },
    select: {
      pwsid: true,
      name: true,
      slug: true,
      city_served: true,
      state: { select: { abbreviation: true } },
    },
    take: 8,
    orderBy: { population_served: "desc" },
  });

  const results = utilities.map((u) => ({
    pwsid: u.pwsid,
    name: normalizeName(u.name),
    city: u.city_served,
    state: u.state?.abbreviation ?? "",
    slug: u.slug,
  }));

  return NextResponse.json({ results });
}
