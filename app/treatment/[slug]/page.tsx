import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, Wrench, FlaskConical, DollarSign, Settings } from "lucide-react";
import treatmentMethods, { getTreatmentBySlug } from "@/lib/content/treatments";
import contaminants from "@/lib/content/contaminants";
import FaqSection from "@/components/faq-section";
import RelatedPages from "@/components/related-pages";
import SourcesBlock from "@/components/sources-block";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return treatmentMethods.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const method = getTreatmentBySlug(slug);
  if (!method) return {};
  return {
    title: `${method.name} — Water Treatment Guide`,
    description: `${method.summary.slice(0, 155)}...`,
  };
}

export default async function TreatmentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const method = getTreatmentBySlug(slug);
  if (!method) notFound();

  const linkedContaminants = contaminants.filter((c) =>
    method.contaminants.includes(c.slug)
  );

  const relatedTreatments = treatmentMethods
    .filter((t) => t.slug !== method.slug)
    .slice(0, 3);

  const relatedPages = [
    ...linkedContaminants.map((c) => ({
      href: `/contaminants/${c.slug}`,
      label: c.name,
      type: "contaminant" as const,
      description: c.category,
    })),
    ...relatedTreatments.map((t) => ({
      href: `/treatment/${t.slug}`,
      label: t.name,
      type: "treatment" as const,
      description: t.type === "point-of-use" ? "Under-sink" : "Whole-home",
    })),
  ];

  const sources = [
    { label: "NSF International — Certified Drinking Water Treatment Units", url: "https://info.nsf.org/Certified/DWTU/" },
    { label: "EPA — Drinking Water Treatment Information", url: "https://www.epa.gov/ground-water-and-drinking-water" },
    { label: "Water Quality Association (WQA) — Treatment Technology Guides", url: "https://www.wqa.org/" },
  ];

  const typeLabel: Record<string, string> = {
    "point-of-use": "Point-of-Use (Under-sink or Countertop)",
    "point-of-entry": "Point-of-Entry (Whole-Home)",
    "both": "Point-of-Use or Whole-Home",
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/treatment"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Treatment Methods
          </Link>
          <div className="flex items-start gap-3">
            <Wrench className="w-6 h-6 text-white/60 mt-1 shrink-0" />
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-white/50">Treatment Method</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/15 text-white/80">
                  {typeLabel[method.type]}
                </span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-white leading-tight mb-2">
                {method.name}
              </h1>
              <p className="text-white/65 max-w-2xl leading-relaxed">{method.summary}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Direct answer */}
            <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">What It Does</p>
              <p className="text-foreground leading-relaxed">{method.description}</p>
            </section>

            {/* What it solves vs doesn't */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">What It Does and Doesn&apos;t Solve</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Solves */}
                <div className="rounded-xl border border-wur-safe-border bg-wur-safe-bg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="w-4 h-4 text-wur-safe" />
                    <h3 className="font-semibold text-wur-safe text-sm">Effectively Addresses</h3>
                  </div>
                  <div className="space-y-2">
                    {method.solves.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-wur-safe mt-1.5 shrink-0" />
                        <p className="text-sm text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Does not solve */}
                <div className="rounded-xl border border-wur-danger-border bg-wur-danger-bg p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-4 h-4 text-wur-danger" />
                    <h3 className="font-semibold text-wur-danger text-sm">Does Not Address</h3>
                  </div>
                  <div className="space-y-2">
                    {method.doesNotSolve.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full bg-wur-danger mt-1.5 shrink-0" />
                        <p className="text-sm text-foreground">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Best for */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Best For</h2>
              <p className="text-muted-foreground leading-relaxed">{method.bestFor}</p>
            </section>

            {/* Cost and maintenance */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">Cost & Maintenance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-card p-4">
                  <DollarSign className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Cost Range</p>
                  <p className="text-sm font-medium text-foreground">{method.costRange}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <Settings className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Maintenance</p>
                  <p className="text-sm text-foreground">{method.maintenance}</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <Wrench className="w-4 h-4 text-muted-foreground mb-2" />
                  <p className="text-xs text-muted-foreground mb-1">Installation Type</p>
                  <p className="text-sm text-foreground">{method.installation}</p>
                </div>
              </div>
            </section>

            {/* Linked contaminants */}
            {linkedContaminants.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-5">
                  Contaminants Addressed by {method.shortName}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {linkedContaminants.map((c) => {
                    const riskTextColors: Record<string, string> = {
                      safe: "text-wur-safe", low: "text-emerald-600",
                      moderate: "text-wur-caution", high: "text-wur-warning", critical: "text-wur-danger",
                    };
                    return (
                      <Link
                        key={c.slug}
                        href={`/contaminants/${c.slug}`}
                        className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-wur-teal/40 transition-all"
                      >
                        <FlaskConical className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-foreground group-hover:text-wur-teal transition-colors">
                            {c.shortName}
                          </p>
                          <p className={`text-xs font-medium capitalize mt-0.5 ${riskTextColors[c.riskLevel]}`}>
                            {c.riskLevel} risk · {c.category}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            <FaqSection faqs={method.faqs} />
            <RelatedPages pages={relatedPages} />
            <SourcesBlock sources={sources} lastUpdated={method.lastUpdated} />
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-5">
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">At a Glance</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Type</p>
                    <p className="text-sm font-medium">{typeLabel[method.type]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost Range</p>
                    <p className="text-sm font-mono">{method.costRange.split(".")[0]}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Contaminants Addressed</p>
                    <p className="text-sm font-medium">{method.solves.length} known</p>
                  </div>
                </div>
              </div>

              {/* NSF certification reminder */}
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="text-xs font-semibold text-foreground mb-1">NSF/ANSI Certification</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Always verify that a specific filter product is certified by NSF International or
                  the Water Quality Association (WQA) for the contaminants you are targeting.
                  Brand names alone do not guarantee effectiveness.
                </p>
              </div>

              {/* Other treatments */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Other Treatment Methods
                </p>
                <div className="space-y-1.5">
                  {relatedTreatments.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/treatment/${t.slug}`}
                      className="block py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {t.shortName}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
