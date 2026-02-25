"use client";

import type { PostCardProps } from "@noxion/renderer";
import * as styles from "./PostCard.css";

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
    <a href={`/${slug}`} className={styles.card}>
      {hasImage && (
        <div className={styles.cover}>
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className={styles.coverImage}
          />
        </div>
      )}

      <div className={styles.body}>
        {category && <span className={styles.category}>{category}</span>}

        <h3 className={styles.title}>{title}</h3>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.meta}>
          {author && <span className={styles.author}>{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && (
            <time dateTime={date} className={styles.date}>
              {formatDate(date)}
            </time>
          )}
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
