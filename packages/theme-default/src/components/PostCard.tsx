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

export function PostCard({ title, slug, date, tags: _tags, coverImage: _coverImage, category: _category, description, author: _author }: PostCardProps) {
  return (
    <a
      href={`/${slug}`}
      className="group block py-8 border-t border-gray-100 first:border-t-0 dark:border-gray-800/50"
    >
      <h3 className="text-xl sm:text-2xl font-semibold text-black group-hover:opacity-70 transition-opacity leading-tight dark:text-gray-100">
        {title}
      </h3>

      {description && (
        <p className="mt-2 text-base text-[#757575] line-clamp-2 leading-relaxed dark:text-gray-400">
          {description}
        </p>
      )}

      <div className="flex items-center gap-1 mt-3 text-xs font-medium text-[#757575] dark:text-gray-500">
        {date && (
          <time dateTime={date}>
            {formatDate(date)}
          </time>
        )}
      </div>
    </a>
  );
}
