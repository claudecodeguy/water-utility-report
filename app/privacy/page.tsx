import Link from "next/link";
import { ArrowLeft, Shield, Cookie, Database, Share2, Baby, Globe, Mail, Bell } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Water Utility Report",
  description:
    "How Water Utility Report collects, uses, and protects information from visitors, including analytics, cookies, and your privacy rights under CCPA and GDPR.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white mb-5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Home
          </Link>
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-3">Legal</p>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            What information we collect when you visit Water Utility Report, how we use it, and
            the choices and rights you have.
          </p>
          <p className="text-white/35 text-xs mt-4">Last updated: August 20, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Summary */}
        <section className="rounded-xl border border-border bg-muted/40 p-6">
          <p className="text-sm text-foreground font-semibold mb-2 uppercase tracking-wide">In short</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Water Utility Report (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;the site&rdquo;) does not require
            an account and does not collect sensitive personal information to browse the site. We use
            standard web analytics to understand traffic and improve our content, and we collect the
            information you voluntarily provide when you contact us. We do not sell your personal
            information.
          </p>
        </section>

        {/* Information we collect */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Database className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Information We Collect</h2>
          </div>
          <div className="space-y-3">
            {[
              {
                title: "Information you provide directly",
                detail:
                  "If you contact us by email or through a form on this site, we collect the information you include — such as your name, email address, and the content of your message. We use this only to respond to your inquiry.",
              },
              {
                title: "Usage and device data (automatically collected)",
                detail:
                  "Like most websites, we automatically log standard technical data when you visit: IP address, browser type, device type, operating system, referring URL, pages viewed, and timestamps. This is collected through our analytics and tag-management tools, described below.",
              },
              {
                title: "Location data (approximate)",
                detail:
                  "If you use ZIP code or address search features, we process the location you enter to return matching utilities. This lookup happens per-request and is not tied to a persistent user profile.",
              },
              {
                title: "Cookies and similar technologies",
                detail:
                  "We use cookies and similar technologies (such as browser local storage and tracking pixels) for analytics and to understand how visitors find and use the site. See the Cookies section below for details.",
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cookies & analytics */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Cookie className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Cookies, Analytics & Tracking Tools</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
            We use the following third-party tools to understand site traffic and marketing
            performance. These tools may set cookies or use similar identifiers in your browser.
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Google Analytics",
                detail:
                  "We use Google Analytics (GA4) to measure page views, traffic sources, and general usage patterns in aggregate. Google Analytics may use cookies and device identifiers. You can opt out using the Google Analytics Opt-out Browser Add-on, or by adjusting your browser's cookie settings.",
              },
              {
                name: "Marketing and attribution tags",
                detail:
                  "We use a tag-management script to track marketing attribution — for example, which channel or campaign referred a visitor to the site. This tool may set first- or third-party cookies and read standard browser and request data. It does not collect financial information, government IDs, or health information.",
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">{item.name}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mt-4">
            Most browsers let you refuse or delete cookies through their settings. Blocking cookies
            may affect some site functionality but will not prevent you from reading our content.
          </p>
        </section>

        {/* How we use information */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Shield className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">How We Use Information</h2>
          </div>
          <ul className="space-y-2 text-sm text-muted-foreground max-w-2xl">
            {[
              "To operate, maintain, and improve the site and its content",
              "To understand aggregate traffic patterns, popular pages, and how visitors find us",
              "To respond to inquiries, corrections requests, and press or licensing questions sent to us",
              "To detect, prevent, and address technical issues, abuse, or security incidents",
              "To measure the performance of our own marketing and outreach efforts",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-wur-teal mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-2xl">
            We do not use the information we collect to make automated decisions with legal or
            similarly significant effects on you.
          </p>
        </section>

        {/* Sharing */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Share2 className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">How We Share Information</h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              We do not sell your personal information. We share information only in the following
              limited circumstances:
            </p>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {[
                "With service providers who help us operate the site — such as our hosting provider, analytics providers, and marketing/tag-management vendors — bound by their own privacy and data-processing terms",
                "If required by law, subpoena, or legal process, or to protect the rights, property, or safety of Water Utility Report, our users, or the public",
                "In connection with a merger, acquisition, or sale of assets, in which case information may be transferred as part of that transaction",
                "With your consent, or at your direction",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-2 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Your rights */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Globe className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Your Privacy Rights</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "California residents (CCPA/CPRA)",
                detail:
                  "You have the right to know what personal information we collect, request deletion of your information, and opt out of the sale or sharing of personal information. We do not sell personal information. To exercise these rights, contact us at the email below.",
              },
              {
                title: "EU/UK/EEA residents (GDPR)",
                detail:
                  "If you are located in the European Economic Area or United Kingdom, you have the right to access, correct, delete, or export your personal data, and to object to or restrict certain processing. Our legal basis for processing is typically our legitimate interest in operating and improving the site, or your consent for optional cookies.",
              },
              {
                title: "Access, correction & deletion",
                detail:
                  "You may request a copy of the personal information we hold about you, ask us to correct it, or ask us to delete it. We will respond to verified requests within the timeframe required by applicable law.",
              },
              {
                title: "Do Not Track",
                detail:
                  "Some browsers offer a \"Do Not Track\" signal. There is no common industry standard for responding to these signals, so our site does not currently change its behavior when it receives one.",
              },
            ].map((item, i) => (
              <div key={i} className="p-5 rounded-lg border border-border bg-card">
                <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Children */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Baby className="w-5 h-5 text-wur-caution" />
            <h2 className="font-display text-2xl text-foreground">Children&apos;s Privacy</h2>
          </div>
          <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6">
            <p className="text-sm text-wur-caution/90 leading-relaxed">
              Water Utility Report is intended for a general audience and is not directed to
              children under 13. We do not knowingly collect personal information from children
              under 13. If you believe a child has provided us with personal information, please
              contact us so we can delete it.
            </p>
          </div>
        </section>

        {/* Data retention & security */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-2xl text-foreground">Data Retention & Security</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            We retain information only for as long as reasonably necessary for the purposes
            described in this policy, or as required by law. We use reasonable administrative and
            technical safeguards to protect information in our custody, but no method of
            transmission or storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </section>

        {/* Changes */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-2xl text-foreground">Changes to This Policy</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            We may update this Privacy Policy from time to time to reflect changes in our practices
            or for legal, operational, or regulatory reasons. We will update the &ldquo;Last
            updated&rdquo; date above when we do. Material changes will be reflected on this page.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-center gap-2.5 mb-2">
            <Mail className="w-4 h-4 text-wur-teal" />
            <h3 className="font-semibold text-foreground">Questions About This Policy</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For privacy questions, data access, correction, or deletion requests, contact us at{" "}
            <a href="mailto:privacy@waterutilityreport.com" className="text-wur-teal hover:underline">
              privacy@waterutilityreport.com
            </a>.
          </p>
        </section>

        {/* Back */}
        <div className="pt-4 border-t border-border flex gap-6">
          <Link
            href="/terms"
            className="inline-flex items-center gap-1.5 text-sm text-wur-teal hover:underline"
          >
            Terms of Service →
          </Link>
          <Link
            href="/methodology/legal"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Legal & Usage Boundaries →
          </Link>
        </div>
      </div>
    </div>
  );
}
