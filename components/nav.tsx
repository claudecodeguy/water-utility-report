"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Droplets, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/states", label: "Browse by State" },
  { href: "/contaminants", label: "Contaminants" },
  { href: "/treatment", label: "Treatment" },
  { href: "/well-water", label: "Well Water" },
  { href: "/labs", label: "Labs" },
  { href: "/methodology", label: "Methodology" },
];

const utilityLinks = [
  { href: "/cities", label: "Cities" },
  { href: "/search", label: "ZIP Lookup" },
  { href: "/admin", label: "Admin" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const navBase = cn(
    "sticky top-0 z-50 w-full transition-all duration-300",
    isHome && !scrolled
      ? "bg-transparent border-b border-white/10"
      : "bg-white/95 backdrop-blur-sm border-b border-border shadow-sm"
  );

  const textColor = isHome && !scrolled ? "text-white/90" : "text-foreground";
  const logoColor = isHome && !scrolled ? "text-white" : "text-wur-teal";
  const activeColor = isHome && !scrolled ? "text-white" : "text-primary";

  return (
    <nav className={navBase}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className={cn("flex items-center gap-2.5 font-display font-normal", logoColor)}>
            <Droplets className="w-5 h-5 shrink-0" />
            <span className="text-lg leading-none">
              Water Utility <span className={cn("italic", isHome && !scrolled ? "text-white/70" : "text-muted-foreground")}>Report</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname.startsWith(link.href)
                    ? cn("font-medium", activeColor)
                    : cn(textColor, "hover:text-primary hover:bg-secondary/50")
                )}
              >
                {link.label}
              </Link>
            ))}
            <span className={cn("w-px h-4 mx-1", isHome && !scrolled ? "bg-white/20" : "bg-border")} />
            {utilityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs transition-colors",
                  pathname.startsWith(link.href)
                    ? cn("font-medium", activeColor)
                    : cn(textColor, "opacity-60 hover:opacity-100 hover:text-primary hover:bg-secondary/50")
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile toggle */}
          <button
            className={cn("lg:hidden p-2 rounded-md", textColor)}
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-b border-border shadow-lg">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-sm transition-colors",
                  pathname.startsWith(link.href)
                    ? "font-medium text-primary bg-secondary"
                    : "text-foreground hover:text-primary hover:bg-secondary/50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-border pt-1">
              {utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "block px-3 py-2.5 rounded-md text-sm transition-colors",
                    pathname.startsWith(link.href)
                      ? "font-medium text-primary bg-secondary"
                      : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
