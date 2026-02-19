import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyPlayer from "@/components/StickyPlayer";
import { ReactNode } from "react";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://what-to-do.vercel.app";

  return {
    metadataBase: new URL(siteUrl),
    title:
      locale === "pt"
        ? "What To Do - Lisboa | Eventos & Guia de Lazer"
        : "What To Do - Lisbon | Events & Leisure Guide",
    description:
      locale === "pt"
        ? "O que fazer esta semana e fim-de-semana em Lisboa. Os melhores eventos, experiências e spots imperdíveis."
        : "What to do in Lisbon this week and weekend. The best events, experiences and must-see spots.",
    alternates: {
      canonical: `/${locale}`,
      languages: {
        pt: "/pt",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "pt" ? "pt_PT" : "en_US",
      url: `/${locale}`,
      title:
        locale === "pt"
          ? "What To Do - Lisboa | Eventos & Guia de Lazer"
          : "What To Do - Lisbon | Events & Leisure Guide",
      description:
        locale === "pt"
          ? "O teu guia definitivo para descobrir o que fazer em Lisboa."
          : "Your definitive guide to discovering what to do in Lisbon.",
      siteName: "What To Do",
    },
    twitter: {
      card: "summary_large_image",
      title:
        locale === "pt"
          ? "What To Do - Lisboa | Eventos & Guia de Lazer"
          : "What To Do - Lisbon | Events & Leisure Guide",
      description:
        locale === "pt"
          ? "O teu guia definitivo para descobrir o que fazer em Lisboa."
          : "Your definitive guide to discovering what to do in Lisbon.",
    },
  };
}

export async function generateStaticParams() {
  return [{ locale: "pt" }, { locale: "en" }];
}

export default async function RootLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  return (
    <div
      lang={locale}
      className={`${inter.variable} ${montserrat.variable} font-sans bg-brand-black text-brand-white antialiased`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand-red focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        {locale === "pt" ? "Saltar para o conteúdo" : "Skip to content"}
      </a>
      <Header locale={locale} />
      <main id="main-content" className="min-h-screen">
        {children}
      </main>
      <Footer locale={locale} />
      <StickyPlayer />
    </div>
  );
}
