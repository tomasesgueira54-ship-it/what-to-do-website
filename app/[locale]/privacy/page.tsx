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

  const sections = isPt
    ? [
        {
          title: "1. Responsável pelo tratamento",
          body: "What To Do é um projeto editorial independente sediado em Lisboa, Portugal. Para questões relacionadas com privacidade, contacte-nos através do email disponível no rodapé do site.",
        },
        {
          title: "2. Dados que recolhemos",
          body: "Recolhemos apenas os dados que nos fornece voluntariamente: (a) endereço de e-mail e nome, quando se subscreve à nossa newsletter; (b) dados de navegação anónimos (páginas visitadas, duração da sessão) para fins estatísticos internos, sem identificação individual.",
        },
        {
          title: "3. Finalidade e base legal",
          body: "Os dados de subscrição são tratados com base no seu consentimento expresso (Art.º 6.º, n.º 1, al. a) do RGPD) para o envio de comunicações editoriais sobre eventos e conteúdos culturais em Lisboa. Os dados de navegação são tratados com base no interesse legítimo para melhoria do serviço.",
        },
        {
          title: "4. Partilha de dados",
          body: "Não vendemos nem partilhamos os seus dados pessoais com terceiros para fins comerciais. Podemos recorrer a prestadores de serviços técnicos (como plataformas de envio de email) que atuam como subcontratantes e estão sujeitos a acordos de confidencialidade.",
        },
        {
          title: "5. Conservação dos dados",
          body: "Os seus dados são conservados enquanto a subscrição estiver ativa. Após cancelamento da subscrição, os dados são eliminados no prazo máximo de 30 dias.",
        },
        {
          title: "6. Os seus direitos",
          body: "Ao abrigo do RGPD, tem direito a aceder, retificar, apagar, limitar ou opor-se ao tratamento dos seus dados, bem como o direito à portabilidade. Para exercer qualquer destes direitos, basta enviar-nos um e-mail. Tem ainda o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (CNPD).",
        },
        {
          title: "7. Cookies",
          body: "Este site utiliza cookies técnicos estritamente necessários ao funcionamento. Não utilizamos cookies de rastreamento publicitário. Pode desativar cookies nas definições do seu navegador, mas tal pode afetar a experiência de navegação.",
        },
        {
          title: "8. Alterações a esta política",
          body: "Podemos atualizar esta política periodicamente. Alterações significativas serão comunicadas por e-mail aos subscritores. A data da última atualização é indicada no fim desta página.",
        },
      ]
    : [
        {
          title: "1. Data Controller",
          body: "What To Do is an independent editorial project based in Lisbon, Portugal. For privacy-related questions, please contact us via the email address provided in the site footer.",
        },
        {
          title: "2. Data We Collect",
          body: "We only collect data you voluntarily provide: (a) email address and name when subscribing to our newsletter; (b) anonymous browsing data (pages visited, session duration) for internal statistical purposes, without individual identification.",
        },
        {
          title: "3. Purpose and Legal Basis",
          body: "Subscription data is processed based on your explicit consent (Art. 6(1)(a) GDPR) to send editorial communications about events and cultural content in Lisbon. Navigation data is processed based on legitimate interest to improve the service.",
        },
        {
          title: "4. Data Sharing",
          body: "We do not sell or share your personal data with third parties for commercial purposes. We may use technical service providers (such as email delivery platforms) acting as processors under confidentiality agreements.",
        },
        {
          title: "5. Retention",
          body: "Your data is retained while your subscription is active. After unsubscribing, your data is deleted within a maximum of 30 days.",
        },
        {
          title: "6. Your Rights",
          body: "Under GDPR, you have the right to access, rectify, erase, restrict, or object to the processing of your data, as well as the right to data portability. To exercise any of these rights, simply send us an email. You also have the right to lodge a complaint with your national data protection authority.",
        },
        {
          title: "7. Cookies",
          body: "This site uses strictly necessary technical cookies for functionality. We do not use advertising tracking cookies. You can disable cookies in your browser settings, though this may affect your browsing experience.",
        },
        {
          title: "8. Changes to This Policy",
          body: "We may update this policy periodically. Significant changes will be communicated by email to subscribers. The date of the last update is indicated at the bottom of this page.",
        },
      ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-2 text-brand-red">
          {isPt ? "Política de Privacidade" : "Privacy Policy"}
        </h1>
        <p className="text-brand-grey text-sm mb-10">
          {isPt
            ? "Última atualização: fevereiro de 2026"
            : "Last updated: February 2026"}
        </p>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-white font-semibold text-lg mb-2">
                {s.title}
              </h2>
              <p className="text-brand-grey leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <Link
          href={`/${locale}`}
          className="inline-block mt-12 text-brand-red hover:text-white transition-colors"
        >
          {isPt ? "← Voltar à página inicial" : "← Back to homepage"}
        </Link>
      </div>
    </section>
  );
}
