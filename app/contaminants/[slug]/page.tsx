import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical, Wrench, AlertTriangle, CheckCircle2 } from "lucide-react";
import contaminants, { getContaminantBySlug } from "@/lib/content/contaminants";
import treatmentMethods from "@/lib/content/treatments";
import stateContent from "@/lib/content/states";
import FaqSection from "@/components/faq-section";
import RelatedPages from "@/components/related-pages";
import JsonLd from "@/components/json-ld";
import SourcesBlock from "@/components/sources-block";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return contaminants.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const contaminant = getContaminantBySlug(slug);
  if (!contaminant) return {};
  return {
    title: `${contaminant.name} in Drinking Water — Sources, Health Effects & Treatment`,
    description: `${contaminant.summary.slice(0, 155)}...`,
  };
}

export default async function ContaminantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const contaminant = getContaminantBySlug(slug);
  if (!contaminant) notFound();

  const linkedTreatments = treatmentMethods.filter((t) =>
    contaminant.treatments.includes(t.slug)
  );

  const affectedStatesData = stateContent.filter((s) =>
    contaminant.affectedStates.includes(s.slug)
  );

  const relatedContaminants = contaminants
    .filter((c) => c.slug !== contaminant.slug && c.category === contaminant.category)
    .slice(0, 4);

  const relatedPages = [
    ...linkedTreatments.map((t) => ({
      href: `/treatment/${t.slug}`,
      label: t.name,
      type: "treatment" as const,
      description: `Removes: ${contaminant.shortName}`,
    })),
    ...relatedContaminants.map((c) => ({
      href: `/contaminants/${c.slug}`,
      label: c.name,
      type: "contaminant" as const,
      description: c.category,
    })),
  ];

  const riskColors: Record<string, { text: string; bg: string; border: string }> = {
    safe: { text: "text-wur-safe", bg: "bg-wur-safe-bg", border: "border-wur-safe-border" },
    low: { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
    moderate: { text: "text-wur-caution", bg: "bg-wur-caution-bg", border: "border-wur-caution-border" },
    high: { text: "text-wur-warning", bg: "bg-wur-warning-bg", border: "border-wur-warning-border" },
    critical: { text: "text-wur-danger", bg: "bg-wur-danger-bg", border: "border-wur-danger-border" },
  };

  const rc = riskColors[contaminant.riskLevel];

  const sources = [
    { label: "EPA Drinking Water Contaminant Information", url: `https://www.epa.gov/ground-water-and-drinking-water` },
    { label: "ATSDR ToxFAQs / Toxicological Profiles", url: "https://www.atsdr.cdc.gov/toxfaqs/index.asp" },
    { label: "EPA SDWIS — violation and detection data", url: "https://sdwis.epa.gov/" },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: contaminant.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${contaminant.name} in Drinking Water — Sources, Health Effects & Treatment`,
    description: contaminant.summary,
    dateModified: contaminant.lastUpdated,
    publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
  };

  return (
    <div className="min-h-screen bg-background">
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />
      {/* Hero */}
      <div className={`${rc.bg} border-b ${rc.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/contaminants"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> All Contaminants
          </Link>
          <div className="flex items-start gap-3">
            <FlaskConical className={`w-6 h-6 ${rc.text} mt-1 shrink-0`} />
            <div>
              <div className="flex items-center flex-wrap gap-2 mb-2">
                <span className={`text-xs font-semibold uppercase tracking-widest ${rc.text}`}>
                  {contaminant.riskLevel} risk level
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${rc.text} ${rc.bg} ${rc.border}`}>
                  {contaminant.category}
                </span>
                {contaminant.wellWaterRelevant && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                    Relevant to well water
                  </span>
                )}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-foreground leading-tight mb-2">
                {contaminant.name}
              </h1>
              <p className="text-muted-foreground max-w-2xl leading-relaxed">
                {contaminant.summary}
              </p>
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
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Quick Answer</p>
              <p className="text-foreground leading-relaxed">{contaminant.definition}</p>
            </section>

            {/* Why you should care */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Why Do People Care?</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">{contaminant.whyCare}</p>
              <p className="text-sm text-muted-foreground">{contaminant.whoIsAffected}</p>
            </section>

            {/* Health effects */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Known Health Effects</h2>
              <div className="space-y-2.5">
                {contaminant.healthEffects.map((effect, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${rc.text}`} />
                    <p className="text-sm text-foreground">{effect}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Sources */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">Common Sources</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {contaminant.sources.map((source, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-muted/40 border border-border">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-1.5 shrink-0" />
                    <p className="text-sm text-muted-foreground">{source}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* EPA limit */}
            <section className="rounded-xl border border-border bg-card p-6">
              <h2 className="font-display text-xl text-foreground mb-4">Regulatory Limit</h2>
              <div className="flex items-start gap-4 mb-3">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground mb-1">EPA Maximum Contaminant Level (MCL)</p>
                  <p className="font-mono text-2xl font-semibold text-foreground">{contaminant.epaLimit}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{contaminant.epaLimitNote}</p>
            </section>

            {/* Detection */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">How to Test for It</h2>
              <p className="text-muted-foreground leading-relaxed">{contaminant.detection}</p>
            </section>

            {/* Treatment options */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-2">Effective Treatment Options</h2>
              <p className="text-sm text-muted-foreground mb-5">
                These treatment methods have demonstrated effectiveness for {contaminant.shortName}.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {linkedTreatments.map((method) => (
                  <Link
                    key={method.slug}
                    href={`/treatment/${method.slug}`}
                    className="group flex flex-col p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
                  >
                    <Wrench className="w-4 h-4 text-wur-teal mb-2" />
                    <h3 className="font-medium text-foreground group-hover:text-wur-teal transition-colors mb-1">
                      {method.shortName}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{method.summary}</p>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {method.solves.slice(0, 2).map((s, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {s.split("(")[0].trim()}
                        </span>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </section>


            <FaqSection faqs={contaminant.faqs} />
            <RelatedPages pages={relatedPages} />
            <SourcesBlock sources={sources} lastUpdated={contaminant.lastUpdated} />
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="sticky top-20 space-y-5">
              {/* Summary card */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Quick Reference</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="text-sm font-medium">{contaminant.category}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Level</p>
                    <p className={`text-sm font-semibold capitalize ${rc.text}`}>{contaminant.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">EPA Limit</p>
                    <p className="text-sm font-mono font-medium">{contaminant.epaLimit}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Well Water Relevant</p>
                    <p className={`text-sm font-medium ${contaminant.wellWaterRelevant ? "text-wur-warning" : "text-muted-foreground"}`}>
                      {contaminant.wellWaterRelevant ? "Yes" : "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Affected states */}
              {affectedStatesData.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                    Tracked in These States
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {affectedStatesData.map((s) => (
                      <Link
                        key={s.slug}
                        href={`/states/${s.slug}`}
                        className="text-xs px-2.5 py-1 rounded-full bg-secondary text-muted-foreground hover:bg-wur-teal hover:text-white transition-colors font-mono"
                      >
                        {s.abbreviation}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Treatment options quick */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Treatment Options
                </p>
                <div className="space-y-2">
                  {linkedTreatments.map((t) => (
                    <Link
                      key={t.slug}
                      href={`/treatment/${t.slug}`}
                      className="flex items-center gap-2 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors group"
                    >
                      <Wrench className="w-3.5 h-3.5 shrink-0" />
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
