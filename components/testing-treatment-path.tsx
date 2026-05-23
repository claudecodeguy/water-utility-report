import {
  Search, FlaskRound, Wrench, FlaskConical,
  BookOpen, ArrowRight, FileText, Droplets,
} from "lucide-react";
import TrackedLink from "@/components/tracked-link";

interface Props {
  pageType: "labs" | "treatment";
  stateSlug?: string;
  stateName?: string;
  contaminantSlugs?: string[];
  treatmentSlug?: string;
}

const CONTAMINANT_LABELS: Record<string, string> = {
  "pfas": "PFAS contamination records and watchlist",
  "lead": "Lead violations and utility compliance records",
  "nitrates": "Nitrate violations and well water guidance",
  "arsenic": "Arsenic in drinking water — utility data",
  "disinfection-byproducts": "Disinfection byproduct violations",
};

const TREATMENT_CONTAMINANT_MAP: Record<string, string[]> = {
  "reverse-osmosis": ["pfas", "lead", "nitrates", "arsenic"],
  "activated-carbon": ["pfas", "disinfection-byproducts"],
  "water-softener": [],
  "pitcher-filter": ["lead"],
  "whole-home-filter": ["pfas", "lead"],
};

export default function TestingTreatmentPath({
  pageType,
  stateSlug,
  stateName,
  contaminantSlugs = [],
  treatmentSlug,
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

  // Step 1: Understand what's in your water
  items.push({
    href: "/",
    label: "Look up your utility's EPA compliance record",
    description: "Search by ZIP code or utility name — violations, PFAS, and official sources",
    icon: Search,
    eventName: "lab_path_click",
    eventParams: { destination: "utility_search", from: pageType },
  });

  items.push({
    href: "/pfas-watchlist",
    label: "Official PFAS monitoring records (EPA UCMR 5)",
    description: "Search which utilities have PFAS above the minimum reporting level",
    icon: FlaskConical,
    eventName: "lab_path_click",
    eventParams: { destination: "pfas_watchlist", from: pageType },
  });

  // Step 2: Lab testing
  if (pageType === "treatment") {
    items.push({
      href: stateSlug ? `/labs?state=${stateSlug}` : "/labs",
      label: stateName ? `Find a certified lab in ${stateName}` : "Find a certified water testing lab",
      description: "State-certified labs for PFAS (Method 533/537.1), lead, nitrate, and bacteria",
      icon: FlaskRound,
      eventName: "lab_path_click",
      eventParams: { destination: "labs", from: "treatment", ...(stateSlug ? { state: stateSlug } : {}) },
    });
  }

  // Step 3: Treatment
  if (pageType === "labs") {
    items.push({
      href: "/treatment/reverse-osmosis",
      label: "Reverse osmosis — removes PFAS, lead, nitrates, and arsenic",
      description: "Most comprehensive point-of-use filtration. NSF certified options available.",
      icon: Wrench,
      eventName: "lab_path_click",
      eventParams: { destination: "treatment_ro", from: "labs" },
    });
    items.push({
      href: "/treatment/activated-carbon",
      label: "Activated carbon filters — PFAS and DBP reduction",
      description: "Whole-home or under-sink carbon block filters. NSF/ANSI 42 and 53 options.",
      icon: Wrench,
      eventName: "lab_path_click",
      eventParams: { destination: "treatment_gac", from: "labs" },
    });
  }

  // Contaminant pages — derived from treatment's contaminant list or explicit props
  const effectiveContaminants = contaminantSlugs.length > 0
    ? contaminantSlugs
    : treatmentSlug
      ? (TREATMENT_CONTAMINANT_MAP[treatmentSlug] ?? [])
      : ["pfas", "lead"];

  effectiveContaminants.slice(0, 3).forEach((slug) => {
    items.push({
      href: `/contaminants/${slug}`,
      label: CONTAMINANT_LABELS[slug] ?? `${slug.replace(/-/g, " ")} — contaminant guide`,
      description: "EPA limits, health context, utility violations, and removal methods",
      icon: FileText,
      eventName: "lab_path_click",
      eventParams: { destination: "contaminant", contaminant: slug, from: pageType },
    });
  });

  // State-specific context
  if (stateSlug && stateName) {
    items.push({
      href: `/states/${stateSlug}`,
      label: `${stateName} drinking water quality report`,
      description: `Utility directory, open violations, and PFAS data for ${stateName}`,
      icon: Droplets,
      eventName: "lab_path_click",
      eventParams: { destination: "state", state: stateSlug, from: pageType },
    });
  }

  // Official records
  items.push({
    href: "/methodology",
    label: "Data sources and methodology",
    description: "How EPA SDWIS, UCMR 5, and CCR data is sourced and displayed",
    icon: BookOpen,
    eventName: "source_methodology_click",
    eventParams: { from: pageType },
  });

  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">Testing and Treatment Path</h2>
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
