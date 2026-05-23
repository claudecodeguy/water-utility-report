"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ExternalLink, AlertCircle, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const canonicalUrl = "https://waterutilityreport.com/water-charities";

// GA4 helpers — wrappers so JSX stays clean
function trackCharity(name: string) {
  trackEvent("charity_external_click", { organization: name, page_path: typeof window !== "undefined" ? window.location.pathname : "" });
}
function trackTestingAssistance() {
  trackEvent("testing_assistance_click", { page_path: typeof window !== "undefined" ? window.location.pathname : "" });
}
function trackLocalHealth() {
  trackEvent("local_health_department_click", { page_path: typeof window !== "undefined" ? window.location.pathname : "" });
}
function trackUtilityLookup() {
  trackEvent("utility_lookup_click_from_charity_page", { page_path: typeof window !== "undefined" ? window.location.pathname : "" });
}

interface OrgCard {
  name: string;
  typeOfWork: string;
  geographicFocus: string;
  website: string;
  evaluator?: { label: string; url: string };
  note: string;
}

const globalOrgs: OrgCard[] = [
  {
    name: "Water.org",
    typeOfWork: "Financing access to safe water and sanitation through microloans and local partnerships",
    geographicFocus: "Africa, Asia, Latin America",
    website: "https://water.org",
    evaluator: { label: "Charity Navigator", url: "https://www.charitynavigator.org/search?q=water.org" },
    note: "Programs, financials, and ratings change over time. Verify current status before donating.",
  },
  {
    name: "charity: water",
    typeOfWork: "Funding water projects in developing countries through transparent, fully allocated giving",
    geographicFocus: "Sub-Saharan Africa, Asia, Latin America",
    website: "https://www.charitywater.org",
    evaluator: { label: "Charity Navigator", url: "https://www.charitynavigator.org/search?q=charity+water" },
    note: "Programs, financials, and ratings change over time. Verify current status before donating.",
  },
  {
    name: "WaterAid",
    typeOfWork: "International NGO focused on water, sanitation, and hygiene (WASH) in underserved communities",
    geographicFocus: "Africa, Asia, Pacific, Latin America",
    website: "https://www.wateraid.org/us",
    evaluator: { label: "Charity Navigator", url: "https://www.charitynavigator.org/ein/131685039" },
    note: "Programs, financials, and ratings change over time. Verify current status before donating.",
  },
  {
    name: "Evidence Action / Dispensers for Safe Water",
    typeOfWork: "Evidence-based chlorine dispenser programs improving access to treated water at low cost",
    geographicFocus: "Kenya, Uganda, Malawi, Zambia",
    website: "https://www.evidenceaction.org/programs/safe-water-now",
    evaluator: { label: "GiveWell", url: "https://www.givewell.org/charities/dispensers-for-safe-water-December-2018-version" },
    note: "Evidence Action has reorganized programs in recent years. Verify current program status directly.",
  },
];

const usOrgs: OrgCard[] = [
  {
    name: "Local and State Health Departments",
    typeOfWork: "Many offer free or subsidized drinking water testing, lead testing, and well-water assistance for qualifying households",
    geographicFocus: "United States — varies by jurisdiction",
    website: "https://www.cdc.gov/public-health-gateway/php/index.html",
    note: "Programs and eligibility criteria vary widely by state and county. Contact your local health department directly to ask about current offerings.",
  },
  {
    name: "State Drinking Water Programs",
    typeOfWork: "State agencies administer Safe Drinking Water Act programs and often maintain lists of assistance resources and certified labs",
    geographicFocus: "United States — all 50 states",
    website: "https://www.epa.gov/sdwa",
    note: "State programs vary. Use the EPA's state contacts directory to find your state's program.",
  },
  {
    name: "Community Foundations",
    typeOfWork: "Local and regional foundations in some areas fund water-quality testing assistance, especially in disadvantaged communities",
    geographicFocus: "United States — varies by foundation",
    website: "https://cof.org/page/community-foundation-locator",
    note: "Community foundations are highly local. Use the Council on Foundations locator to find foundations in your area.",
  },
];

const wellOrgs: OrgCard[] = [
  {
    name: "EPA Private Well Class",
    typeOfWork: "Free educational resource on private well testing, maintenance, and contamination risks",
    geographicFocus: "United States",
    website: "https://www.epa.gov/privatewells",
    note: "This is a federal educational resource, not a testing assistance program.",
  },
  {
    name: "State Departments of Health / Environment",
    typeOfWork: "Some states offer free or subsidized well-water testing for qualifying households, especially for nitrate, coliform, and lead",
    geographicFocus: "United States — varies by state",
    website: "https://www.epa.gov/sdwa",
    note: "Eligibility and availability vary by state. Contact your state environmental or health agency directly.",
  },
];

const evaluationQuestions = [
  "What percentage of donations go directly to water programs vs. administrative and fundraising costs?",
  "Does the organization publish audited financial statements?",
  "Is the organization rated by Charity Navigator, GiveWell, or a similar independent evaluator?",
  "How does the organization measure and report the impact of its programs?",
  "Does the organization work in the geographic area or community type you want to support?",
  "Has the organization's work been independently evaluated or peer-reviewed?",
  "What is the organization's relationship with local governments and communities in program areas?",
];

const faqs = [
  {
    q: "Does Water Utility Report endorse any of the organizations listed here?",
    a: "No. Water Utility Report does not endorse, rank, or verify any charity or assistance program. This page lists examples of organizations working in this space to help you begin your own research.",
  },
  {
    q: "How do I find free water testing in my area?",
    a: "Start with your local or county health department — many offer free or subsidized testing for lead, nitrate, and coliform, especially for low-income households. Your state drinking water program may also maintain a list of assistance resources. Eligibility and availability vary widely.",
  },
  {
    q: "What is the difference between a global water charity and a U.S. drinking-water assistance program?",
    a: "Global water charities typically focus on access to water infrastructure in developing countries. U.S. drinking-water assistance programs focus on water quality testing, lead service line replacement, and affordability for residents on public or private water systems.",
  },
  {
    q: "How do I evaluate whether a water charity is legitimate?",
    a: "Review the organization's IRS Form 990 (public record), audited financial statements, and ratings on Charity Navigator, GiveWell, or a similar independent evaluator. Look for transparent program reporting and clear descriptions of how impact is measured.",
  },
  {
    q: "Can I look up my utility's official records while researching water issues?",
    a: "Yes. Water Utility Report aggregates official federal and state records for public water systems, including PFAS monitoring data, violation history, and Consumer Confidence Report links. Search by address, city, or utility name.",
  },
];

export default function WaterCharitiesPage() {
  useEffect(() => {
    trackEvent("water_charity_resource_view", { page_path: window.location.pathname });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Structured data injected via script tags — Next.js App Router inline script */}
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://waterutilityreport.com" },
                { "@type": "ListItem", position: 2, name: "Water Charities & Assistance", item: canonicalUrl },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: "Water Charities & Assistance Resources",
              description:
                "A neutral resource page explaining ways to support clean water access, water testing, and drinking-water transparency. Water Utility Report does not rank, endorse, or verify charities.",
              url: canonicalUrl,
              publisher: { "@type": "Organization", name: "Water Utility Report", url: "https://waterutilityreport.com" },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ]),
        }}
      />

      {/* Hero */}
      <div className="bg-wur-ink text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-3">Resource</p>
          <h1 className="font-display text-4xl text-white mb-4 leading-tight">
            Water Charities & Assistance
          </h1>
          <p className="text-white/65 leading-relaxed text-base max-w-2xl">
            This page explains ways people can support clean water access, water testing, and
            drinking-water transparency. Water Utility Report does not rank, endorse, or verify charities.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">

        {/* Top disclaimer */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Disclaimer:</strong> Water Utility Report does not endorse or verify any charity,
            nonprofit, or assistance program listed on this page. Programs, financials, and ratings
            can change. Review each organization&apos;s current programs, financials, third-party ratings,
            and local impact before donating or applying for assistance.
          </p>
        </div>

        {/* Section 1 — Global orgs */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-1">Global Clean Water and Sanitation Organizations</h2>
          <p className="text-sm text-muted-foreground mb-6">
            These organizations work internationally on access to water infrastructure and sanitation.
            They are listed here as examples — not endorsements or rankings.
          </p>
          <div className="space-y-4">
            {globalOrgs.map((org) => (
              <OrgCard key={org.name} org={org} onExternalClick={() => trackCharity(org.name)} />
            ))}
          </div>
        </section>

        {/* Section 2 — US assistance */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-1">U.S. Drinking-Water and Testing Assistance</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Assistance for U.S. residents is largely administered through state and local programs.
            Eligibility and availability vary significantly by location.
          </p>
          <div className="space-y-4">
            {usOrgs.map((org) => (
              <OrgCard
                key={org.name}
                org={org}
                onExternalClick={() => {
                  trackCharity(org.name);
                  if (org.name.toLowerCase().includes("health")) trackLocalHealth();
                  else trackTestingAssistance();
                }}
              />
            ))}
          </div>
        </section>

        {/* Section 3 — Well testing */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-1">Private Well Testing Support</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Private wells are not regulated by the Safe Drinking Water Act. Testing and maintenance
            are the owner&apos;s responsibility. Some state programs offer assistance.
          </p>
          <div className="space-y-4">
            {wellOrgs.map((org) => (
              <OrgCard key={org.name} org={org} onExternalClick={() => { trackCharity(org.name); trackTestingAssistance(); }} />
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Looking for a certified lab?{" "}
              <Link
                href="/labs/well-water-testing"
                className="text-wur-teal underline underline-offset-2 hover:text-wur-teal/80"
                onClick={trackTestingAssistance}
              >
                See our private well testing guide
              </Link>{" "}
              or{" "}
              <Link
                href="/labs"
                className="text-wur-teal underline underline-offset-2 hover:text-wur-teal/80"
                onClick={trackTestingAssistance}
              >
                find a certified lab by state
              </Link>.
            </p>
          </div>
        </section>

        {/* Section 4 — How to evaluate */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-1">How to Evaluate a Water Charity</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Independent evaluators — including Charity Navigator, GiveWell, and the Better Business
            Bureau Wise Giving Alliance — assess nonprofits on financial health, transparency, and
            accountability. No evaluator covers every organization, and ratings change over time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              { label: "Charity Navigator", url: "https://www.charitynavigator.org", note: "Ratings for U.S. nonprofits" },
              { label: "GiveWell", url: "https://www.givewell.org", note: "Evidence-based global giving research" },
              { label: "BBB Wise Giving Alliance", url: "https://give.org", note: "Accreditation standards for U.S. charities" },
            ].map((ev) => (
              <a
                key={ev.label}
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4 hover:border-wur-teal/40 transition-colors group"
                onClick={() => trackEvent("charity_external_click", { organization: ev.label, page_path: typeof window !== "undefined" ? window.location.pathname : "" })}
              >
                <span className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors flex items-center gap-1.5">
                  {ev.label} <ExternalLink className="w-3 h-3" />
                </span>
                <span className="text-xs text-muted-foreground">{ev.note}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Section 5 — Questions to ask */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-1">Questions to Ask Before Donating</h2>
          <p className="text-sm text-muted-foreground mb-5">
            These questions apply to any water-related nonprofit or charity, regardless of size or reputation.
          </p>
          <div className="space-y-2.5">
            {evaluationQuestions.map((q, i) => (
              <div key={i} className="flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-wur-teal mt-0.5 shrink-0" />
                <p className="text-sm text-foreground leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6 — How this connects to records */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-2">How This Connects to Official Water Records</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            Water Utility Report aggregates official federal and state records for public water systems —
            including PFAS monitoring data, violation history, and Consumer Confidence Report links.
            Understanding what your utility&apos;s records show is a starting point for understanding local
            water issues — which may inform the type of charitable or advocacy work you choose to support.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { href: "/search", label: "Look up your utility", desc: "Search by address, city, or utility name", onClick: trackUtilityLookup },
              { href: "/labs", label: "Find a certified testing lab", desc: "State-certified labs for tap and well water", onClick: trackTestingAssistance },
              { href: "/labs/pfas-water-testing", label: "PFAS testing guide", desc: "What PFAS tests cover and how to read results", onClick: trackTestingAssistance },
              { href: "/labs/well-water-testing", label: "Private well testing", desc: "What to test, how often, and what results mean", onClick: trackTestingAssistance },
              { href: "/learn/how-to-read-a-water-quality-report", label: "How to read a water quality report", desc: "Understanding your Consumer Confidence Report" },
              { href: "/methodology", label: "Our methodology", desc: "How Water Utility Report sources and displays data" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-wur-teal/40 transition-colors group"
                onClick={link.onClick}
              >
                <ArrowRight className="w-4 h-4 text-wur-teal mt-0.5 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                <div>
                  <p className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors">{link.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Save utility CTA */}
        <section className="rounded-xl bg-wur-ink p-6">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-wur-aqua mt-0.5 shrink-0" />
            <div>
              <p className="text-base font-semibold text-white mb-1">Track your utility&apos;s records</p>
              <p className="text-sm text-white/65 leading-relaxed mb-4">
                Save your water utility and get notified when official records change — including PFAS
                sampling results, violation records, and Consumer Confidence Report updates.
              </p>
              <Link
                href="/search"
                onClick={trackUtilityLookup}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-wur-aqua text-white text-sm font-semibold hover:bg-wur-aqua/85 transition-colors"
              >
                Search your utility <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Section 7 — What this page does not mean */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-3">What This Page Does Not Mean</h2>
          <div className="space-y-2.5">
            {[
              "Water Utility Report does not endorse, rank, recommend, or verify any charity, nonprofit, or assistance program listed on this page.",
              "This page does not determine whether any water supply is safe or unsafe to drink.",
              "Organizations listed here are examples — inclusion does not imply superior effectiveness, financial health, or local relevance.",
              "Ratings, programs, and eligibility criteria for listed organizations can change. Always verify current status directly with each organization.",
              "This page is not affiliated with any charity or assistance program and does not collect donations.",
              "Internal links to Water Utility Report pages go to official-records data — not to emergency alerts or water-safety determinations.",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <h2 className="font-display text-2xl text-foreground mb-5">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border border-border bg-card p-5">
                <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function OrgCard({ org, onExternalClick }: { org: OrgCard; onExternalClick?: () => void }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-3">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="text-base font-semibold text-foreground">{org.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{org.geographicFocus}</p>
        </div>
        <a
          href={org.website}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onExternalClick}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-wur-teal border border-wur-teal/30 rounded-md px-3 py-1.5 hover:bg-wur-teal/5 transition-colors shrink-0"
        >
          Official site <ExternalLink className="w-3 h-3" />
        </a>
      </div>
      <p className="text-sm text-foreground/80 leading-relaxed">{org.typeOfWork}</p>
      {org.evaluator && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Independent evaluation:</span>
          <a
            href={org.evaluator.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onExternalClick}
            className="inline-flex items-center gap-1 text-xs text-wur-teal hover:underline"
          >
            {org.evaluator.label} <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
      <p className="text-xs text-muted-foreground italic border-t border-border pt-2.5">{org.note}</p>
    </div>
  );
}
