import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, ExternalLink } from "lucide-react";
import { KIND_PRODUCTS } from "@/lib/affiliate/kind/kind-products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kind Water Product Preview",
  robots: { index: false, follow: false },
};

export default function KindWaterPreviewPage() {
  if (
    process.env.NODE_ENV !== "development" ||
    process.env.KIND_WATER_PREVIEW_ENABLED !== "true"
  ) {
    notFound();
  }

  return (
    <div className="bg-background px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-wur-teal">
            Design preview
          </p>
          <h1 className="font-display text-3xl text-foreground sm:text-4xl">
            Kind Water product cards
          </h1>
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
            Catalog preview only. Products shown here are not recommendations
            for this page; live reports display products only when their data
            supports a match.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {KIND_PRODUCTS.map((product) => (
            <article
              key={product.key}
              className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="aspect-square max-h-72 bg-white sm:aspect-[4/3]">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={product.imageWidth}
                  height={product.imageHeight}
                  unoptimized
                  sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="h-full w-full object-contain p-5"
                />
              </div>
              <div className="flex flex-1 flex-col border-t border-border p-5">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-full border border-wur-teal/20 bg-wur-teal/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-wur-teal">
                    {product.category === "drinking-water"
                      ? "Drinking water"
                      : product.category === "well"
                        ? "Well water"
                        : "City water"}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {product.model}
                  </span>
                </div>
                <h2 className="mb-4 font-display text-lg leading-snug text-foreground">
                  {product.title}
                </h2>
                <ul className="mb-5 space-y-2">
                  {product.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-sm leading-relaxed text-foreground"
                    >
                      <CheckCircle2
                        className="mt-0.5 h-4 w-4 shrink-0 text-wur-teal"
                        aria-hidden="true"
                      />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={product.affiliateUrl}
                  target="_blank"
                  rel="sponsored nofollow noopener noreferrer"
                  className="mt-auto inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-wur-teal px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-wur-teal/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  View system on Kind Water
                  <ExternalLink
                    className="h-3.5 w-3.5 opacity-70"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
