import Link from "next/link";
import { Info } from "lucide-react";

export default function DataLimitationsNote() {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-start gap-2.5">
        <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground leading-relaxed">
            Public drinking water datasets may not include every recent test, private well result,
            household plumbing issue, or local advisory. Use this page as a starting point, not as
            a substitute for official guidance, your utility&apos;s Consumer Confidence Report, or
            professional testing.
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Water Utility Report summarizes public records from official federal, state, utility, or
            testing datasets where available. For urgent health or compliance questions, contact your
            utility, local health department, or the EPA directly.{" "}
            <Link href="/methodology" className="text-wur-teal hover:underline">
              How Water Utility Report uses public drinking water data
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
