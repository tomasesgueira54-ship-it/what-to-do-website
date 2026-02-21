import ContactForm from "@/components/ContactForm";
import {
  FaEnvelope,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import type { Metadata } from "next";

const translations = {
  pt: {
    title: "Contacto",
    subtitle:
      "Tens alguma questão, sugestão ou proposta de parceria? Entra em contacto connosco.",
    formTitle: "Envia-nos uma mensagem",
    formSubtitle:
      "Preenche o formulário abaixo e respondemos o mais brevemente possível.",
    directTitle: "Contacto direto",
    directSubtitle: "Também podes contactar-nos através dos seguintes canais.",
    emailLabel: "Email",
    locationLabel: "Localização",
    locationValue: "Lisboa, Portugal",
    socialLabel: "Redes Sociais",
    responseTime: "Tempo de resposta: 24–48 horas",
  },
  en: {
    title: "Contact",
    subtitle:
      "Have a question, suggestion or partnership proposal? Get in touch with us.",
    formTitle: "Send Us a Message",
    formSubtitle:
      "Fill out the form below and we'll get back to you as soon as possible.",
    directTitle: "Direct Contact",
    directSubtitle:
      "You can also reach us directly through the following channels.",
    emailLabel: "Email",
    locationLabel: "Location",
    locationValue: "Lisbon, Portugal",
    socialLabel: "Social Media",
    responseTime: "Response time: 24–48 hours",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  return {
    title:
      locale === "pt"
        ? "Contacto | What To Do - Lisboa"
        : "Contact | What To Do - Lisbon",
    description:
      locale === "pt"
        ? "Entra em contacto com a equipa do What To Do. Questões, sugestões e propostas de parceria."
        : "Get in touch with the What To Do team. Questions, suggestions and partnership proposals.",
  };
}

export default async function ContactPage({
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
    <div className="min-h-screen">
      {/* Hero */}
      <section
        className="relative py-20 overflow-hidden"
        aria-labelledby="contact-page-title"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/8 via-brand-black to-brand-black" />
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-brand-red rounded-full blur-[100px]" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-sm font-semibold mb-4 tracking-wide uppercase">
            {t.title}
          </span>
          <h1
            id="contact-page-title"
            className="font-display text-4xl md:text-6xl font-bold text-white mb-4"
          >
            {t.title}
          </h1>
          <p className="text-lg text-brand-grey-light max-w-xl mx-auto">
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-3" aria-labelledby="contact-form-title">
              <div className="bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-6 md:p-8 shadow-lg">
                <h2
                  id="contact-form-title"
                  className="font-display text-2xl font-bold text-white mb-2"
                >
                  {t.formTitle}
                </h2>
                <p className="text-brand-grey text-sm mb-8">{t.formSubtitle}</p>
                <ContactForm locale={locale} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Direct contact */}
              <div
                className="bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-6 shadow-lg"
                aria-labelledby="contact-direct-title"
              >
                <h3
                  id="contact-direct-title"
                  className="font-display text-lg font-bold text-white mb-4"
                >
                  {t.directTitle}
                </h3>
                <p className="text-brand-grey text-sm mb-6">
                  {t.directSubtitle}
                </p>

                <div className="space-y-4">
                  {/* Email */}
                  <a
                    href="mailto:whattodoofficialmail@gmail.com"
                    aria-label={`${t.emailLabel}: whattodoofficialmail@gmail.com`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-brand-black border border-brand-grey-dark/50 hover:border-brand-red/50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-brand-red/15 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/25 transition-colors">
                      <FaEnvelope
                        className="text-brand-red"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-brand-grey uppercase tracking-wider">
                        {t.emailLabel}
                      </p>
                      <p className="text-white text-sm font-medium">
                        whattodoofficialmail@gmail.com
                      </p>
                    </div>
                  </a>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-brand-black border border-brand-grey-dark/50">
                    <div className="w-10 h-10 bg-brand-red/15 rounded-lg flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt
                        className="text-brand-red"
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-brand-grey uppercase tracking-wider">
                        {t.locationLabel}
                      </p>
                      <p className="text-white text-sm font-medium">
                        {t.locationValue}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div
                className="bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-6 shadow-lg"
                aria-labelledby="contact-social-title"
              >
                <h3
                  id="contact-social-title"
                  className="font-display text-lg font-bold text-white mb-4"
                >
                  {t.socialLabel}
                </h3>
                <div className="flex gap-3">
                  <a
                    href="https://instagram.com/whattodomedia"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-brand-black border border-brand-grey-dark/50 hover:border-brand-red/50 rounded-xl flex items-center justify-center text-brand-grey hover:text-brand-red transition-all"
                    aria-label={
                      locale === "pt"
                        ? "Instagram (abre numa nova aba)"
                        : "Instagram (opens in a new tab)"
                    }
                  >
                    <FaInstagram size={20} aria-hidden="true" />
                  </a>
                  <a
                    href="https://youtube.com/@whattodo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-brand-black border border-brand-grey-dark/50 hover:border-brand-red/50 rounded-xl flex items-center justify-center text-brand-grey hover:text-brand-red transition-all"
                    aria-label={
                      locale === "pt"
                        ? "YouTube (abre numa nova aba)"
                        : "YouTube (opens in a new tab)"
                    }
                  >
                    <FaYoutube size={20} aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-br from-brand-red/10 to-transparent border border-brand-red/20 rounded-2xl p-6 text-center">
                <p className="text-brand-grey-light text-sm font-medium">
                  ⏱ {t.responseTime}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
