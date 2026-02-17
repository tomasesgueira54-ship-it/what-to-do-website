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

export const metadata: Metadata = {
  title: "What To Do - Lisboa | Eventos & Guia de Lazer",
  description:
    "O que fazer esta semana e fim-de-semana em Lisboa. Os melhores eventos, experiências e spots imperdíveis.",
};

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
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
      <Header locale={locale} />
      <main className="min-h-screen">{children}</main>
      <Footer locale={locale} />
      <StickyPlayer />
    </div>
  );
}
