"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

type AnalyticsTrackerProps = {
  locale: "pt" | "en";
};

export default function AnalyticsTracker({ locale }: AnalyticsTrackerProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastSentKey = useRef<string>("");

  useEffect(() => {
    const query = searchParams?.toString();
    const path = query ? `${pathname}?${query}` : pathname;
    const dedupeKey = `page_view:${locale}:${path}`;

    if (!pathname || lastSentKey.current === dedupeKey) {
      return;
    }

    lastSentKey.current = dedupeKey;

    const payload = {
      eventType: "page_view",
      locale,
      path,
      referrer: typeof document !== "undefined" ? document.referrer : "unknown",
    };

    void fetch("/api/analytics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {
      // no-op (analytics must never break navigation)
    });
  }, [locale, pathname, searchParams]);

  return null;
}
