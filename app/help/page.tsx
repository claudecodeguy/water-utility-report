import Link from "next/link";
import type { Metadata } from "next";
import { ChevronRight, HelpCircle, ArrowRight } from "lucide-react";
import helpArticles, { helpGroupMeta, helpArticlesByGroup, type HelpGroup } from "@/lib/content/help";
import HelpTracker from "@/components/help/help-tracker";

const BASE = "https://waterutilityreport.com";

export const metadata: Metadata = {
  title: "Water Records Help Center | Water Utility Report",
  description:
    "Practical answers to common questions about official water utility records: what PFAS detections mean, how violations differ from monitoring records, when to test, and how to contact your utility.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${BASE}/help` },
};

const GROUP_ORDER: HelpGroup[] = [
  "understanding",
  "pfas",
  "violations",
  "testing",
  "utility-contact",
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE },
    { "@type": "ListItem", position: 2, name: "Help Center", item: `${BASE}/help` },
  ],
};

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HelpTracker isHub />

      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="flex items-center gap-1.5 text-xs text-white/40 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/60">Help Center</span>
          </nav>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-wur-teal/20 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-wur-aqua" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua">Water Records Help Center</p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-4 leading-tight">
            Understanding Your Utility&apos;s Official Records
          </h1>
          <p className="text-white/65 leading-relaxed text-base max-w-2xl">
            Practical answers to common questions about what official water monitoring records show, what they don&apos;t show, and what to do next.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* Article count summary */}
        <p className="text-sm text-muted-foreground">
          {helpArticles.length} help articles across {GROUP_ORDER.length} topics
        </p>

        {/* Group sections */}
        {GROUP_ORDER.map((group) => {
          const meta = helpGroupMeta[group];
          const articles = helpArticlesByGroup(group);
          return (
            <section key={group}>
              <div className="mb-5">
                <h2 className="font-display text-xl text-foreground mb-1">{meta.label}</h2>
                <p className="text-sm text-muted-foreground">{meta.desc}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/help/${article.slug}`}
                    className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-wur-teal/40 transition-colors group"
                  >
                    <ArrowRight className="w-4 h-4 text-wur-teal mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    <div>
                      <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors leading-snug">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 leading-relaxed line-clamp-2">
                        {article.intro}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {/* Safety disclaimer */}
        <div className="rounded-xl border border-border bg-muted/30 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Important</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink. For current guidance, check your utility, state drinking water agency, local health department, or a certified laboratory.{" "}
            <Link href="/methodology/legal" className="text-wur-teal hover:underline">
              Full disclaimer
            </Link>
          </p>
        </div>

        {/* Cross-links */}
        <section>
          <h2 className="font-display text-lg text-foreground mb-4">Also useful</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { href: "/search", label: "Find My Utility", desc: "Look up your water system by address or name" },
              { href: "/labs", label: "Certified Labs", desc: "Find labs to test your household water" },
              { href: "/methodology", label: "Our Methodology", desc: "How we source and validate water records" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-4 hover:border-wur-teal/40 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 text-wur-teal mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <div>
                  <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">{item.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
