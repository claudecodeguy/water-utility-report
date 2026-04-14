import { Settings, Database, Globe, Bell } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Admin",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl text-foreground mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground">Pipeline configuration and site-wide settings</p>
      </div>

      {/* Database */}
      <section className="rounded-xl border border-border bg-white p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Database className="w-4 h-4 text-wur-teal" />
          <h2 className="font-semibold text-foreground">Database Connection</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide block mb-1.5">
              Database URL
            </label>
            <div className="flex gap-2">
              <input
                type="password"
                readOnly
                defaultValue="postgresql://postgres:***@db.***.supabase.co:5432/postgres"
                className="flex-1 h-9 px-3 rounded-lg border border-border bg-muted/30 text-sm font-mono text-muted-foreground focus:outline-none"
              />
              <button className="h-9 px-4 rounded-lg border border-border text-sm text-muted-foreground hover:border-wur-teal/40 transition-colors">
                Update
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Supabase Postgres — set via PRISMA_DATABASE_URL environment variable
            </p>
          </div>
          <div className="p-3 rounded-lg bg-wur-caution-bg border border-wur-caution-border">
            <p className="text-xs text-wur-caution">
              Prisma schema build scheduled for tonight 1am EST. Run <code className="font-mono">npx prisma db push</code> after adding your Supabase connection string.
            </p>
          </div>
        </div>
      </section>

      {/* Publish rules */}
      <section className="rounded-xl border border-border bg-white p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Globe className="w-4 h-4 text-wur-teal" />
          <h2 className="font-semibold text-foreground">Publish Rules</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Minimum confidence to publish", value: "0.70", type: "number" },
            { label: "Require human review below confidence", value: "0.80", type: "number" },
            { label: "Auto-noindex below confidence", value: "0.60", type: "number" },
          ].map((rule) => (
            <div key={rule.label} className="flex items-center justify-between gap-4 py-3 border-b border-border last:border-0">
              <label className="text-sm text-foreground">{rule.label}</label>
              <input
                type={rule.type}
                defaultValue={rule.value}
                className="w-24 h-8 px-3 rounded-md border border-border text-sm text-right focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section className="rounded-xl border border-border bg-white p-6">
        <div className="flex items-center gap-2.5 mb-5">
          <Bell className="w-4 h-4 text-wur-teal" />
          <h2 className="font-semibold text-foreground">Pipeline Notifications</h2>
        </div>
        <div className="space-y-3">
          {[
            { label: "Email on ingestion complete", enabled: true },
            { label: "Email on confidence flag", enabled: true },
            { label: "Email on parse failure", enabled: false },
            { label: "Weekly summary digest", enabled: true },
          ].map((pref) => (
            <div key={pref.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
              <span className="text-sm text-foreground">{pref.label}</span>
              <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${pref.enabled ? "bg-wur-teal" : "bg-muted"}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${pref.enabled ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex justify-end">
        <button className="h-10 px-6 rounded-lg bg-wur-teal text-white text-sm font-medium hover:bg-wur-teal-dark transition-colors flex items-center gap-2">
          <Settings className="w-4 h-4" /> Save Settings
        </button>
      </div>
    </div>
  );
}
