import type { PostCardProps } from "@noxion/renderer";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function PostCard({ title, slug, date, coverImage, category, description, author }: PostCardProps) {
  return (
    <a href={`/${slug}`} className="group block py-5 first:pt-0">
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-3">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
        </div>
      )}

      <div className="space-y-1.5">
        {category && <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{category}</p>}

        <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{title}</h3>

        {description && <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{description}</p>}

        <div className="text-sm text-neutral-400 dark:text-neutral-500">
          {author && <span>By {author}</span>}
          {date && <span className="ml-1">&mdash;{formatDate(date)}</span>}
        </div>
      </div>
    </a>
  );
}
