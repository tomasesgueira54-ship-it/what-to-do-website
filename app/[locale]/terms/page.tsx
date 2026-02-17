import Link from "next/link";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const isPt = locale === "pt";

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-6 text-brand-red">
          {isPt ? "Termos e Condições" : "Terms and Conditions"}
        </h1>
        <p className="text-brand-grey mb-6">
          {isPt
            ? "Ao usar este website, concorda com utilização responsável do conteúdo e serviços."
            : "By using this website, you agree to responsible use of content and services."}
        </p>
        <div className="space-y-4 text-brand-grey-light">
          <p>
            {isPt
              ? "As informações de eventos podem mudar; confirme sempre no site oficial."
              : "Event information may change; always confirm on the official source website."}
          </p>
          <p>
            {isPt
              ? "Reservamo-nos o direito de atualizar estes termos sem aviso prévio."
              : "We reserve the right to update these terms without prior notice."}
          </p>
        </div>
        <Link
          href={`/${locale}`}
          className="inline-block mt-8 text-brand-red hover:text-white transition-colors"
        >
          {isPt ? "Voltar ao início" : "Back to home"}
        </Link>
      </div>
    </section>
  );
}
