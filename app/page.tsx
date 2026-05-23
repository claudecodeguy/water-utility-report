import Link from "next/link";
import {
  ArrowRight, FlaskConical, Wrench, MapPin, ShieldCheck, Database,
  BookOpen, Shield, AlertTriangle,
} from "lucide-react";
import ConcernTiles from "@/components/concern-tiles";
import ZipLookup from "@/components/zip-lookup";
import JsonLd from "@/components/json-ld";
import stateContent from "@/lib/content/states";
import contaminants from "@/lib/content/contaminants";
import treatmentMethods from "@/lib/content/treatments";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Check Your Water Utility, PFAS Records & Violations | Water Utility Report",
  description:
    "Look up your water utility by ZIP, city, or name. Check PFAS records, violations, contaminants, labs, and official EPA-based drinking water reports.",
};

const featuredStateSlugs = [
  { slug: "california", name: "California", anchor: "drinking water utilities" },
  { slug: "texas", name: "Texas", anchor: "PFAS monitoring records" },
  { slug: "florida", name: "Florida", anchor: "water quality reports" },
  { slug: "new-york", name: "New York", anchor: "drinking water utilities" },
  { slug: "ohio", name: "Ohio", anchor: "water quality reports" },
  { slug: "pennsylvania", name: "Pennsylvania", anchor: "PFAS monitoring records" },
  { slug: "illinois", name: "Illinois", anchor: "drinking water utilities" },
  { slug: "michigan", name: "Michigan", anchor: "water utility reports" },
];


const aeoAnswers = [
  {
    q: "How do I find my water utility?",
    a: "Enter your ZIP code in the search box. WaterUtilityReport matches your ZIP to your public water system using EPA service area data, then shows detected contaminants, open violations, and PFAS records for that system.",
  },
  {
    q: "Where does this water quality data come from?",
    a: "All data comes from official U.S. government sources: EPA SDWIS for violations and utility records, EPA ECHO for compliance history, and EPA UCMR 5 for PFAS monitoring results. No proprietary scoring or estimates are used.",
  },
  {
    q: "Can I check PFAS records by city or utility?",
    a: "Yes. The PFAS Watchlist shows official EPA UCMR 5 monitoring results for public water systems nationwide. Search by utility name, PWSID, or browse by state. Results show detected compounds, concentrations, and sample dates.",
  },
  {
    q: "How often is this data updated?",
    a: "Violation and utility data from EPA SDWIS is ingested on a rolling basis. PFAS monitoring records reflect the UCMR 5 dataset covering the 2023–2025 monitoring period. Each report page shows a last-updated date and links to the original government source.",
  },
];

const methodologyPoints = [
  { icon: Database, label: "EPA SDWIS/ECHO datasets", desc: "Core utility and violation data" },
  { icon: BookOpen, label: "Consumer Confidence Reports", desc: "Annual CCR data from utilities" },
  { icon: ShieldCheck, label: "EPA Water Quality Portal", desc: "Supporting sampling data" },
  { icon: ShieldCheck, label: "State regulatory datasets", desc: "Where terms allow public use" },
];

const howItWorks = [
  {
    step: "01",
    title: "Enter your ZIP code",
    desc: "We match your ZIP to your likely public water utility using EPA service-area data.",
    icon: MapPin,
  },
  {
    step: "02",
    title: "See what's in your water",
    desc: "We surface key contaminants detected, their levels, and what they mean in plain English.",
    icon: FlaskConical,
  },
  {
    step: "03",
    title: "Understand your options",
    desc: "Matched treatment guidance, official report links, certified labs, and clear next steps.",
    icon: Wrench,
  },
];

const featuredContaminantSlugs = ["pfas", "lead", "nitrates", "disinfection-byproducts"];

export default async function HomePage() {
  const [dbStates, totalUtilities] = await Promise.all([
    prisma.state.findMany({
      select: { abbreviation: true, _count: { select: { utilities: true } } },
    }),
    prisma.utility.count(),
  ]);

  // unused but kept for potential future use
  void dbStates;

  const featuredContaminantData = contaminants.filter((c) =>
    featuredContaminantSlugs.includes(c.slug)
  );

  const riskColors: Record<string, string> = {
    safe: "text-wur-safe",
    low: "text-emerald-600",
    moderate: "text-wur-caution",
    high: "text-wur-warning",
    critical: "text-wur-danger",
  };
  const riskBgs: Record<string, string> = {
    safe: "bg-wur-safe-bg border-wur-safe-border",
    low: "bg-emerald-50 border-emerald-200",
    moderate: "bg-wur-caution-bg border-wur-caution-border",
    high: "bg-wur-warning-bg border-wur-warning-border",
    critical: "bg-wur-danger-bg border-wur-danger-border",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Water Utility Report",
    url: "https://waterutilityreport.com",
    description:
      "Look up your U.S. water utility, check PFAS records, active violations, and contaminant data from official EPA and federal monitoring sources.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://waterutilityreport.com/search?zip={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="topo-bg relative -mt-16 pt-16 min-h-[88vh] flex items-center overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1.5 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-wur-aqua animate-pulse" />
              <span className="text-xs text-white/70 font-medium tracking-wide">
                {stateContent.length} states · {totalUtilities > 0 ? `${totalUtilities.toLocaleString()}+` : "10,000+"} utilities · official data only
              </span>
            </div>

            <h1 className="font-display text-5xl sm:text-6xl text-white leading-[1.05] mb-5">
              Find Your<br />
              <em className="text-wur-aqua not-italic">Drinking Water Report</em>
            </h1>

            <p className="text-base text-white/65 leading-relaxed mb-8 max-w-xl">
              Search your ZIP code to look up your water utility, check for PFAS records, active violations,
              and contaminant data from official EPA and federal monitoring sources.
            </p>

            <ZipLookup variant="hero" />

            <div className="mt-5 flex items-center gap-4 flex-wrap">
              <span className="text-xs text-white/30">Or:</span>
              <Link href="/states" className="text-sm text-white/60 hover:text-white transition-colors">
                Browse all 50 states →
              </Link>
              <Link href="/pfas-watchlist" className="text-sm text-white/60 hover:text-white transition-colors">
                PFAS watchlist →
              </Link>
              <Link href="/compare" className="text-sm text-white/60 hover:text-white transition-colors">
                Compare utilities →
              </Link>
            </div>

            <div className="mt-7 pt-7 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-3.5 h-3.5 text-wur-teal shrink-0" />
                <p className="text-[11px] text-white/70 font-semibold uppercase tracking-wider">Official U.S. Government Data Sources</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "EPA SDWIS", gov: "echo.epa.gov", href: "https://echo.epa.gov/facilities/facility-search/results?regulation=sdwa" },
                  { name: "EPA UCMR 5", gov: "epa.gov/dwucmr", href: "https://www.epa.gov/dwucmr/fifth-unregulated-contaminant-monitoring-rule" },
                  { name: "EPA ECHO", gov: "echo.epa.gov", href: "https://echo.epa.gov" },
                  { name: "Water Quality Portal", gov: "waterqualitydata.us", href: "https://www.waterqualitydata.us" },
                ].map((src) => (
                  <a
                    key={src.name}
                    href={src.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-white/95 rounded-lg px-3 py-2 shadow-sm hover:bg-white transition-colors"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#005ea2] shrink-0" />
                    <div>
                      <p className="text-[11px] font-bold text-gray-900 leading-none">{src.name}</p>
                      <p className="text-[9px] text-[#005ea2] font-mono leading-tight mt-0.5">{src.gov}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero illustration */}
        <div className="absolute right-0 top-0 w-[52%] h-full pointer-events-none hidden xl:flex items-center justify-center pr-8">
          <svg viewBox="0 0 560 600" className="w-full max-w-2xl drop-shadow-2xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="pipeGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4db8b8" stopOpacity="0.3"/>
                <stop offset="50%" stopColor="#4db8b8" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#4db8b8" stopOpacity="0.3"/>
              </linearGradient>
              <linearGradient id="tankGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4db8b8" stopOpacity="0.25"/>
                <stop offset="100%" stopColor="#4db8b8" stopOpacity="0.06"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>
            {Array.from({length: 10}).map((_, row) =>
              Array.from({length: 14}).map((_, col) => (
                <circle key={`${row}-${col}`} cx={28 + col * 38} cy={40 + row * 56} r="1.5" fill="#4db8b8" opacity="0.1"/>
              ))
            )}
            <circle cx="280" cy="200" r="180" fill="#4db8b8" fillOpacity="0.04"/>
            <circle cx="280" cy="200" r="120" fill="#4db8b8" fillOpacity="0.04"/>
            <ellipse cx="60" cy="300" rx="38" ry="38" fill="#4db8b8" fillOpacity="0.12" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.6" filter="url(#glow)"/>
            <ellipse cx="60" cy="300" rx="25" ry="25" fill="#4db8b8" fillOpacity="0.18" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.8"/>
            <ellipse cx="60" cy="300" rx="14" ry="5" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
            <ellipse cx="60" cy="296" rx="9" ry="3" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
            <text x="60" y="347" textAnchor="middle" fill="#4db8b8" fontSize="9" fontFamily="monospace" opacity="0.7" letterSpacing="1">SOURCE</text>
            <rect x="98" y="294" width="404" height="14" rx="7" fill="url(#pipeGrad)"/>
            <rect x="98" y="295" width="404" height="4" rx="2" fill="#4db8b8" fillOpacity="0.4"/>
            {[160, 230, 300, 370, 430].map((x, i) => (
              <path key={i} d={`M${x},298 L${x+8},301 L${x},304`} stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
            ))}
            <rect x="147" y="210" width="10" height="90" rx="5" fill="#4db8b8" fillOpacity="0.6"/>
            <rect x="272" y="185" width="10" height="115" rx="5" fill="#4db8b8" fillOpacity="0.6"/>
            <rect x="397" y="215" width="10" height="85" rx="5" fill="#4db8b8" fillOpacity="0.6"/>
            <rect x="100" y="120" width="106" height="90" rx="10" fill="url(#tankGrad)" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.7"/>
            <rect x="102" y="162" width="102" height="46" rx="0 0 8 8" fill="#4db8b8" fillOpacity="0.15"/>
            <path d="M102,162 Q153,155 204,162" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
            {[116,130,144,158,172,186].map((x) => [170,178,186].map((y) => (
              <circle key={`f-${x}-${y}`} cx={x} cy={y} r="2.5" fill="#4db8b8" fillOpacity="0.35"/>
            )))}
            <text x="153" y="142" textAnchor="middle" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.9" letterSpacing="1.5">FILTER</text>
            <rect x="225" y="96" width="106" height="104" rx="10" fill="url(#tankGrad)" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.85" filter="url(#glow)"/>
            <rect x="227" y="162" width="102" height="36" rx="0 0 8 8" fill="#4db8b8" fillOpacity="0.2"/>
            <path d="M227,162 Q278,153 329,162" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>
            {[245,262,278,295,312].map((x,i) => (
              <circle key={i} cx={x} cy={148 - i*6} r="3" fill="none" stroke="#4db8b8" strokeWidth="1.2" strokeOpacity="0.5"/>
            ))}
            <text x="278" y="120" textAnchor="middle" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.95" letterSpacing="1.5">TREAT</text>
            <rect x="350" y="126" width="106" height="90" rx="10" fill="url(#tankGrad)" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.7"/>
            <rect x="352" y="172" width="102" height="42" rx="0 0 8 8" fill="#4db8b8" fillOpacity="0.15"/>
            <path d="M352,172 Q403,165 454,172" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
            <rect x="392" y="140" width="22" height="34" rx="4" fill="none" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.7"/>
            <rect x="392" y="158" width="22" height="16" rx="0 0 4 4" fill="#4db8b8" fillOpacity="0.3"/>
            <line x1="403" y1="134" x2="403" y2="140" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.8"/>
            <text x="403" y="146" textAnchor="middle" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.9" letterSpacing="1.5">TEST</text>
            {[152, 248, 345, 442].map((x, i) => (
              <rect key={i} x={x} y={308} width="9" height="56" rx="4" fill="#4db8b8" fillOpacity="0.55"/>
            ))}
            {[152, 248, 345, 442].map((x, i) => (
              <g key={i} transform={`translate(${x - 18}, 364)`}>
                <rect x="0" y="18" width="36" height="28" rx="3" fill="#4db8b8" fillOpacity="0.14" stroke="#4db8b8" strokeWidth="1.8" strokeOpacity="0.65"/>
                <polygon points="18,0 36,18 0,18" fill="#4db8b8" fillOpacity="0.25" stroke="#4db8b8" strokeWidth="1.8" strokeOpacity="0.65"/>
                <rect x="13" y="30" width="10" height="16" rx="1.5" fill="#4db8b8" fillOpacity="0.4"/>
                <rect x="3" y="23" width="8" height="8" rx="1" fill="#4db8b8" fillOpacity="0.2" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.5"/>
                <rect x="25" y="23" width="8" height="8" rx="1" fill="#4db8b8" fillOpacity="0.2" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.5"/>
              </g>
            ))}
            <line x1="80" y1="413" x2="500" y2="413" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 6"/>
            <rect x="174" y="460" width="212" height="44" rx="22" fill="#4db8b8" fillOpacity="0.12" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.5" filter="url(#glow)"/>
            <circle cx="198" cy="482" r="7" fill="#4db8b8" fillOpacity="0.3" stroke="#4db8b8" strokeWidth="1"/>
            <text x="211" y="479" fill="#4db8b8" fontSize="9" fontFamily="monospace" opacity="0.6" letterSpacing="1">OFFICIAL DATA SOURCE</text>
            <text x="211" y="492" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.85" letterSpacing="1" fontWeight="600">EPA SDWIS · ECHO · WQP</text>
            <rect x="38" y="158" width="130" height="52" rx="10" fill="#1a2f3a" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.6"/>
            <circle cx="56" cy="176" r="5" fill="#4db8b8" fillOpacity="0.4"/>
            <circle cx="56" cy="176" r="2.5" fill="#4db8b8"/>
            <text x="67" y="173" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.6" letterSpacing="0.5">CONTAMINANTS</text>
            <text x="56" y="188" fill="white" fontSize="9" fontFamily="monospace" opacity="0.8">PFAS · Lead · NO₃</text>
            <text x="56" y="200" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.5">6 tracked · mapped</text>
            <rect x="392" y="60" width="130" height="52" rx="10" fill="#1a2f3a" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.6"/>
            <path d="M411,80 l4,4 l7,-7" stroke="#4db8b8" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.9"/>
            <text x="428" y="77" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.6" letterSpacing="0.5">COMPLIANCE</text>
            <text x="411" y="91" fill="white" fontSize="9" fontFamily="monospace" opacity="0.8">MCL · MCLG · AL</text>
            <text x="411" y="103" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.5">EPA limits verified</text>
          </svg>
        </div>
      </section>

      {/* ── TRUST STATS ──────────────────────────────────────────────────── */}
      <section className="bg-wur-teal text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center sm:text-left sm:divide-x divide-white/20">
            <div className="sm:pr-6">
              <div className="font-display text-3xl text-white mb-0.5">
                {totalUtilities > 0 ? `${totalUtilities.toLocaleString()}+` : "10,000+"}
              </div>
              <div className="text-sm font-semibold text-white/90">Utilities tracked</div>
              <div className="text-xs text-white/50 font-mono">all 50 states</div>
            </div>
            <div className="sm:px-6">
              <div className="font-display text-3xl text-white mb-0.5">50</div>
              <div className="text-sm font-semibold text-white/90">States covered</div>
              <div className="text-xs text-white/50 font-mono">complete coverage</div>
            </div>
            <div className="sm:px-6">
              <div className="font-display text-3xl text-white mb-0.5">{contaminants.length}</div>
              <div className="text-sm font-semibold text-white/90">Contaminants mapped</div>
              <div className="text-xs text-white/50 font-mono">with treatment guides</div>
            </div>
            <div className="sm:pl-6">
              <div className="font-display text-3xl text-white mb-0.5">100%</div>
              <div className="text-sm font-semibold text-white/90">Official sources</div>
              <div className="text-xs text-white/50 font-mono">EPA · SDWIS · ECHO · WQP</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── START HERE QUICK ACCESS ──────────────────────────────────────── */}
      <section className="bg-background border-b border-border py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">Start With Your Water</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {[
              { href: "/states", label: "Browse by State", desc: "All 50 states" },
              { href: "/cities", label: "Browse by City", desc: "City water reports" },
              { href: "/pfas-watchlist", label: "PFAS Watchlist", desc: "EPA UCMR 5 records" },
              { href: "/labs", label: "Find a Lab", desc: "State-certified labs" },
              { href: "/contaminants", label: "Contaminants", desc: "PFAS, lead & more" },
              { href: "/treatment", label: "Treatment Guides", desc: "Filters & options" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex flex-col p-3 rounded-lg border border-border bg-card hover:border-wur-teal/50 hover:shadow-sm transition-all"
              >
                <p className="text-xs font-semibold text-foreground group-hover:text-wur-teal transition-colors leading-tight">
                  {item.label}
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── START WITH YOUR CONCERN ──────────────────────────────────────── */}
      <section className="py-14 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Quick Access</p>
            <h2 className="font-display text-3xl text-foreground">Start With Your Concern</h2>
          </div>
          <ConcernTiles />
        </div>
      </section>

      {/* ── BROWSE BY LOCATION ───────────────────────────────────────────── */}
      <section className="py-14 bg-wur-parchment border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Coverage</p>
              <h2 className="font-display text-3xl text-foreground">Browse by State</h2>
            </div>
            <Link
              href="/states"
              className="text-sm font-medium text-wur-teal hover:text-wur-teal/80 transition-colors flex items-center gap-1.5 shrink-0"
            >
              All 50 states <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Featured 8 states */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            {featuredStateSlugs.map((s) => (
              <Link
                key={s.slug}
                href={`/states/${s.slug}`}
                className="group flex items-center justify-between p-3.5 rounded-lg border border-border bg-card hover:border-wur-teal/50 hover:shadow-sm transition-all"
              >
                <span className="text-sm text-foreground group-hover:text-wur-teal transition-colors leading-snug">
                  <strong className="font-semibold">{s.name}</strong>{" "}
                  <span className="text-muted-foreground font-normal">{s.anchor}</span>
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-wur-teal shrink-0 ml-2 group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>

          {/* A-Z compact index — all 50 states crawlable */}
          <div className="border-t border-border pt-5">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-mono">All states A–Z</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5">
              {stateContent.map((state) => (
                <Link
                  key={state.slug}
                  href={`/states/${state.slug}`}
                  className="text-sm text-muted-foreground hover:text-wur-teal transition-colors"
                >
                  {state.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMON WATER CONCERNS ────────────────────────────────────────── */}
      <section className="py-10 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <p className="text-sm font-semibold text-foreground shrink-0">Common concerns:</p>
            <div className="flex flex-wrap gap-2">
              {contaminants.map((c) => (
                <Link
                  key={c.slug}
                  href={`/contaminants/${c.slug}`}
                  className="text-sm px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all"
                >
                  {c.shortName}
                </Link>
              ))}
              <Link
                href="/contaminants"
                className="text-sm px-3 py-1.5 rounded-full border border-dashed border-border text-muted-foreground hover:text-wur-teal hover:border-wur-teal/50 transition-all"
              >
                All contaminants →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CONTAMINANTS ─────────────────────────────────────────── */}
      <section className="py-16 bg-wur-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Common Concerns</p>
            <h2 className="font-display text-3xl text-foreground mb-2">What Are People Checking?</h2>
            <p className="text-muted-foreground max-w-xl text-sm">
              These contaminants appear most frequently in U.S. public water systems and generate the most consumer questions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredContaminantData.map((c) => (
              <Link
                key={c.slug}
                href={`/contaminants/${c.slug}`}
                className="group flex flex-col bg-white rounded-lg border border-border p-5 hover:border-wur-teal/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-2.5">
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-widest ${riskColors[c.riskLevel]}`}>
                      {c.riskLevel} risk level
                    </span>
                    <h3 className="text-base font-semibold text-foreground mt-1 group-hover:text-wur-teal transition-colors">
                      {c.shortName}
                    </h3>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium shrink-0 ml-3 ${riskBgs[c.riskLevel]} ${riskColors[c.riskLevel]}`}>
                    {c.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-2">{c.summary}</p>
                <div className="flex items-center gap-1.5 text-xs text-wur-teal font-medium mt-auto">
                  {c.shortName} records and treatment options
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5">
            <Link
              href="/contaminants"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:text-wur-teal/80 transition-colors"
            >
              View all {contaminants.length} contaminant guides <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PFAS WATCHLIST ───────────────────────────────────────────────── */}
      <section className="py-16 bg-wur-ink text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-3.5 py-1.5 mb-5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-300 font-medium tracking-wide">Government Data Watchlist</span>
              </div>
              <h2 className="font-display text-3xl text-white mb-3 leading-tight">
                PFAS in Your{" "}
                <em className="text-amber-400 not-italic">Drinking Water</em>
              </h2>
              <p className="text-white/60 leading-relaxed mb-5 text-sm">
                Track official EPA UCMR 5 PFAS monitoring records for public water systems nationwide.
                Every record is sourced from government data — no risk scores, no estimates, no guesswork.
              </p>
              <div className="flex items-start gap-2 text-xs text-white/40 mb-7">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500/60 shrink-0 mt-0.5" />
                <span>
                  Monitoring results ≠ compliance determinations. Missing data ≠ absence of PFAS.{" "}
                  <Link href="/pfas-watchlist/methodology" className="text-amber-400/70 hover:text-amber-400 transition-colors underline">
                    Methodology
                  </Link>
                </span>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pfas-watchlist"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white font-semibold text-sm px-5 py-2.5 rounded-md transition-colors"
                >
                  Explore PFAS records <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pfas-watchlist/methodology"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm px-5 py-2.5 rounded-md transition-colors"
                >
                  How it works
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Official PFAS records", desc: "Every result linked to EPA UCMR 5 source data", icon: Shield },
                { label: "29 analytes tracked", desc: "All compounds monitored under UCMR 5", icon: FlaskConical },
                { label: "Search by utility", desc: "Look up any water system by PWSID or name", icon: Database },
                { label: "No risk scoring", desc: "We never generate PFAS risk labels — only source data", icon: ShieldCheck },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/8 hover:border-amber-500/30 transition-all">
                    <Icon className="w-4 h-4 text-amber-400 mb-2.5" />
                    <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 pt-5 border-t border-white/10 flex items-center gap-4 flex-wrap">
            <span className="text-xs text-white/30 uppercase tracking-widest">Data sources</span>
            {["EPA UCMR 5", "EPA SDWIS", "EPA ECHO"].map((src) => (
              <span key={src} className="text-xs font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded">{src}</span>
            ))}
            <span className="text-xs text-white/25">· official government data only</span>
          </div>
        </div>
      </section>

      {/* ── AEO ANSWER BLOCKS ────────────────────────────────────────────── */}
      <section className="py-14 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">About This Data</p>
            <h2 className="font-display text-3xl text-foreground">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aeoAnswers.map((item) => (
              <div key={item.q} className="p-5 rounded-lg border border-border bg-card">
                <h3 className="font-semibold text-foreground mb-2 text-sm">{item.q}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-5">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-teal hover:text-wur-teal/80 transition-colors"
            >
              Full methodology and data sources <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">How WUR Works</p>
            <h2 className="font-display text-3xl text-foreground">From ZIP Code to Answer</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-6 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
            {howItWorks.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative flex flex-col items-start">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-wur-teal/10 border border-wur-teal/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-wur-teal" />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">{step.step}</span>
                  </div>
                  <h3 className="font-semibold text-foreground text-base mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TREATMENT METHODS PREVIEW ─────────────────────────────────────── */}
      <section className="py-16 bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Treatment Guidance</p>
              <h2 className="font-display text-3xl text-white">Find the Right Filter</h2>
              <p className="text-white/55 mt-1.5 max-w-lg text-sm">
                Not all filters solve all problems. Matched treatment guides tell you exactly what each technology removes.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {treatmentMethods.slice(0, 3).map((method) => (
              <Link
                key={method.slug}
                href={`/treatment/${method.slug}`}
                className="group flex flex-col bg-white/5 border border-white/10 rounded-lg p-5 hover:bg-white/10 hover:border-wur-aqua/40 transition-all"
              >
                <span className="text-xs font-mono text-white/40 uppercase tracking-wide mb-3">
                  {method.type === "point-of-use" ? "Under-sink / countertop" :
                    method.type === "point-of-entry" ? "Whole-home" : "Point-of-use or whole-home"}
                </span>
                <h3 className="font-semibold text-white mb-2 group-hover:text-wur-aqua transition-colors">
                  {method.shortName}
                </h3>
                <p className="text-xs text-white/50 leading-relaxed mb-4 line-clamp-2">{method.summary}</p>
                <div className="mt-auto">
                  <p className="text-xs text-white/35 mb-1.5">Addresses:</p>
                  <div className="flex flex-wrap gap-1">
                    {method.solves.slice(0, 3).map((s, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                        {s.split("(")[0].trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-5">
            <Link
              href="/treatment"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-wur-aqua hover:text-wur-aqua/80 transition-colors"
            >
              View all {treatmentMethods.length} treatment guides <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY TRUST ─────────────────────────────────────────────── */}
      <section className="py-16 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Built on Official Data</p>
              <h2 className="font-display text-3xl text-foreground mb-4 leading-tight">
                What We Use and What We Won&apos;t
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                Water Utility Report is built entirely on official U.S. government datasets and public
                regulatory records. We do not scrape competitor databases, republish third-party
                certification data without authorization, or publish content that hasn&apos;t been
                reviewed for accuracy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-7 text-sm">
                Every data point preserves its source provenance, ingestion date, and confidence level.
                We separate what the data says from what it means — and we tell you which is which.
              </p>
              <Link
                href="/methodology"
                className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal border border-wur-teal/40 rounded-md px-4 py-2.5 hover:bg-wur-teal/5 transition-colors"
              >
                Read our full methodology <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {methodologyPoints.map((point, i) => {
                const Icon = point.icon;
                return (
                  <div key={i} className="p-5 rounded-lg border border-border bg-card">
                    <Icon className="w-5 h-5 text-wur-teal mb-3" />
                    <p className="text-sm font-semibold text-foreground mb-1">{point.label}</p>
                    <p className="text-xs text-muted-foreground">{point.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <section className="py-14 bg-wur-parchment border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl text-foreground mb-2">Ready to check your water?</h2>
          <p className="text-muted-foreground mb-7 max-w-md mx-auto text-sm">
            Enter your ZIP code to find your utility and see what&apos;s been detected in your area.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ZipLookup variant="inline" />
            </div>
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 flex-wrap">
            <Link href="/states" className="text-sm text-muted-foreground hover:text-wur-teal transition-colors">Browse by state</Link>
            <Link href="/contaminants" className="text-sm text-muted-foreground hover:text-wur-teal transition-colors">Contaminant guides</Link>
            <Link href="/pfas-watchlist" className="text-sm text-muted-foreground hover:text-wur-teal transition-colors">PFAS watchlist</Link>
            <Link href="/compare" className="text-sm text-muted-foreground hover:text-wur-teal transition-colors">Compare utilities</Link>
            <Link href="/methodology" className="text-sm text-muted-foreground hover:text-wur-teal transition-colors">Methodology</Link>
          </div>
        </div>
      </section>
    </>
  );
}
