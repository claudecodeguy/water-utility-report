"use client";

import type { AnchorHTMLAttributes } from "react";
import { trackEvent } from "@/lib/analytics";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  eventName: string;
  eventParams?: Record<string, string | number | boolean>;
};

export default function TrackedAnchor({
  eventName,
  eventParams,
  onClick,
  ...props
}: Props) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackEvent(eventName, eventParams);
        onClick?.(e as React.MouseEvent<HTMLAnchorElement>);
      }}
    />
  );
}
