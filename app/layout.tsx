import type { Metadata } from "next";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";

// TODO — FAVICON
//   Ficheiro: public/favicon.ico  (ACTUALMENTE EM FALTA — página aparece sem ícone no browser)
//   Dimensões obrigatórias: 32×32 px (formato ICO multi-size: 16x16 + 32x32 dentro do .ico)
//   Conteúdo: versão simplificada do logo "WT" ou só a letra "W" na cor brand-red (#E53E3E)
//     sobre fundo preto (#0A0A0A); deve ser legível a 16px
//   Também recomendado:
//     • public/apple-touch-icon.png  — 180×180 px (iOS home screen)
//     • public/icon-192.png           — 192×192 px (Android PWA)
//     • public/icon-512.png           — 512×512 px (Android PWA splash)
//   Ferramenta rápida: https://favicon.io  (gera tudo a partir de uma imagem ou texto)

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://what-to-do.vercel.app";
const defaultOgImage = `${siteUrl}/podcasts/images/podcast-banner.png`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "What To Do - Lisboa | Eventos & Guia de Lazer",
  description:
    "O que fazer esta semana e fim-de-semana em Lisboa. Os melhores eventos, experiências e spots imperdíveis. Your Lisbon weekend guide.",
  keywords: [
    "lisboa",
    "eventos",
    "what to do",
    "roteiros",
    "lazer",
    "fim de semana",
    "guia turistico",
  ],
  authors: [{ name: "What To Do Team" }],
  openGraph: {
    title: "What To Do - Lisboa | Eventos & Guia de Lazer",
    description: "O teu guia definitivo para descobrir o que fazer em Lisboa.",
    type: "website",
    locale: "pt_PT",
    images: [{ url: defaultOgImage }],
  },
  twitter: {
    card: "summary_large_image",
    images: [defaultOgImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-PT" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link rel="dns-prefetch" href="https://www.agendalx.pt" />
        <link rel="dns-prefetch" href="https://img.evbuc.com" />
        <link rel="dns-prefetch" href="https://images.xceed.me" />
        <link rel="dns-prefetch" href="https://secure.meetupstatic.com" />
      </head>
      <body className="font-sans bg-brand-black text-brand-white antialiased">
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
