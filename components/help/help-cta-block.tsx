"use client";

import Link from "next/link";
import { ArrowRight, Search, Bell, FileText, FlaskConical, AlertCircle } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import type { HelpCheckNext } from "@/lib/content/help";

interface Props {
  items: HelpCheckNext[];
  articleSlug: string;
}

const iconMap: Record<string, React.ReactNode> = {
  "/search": <Search className="w-4 h-4 shrink-0" />,
  "/labs": <FlaskConical className="w-4 h-4 shrink-0" />,
  "/contact": <AlertCircle className="w-4 h-4 shrink-0" />,
};

function getIcon(href: string) {
  for (const [key, icon] of Object.entries(iconMap)) {
    if (href.startsWith(key)) return icon;
  }
  return <ArrowRight className="w-4 h-4 shrink-0" />;
}

export default function HelpCtaBlock({ items, articleSlug }: Props) {
  function handleClick(label: string, href: string) {
    const isExternal = href.startsWith("http");
    trackEvent("help_article_cta_click", {
      article_slug: articleSlug,
      cta_label: label,
      cta_href: href,
      is_external: isExternal,
      page_path: typeof window !== "undefined" ? window.location.pathname : "",
    });
    if (href.startsWith("/search")) {
      trackEvent("utility_lookup_completed_from_help", { article_slug: articleSlug });
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item) => {
        const isExternal = item.href.startsWith("http");
        const sharedClass =
          "flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:border-wur-teal/40 transition-colors group cursor-pointer";

        if (isExternal) {
          return (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={sharedClass}
              onClick={() => {
                trackEvent("help_article_source_click", {
                  article_slug: articleSlug,
                  source_url: item.href,
                  page_path: typeof window !== "undefined" ? window.location.pathname : "",
                });
              }}
            >
              <span className="text-wur-teal mt-0.5">{getIcon(item.href)}</span>
              <div>
                <p className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors">{item.label}</p>
                {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
              </div>
            </a>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={sharedClass}
            onClick={() => handleClick(item.label, item.href)}
          >
            <span className="text-wur-teal mt-0.5">{getIcon(item.href)}</span>
            <div>
              <p className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors">{item.label}</p>
              {item.desc && <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
