import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

// Shared, long-lived data cache for heavy public reads.
//
// Why: page-level ISR caches HTML per URL, but every distinct URL (thousands
// of city/state pages) still runs its own queries on first render and on each
// revalidation. Several of those queries pull the same large per-state lists.
// unstable_cache stores the result in Vercel's Data Cache (shared across
// every page and every deployment), so Postgres is hit once per key per day
// instead of once per page render. This is what keeps Supabase egress down.
const DAY = 86400;

export type StateCityIndexRow = {
  id: string;
  name: string;
  slug: string;
  pwsid: string;
  risk_level: string;
  population_served: number;
  city_served: string;
  state: { name: string; slug: string; abbreviation: string };
};

// All published utilities in a state that have a city_served value,
// largest population first. Used by every /cities/[city] page in that state.
export const getStateCityIndex = unstable_cache(
  async (stateAbbr: string): Promise<StateCityIndexRow[]> => {
    const rows = await prisma.utility.findMany({
      where: {
        state: { abbreviation: stateAbbr },
        city_served: { not: null },
        publish_status: "published",
      },
      select: {
        id: true, name: true, slug: true, pwsid: true,
        risk_level: true, population_served: true, city_served: true,
        state: { select: { name: true, slug: true, abbreviation: true } },
      },
      orderBy: { population_served: "desc" },
    });
    return rows.map((r) => ({ ...r, risk_level: String(r.risk_level), city_served: r.city_served! }));
  },
  ["state-city-index-v1"],
  { revalidate: DAY, tags: ["db", "state-city-index"] }
);
