"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

interface Props {
  slug?: string;
  title?: string;
  isHub?: boolean;
}

export default function HelpTracker({ slug, title, isHub }: Props) {
  useEffect(() => {
    if (isHub) {
      trackEvent("help_center_view", { page_path: window.location.pathname });
    } else {
      trackEvent("help_article_view", {
        article_slug: slug ?? "",
        article_title: title ?? "",
        page_path: window.location.pathname,
      });
    }
  }, []);

  return null;
}
