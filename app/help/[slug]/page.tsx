import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { AlertCircle, ArrowRight, ChevronRight } from "lucide-react";
import helpArticles, { getHelpArticleBySlug, type HelpBlock } from "@/lib/content/help";
import HelpTracker from "@/components/help/help-tracker";
import HelpCtaBlock from "@/components/help/help-cta-block";
import EmailTemplateCopy from "@/components/help/email-template-copy";

const BASE = "https://waterutilityreport.com";

export function generateStaticParams() {
  return helpArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);
  if (!article) return {};
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    robots: { index: true, follow: true },
    alternates: { canonical: `${BASE}/help/${article.slug}` },
  };
}

function renderBlock(block: HelpBlock, articleSlug: string) {
  switch (block.t) {
    case "h2":
      return <h2 key={block.c} className="font-display text-xl text-foreground mt-8 mb-3">{block.c}</h2>;
    case "h3":
      return <h3 key={block.c} className="font-semibold text-base text-foreground mt-6 mb-2">{block.c}</h3>;
    case "p":
      return <p key={block.c.slice(0, 40)} className="text-sm text-foreground/85 leading-relaxed mb-3">{block.c}</p>;
    case "ul":
      return (
        <ul key={block.items[0]} className="space-y-2 mb-4">
          {block.items.map((item) => (
            <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/85 leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-2 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol key={block.items[0]} className="space-y-2.5 mb-4">
          {block.items.map((item, i) => (
            <li key={item} className="flex items-start gap-3 text-sm text-foreground/85 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-wur-teal/15 text-wur-teal text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              {item}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <div
          key={block.c.slice(0, 40)}
          className={`rounded-xl p-4 mb-4 flex items-start gap-3 ${
            block.variant === "warning"
              ? "border border-amber-200 bg-amber-50"
              : block.variant === "highlight"
              ? "border border-wur-teal/30 bg-wur-teal/5"
              : "border border-blue-200 bg-blue-50"
          }`}
        >
          <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${block.variant === "warning" ? "text-amber-600" : "text-wur-teal"}`} />
          <p className={`text-sm leading-relaxed ${block.variant === "warning" ? "text-amber-800" : "text-foreground/80"}`}>
            {block.c}
          </p>
        </div>
      );
    case "email-template":
      return <EmailTemplateCopy key="email-template" subject={block.subject} body={block.body} />;
    default:
      return null;
  }
}

const WHAT_THIS_DOES_NOT_MEAN = [
  "This page does not determine whether water is safe or unsafe to drink.",
  "A detection record does not automatically mean a violation.",
  "A missing record does not prove a contaminant is absent.",
  "Federal datasets may lag behind current local conditions.",
  "Household plumbing, private wells, and point-of-use conditions may differ from utility-level records.",
];

export default async function HelpArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getHelpArticleBySlug(slug);
  if (!article) notFound();

  const canonicalUrl = `${BASE}/help/${article.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Help Center", item: `${BASE}/help` },
        { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: article.metaTitle,
      description: article.metaDescription,
      url: canonicalUrl,
      publisher: { "@type": "Organization", name: "Water Utility Report", url: BASE },
      datePublished: article.publishDate,
      dateModified: article.lastUpdated,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: article.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HelpTracker slug={article.slug} title={article.title} />

      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/help" className="hover:text-white/70 transition-colors">Help Center</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60 truncate">{article.title}</span>
          </nav>
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Water Records Help</p>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-4 leading-tight">{article.title}</h1>
          <p className="text-white/65 leading-relaxed text-base">{article.intro}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

        {/* What this page helps with */}
        <section>
          <h2 className="font-display text-lg text-foreground mb-3">What this page helps with</h2>
          <ul className="space-y-2">
            {article.helpsWith.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-wur-aqua mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Core safety disclaimer */}
        <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Important:</strong> Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink. For current safety guidance, check your utility, state drinking water agency, local health department, or a certified laboratory.
          </p>
        </div>

        {/* What official records can show */}
        <section>
          <h2 className="font-display text-xl text-foreground mb-3">What official records can show</h2>
          <ul className="space-y-2.5">
            {article.officialRecordsCanShow.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* What official records may not show */}
        <section>
          <h2 className="font-display text-xl text-foreground mb-3">What official records may not show</h2>
          <ul className="space-y-2.5">
            {article.officialRecordsMayNotShow.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Main content blocks */}
        <section>
          {article.blocks.map((block, i) => (
            <div key={i}>{renderBlock(block, article.slug)}</div>
          ))}
        </section>

        {/* What to check next */}
        <section>
          <h2 className="font-display text-xl text-foreground mb-4">What to check next</h2>
          <HelpCtaBlock items={article.whatToCheckNext} articleSlug={article.slug} />
        </section>

        {/* What this does not mean */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h2 className="font-semibold text-base text-foreground mb-3">What this does not mean</h2>
          <ul className="space-y-2.5">
            {WHAT_THIS_DOES_NOT_MEAN.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/60 mt-0.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQs */}
        {article.faqs.length > 0 && (
          <section>
            <h2 className="font-display text-xl text-foreground mb-5">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {article.faqs.map((faq) => (
                <div key={faq.question} className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-semibold text-foreground mb-2">{faq.question}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sources */}
        {article.sources.length > 0 && (
          <section>
            <h2 className="font-display text-lg text-foreground mb-3">Official Sources</h2>
            <ul className="space-y-2">
              {article.sources.map((source) => (
                <li key={source.url}>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-wur-teal hover:underline flex items-center gap-1.5"
                  >
                    {source.label}
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Related pages */}
        {article.relatedPages.length > 0 && (
          <section>
            <h2 className="font-display text-lg text-foreground mb-4">Related Pages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {article.relatedPages.map((page) => (
                <Link
                  key={page.href}
                  href={page.href}
                  className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-4 hover:border-wur-teal/40 transition-colors group"
                >
                  <ArrowRight className="w-4 h-4 text-wur-teal mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">{page.label}</p>
                    {page.desc && <p className="text-xs text-muted-foreground mt-0.5">{page.desc}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Help Center */}
        <div className="border-t border-border pt-6">
          <Link href="/help" className="inline-flex items-center gap-1.5 text-sm text-wur-teal hover:underline">
            ← Back to Water Records Help Center
          </Link>
        </div>
      </div>
    </div>
  );
}
