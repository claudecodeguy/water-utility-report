import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import AdminOrgsTable from "@/components/admin-orgs-table";
import AdminOrgsImport from "@/components/admin-orgs-import";
import AdminOrgsEnrich from "@/components/admin-orgs-enrich";
import AdminOrgsAdd from "@/components/admin-orgs-add";
import AdminOrgsFilters from "@/components/admin-orgs-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Organizations — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function AdminOrgsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const sp = await searchParams;
  const type = sp.type ?? "";
  const enrichmentStatus = sp.enrichment_status ?? "";
  const state = sp.state ?? "";
  const status = sp.status ?? "";
  const search = sp.search ?? "";
  const offset = Number(sp.offset ?? "0");

  const cutoff30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const where: Record<string, unknown> = {};
  if (type) where.organization_type = type;
  if (enrichmentStatus) where.enrichment_status = enrichmentStatus;
  if (status) where.status = status;
  if (state === "national") { where.is_national = true; }
  else if (state) { where.states_served = { has: state.toUpperCase() }; }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }

  const [orgs, total, totalCount, pendingCount, activeCount, contactedRecent, agg] = await Promise.all([
    prisma.outreachOrganization.findMany({
      where,
      orderBy: { created_at: "desc" },
      take: PAGE_SIZE,
      skip: offset,
    }),
    prisma.outreachOrganization.count({ where }),
    prisma.outreachOrganization.count(),
    prisma.outreachOrganization.count({ where: { enrichment_status: "pending" } }),
    prisma.outreachOrganization.count({ where: { status: "active" } }),
    prisma.outreachOrganization.count({ where: { last_contacted_at: { gte: cutoff30d } } }),
    prisma.outreachOrganization.aggregate({
      _sum: { contacted_count: true, reply_count: true },
    }),
  ]);

  const totalContacted = agg._sum.contacted_count ?? 0;
  const totalReplies   = agg._sum.reply_count ?? 0;
  const replyRate      = totalContacted > 0
    ? `${((totalReplies / totalContacted) * 100).toFixed(1)}%`
    : "—";

  const stats = [
    { label: "Total orgs",       value: totalCount.toLocaleString(), highlight: false },
    { label: "Pending enrichment", value: pendingCount.toLocaleString(), highlight: pendingCount > 0 },
    { label: "Active",           value: activeCount.toLocaleString(), highlight: false },
    { label: "Contacted (30d)",  value: contactedRecent.toLocaleString(), highlight: false },
    { label: "Reply rate",       value: replyRate, highlight: false },
  ];

  const tableRows = orgs.map((o) => ({
    id: o.id,
    name: o.name,
    email: o.email,
    organization_type: o.organization_type,
    states_served: o.states_served,
    focus_areas: o.focus_areas,
    enrichment_status: o.enrichment_status,
    contacted_count: o.contacted_count,
    reply_count: o.reply_count,
    pickup_count: o.pickup_count,
    status: o.status,
    created_at: o.created_at.toISOString(),
  }));

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">Organizations</h1>
          <p className="text-sm text-muted-foreground">
            {totalCount.toLocaleString()} contacts · {activeCount} active
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <AdminOrgsEnrich pendingCount={pendingCount} />
          <AdminOrgsAdd />
          <AdminOrgsImport />
        </div>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {stats.map(({ label, value, highlight }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-2xl font-semibold tabular-nums ${highlight ? "text-amber-600" : "text-foreground"}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Suspense fallback={null}>
        <AdminOrgsFilters />
      </Suspense>

      {/* Table */}
      <AdminOrgsTable orgs={tableRows} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Showing {offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex gap-2">
            {currentPage > 0 && (
              <a
                href={`?${new URLSearchParams({ ...sp, offset: String((currentPage - 1) * PAGE_SIZE) })}`}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                ← Previous
              </a>
            )}
            {currentPage < totalPages - 1 && (
              <a
                href={`?${new URLSearchParams({ ...sp, offset: String((currentPage + 1) * PAGE_SIZE) })}`}
                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                Next →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
