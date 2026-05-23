import {
  FlaskRound, Wrench, Search, FlaskConical,
  BookOpen, ArrowRight, MapPin,
} from "lucide-react";
import TrackedLink from "@/components/tracked-link";

interface AffectedState {
  slug: string;
  name: string;
}

interface Props {
  contaminantSlug: string;
  contaminantName: string;
  treatmentSlugs: string[];
  affectedStates: AffectedState[];
  isPfas?: boolean;
  isLead?: boolean;
  isNitrate?: boolean;
}

export default function ContaminantToAction({
  contaminantSlug,
  contaminantName,
  treatmentSlugs,
  affectedStates,
  isPfas = false,
}: Props) {
  type Item = {
    href: string;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    eventName: string;
    eventParams: Record<string, string | number>;
  };

  const items: Item[] = [];

  // Primary action: test
  items.push({
    href: "/labs",
    label: `Find a certified lab to test for ${contaminantName}`,
    description: "State-certified labs for PFAS, lead, nitrate, bacteria, and more",
    icon: FlaskRound,
    eventName: "contaminant_to_treatment_click",
    eventParams: { destination: "labs", contaminant: contaminantSlug },
  });

  // Treatments
  treatmentSlugs.slice(0, 2).forEach((t) => {
    const labels: Record<string, string> = {
      "reverse-osmosis": `Reverse osmosis — removes ${contaminantName}`,
      "activated-carbon": `Activated carbon filters — ${contaminantName} reduction`,
      "water-softener": "Water softener — mineral ion exchange",
      "whole-home-filter": `Whole-home filtration for ${contaminantName}`,
      "pitcher-filter": `Pitcher filters — reduce ${contaminantName} at point of use`,
    };
    items.push({
      href: `/treatment/${t}`,
      label: labels[t] ?? `${t.replace(/-/g, " ")} — treatment guide`,
      description: "NSF certification details, cost range, and maintenance notes",
      icon: Wrench,
      eventName: "contaminant_to_treatment_click",
      eventParams: { destination: "treatment", treatment: t, contaminant: contaminantSlug },
    });
  });

  // PFAS-specific
  if (isPfas) {
    items.push({
      href: "/pfas-watchlist",
      label: "PFAS watchlist — official EPA UCMR 5 records by utility",
      description: "Search EPA monitoring records by water system and PFAS compound",
      icon: FlaskConical,
      eventName: "contaminant_to_treatment_click",
      eventParams: { destination: "pfas_watchlist", contaminant: contaminantSlug },
    });
  }

  // Utility lookup
  items.push({
    href: "/",
    label: "Look up your specific utility's records",
    description: "Search by ZIP code or utility name for compliance and PFAS data",
    icon: Search,
    eventName: "contaminant_to_treatment_click",
    eventParams: { destination: "utility_search", contaminant: contaminantSlug },
  });

  // Affected states (up to 4)
  affectedStates.slice(0, 4).forEach((s) => {
    items.push({
      href: `/contaminants/${contaminantSlug}/${s.slug}`,
      label: `${contaminantName} in ${s.name}`,
      description: `State-specific violations, utilities, and testing guidance`,
      icon: MapPin,
      eventName: "contaminant_to_treatment_click",
      eventParams: { destination: "state_contaminant", state: s.slug, contaminant: contaminantSlug },
    });
  });

  // Methodology
  items.push({
    href: "/methodology",
    label: "Data sources and methodology",
    description: "How EPA compliance and UCMR 5 monitoring data is sourced and validated",
    icon: BookOpen,
    eventName: "source_methodology_click",
    eventParams: { from: "contaminant_to_action", contaminant: contaminantSlug },
  });

  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">From {contaminantName} to Action</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <TrackedLink
              key={`${item.href}-${item.label}`}
              href={item.href}
              eventName={item.eventName}
              eventParams={item.eventParams}
              className="group flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
            >
              <Icon className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
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
