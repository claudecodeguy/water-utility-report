import Link from "next/link";
import { ExternalLink, CheckCircle2, AlertTriangle, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import AdminUtilityFilters from "@/components/admin-utility-filters";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilities — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

const riskColors: Record<string, string> = {
  safe:     "text-wur-safe bg-wur-safe-bg border-wur-safe-border",
  low:      "text-emerald-700 bg-emerald-50 border-emerald-200",
  moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  high:     "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
  critical: "text-wur-danger bg-wur-danger-bg border-wur-danger-border",
};

export default async function AdminUtilitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; status?: string; page?: string }>;
}) {
  const { state: stateFilter, status: statusFilter, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const allStates = await prisma.state.findMany({ orderBy: { abbreviation: "asc" } });

  // Build where clause
  const stateRecord = stateFilter
    ? allStates.find((s) => s.abbreviation === stateFilter)
    : null;

  const where = {
    ...(stateRecord ? { state_id: stateRecord.id } : {}),
    ...(statusFilter ? { publish_status: statusFilter as "published" | "draft" | "review" } : {}),
  };

  const [total, utilities] = await Promise.all([
    prisma.utility.count({ where }),
    prisma.utility.findMany({
      where,
      orderBy: { population_served: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      include: { state: { select: { abbreviation: true } } },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageUrl(p: number) {
    const params = new URLSearchParams();
    if (stateFilter) params.set("state", stateFilter);
    if (statusFilter) params.set("status", statusFilter);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return `/admin/utilities${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">Utilities</h1>
          <p className="text-sm text-muted-foreground">
            {total.toLocaleString()} utilities
            {stateFilter ? ` in ${stateFilter}` : ""}
            {statusFilter ? ` · ${statusFilter}` : ""}
            {" "}· page {page} of {totalPages}
          </p>
        </div>
        <AdminUtilityFilters
          states={allStates.map((s) => ({ abbreviation: s.abbreviation, name: s.name }))}
          currentState={stateFilter ?? ""}
          currentStatus={statusFilter ?? ""}
        />
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Utility</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Risk</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Population</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">CCR Year</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {utilities.map((u) => (
              <tr key={u.id} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-medium text-foreground">{u.name}</p>
                  <p className="text-xs text-muted-foreground font-mono">{u.pwsid}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="font-mono text-xs text-muted-foreground">{u.state?.abbreviation}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full border ${riskColors[u.risk_level ?? "safe"] ?? riskColors.safe}`}>
                    {u.risk_level ?? "safe"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {u.publish_status === "published" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-wur-safe">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  ) : u.publish_status === "review" ? (
                    <span className="inline-flex items-center gap-1 text-xs text-wur-caution">
                      <AlertTriangle className="w-3.5 h-3.5" /> Review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" /> Draft
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {u.population_served
                    ? u.population_served >= 1_000_000
                      ? `${(u.population_served / 1_000_000).toFixed(1)}M`
                      : `${(u.population_served / 1_000).toFixed(0)}K`
                    : "—"}
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground font-mono">
                  {u.ccr_year ?? "—"}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {u.publish_status === "published" && (
                      <Link
                        href={`/utilities/${u.slug}`}
                        target="_blank"
                        className="text-xs text-muted-foreground hover:text-wur-teal transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <span className="text-xs text-muted-foreground font-mono">
                      {u.confidence_score != null ? `${Math.round(u.confidence_score * 100)}%` : "—"}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-muted-foreground">
            Showing {((page - 1) * PAGE_SIZE + 1).toLocaleString()}–{Math.min(page * PAGE_SIZE, total).toLocaleString()} of {total.toLocaleString()}
          </p>
          <div className="flex items-center gap-1">
            {page > 1 ? (
              <Link href={pageUrl(page - 1)} className="h-8 w-8 rounded-lg border border-border bg-white flex items-center justify-center hover:border-wur-teal/40 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </Link>
            ) : (
              <span className="h-8 w-8 rounded-lg border border-border bg-muted/30 flex items-center justify-center opacity-40">
                <ChevronLeft className="w-4 h-4" />
              </span>
            )}
            <span className="text-xs px-3 text-muted-foreground">{page} / {totalPages}</span>
            {page < totalPages ? (
              <Link href={pageUrl(page + 1)} className="h-8 w-8 rounded-lg border border-border bg-white flex items-center justify-center hover:border-wur-teal/40 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="h-8 w-8 rounded-lg border border-border bg-muted/30 flex items-center justify-center opacity-40">
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
