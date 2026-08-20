import Link from "next/link";
import { ArrowLeft, FileText, ShieldCheck, Ban, Scale, AlertTriangle, RefreshCw, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Water Utility Report",
  description:
    "The terms and conditions governing your use of Water Utility Report, including acceptable use, disclaimers, liability, and governing law.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-white/65 max-w-2xl leading-relaxed text-lg">
            The terms and conditions that govern your use of Water Utility Report. Please read
            them before using this site.
          </p>
          <p className="text-white/35 text-xs mt-4">Last updated: August 20, 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Acceptance */}
        <section className="rounded-xl border border-border bg-muted/40 p-6">
          <p className="text-sm text-foreground font-semibold mb-2 uppercase tracking-wide">Acceptance of Terms</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            By accessing or using Water Utility Report (&ldquo;the site&rdquo;), you agree to be
            bound by these Terms of Service and our{" "}
            <Link href="/privacy" className="text-wur-teal hover:underline">Privacy Policy</Link>.
            If you do not agree to these terms, do not use the site.
          </p>
        </section>

        {/* Use of the site */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <FileText className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Use of the Site</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mb-4">
            Water Utility Report publishes informational content about U.S. drinking water utilities,
            derived from official government datasets. The site and its content are provided for
            personal, non-commercial, informational use. We grant you a limited, non-exclusive,
            non-transferable, revocable license to access and use the site for that purpose,
            subject to these Terms.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Detailed rules on citing, linking to, and reproducing our content are covered in our{" "}
            <Link href="/methodology/legal" className="text-wur-teal hover:underline">
              Legal & Usage Boundaries
            </Link>{" "}
            page, which is incorporated into these Terms by reference.
          </p>
        </section>

        {/* Acceptable use */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Ban className="w-5 h-5 text-wur-caution" />
            <h2 className="font-display text-2xl text-foreground">Acceptable Use</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4 max-w-2xl leading-relaxed">
            When using this site, you agree not to:
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground max-w-2xl">
            {[
              "Use the site for any unlawful purpose or in violation of any applicable local, state, national, or international law",
              "Attempt to gain unauthorized access to any part of the site, its servers, or any connected systems",
              "Interfere with or disrupt the site's operation, including through excessive automated requests, denial-of-service attempts, or circumventing rate limits",
              "Scrape, crawl, or harvest site content at scale in a way that places material load on our infrastructure or that is inconsistent with our robots.txt directives",
              "Misrepresent our data, or present modified versions of our content as unmodified original Water Utility Report content",
              "Use the site to transmit malware or any other harmful code",
              "Impersonate any person or entity, or misrepresent your affiliation with a person or entity",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-wur-caution mt-2 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-sm text-muted-foreground leading-relaxed mt-4 max-w-2xl">
            We may suspend or terminate your access to the site, without notice, for conduct that
            we believe violates these Terms or is otherwise harmful to the site or other users.
          </p>
        </section>

        {/* Intellectual property */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <ShieldCheck className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Intellectual Property</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            The Water Utility Report name, logo, site design, original written content — including
            summaries, FAQs, editorial framing, and analysis — are the property of Water Utility
            Report or its licensors and are protected by copyright, trademark, and other laws. The
            underlying factual data sourced from U.S. government agencies is not subject to
            copyright, as described in our{" "}
            <Link href="/methodology/legal" className="text-wur-teal hover:underline">
              Legal & Usage Boundaries
            </Link>{" "}
            page. Nothing in these Terms transfers ownership of any Water Utility Report
            intellectual property to you.
          </p>
        </section>

        {/* Disclaimers */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <AlertTriangle className="w-5 h-5 text-wur-caution" />
            <h2 className="font-display text-2xl text-foreground">Disclaimers</h2>
          </div>
          <div className="rounded-xl border border-wur-caution-border bg-wur-caution-bg p-6 space-y-3">
            <p className="text-sm text-wur-caution/90 leading-relaxed">
              The site and its content are provided <strong>&ldquo;as is&rdquo;</strong> and{" "}
              <strong>&ldquo;as available,&rdquo;</strong> without warranties of any kind, express
              or implied, including warranties of merchantability, fitness for a particular
              purpose, title, or non-infringement. We do not warrant that the site will be
              uninterrupted, error-free, or that information presented is complete, current, or
              accurate.
            </p>
            <p className="text-sm text-wur-caution/90 leading-relaxed">
              Water Utility Report is an informational resource, not a substitute for
              professional water testing, utility confirmation, or medical advice. Full health
              and data-accuracy disclaimers are set out in our{" "}
              <Link href="/methodology/legal" className="underline">
                Legal & Usage Boundaries
              </Link>{" "}
              page.
            </p>
          </div>
        </section>

        {/* Limitation of liability */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <Scale className="w-5 h-5 text-wur-teal" />
            <h2 className="font-display text-2xl text-foreground">Limitation of Liability</h2>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              To the maximum extent permitted by applicable law, Water Utility Report and its
              operators, employees, and licensors shall not be liable for any indirect,
              incidental, special, consequential, exemplary, or punitive damages, or any loss of
              data, revenue, or profits, arising from or related to your use of, or inability to
              use, the site — even if advised of the possibility of such damages.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              To the extent any liability is not excluded, our total aggregate liability for any
              claim arising from these Terms or your use of the site shall not exceed one hundred
              U.S. dollars ($100). Some jurisdictions do not allow the exclusion or limitation of
              certain damages, so some of the above limitations may not apply to you.
            </p>
          </div>
        </section>

        {/* Indemnification */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Indemnification</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            You agree to indemnify and hold harmless Water Utility Report and its operators from
            any claims, damages, losses, liabilities, and expenses (including reasonable
            attorneys&apos; fees) arising out of your violation of these Terms or your misuse of
            the site.
          </p>
        </section>

        {/* Third-party links */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Third-Party Links & Content</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            The site may link to third-party websites, government agencies, or resources that are
            not owned or controlled by Water Utility Report. We are not responsible for the
            content, accuracy, or practices of any third-party sites. Inclusion of a link does not
            imply endorsement.
          </p>
        </section>

        {/* Changes to terms */}
        <section>
          <div className="flex items-center gap-2.5 mb-5">
            <RefreshCw className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-2xl text-foreground">Changes to These Terms</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            We may revise these Terms from time to time. The updated version will be indicated by
            a revised &ldquo;Last updated&rdquo; date above. Continued use of the site after
            changes take effect constitutes acceptance of the revised Terms.
          </p>
        </section>

        {/* Governing law */}
        <section>
          <div className="flex items-center gap-2.5 mb-3">
            <Scale className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-display text-2xl text-foreground">Governing Law & Disputes</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            These Terms are governed by the laws of the United States and the State of Delaware,
            without regard to conflict of law principles. Any dispute arising from these Terms or
            your use of the site shall be brought exclusively in the state or federal courts
            located in Delaware, and you consent to the personal jurisdiction of those courts.
          </p>
        </section>

        {/* Severability */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-4">Severability</h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            If any provision of these Terms is found to be unenforceable or invalid, that
            provision will be limited or eliminated to the minimum extent necessary, and the
            remaining provisions will remain in full force and effect.
          </p>
        </section>

        {/* Contact */}
        <section className="rounded-xl border border-border bg-muted/30 p-6">
          <div className="flex items-center gap-2.5 mb-2">
            <Mail className="w-4 h-4 text-wur-teal" />
            <h3 className="font-semibold text-foreground">Questions About These Terms</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            For questions about these Terms of Service, contact us at{" "}
            <a href="mailto:legal@waterutilityreport.com" className="text-wur-teal hover:underline">
              legal@waterutilityreport.com
            </a>.
          </p>
        </section>

        {/* Back */}
        <div className="pt-4 border-t border-border flex gap-6">
          <Link
            href="/privacy"
            className="inline-flex items-center gap-1.5 text-sm text-wur-teal hover:underline"
          >
            Privacy Policy →
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
