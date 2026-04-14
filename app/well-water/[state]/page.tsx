import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FlaskConical, ExternalLink, CheckCircle2, AlertTriangle, MapPin } from "lucide-react";
import { wellWaterGuides, getLabsByState, contaminants, states } from "@/lib/mock-data";
import FaqSection from "@/components/faq-section";
import RelatedPages from "@/components/related-pages";
import SourcesBlock from "@/components/sources-block";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return wellWaterGuides.map((g) => ({ state: g.stateSlug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state: stateSlug } = await params;
  const guide = wellWaterGuides.find((g) => g.stateSlug === stateSlug);
  if (!guide) return {};
  return {
    title: `${guide.stateName} Private Well Water Guide — Testing, Risks & Labs`,
    description: `What to test for in ${guide.stateName} private wells, common contamination risks, how often to test, and where to find certified labs.`,
  };
}

export default async function WellWaterStatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state: stateSlug } = await params;
  const guide = wellWaterGuides.find((g) => g.stateSlug === stateSlug);
  if (!guide) notFound();

  const stateLabs = getLabsByState(stateSlug);
  const stateData = states.find((s) => s.slug === stateSlug);

  const relatedContaminants = contaminants.filter((c) =>
    c.affectedStates.includes(stateSlug) && c.wellWaterRelevant
  );

  const relatedPages = [
    { href: `/states/${stateSlug}`, label: `${guide.stateName} Public Water Overview`, type: "state" as const },
    { href: `/labs?state=${stateSlug}`, label: `Certified Labs in ${guide.stateAbbr}`, type: "state" as const },
    ...relatedContaminants.map((c) => ({
      href: `/contaminants/${c.slug}`,
      label: c.name,
      type: "contaminant" as const,
      description: c.category,
    })),
  ];

  const sources = [
    { label: "EPA Private Wells Program", url: guide.epaGuidanceUrl },
    { label: `${guide.stateName} Certified Laboratory Program`, url: guide.stateLabUrl },
    { label: "CDC Well Water Safety Guidance", url: "https://www.cdc.gov/healthywater/drinking/private/wells/" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/well-water"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Well Water Guides
          </Link>
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-white/50 mt-1 shrink-0" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-1">State Well Water Guide</p>
              <h1 className="font-display text-3xl sm:text-4xl text-white mb-2">
                {guide.stateName} Private Well Water Guide
              </h1>
              <p className="text-white/65 max-w-2xl leading-relaxed">{guide.summary}</p>
            </div>
          </div>
          {stateData && (
            <div className="mt-6">
              <span className="text-xs text-white/40 font-mono">
                Est. {stateData.wellWaterPercent}% of {guide.stateName} residents rely on private wells
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main */}
          <div className="lg:col-span-2 space-y-10">
            {/* Testing guidance */}
            <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Testing Guidance</p>
              <p className="text-foreground leading-relaxed">{guide.annualTestingGuidance}</p>
            </section>

            {/* What to test for */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">
                What to Test For in {guide.stateName}
              </h2>
              <div className="space-y-2.5">
                {guide.whatToTestFor.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-lg border border-border bg-card">
                    <CheckCircle2 className="w-4 h-4 text-wur-teal mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Common risks */}
            <section>
              <h2 className="font-display text-2xl text-foreground mb-5">
                Common Contamination Risks in {guide.stateName}
              </h2>
              <div className="space-y-2.5">
                {guide.commonRisks.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <AlertTriangle className="w-3.5 h-3.5 text-wur-warning mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground">{risk}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Relevant contaminants */}
            {relatedContaminants.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-5">
                  Contaminant Guides Relevant to {guide.stateAbbr} Wells
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {relatedContaminants.map((c) => (
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
                        <p className="text-xs text-muted-foreground mt-0.5">{c.category}</p>
                        <p className="text-xs font-mono text-muted-foreground mt-0.5">EPA limit: {c.epaLimit}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Labs in state */}
            {stateLabs.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-2">
                  Certified Labs in {guide.stateName}
                </h2>
                <p className="text-sm text-muted-foreground mb-5">
                  These labs are certified to test private well water in {guide.stateName}.
                  Always confirm current certification before submitting samples.
                </p>
                <div className="space-y-3">
                  {stateLabs.map((lab) => (
                    <div key={lab.slug} className="p-5 rounded-lg border border-border bg-card">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-medium text-foreground">{lab.name}</h3>
                        {lab.website !== "#" && (
                          <a
                            href={lab.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline shrink-0"
                          >
                            Website <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{lab.serviceArea}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {lab.certifications.map((cert, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-wur-teal/10 text-wur-teal border border-wur-teal/20">
                            {cert}
                          </span>
                        ))}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {lab.testsOffered.slice(0, 4).map((test, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            {test}
                          </span>
                        ))}
                        {lab.testsOffered.length > 4 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                            +{lab.testsOffered.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Find more labs:</strong> Use the{" "}
                    <a href={guide.stateLabUrl} target="_blank" rel="noopener noreferrer" className="text-wur-teal hover:underline">
                      {guide.stateName} certified lab program
                    </a>{" "}
                    to find the full current list of state-certified labs. Certification status changes —
                    always verify before submitting samples.
                  </p>
                </div>
              </section>
            )}

            <FaqSection faqs={guide.faqs} title={`${guide.stateName} Well Water FAQs`} />
            <RelatedPages pages={relatedPages} />
            <SourcesBlock sources={sources} lastUpdated={guide.lastUpdated} />
          </div>

          {/* Sidebar */}
          <div>
            <div className="sticky top-20 space-y-5">
              {/* Quick reference */}
              <div className="rounded-xl border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                  Quick Reference
                </p>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">State program</p>
                    <a
                      href={guide.stateLabUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-wur-teal hover:underline"
                    >
                      {guide.stateAbbr} Certified Labs ↗
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">EPA guidance</p>
                    <a
                      href={guide.epaGuidanceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-wur-teal hover:underline"
                    >
                      EPA Private Wells Program ↗
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Certified labs found</p>
                    <p className="text-lg font-mono font-semibold text-foreground">{stateLabs.length}</p>
                  </div>
                </div>
              </div>

              {/* Testing checklist */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Minimum Annual Tests
                </p>
                <div className="space-y-2">
                  {["Coliform bacteria", "Nitrates / nitrites", "pH"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-wur-safe shrink-0" />
                      <span className="text-sm text-foreground">{t}</span>
                    </div>
                  ))}
                  <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
                    Plus state-specific contaminants listed above
                  </p>
                </div>
              </div>

              {/* Other state guides */}
              <div className="rounded-lg border border-border bg-card p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                  Other State Guides
                </p>
                <div className="space-y-1.5">
                  {wellWaterGuides
                    .filter((g) => g.stateSlug !== stateSlug)
                    .map((g) => (
                      <Link
                        key={g.stateSlug}
                        href={`/well-water/${g.stateSlug}`}
                        className="block py-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        {g.stateName}
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
