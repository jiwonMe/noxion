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
  const contentClass = hasImage ? "" : "";

  return (
    <a href={`/${slug}`} className="">
      {hasImage && (
        <>
          <img
            src={coverImage}
            alt={title}
            loading="eager"
            decoding="async"
            className=""
          />
          <div className="" aria-hidden="true" />
        </>
      )}

      <div className={contentClass}>
        {category && <span className="">{category}</span>}
        <h2 className="">{title}</h2>
        {description && <p className="">{description}</p>}
        <div className="">
          {author && <span>{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && <time dateTime={date}>{formatDate(date)}</time>}
        </div>
        {tags.length > 0 && (
          <div className="">
            {tags.map((t) => (
              <span key={t} className="">{t}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
