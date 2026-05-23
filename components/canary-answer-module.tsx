import Link from "next/link";
import type { CanaryOverride } from "@/lib/canary/seo-overrides";

const WHAT_THIS_DOES_NOT_MEAN = [
  "This page does not determine whether water is safe or unsafe to drink.",
  "A detection record does not automatically mean a violation.",
  "A missing record does not prove a contaminant is absent.",
  "Federal datasets may lag behind current local conditions.",
  "Household plumbing, private wells, and point-of-use conditions may differ from utility-level records.",
];

export default function CanaryAnswerModule({ override }: { override: CanaryOverride }) {
  return (
    <section
      aria-label="Official records summary"
      className="rounded-xl border border-border bg-muted/20 p-5 space-y-4"
    >
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Official Records Summary
      </p>

      <h2 className="text-base font-semibold text-foreground leading-snug">
        {override.answerHeadline}
      </h2>

      <p className="text-sm text-foreground/80 leading-relaxed">
        {override.introSentence}
      </p>

      <p className="text-sm text-foreground/80 leading-relaxed">
        {override.recordsFacts}
      </p>

      <p className="text-sm text-muted-foreground leading-relaxed">
        These records are not a real-time water-safety advisory. Sampling and violation databases can lag, may be incomplete, and may not reflect conditions at a specific home or tap.
      </p>

      <div className="rounded-lg border border-border bg-card p-4 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          What this does not mean
        </p>
        <ul className="space-y-1.5">
          {WHAT_THIS_DOES_NOT_MEAN.map((item) => (
            <li key={item} className="text-xs text-muted-foreground flex gap-2">
              <span className="shrink-0 mt-0.5 select-none">–</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {override.links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex items-center text-xs px-2.5 py-1 rounded-full border border-wur-teal/30 bg-wur-teal/5 text-wur-teal hover:bg-wur-teal/10 transition-colors font-medium"
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="space-y-1.5 pt-1 border-t border-border">
        <p className="text-[10px] text-muted-foreground/70 leading-relaxed">
          Source: {override.sourceNote}
        </p>
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Records shown here are based on the datasets currently used by Water Utility Report and may not include every local notice, emergency advisory, lab result, or utility update.
        </p>
        <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
          Water Utility Report summarizes official records and source data. It does not determine whether water is safe to drink. For current safety guidance, check your utility, state drinking water agency, local health department, or a certified laboratory.
        </p>
      </div>
    </section>
  );
}
