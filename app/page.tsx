import Link from 'next/link'
import EpisodeCard from '@/components/EpisodeCard'
import BlogCard from '@/components/BlogCard'
import AudioPlayer from '@/components/AudioPlayer'
import EventCard from '@/components/EventCard'
import { FaArrowRight, FaPodcast, FaPenNib, FaCalendarAlt, FaStar, FaMapMarkedAlt } from 'react-icons/fa'
import { episodes } from '@/data/episodes'
import fs from 'fs/promises'
import path from 'path'
import { Event } from '@/data/types'

// Helper to fetch events
async function getEvents(): Promise<Event[]> {
  try {
    const filePath = path.join(process.cwd(), 'data', 'events.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch {
    return [];
  }
}

export default async function Home() {
  const events = await getEvents();
  // Using the mock data we created
  const latestEpisode = episodes[0];
  const recentEpisodes = episodes.slice(1, 3);

  // Simplified logic for featured/upcoming since scraped data doesn't have 'featured' flag
  // Take first 2 as featured, next 4 as upcoming
  const allSorted = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const featuredEvents = allSorted.slice(0, 2);
  const upcomingEvents = allSorted.slice(2, 6);

const recentPosts = [
  {
    id: '1',
    title: 'Top 5 Rooftops em Lisboa para este Verão',
    excerpt: 'As melhores vistas da cidade acompanhadas de cocktails incríveis.',
    readTime: '5 min',
    publishDate: '10 Mar 2026',
    imageUrl: '/images/blog-rooftop.jpg',
    category: 'Lifestyle'
  },
  {
    id: '2',
    title: 'Roteiro de Fim de Semana em Alfama',
    excerpt: 'Descubra os segredos do bairro mais antigo de Lisboa.',
    readTime: '8 min',
    publishDate: '05 Mar 2026',
    imageUrl: '/images/blog-alfama.jpg',
    category: 'Roteiros'
  },
  {
    id: '3',
    title: 'Onde comer o melhor Ramen de Lisboa',
    excerpt: 'Uma lista dos melhores spots asiáticos na capital.',
    readTime: '6 min',
    publishDate: '01 Mar 2026',
    imageUrl: '/images/blog-ramen.jpg',
    category: 'Restaurantes'
  }
]

  return (
    <>
      {/* Hero Section - Lisbon Events Focus */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-red/10 via-brand-black to-brand-black" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-600 rounded-full blur-[100px] animate-pulse delay-1000" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 text-center">
            <span className="inline-block py-1 px-3 rounded-full bg-brand-red/20 border border-brand-red/40 text-brand-red text-sm font-semibold mb-6 tracking-wide uppercase">
                O Teu Guia Oficial
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white tracking-tight leading-tight">
              WHAT TO DO <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-500">LISBOA</span>
            </h1>
            <p className="text-xl md:text-2xl text-brand-grey-light mb-10 max-w-2xl mx-auto font-light">
              Os melhores eventos, restaurantes, experiências e segredos de Lisboa.
              <br className="hidden md:block" />
              Tudo o que precisas saber para aproveitar a cidade.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="#events" className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                <FaCalendarAlt /> Ver Agenda da Semana
              </Link>
              <Link href="#podcast" className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2">
                <FaPodcast /> Ouvir Podcast
              </Link>
            </div>

            {/* Quick Categories */}
            <div className="mt-16 flex flex-wrap justify-center gap-4 opacity-80">
                {['Concertos', 'Teatro', 'Nightlife', 'Restaurantes', 'Ar Livre', 'Arte'].map((cat) => (
                    <span key={cat} className="px-4 py-2 rounded-lg bg-brand-grey-dark/30 border border-brand-grey-dark/50 text-brand-grey hover:text-white hover:border-brand-red/50 transition-colors cursor-pointer text-sm">
                        {cat}
                    </span>
                ))}
            </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section id="events" className="py-20 bg-brand-black relative">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-2 flex items-center gap-3">
                <FaStar className="text-brand-red" /> Destaques da Semana
              </h2>
              <p className="text-brand-grey">Os eventos imperdíveis nos próximos dias.</p>
            </div>
            <Link href="/events" className="hidden md:flex items-center text-brand-red hover:text-white transition-colors">
              Ver todos os eventos <FaArrowRight className="ml-2" />
            </Link>
          </div>

        {/* Featured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {/* Main Feature - Takes 2 cols on large screens if possible, or just huge */}
            {featuredEvents.map((event) => (
               <div key={event.id} className="lg:col-span-1"> 
                   <EventCard event={event} />
               </div>
            ))}
             {/* Fill the rest with upcoming */}
            {upcomingEvents.map((event) => (
                <div key={event.id}>
                    <EventCard event={event} />
                </div>
            ))}
          </div>

          <div className="text-center md:hidden">
            <Link href="/events" className="btn-secondary w-full">
              Ver todos os eventos
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Episode / Podcast Section */}
      <section id="podcast" className="py-20 bg-gradient-to-b from-brand-grey-dark/20 to-brand-black">
        <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="md:w-1/2">
                    <span className="text-brand-red font-bold tracking-widest uppercase text-sm mb-2 block">O Podcast</span>
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Conversas sobre a cidade</h2>
                    <p className="text-brand-grey text-lg mb-8">
                        Todas as semanas convidamos personalidades de Lisboa para partilhar as suas histórias, 
                        lugares favoritos e visões sobre a cidade.
                    </p>
                    <div className="flex gap-4">
                        <Link href="/episodes" className="btn-primary">
                            Explorar Episódios
                        </Link>
                        <a href="https://spotify.com" target="_blank" className="btn-secondary">
                            Spotify
                        </a>
                    </div>
                </div>
                
                {/* Embedded Player for Latest Episode */}
                <div className="md:w-1/2 w-full bg-brand-black-light p-6 rounded-2xl border border-brand-grey-dark/50 shadow-2xl">
                    <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold bg-brand-red text-white px-2 py-1 rounded">ÚLTIMO EPISÓDIO</span>
                        <span className="text-brand-grey text-xs">{latestEpisode.publishDate}</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{latestEpisode.title}</h3>
                    <p className="text-brand-grey mb-6 line-clamp-2">{latestEpisode.description}</p>
                    <AudioPlayer 
                        audioUrl={latestEpisode.audioUrl}
                        episodeTitle={latestEpisode.title}
                    />
                    <div className="mt-4 text-center">
                        <Link href={`/episodes/${latestEpisode.id}`} className="text-sm text-brand-grey hover:text-white transition-colors">
                            Ver notas do episódio e transcrição &rarr;
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </section>

      {/* Blog/Guides Section */}
      <section className="py-20 bg-brand-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
               Guias & Roteiros
            </h2>
            <p className="text-brand-grey max-w-2xl mx-auto">
              Descubra os melhores restaurantes, bares secretos e roteiros culturais curados pela nossa equipa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog" className="inline-flex items-center text-brand-red hover:text-white transition-colors font-bold text-lg">
              Ler todos os artigos <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-red transform skew-y-3 origin-bottom-left scale-110" />
        <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
                Não percas pitada!
            </h2>
            <p className="text-white/80 text-xl mb-10 max-w-2xl mx-auto">
                Recebe a nossa newsletter semanal com os melhores eventos e planos para o fim de semana em Lisboa diretamente no teu email.
            </p>
            <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
                <input 
                    type="email" 
                    placeholder="O teu email" 
                    className="flex-1 px-6 py-4 rounded-full bg-white text-brand-black focus:outline-none focus:ring-4 focus:ring-brand-black/20"
                />
                <button type="button" className="px-8 py-4 rounded-full bg-brand-black text-white font-bold hover:bg-brand-grey-dark transition-colors">
                    Subscrever
                </button>
            </form>
        </div>
      </section>
    </>
  )
}
