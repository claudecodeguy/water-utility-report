"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = ComponentProps<typeof Link> & {
  eventName: string;
  eventParams?: Record<string, string | number | boolean>;
};

export default function TrackedLink({
  eventName,
  eventParams,
  onClick,
  ...props
}: Props) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        trackEvent(eventName, eventParams);
        onClick?.(e);
      }}
    />
  );
}
