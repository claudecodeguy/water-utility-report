"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/admin/outreach", label: "Journalist pitches", exact: true },
  { href: "/admin/outreach/orgs/queue", label: "Org pitches" },
  { href: "/admin/outreach/journalists", label: "Journalists" },
  { href: "/admin/outreach/orgs", label: "Organizations", exact: true },
];

export default function OutreachTabNav() {
  const pathname = usePathname();
  return (
    <div className="flex border-b border-border gap-1 -mb-px">
      {TABS.map(({ href, label, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
              active
                ? "border-wur-teal text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
