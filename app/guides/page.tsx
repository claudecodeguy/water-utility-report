import Link from "next/link";
import { ArrowRight, FlaskConical, Wrench, BookOpen, TestTube } from "lucide-react";
import guides from "@/lib/content/guides";
import type { Guide } from "@/lib/content/guides";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Quality Guides — Filters, Contaminants & Testing",
  description:
    "Practical guides on water filtration, common contaminants, and household testing. Start with your problem, get a clear answer.",
};

const categoryMeta: Record<Guide["category"], { label: string; icon: React.ElementType; color: string }> = {
  filtration: { label: "Filtration", icon: Wrench, color: "text-wur-teal" },
  contaminants: { label: "Contaminants", icon: FlaskConical, color: "text-wur-warning" },
  testing: { label: "Testing", icon: TestTube, color: "text-wur-caution" },
  understanding: { label: "Understanding", icon: BookOpen, color: "text-emerald-600" },
};

const categories: Guide["category"][] = ["filtration", "contaminants", "testing", "understanding"];

export default function GuidesPage() {
  const byCategory = Object.fromEntries(
    categories.map((cat) => [cat, guides.filter((g) => g.category === cat)])
  ) as Record<Guide["category"], Guide[]>;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Guides</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Water Quality Guides
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            Start with the problem, not the product. Each guide is built around a real household
            decision — filtration, contaminants, testing, or understanding what official data actually means.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {categories.map((cat) => {
          const { label, icon: Icon, color } = categoryMeta[cat];
          const catGuides = byCategory[cat];
          if (!catGuides.length) return null;
          return (
            <section key={cat}>
              <div className="flex items-center gap-2.5 mb-6">
                <Icon className={`w-5 h-5 ${color}`} />
                <h2 className="font-display text-2xl text-foreground">{label}</h2>
                <span className="text-xs font-mono text-muted-foreground ml-1">
                  {catGuides.length} guide{catGuides.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {catGuides.map((guide) => (
                  <Link
                    key={guide.slug}
                    href={`/guides/${guide.slug}`}
                    className="group flex flex-col p-5 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                  >
                    <span className={`text-xs font-semibold uppercase tracking-widest ${color} mb-3`}>
                      {guide.categoryLabel}
                    </span>
                    <h3 className="font-semibold text-foreground group-hover:text-wur-teal transition-colors leading-snug mb-2 text-base">
                      {guide.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                      {guide.metaDescription}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-xs text-wur-teal font-medium">
                      Read guide <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Cross-links to site sections */}
        <section className="rounded-xl border border-border bg-muted/30 p-8">
          <h2 className="font-display text-xl text-foreground mb-2">Looking for Utility or Contaminant Data?</h2>
          <p className="text-sm text-muted-foreground mb-5">
            These guides cover general household decisions. For utility-specific data and official government records, use the directory.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/search", label: "ZIP Lookup" },
              { href: "/contaminants", label: "Contaminant Directory" },
              { href: "/treatment", label: "Treatment Methods" },
              { href: "/well-water", label: "Well Water" },
              { href: "/labs", label: "Certified Labs" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border bg-card text-sm text-muted-foreground hover:text-primary hover:border-wur-teal/40 transition-colors"
              >
                {link.label} <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
