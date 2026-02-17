import EpisodeCard from '@/components/EpisodeCard'
import Link from 'next/link'
import { FaPodcast } from 'react-icons/fa'

const episodes = [
  {
    id: '1',
    title: 'Episódio #1 - Bem-vindos ao What To Do',
    description:
      'Apresentamos o podcast, os objetivos do projeto e partilhamos algumas histórias que marcam o início desta jornada.',
    duration: '45:30',
    publishDate: '15 Fev 2026',
    imageUrl: '/images/episode-1.jpg',
  },
  {
    id: '2',
    title: 'Episódio #2 - Produtividade e Rotinas',
    description:
      'Falamos sobre como criar rotinas consistentes, hábitos sustentáveis e estratégias para aumentar a produtividade.',
    duration: '38:15',
    publishDate: '12 Fev 2026',
    imageUrl: '/images/episode-2.jpg',
  },
  {
    id: '3',
    title: 'Episódio #3 - Viagens e Aventuras',
    description:
      'Histórias de viagens, decisões de última hora, malas mal feitas e tudo o que acontece quando decidimos sair da zona de conforto.',
    duration: '52:20',
    publishDate: '9 Fev 2026',
    imageUrl: '/images/episode-3.jpg',
  },
]

export default function EpisodesPage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <FaPodcast className="text-3xl text-brand-red" />
            <div>
              <h1 className="section-title mb-1">Episódios do Podcast</h1>
              <p className="text-brand-grey">
                Ouça todas as conversas, histórias e temas que exploramos no What To Do.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Link href="/" className="btn-secondary">
              Voltar ao Início
            </Link>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {episodes.map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </div>
    </section>
  )
}
