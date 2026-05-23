interface JumpNavItem {
  label: string;
  href: string;
}

interface JumpNavProps {
  items: JumpNavItem[];
  className?: string;
}

export default function JumpNav({ items, className }: JumpNavProps) {
  return (
    <nav
      aria-label="Jump to section"
      className={`flex flex-wrap gap-1.5 ${className ?? ""}`}
    >
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="text-[11px] px-2.5 py-1 rounded-full border border-border bg-card text-muted-foreground hover:border-wur-teal/50 hover:text-wur-teal transition-all"
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
