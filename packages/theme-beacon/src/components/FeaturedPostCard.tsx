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

export function FeaturedPostCard({ title, slug, date, coverImage, category, description, author }: PostCardProps) {
  return (
    <a href={`/${slug}`} className={styles.card}>
      {coverImage && (
        <div className={styles.cover}>
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className={styles.coverImage} />
        </div>
      )}

      <div className={styles.body}>
        {category && <span className={styles.category}>{category}</span>}

        <h2 className={styles.title}>{title}</h2>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.meta}>
          {author && <span>{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && (
            <time dateTime={date}>{formatDate(date)}</time>
          )}
        </div>
      </div>
    </a>
  );
}
