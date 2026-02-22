import type { PostCardProps } from "../theme/types";

export function PostCard({
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
  const baseClass = hasImage ? "noxion-post-card" : "noxion-post-card noxion-post-card--text-only";
  const cardClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <a href={`/${slug}`} className={cardClass}>
      {hasImage && (
        <div className="noxion-post-card__cover">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="noxion-post-card__cover-image"
          />
        </div>
      )}

      <div className="noxion-post-card__body">
        {category && (
          <span className="noxion-post-card__category">{category}</span>
        )}

        <h3 className="noxion-post-card__title">{title}</h3>

        {description && (
          <p className="noxion-post-card__description">{description}</p>
        )}

        <div className="noxion-post-card__meta">
          {author && (
            <span className="noxion-post-card__author">{author}</span>
          )}
          <time dateTime={date} className="noxion-post-card__date">
            {date}
          </time>

          {tags.length > 0 && (
            <div className="noxion-post-card__tags">
              {tags.map((tag) => (
                <span key={tag} className="noxion-post-card__tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}
