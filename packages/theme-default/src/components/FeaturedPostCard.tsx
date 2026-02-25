"use client";

import type { PostCardProps } from "@noxion/renderer";
import * as styles from "./FeaturedPostCard.css";

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
  const contentClass = hasImage ? styles.content : styles.contentNoImage;

  return (
    <a href={`/${slug}`} className={styles.card}>
      {hasImage && (
        <>
          <img
            src={coverImage}
            alt={title}
            loading="eager"
            decoding="async"
            className={styles.coverImage}
          />
          <div className={styles.overlay} aria-hidden="true" />
        </>
      )}

      <div className={contentClass}>
        {category && <span className={styles.category}>{category}</span>}
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
        <div className={styles.meta}>
          {author && <span>{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && <time dateTime={date}>{formatDate(date)}</time>}
        </div>
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((t) => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
