import Link from 'next/link'
import { FaArrowLeft, FaClock } from 'react-icons/fa'

interface BlogPostPageProps {
  params: {
    id: string
  }
}

const postsMap: Record<
  string,
  {
    id: string
    title: string
    content: string[]
    readTime: string
    publishDate: string
    category: string
  }
> = {
  '1': {
    id: '1',
    title: '10 Dicas para Começar um Podcast em 2026',
    readTime: '8 min',
    publishDate: '14 Fev 2026',
    category: 'Podcasting',
    content: [
      'Começar um podcast hoje é mais fácil do que nunca, mas isso não significa que deva ser feito sem planeamento.',
      'Antes de qualquer microfone, define o conceito: sobre o que é o podcast, para quem é e que tipo de episódios vais lançar.',
      'Investe o mínimo necessário em equipamento decente, foca-te mais em conteúdo consistente e boa edição básica.',
    ],
  },
  '2': {
    id: '2',
    title: 'Como Organizar Melhor o Seu Tempo',
    readTime: '6 min',
    publishDate: '11 Fev 2026',
    category: 'Produtividade',
    content: [
      'A organização do tempo começa por entender onde ele está a ser gasto agora.',
      'Uma simples revisão da tua semana pode mostrar padrões óbvios de distração e desperdício.',
      'Começa com blocos de tempo para tarefas importantes e reduz as decisões desnecessárias no dia a dia.',
    ],
  },
  '3': {
    id: '3',
    title: 'Os Melhores Destinos para 2026',
    readTime: '10 min',
    publishDate: '8 Fev 2026',
    category: 'Viagens',
    content: [
      'Viajar não precisa ser sinónimo de gastar tudo o que tens.',
      'Escolher destinos fora de época, usar alojamentos alternativos e focar-se em experiências locais muda tudo.',
      'O objetivo é voltar com histórias, não só com fotos bonitas para as redes sociais.',
    ],
  },
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = postsMap[params.id]

  if (!post) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <p className="text-brand-grey mb-4">Artigo não encontrado.</p>
          <Link href="/blog" className="btn-secondary">
            Voltar ao blog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link href="/blog" className="inline-flex items-center text-brand-grey hover:text-brand-red mb-6">
          <FaArrowLeft className="mr-2" />
          Voltar ao blog
        </Link>

        <header className="mb-8">
          <span className="inline-block bg-brand-red/20 text-brand-red text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {post.category}
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-brand-grey text-sm">
            <span>{post.publishDate}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-1">
              <FaClock /> {post.readTime}
            </span>
          </div>
        </header>

        <article className="prose prose-invert max-w-none">
          {post.content.map((paragraph, index) => (
            <p key={index} className="text-brand-grey mb-4">
              {paragraph}
            </p>
          ))}
        </article>
      </div>
    </section>
  )
}
