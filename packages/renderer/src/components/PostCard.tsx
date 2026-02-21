import type { PostCardProps } from "../theme/types";

export function PostCard({
  title,
  slug,
  date,
  tags,
  coverImage,
  category,
  className,
}: PostCardProps & { className?: string }) {
  return (
    <a
      href={`/${slug}`}
      className={className ? `noxion-post-card ${className}` : "noxion-post-card"}
    >
      <div className="noxion-post-card__cover">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="noxion-post-card__cover-image"
          />
        ) : (
          <div className="noxion-post-card__cover-placeholder" />
        )}
      </div>

      <div className="noxion-post-card__body">
        {category && (
          <span className="noxion-post-card__category">{category}</span>
        )}

        <h3 className="noxion-post-card__title">{title}</h3>

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
    </a>
  );
}
