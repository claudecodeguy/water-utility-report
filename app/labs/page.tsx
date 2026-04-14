import Link from "next/link";
import { ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certified Water Testing Labs — Find a Lab by State",
  description:
    "Find EPA-approved and state-certified drinking water testing labs by state. Includes private well testing, PFAS, lead, nitrates, and full panel analysis.",
  robots: { index: false, follow: false },
};

export default function LabsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-teal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/50 mb-2">Testing Labs</p>
          <h1 className="font-display text-4xl text-white mb-3">Find a Certified Water Testing Lab</h1>
          <p className="text-white/65 max-w-2xl leading-relaxed">
            Use a state-certified or NELAP-accredited lab for drinking water and private
            well testing. Always verify current certification directly with the lab or your state program
            before submitting samples.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Important disclaimer */}
        <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-5 mb-10">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-wur-caution mb-1">Verify Before Submitting Samples</p>
              <p className="text-sm text-wur-caution/80 leading-relaxed">
                Lab certifications change. Always confirm that a lab&apos;s current certification covers the
                specific contaminants you need tested before submitting samples. Check with your state&apos;s
                laboratory certification program for the authoritative, up-to-date list.
              </p>
            </div>
          </div>
        </div>

        {/* EPA Lab Finder — primary CTA */}
        <section className="rounded-xl border border-wur-teal/30 bg-wur-teal/5 p-8 mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Authoritative Resource</p>
          <h2 className="font-display text-2xl text-foreground mb-3">EPA National Certified Lab Directory</h2>
          <p className="text-muted-foreground leading-relaxed mb-6 max-w-xl mx-auto">
            The EPA maintains the definitive national database of certified drinking water testing
            laboratories organized by state and contaminant type. This is the most comprehensive and
            current resource — always use it to find certified labs.
          </p>
          <a
            href="https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-white bg-wur-teal border border-wur-teal rounded-md px-5 py-2.5 hover:bg-wur-teal/90 transition-colors"
          >
            Search EPA Certified Lab Database <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </section>

        {/* How to choose a lab */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5">How to Choose a Water Testing Lab</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Match certification to contaminant",
                desc: "Not all labs are certified for all tests. A lab may be NELAP accredited but not specifically certified for PFAS analysis using EPA Method 533 or 537.1. Ask for the specific certification before submitting.",
              },
              {
                title: "Use state-certified labs for legal purposes",
                desc: "If results will be used for regulatory compliance, real estate transactions, or formal documentation, the lab must be certified by your state program — not just nationally accredited.",
              },
              {
                title: "Mail-in kits vs. local labs",
                desc: "Many certified labs offer mail-in sampling kits with chain-of-custody forms. These are valid for most purposes. Local labs can provide faster turnaround and in-person guidance on sampling technique.",
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

        {/* State lab programs */}
        <section className="mb-12">
          <h2 className="font-display text-2xl text-foreground mb-5">State Certification Programs</h2>
          <p className="text-muted-foreground mb-5 max-w-2xl">
            Each state runs its own laboratory certification program. These are the authoritative sources
            for finding certified labs in your state.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { state: "California", abbr: "CA", url: "https://www.waterboards.ca.gov/drinking_water/certlic/labs/", label: "SWRCB Laboratory Accreditation" },
              { state: "Texas", abbr: "TX", url: "https://www.tceq.texas.gov/agency/water_main.html", label: "TCEQ Water Programs" },
              { state: "Florida", abbr: "FL", url: "https://www.floridahealth.gov/environmental-health/drinking-water/", label: "FDOH Drinking Water Program" },
              { state: "Arizona", abbr: "AZ", url: "https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water", label: "EPA Certified Labs — Arizona" },
              { state: "Ohio", abbr: "OH", url: "https://www.epa.gov/dwlabcert/contact-information-certification-programs-and-certified-laboratories-drinking-water", label: "EPA Certified Labs — Ohio" },
            ].map((s) => (
              <a
                key={s.abbr}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start justify-between gap-3 p-5 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-semibold text-foreground group-hover:text-wur-teal transition-colors text-sm">{s.state}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground/40 group-hover:text-wur-teal shrink-0 mt-0.5 transition-colors" />
              </a>
            ))}
          </div>
        </section>

        {/* Well water guide links */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <h3 className="font-semibold text-foreground mb-2">Testing Private Well Water?</h3>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            Private well testing requirements vary by state. See our state-specific well water guides
            for testing recommendations and links to each state&apos;s certified lab program.
          </p>
          <Link
            href="/well-water"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:underline"
          >
            View Well Water Testing Guides →
          </Link>
        </section>
      </div>
    </div>
  );
}
