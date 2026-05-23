"use client";

import React, { useRef } from "react";
import { MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { trackEvent } from "@/lib/analytics";
import type { FAQ } from "@/lib/types";

interface FaqSectionProps {
  faqs: FAQ[];
  title?: string;
}

export default function FaqSection({ faqs, title = "Frequently Asked Questions" }: FaqSectionProps) {
  const openItemsRef = useRef<string[]>([]);

  if (!faqs.length) return null;

  function handleValueChange(values: string[]) {
    const newlyOpened = values.filter((v) => !openItemsRef.current.includes(v));
    for (const v of newlyOpened) {
      const idx = parseInt(v.replace("faq-", ""), 10);
      if (!isNaN(idx) && faqs[idx]) {
        trackEvent("faq_open", { question: faqs[idx].question.slice(0, 80) });
      }
    }
    openItemsRef.current = values;
  }

  return (
    <section className="mt-12">
      <div className="flex items-center gap-2.5 mb-6">
        <MessageCircle className="w-4 h-4 text-wur-teal shrink-0" />
        <h2 className="font-display text-2xl text-foreground">{title}</h2>
      </div>
      <Accordion
        type="multiple"
        className="divide-y divide-border border-t border-b border-border"
        onValueChange={handleValueChange}
      >
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="border-0">
            <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary py-4 text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-5">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
