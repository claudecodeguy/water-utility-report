import Link from "next/link";
import type { Block } from "@/lib/content/guides";

// Renders inline **bold** and [link text](href) within a string
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

export default function GuideBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        switch (block.t) {
          case "h2":
            return (
              <h2 key={i} className="font-display text-2xl text-foreground mt-10 mb-3 first:mt-0">
                {block.c}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="font-semibold text-lg text-foreground mt-6 mb-2">
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
                    <span className="leading-relaxed"><Inline text={item} /></span>
                  </li>
                ))}
              </ul>
            );
          case "table":
            return (
              <div key={i} className="overflow-x-auto rounded-xl border border-border">
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
          case "callout":
            return (
              <div key={i} className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 px-5 py-4">
                <p className="text-sm text-foreground leading-relaxed">
                  <Inline text={block.c} />
                </p>
              </div>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
