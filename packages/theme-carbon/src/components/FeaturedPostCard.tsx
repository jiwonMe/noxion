import type { PostCardProps } from "@noxion/renderer";
import { ArrowRightIcon } from "./Icons";

type CarbonFeaturedPostCardProps = PostCardProps & {
  borderMode?: "framed" | "cell";
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function FeaturedPostCard({
  title,
  slug,
  date,
  tags = [],
  coverImage,
  category,
  author: _author,
  borderMode = "cell",
}: CarbonFeaturedPostCardProps) {
  const frameClass =
    borderMode === "framed"
      ? "border border-[var(--color-border)]"
      : "border-0";

  return (
    <a href={`/${slug}`} className={`group block bg-[var(--color-card)] ${frameClass}`}>
      {/* Large hero image */}
      {coverImage && (
        <div className="aspect-[16/9] w-full overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[500ms] ease-[cubic-bezier(0.4,0.14,0.3,1)] group-hover:scale-[1.02]"
          />
        </div>
      )}

      {/* Meta row: category+date | title | arrow */}
      <div className="grid grid-cols-1 border-t border-[var(--color-border)] md:grid-cols-[200px_1fr_64px]">
        <div className="border-b border-[var(--color-border)] p-4 md:border-b-0 md:border-r">
          {category && (
            <p className="text-sm text-[var(--color-foreground)]">{category}</p>
          )}
          {date && (
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">{formatDate(date)}</p>
          )}
        </div>

        <div className="border-b border-[var(--color-border)] p-4 md:border-b-0 md:border-r">
          <h3 className="text-3xl font-normal leading-tight text-[var(--color-foreground)] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] group-hover:text-[var(--color-primary)] md:text-4xl">
            {title}
          </h3>
        </div>

        <div className="flex items-start justify-center p-4 transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] group-hover:bg-[var(--color-hover)]">
          <ArrowRightIcon
            size={24}
            className="text-[var(--color-foreground)] transition-all duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] group-hover:translate-x-1 group-hover:text-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* Tag pills row */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 border-t border-[var(--color-border)] px-4 py-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-tag-green-bg)] px-3 py-0.5 text-xs text-[var(--color-tag-green-text)]"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
