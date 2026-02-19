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

  const sections = isPt
    ? [
        {
          title: "1. Aceitação dos Termos",
          body: "Ao aceder e utilizar o website What To Do (what-to-do.pt), aceita ficar vinculado aos presentes Termos e Condições. Se não concordar com alguma parte destes termos, pedimos que não utilize o serviço.",
        },
        {
          title: "2. Descrição do Serviço",
          body: "What To Do é um agregador editorial de eventos culturais em Lisboa. Compilamos e apresentamos informação sobre eventos, concertos, exposições, mercados e outras atividades obtida de fontes públicas. Não somos organizadores dos eventos listados.",
        },
        {
          title: "3. Exatidão da Informação",
          body: "Fazemos todos os esforços para manter a informação atualizada e correta, mas não garantimos a sua exatidão, completude ou atualidade. Datas, horários, preços e locais podem mudar sem aviso. Recomendamos sempre verificar no site oficial do evento antes de se deslocar.",
        },
        {
          title: "4. Propriedade Intelectual",
          body: "O conteúdo editorial produzido pela equipa What To Do (textos, seleções, guias) é protegido por direitos de autor. As informações factuais sobre eventos (título, data, local) são de domínio público. Não é permitida a reprodução do conteúdo editorial sem autorização expressa.",
        },
        {
          title: "5. Links para Sites Externos",
          body: "O nosso site contém links para websites de terceiros (fontes dos eventos, plataformas de venda de bilhetes). Estes links são fornecidos por conveniência. Não temos controlo sobre o conteúdo desses sites e não assumimos responsabilidade pela sua disponibilidade ou conteúdo.",
        },
        {
          title: "6. Limitação de Responsabilidade",
          body: "What To Do não será responsável por quaisquer danos diretos, indiretos ou consequenciais resultantes do uso ou impossibilidade de uso deste website, incluindo perdas decorrentes de informação incorreta sobre eventos.",
        },
        {
          title: "7. Subscrição de Newsletter",
          body: "Ao subscrever a nossa newsletter, concorda em receber comunicações periódicas sobre eventos e conteúdos culturais em Lisboa. Pode cancelar a subscrição a qualquer momento através do link de unsubscribe presente em cada email.",
        },
        {
          title: "8. Alterações aos Termos",
          body: "Reservamo-nos o direito de atualizar estes Termos e Condições a qualquer momento. As alterações entram em vigor imediatamente após publicação. O uso continuado do serviço após alterações constitui aceitação dos novos termos.",
        },
        {
          title: "9. Lei Aplicável",
          body: "Estes termos são regidos pela legislação portuguesa. Qualquer litígio será submetido à jurisdição exclusiva dos tribunais de Lisboa, Portugal.",
        },
      ]
    : [
        {
          title: "1. Acceptance of Terms",
          body: "By accessing and using the What To Do website (what-to-do.pt), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use the service.",
        },
        {
          title: "2. Service Description",
          body: "What To Do is an editorial aggregator of cultural events in Lisbon. We compile and present information about events, concerts, exhibitions, markets, and other activities sourced from public channels. We are not organizers of the listed events.",
        },
        {
          title: "3. Accuracy of Information",
          body: "We make every effort to keep information up to date and accurate, but do not guarantee its accuracy, completeness, or timeliness. Dates, times, prices, and venues may change without notice. We always recommend verifying on the official event website before attending.",
        },
        {
          title: "4. Intellectual Property",
          body: "Editorial content produced by the What To Do team (texts, selections, guides) is protected by copyright. Factual information about events (title, date, venue) is in the public domain. Reproduction of editorial content without express authorization is not permitted.",
        },
        {
          title: "5. Links to External Sites",
          body: "Our site contains links to third-party websites (event sources, ticketing platforms). These links are provided for convenience. We have no control over the content of those sites and assume no responsibility for their availability or content.",
        },
        {
          title: "6. Limitation of Liability",
          body: "What To Do shall not be liable for any direct, indirect, or consequential damages resulting from the use or inability to use this website, including losses arising from incorrect event information.",
        },
        {
          title: "7. Newsletter Subscription",
          body: "By subscribing to our newsletter, you agree to receive periodic communications about events and cultural content in Lisbon. You may unsubscribe at any time via the unsubscribe link in each email.",
        },
        {
          title: "8. Changes to Terms",
          body: "We reserve the right to update these Terms and Conditions at any time. Changes take effect immediately upon publication. Continued use of the service after changes constitutes acceptance of the new terms.",
        },
        {
          title: "9. Governing Law",
          body: "These terms are governed by Portuguese law. Any dispute shall be submitted to the exclusive jurisdiction of the courts of Lisbon, Portugal.",
        },
      ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="font-display text-4xl font-bold mb-2 text-brand-red">
          {isPt ? "Termos e Condições" : "Terms and Conditions"}
        </h1>
        <p className="text-brand-grey text-sm mb-10">
          {isPt ? "Última atualização: janeiro de 2025" : "Last updated: January 2025"}
        </p>

        <div className="space-y-8">
          {sections.map((s) => (
            <div key={s.title}>
              <h2 className="text-white font-semibold text-lg mb-2">{s.title}</h2>
              <p className="text-brand-grey leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>

        <Link
          href={`/${locale}`}
          className="inline-block mt-12 text-brand-red hover:text-white transition-colors"
        >
          {isPt ? "← Voltar ao início" : "← Back to home"}
        </Link>
      </div>
    </section>
  );
}
