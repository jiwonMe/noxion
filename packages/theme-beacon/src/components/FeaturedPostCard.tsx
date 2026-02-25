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
    <a href={`/${slug}`} className="group block">
      {coverImage && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
        </div>
      )}

      <div className="pt-5 space-y-2.5">
        {category && <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">{category}</p>}

        <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 leading-snug group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{title}</h3>

        {description && <p className="text-base text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-3">{description}</p>}

        <div className="text-sm text-neutral-400 dark:text-neutral-500 pt-1">
          {author && <span>By {author}</span>}
          {date && <span className="ml-1">&mdash;{formatDate(date)}</span>}
        </div>
      </div>
    </a>
  );
}
