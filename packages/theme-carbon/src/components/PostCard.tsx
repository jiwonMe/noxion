import type { PostCardProps } from "@noxion/renderer";
import { ArrowRightIcon } from "./Icons";

type CarbonPostCardProps = PostCardProps & {
  borderMode?: "card" | "cell";
};

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function PostCard({
  title,
  slug,
  date,
  coverImage,
  category,
  description,
  author,
  borderMode = "card",
}: CarbonPostCardProps) {
  const frameClass =
    borderMode === "card"
      ? "border border-[var(--color-border)]"
      : "border-0";

  return (
    <a
      href={`/${slug}`}
      className={`group flex h-full flex-col bg-[var(--color-card)] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)] ${frameClass}`}
    >
      {coverImage && (
        <div className="aspect-[16/10] w-full overflow-hidden">
          <img
            src={coverImage}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.4,0.14,0.3,1)] group-hover:scale-[1.03]"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-4">
        {category && (
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-primary)]">
            {category}
          </p>
        )}

        <h3 className="mb-2 text-base font-semibold leading-snug text-[var(--color-foreground)] transition-colors duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] group-hover:text-[var(--color-primary)]">
          {title}
        </h3>

        {description && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[var(--color-muted-foreground)]">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-end justify-between pt-3">
          <div className="text-xs text-[var(--color-muted-foreground)]">
            {author && <span>{author}</span>}
            {date && <span className="ml-1">&middot; {formatDate(date)}</span>}
          </div>
          <ArrowRightIcon
            size={20}
            className="translate-x-0 text-[var(--color-primary)] opacity-0 transition-all duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] group-hover:translate-x-1 group-hover:opacity-100"
          />
        </div>
      </div>
    </a>
  );
}
