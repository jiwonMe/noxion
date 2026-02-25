"use client";

import type { PortfolioCardProps } from "@noxion/renderer";

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
  const cardClass = featured ? "" : "";

  return (
    <div className={cardClass}>
      {coverImage && (
        <div className="">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className=""
          />
        </div>
      )}

      <div className="">
        <div className="">
          <a href={`/${slug}`} className="">
            <h3 className="">{title}</h3>
          </a>
          {year && <span className="">{year}</span>}
        </div>

        {description && <p className="">{description}</p>}

        {technologies && technologies.length > 0 && (
          <div className="">
            {technologies.map((tech) => (
              <span key={tech} className="">{tech}</span>
            ))}
          </div>
        )}

        <div className="">
          <a href={`/${slug}`} className="">Details →</a>
          {projectUrl && (
            <a
              href={projectUrl}
              className=""
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
