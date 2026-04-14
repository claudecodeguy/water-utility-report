import React from "react";
import Link from "next/link";
import { ArrowRight, Droplets, FlaskConical, Wrench, MapPin, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PageType = "utility" | "contaminant" | "treatment" | "state" | "city";

interface RelatedPage {
  href: string;
  label: string;
  type: PageType;
  description?: string;
}

interface RelatedPagesProps {
  pages: RelatedPage[];
  title?: string;
  className?: string;
}

const typeConfig: Record<PageType, { icon: React.ComponentType<{ className?: string }>, color: string }> = {
  utility: { icon: Droplets, color: "text-wur-teal" },
  contaminant: { icon: FlaskConical, color: "text-wur-warning" },
  treatment: { icon: Wrench, color: "text-wur-aqua" },
  state: { icon: MapPin, color: "text-purple-600" },
  city: { icon: Building2, color: "text-blue-600" },
};

export default function RelatedPages({ pages, title = "Related Pages", className }: RelatedPagesProps) {
  if (!pages.length) return null;

  return (
    <section className={cn("mt-12", className)}>
      <h2 className="font-display text-2xl text-foreground mb-5">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pages.map((page) => {
          const cfg = typeConfig[page.type];
          const Icon = cfg.icon;
          return (
            <Link
              key={page.href}
              href={page.href}
              className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all"
            >
              <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", cfg.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
                  {page.label}
                </p>
                {page.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{page.description}</p>
                )}
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
