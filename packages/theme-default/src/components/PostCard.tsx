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

export function PostCard({ title, slug, date, tags, coverImage, category, description, author }: PostCardProps) {
  const hasImage = Boolean(coverImage);

  return (
    <a 
      href={`/${slug}`} 
      className="group block overflow-hidden rounded-lg border border-gray-200 bg-white transition-all hover:shadow-lg hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      {hasImage && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 space-y-3">
        {category && (
          <span className="inline-block text-xs font-medium text-blue-600 dark:text-blue-400">
            {category}
          </span>
        )}

        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
          {author && <span>{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && (
            <time dateTime={date}>
              {formatDate(date)}
            </time>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {tags.map((t) => (
              <span 
                key={t} 
                className="inline-block px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
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
