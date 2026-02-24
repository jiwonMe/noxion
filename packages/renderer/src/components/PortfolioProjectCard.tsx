import type { PortfolioCardProps } from "../theme/types";

export function PortfolioProjectCard({
  title,
  slug,
  description,
  coverImage,
  technologies,
  projectUrl,
  year,
  featured,
  className,
}: PortfolioCardProps & { className?: string }) {
  const baseClass = featured
    ? "noxion-portfolio-card noxion-portfolio-card--featured"
    : "noxion-portfolio-card";
  const cardClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <div className={cardClass}>
      <div className="noxion-portfolio-card__cover">
        {coverImage && (
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="noxion-portfolio-card__cover-image"
          />
        )}
      </div>

      <div className="noxion-portfolio-card__body">
        <div className="noxion-portfolio-card__header">
          <a href={`/${slug}`} className="noxion-portfolio-card__title-link">
            <h3 className="noxion-portfolio-card__title">{title}</h3>
          </a>
          {year && (
            <span className="noxion-portfolio-card__year">{year}</span>
          )}
        </div>

        {description && (
          <p className="noxion-portfolio-card__description">{description}</p>
        )}

        {technologies && technologies.length > 0 && (
          <div className="noxion-portfolio-card__tech">
            {technologies.map((tech) => (
              <span key={tech} className="noxion-portfolio-card__tech-tag">{tech}</span>
            ))}
          </div>
        )}

        <div className="noxion-portfolio-card__actions">
          <a href={`/${slug}`} className="noxion-portfolio-card__link">
            Details
          </a>
          {projectUrl && (
            <a
              href={projectUrl}
              className="noxion-portfolio-card__link noxion-portfolio-card__link--external"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
