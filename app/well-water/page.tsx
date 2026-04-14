import Link from "next/link";
import { ArrowRight, Droplets, AlertTriangle, FlaskConical, CheckCircle2 } from "lucide-react";
import { states, wellWaterGuides } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Private Well Water Testing Guide — State-by-State",
  description:
    "Private wells are not regulated like public water systems — testing and treatment are your responsibility. State-by-state guidance on what to test for, how often, and where to find certified labs.",
};

const universalSteps = [
  {
    step: "01",
    title: "Test annually at minimum",
    desc: "Coliform bacteria and nitrates should be tested every year regardless of state. Most certified labs offer a basic well panel for $75–$200.",
  },
  {
    step: "02",
    title: "Know your local risks",
    desc: "Your state geology, nearby agriculture, and industrial history determine which additional tests matter. Select your state below for a specific risk profile.",
  },
  {
    step: "03",
    title: "Use a certified lab",
    desc: "Standard home test kits are unreliable for health-based contaminants. Use a state-certified or NELAP-accredited laboratory for results you can act on.",
  },
  {
    step: "04",
    title: "Retest after any change",
    desc: "Heavy rain events, nearby construction, flooding, changes in taste/odor/color, or new neighbors with septic systems are all triggers for retesting.",
  },
];

const commonContaminants = [
  { name: "Coliform Bacteria", risk: "high", note: "Universal risk — always test annually" },
  { name: "Nitrates", risk: "high", note: "Agricultural areas especially — infant risk" },
  { name: "Arsenic", risk: "high", note: "Southwest, West — naturally occurring" },
  { name: "Lead", risk: "high", note: "Old well casings, pre-1986 household plumbing" },
  { name: "PFAS", risk: "moderate", note: "Near military bases, airports, industrial sites" },
  { name: "Radon", risk: "moderate", note: "Granite geology, Northeast, Southeast" },
  { name: "Hardness", risk: "low", note: "Equipment and plumbing — not a health hazard" },
  { name: "Iron & Manganese", risk: "low", note: "Taste, staining — aesthetic concern" },
];

const riskColors: Record<string, string> = {
  high: "text-wur-warning bg-wur-warning-bg border-wur-warning-border",
  moderate: "text-wur-caution bg-wur-caution-bg border-wur-caution-border",
  low: "text-emerald-700 bg-emerald-50 border-emerald-200",
};

export default function WellWaterPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Well Water</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Private Well Water Guide
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            Over 43 million Americans rely on private wells. Unlike public water systems, private wells
            are <strong className="text-white/90">not federally regulated</strong> — testing, treatment,
            and maintenance are entirely the homeowner&apos;s responsibility.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 bg-wur-warning-bg border border-wur-warning-border text-wur-warning rounded-lg px-4 py-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <p className="text-sm font-medium">
              Private wells have no mandatory testing requirements. The EPA recommends annual testing at minimum.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Key fact */}
        <section className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-6 mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Why This Matters</p>
          <p className="text-foreground leading-relaxed max-w-3xl">
            Public water systems serving 25 or more people are regulated under the Safe Drinking Water Act
            and must test water regularly, report results to the public, and fix violations. Private wells
            serving fewer than 25 people have none of these requirements. Contamination that would trigger
            a public health notice for a utility can go undetected in a private well for years.
          </p>
        </section>

        {/* How to approach testing */}
        <section className="mb-14">
          <h2 className="font-display text-3xl text-foreground mb-8">How to Approach Well Water Testing</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {universalSteps.map((step) => (
              <div key={step.step} className="flex flex-col p-5 rounded-xl border border-border bg-card">
                <span className="font-mono text-xs text-wur-teal mb-3">{step.step}</span>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Common contaminants */}
        <section className="mb-14">
          <h2 className="font-display text-3xl text-foreground mb-3">
            What to Test For — Common Well Water Contaminants
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            The right tests depend on your location, nearby land use, and well age. These are the most
            commonly detected or risk-relevant contaminants across U.S. private wells.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {commonContaminants.map((c) => (
              <div key={c.name} className="p-4 rounded-lg border border-border bg-card flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <FlaskConical className="w-4 h-4 text-muted-foreground" />
                  <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${riskColors[c.risk]}`}>
                    {c.risk}
                  </span>
                </div>
                <p className="font-medium text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* State guides */}
        <section className="mb-14">
          <h2 className="font-display text-3xl text-foreground mb-3">State-Specific Well Water Guides</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Contaminant risks, testing requirements, and lab referral programs vary by state. Select your
            state for location-specific guidance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {wellWaterGuides.map((guide) => {
              const state = states.find((s) => s.slug === guide.stateSlug);
              return (
                <Link
                  key={guide.stateSlug}
                  href={`/well-water/${guide.stateSlug}`}
                  className="group relative flex flex-col p-5 rounded-xl border border-border bg-card hover:border-wur-teal/50 hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 text-[64px] font-display text-wur-teal/6 group-hover:text-wur-teal/10 leading-none select-none">
                    {guide.stateAbbr}
                  </div>
                  <Droplets className="w-4 h-4 text-wur-teal mb-3" />
                  <h3 className="font-semibold text-foreground group-hover:text-wur-teal transition-colors mb-1">
                    {guide.stateName} Well Water Guide
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{guide.summary}</p>
                  <div className="mt-auto">
                    <p className="text-xs text-muted-foreground mb-1.5">Key risks:</p>
                    <div className="flex flex-wrap gap-1">
                      {guide.commonRisks.slice(0, 2).map((r, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {r.split("(")[0].trim().slice(0, 30)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-wur-teal mt-3">
                    View {guide.stateName} guide
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
          {states.length > wellWaterGuides.length && (
            <p className="text-sm text-muted-foreground mt-4">
              Well water guides for additional states will be added as coverage expands in Phase 2.
            </p>
          )}
        </section>

        {/* EPA resources */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-wur-teal mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">Official EPA Well Water Resources</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                The EPA&apos;s Private Wells program is the authoritative federal resource for well owners.
                It includes guidance on testing, treatment, and finding certified labs.
              </p>
              <a
                href="https://www.epa.gov/privatewells"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:underline"
              >
                EPA Private Wells Program <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
