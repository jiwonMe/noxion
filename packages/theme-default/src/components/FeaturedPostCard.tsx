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

export function FeaturedPostCard({ title, slug, date, tags: _tags, coverImage: _coverImage, category, description, author: _author }: PostCardProps) {
  return (
    <a
      href={`/${slug}`}
      className="group block my-10 mb-24"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-1 text-xs font-medium text-[#757575] dark:text-gray-500">
          <span>Latest</span>
          {date && (
            <>
              <span className="mx-1">&mdash;</span>
              <time dateTime={date}>{formatDate(date)}</time>
            </>
          )}
        </div>

        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.0] tracking-[-0.02em] text-black group-hover:opacity-80 transition-opacity dark:text-gray-100">
          {title}
        </h2>

        {description && (
          <p className="text-xl sm:text-2xl lg:text-[28px] leading-[1.35] text-black/90 max-w-[920px] dark:text-gray-300">
            {description}
          </p>
        )}

        <div className="flex items-center gap-1 text-xs font-medium text-[#757575] dark:text-gray-500 pt-2">
          {category && <span>{category}</span>}
          {category && <span className="mx-1">&mdash;</span>}
          <span>Read more &rarr;</span>
        </div>
      </div>
    </a>
  );
}
