import { HelpCircle, ArrowRight } from "lucide-react";
import TrackedLink from "@/components/tracked-link";

export interface WaterQuestion {
  question: string;
  href: string;
  description: string;
  eventName: string;
  eventParams?: Record<string, string | number>;
}

interface Props {
  questions: WaterQuestion[];
  title?: string;
}

export default function RelatedWaterQuestions({ questions, title = "Related Water Questions" }: Props) {
  if (!questions.length) return null;
  return (
    <section>
      <h2 className="font-display text-xl text-foreground mb-4">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {questions.map((q) => (
          <TrackedLink
            key={q.href}
            href={q.href}
            eventName={q.eventName}
            eventParams={q.eventParams}
            className="group flex items-start gap-3 p-4 rounded-lg border border-border bg-card hover:border-wur-teal/40 hover:shadow-sm transition-all"
          >
            <HelpCircle className="w-4 h-4 text-wur-teal shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground group-hover:text-wur-teal transition-colors leading-snug">
                {q.question}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{q.description}</p>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-wur-teal group-hover:translate-x-0.5 transition-all shrink-0 mt-0.5" />
          </TrackedLink>
        ))}
      </div>
    </section>
  );
}
