import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

const translations = {
  pt: {
    title: "Guias & Artigos",
    subtitle: "Dicas, roteiros e histórias sobre Lisboa",
    back: "Voltar",
  },
  en: {
    title: "Guides & Articles",
    subtitle: "Tips, itineraries and stories about Lisbon",
    back: "Back",
  },
};

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;

  const t = translations[locale];

  // Transform blog posts to locale-specific format
  const posts = blogPosts.map((post) => ({
    id: post.id,
    title: locale === "pt" ? post.titlePt : post.titleEn,
    excerpt: locale === "pt" ? post.excerptPt : post.excerptEn,
    readTime: post.readTime,
    publishDate: post.publishDate,
    imageUrl: post.imageUrl,
    category: locale === "pt" ? post.categoryPt : post.categoryEn,
  }));

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

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} locale={locale} />
        ))}
      </div>
    </div>
  );
}
