import { defaultLocale, locales, type Locale } from "@/i18n.config";
import { getTranslations } from "@/lib/use-translations";
import PromoterLeadForm from "@/components/PromoterLeadForm";
import Link from "next/link";

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const messages = getTranslations(locale);
  const t = (key: string, fallback: string) => {
    const parts = key.split(".");
    let current: any = messages;
    for (const part of parts) current = current?.[part];
    return typeof current === "string" ? current : fallback;
  };

  return (
    <div className="min-h-screen bg-brand-black py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 text-white">
          {t("partners.title", "Parcerias & Promotores")}
        </h1>
        <p className="text-brand-grey text-lg mb-8 leading-relaxed">
          {t(
            "partners.subtitle",
            "Trabalha connosco para promover eventos, experiências e serviços com audiência qualificada em Lisboa.",
          )}
        </p>

        {process.env.SHOW_PARTNER_DASHBOARD === "true" && (
          <div className="mb-8">
            <Link
              href={`/${locale}/partners/dashboard`}
              className="text-sm text-brand-grey hover:text-brand-red transition-colors"
            >
              {locale === "pt"
                ? "Ver dashboard interno de métricas"
                : "View internal metrics dashboard"}
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">
              {t("partners.cards.visibility_title", "Mais Visibilidade")}
            </h3>
            <p className="text-brand-grey text-sm">
              {t(
                "partners.cards.visibility_text",
                "Aparece na agenda, conteúdo editorial e recomendações semanais.",
              )}
            </p>
          </div>
          <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">
              {t("partners.cards.audience_title", "Audiência Qualificada")}
            </h3>
            <p className="text-brand-grey text-sm">
              {t(
                "partners.cards.audience_text",
                "Chega a pessoas que procuram ativamente o que fazer em Lisboa.",
              )}
            </p>
          </div>
          <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-2">
              {t("partners.cards.performance_title", "Performance")}
            </h3>
            <p className="text-brand-grey text-sm">
              {t(
                "partners.cards.performance_text",
                "Mede cliques, interesse e impacto para otimizar resultados.",
              )}
            </p>
          </div>
        </div>

        <PromoterLeadForm locale={locale} />
      </div>
    </div>
  );
}
