import {
  MapPin, Building2, Droplets, FlaskConical, FileText,
  FlaskRound, Wrench, BookOpen, ArrowRight,
} from "lucide-react";
import TrackedLink from "@/components/tracked-link";

interface NearbyUtility {
  slug: string;
  name: string;
}

interface Props {
  utilitySlug: string;
  displayName: string;
  stateSlug: string;
  stateName: string;
  stateAbbr: string;
  citySlug?: string;
  cityName?: string;
  pwsid: string;
  pfasRecordCount: number;
  hasHealthViolations: boolean;
  nearbyUtilities?: NearbyUtility[];
}

interface NavItem {
  href: string;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  eventName: string;
  eventParams: Record<string, string | number>;
  highlight?: boolean;
}

export default function ExploreSystem({
  utilitySlug,
  displayName,
  stateSlug,
  stateName,
  stateAbbr,
  citySlug,
  cityName,
  pwsid,
  pfasRecordCount,
  hasHealthViolations,
  nearbyUtilities = [],
}: Props) {
  const items: NavItem[] = [];

  if (citySlug && cityName) {
    items.push({
      href: `/cities/${citySlug}-${stateAbbr.toLowerCase()}`,
      label: `${cityName} water quality overview`,
      description: `All utilities serving ${cityName}, violations, and PFAS records`,
      icon: Building2,
      eventName: "utility_to_city_click",
      eventParams: { from_utility: utilitySlug, city_slug: citySlug },
    });
  }

  items.push({
    href: `/states/${stateSlug}`,
    label: `${stateName} drinking water report`,
    description: `State-level utility directory, open violations, and PFAS data`,
    icon: MapPin,
    eventName: "utility_to_state_click",
    eventParams: { from_utility: utilitySlug, state_slug: stateSlug },
  });

  if (pfasRecordCount > 0) {
    items.push({
      href: `/pfas-watchlist/utility/${pwsid}`,
      label: `PFAS monitoring records for this system`,
      description: `Official EPA UCMR 5 sampling data — ${pfasRecordCount} record${pfasRecordCount !== 1 ? "s" : ""}`,
      icon: FlaskConical,
      eventName: "utility_to_pfas_click",
      eventParams: { from_utility: utilitySlug, pwsid },
      highlight: true,
    });
  }

  if (hasHealthViolations || pfasRecordCount > 0) {
    items.push({
      href: `/utilities/${utilitySlug}/records`,
      label: `Official EPA contamination & sampling records`,
      description: `Violation history, PFAS detections, and official source links`,
      icon: FileText,
      eventName: "explore_system_click",
      eventParams: { destination: "records", from_utility: utilitySlug },
      highlight: hasHealthViolations,
    });
  }

  items.push({
    href: `/labs?state=${stateSlug}`,
    label: `Certified water testing labs in ${stateName}`,
    description: `State-certified labs for PFAS, lead, nitrate, and bacteria testing`,
    icon: FlaskRound,
    eventName: "explore_system_click",
    eventParams: { destination: "labs", from_utility: utilitySlug, state: stateSlug },
  });

  items.push({
    href: `/treatment`,
    label: `Water treatment options`,
    description: `Reverse osmosis, activated carbon, and whole-home filtration guides`,
    icon: Wrench,
    eventName: "explore_system_click",
    eventParams: { destination: "treatment", from_utility: utilitySlug },
  });

  items.push({
    href: `/methodology`,
    label: `About this data`,
    description: `Data sources, update cadence, and accuracy notes`,
    icon: BookOpen,
    eventName: "source_methodology_click",
    eventParams: { from: "explore_system", utility: utilitySlug },
  });

  if (nearbyUtilities.length > 0) {
    nearbyUtilities.slice(0, 2).forEach((u) => {
      items.push({
        href: `/utilities/${u.slug}`,
        label: u.name,
        description: "Nearby water system — compare violations and PFAS records",
        icon: Droplets,
        eventName: "explore_system_click",
        eventParams: { destination: "nearby_utility", slug: u.slug, from_utility: utilitySlug },
      });
    });
  }

  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">Explore This Water System</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <TrackedLink
              key={item.href}
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
