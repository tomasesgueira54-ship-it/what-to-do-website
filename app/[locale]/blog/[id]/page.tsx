import Link from "next/link";
import { FaArrowLeft, FaClock } from "react-icons/fa";
import { blogPosts } from "@/data/blog";
import { notFound } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import type { Metadata } from "next";
import BlogCard from "@/components/BlogCard";

const MONTHS: Record<string, number> = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
};

const parsePublishDate = (value: string): number => {
  const parsed = Date.parse(value);
  if (!Number.isNaN(parsed)) return parsed;

  const match = value.trim().match(/^(\d{1,2})\s+([a-zA-Z]{3})\s+(\d{4})$/);
  if (!match) return 0;

  const day = Number(match[1]);
  const month = MONTHS[match[2].toLowerCase()];
  const year = Number(match[3]);
  if (month === undefined || Number.isNaN(day) || Number.isNaN(year)) return 0;
  return new Date(year, month, day).getTime();
};

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    blogPosts.map((post) => ({ locale, id: post.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, id } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const post = blogPosts.find((item) => item.id === id);
  if (!post) return {};
  return {
    title: `${locale === "pt" ? post.titlePt : post.titleEn} — What To Do Blog`,
    description: locale === "pt" ? post.excerptPt : post.excerptEn,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: localeParam, id } = await params;
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale;
  const isPt = locale === "pt";
  const post = blogPosts.find((item) => item.id === id);

  if (!post) {
    notFound();
  }

  const title = isPt ? post.titlePt : post.titleEn;
  const excerpt = isPt ? post.excerptPt : post.excerptEn;
  const content = isPt ? post.contentPt : post.contentEn;
  const category = isPt ? post.categoryPt : post.categoryEn;

  const relatedPosts = blogPosts
    .filter((item) => item.id !== post.id)
    .map((item) => {
      const itemCategory = isPt ? item.categoryPt : item.categoryEn;
      return {
        id: item.id,
        title: isPt ? item.titlePt : item.titleEn,
        excerpt: isPt ? item.excerptPt : item.excerptEn,
        readTime: item.readTime,
        publishDate: item.publishDate,
        imageUrl: item.imageUrl,
        category: itemCategory,
        score: itemCategory === category ? 2 : 0,
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return parsePublishDate(b.publishDate) - parsePublishDate(a.publishDate);
    })
    .slice(0, 3);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <nav className="flex items-center gap-2 text-sm text-brand-grey mb-8 flex-wrap">
          <Link
            href={`/${locale}`}
            className="hover:text-brand-red transition-colors"
          >
            {isPt ? "Início" : "Home"}
          </Link>
          <span className="text-brand-grey-dark">/</span>
          <Link
            href={`/${locale}/blog`}
            className="hover:text-brand-red transition-colors"
          >
            {isPt ? "Blog" : "Blog"}
          </Link>
          <span className="text-brand-grey-dark">/</span>
          <span className="text-white truncate max-w-[200px]">{title}</span>
        </nav>

        <div className="max-w-3xl mx-auto">
          <header className="mb-8">
            <span className="inline-block bg-brand-red/20 text-brand-red text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {category}
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold mb-3">
              {title}
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
            <p className="text-brand-grey text-lg leading-relaxed mb-6">
              {excerpt}
            </p>
            {content ? (
              <div className="space-y-5">
                {content.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-brand-grey leading-relaxed"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(
                        /\*\*(.*?)\*\*/g,
                        "<strong>$1</strong>",
                      ),
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-brand-grey">
                {isPt
                  ? "Artigo completo em breve."
                  : "Full article coming soon."}
              </p>
            )}
          </article>
        </div>

        {relatedPosts.length > 0 && (
          <div className="mt-16 border-t border-brand-grey-dark/40 pt-10">
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-6">
              {isPt ? "Artigos relacionados" : "Related posts"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <BlogCard
                  key={relatedPost.id}
                  post={relatedPost}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
