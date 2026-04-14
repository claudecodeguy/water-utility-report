import Link from "next/link";
import { Droplets } from "lucide-react";

const footerLinks = {
  Directory: [
    { href: "/states", label: "Browse by State" },
    { href: "/contaminants", label: "Contaminants" },
    { href: "/treatment", label: "Treatment Methods" },
    { href: "/labs", label: "Certified Labs" },
    { href: "/well-water", label: "Well Water Guide" },
  ],
  Guides: [
    { href: "/guides", label: "All Guides" },
    { href: "/guides/best-filter-for-lead-in-tap-water", label: "Best Filter for Lead" },
    { href: "/guides/best-filter-for-pfas-in-drinking-water", label: "Best Filter for PFAS" },
    { href: "/guides/reverse-osmosis-vs-carbon-filter", label: "RO vs Carbon Filter" },
    { href: "/guides/how-to-read-a-water-quality-report", label: "Read a Water Report" },
  ],
  About: [
    { href: "/methodology", label: "Our Methodology" },
    { href: "/methodology/data-sources", label: "Data Sources" },
    { href: "/methodology/legal", label: "Legal & Disclaimer" },
    { href: "/about", label: "About WUR" },
    { href: "/contact", label: "Contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-wur-ink text-white/80">
      {/* Disclaimer bar */}
      <div className="bg-wur-teal-dark border-b border-white/10 py-3 px-4">
        <p className="max-w-7xl mx-auto text-xs text-white/60 text-center">
          Water Utility Report provides informational content sourced from official U.S. government and public datasets. This site is not a substitute for professional water testing, utility confirmation, or medical advice.{" "}
          <Link href="/methodology/legal" className="underline hover:text-white/80 transition-colors">
            Full disclaimer
          </Link>
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white mb-4">
              <Droplets className="w-5 h-5" />
              <span className="font-display text-lg">
                Water Utility <em className="text-white/50">Report</em>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-4">
              Utility-first drinking water intelligence for U.S. households. Built on official EPA and public data.
            </p>
            <p className="text-xs text-white/35 font-mono">
              WaterUtilityReport.com
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="text-xs text-white/30">
            © 2025 Water Utility Report. Data sourced from EPA SDWIS, ECHO, and public Water Quality Portal datasets.
          </p>
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-wur-aqua" />
            <span className="text-xs text-white/30 font-mono">Stage 1 — 5 states active</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
