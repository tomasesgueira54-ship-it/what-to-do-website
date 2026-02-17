import Link from 'next/link'
import { FaPodcast, FaPenNib, FaCalendarAlt } from 'react-icons/fa'

export default function AboutPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <header className="mb-8">
          <h1 className="section-title mb-3">Sobre o What To Do - Lisboa</h1>
          <p className="text-brand-grey max-w-2xl text-lg">
            O teu guia definitivo para descobrir o que fazer em Lisboa. Desde eventos imperdíveis
            a segredos escondidos, trazemos-te as melhores sugestões para aproveitar a cidade ao máximo.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card p-6 flex flex-col items-start gap-3 border border-brand-red/20 shadow-brand-red/5">
            <FaCalendarAlt className="text-3xl text-brand-red" />
            <h2 className="text-lg font-semibold text-white">Agenda Semanal</h2>
            <p className="text-brand-grey text-sm">
              Curaçadoria semanal dos melhores concertos, exposições, teatro e festas 
              que acontecem em Lisboa.
            </p>
          </div>

          <div className="card p-6 flex flex-col items-start gap-3">
             <FaPodcast className="text-3xl text-brand-red" />
            <h2 className="text-lg font-semibold text-white">Podcast</h2>
            <p className="text-brand-grey text-sm">
              Conversas com personalidades de Lisboa, artistas e empreendedores sobre 
              os seus projetos e a sua visão da cidade.
            </p>
          </div>

          <div className="card p-6 flex flex-col items-start gap-3">
             <FaPenNib className="text-3xl text-brand-red" />
            <h2 className="text-lg font-semibold text-white">Guias & Roteiros</h2>
            <p className="text-brand-grey text-sm">
              Sugestões de restaurantes, bares, passeios e experiências únicas 
              testadas pela nossa equipa.
            </p>
          </div>
        </div>

        <div className="card p-8 mb-10 bg-brand-black-light border border-brand-grey-dark/30">
          <h2 className="text-2xl font-display font-bold mb-4 text-white">
            A nossa missão
          </h2>
          <p className="text-brand-grey mb-4 text-lg">
            Lisboa está cheia de vida, mas às vezes é difícil saber por onde começar. 
            O <strong>What To Do</strong> nasceu para responder à pergunta clássica: &quot;O que vamos fazer hoje?&quot;.
          </p>
          <p className="text-brand-grey mb-4">
            Queremos conectar-te com a cultura vibrante da cidade, apoiar artistas locais e 
            garantir que nunca fiques sem planos para o fim de semana.
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Link href="/episodes" className="btn-primary">
            Ouvir Episódios
          </Link>
          <Link href="/blog" className="btn-secondary">
            Ler Artigos
          </Link>
        </div>
      </div>
    </section>
  )
}
