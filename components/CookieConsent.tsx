"use client";

import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/i18n.config";

const CONSENT_KEY = "wtd_cookie_consent";

type ConsentState = "accepted" | "rejected" | null;

export default function CookieConsent({ locale }: { locale: Locale }) {
  const [consent, setConsent] = useState<ConsentState>(() => {
    if (typeof window === "undefined") return null;
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "accepted" || stored === "rejected" ? stored : null;
  });

  const saveConsent = (value: Exclude<ConsentState, null>) => {
    window.localStorage.setItem(CONSENT_KEY, value);
    setConsent(value);
  };

  if (typeof window === "undefined" || consent) return null;

  const isPt = locale === "pt";

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] md:left-6 md:right-6">
      <div className="mx-auto max-w-4xl rounded-xl border border-brand-grey-dark bg-brand-black-light p-4 shadow-2xl">
        <p className="text-sm text-brand-grey-light leading-relaxed">
          {isPt
            ? "Este site usa cookies essenciais para funcionar e, com a tua permissão, cookies de medição para melhorar a experiência."
            : "This site uses essential cookies to work and, with your permission, measurement cookies to improve the experience."}{" "}
          <Link
            href={`/${locale}/privacy`}
            className="text-brand-red hover:text-brand-red-light"
          >
            {isPt ? "Saber mais" : "Learn more"}
          </Link>
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => saveConsent("accepted")}
            className="px-4 py-2 rounded-lg bg-brand-red text-white text-sm font-semibold hover:bg-brand-red-light transition-colors"
          >
            {isPt ? "Aceitar" : "Accept"}
          </button>
          <button
            type="button"
            onClick={() => saveConsent("rejected")}
            className="px-4 py-2 rounded-lg border border-brand-grey-dark text-brand-grey-light text-sm font-semibold hover:text-white transition-colors"
          >
            {isPt ? "Recusar" : "Decline"}
          </button>
        </div>
      </div>
    </div>
  );
}
