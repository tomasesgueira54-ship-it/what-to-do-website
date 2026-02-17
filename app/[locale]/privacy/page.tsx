import Link from "next/link";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

export default async function PrivacyPage({
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
          {isPt ? "Política de Privacidade" : "Privacy Policy"}
        </h1>
        <p className="text-brand-grey mb-6">
          {isPt
            ? "Esta página resume como tratamos dados pessoais no What To Do."
            : "This page summarizes how we process personal data at What To Do."}
        </p>
        <div className="space-y-4 text-brand-grey-light">
          <p>
            {isPt
              ? "Usamos os dados fornecidos no formulário de subscrição apenas para comunicações do projeto."
              : "We use subscription form data only for project communications."}
          </p>
          <p>
            {isPt
              ? "Pode pedir remoção dos seus dados a qualquer momento através do nosso contacto."
              : "You can request data deletion at any time through our contact channels."}
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
