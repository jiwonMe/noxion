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
  const cardClass = featured 
    ? "group overflow-hidden rounded-lg border-2 border-blue-500 bg-white shadow-lg dark:bg-gray-900" 
    : "group overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-lg transition-shadow dark:border-gray-800 dark:bg-gray-900";

  return (
    <div className={cardClass}>
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <a href={`/${slug}`} className="flex-1 group/title">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors">
              {title}
            </h3>
          </a>
          {year && (
            <span className="text-sm font-medium text-gray-500 dark:text-gray-500">
              {year}
            </span>
          )}
        </div>

        {description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {description}
          </p>
        )}

        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech) => (
              <span 
                key={tech} 
                className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <a 
            href={`/${slug}`} 
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Details →
          </a>
          {projectUrl && (
            <a
              href={projectUrl}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
