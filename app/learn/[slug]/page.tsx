import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, ExternalLink, Tag } from "lucide-react";
import articles, { getArticleBySlug } from "@/lib/content/learn";
import guides from "@/lib/content/guides";
import LearnBlocks from "@/components/learn-blocks";
import FaqSection from "@/components/faq-section";
import JsonLd from "@/components/json-ld";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    robots: { index: true, follow: true },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      type: "article",
      publishedTime: article.publishDate,
      modifiedTime: article.lastUpdated,
      tags: article.tags,
    },
  };
}

const categoryColor: Record<string, string> = {
  "ai-water":   "text-wur-aqua",
  contaminants: "text-wur-warning",
  treatment:    "text-emerald-400",
  policy:       "text-blue-400",
  utilities:    "text-violet-400",
};

export default async function LearnArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const relatedArticleData = article.relatedArticles
    .map((s) => articles.find((a) => a.slug === s))
    .filter(Boolean) as typeof articles;

  const relatedGuideData = article.relatedGuides
    .map((s) => guides.find((g) => g.slug === s))
    .filter(Boolean) as typeof guides;

  // JSON-LD schemas
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: article.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishDate,
    dateModified: article.lastUpdated,
    keywords: article.tags.join(", "),
    author: { "@type": "Organization", name: "Water Utility Report" },
    publisher: {
      "@type": "Organization",
      name: "Water Utility Report",
      url: "https://waterutilityreport.com",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Learn", item: "https://waterutilityreport.com/learn" },
      {
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: `https://waterutilityreport.com/learn/${article.slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-2 text-xs text-white/40 mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-white/70 transition-colors">Learn</Link>
            <span>/</span>
            <span className="text-white/60 truncate">{article.title}</span>
          </nav>

          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className={`text-xs font-semibold uppercase tracking-widest ${categoryColor[article.category] ?? "text-wur-aqua"}`}>
              {article.categoryLabel}
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <Clock className="w-3 h-3" />
              {article.readingTimeMin} min read
            </span>
            <span className="text-white/20">·</span>
            <span className="flex items-center gap-1.5 text-xs text-white/40">
              <Calendar className="w-3 h-3" />
              {article.publishDate}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-6 max-w-3xl">
            {article.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-white/8 text-white/50 border border-white/10"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag.replace(/-/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Key Takeaways */}
            <div className="rounded-xl border border-wur-teal/25 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-4">
                Key Takeaways
              </p>
              <ul className="space-y-3">
                {article.keyTakeaways.map((kt, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-wur-teal/15 text-wur-teal text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{kt}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Intro */}
            <div className="rounded-xl border border-border bg-muted/20 p-6">
              <p className="text-foreground leading-relaxed text-base">{article.intro}</p>
            </div>

            {/* Body */}
            <LearnBlocks blocks={article.blocks} />

            {/* FAQ */}
            <FaqSection faqs={article.faqs} />

            {/* Sources */}
            <section className="rounded-xl border border-border bg-card p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Sources
              </p>
              <ul className="space-y-3">
                {article.sources.map((source, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground/50 font-mono w-5 shrink-0 mt-0.5">{i + 1}.</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-muted-foreground hover:text-wur-teal transition-colors leading-relaxed flex items-start gap-1.5 group"
                    >
                      <span className="group-hover:underline">{source.label}</span>
                      <ExternalLink className="w-3 h-3 shrink-0 mt-0.5 opacity-50 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground/60 mt-4 font-mono">
                Last updated: {article.lastUpdated} · Water Utility Report
              </p>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">

              {/* Related articles */}
              {relatedArticleData.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Related Articles
                  </p>
                  <div className="space-y-4">
                    {relatedArticleData.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/learn/${related.slug}`}
                        className="group block"
                      >
                        <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-1">
                          {related.categoryLabel}
                        </p>
                        <p className="text-sm text-foreground group-hover:text-wur-teal transition-colors leading-snug">
                          {related.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3" />{related.readingTimeMin} min
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Related guides */}
              {relatedGuideData.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Related Guides
                  </p>
                  <div className="space-y-3">
                    {relatedGuideData.map((guide) => (
                      <Link
                        key={guide.slug}
                        href={`/guides/${guide.slug}`}
                        className="group flex items-start gap-1.5 py-1"
                      >
                        <ArrowRight className="w-3 h-3 text-wur-teal shrink-0 mt-1" />
                        <p className="text-sm text-muted-foreground group-hover:text-primary transition-colors leading-snug">
                          {guide.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse all */}
              <Link
                href="/learn"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground hover:text-primary hover:border-wur-teal/40 transition-all group"
              >
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-widest mb-0.5">Browse All</span>
                  Water Research & Analysis
                </span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* ZIP lookup CTA */}
              <div className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">
                  Check Your Water
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Enter your ZIP code to find your utility and see what's been detected in your area.
                </p>
                <Link
                  href="/search"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:text-wur-teal/80 transition-colors"
                >
                  ZIP Lookup <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
