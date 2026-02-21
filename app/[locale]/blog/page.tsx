import BlogCard from "@/components/BlogCard";
import { blogPosts } from "@/data/blog";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { defaultLocale, locales, type Locale } from "@/i18n.config";

type SortOption = "latest" | "oldest" | "title_asc" | "title_desc";

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

const normalizeSearch = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();

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

const translations = {
  pt: {
    title: "Guias & Artigos",
    subtitle: "Dicas, roteiros e histórias sobre Lisboa",
    back: "Voltar",
    filtersTitle: "Filtros",
    categoryLabel: "Categoria",
    categoryAll: "Todas",
    sortLabel: "Ordenar",
    searchLabel: "Pesquisar",
    searchPlaceholder: "Título, resumo ou categoria...",
    apply: "Aplicar",
    clear: "Limpar",
    noResults: "Nenhum artigo encontrado para os filtros selecionados.",
    sortOptions: {
      latest: "Mais recentes",
      oldest: "Mais antigos",
      title_asc: "Título (A-Z)",
      title_desc: "Título (Z-A)",
    },
  },
  en: {
    title: "Guides & Articles",
    subtitle: "Tips, itineraries and stories about Lisbon",
    back: "Back",
    filtersTitle: "Filters",
    categoryLabel: "Category",
    categoryAll: "All",
    sortLabel: "Sort",
    searchLabel: "Search",
    searchPlaceholder: "Title, excerpt or category...",
    apply: "Apply",
    clear: "Clear",
    noResults: "No posts found for the selected filters.",
    sortOptions: {
      latest: "Latest",
      oldest: "Oldest",
      title_asc: "Title (A-Z)",
      title_desc: "Title (Z-A)",
    },
  },
};

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}) {
  const { locale: localeParam } = await params;
  const { category, sort, q } = await searchParams;
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

  const uniqueCategories = Array.from(
    new Set(posts.map((post) => post.category)),
  ).sort((a, b) => a.localeCompare(b, locale === "pt" ? "pt-PT" : "en-US"));

  const selectedCategory =
    category && uniqueCategories.includes(category) ? category : "";
  const searchQuery = q?.trim() || "";
  const normalizedQuery = normalizeSearch(searchQuery);
  const selectedSort: SortOption =
    sort === "oldest" ||
    sort === "title_asc" ||
    sort === "title_desc" ||
    sort === "latest"
      ? sort
      : "latest";

  const filteredPosts = posts.filter((post) => {
    if (selectedCategory && post.category !== selectedCategory) return false;
    if (!normalizedQuery) return true;

    const haystack = normalizeSearch(
      `${post.title} ${post.excerpt} ${post.category}`,
    );
    return haystack.includes(normalizedQuery);
  });

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (selectedSort === "title_asc") {
      return a.title.localeCompare(
        b.title,
        locale === "pt" ? "pt-PT" : "en-US",
      );
    }
    if (selectedSort === "title_desc") {
      return b.title.localeCompare(
        a.title,
        locale === "pt" ? "pt-PT" : "en-US",
      );
    }

    const aDate = parsePublishDate(a.publishDate);
    const bDate = parsePublishDate(b.publishDate);
    if (selectedSort === "oldest") return aDate - bDate;
    return bDate - aDate;
  });

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

      <div className="mb-8 bg-brand-black-light border border-brand-grey-dark/40 rounded-2xl p-4 md:p-6">
        <p className="text-brand-grey uppercase tracking-widest text-xs font-bold mb-4">
          {t.filtersTitle}
        </p>

        <form
          method="get"
          className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
        >
          <label className="flex flex-col gap-2 text-sm text-brand-grey md:col-span-2">
            <span className="text-xs font-bold">{t.searchLabel}</span>
            <input
              type="search"
              name="q"
              defaultValue={searchQuery}
              placeholder={t.searchPlaceholder}
              className="bg-brand-black border border-brand-grey-dark rounded-xl px-3 py-2.5 text-white placeholder:text-brand-grey focus:outline-none focus:border-brand-red"
            />
          </label>

          <label className="flex flex-col gap-2 text-sm text-brand-grey md:col-span-2">
            <span className="text-xs font-bold">{t.categoryLabel}</span>
            <select
              name="category"
              defaultValue={selectedCategory}
              className="bg-brand-black border border-brand-grey-dark rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-red"
            >
              <option value="">{t.categoryAll}</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-sm text-brand-grey md:col-span-1">
            <span className="text-xs font-bold">{t.sortLabel}</span>
            <select
              name="sort"
              defaultValue={selectedSort}
              className="bg-brand-black border border-brand-grey-dark rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-brand-red"
            >
              <option value="latest">{t.sortOptions.latest}</option>
              <option value="oldest">{t.sortOptions.oldest}</option>
              <option value="title_asc">{t.sortOptions.title_asc}</option>
              <option value="title_desc">{t.sortOptions.title_desc}</option>
            </select>
          </label>

          <div className="flex gap-2 md:col-span-5">
            <button
              type="submit"
              className="rounded-xl bg-brand-red text-white font-semibold px-4 py-2.5 hover:bg-brand-red-light transition-colors"
            >
              {t.apply}
            </button>
            <Link
              href={`/${locale}/blog`}
              className="rounded-xl border border-brand-grey-dark text-brand-grey hover:text-white hover:border-brand-red px-4 py-2.5 text-center font-semibold transition-colors"
            >
              {t.clear}
            </Link>
          </div>
        </form>
      </div>

      {/* Blog Posts Grid */}
      {sortedPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPosts.map((post) => (
            <BlogCard key={post.id} post={post} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-brand-grey text-center py-10">{t.noResults}</p>
      )}
    </div>
  );
}
