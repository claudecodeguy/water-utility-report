import Link from "next/link";
import type { LearnBlock } from "@/lib/content/learn";

function Inline({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (linkMatch) {
          const isExternal = linkMatch[2].startsWith("http");
          return isExternal ? (
            <a key={i} href={linkMatch[2]} target="_blank" rel="noopener noreferrer" className="text-wur-teal hover:underline">
              {linkMatch[1]}
            </a>
          ) : (
            <Link key={i} href={linkMatch[2]} className="text-wur-teal hover:underline">
              {linkMatch[1]}
            </Link>
          );
        }
        return part;
      })}
    </>
  );
}

const calloutStyles = {
  highlight: "border-wur-teal/30 bg-wur-teal/8 text-foreground",
  info: "border-blue-200 bg-blue-50/60 text-foreground",
  warning: "border-wur-warning/30 bg-wur-warning/8 text-foreground",
};

const calloutAccent = {
  highlight: "bg-wur-teal",
  info: "bg-blue-400",
  warning: "bg-wur-warning",
};

export default function LearnBlocks({ blocks }: { blocks: LearnBlock[] }) {
  return (
    <div className="space-y-5">
      {blocks.map((block, i) => {
        switch (block.t) {
          case "h2":
            return (
              <h2 key={i} className="font-display text-2xl text-foreground mt-10 mb-2 first:mt-0 scroll-mt-24" id={block.c.toLowerCase().replace(/[^a-z0-9]+/g, "-")}>
                {block.c}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="font-semibold text-lg text-foreground mt-7 mb-2">
                {block.c}
              </h3>
            );
          case "p":
            return (
              <p key={i} className="text-muted-foreground leading-relaxed">
                <Inline text={block.c} />
              </p>
            );
          case "ul":
            return (
              <ul key={i} className="space-y-2 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-wur-teal mt-2 shrink-0" />
                    <span className="leading-relaxed">
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="space-y-2.5 pl-1">
                {block.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-3 text-muted-foreground">
                    <span className="w-6 h-6 rounded-full bg-wur-teal/10 text-wur-teal text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                      {j + 1}
                    </span>
                    <span className="leading-relaxed pt-0.5">
                      <Inline text={item} />
                    </span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-border my-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      {block.headers.map((h, j) => (
                        <th key={j} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, j) => (
                      <tr key={j} className={j % 2 === 0 ? "bg-card" : "bg-muted/20"}>
                        {row.map((cell, k) => (
                          <td key={k} className="px-4 py-3 text-foreground border-b border-border/50 last:border-b-0 leading-relaxed">
                            <Inline text={cell} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "callout": {
            const variant = block.variant ?? "highlight";
            return (
              <div key={i} className={`relative rounded-xl border px-5 py-4 pl-8 my-2 ${calloutStyles[variant]}`}>
                <span className={`absolute left-3 top-4 w-1 h-5 rounded-full ${calloutAccent[variant]}`} />
                <p className="text-sm leading-relaxed font-medium">
                  <Inline text={block.c} />
                </p>
              </div>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
