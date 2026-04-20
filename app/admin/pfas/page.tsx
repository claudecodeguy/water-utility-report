import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Database,
  XCircle,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PFAS Admin — Water Utility Report",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function PfasAdminPage() {
  const [
    totalRecords,
    validatedRecords,
    suppressedRecords,
    failedValidation,
    totalAnalytes,
    totalStatuses,
    recentRecords,
    analyteDistribution,
    suppressedQueue,
  ] = await Promise.all([
    prisma.pfasRecord.count(),
    prisma.pfasRecord.count({ where: { validated: true, suppressed: false } }),
    prisma.pfasRecord.count({ where: { suppressed: true } }),
    prisma.pfasRecord.count({ where: { validated: false } }),
    prisma.pfasAnalyte.count(),
    prisma.pfasOfficialStatus.count(),
    prisma.pfasRecord.findMany({
      take: 10,
      orderBy: { created_at: "desc" },
      include: { analyte: { select: { code: true } } },
      where: { validated: true, suppressed: false },
    }),
    prisma.pfasRecord.groupBy({
      by: ["analyte_id"],
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 10,
      where: { validated: true, suppressed: false },
    }),
    prisma.pfasRecord.findMany({
      where: { suppressed: true },
      take: 10,
      orderBy: { updated_at: "desc" },
      include: { analyte: { select: { code: true } } },
    }),
  ]);

  // Load analyte names for distribution
  const analyteIds = analyteDistribution.map((a) => a.analyte_id);
  const analyteNames = await prisma.pfasAnalyte.findMany({
    where: { id: { in: analyteIds } },
    select: { id: true, code: true },
  });
  const analyteNameMap = Object.fromEntries(analyteNames.map((a) => [a.id, a.code]));

  const lastRecord = await prisma.pfasRecord.findFirst({
    orderBy: { source_retrieved_at: "desc" },
    select: { source_retrieved_at: true, source_dataset: true, source_version: true },
  });

  const detectionCount = await prisma.pfasRecord.count({
    where: {
      validated: true,
      suppressed: false,
      raw_detection_flag: "Detected above MRL",
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-100 border border-amber-200 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-amber-600" />
        </div>
        <div>
          <h1 className="font-display text-2xl text-foreground mb-1">PFAS Watchlist</h1>
          <p className="text-sm text-muted-foreground">
            Source health, record pipeline, and audit controls for official PFAS monitoring data.
          </p>
        </div>
      </div>

      {/* Source health */}
      <div className="rounded-xl border border-border bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-4 h-4 text-wur-teal" />
          <h2 className="font-semibold text-foreground text-sm">Source Health — EPA UCMR 5</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: "Total records", value: totalRecords.toLocaleString(), color: "text-foreground" },
            { label: "Published", value: validatedRecords.toLocaleString(), color: "text-wur-safe" },
            { label: "Failed validation", value: failedValidation.toLocaleString(), color: failedValidation > 0 ? "text-wur-caution" : "text-muted-foreground" },
            { label: "Suppressed", value: suppressedRecords.toLocaleString(), color: suppressedRecords > 0 ? "text-wur-warning" : "text-muted-foreground" },
          ].map(({ label, value, color }) => (
            <div key={label} className="text-center p-3 rounded-lg border border-border">
              <div className={`font-display text-xl mb-0.5 ${color}`}>{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {lastRecord ? (
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-wur-safe" />
            <span className="text-muted-foreground">Last retrieval:</span>
            <span className="text-foreground font-medium">
              {lastRecord.source_retrieved_at.toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground font-mono text-xs">{lastRecord.source_dataset}</span>
            {lastRecord.source_version && (
              <span className="text-muted-foreground font-mono text-xs">v{lastRecord.source_version}</span>
            )}
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg border border-wur-caution-border bg-wur-caution-bg p-3">
            <AlertTriangle className="w-3.5 h-3.5 text-wur-caution shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground mb-0.5">No UCMR 5 data ingested</p>
              <p className="text-xs text-muted-foreground">
                Run the seed and ingest scripts to load EPA UCMR 5 data:
              </p>
              <code className="text-xs font-mono block mt-1.5 bg-white px-2 py-1 rounded border border-border">
                npx tsx scripts/seed-pfas-analytes.ts
              </code>
              <code className="text-xs font-mono block mt-1 bg-white px-2 py-1 rounded border border-border">
                npx tsx scripts/ingest-ucmr5.ts --file /path/to/UCMR5_All_Data.txt
              </code>
            </div>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Official detections", value: detectionCount.toLocaleString(), icon: AlertTriangle, color: "text-amber-600" },
          { label: "Analytes seeded", value: totalAnalytes.toLocaleString(), icon: Shield, color: "text-wur-teal" },
          { label: "Official status records", value: totalStatuses.toLocaleString(), icon: Database, color: "text-foreground" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-xl border border-border bg-white p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <div className="font-display text-xl text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Analyte distribution */}
        <div className="rounded-xl border border-border bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground text-sm">Analyte Distribution (top 10)</h2>
          </div>
          {analyteDistribution.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">No records yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {analyteDistribution.map((a) => (
                <div key={a.analyte_id} className="flex items-center gap-3 px-5 py-3">
                  <span className="font-mono text-xs font-semibold text-wur-teal w-20 shrink-0">
                    {analyteNameMap[a.analyte_id] ?? a.analyte_id.slice(0, 8)}
                  </span>
                  <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{
                        width: `${Math.round((a._count.id / (analyteDistribution[0]?._count?.id ?? 1)) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground font-mono w-16 text-right shrink-0">
                    {a._count.id.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent records */}
        <div className="rounded-xl border border-border bg-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground text-sm">Recent Records</h2>
          </div>
          {recentRecords.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted-foreground">No records yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {recentRecords.map((r) => {
                const isDetection = r.raw_detection_flag === "Detected above MRL";
                return (
                  <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                    {isDetection ? (
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground font-mono truncate">{r.pwsid}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.analyte.code} · {r.raw_result_value} {r.raw_unit}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-muted-foreground">
                        {r.sample_date.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                      </p>
                      <Link
                        href={`/pfas-watchlist/utility/${r.pwsid}`}
                        target="_blank"
                        className="text-xs text-wur-teal hover:underline"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Suppressed queue */}
      {suppressedQueue.length > 0 && (
        <div className="rounded-xl border border-wur-warning-border bg-white">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-wur-warning-border">
            <XCircle className="w-4 h-4 text-wur-warning" />
            <h2 className="font-semibold text-foreground text-sm">
              Suppressed Records ({suppressedRecords.toLocaleString()})
            </h2>
          </div>
          <div className="divide-y divide-border">
            {suppressedQueue.map((r) => (
              <div key={r.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono text-foreground">{r.pwsid} · {r.analyte.code}</p>
                  <p className="text-xs text-muted-foreground">{r.suppressed_reason ?? "No reason recorded"}</p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {r.updated_at.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "PFAS Watchlist Hub",
            desc: "Public-facing hub page",
            href: "/pfas-watchlist",
            icon: Shield,
          },
          {
            label: "EPA UCMR 5 Data",
            desc: "Download latest occurrence data",
            href: "https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5",
            icon: ExternalLink,
            external: true,
          },
          {
            label: "Source Health",
            desc: "Data source status page",
            href: "/pfas-watchlist/sources",
            icon: Database,
          },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-white hover:border-wur-teal/40 hover:shadow-sm transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0">
              <link.icon className="w-4 h-4 text-wur-teal" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors">
                {link.label}
              </p>
              <p className="text-xs text-muted-foreground">{link.desc}</p>
            </div>
            {link.external && <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 ml-auto" />}
          </Link>
        ))}
      </div>

      {/* Ingest guide */}
      <div className="rounded-xl border border-border bg-secondary/30 p-5">
        <h3 className="font-semibold text-foreground text-sm mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          Ingest Commands
        </h3>
        <div className="space-y-2">
          {[
            { label: "Seed analytes", cmd: "npx tsx scripts/seed-pfas-analytes.ts" },
            { label: "Ingest UCMR 5 (all states)", cmd: "npx tsx scripts/ingest-ucmr5.ts --file /path/to/UCMR5_All_Data.txt" },
            { label: "Ingest one state", cmd: "npx tsx scripts/ingest-ucmr5.ts --file /path/to/UCMR5_All_Data.txt --state CA" },
            { label: "Dry run preview", cmd: "npx tsx scripts/ingest-ucmr5.ts --file /path/to/UCMR5_All_Data.txt --dry-run" },
          ].map(({ label, cmd }) => (
            <div key={label}>
              <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
              <code className="text-xs font-mono block bg-white px-3 py-1.5 rounded border border-border text-foreground">
                {cmd}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
