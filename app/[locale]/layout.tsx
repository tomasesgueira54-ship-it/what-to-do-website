import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyPlayer from "@/components/StickyPlayer";
import CookieConsent from "@/components/CookieConsent";
import AnalyticsTracker from "@/components/AnalyticsTracker";
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
  const defaultOgImage = `${siteUrl}/podcasts/images/podcast-banner.png`;

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
      images: [{ url: defaultOgImage }],
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
      images: [defaultOgImage],
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

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://what-to-do.vercel.app";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "What To Do",
        description:
          locale === "pt"
            ? "O que fazer em Lisboa — eventos, concertos, exposições e experiências."
            : "What to do in Lisbon — events, concerts, exhibitions and experiences.",
        inLanguage: locale === "pt" ? "pt-PT" : "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${siteUrl}/${locale}/events?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "What To Do",
        url: siteUrl,
        email: "whattodoofficialmail@gmail.com",
        sameAs: [
          "https://instagram.com/whattodomedia",
          "https://youtube.com/@whattodo",
        ],
        logo: {
          "@type": "ImageObject", // TODO — LOGO: public/images/logo.png  (ACTUALMENTE EM FALTA)
          //   Usado no Schema.org Organization — Google usa este logo em resultados de pesquisa
          //   e no Knowledge Panel. É uma das imagens mais importantes para SEO.
          //   Dimensões obrigatórias: mínimo 112×112 px; recomendado 512×512 px ou maior
          //   Formato: PNG com fundo transparente (preferível) ou branco sólido
          //   Conteúdo: logo completo "What To Do" ou só o símbolo/monograma "WTD"
          //     em brand-red (#E53E3E) — deve ser legível sobre fundo branco e escuro
          //   Nota: não pode ter bordas, padding ou texto extra que não seja o logo          url: `${siteUrl}/images/logo.png`,
        },
      },
    ],
  };

  return (
    <div
      lang={locale}
      className={`${inter.variable} ${montserrat.variable} font-sans bg-brand-black text-brand-white antialiased`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
      <AnalyticsTracker locale={locale} />
      <Footer locale={locale} />
      <StickyPlayer locale={locale} />
      <CookieConsent locale={locale} />
    </div>
  );
}
