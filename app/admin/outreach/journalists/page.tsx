import { prisma } from "@/lib/prisma";
import AdminJournalistsTable from "@/components/admin-journalists-table";
import AdminJournalistsImport from "@/components/admin-journalists-import";
import AdminJournalistsDiscover from "@/components/admin-journalists-discover";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Journalists — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminJournalistsPage() {
  const cutoff30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [journalists, activeCount, contactedRecent, agg] = await Promise.all([
    prisma.outreachJournalist.findMany({ orderBy: { name: "asc" } }),
    prisma.outreachJournalist.count({ where: { status: "active" } }),
    prisma.outreachJournalist.count({ where: { last_contacted_at: { gte: cutoff30d } } }),
    prisma.outreachJournalist.aggregate({
      _sum: { pickup_count: true, contacted_count: true },
    }),
  ]);

  const totalContacted = agg._sum.contacted_count ?? 0;
  const totalPickups   = agg._sum.pickup_count ?? 0;
  const pickupRate     = totalContacted > 0
    ? `${((totalPickups / totalContacted) * 100).toFixed(1)}%`
    : "—";

  const tableRows = journalists.map((j) => ({
    id: j.id,
    name: j.name,
    email: j.email,
    outlet: j.outlet,
    state: j.state,
    beat: j.beat,
    status: j.status,
    contacted_count: j.contacted_count,
    reply_count: j.reply_count,
    pickup_count: j.pickup_count,
    last_contacted_at: j.last_contacted_at?.toISOString() ?? null,
  }));

  const stats = [
    { label: "Total",          value: journalists.length.toLocaleString() },
    { label: "Active",         value: activeCount.toLocaleString() },
    { label: "Contacted (30d)",value: contactedRecent.toLocaleString() },
    { label: "Pickup rate",    value: pickupRate },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">Journalists</h1>
          <p className="text-sm text-muted-foreground">
            {journalists.length.toLocaleString()} contacts · {activeCount} active
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <AdminJournalistsDiscover />
          <AdminJournalistsImport />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl font-semibold tabular-nums text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <AdminJournalistsTable journalists={tableRows} />
    </div>
  );
}
