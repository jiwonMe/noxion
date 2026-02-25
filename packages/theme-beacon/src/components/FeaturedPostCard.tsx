import type { PostCardProps } from "@noxion/renderer";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function FeaturedPostCard({ title, slug, date, coverImage, category, description, author }: PostCardProps) {
  return (
    <a href={`/${slug}`} className="group block overflow-hidden rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 transition-all hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-700">
      {coverImage && (
        <div className="aspect-[16/7] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}

      <div className="p-8 space-y-3">
        {category && <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">{category}</span>}

        <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{title}</h2>

        {description && <p className="text-neutral-500 dark:text-neutral-400 line-clamp-2">{description}</p>}

        <div className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 pt-1">
          {author && <span className="text-neutral-600 dark:text-neutral-400">{author}</span>}
          {author && date && <span aria-hidden="true">·</span>}
          {date && (
            <time dateTime={date}>{formatDate(date)}</time>
          )}
        </div>
      </div>
    </a>
  );
}
