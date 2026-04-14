import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import articles from "@/lib/content/learn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Water Research & Analysis — AI, Policy, and Water Quality",
  description:
    "In-depth research on AI data centers and water quality, water-positive claims, semiconductor wastewater, and what communities should be asking. Built on official sources.",
  robots: { index: true, follow: true },
};

const categoryMeta: Record<string, { label: string; color: string; bg: string }> = {
  "ai-water":   { label: "AI & Water",   color: "text-wur-teal",    bg: "bg-wur-teal/10" },
  contaminants: { label: "Contaminants", color: "text-wur-warning",  bg: "bg-wur-warning/10" },
  treatment:    { label: "Treatment",    color: "text-emerald-600",  bg: "bg-emerald-50" },
  policy:       { label: "Policy",       color: "text-blue-600",     bg: "bg-blue-50" },
  utilities:    { label: "Utilities",    color: "text-violet-600",   bg: "bg-violet-50" },
};

function TagPill({ tag }: { tag: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-secondary text-muted-foreground">
      {tag.replace(/-/g, " ")}
    </span>
  );
}

export default function LearnPage() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-3">Research & Analysis</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Water Intelligence
          </h1>
          <p className="text-white/60 max-w-2xl leading-relaxed text-lg">
            Sourced research on the forces shaping water quality in the U.S. — AI infrastructure,
            industrial water use, policy gaps, and what local communities should be asking.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

        {/* Featured article */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
            Featured
          </p>
          <Link
            href={`/learn/${featured.slug}`}
            className="group grid grid-cols-1 lg:grid-cols-5 gap-8 p-8 rounded-2xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-lg transition-all"
          >
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-semibold uppercase tracking-widest ${categoryMeta[featured.category].color}`}>
                  {featured.categoryLabel}
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {featured.readingTimeMin} min read
                </span>
                <span className="text-muted-foreground/30">·</span>
                <span className="text-xs text-muted-foreground font-mono">{featured.publishDate}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground group-hover:text-wur-teal transition-colors leading-snug">
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {featured.intro}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {featured.tags.slice(0, 5).map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 flex flex-col justify-between gap-6">
              <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-2.5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Key Takeaways
                </p>
                {featured.keyTakeaways.slice(0, 3).map((kt, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-1.5 shrink-0" />
                    <p className="text-xs text-muted-foreground leading-relaxed">{kt}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-wur-teal">
                Read article <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </Link>
        </section>

        {/* All other articles */}
        {rest.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              All Articles
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {rest.map((article) => {
                const cm = categoryMeta[article.category];
                return (
                  <Link
                    key={article.slug}
                    href={`/learn/${article.slug}`}
                    className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <span className={`text-xs font-semibold uppercase tracking-widest ${cm.color}`}>
                        {article.categoryLabel}
                      </span>
                      <span className="text-muted-foreground/30">·</span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {article.readingTimeMin} min
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground group-hover:text-wur-teal transition-colors leading-snug mb-2 text-base">
                      {article.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed flex-1 line-clamp-3 mb-4">
                      {article.intro}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag) => (
                          <TagPill key={tag} tag={tag} />
                        ))}
                      </div>
                      <ArrowRight className="w-4 h-4 text-wur-teal shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Cross-links */}
        <section className="rounded-xl border border-border bg-muted/30 p-8">
          <h2 className="font-display text-xl text-foreground mb-2">
            Looking for Practical Guides?
          </h2>
          <p className="text-sm text-muted-foreground mb-5">
            These articles cover emerging research and policy. For household-level decisions on filtration, contaminants, and testing, see the Guides section.
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { href: "/guides", label: "All Guides" },
              { href: "/contaminants", label: "Contaminants" },
              { href: "/treatment", label: "Treatment Methods" },
              { href: "/search", label: "ZIP Lookup" },
              { href: "/methodology", label: "Our Methodology" },
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
