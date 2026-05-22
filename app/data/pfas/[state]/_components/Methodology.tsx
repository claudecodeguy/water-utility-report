import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Methodology() {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl text-foreground">How this data was collected</h2>

      <div className="rounded-lg border border-border bg-card p-5 space-y-4 text-sm text-muted-foreground leading-relaxed">
        <div>
          <p className="font-semibold text-foreground mb-1">Source dataset</p>
          <p>
            All records on this page are drawn from the EPA&apos;s Fifth Unregulated Contaminant
            Monitoring Rule (UCMR 5) occurrence dataset, published by the U.S. Environmental
            Protection Agency. UCMR 5 required large public water systems (serving more than 3,300
            people) to sample for 29 PFAS compounds between 2023 and 2025.{" "}
            <a
              href="https://www.epa.gov/dwucmr/occurrence-data-unregulated-contaminant-monitoring-rule#5"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 text-wur-teal hover:underline"
            >
              EPA UCMR 5 occurrence data
              <ExternalLink className="w-3 h-3 ml-0.5" />
            </a>
          </p>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-1">Sampling methodology</p>
          <p>
            Samples were collected at entry points to the distribution system (EPTDS) as required by
            UCMR 5 regulations. Each utility collected at least four quarterly samples during the
            monitoring period. Results represent concentrations at the specified sample point on the
            sample date — not a continuous measure of system-wide levels.
          </p>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-1">Unit normalization</p>
          <p>
            Source data may express concentrations in micrograms per liter (µg/L, also written
            ug/L or ppb) or nanograms per liter (ng/L, also called ppt). All values on this page
            are normalized to ng/L (ppt) for consistent comparison with EPA Maximum Contaminant
            Levels (MCLs). Conversion: 1 µg/L = 1,000 ng/L. Records with unrecognized units are
            excluded from numeric aggregates and flagged in the raw export.
          </p>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-1">What &quot;detection&quot; means</p>
          <p>
            A result is counted as a detection when the EPA reports it as{" "}
            &quot;Detected above MRL&quot; — meaning the analyte was measured at or above the
            minimum reporting limit (MRL) for that analyte. Non-detect results (below MRL) are
            included in total record counts but not in detection counts. Detection is a monitoring
            outcome, not a compliance determination.
          </p>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-1">
            Validation and exclusion criteria
          </p>
          <p>
            Records are included only where{" "}
            <code className="text-xs font-mono bg-muted px-1 rounded">validated = true</code> and{" "}
            <code className="text-xs font-mono bg-muted px-1 rounded">suppressed = false</code>.
            Records flagged during ingestion for format errors, duplicate source hashes, or missing
            required fields are excluded.
          </p>
        </div>

        <div>
          <p className="font-semibold text-foreground mb-1">Update cadence</p>
          <p>
            Pages are regenerated every 24 hours via Next.js ISR. The underlying dataset is
            updated when EPA publishes new UCMR 5 occurrence data. The source retrieval date shown
            on each record reflects the date the EPA file was last downloaded to our system.
          </p>
        </div>

        <div className="pt-2 border-t border-border">
          <p>
            <Link href="/pfas-watchlist/methodology" className="text-wur-teal hover:underline">
              PFAS Watchlist methodology
            </Link>{" "}
            ·{" "}
            <Link href="/methodology/data-sources" className="text-wur-teal hover:underline">
              All data sources
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
