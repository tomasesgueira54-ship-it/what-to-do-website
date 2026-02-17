import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { AudioProvider } from "@/context/AudioContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt">
      <body
        className={`${inter.variable} ${montserrat.variable} font-sans bg-brand-black text-brand-white antialiased`}
      >
        <AudioProvider>{children}</AudioProvider>
      </body>
    </html>
  );
}
