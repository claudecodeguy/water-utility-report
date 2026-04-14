import Link from "next/link";
import {
  Building2,
  FlaskConical,
  Wrench,
  MapPin,
  Flag,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  Activity,
  TrendingUp,
} from "lucide-react";
import { utilities, contaminants, states, cities } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard — Water Utility Report",
  robots: { index: false, follow: false },
};

// Derive mock publish stats from existing data
const publishedUtilities = utilities.length;
const draftUtilities = 3;
const publishedContaminants = contaminants.length;
const draftContaminants = 1;

const reviewQueue = [
  { type: "Utility", name: "Columbus Division of Water", flag: "Low confidence score (0.61)", priority: "medium" },
  { type: "Contaminant", name: "Arsenic", flag: "EPA limit update pending review", priority: "high" },
  { type: "Utility", name: "Miami-Dade Water and Sewer", flag: "CCR data parse quality < 0.8", priority: "low" },
  { type: "State", name: "Florida", flag: "New CCR dataset available for ingestion", priority: "medium" },
];

const recentActivity = [
  { action: "Page published", entity: "Los Angeles DWP", time: "2 hours ago", status: "success" },
  { action: "Data ingested", entity: "EPA SDWIS — California batch", time: "5 hours ago", status: "success" },
  { action: "Confidence flagged", entity: "Columbus Division of Water", time: "1 day ago", status: "warning" },
  { action: "Page updated", entity: "PFAS Contaminant", time: "2 days ago", status: "success" },
  { action: "Parse failed", entity: "Houston CCR PDF", time: "3 days ago", status: "error" },
];

const entityStats = [
  {
    label: "Utilities",
    icon: Building2,
    href: "/admin/utilities",
    published: publishedUtilities,
    draft: draftUtilities,
    total: publishedUtilities + draftUtilities,
  },
  {
    label: "Contaminants",
    icon: FlaskConical,
    href: "/admin/contaminants",
    published: publishedContaminants,
    draft: draftContaminants,
    total: publishedContaminants + draftContaminants,
  },
  {
    label: "States",
    icon: MapPin,
    href: "/admin/states",
    published: states.length,
    draft: 0,
    total: states.length,
  },
  {
    label: "Cities",
    icon: Building2,
    href: "/admin/cities",
    published: cities.length,
    draft: 1,
    total: cities.length + 1,
  },
  {
    label: "Treatments",
    icon: Wrench,
    href: "/admin/treatments",
    published: 5,
    draft: 0,
    total: 5,
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Content pipeline status · Stage 1: 5 states, mock data
        </p>
      </div>

      {/* Entity stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
            <p className="font-display text-2xl text-foreground mb-0.5">{total}</p>
            <p className="text-xs text-muted-foreground mb-2">{label}</p>
            <div className="flex gap-3 text-xs">
              <span className="text-wur-safe font-medium">{published} live</span>
              {draft > 0 && <span className="text-wur-caution">{draft} draft</span>}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Review queue */}
        <div className="rounded-xl border border-border bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-wur-caution" />
              <h2 className="font-semibold text-foreground text-sm">Review Queue</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-wur-caution-bg border border-wur-caution-border text-wur-caution">
                {reviewQueue.length}
              </span>
            </div>
            <Link href="/admin/flags" className="text-xs text-wur-teal hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-border">
            {reviewQueue.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5">
                <div className="mt-0.5 shrink-0">
                  {item.priority === "high" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-wur-danger" />
                  ) : item.priority === "medium" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-wur-caution" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-muted-foreground">{item.type}</span>
                    <span className="text-xs font-medium text-foreground truncate">{item.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{item.flag}</p>
                </div>
                <button className="text-xs text-wur-teal hover:underline shrink-0 mt-0.5">Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="rounded-xl border border-border bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-wur-teal" />
              <h2 className="font-semibold text-foreground text-sm">Recent Activity</h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((item, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                <div className="shrink-0">
                  {item.status === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-wur-safe" />
                  ) : item.status === "warning" ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-wur-caution" />
                  ) : (
                    <AlertTriangle className="w-3.5 h-3.5 text-wur-danger" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground truncate">
                    <span className="text-muted-foreground">{item.action} · </span>
                    {item.entity}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data pipeline status */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-wur-teal" />
          <h2 className="font-semibold text-foreground text-sm">Data Pipeline Status</h2>
          <span className="text-xs text-muted-foreground ml-auto">Stage 1 — Mock data phase</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Schema Build", status: "Scheduled", detail: "Tonight 1am EST via remote agent", color: "text-wur-caution bg-wur-caution-bg border-wur-caution-border" },
            { label: "Prisma Setup", status: "Pending", detail: "Awaiting Supabase credentials", color: "text-muted-foreground bg-secondary border-border" },
            { label: "EPA Ingestion", status: "Not Started", detail: "Requires schema completion", color: "text-muted-foreground bg-secondary border-border" },
            { label: "Page Hydration", status: "Not Started", detail: "Mock data → real DB queries", color: "text-muted-foreground bg-secondary border-border" },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-lg border border-border bg-muted/20">
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border inline-block mb-2 ${item.color}`}>
                {item.status}
              </span>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Utilities", count: utilities.length, href: "/admin/utilities", icon: Building2 },
          { label: "Contaminants", count: contaminants.length, href: "/admin/contaminants", icon: FlaskConical },
          { label: "Review Flags", count: reviewQueue.length, href: "/admin/flags", icon: Flag },
          { label: "Data Sources", count: 8, href: "/admin/sources", icon: Activity },
        ].map(({ label, count, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex items-center gap-3 p-4 rounded-lg border border-border bg-white hover:border-wur-teal/40 transition-all"
          >
            <Icon className="w-4 h-4 text-wur-teal shrink-0" />
            <div>
              <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">{label}</p>
              <p className="text-xs text-muted-foreground">{count} records</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
