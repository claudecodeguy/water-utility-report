"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  FlaskConical,
  Wrench,
  MapPin,
  Flag,
  Database,
  Settings,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/utilities", label: "Utilities", icon: Building2 },
  { href: "/admin/contaminants", label: "Contaminants", icon: FlaskConical },
  { href: "/admin/treatments", label: "Treatments", icon: Wrench },
  { href: "/admin/states", label: "States", icon: MapPin },
  { href: "/admin/flags", label: "Review Flags", icon: Flag },
  { href: "/admin/sources", label: "Data Sources", icon: Database },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-wur-ink flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-wur-teal flex items-center justify-center shrink-0">
              <span className="font-mono text-white font-bold text-xs">W</span>
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none">WUR Admin</p>
              <p className="text-white/40 text-xs mt-0.5">Content CMS</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-wur-teal/20 text-white border-r-2 border-wur-teal"
                    : "text-white/55 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4 border-t border-white/10">
          <Link href="/" className="text-xs text-white/30 hover:text-white/60 transition-colors">
            ← Back to site
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-border flex items-center px-6 gap-2 text-sm text-muted-foreground shrink-0">
          <Link href="/admin" className="hover:text-foreground transition-colors">Admin</Link>
          {pathname !== "/admin" && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-foreground capitalize">
                {pathname.split("/").filter(Boolean).slice(1).join(" / ")}
              </span>
            </>
          )}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-wur-caution-bg border border-wur-caution-border text-wur-caution">
              Mock Data
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
