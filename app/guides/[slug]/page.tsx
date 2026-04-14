import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import guides, { getGuideBySlug } from "@/lib/content/guides";
import GuideBlocks from "@/components/guide-blocks";
import FaqSection from "@/components/faq-section";
import JsonLd from "@/components/json-ld";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  const relatedGuideData = guide.relatedGuides
    .map((s) => guides.find((g) => g.slug === s))
    .filter(Boolean) as typeof guides;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.metaDescription,
    datePublished: guide.publishDate,
    dateModified: guide.lastUpdated,
    author: { "@type": "Organization", name: "Water Utility Report" },
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
      { "@type": "ListItem", position: 2, name: "Guides", item: "https://waterutilityreport.com/guides" },
      { "@type": "ListItem", position: 3, name: guide.title, item: `https://waterutilityreport.com/guides/${guide.slug}` },
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
            <Link href="/guides" className="hover:text-white/70 transition-colors">Guides</Link>
            <span>/</span>
            <span className="text-white/60 truncate">{guide.title}</span>
          </nav>
          <span className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-3 block">
            {guide.categoryLabel}
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-4 max-w-3xl">
            {guide.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3" />
              Published {guide.publishDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Updated {guide.lastUpdated}
            </span>
            <span>Water Utility Report</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Intro */}
            <div className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
              <p className="text-foreground leading-relaxed text-base">
                {guide.intro.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={i}>{part.slice(2, -2)}</strong>
                  ) : (
                    part
                  )
                )}
              </p>
            </div>

            {/* Body blocks */}
            <GuideBlocks blocks={guide.blocks} />

            {/* Next steps */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl text-foreground mb-4">What to Do Next</h2>
              <ol className="space-y-3">
                {guide.nextSteps.map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-wur-teal/10 text-wur-teal text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, j) => {
                        if (part.startsWith("**") && part.endsWith("**"))
                          return <strong key={j}>{part.slice(2, -2)}</strong>;
                        const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
                        if (m)
                          return (
                            <Link key={j} href={m[2]} className="text-wur-teal hover:underline">
                              {m[1]}
                            </Link>
                          );
                        return part;
                      })}
                    </p>
                  </li>
                ))}
              </ol>
            </section>

            {/* FAQ */}
            <FaqSection faqs={guide.faqs} />

            {/* Sources note */}
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Sources & methodology:</span>{" "}
                This guide is an informational resource based on publicly available EPA, CDC, and NSF guidance.
                Water Utility Report separates utility-wide context from household-level exposure decisions.
                For household-specific confirmation, use certified lab testing.{" "}
                <Link href="/methodology" className="text-wur-teal hover:underline">
                  Read our methodology →
                </Link>
              </p>
              <p className="text-xs text-muted-foreground mt-1.5 font-mono">
                Last updated: {guide.lastUpdated}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              {/* Quick nav */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Key Resources
                </p>
                <div className="space-y-2">
                  {[
                    { href: "/search", label: "ZIP Lookup — find your utility" },
                    { href: "/contaminants/lead", label: "Lead contaminant guide" },
                    { href: "/contaminants/pfas", label: "PFAS contaminant guide" },
                    { href: "/contaminants/nitrates", label: "Nitrates guide" },
                    { href: "/treatment/reverse-osmosis", label: "Reverse osmosis guide" },
                    { href: "/treatment/activated-carbon", label: "Carbon filtration guide" },
                    { href: "/labs", label: "Find a certified lab" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-1.5 py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      <ArrowRight className="w-3 h-3 shrink-0" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Related guides */}
              {relatedGuideData.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                    Related Guides
                  </p>
                  <div className="space-y-3">
                    {relatedGuideData.map((related) => (
                      <Link
                        key={related.slug}
                        href={`/guides/${related.slug}`}
                        className="group block"
                      >
                        <p className="text-sm text-foreground group-hover:text-wur-teal transition-colors leading-snug">
                          {related.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">{related.categoryLabel}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* All guides */}
              <Link
                href="/guides"
                className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/30 text-sm text-muted-foreground hover:text-primary hover:border-wur-teal/40 transition-all group"
              >
                <span>
                  <span className="block text-xs font-semibold uppercase tracking-widest mb-0.5">Browse All</span>
                  All Water Quality Guides
                </span>
                <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
