import type { NoxionTemplateProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";

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
    return <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">Post not found.</div>;
  }

  const hasHeader = Boolean(title);

  return (
    <article className="space-y-8 max-w-3xl mx-auto">
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-800">
          <img src={coverImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {hasHeader && (
        <header className="space-y-5">
          {(category || tags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <span className="inline-block px-2.5 py-0.5 text-xs font-medium rounded bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  {category}
                </span>
              )}
              {tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="inline-block px-2.5 py-0.5 text-xs font-medium rounded border border-neutral-200 text-neutral-500 hover:border-neutral-400 hover:text-neutral-700 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-200 transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">{title}</h1>

          {description && (
            <p className="text-xl text-neutral-500 dark:text-neutral-400 leading-relaxed">{description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-neutral-800 pb-5">
            {author && <span className="text-neutral-600 dark:text-neutral-400">{author}</span>}
            {author && date && <span aria-hidden="true">·</span>}
            {date && (
              <time dateTime={date}>{formattedDate ?? date}</time>
            )}
          </div>
        </header>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <NotionPage recordMap={recordMap} rootPageId={rootPageId} fullPage={!hasHeader} />
      </div>
    </article>
  );
}
