import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import { treatmentMethods } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Treatments — Admin",
  robots: { index: false, follow: false },
};

export default function AdminTreatmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Treatment Methods</h1>
        <p className="text-sm text-muted-foreground">{treatmentMethods.length} treatment methods indexed</p>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Method</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Scope</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Solves</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Cost Range</th>
              <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</th>
              <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {treatmentMethods.map((t) => (
              <tr key={t.slug} className="hover:bg-muted/20 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-medium text-foreground">{t.shortName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{t.slug}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground capitalize">
                    {t.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground">
                  {t.solves.length} contaminants
                </td>
                <td className="py-3 px-4 text-xs text-muted-foreground">{t.costRange}</td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 text-xs text-wur-safe">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Published
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/treatment/${t.slug}`} target="_blank" className="text-xs text-muted-foreground hover:text-wur-teal transition-colors">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button className="text-xs text-wur-teal hover:underline">Edit</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
