type DataItem = {
  label: string;
  available: boolean;
};

type Props = {
  summary: string;
  dataItems?: DataItem[];
};

export default function PageIntroBox({ summary, dataItems }: Props) {
  return (
    <div className="rounded-xl border border-wur-teal/20 bg-wur-teal/5 p-5">
      <p className="text-sm text-foreground leading-relaxed">{summary}</p>
      {dataItems && dataItems.length > 0 && (
        <div className="mt-4 pt-3 border-t border-wur-teal/15 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5">
          {dataItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
              <span className="flex items-center gap-2">
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.available ? "bg-wur-teal" : "bg-muted-foreground/30"
                  }`}
                />
                <span className={item.available ? "text-foreground" : "text-muted-foreground"}>
                  {item.label}
                </span>
              </span>
              <span
                className={`font-mono text-[10px] shrink-0 ${
                  item.available ? "text-wur-teal" : "text-muted-foreground/50"
                }`}
              >
                {item.available ? "Available" : "Not in current records"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
