import Link from "next/link";
import { ArrowLeft, BookOpen, CheckCircle2, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { CANARY_OVERRIDES } from "@/lib/canary/seo-overrides";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interpreter Canary Report — Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const INTERPRETER_SLUGS = Object.entries(CANARY_OVERRIDES)
  .filter(([, v]) => v.showInterpreter)
  .map(([slug]) => slug);

export default async function InterpreterAdminPage() {
  const utilities = await Promise.all(
    INTERPRETER_SLUGS.map(async (slug) => {
      const utility = await prisma.utility.findUnique({
        where: { slug },
        select: {
          slug: true,
          name: true,
          pwsid: true,
          ccr_url: true,
          risk_level: true,
          population_served: true,
          state: { select: { abbreviation: true, slug: true } },
          violations: {
            select: { is_health_based: true, violation_type: true },
          },
          _count: { select: { violations: true } },
        },
      });

      if (!utility) return null;

      const pfasCount = await prisma.pfasRecord.count({
        where: { pwsid: utility.pwsid, suppressed: false, validated: true },
      });

      const hasHealthBased = utility.violations.some((v) => v.is_health_based);
      const hasMonitoring = utility.violations.some((v) => !v.is_health_based);
      const canary = CANARY_OVERRIDES[slug];

      function getVariant(): string {
        const parts: string[] = [];
        if (pfasCount > 0) parts.push("pfas");
        if (hasHealthBased) parts.push("health");
        if (hasMonitoring && !hasHealthBased) parts.push("monitoring");
        if (parts.length === 0) return "no_records";
        return parts.join("+");
      }

      return {
        slug,
        name: utility.name,
        pwsid: utility.pwsid,
        state: utility.state.abbreviation,
        stateSlug: utility.state.slug,
        riskLevel: utility.risk_level,
        population: utility.population_served,
        hasCcr: !!utility.ccr_url,
        pfasCount,
        hasHealthBased,
        hasMonitoring,
        totalViolations: utility._count.violations,
        variant: getVariant(),
        ctaVariant: canary?.ctaVariant ?? "save_utility",
      };
    })
  );

  const validUtilities = utilities.filter(Boolean) as NonNullable<(typeof utilities)[number]>[];

  // Aggregate conversion data from existing tables
  const [saveSignups, emailRequests] = await Promise.all([
    prisma.utilitySubscription.groupBy({
      by: ["utility_slug"],
      where: { utility_slug: { in: INTERPRETER_SLUGS } },
      _count: { _all: true },
    }),
    prisma.emailReportRequest.groupBy({
      by: ["utility_slug"],
      where: { utility_slug: { in: INTERPRETER_SLUGS } },
      _count: { _all: true },
    }),
  ]);

  const saveMap = Object.fromEntries(saveSignups.map((r) => [r.utility_slug, r._count._all]));
  const emailMap = Object.fromEntries(emailRequests.map((r) => [r.utility_slug, r._count._all]));

  const totalSaves = validUtilities.reduce((sum, u) => sum + (saveMap[u.slug] ?? 0), 0);
  const totalEmails = validUtilities.reduce((sum, u) => sum + (emailMap[u.slug] ?? 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      {/* Header */}
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Admin
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-wur-teal/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-wur-teal" />
          </div>
          <div>
            <h1 className="font-display text-2xl text-foreground">Water Record Interpreter — Canary Report</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {INTERPRETER_SLUGS.length} canary utilities · Module: <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">showInterpreter: true</code>
            </p>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Interpreter pages", value: INTERPRETER_SLUGS.length },
          { label: "Save Utility signups", value: totalSaves },
          { label: "Email Report requests", value: totalEmails },
          { label: "With PFAS records", value: validUtilities.filter((u) => u.pfasCount > 0).length },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="font-display text-2xl text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* GA4 events note */}
      <div className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">GA4 Events — Water Record Interpreter</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
          {[
            ["water_record_interpreter_view", "Module rendered on page load"],
            ["water_record_interpreter_link_click", "Any link inside the module clicked"],
            ["interpreter_labs_click", "Labs / testing link clicked"],
            ["interpreter_help_link_click", "Help center article link clicked"],
            ["interpreter_trust_link_click", "Methodology / data sources link clicked"],
            ["interpreter_save_utility_click", "Save Utility CTA clicked (from interpreter context)"],
            ["interpreter_email_report_click", "Email Report CTA clicked (from interpreter context)"],
          ].map(([event, desc]) => (
            <div key={event} className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-wur-teal shrink-0 mt-0.5" />
              <div>
                <code className="text-xs font-mono text-foreground">{event}</code>
                <span className="text-xs text-muted-foreground ml-1.5">{desc}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          All events include: <code className="font-mono">utility_slug</code>, <code className="font-mono">pwsid</code>, <code className="font-mono">state</code>, <code className="font-mono">interpreter_variant</code>, <code className="font-mono">has_pfas_records</code>, <code className="font-mono">has_health_based_records</code>, <code className="font-mono">has_monitoring_reporting_records</code>, <code className="font-mono">has_ccr_link</code>, <code className="font-mono">page_path</code>.
        </p>
      </div>

      {/* Per-utility table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-5 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
          <h2 className="font-semibold text-sm text-foreground">Canary Utility Detail</h2>
          <span className="text-xs text-muted-foreground">{validUtilities.length} pages</span>
        </div>
        <div className="divide-y divide-border">
          {validUtilities.map((u) => (
            <div key={u.slug} className="px-5 py-4 space-y-3">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link
                      href={`/utilities/${u.slug}`}
                      target="_blank"
                      className="text-sm font-semibold text-foreground hover:text-wur-teal transition-colors"
                    >
                      {u.name}
                    </Link>
                    <ExternalLink className="w-3 h-3 text-muted-foreground" />
                    <code className="text-xs font-mono text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{u.pwsid}</code>
                    <span className="text-xs text-muted-foreground">{u.state} · {u.population.toLocaleString()} served</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded border border-wur-teal/30 bg-wur-teal/5 text-wur-teal">
                      variant: {u.variant}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded border border-border text-muted-foreground">
                      cta: {u.ctaVariant}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border font-medium capitalize ${
                      u.riskLevel === "safe" ? "border-wur-safe-border bg-wur-safe-bg text-wur-safe" :
                      u.riskLevel === "low" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                      u.riskLevel === "moderate" ? "border-wur-caution-border bg-wur-caution-bg text-wur-caution" :
                      u.riskLevel === "high" ? "border-wur-warning-border bg-wur-warning-bg text-wur-warning" :
                      "border-wur-danger-border bg-wur-danger-bg text-wur-danger"
                    }`}>{u.riskLevel}</span>
                  </div>
                </div>
                <div className="flex gap-4 text-right shrink-0">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{saveMap[u.slug] ?? 0}</p>
                    <p className="text-xs text-muted-foreground">saves</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{emailMap[u.slug] ?? 0}</p>
                    <p className="text-xs text-muted-foreground">email requests</p>
                  </div>
                </div>
              </div>

              {/* Record flags */}
              <div className="flex gap-2 flex-wrap">
                {u.pfasCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> {u.pfasCount} PFAS records
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    No PFAS records
                  </span>
                )}
                {u.hasHealthBased ? (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-700 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Health-based violations
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    No health-based violations
                  </span>
                )}
                {u.hasMonitoring ? (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> {u.totalViolations} monitoring records
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    No monitoring records
                  </span>
                )}
                {u.hasCcr ? (
                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-700 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> CCR link available
                  </span>
                ) : (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted border border-border text-muted-foreground">
                    No CCR link
                  </span>
                )}
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link href={`/utilities/${u.slug}`} target="_blank" className="text-xs text-wur-teal hover:underline">
                  View page →
                </Link>
                <Link href={`/utilities/${u.slug}/records`} target="_blank" className="text-xs text-muted-foreground hover:underline">
                  Records →
                </Link>
                <Link href={`/pfas-watchlist/utility/${u.pwsid}`} target="_blank" className="text-xs text-muted-foreground hover:underline">
                  PFAS watchlist →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rollback guidance */}
      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <h2 className="font-semibold text-sm text-foreground mb-2">Rollback</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          To remove the interpreter from a utility page: set <code className="font-mono bg-muted px-1.5 py-0.5 rounded">showInterpreter: false</code> (or remove the key) from that slug&apos;s entry in <code className="font-mono bg-muted px-1.5 py-0.5 rounded">lib/canary/seo-overrides.ts</code> and redeploy. The module is gated entirely by <code className="font-mono bg-muted px-1.5 py-0.5 rounded">canary?.showInterpreter</code> — no database changes, no SEO field changes, no schema changes required.
        </p>
      </div>
    </div>
  );
}
