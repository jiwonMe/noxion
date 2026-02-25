import type { PostCardProps } from "@noxion/renderer";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function PostCard({ title, slug, date, tags, coverImage, category, description, author }: PostCardProps) {
  return (
    <a href={`/${slug}`} className="group block py-6 border-b border-neutral-200 dark:border-neutral-800 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-900/40 -mx-4 px-4">
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800 mb-4">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
        </div>
      )}

      <div className="space-y-2">
        {category && <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{category}</span>}

        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{title}</h3>

        {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{description}</p>}

        <div className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500">
          {author && <span className="text-neutral-600 dark:text-neutral-400">{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && (
            <time dateTime={date} className="">
              {formatDate(date)}
            </time>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {tags.map((t) => (
              <span key={t} className="inline-block px-2 py-0.5 text-xs rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">{t}</span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
