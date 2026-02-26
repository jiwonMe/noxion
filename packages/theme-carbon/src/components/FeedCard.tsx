import type { PostCardProps } from "@noxion/renderer";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return dateStr;
  }
}

/**
 * Horizontal feed card matching IBM Research blog feed style:
 * Left side: category label + large title + green tag pills
 * Right side: image (if available)
 * Separated by border-bottom only.
 */
export function FeedCard({
  title,
  slug,
  date,
  tags = [],
  coverImage,
  category,
  author,
}: PostCardProps) {
  return (
    <a
      href={`/${slug}`}
      className="group grid grid-cols-1 gap-0 border-b border-[var(--color-border)] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)] md:grid-cols-[1fr_400px]"
    >
      {/* Left: text content */}
      <div className="flex flex-col justify-between p-6">
        <div>
          {category && (
            <p className="mb-3 text-sm text-[var(--color-muted-foreground)]">{category}</p>
          )}
          <h3 className="text-2xl font-normal leading-snug text-[var(--color-foreground)] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] group-hover:text-[var(--color-primary)] md:text-3xl">
            {title}
          </h3>
        </div>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[var(--color-tag-green-bg)] px-2.5 py-0.5 text-xs text-[var(--color-tag-green-text)]"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Date / author */}
          <div className="text-xs text-[var(--color-muted-foreground)]">
            {author && <span>{author}</span>}
            {date && <span>{author ? " · " : ""}{formatDate(date)}</span>}
          </div>
        </div>
      </div>

      {/* Right: image */}
      {coverImage && (
        <div className="aspect-[4/3] overflow-hidden md:aspect-auto">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0.14,0.3,1)] group-hover:scale-[1.02]"
          />
        </div>
      )}
    </a>
  );
}
