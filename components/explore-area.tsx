import {
  Droplets, FlaskConical, FlaskRound, Wrench,
  BookOpen, ArrowRight, AlertTriangle, FileText,
} from "lucide-react";
import TrackedLink from "@/components/tracked-link";
import { normalizeName } from "@/lib/normalize-name";

interface AreaUtility {
  slug: string;
  name: string;
  pwsid: string;
}

interface Props {
  areaType: "city" | "state";
  areaName: string;
  stateSlug: string;
  stateName: string;
  stateAbbr: string;
  citySlug?: string;
  topUtilities: AreaUtility[];
  pfasUtilityCount: number;
  openViolationCount: number;
}

export default function ExploreArea({
  areaType,
  areaName,
  stateSlug,
  stateName,
  stateAbbr,
  citySlug,
  topUtilities,
  pfasUtilityCount,
  openViolationCount,
}: Props) {
  type Item = {
    href: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    eventName: string;
    eventParams: Record<string, string | number>;
    highlight?: boolean;
  };

  const items: Item[] = [];

  // Top utilities (max 3)
  topUtilities.slice(0, 3).forEach((u) => {
    items.push({
      href: `/utilities/${u.slug}`,
      label: normalizeName(u.name),
      description: "Violation history, PFAS records, and official source links",
      icon: Droplets,
      eventName: "area_link_click",
      eventParams: { destination: "utility", slug: u.slug, area: areaName },
    });
  });

  // PFAS watchlist
  if (pfasUtilityCount > 0) {
    items.push({
      href: `/pfas-watchlist/${stateSlug}`,
      label: `PFAS monitoring records — ${stateName}`,
      description: `${pfasUtilityCount} water system${pfasUtilityCount !== 1 ? "s" : ""} in ${stateName} with EPA UCMR 5 records`,
      icon: FlaskConical,
      eventName: "area_link_click",
      eventParams: { destination: "pfas_watchlist", area: areaName, state: stateSlug },
      highlight: true,
    });
  } else {
    items.push({
      href: `/pfas-watchlist/${stateSlug}`,
      label: `PFAS monitoring data — ${stateName}`,
      description: `Official EPA UCMR 5 PFAS records for ${stateName} water systems`,
      icon: FlaskConical,
      eventName: "area_link_click",
      eventParams: { destination: "pfas_watchlist", area: areaName, state: stateSlug },
    });
  }

  // Open violations context
  if (openViolationCount > 0) {
    const recordsHref = areaType === "city" && citySlug
      ? `#violations`
      : `/states/${stateSlug}`;
    items.push({
      href: recordsHref,
      label: `Active drinking water violations`,
      description: `${openViolationCount} open health-based violation${openViolationCount !== 1 ? "s" : ""} on record — view official EPA SDWIS data`,
      icon: AlertTriangle,
      eventName: "area_link_click",
      eventParams: { destination: "violations", area: areaName, count: openViolationCount },
      highlight: true,
    });
  }

  // Contaminant state pages
  items.push({
    href: `/contaminants/lead/${stateSlug}`,
    label: `Lead in ${stateName} drinking water`,
    description: "State-specific lead data, violation utilities, and testing guidance",
    icon: FileText,
    eventName: "area_link_click",
    eventParams: { destination: "contaminant_lead", area: areaName, state: stateSlug },
  });

  items.push({
    href: `/contaminants/pfas/${stateSlug}`,
    label: `PFAS in ${stateName} drinking water`,
    description: "State-specific PFAS data, MCL context, and treatment options",
    icon: FileText,
    eventName: "area_link_click",
    eventParams: { destination: "contaminant_pfas", area: areaName, state: stateSlug },
  });

  // Labs
  items.push({
    href: `/labs?state=${stateSlug}`,
    label: `Certified water testing labs in ${stateName}`,
    description: `Labs certified for PFAS (EPA 533/537.1), lead, and bacteria testing`,
    icon: FlaskRound,
    eventName: "area_link_click",
    eventParams: { destination: "labs", area: areaName, state: stateSlug },
  });

  // Treatment
  items.push({
    href: `/treatment`,
    label: `Water treatment options`,
    description: "Reverse osmosis, activated carbon, and filtration guides with cost ranges",
    icon: Wrench,
    eventName: "area_link_click",
    eventParams: { destination: "treatment", area: areaName },
  });

  // Methodology
  items.push({
    href: `/methodology`,
    label: `Data sources and methodology`,
    description: "How WaterUtilityReport.com sources and validates official EPA data",
    icon: BookOpen,
    eventName: "source_methodology_click",
    eventParams: { from: "explore_area", area: areaName },
  });

  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">
        Explore Water Quality in {areaType === "city" ? areaName : `${stateName}`}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <TrackedLink
              key={`${item.href}-${item.label}`}
              href={item.href}
              eventName={item.eventName}
              eventParams={item.eventParams}
              className={`group flex items-start gap-3 p-3.5 rounded-lg border transition-all ${
                item.highlight
                  ? "border-amber-200 bg-amber-50/40 hover:border-amber-400"
                  : "border-border bg-card hover:border-wur-teal/40 hover:shadow-sm"
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${item.highlight ? "text-amber-600" : "text-wur-teal"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground group-hover:text-wur-teal transition-colors leading-snug">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{item.description}</p>
              </div>
              <ArrowRight className="w-3 h-3 text-muted-foreground/30 group-hover:text-wur-teal group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
            </TrackedLink>
          );
        })}
      </div>
    </section>
  );
}
