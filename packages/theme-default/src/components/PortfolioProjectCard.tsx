"use client";

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
  featured,
}: PortfolioCardProps) {
  const cardClass = featured ? `${styles.card} ${styles.cardFeatured}` : styles.card;

  return (
    <div className={cardClass}>
      {coverImage && (
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
        <div className={styles.header}>
          <a href={`/${slug}`} className={styles.titleLink}>
            <h3 className={styles.title}>{title}</h3>
          </a>
          {year && <span className={styles.year}>{year}</span>}
        </div>

        {description && <p className={styles.description}>{description}</p>}

        {technologies && technologies.length > 0 && (
          <div className={styles.tech}>
            {technologies.map((tech) => (
              <span key={tech} className={styles.techTag}>{tech}</span>
            ))}
          </div>
        )}

        <div className={styles.actions}>
          <a href={`/${slug}`} className={styles.actionLink}>Details →</a>
          {projectUrl && (
            <a
              href={projectUrl}
              className={styles.actionLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit ↗
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
