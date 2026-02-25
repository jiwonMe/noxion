import type { PortfolioCardProps } from "@noxion/renderer";
import * as styles from "./PortfolioProjectCard.css";

export function PortfolioProjectCard({
  title,
  slug,
  description,
  coverImage,
  technologies,
  projectUrl,
  year,
}: PortfolioCardProps) {
  return (
    <div className={styles.card}>
      {coverImage && (
        <div className={styles.cover}>
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className={styles.coverImage} />
        </div>
      )}

      <div className={styles.body}>
        <a href={`/${slug}`}>
          <h3 className={styles.title}>{title}</h3>
        </a>

        {year && <span className={styles.meta}>{year}</span>}

        {description && <p className={styles.description}>{description}</p>}

        {technologies && technologies.length > 0 && (
          <div className={styles.tags}>
            {technologies.map((tech) => (
              <span key={tech} className={styles.tag}>{tech}</span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <a href={`/${slug}`} className={styles.actionLink}>Details →</a>
          {projectUrl && (
            <a href={projectUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>Visit ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}
