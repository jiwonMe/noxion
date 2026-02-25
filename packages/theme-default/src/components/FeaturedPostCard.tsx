"use client";

import type { PostCardProps } from "@noxion/renderer";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function FeaturedPostCard({ title, slug, date, tags, coverImage, category, description, author }: PostCardProps) {
  const hasImage = Boolean(coverImage);
  const contentClass = hasImage 
    ? "absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white" 
    : "p-8 text-gray-900 dark:text-gray-100";

  return (
    <a 
      href={`/${slug}`} 
      className="group relative block overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-all dark:border-gray-800 dark:bg-gray-900 aspect-[21/9]"
    >
      {hasImage && (
        <>
          <img
            src={coverImage}
            alt={title}
            loading="eager"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        </>
      )}

      <div className={contentClass}>
        {category && (
          <span className="inline-block mb-3 text-sm font-medium text-blue-400">
            {category}
          </span>
        )}
        <h2 className="text-3xl md:text-4xl font-bold mb-3 line-clamp-2">{title}</h2>
        {description && (
          <p className="text-base md:text-lg mb-4 line-clamp-2 opacity-90">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 text-sm opacity-80">
          {author && <span>{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && <time dateTime={date}>{formatDate(date)}</time>}
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((t) => (
              <span 
                key={t} 
                className="px-2 py-1 text-xs font-medium rounded-md bg-white/20 backdrop-blur-sm"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
