import Link from "next/link";
import { FaArrowRight, FaClock } from "react-icons/fa";

interface BlogCardProps {
  locale?: "pt" | "en";
  post: {
    id: string;
    title: string;
    excerpt: string;
    readTime: string;
    publishDate: string;
    imageUrl: string;
    category: string;
  };
}

export default function BlogCard({ post, locale = "pt" }: BlogCardProps) {
  const readMore = locale === "pt" ? "Ler mais" : "Read more";

  return (
    <article className="card group">
      <Link href={`/${locale}/blog/${post.id}`}>
        <div className="relative h-56 overflow-hidden">
          <div className="absolute inset-0 bg-brand-red/20 group-hover:bg-brand-red/40 transition-all" />
          <div className="gradient-overlay" />
          <div className="absolute top-4 left-4">
            <span className="bg-brand-red px-3 py-1 rounded-full text-xs font-semibold">
              {post.category}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 text-brand-grey text-sm mb-3">
            <span>{post.publishDate}</span>
            <span>•</span>
            <div className="flex items-center space-x-1">
              <FaClock />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h3 className="font-display text-xl font-bold mb-3 group-hover:text-brand-red transition-colors">
            {post.title}
          </h3>

          <p className="text-brand-grey mb-4 line-clamp-3">{post.excerpt}</p>

          <div className="flex items-center text-brand-red font-semibold group-hover:underline">
            {readMore}
            <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
          </div>
        </div>
      </Link>
    </article>
  );
}
