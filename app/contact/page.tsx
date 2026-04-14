import Link from "next/link";
import { Mail, ArrowLeft, AlertTriangle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Water Utility Report",
  description: "Contact Water Utility Report for data corrections, utility page questions, or press inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> About
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-3">Contact</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Get in Touch
          </h1>
          <p className="text-white/65 max-w-xl leading-relaxed">
            For data corrections, utility page questions, or press inquiries.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        {/* Data correction notice */}
        <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-wur-caution mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-wur-caution mb-1">Data corrections take priority</p>
              <p className="text-sm text-wur-caution/80 leading-relaxed">
                If you believe a utility page contains an error — incorrect risk level, wrong
                population count, stale violation data — please include the PWSID, the incorrect
                field, and a link to the authoritative source in your message.
              </p>
            </div>
          </div>
        </div>

        {/* Contact options */}
        <section className="space-y-4">
          <div className="p-6 rounded-xl border border-border bg-card">
            <div className="flex items-center gap-3 mb-3">
              <Mail className="w-4 h-4 text-wur-teal" />
              <h2 className="font-semibold text-foreground">Email</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              For data corrections, utility inquiries, and press requests:
            </p>
            <a
              href="mailto:hello@waterutilityreport.com"
              className="text-sm font-medium text-wur-teal hover:underline"
            >
              hello@waterutilityreport.com
            </a>
          </div>
        </section>

        {/* What we can help with */}
        <section>
          <h2 className="font-display text-xl text-foreground mb-4">What We Can Help With</h2>
          <ul className="space-y-2.5">
            {[
              "Corrections to utility data (risk level, violations, population served)",
              "Missing utilities or incorrect service area information",
              "Broken links or pages that won't load",
              "Press and media inquiries",
              "Partnership or data collaboration requests",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* What we can't help with */}
        <section>
          <h2 className="font-display text-xl text-foreground mb-4">What We Can&apos;t Help With</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-3">
            We are an informational resource, not a regulatory body. We cannot:
          </p>
          <ul className="space-y-2.5">
            {[
              "File complaints with utilities or regulators on your behalf",
              "Confirm whether your specific tap water is safe to drink",
              "Provide water testing services or lab referrals",
              "Override official EPA or state agency determinations",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground mt-4">
            For water quality complaints, contact your utility directly or file a report with{" "}
            <a
              href="https://www.epa.gov/ground-water-and-drinking-water"
              target="_blank"
              rel="noopener noreferrer"
              className="text-wur-teal hover:underline"
            >
              EPA&apos;s drinking water program
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
