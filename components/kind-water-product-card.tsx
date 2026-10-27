"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircle2, ExternalLink } from "lucide-react";
import TrackedAnchor from "@/components/tracked-anchor";
import { trackEvent } from "@/lib/analytics";
import type { KindRecommendation } from "@/lib/affiliate/kind/kind-recommendations";

interface Props {
  recommendation: KindRecommendation;
}

export default function KindWaterProductCard({ recommendation }: Props) {
  const cardRef = useRef<HTMLElement>(null);
  const impressionTracked = useRef(false);
  const { product, triggers, placement, pageType, pageIdentifier } = recommendation;
  const recommendationTrigger = triggers.join("; ");

  useEffect(() => {
    const card = cardRef.current;
    if (!card || impressionTracked.current) return;

    const trackImpression = () => {
      if (impressionTracked.current) return;
      impressionTracked.current = true;
      trackEvent("kind_affiliate_impression", {
        product_key: product.key,
        product_model: product.model,
        placement,
        page_type: pageType,
        recommendation_trigger: recommendationTrigger,
        page_identifier: pageIdentifier,
      });
    };

    if (typeof IntersectionObserver === "undefined") {
      trackImpression();
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackImpression();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(card);
    return () => observer.disconnect();
  }, [
    pageIdentifier,
    pageType,
    placement,
    product.key,
    product.model,
    recommendationTrigger,
  ]);

  const eventParams = {
    product_key: product.key,
    product_model: product.model,
    placement,
    page_type: pageType,
    recommendation_trigger: recommendationTrigger,
    page_identifier: pageIdentifier,
  };

  return (
    <article
      ref={cardRef}
      className="overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="aspect-square max-h-64 bg-white sm:aspect-[4/3]">
        <Image
          src={product.image}
          alt={product.title}
          width={product.imageWidth}
          height={product.imageHeight}
          unoptimized
          loading="lazy"
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-full w-full object-contain p-5"
        />
      </div>
      <div className="flex h-full flex-col border-t border-border p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-wur-teal/20 bg-wur-teal/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-wur-teal">
            Relevant to this report
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">{product.model}</span>
        </div>
        <h3 className="mb-3 font-display text-lg leading-snug text-foreground">
          {product.title}
        </h3>
        <div className="mb-4">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            Report context
          </p>
          <ul className="flex flex-wrap gap-1.5">
            {triggers.map((trigger) => (
              <li
                key={trigger}
                className="rounded-full border border-border bg-muted/30 px-2.5 py-1 text-[11px] text-muted-foreground"
              >
                {trigger}
              </li>
            ))}
          </ul>
        </div>
        <ul className="mb-5 space-y-2">
          {product.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-wur-teal" aria-hidden="true" />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <TrackedAnchor
          href={product.affiliateUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          eventName="kind_affiliate_click"
          eventParams={{ ...eventParams, destination: "kindwater" }}
          className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wur-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-wur-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          View system on Kind Water
          <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden="true" />
        </TrackedAnchor>
      </div>
    </article>
  );
}
