import Link from "next/link";
import { FaArrowLeft, FaPodcast, FaUsers, FaHeart } from "react-icons/fa";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

const translations = {
  pt: {
    title: "Sobre Nós",
    subtitle: "Conheça a história por trás do What To Do",
    back: "Voltar",
    mission: "Nossa Missão",
    missionText:
      "Queremos ajudar você a descobrir o melhor que Lisboa tem para oferecer. Através de um podcast inspirador e um blog completo, compartilhamos histórias, dicas práticas e experiências únicas que transformam sua forma de explorar a cidade.",
    team: "O Time",
    teamText:
      "Somos uma pequena equipe apaixonada por Lisboa e pela criação de conteúdo de qualidade. Cada episódio e artigo é feito com cuidado para oferecer valor real aos nossos ouvintes e leitores.",
    values: "Nossos Valores",
    authenticity: "Autenticidade",
    community: "Comunidade",
    quality: "Qualidade",
  },
  en: {
    title: "About Us",
    subtitle: "Get to know the story behind What To Do",
    back: "Back",
    mission: "Our Mission",
    missionText:
      "We want to help you discover the best that Lisbon has to offer. Through an inspiring podcast and a comprehensive blog, we share stories, practical tips and unique experiences that transform the way you explore the city.",
    team: "The Team",
    teamText:
      "We are a small team passionate about Lisbon and creating quality content. Each episode and article is crafted with care to provide real value to our listeners and readers.",
    values: "Our Values",
    authenticity: "Authenticity",
    community: "Community",
    quality: "Quality",
  },
};

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const t = translations[locale];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Link
            href={`/${locale}`}
            className="text-brand-red hover:text-brand-red-light transition-colors flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            {t.back}
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-brand-red">
          {t.title}
        </h1>
        <p className="text-brand-grey text-lg">{t.subtitle}</p>
      </div>

      {/* Mission Section */}
      <section className="mb-16 pb-8 border-b border-brand-grey/20">
        <div className="flex items-center gap-3 mb-6">
          <FaPodcast className="text-3xl text-brand-red" />
          <h2 className="text-3xl font-bold font-display text-brand-red">
            {t.mission}
          </h2>
        </div>
        <p className="text-brand-grey text-lg leading-relaxed max-w-2xl">
          {t.missionText}
        </p>
      </section>

      {/* Team Section */}
      <section className="mb-16 pb-8 border-b border-brand-grey/20">
        <div className="flex items-center gap-3 mb-6">
          <FaUsers className="text-3xl text-brand-red" />
          <h2 className="text-3xl font-bold font-display text-brand-red">
            {t.team}
          </h2>
        </div>
        <p className="text-brand-grey text-lg leading-relaxed max-w-2xl">
          {t.teamText}
        </p>
      </section>

      {/* Values Section */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <FaHeart className="text-3xl text-brand-red" />
          <h2 className="text-3xl font-bold font-display text-brand-red">
            {t.values}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-brand-grey-dark rounded-lg hover:bg-brand-grey-dark/80 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-brand-red">
              {t.authenticity}
            </h3>
            <p className="text-brand-grey">
              {locale === "pt"
                ? "Acreditamos na experiência autêntica e na honestidade em cada recomendação."
                : "We believe in authentic experiences and honesty in every recommendation."}
            </p>
          </div>

          <div className="p-6 bg-brand-grey-dark rounded-lg hover:bg-brand-grey-dark/80 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-brand-red">
              {t.community}
            </h3>
            <p className="text-brand-grey">
              {locale === "pt"
                ? "Construímos uma comunidade de pessoas apaixonadas por descobrir Lisboa."
                : "We build a community of people passionate about discovering Lisbon."}
            </p>
          </div>

          <div className="p-6 bg-brand-grey-dark rounded-lg hover:bg-brand-grey-dark/80 transition-colors">
            <h3 className="text-xl font-bold mb-3 text-brand-red">
              {t.quality}
            </h3>
            <p className="text-brand-grey">
              {locale === "pt"
                ? "Todos os conteúdos são criados com cuidado e atenção ao detalhe."
                : "All content is created with care and attention to detail."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
