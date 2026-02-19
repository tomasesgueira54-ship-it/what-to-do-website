import Link from "next/link";
import { FaArrowLeft, FaClock } from "react-icons/fa";
import { blogPosts } from "@/data/blog";
import { notFound } from "next/navigation";
import { defaultLocale, locales, type Locale } from "@/i18n.config";
import type { Metadata } from "next";

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

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center text-brand-grey hover:text-brand-red mb-6"
        >
          <FaArrowLeft className="mr-2" />
          {isPt ? "Voltar ao blog" : "Back to blog"}
        </Link>

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
          <p className="text-brand-grey text-lg leading-relaxed mb-6">{excerpt}</p>
          {content ? (
            <div className="space-y-5">
              {content.split("\n\n").map((paragraph, i) => (
                <p key={i} className="text-brand-grey leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: paragraph.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") }} />
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
    </section>
  );
}
