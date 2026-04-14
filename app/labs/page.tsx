import Link from "next/link";
import { ExternalLink, FlaskConical, MapPin, CheckCircle2, AlertTriangle } from "lucide-react";
import { labs, states } from "@/lib/mock-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certified Water Testing Labs — Find a Lab by State",
  description:
    "Find EPA-approved and state-certified drinking water testing labs by state. Includes private well testing, PFAS, lead, nitrates, and full panel analysis.",
  robots: { index: false, follow: false },
};

export default function LabsPage() {
  const labsByState = states.map((state) => ({
    state,
    labs: labs.filter((l) => l.state === state.slug),
  })).filter((s) => s.labs.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Testing Labs</p>
          <h1 className="font-display text-4xl text-white mb-3">Certified Water Testing Labs</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            A curated list of state-certified and NELAP-accredited labs for drinking water and private
            well testing. Always verify current certification directly with the lab or your state program.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important disclaimer */}
        <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-5 mb-10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-wur-caution mb-1">Important — Verify Before Submitting Samples</p>
              <p className="text-sm text-wur-caution/80 leading-relaxed">
                Lab certifications change. Always confirm that a lab&apos;s current certification covers the
                specific contaminants you need tested before submitting samples. Check with your state&apos;s
                laboratory certification program for the authoritative, up-to-date list.
              </p>
            </div>
          </div>
        </div>

        {/* How to choose a lab */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5">How to Choose a Water Testing Lab</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Match certification to contaminant",
                desc: "Not all labs are certified for all tests. A lab may be NELAP accredited but not specifically certified for PFAS analysis using EPA Method 533. Ask for the specific certification before submitting.",
              },
              {
                title: "Use state-certified labs for legal/regulatory purposes",
                desc: "If results will be used for regulatory compliance, real estate transactions, or formal documentation, the lab must be certified by your state program — not just nationally accredited.",
              },
              {
                title: "Mail-in kits vs. local labs",
                desc: "Many certified labs offer mail-in sampling kits with chain-of-custody forms. These are valid for most purposes. Local labs can provide faster turnaround and in-person guidance.",
              },
            ].map((point, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card">
                <CheckCircle2 className="w-4 h-4 text-wur-teal mb-2" />
                <h3 className="font-semibold text-foreground text-sm mb-2">{point.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Labs by state */}
        {labsByState.map(({ state, labs: stateLabs }) => (
          <section key={state.slug} className="mb-12">
            <div className="flex items-center gap-3 mb-5">
              <MapPin className="w-4 h-4 text-wur-teal" />
              <h2 className="font-display text-2xl text-foreground">{state.name}</h2>
              <span className="text-xs font-mono text-muted-foreground">{stateLabs.length} labs listed</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stateLabs.map((lab) => (
                <div key={lab.slug} className="flex flex-col p-5 rounded-xl border border-border bg-card">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-start gap-2">
                      <FlaskConical className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                      <h3 className="font-semibold text-foreground">{lab.name}</h3>
                    </div>
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

                  <p className="text-xs text-muted-foreground mb-3 ml-6">{lab.serviceArea}</p>

                  {/* Certifications */}
                  <div className="ml-6 mb-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      Certifications
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {lab.certifications.map((cert, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-wur-teal/10 text-wur-teal border border-wur-teal/20">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tests */}
                  <div className="ml-6">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">
                      Tests Offered
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {lab.testsOffered.map((test, i) => (
                        <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-[10px] text-muted-foreground mt-3 ml-6 font-mono">
                    Last verified: {lab.lastUpdated}
                  </p>
                </div>
              ))}
            </div>

            {/* State lab directory link */}
            <div className="mt-3 flex items-center gap-2">
              <Link
                href={`/well-water/${state.slug}`}
                className="text-sm text-wur-teal hover:underline"
              >
                View {state.name} Well Water Guide
              </Link>
              <span className="text-muted-foreground">·</span>
              <a
                href={`https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-wur-teal transition-colors"
              >
                Full {state.abbreviation} certified lab list <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>
        ))}

        {/* EPA lab finder */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground mb-2">Find More Certified Labs — EPA National Directory</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            The EPA maintains the authoritative national database of certified drinking water testing
            laboratories by state and contaminant type. This is the most comprehensive and current resource
            for finding certified labs beyond our curated list.
          </p>
          <a
            href="https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal border border-wur-teal/40 rounded-md px-4 py-2.5 hover:bg-wur-teal/5 transition-colors"
          >
            EPA Certified Lab Directory <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>
      </div>
    </div>
  );
}
