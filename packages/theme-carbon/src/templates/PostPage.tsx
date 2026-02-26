import type { NoxionTemplateProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";
import { ArrowLeftIcon } from "../components/Icons";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function PostPage({ data }: NoxionTemplateProps) {
  const recordMap = data.recordMap;
  const rootPageId = data.rootPageId as string | undefined;

  const title = data.title as string | undefined;
  const description = data.description as string | undefined;
  const coverImage = data.coverImage as string | undefined;
  const category = data.category as string | undefined;
  const tags = (data.tags ?? []) as string[];
  const author = data.author as string | undefined;
  const date = data.date as string | undefined;
  const formattedDate = data.formattedDate as string | undefined;

  if (!recordMap) {
    return <div className="py-12 text-center text-[var(--color-muted-foreground)]">Post not found.</div>;
  }

  const displayDate = formattedDate ?? (date ? formatDate(date) : undefined);

  return (
    <article className="px-4 lg:px-0">
      <a
        href="/"
        className="group mb-8 inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:text-[var(--color-foreground)]"
      >
        <ArrowLeftIcon
          size={16}
          className="transition-transform duration-[150ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] group-hover:-translate-x-0.5"
        />
        <span>Back to blog</span>
      </a>

      {title && (
        <header className="mx-auto mb-10 max-w-[1024px] space-y-5 border-b border-[var(--color-border)] pb-8">
          {category && (
            <a
              href={`/tag/${encodeURIComponent(category)}`}
              className="inline-block text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-primary)] transition-opacity duration-[110ms] hover:opacity-80"
            >
              {category}
            </a>
          )}

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-[var(--color-foreground)] md:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="max-w-[760px] text-xl leading-relaxed text-[var(--color-muted-foreground)]">
              {description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
            {author && <span className="font-medium text-[var(--color-foreground)]">{author}</span>}
            {displayDate && <time dateTime={date}>{displayDate}</time>}
          </div>

          {coverImage && (
            <div className="overflow-hidden">
              <img src={coverImage} alt="" className="h-full w-full object-cover" />
            </div>
          )}
        </header>
      )}

      <div className="mx-auto max-w-[780px]">
        <NotionPage
          recordMap={recordMap}
          rootPageId={rootPageId}
          fullPage={!title}
          className="notion-page-wrapper--carbon"
        />

        {tags.length > 0 && (
          <div className="mt-12 border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">Topics</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="inline-block border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-muted-foreground)] transition-all duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
