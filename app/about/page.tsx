import Link from "next/link";
import { ArrowRight, Database, Shield, RefreshCw, Users } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — Water Utility Report",
  description:
    "Water Utility Report is a U.S. drinking water intelligence platform built on official EPA and public datasets. Learn about our mission, data approach, and methodology.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-3">About</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight max-w-2xl">
            Drinking Water Intelligence for U.S. Households
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            Water Utility Report translates official EPA and public government data into clear,
            utility-specific water quality information that anyone can understand and act on.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Mission */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Most Americans have no easy way to understand what's in their tap water. Consumer
            Confidence Reports exist, but they are annual PDFs written in regulatory language —
            hard to find, harder to interpret. The data that utilities report to the EPA is public
            record, but it's scattered across government databases that require technical expertise
            to navigate.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Water Utility Report ingests those official datasets and presents them in a
            utility-first format: one page per water system, showing risk level, detected
            contaminants, violations, treatment options, and source citations — without
            speculation or alarmism.
          </p>
        </section>

        {/* Principles */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-6">How We Work</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: Database,
                title: "Official data only",
                desc: "Every fact on this site traces back to a named government dataset — EPA SDWIS, ECHO, Consumer Confidence Reports, or the Water Quality Portal. We do not generate or infer contaminant data.",
              },
              {
                icon: Shield,
                title: "No fear-based framing",
                desc: "We report what the data says. A utility with no open violations gets a 'Safe' classification, even if it serves an industrial region. Risk levels reflect actual violation and detection records.",
              },
              {
                icon: RefreshCw,
                title: "Transparent versioning",
                desc: "Each page shows when its data was last updated and which source it came from. We track ingestion dates and confidence scores so you know how fresh and reliable each data point is.",
              },
              {
                icon: Users,
                title: "Built for households",
                desc: "The primary audience is someone who just got their water bill and wants to know what's in it. We optimize for clarity and directness, not technical completeness.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-5 rounded-xl border border-border bg-card">
                <Icon className="w-4 h-4 text-wur-teal mb-3" />
                <h3 className="font-semibold text-foreground text-sm mb-2">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Current Coverage</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Water Utility Report is currently in Stage 1, covering five states with full utility
            pages: California, Texas, Florida, Arizona, and Ohio. These states represent over
            100 million residents and include a mix of large municipal systems, smaller community
            utilities, and significant private well populations.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Contaminant detection data from Consumer Confidence Reports is being ingested on a
            rolling basis. Utility pages are published when data quality meets our confidence
            threshold.
          </p>
        </section>

        {/* Links */}
        <section className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/methodology"
            className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal hover:underline"
          >
            Read our full methodology <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/methodology/data-sources"
            className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal hover:underline"
          >
            See all data sources <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal hover:underline"
          >
            Contact us <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </div>
    </div>
  );
}
