import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "States — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminStatesPage() {
  const states = await prisma.state.findMany({ orderBy: { abbreviation: "asc" } });

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">States</h1>
        <p className="text-sm text-muted-foreground">{states.length} states · {stateStats.reduce((a, s) => a + s.total, 0).toLocaleString()} total utilities</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">State</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Published</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Draft</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Violations</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Progress</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {stateStats.map((s) => {
              const pct = s.total > 0 ? Math.round((s.published / s.total) * 100) : 0;
              return (
                <tr key={s.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-9 h-9 rounded-lg bg-wur-teal/10 flex items-center justify-center font-mono text-sm font-bold text-wur-teal shrink-0">
                        {s.abbreviation}
                      </span>
                      <p className="font-medium text-foreground">{s.name}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">
                    {s.total.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-xs text-wur-safe font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {s.published.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {s.draft.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {s.violations.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 w-40">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-wur-teal rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-8 text-right">{pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/states/${s.slug}`}
                        target="_blank"
                        className="text-xs text-muted-foreground hover:text-wur-teal transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        href={`/admin/utilities?state=${s.abbreviation}`}
                        className="text-xs text-wur-teal hover:underline"
                      >
                        Utilities
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
