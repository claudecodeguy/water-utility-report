"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, FlaskConical, BookOpen, HelpCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export interface WaterRecordInterpreterProps {
  utilitySlug: string;
  pwsid: string;
  state: string;       // abbreviation e.g. "MA"
  stateSlug: string;   // e.g. "massachusetts"
  utilityName: string;
  hasPfasRecords: boolean;
  hasUcmr5Records: boolean;
  hasHealthBasedViolations: boolean;
  hasMonitoringViolations: boolean;
  hasCcrUrl: boolean;
}

function getVariant(hasPfas: boolean, hasHealth: boolean, hasMonitoring: boolean): string {
  const parts: string[] = [];
  if (hasPfas) parts.push("pfas");
  if (hasHealth) parts.push("health");
  if (hasMonitoring && !hasHealth) parts.push("monitoring");
  if (!hasPfas && !hasHealth && !hasMonitoring) return "no_records";
  return parts.join("+");
}

const DOES_NOT_MEAN = [
  "This page does not determine whether water is safe or unsafe to drink.",
  "A detection record does not automatically mean a violation.",
  "A missing record does not prove a contaminant is absent.",
  "Federal datasets may lag behind current local conditions.",
  "Household plumbing, private wells, and point-of-use conditions may differ from utility-level records.",
];

export default function WaterRecordInterpreter({
  utilitySlug,
  pwsid,
  state,
  stateSlug,
  utilityName,
  hasPfasRecords,
  hasUcmr5Records,
  hasHealthBasedViolations,
  hasMonitoringViolations,
  hasCcrUrl,
}: WaterRecordInterpreterProps) {
  const interpreterVariant = getVariant(hasPfasRecords, hasHealthBasedViolations, hasMonitoringViolations);

  useEffect(() => {
    trackEvent("water_record_interpreter_view", {
      utility_slug: utilitySlug,
      pwsid,
      state,
      interpreter_variant: interpreterVariant,
      has_pfas_records: hasPfasRecords,
      has_ucmr5_records: hasUcmr5Records,
      has_monitoring_reporting_records: hasMonitoringViolations,
      has_health_based_records: hasHealthBasedViolations,
      has_ccr_link: hasCcrUrl,
      page_path: window.location.pathname,
    });
  }, []);

  function trackLink(clickedLinkType: string) {
    trackEvent("water_record_interpreter_link_click", {
      utility_slug: utilitySlug,
      pwsid,
      state,
      interpreter_variant: interpreterVariant,
      has_pfas_records: hasPfasRecords,
      has_ucmr5_records: hasUcmr5Records,
      has_monitoring_reporting_records: hasMonitoringViolations,
      has_health_based_records: hasHealthBasedViolations,
      has_ccr_link: hasCcrUrl,
      clicked_link_type: clickedLinkType,
      page_path: window.location.pathname,
    });
    if (clickedLinkType === "labs") {
      trackEvent("interpreter_labs_click", { utility_slug: utilitySlug, pwsid, state, page_path: window.location.pathname });
    } else if (clickedLinkType.startsWith("help")) {
      trackEvent("interpreter_help_link_click", { utility_slug: utilitySlug, pwsid, state, clicked_link_type: clickedLinkType, page_path: window.location.pathname });
    } else if (clickedLinkType.startsWith("trust") || clickedLinkType === "methodology") {
      trackEvent("interpreter_trust_link_click", { utility_slug: utilitySlug, pwsid, state, clicked_link_type: clickedLinkType, page_path: window.location.pathname });
    }
  }

  // Build "What the records show" bullets
  const recordsBullets: string[] = [];
  if (hasPfasRecords) {
    recordsBullets.push(
      `EPA UCMR 5 sampling records are on file for ${utilityName}. UCMR 5 is a monitoring program that measures compounds not yet regulated — the presence of a record indicates these compounds were sampled.`
    );
  }
  if (!hasPfasRecords) {
    recordsBullets.push(
      `No PFAS or UCMR 5 sampling records were found for ${utilityName} in the datasets currently used by this site.`
    );
  }
  if (hasHealthBasedViolations) {
    recordsBullets.push(
      `Health-based violation records are listed, identified as such in EPA's SDWIS database. These records indicate the utility exceeded a regulated Maximum Contaminant Level (MCL) at some point.`
    );
  }
  if (hasMonitoringViolations && !hasHealthBasedViolations) {
    recordsBullets.push(
      `Monitoring and reporting records are listed. These records indicate a missed sample, late report, or procedural issue — they are not health-based violation records.`
    );
  }
  if (hasCcrUrl) {
    recordsBullets.push(
      `A Consumer Confidence Report (CCR) or official source report link is available. The CCR is the utility's annual summary of detected contaminants, source water, and treatment information.`
    );
  }
  recordsBullets.push(
    `Utility-level records reflect system-wide monitoring at the point of distribution, not conditions at individual taps. Household plumbing, service lines, and fixtures may differ.`
  );

  // Build "What to check next" ordered list
  const checkNext: { label: string; href: string; type: string }[] = [];
  checkNext.push({
    label: "Review the official source records for this utility",
    href: `/utilities/${utilitySlug}/records`,
    type: "source_records",
  });
  if (hasPfasRecords) {
    checkNext.push({
      label: "Read the PFAS sampling record detail on the PFAS Watchlist",
      href: `/pfas-watchlist/utility/${pwsid}`,
      type: "pfas_watchlist",
    });
    checkNext.push({
      label: "Learn what a PFAS detection in UCMR 5 does and does not mean",
      href: "/learn/ucmr5-pfas-water-sampling-explained",
      type: "help_pfas",
    });
  }
  if (!hasPfasRecords) {
    checkNext.push({
      label: "Learn what a missing PFAS record means — and does not mean",
      href: "/help/no-pfas-record-found-meaning",
      type: "help_no_pfas",
    });
  }
  if (hasHealthBasedViolations) {
    checkNext.push({
      label: "Understand what a health-based violation record means",
      href: "/help/health-based-violation-record-meaning",
      type: "help_health_violation",
    });
  }
  if (hasMonitoringViolations && !hasHealthBasedViolations) {
    checkNext.push({
      label: "Learn how monitoring records differ from health-based violations",
      href: "/help/monitoring-reporting-violation-meaning",
      type: "help_monitoring",
    });
  }
  checkNext.push({
    label: "Review what to do after reading a utility's official records",
    href: "/help/what-to-do-after-reading-water-report",
    type: "help_what_to_do",
  });
  checkNext.push({
    label: "Consider household-specific testing if you have concerns about your tap",
    href: `/labs?state=${stateSlug}`,
    type: "labs",
  });

  // Build action links
  const actionLinks: { label: string; href: string; type: string; icon: React.ReactNode }[] = [];
  if (hasPfasRecords) {
    actionLinks.push({
      label: "PFAS sampling records",
      href: `/pfas-watchlist/utility/${pwsid}`,
      type: "pfas_records",
      icon: <ArrowRight className="w-3.5 h-3.5" />,
    });
    actionLinks.push({
      label: "PFAS testing guidance",
      href: "/labs/pfas-water-testing",
      type: "labs",
      icon: <FlaskConical className="w-3.5 h-3.5" />,
    });
  }
  if (!hasPfasRecords) {
    actionLinks.push({
      label: "PFAS testing options",
      href: "/labs/pfas-water-testing",
      type: "labs",
      icon: <FlaskConical className="w-3.5 h-3.5" />,
    });
  }
  if (hasHealthBasedViolations) {
    actionLinks.push({
      label: "What health-based violations mean",
      href: "/help/health-based-violation-record-meaning",
      type: "help_health_violation",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    });
  }
  if (hasMonitoringViolations && !hasHealthBasedViolations) {
    actionLinks.push({
      label: "What monitoring records mean",
      href: "/help/monitoring-reporting-violation-meaning",
      type: "help_monitoring",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    });
  }
  if (!hasCcrUrl) {
    actionLinks.push({
      label: "CCR not found? Here's what to do",
      href: "/help/consumer-confidence-report-not-found",
      type: "help_ccr",
      icon: <HelpCircle className="w-3.5 h-3.5" />,
    });
  }
  actionLinks.push({
    label: "What to test for at home",
    href: "/help/what-to-test-for-after-utility-report",
    type: "help_testing",
    icon: <FlaskConical className="w-3.5 h-3.5" />,
  });
  actionLinks.push({
    label: "Data sources & limitations",
    href: "/methodology/data-sources",
    type: "methodology",
    icon: <BookOpen className="w-3.5 h-3.5" />,
  });
  // Keep max 5 action links
  const topActions = actionLinks.slice(0, 5);

  return (
    <section
      id="water-record-interpreter"
      className="rounded-xl border border-wur-teal/25 bg-wur-teal/[0.03] p-6 space-y-6"
      aria-label="Water Record Interpreter"
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-wur-teal/10 flex items-center justify-center shrink-0 mt-0.5">
          <BookOpen className="w-4 h-4 text-wur-teal" />
        </div>
        <div>
          <h2 className="font-display text-xl text-foreground leading-tight">
            How To Read These Water Records
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            A plain-language summary of what the official records on this page show — and what they do not show.
          </p>
        </div>
      </div>

      {/* Short answer */}
      <div>
        {hasPfasRecords && hasHealthBasedViolations && (
          <p className="text-sm text-foreground/85 leading-relaxed">
            Official records for {utilityName} include both EPA UCMR 5 PFAS sampling records and health-based violation records identified in EPA&apos;s SDWIS database. The PFAS sampling records are monitoring data — a detection indicates the compound was measured, not that a regulatory standard has been exceeded. The health-based violation records are separate entries in the SDWIS compliance database. Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink.
          </p>
        )}
        {hasPfasRecords && !hasHealthBasedViolations && !hasMonitoringViolations && (
          <p className="text-sm text-foreground/85 leading-relaxed">
            Official records for {utilityName} include EPA UCMR 5 PFAS sampling records. UCMR 5 is an unregulated contaminant monitoring program — the presence of a record indicates PFAS compounds were sampled, not that a regulatory standard has been exceeded. No health-based violation records are currently shown for this system in the datasets used by this site. Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink.
          </p>
        )}
        {hasPfasRecords && !hasHealthBasedViolations && hasMonitoringViolations && (
          <p className="text-sm text-foreground/85 leading-relaxed">
            Official records for {utilityName} include EPA UCMR 5 PFAS sampling records and monitoring and reporting records. Monitoring and reporting records indicate a procedural issue such as a missed sample or late report — they are not health-based violation records and do not indicate a contaminant exceeded a regulatory limit. Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink.
          </p>
        )}
        {!hasPfasRecords && hasHealthBasedViolations && (
          <p className="text-sm text-foreground/85 leading-relaxed">
            Official records for {utilityName} include health-based violation records identified as such in EPA&apos;s SDWIS database. These records indicate the utility exceeded a regulated Maximum Contaminant Level (MCL) at some point. No PFAS or UCMR 5 sampling records were found for this utility in the datasets currently used by this site. Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink.
          </p>
        )}
        {!hasPfasRecords && !hasHealthBasedViolations && hasMonitoringViolations && (
          <p className="text-sm text-foreground/85 leading-relaxed">
            Official records for {utilityName} include monitoring and reporting records. These records indicate a procedural issue such as a missed sample or late report — they are not health-based violation records and do not indicate a contaminant exceeded a regulatory limit. No PFAS or UCMR 5 sampling records were found for this utility in the datasets currently used by this site. Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink.
          </p>
        )}
        {!hasPfasRecords && !hasHealthBasedViolations && !hasMonitoringViolations && (
          <p className="text-sm text-foreground/85 leading-relaxed">
            No health-based violation records, monitoring records, or PFAS sampling records were found for {utilityName} in the datasets currently used by this site. This does not prove these records are absent — records may be incomplete, not yet updated, or held in systems not currently ingested. Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink.
          </p>
        )}
      </div>

      {/* What the records show */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          What the records show
        </p>
        <ul className="space-y-2.5">
          {recordsBullets.map((bullet, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-2 shrink-0" />
              {bullet}
            </li>
          ))}
        </ul>
      </div>

      {/* What this does not mean */}
      <div className="rounded-lg border border-border bg-muted/40 p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            What this does not mean
          </p>
        </div>
        <ul className="space-y-2">
          {DOES_NOT_MEAN.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
              <AlertCircle className="w-3 h-3 text-muted-foreground/50 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* What to check next */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          What to check next
        </p>
        <ol className="space-y-2.5">
          {checkNext.map((item, i) => (
            <li key={item.href} className="flex items-start gap-3 text-sm text-foreground/80 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-wur-teal/10 text-wur-teal text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <Link
                href={item.href}
                onClick={() => trackLink(item.type)}
                className="hover:text-wur-teal hover:underline transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Action links */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
          Jump to
        </p>
        <div className="flex flex-wrap gap-2">
          {topActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              onClick={() => trackLink(action.type)}
              className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-wur-teal/30 bg-wur-teal/5 text-wur-teal hover:bg-wur-teal/10 transition-colors font-medium"
            >
              {action.icon}
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Core disclaimer */}
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Important:</strong> Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink. For current safety guidance, check your utility, state drinking water agency, local health department, or a certified laboratory.{" "}
          <Link
            href="/methodology/data-sources"
            onClick={() => trackLink("methodology")}
            className="text-wur-teal hover:underline"
          >
            Data sources and limitations
          </Link>
        </p>
      </div>
    </section>
  );
}
