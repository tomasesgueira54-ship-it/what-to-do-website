"use client";

import Link from "next/link";
import Image from "next/image";
import { FaArrowRight, FaClock, FaNewspaper } from "react-icons/fa";
import { useState } from "react";

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
  const [imageLoadError, setImageLoadError] = useState(false);
  const readMore = locale === "pt" ? "Ler mais" : "Read more";
  const hasImage = post.imageUrl && !imageLoadError;

  const handleImageError = () => {
    setImageLoadError(true);
  };

  return (
    <article className="card group">
      <Link href={`/${locale}/blog/${post.id}`}>
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-brand-red/30 to-brand-red/10">
          {hasImage && (
            <Image
              src={post.imageUrl}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={handleImageError}
            />
          )}
          {!hasImage && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-red/40 to-brand-red/20">
              <FaNewspaper className="text-6xl text-white/40" />
            </div>
          )}
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
