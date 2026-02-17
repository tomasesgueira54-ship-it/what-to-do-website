import BlogCard from '@/components/BlogCard'
import Link from 'next/link'
import { FaPenNib, FaMapMarkedAlt } from 'react-icons/fa'

const posts = [
  {
    id: '1',
    title: 'Top 5 Rooftops em Lisboa para este Verão',
    excerpt: 'As melhores vistas da cidade acompanhadas de cocktails incríveis e boas vibes.',
    readTime: '5 min',
    publishDate: '10 Mar 2026',
    imageUrl: '/images/blog-rooftop.jpg',
    category: 'Lifestyle'
  },
  {
    id: '2',
    title: 'Roteiro de Fim de Semana em Alfama',
    excerpt: 'Descubra os segredos do bairro mais antigo de Lisboa, onde comer e o que visitar.',
    readTime: '8 min',
    publishDate: '05 Mar 2026',
    imageUrl: '/images/blog-alfama.jpg',
    category: 'Roteiros'
  },
  {
    id: '3',
    title: 'Onde comer o melhor Ramen de Lisboa',
    excerpt: 'Uma lista dos melhores spots asiáticos na capital para aquecer a alma.',
    readTime: '6 min',
    publishDate: '01 Mar 2026',
    imageUrl: '/images/blog-ramen.jpg',
    category: 'Restaurantes'
  },
  {
    id: '4',
    title: 'Exposições a não perder em Março',
    excerpt: 'Agenda cultural com as exposições mais interessantes do mês em museus e galerias.',
    readTime: '4 min',
    publishDate: '28 Fev 2026',
    imageUrl: '/images/blog-art.jpg',
    category: 'Arte'
  }
]

export default function BlogPage() {
  return (
    <>
      <section className="py-20 bg-brand-black-light text-center">
        <div className="container mx-auto px-4">
           <Link href="/" className="inline-block mb-6 text-brand-grey hover:text-white transition-colors">
             &larr; Voltar
           </Link>
           <div className="flex justify-center mb-6">
             <div className="p-4 bg-brand-red rounded-full shadow-lg shadow-brand-red/20">
               <FaMapMarkedAlt className="text-4xl text-white" />
             </div>
           </div>
           
           <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
             Guias e Roteiros
           </h1>
           <p className="text-xl text-brand-grey max-w-2xl mx-auto">
             Descubra as nossas curadorias semanais, reviews de restaurantes e roteiros secretos para explorar Lisboa.
           </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
