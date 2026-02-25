import type { PortfolioCardProps } from "@noxion/renderer";

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
    <div className="group overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}

      <div className="p-6 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <a href={`/${slug}`}>
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{title}</h3>
          </a>
          {year && <span className="shrink-0 text-sm text-neutral-400 dark:text-neutral-500">{year}</span>}
        </div>

        {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-3">{description}</p>}

        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <span key={tech} className="inline-block px-2 py-0.5 text-xs rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{tech}</span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 pt-1">
          <a href={`/${slug}`} className="text-sm font-medium text-neutral-700 hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors">Details →</a>
          {projectUrl && (
            <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors">Visit ↗</a>
          )}
        </div>
      </div>
    </div>
  );
}
