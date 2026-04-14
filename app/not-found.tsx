import Link from "next/link";
import { ArrowLeft, Droplets, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-wur-teal/10 flex items-center justify-center">
            <Droplets className="w-8 h-8 text-wur-teal" />
          </div>
        </div>
        <p className="font-mono text-xs text-wur-teal mb-2 tracking-widest uppercase">404</p>
        <h1 className="font-display text-3xl text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          This page doesn&apos;t exist or has been moved. Try searching for your ZIP code or browsing by state.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-wur-teal text-white text-sm font-medium hover:bg-wur-teal-dark transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <Link
            href="/states"
            className="inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:border-wur-teal/40 transition-colors"
          >
            <Search className="w-4 h-4" /> Browse by State
          </Link>
        </div>
      </div>
    </div>
  );
}
