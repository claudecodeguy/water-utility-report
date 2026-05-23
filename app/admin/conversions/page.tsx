import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CheckCircle2, AlertCircle, Mail, Bookmark, TrendingUp } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conversions — Admin — Water Utility Report",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function ConversionsDashboard() {
  const [
    totalSubscribers,
    totalSubscriptions,
    totalReportRequests,
    totalMonetizationSignals,
    recentSubscriptions,
    recentReportRequests,
    recentNotificationLogs,
    byVariant,
    byUtility,
    monetizationByType,
  ] = await Promise.all([
    prisma.emailSubscriber.count(),
    prisma.utilitySubscription.count(),
    prisma.emailReportRequest.count(),
    prisma.monetizationInterestSignal.count(),

    prisma.utilitySubscription.findMany({
      orderBy: { created_at: "desc" },
      take: 25,
      select: {
        id: true, email: true, utility_name: true, utility_slug: true,
        state: true, cta_location: true, experiment_variant: true,
        alert_preferences: true, created_at: true,
      },
    }),

    prisma.emailReportRequest.findMany({
      orderBy: { created_at: "desc" },
      take: 15,
      select: {
        id: true, email: true, utility_name: true, utility_slug: true,
        delivery_status: true, cta_location: true, created_at: true,
      },
    }),

    prisma.adminNotificationLog.findMany({
      orderBy: { sent_at: "desc" },
      take: 20,
      select: {
        id: true, conversion_type: true, email: true, utility_slug: true,
        delivery_status: true, error_message: true, sent_at: true,
      },
    }),

    prisma.utilitySubscription.groupBy({
      by: ["experiment_variant"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),

    prisma.utilitySubscription.groupBy({
      by: ["utility_slug", "utility_name"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
    }),

    prisma.monetizationInterestSignal.groupBy({
      by: ["interest_type"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
    }),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Link href="/admin" className="text-sm text-muted-foreground hover:text-foreground">← Admin</Link>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Conversion Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Email capture, subscriptions, and monetization signals from canary pages.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Unique subscribers", value: totalSubscribers, icon: Mail },
          { label: "Utility subscriptions", value: totalSubscriptions, icon: Bookmark },
          { label: "Report requests", value: totalReportRequests, icon: TrendingUp },
          { label: "Monetization signals", value: totalMonetizationSignals, icon: TrendingUp },
        ].map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <Icon className="w-4 h-4 text-muted-foreground mb-2" />
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* By variant */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Subscriptions by CTA Variant</p>
        </div>
        <div className="divide-y divide-border">
          {byVariant.map((row) => (
            <div key={row.experiment_variant ?? "null"} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-foreground font-mono">{row.experiment_variant ?? "(none)"}</span>
              <span className="text-sm font-semibold text-foreground">{row._count.id}</span>
            </div>
          ))}
          {byVariant.length === 0 && (
            <p className="px-5 py-4 text-sm text-muted-foreground">No subscriptions yet.</p>
          )}
        </div>
      </div>

      {/* By utility */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Top Canary Utilities by Subscriptions</p>
        </div>
        <div className="divide-y divide-border">
          {byUtility.map((row) => (
            <div key={row.utility_slug ?? ""} className="flex items-center justify-between px-5 py-3">
              <div>
                <p className="text-sm text-foreground">{row.utility_name ?? row.utility_slug ?? "—"}</p>
                <p className="text-xs text-muted-foreground font-mono">{row.utility_slug}</p>
              </div>
              <span className="text-sm font-semibold text-foreground">{row._count.id}</span>
            </div>
          ))}
          {byUtility.length === 0 && (
            <p className="px-5 py-4 text-sm text-muted-foreground">No subscriptions yet.</p>
          )}
        </div>
      </div>

      {/* Monetization signals */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Monetization Interest Signals</p>
        </div>
        <div className="divide-y divide-border">
          {monetizationByType.map((row) => (
            <div key={row.interest_type} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-foreground font-mono">{row.interest_type}</span>
              <span className="text-sm font-semibold text-foreground">{row._count.id}</span>
            </div>
          ))}
          {monetizationByType.length === 0 && (
            <p className="px-5 py-4 text-sm text-muted-foreground">No signals yet.</p>
          )}
        </div>
      </div>

      {/* Recent utility subscriptions */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Utility Subscriptions</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Utility</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Variant</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Location</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentSubscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">{s.email}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.utility_name ?? s.utility_slug}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{s.experiment_variant ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{s.cta_location ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {s.created_at.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                </tr>
              ))}
              {recentSubscriptions.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">No subscriptions yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent report requests */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Recent Email Report Requests</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Utility</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentReportRequests.map((r) => (
                <tr key={r.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 font-mono text-xs text-foreground">{r.email}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground">{r.utility_name ?? r.utility_slug}</td>
                  <td className="px-4 py-2.5 text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-medium ${r.delivery_status === "sent" ? "bg-wur-safe-bg text-wur-safe" : "bg-muted text-muted-foreground"}`}>
                      {r.delivery_status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {r.created_at.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                </tr>
              ))}
              {recentReportRequests.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-muted-foreground">No report requests yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin notification log */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Admin Notification Log (recent 20)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Type</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Email</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Error</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground">Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentNotificationLogs.map((n) => (
                <tr key={n.id} className="hover:bg-muted/20">
                  <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{n.conversion_type}</td>
                  <td className="px-4 py-2.5 text-xs font-mono text-foreground">{n.email}</td>
                  <td className="px-4 py-2.5 text-xs">
                    {n.delivery_status === "sent" ? (
                      <span className="flex items-center gap-1 text-wur-safe"><CheckCircle2 className="w-3 h-3" />sent</span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-500"><AlertCircle className="w-3 h-3" />failed</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-red-500 max-w-[200px] truncate">{n.error_message ?? "—"}</td>
                  <td className="px-4 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {n.sent_at.toISOString().slice(0, 16).replace("T", " ")}
                  </td>
                </tr>
              ))}
              {recentNotificationLogs.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications logged yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
