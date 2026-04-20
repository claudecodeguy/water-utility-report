import Link from "next/link";
import { ArrowRight, FlaskConical, Wrench, MapPin, ShieldCheck, Database, BookOpen, Shield, AlertTriangle } from "lucide-react";
import ZipLookup from "@/components/zip-lookup";
import stateContent from "@/lib/content/states";
import contaminants from "@/lib/content/contaminants";
import treatmentMethods from "@/lib/content/treatments";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

const featuredContaminants = ["pfas", "lead", "nitrates", "disinfection-byproducts"];

const trustStats = (totalUtilities: number) => [
  { value: totalUtilities.toLocaleString(), label: "Utilities tracked", sub: "across 25 states" },
  { value: "6", label: "Contaminants mapped", sub: "with treatment guidance" },
  { value: "100%", label: "Official data sources", sub: "EPA, SDWIS, ECHO, WQP" },
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
    desc: "We surface the key contaminants detected, their levels, and what they mean in plain English.",
    icon: FlaskConical,
  },
  {
    step: "03",
    title: "Understand your options",
    desc: "Matched treatment guidance, official report links, certified labs, and clear next steps.",
    icon: Wrench,
  },
];

const methodologyPoints = [
  { icon: Database, label: "EPA SDWIS/ECHO datasets", desc: "Core utility and violation data" },
  { icon: BookOpen, label: "Consumer Confidence Reports", desc: "Annual CCR data from utilities" },
  { icon: ShieldCheck, label: "EPA Water Quality Portal", desc: "Supporting sampling data" },
  { icon: ShieldCheck, label: "State regulatory datasets", desc: "Where terms allow public use" },
];

export default async function HomePage() {
  const [dbStates, totalUtilities] = await Promise.all([
    prisma.state.findMany({
      select: { abbreviation: true, _count: { select: { utilities: true } } },
    }),
    prisma.utility.count(),
  ]);
  const dbCountMap = Object.fromEntries(
    dbStates.map((s) => [s.abbreviation, s._count.utilities])
  );

  const featuredContaminantData = contaminants.filter((c) =>
    featuredContaminants.includes(c.slug)
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

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="topo-bg relative min-h-screen -mt-16 pt-16 flex items-center overflow-hidden">
        {/* Gradient fade bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            {/* Tag line */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3.5 py-1.5 mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-wur-aqua animate-pulse" />
              <span className="text-xs text-white/70 font-medium tracking-wide">
                {stateContent.length} states · {totalUtilities > 0 ? `${totalUtilities.toLocaleString()}+` : "5,000+"} utilities · official data only
              </span>
            </div>

            <h1 className="font-display text-6xl sm:text-7xl text-white leading-[1.05] mb-6 animate-fade-up opacity-0 stagger-1">
              Know What&apos;s in{" "}
              <em className="text-wur-aqua not-italic block">Your Water.</em>
            </h1>

            <p className="text-lg text-white/65 leading-relaxed mb-10 max-w-lg animate-fade-up opacity-0 stagger-2">
              Search your ZIP code to find your water utility, understand the key
              contaminants in your area, and see matched treatment options —
              built from official EPA data.
            </p>

            <div className="animate-fade-up opacity-0 stagger-3">
              <ZipLookup variant="hero" />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 animate-fade-up opacity-0 stagger-4">
              <span className="text-xs text-white/30 uppercase tracking-widest">Or browse by</span>
              {stateContent.map((state) => (
                <Link
                  key={state.slug}
                  href={`/states/${state.slug}`}
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  {state.name}
                </Link>
              ))}
              <span className="text-white/20">···</span>
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
              <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4db8b8" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#1a8a8a" stopOpacity="0.8"/>
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="softglow">
                <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
                <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
            </defs>

            {/* Background grid dots */}
            {Array.from({length: 10}).map((_, row) =>
              Array.from({length: 14}).map((_, col) => (
                <circle key={`${row}-${col}`} cx={28 + col * 38} cy={40 + row * 56} r="1.5" fill="#4db8b8" opacity="0.1"/>
              ))
            )}

            {/* Ambient glow circles */}
            <circle cx="280" cy="200" r="180" fill="#4db8b8" fillOpacity="0.04"/>
            <circle cx="280" cy="200" r="120" fill="#4db8b8" fillOpacity="0.04"/>

            {/* ── WATER SOURCE (left reservoir) ── */}
            <ellipse cx="60" cy="300" rx="38" ry="38" fill="#4db8b8" fillOpacity="0.12" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.6" filter="url(#glow)"/>
            <ellipse cx="60" cy="300" rx="25" ry="25" fill="#4db8b8" fillOpacity="0.18" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.8"/>
            {/* Water ripple lines */}
            <ellipse cx="60" cy="300" rx="14" ry="5" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.5" fill="none"/>
            <ellipse cx="60" cy="296" rx="9" ry="3" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.4" fill="none"/>
            <text x="60" y="347" textAnchor="middle" fill="#4db8b8" fontSize="9" fontFamily="monospace" opacity="0.7" letterSpacing="1">SOURCE</text>

            {/* ── MAIN HORIZONTAL PIPE ── */}
            <rect x="98" y="294" width="404" height="14" rx="7" fill="url(#pipeGrad)"/>
            {/* Pipe highlight */}
            <rect x="98" y="295" width="404" height="4" rx="2" fill="#4db8b8" fillOpacity="0.4"/>
            {/* Flow direction arrows */}
            {[160, 230, 300, 370, 430].map((x, i) => (
              <path key={i} d={`M${x},298 L${x+8},301 L${x},304`} stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.6" fill="none"/>
            ))}

            {/* ── VERTICAL CONNECTOR PIPES ── */}
            <rect x="147" y="210" width="10" height="90" rx="5" fill="#4db8b8" fillOpacity="0.6"/>
            <rect x="272" y="185" width="10" height="115" rx="5" fill="#4db8b8" fillOpacity="0.6"/>
            <rect x="397" y="215" width="10" height="85" rx="5" fill="#4db8b8" fillOpacity="0.6"/>

            {/* ── TREATMENT TANKS ── */}
            {/* Tank 1 — FILTER */}
            <rect x="100" y="120" width="106" height="90" rx="10" fill="url(#tankGrad)" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.7"/>
            {/* Water level inside */}
            <rect x="102" y="162" width="102" height="46" rx="0 0 8 8" fill="#4db8b8" fillOpacity="0.15"/>
            <path d="M102,162 Q153,155 204,162" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
            {/* Filter media dots */}
            {[116,130,144,158,172,186].map((x) => [170,178,186].map((y,j) => (
              <circle key={`f-${x}-${y}`} cx={x} cy={y} r="2.5" fill="#4db8b8" fillOpacity="0.35"/>
            )))}
            <text x="153" y="142" textAnchor="middle" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.9" letterSpacing="1.5">FILTER</text>
            {/* Corner bolts */}
            {[[107,127],[197,127],[107,203],[197,203]].map(([bx,by],i) => (
              <circle key={i} cx={bx} cy={by} r="3" fill="#4db8b8" fillOpacity="0.4" stroke="#4db8b8" strokeWidth="1"/>
            ))}

            {/* Tank 2 — TREAT (center, taller) */}
            <rect x="225" y="96" width="106" height="104" rx="10" fill="url(#tankGrad)" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.85" filter="url(#glow)"/>
            <rect x="227" y="162" width="102" height="36" rx="0 0 8 8" fill="#4db8b8" fillOpacity="0.2"/>
            <path d="M227,162 Q278,153 329,162" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.8" fill="none"/>
            {/* Bubbles */}
            {[245,262,278,295,312].map((x,i) => (
              <circle key={i} cx={x} cy={148 - i*6} r="3" fill="none" stroke="#4db8b8" strokeWidth="1.2" strokeOpacity="0.5"/>
            ))}
            <text x="278" y="120" textAnchor="middle" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.95" letterSpacing="1.5">TREAT</text>
            {[[232,103],[326,103],[232,193],[326,193]].map(([bx,by],i) => (
              <circle key={i} cx={bx} cy={by} r="3" fill="#4db8b8" fillOpacity="0.4" stroke="#4db8b8" strokeWidth="1"/>
            ))}

            {/* Tank 3 — TEST */}
            <rect x="350" y="126" width="106" height="90" rx="10" fill="url(#tankGrad)" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.7"/>
            <rect x="352" y="172" width="102" height="42" rx="0 0 8 8" fill="#4db8b8" fillOpacity="0.15"/>
            <path d="M352,172 Q403,165 454,172" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.7" fill="none"/>
            {/* Test vial icon */}
            <rect x="392" y="140" width="22" height="34" rx="4" fill="none" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.7"/>
            <rect x="392" y="158" width="22" height="16" rx="0 0 4 4" fill="#4db8b8" fillOpacity="0.3"/>
            <line x1="403" y1="134" x2="403" y2="140" stroke="#4db8b8" strokeWidth="2" strokeOpacity="0.8"/>
            <text x="403" y="146" textAnchor="middle" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.9" letterSpacing="1.5">TEST</text>
            {[[357,133],[449,133],[357,209],[449,209]].map(([bx,by],i) => (
              <circle key={i} cx={bx} cy={by} r="3" fill="#4db8b8" fillOpacity="0.4" stroke="#4db8b8" strokeWidth="1"/>
            ))}

            {/* ── DROP PIPES TO HOMES ── */}
            {[152, 248, 345, 442].map((x, i) => (
              <rect key={i} x={x} y={308} width="9" height="56" rx="4" fill="#4db8b8" fillOpacity="0.55"/>
            ))}

            {/* ── HOUSES ── */}
            {[152, 248, 345, 442].map((x, i) => (
              <g key={i} transform={`translate(${x - 18}, 364)`}>
                {/* House body */}
                <rect x="0" y="18" width="36" height="28" rx="3" fill="#4db8b8" fillOpacity="0.14" stroke="#4db8b8" strokeWidth="1.8" strokeOpacity="0.65"/>
                {/* Roof */}
                <polygon points="18,0 36,18 0,18" fill="#4db8b8" fillOpacity="0.25" stroke="#4db8b8" strokeWidth="1.8" strokeOpacity="0.65"/>
                {/* Door */}
                <rect x="13" y="30" width="10" height="16" rx="1.5" fill="#4db8b8" fillOpacity="0.4"/>
                {/* Window */}
                <rect x="3" y="23" width="8" height="8" rx="1" fill="#4db8b8" fillOpacity="0.2" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.5"/>
                <rect x="25" y="23" width="8" height="8" rx="1" fill="#4db8b8" fillOpacity="0.2" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.5"/>
              </g>
            ))}

            {/* ── GROUND LINE ── */}
            <line x1="80" y1="413" x2="500" y2="413" stroke="#4db8b8" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="4 6"/>

            {/* ── EPA DATA BADGE ── */}
            <rect x="174" y="460" width="212" height="44" rx="22" fill="#4db8b8" fillOpacity="0.12" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.5" filter="url(#glow)"/>
            <circle cx="198" cy="482" r="7" fill="#4db8b8" fillOpacity="0.3" stroke="#4db8b8" strokeWidth="1"/>
            <text x="211" y="479" fill="#4db8b8" fontSize="9" fontFamily="monospace" opacity="0.6" letterSpacing="1">OFFICIAL DATA SOURCE</text>
            <text x="211" y="492" fill="#4db8b8" fontSize="10" fontFamily="monospace" opacity="0.85" letterSpacing="1" fontWeight="600">EPA SDWIS · ECHO · WQP</text>

            {/* ── CONTAMINANT CALLOUT CHIP ── */}
            <rect x="38" y="158" width="130" height="52" rx="10" fill="#1a2f3a" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.6"/>
            <circle cx="56" cy="176" r="5" fill="#4db8b8" fillOpacity="0.4"/>
            <circle cx="56" cy="176" r="2.5" fill="#4db8b8"/>
            <text x="67" y="173" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.6" letterSpacing="0.5">CONTAMINANTS</text>
            <text x="56" y="188" fill="white" fontSize="9" fontFamily="monospace" opacity="0.8">PFAS · Lead · NO₃</text>
            <text x="56" y="200" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.5">6 tracked · mapped</text>

            {/* ── COMPLIANCE CHIP ── */}
            <rect x="392" y="60" width="130" height="52" rx="10" fill="#1a2f3a" stroke="#4db8b8" strokeWidth="1.5" strokeOpacity="0.6"/>
            <path d="M411,80 l4,4 l7,-7" stroke="#4db8b8" strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity="0.9"/>
            <text x="428" y="77" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.6" letterSpacing="0.5">COMPLIANCE</text>
            <text x="411" y="91" fill="white" fontSize="9" fontFamily="monospace" opacity="0.8">MCL · MCLG · AL</text>
            <text x="411" y="103" fill="#4db8b8" fontSize="8" fontFamily="monospace" opacity="0.5">EPA limits verified</text>
          </svg>
        </div>
      </section>

      {/* ── TRUST STATS ──────────────────────────────────────────────────── */}
      <section className="bg-wur-teal text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left sm:divide-x divide-white/20">
            {trustStats(totalUtilities).map((stat, i) => (
              <div key={i} className={i > 0 ? "sm:pl-8" : ""}>
                <div className="font-display text-4xl text-white mb-1">{stat.value}</div>
                <div className="text-base font-semibold text-white/90">{stat.label}</div>
                <div className="text-xs text-white/50 mt-0.5 font-mono">{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BROWSE BY STATE ──────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Coverage</p>
              <h2 className="font-display text-4xl text-foreground">Browse by State</h2>
            </div>
            <span className="text-sm text-muted-foreground hidden sm:block">
              25 states · more coming
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {stateContent.map((state) => (
              <Link
                key={state.slug}
                href={`/states/${state.slug}`}
                className="group relative flex flex-col bg-card border border-border rounded-lg p-5 hover:border-wur-teal/50 hover:shadow-md transition-all overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-16 h-16 rounded-bl-full bg-wur-teal/5 group-hover:bg-wur-teal/10 transition-colors" />
                <div className="text-3xl font-display text-wur-teal/60 mb-3">{state.abbreviation}</div>
                <div className="font-semibold text-foreground group-hover:text-wur-teal transition-colors mb-1">
                  {state.name}
                </div>
                <div className="text-xs text-muted-foreground font-mono mb-3">
                  {dbCountMap[state.abbreviation]
                    ? `${dbCountMap[state.abbreviation].toLocaleString()} utilities`
                    : "utilities tracked"}
                </div>
                <div className="flex flex-wrap gap-1 mt-auto">
                  {state.topContaminants.slice(0, 2).map((c) => (
                    <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                      {c.replace(/-/g, " ")}
                    </span>
                  ))}
                </div>
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-wur-teal" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED CONTAMINANTS ─────────────────────────────────────────── */}
      <section className="py-20 bg-wur-parchment">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">Common Concerns</p>
            <h2 className="font-display text-4xl text-foreground mb-3">
              What Are People Worried About?
            </h2>
            <p className="text-muted-foreground max-w-xl">
              These contaminants appear most frequently in U.S. public water systems and generate the most consumer questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredContaminantData.map((c) => (
              <Link
                key={c.slug}
                href={`/contaminants/${c.slug}`}
                className="group flex flex-col bg-white rounded-lg border border-border p-6 hover:border-wur-teal/40 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className={`text-xs font-semibold uppercase tracking-widest ${riskColors[c.riskLevel]}`}>
                      {c.riskLevel} risk level
                    </span>
                    <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-wur-teal transition-colors">
                      {c.shortName}
                    </h3>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${riskBgs[c.riskLevel]} ${riskColors[c.riskLevel]}`}>
                    {c.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {c.summary}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-wur-teal font-medium mt-auto">
                  Learn about {c.shortName}
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/contaminants"
              className="inline-flex items-center gap-2 text-sm font-medium text-wur-teal hover:text-wur-teal/80 transition-colors"
            >
              View all {contaminants.length} contaminant guides
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── PFAS WATCHLIST ───────────────────────────────────────────────── */}
      <section className="py-20 bg-wur-ink text-white relative overflow-hidden">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, #f59e0b 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 rounded-full px-3.5 py-1.5 mb-6">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-amber-300 font-medium tracking-wide">Government Data Watchlist</span>
              </div>

              <h2 className="font-display text-4xl text-white mb-4 leading-tight">
                PFAS in Your <br />
                <em className="text-amber-400 not-italic">Drinking Water</em>
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Track official EPA UCMR 5 PFAS monitoring records for public water systems nationwide.
                Every record is sourced from government data — no risk scores, no estimates, no guesswork.
              </p>

              <div className="flex items-start gap-2 text-xs text-white/40 mb-8">
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
                  Explore PFAS Records
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/pfas-watchlist/methodology"
                  className="inline-flex items-center justify-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white/40 text-sm px-5 py-2.5 rounded-md transition-colors"
                >
                  How it works
                </Link>
              </div>
            </div>

            {/* Right: feature callouts */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Official PFAS records",
                  desc: "Every result linked to EPA UCMR 5 source data",
                  icon: Shield,
                },
                {
                  label: "29 analytes tracked",
                  desc: "All compounds monitored under UCMR 5",
                  icon: FlaskConical,
                },
                {
                  label: "Search by utility",
                  desc: "Look up any water system by PWSID or name",
                  icon: Database,
                },
                {
                  label: "No risk scoring",
                  desc: "We never generate PFAS risk labels — only source data",
                  icon: ShieldCheck,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/8 hover:border-amber-500/30 transition-all"
                  >
                    <Icon className="w-4 h-4 text-amber-400 mb-3" />
                    <p className="text-sm font-semibold text-white mb-1">{item.label}</p>
                    <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom: source badge */}
          <div className="mt-10 pt-6 border-t border-white/10 flex items-center gap-4 flex-wrap">
            <span className="text-xs text-white/30 uppercase tracking-widest">Data sources</span>
            {["EPA UCMR 5", "EPA SDWIS", "EPA ECHO"].map((src) => (
              <span key={src} className="text-xs font-mono text-white/50 bg-white/5 px-2.5 py-1 rounded">
                {src}
              </span>
            ))}
            <span className="text-xs text-white/25">· official government data only</span>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-2">How WUR Works</p>
            <h2 className="font-display text-4xl text-foreground">
              From ZIP Code to Answer
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
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
                  <h3 className="font-semibold text-foreground text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TREATMENT METHODS PREVIEW ─────────────────────────────────────── */}
      <section className="py-20 bg-wur-ink text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-aqua mb-2">Treatment Guidance</p>
              <h2 className="font-display text-4xl text-white">
                Find the Right Filter
              </h2>
              <p className="text-white/55 mt-2 max-w-lg text-sm">
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
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-white/40 uppercase tracking-wide">
                    {method.type === "point-of-use" ? "Under-sink / countertop" :
                      method.type === "point-of-entry" ? "Whole-home" : "Point-of-use or whole-home"}
                  </span>
                </div>
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

          <div className="mt-6">
            <Link
              href="/treatment"
              className="inline-flex items-center gap-2 text-sm font-medium text-wur-aqua hover:text-wur-aqua/80 transition-colors"
            >
              View all {treatmentMethods.length} treatment guides
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY TRUST ─────────────────────────────────────────────── */}
      <section className="py-20 bg-background border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-wur-teal mb-3">Built on Official Data</p>
              <h2 className="font-display text-4xl text-foreground mb-4 leading-tight">
                What We Use and What We Won&apos;t
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Water Utility Report is built entirely on official U.S. government datasets and public
                regulatory records. We do not scrape competitor databases, republish third-party
                certification data without authorization, or publish content that hasn&apos;t been
                reviewed for legal and scientific accuracy.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
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
      <section className="py-16 bg-wur-parchment border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl text-foreground mb-3">
            Ready to check your water?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Enter your ZIP code to find your utility and see what&apos;s been detected in your area.
          </p>
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <ZipLookup variant="inline" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
