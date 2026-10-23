import { unstable_cache } from "next/cache";
import { Prisma } from "./generated/prisma/client";
import { prisma } from "@/lib/prisma";

// Read-through cache for the public site.
//
// Every read (findMany, findUnique, count, groupBy, ...) made through this
// client is stored in Vercel's Data Cache, keyed by model + operation + args,
// for CACHE_SECONDS. The Data Cache is shared by every page and survives new
// deployments, so when a crawler triggers an ISR re-render (or a deploy resets
// the page cache), the page is rebuilt from cache instead of Postgres.
//
// Public pages import this as `prisma`. Admin pages, API routes, cron jobs and
// scripts keep using the plain client in lib/prisma.ts (always fresh).
//
// Data is EPA data refreshed by ingest scripts, so up to 7 days of staleness
// is acceptable. To force a refresh after an ingest, call revalidateTag("db").
const CACHE_SECONDS = 7 * 86400;

const READ_OPS = new Set([
  "findUnique",
  "findUniqueOrThrow",
  "findFirst",
  "findFirstOrThrow",
  "findMany",
  "count",
  "aggregate",
  "groupBy",
]);

// unstable_cache stores JSON, which would turn Date/Decimal into plain strings
// and break page code that calls date methods. Tag them so they round-trip.
function encode(v: unknown): unknown {
  if (v instanceof Date) return { __date: v.toISOString() };
  if (Prisma.Decimal.isDecimal(v)) return { __decimal: (v as Prisma.Decimal).toString() };
  if (Array.isArray(v)) return v.map(encode);
  if (v && typeof v === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(v)) out[k] = encode(val);
    return out;
  }
  return v;
}

function decode(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(decode);
  if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    const keys = Object.keys(o);
    if (keys.length === 1 && keys[0] === "__date") return new Date(o.__date as string);
    if (keys.length === 1 && keys[0] === "__decimal") return new Prisma.Decimal(o.__decimal as string);
    const out: Record<string, unknown> = {};
    for (const [k, val] of Object.entries(o)) out[k] = decode(val);
    return out;
  }
  return v;
}

const cachedRead = unstable_cache(
  async (model: string, operation: string, argsJson: string) => {
    const delegate = (prisma as unknown as Record<string, Record<string, (a: unknown) => Promise<unknown>>>)[
      model.charAt(0).toLowerCase() + model.slice(1)
    ];
    const result = await delegate[operation](argsJson ? JSON.parse(argsJson, reviveDates) : undefined);
    return encode(result);
  },
  ["prisma-read-v1"],
  { revalidate: CACHE_SECONDS, tags: ["db"] }
);

// Args are serialized to build the cache key; restore any Date values in them.
function reviveDates(_key: string, value: unknown) {
  if (value && typeof value === "object" && "__date" in (value as Record<string, unknown>)) {
    return new Date((value as { __date: string }).__date);
  }
  return value;
}

export const prismaCached = prisma.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        if (!READ_OPS.has(operation)) return query(args);
        const argsJson = args === undefined ? "" : JSON.stringify(encode(args));
        return decode(await cachedRead(model, operation, argsJson)) as Awaited<ReturnType<typeof query>>;
      },
    },
  },
});
