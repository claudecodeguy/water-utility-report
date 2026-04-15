import Link from "next/link";
import {
  Building2,
  FlaskConical,
  Wrench,
  MapPin,
  ArrowRight,
  Activity,
  TrendingUp,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import contaminants from "@/lib/content/contaminants";
import treatmentMethods from "@/lib/content/treatments";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — Water Utility Report",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const riskColors: Record<string, string> = {
  safe:     "text-wur-safe",
  low:      "text-emerald-600",
  moderate: "text-wur-caution",
  high:     "text-wur-warning",
  critical: "text-wur-danger",
};

export default async function AdminDashboard() {
  const states = await prisma.state.findMany({
    orderBy: { abbreviation: "asc" },
  });

  const stateStats = await Promise.all(
    states.map(async (s) => {
      const [total, published, violations] = await Promise.all([
        prisma.utility.count({ where: { state_id: s.id } }),
        prisma.utility.count({ where: { state_id: s.id, publish_status: "published" } }),
        prisma.violation.count({ where: { utility: { state_id: s.id } } }),
      ]);
      return { ...s, total, published, draft: total - published, violations };
    })
  );

  const [totalUtilities, totalPublished, totalViolations, lowConfidence] = await Promise.all([
    prisma.utility.count(),
    prisma.utility.count({ where: { publish_status: "published" } }),
    prisma.violation.count(),
    prisma.utility.count({ where: { confidence_score: { lt: 0.7 } } }),
  ]);

  const recentlyPublished = await prisma.utility.findMany({
    where: { publish_status: "published", last_published_at: { not: null } },
    orderBy: { last_published_at: "desc" },
    take: 5,
    include: { state: { select: { abbreviation: true } } },
  });

  const entityStats = [
    { label: "Utilities", icon: Building2, href: "/admin/utilities",
      published: totalPublished, draft: totalUtilities - totalPublished, total: totalUtilities },
    { label: "Contaminants", icon: FlaskConical, href: "/admin/contaminants",
      published: contaminants.length, draft: 0, total: contaminants.length },
    { label: "States", icon: MapPin, href: "/admin/states",
      published: states.length, draft: 0, total: states.length },
    { label: "Treatments", icon: Wrench, href: "/admin/treatments",
      published: treatmentMethods.length, draft: 0, total: treatmentMethods.length },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Content pipeline · {states.length} states · {totalUtilities.toLocaleString()} utilities · {totalViolations.toLocaleString()} violations
        </p>
      </div>

      {/* Entity stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {entityStats.map(({ label, icon: Icon, href, published, draft, total }) => (
          <Link
            key={label}
            href={href}
            className="group p-4 rounded-xl border border-border bg-white hover:border-wur-teal/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-wur-teal transition-colors" />
            </div>
            <p className="font-display text-2xl text-foreground mb-0.5">{total.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mb-2">{label}</p>
            <div className="flex gap-3 text-xs">
              <span className="text-wur-safe font-medium">{published.toLocaleString()} live</span>
              {draft > 0 && <span className="text-wur-caution">{draft.toLocaleString()} draft</span>}
            </div>
          </Link>
        ))}
      </div>

      {/* Per-state breakdown + recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* State pipeline */}
        <div className="rounded-xl border border-border bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-wur-teal" />
              <h2 className="font-semibold text-foreground text-sm">Pipeline by State</h2>
            </div>
            <Link href="/admin/utilities" className="text-xs text-wur-teal hover:underline">
              All utilities
            </Link>
          </div>
          <div className="divide-y divide-border">
            {stateStats.map((s) => {
              const pct = s.total > 0 ? Math.round((s.published / s.total) * 100) : 0;
              return (
                <div key={s.id} className="px-5 py-3.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-wur-teal w-6">{s.abbreviation}</span>
                      <span className="text-sm font-medium text-foreground">{s.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground font-mono">
                      {s.published.toLocaleString()} / {s.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-wur-teal rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-1.5 text-xs text-muted-foreground">
                    <span>{pct}% published</span>
                    <span>{s.violations.toLocaleString()} violations</span>
                    {s.draft > 0 && <span className="text-wur-caution">{s.draft.toLocaleString()} draft</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Alert: low confidence */}
          {lowConfidence > 0 && (
            <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-4 flex items-start gap-3">
              <ShieldAlert className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">
                  {lowConfidence.toLocaleString()} utilities below confidence threshold
                </p>
                <p className="text-xs text-muted-foreground">
                  Confidence score &lt; 0.70 — review before publishing.
                </p>
              </div>
            </div>
          )}

          {/* Recently published */}
          <div className="rounded-xl border border-border bg-white">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
              <Activity className="w-4 h-4 text-wur-teal" />
              <h2 className="font-semibold text-foreground text-sm">Recently Published</h2>
            </div>
            <div className="divide-y divide-border">
              {recentlyPublished.length === 0 ? (
                <p className="px-5 py-4 text-sm text-muted-foreground">No published utilities yet.</p>
              ) : recentlyPublished.map((u) => (
                <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                  <CheckCircle2 className="w-3.5 h-3.5 text-wur-safe shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground truncate font-medium">{u.name}</p>
                    <p className="text-xs text-muted-foreground font-mono">{u.state?.abbreviation} · {u.pwsid}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium capitalize ${riskColors[u.risk_level ?? "safe"]}`}>
                      {u.risk_level}
                    </span>
                    <Link
                      href={`/utilities/${u.slug}`}
                      target="_blank"
                      className="text-xs text-wur-teal hover:underline"
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Total violations", value: totalViolations.toLocaleString(), icon: ShieldAlert },
              { label: "Published", value: totalPublished.toLocaleString(), icon: CheckCircle2 },
              { label: "Draft remaining", value: (totalUtilities - totalPublished).toLocaleString(), icon: Clock },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl border border-border bg-white p-4 text-center">
                <p className="font-display text-xl text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
