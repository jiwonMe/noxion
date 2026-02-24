import type { PostCardProps } from "../theme/types";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function FeaturedPostCard({
  title,
  slug,
  date,
  tags,
  coverImage,
  category,
  description,
  author,
  className,
}: PostCardProps & { className?: string }) {
  const hasImage = Boolean(coverImage);
  const baseClass = hasImage
    ? "noxion-featured-card"
    : "noxion-featured-card noxion-featured-card--no-cover";
  const cardClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <a href={`/${slug}`} className={cardClass}>
      <div className="noxion-featured-card__cover">
        {hasImage && (
          <>
            <img
              src={coverImage}
              alt={title}
              loading="eager"
              decoding="async"
              className="noxion-featured-card__cover-image"
            />
            <div className="noxion-featured-card__cover-overlay" />
          </>
        )}
      </div>

      <div className="noxion-featured-card__content">
        {category && (
          <span className="noxion-featured-card__category">{category}</span>
        )}
        <h2 className="noxion-featured-card__title">{title}</h2>
        {description && (
          <p className="noxion-featured-card__description">{description}</p>
        )}
        <div className="noxion-featured-card__meta">
          {author && (
            <span className="noxion-featured-card__author">{author}</span>
          )}
          {date && (
            <time dateTime={date} className="noxion-featured-card__date">
              {formatDate(date)}
            </time>
          )}
        </div>
        {tags.length > 0 && (
          <div className="noxion-featured-card__tags">
            {tags.map((tag) => (
              <span key={tag} className="noxion-featured-card__tag">{tag}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
