import type { NoxionTemplateProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";

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
    return <div className="py-12 text-center text-neutral-500 dark:text-neutral-400">Post not found.</div>;
  }

  const hasHeader = Boolean(title);
  const displayDate = formattedDate ?? (date ? formatDate(date) : undefined);

  return (
    <article>
      <a href="/" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors mb-8">
        <span aria-hidden="true">&larr;</span>
        Back to articles
      </a>

      {hasHeader && (
        <header className="max-w-[1120px] mx-auto space-y-6 mb-10">
          {category && (
            <a href={`/tag/${encodeURIComponent(category)}`} className="text-xs font-medium uppercase tracking-wider text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors">
              {category}
            </a>
          )}

          <h1 className="text-[2.75rem] md:text-[2.875rem] font-bold leading-[1.1] tracking-tight text-neutral-900 dark:text-neutral-100">
            {title}
          </h1>

          {description && (
            <p className="text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-[720px]">{description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500">
            {author && <span className="font-medium text-neutral-700 dark:text-neutral-300">{author}</span>}
            {displayDate && (
              <time dateTime={date} className="ml-1">
                {displayDate}
              </time>
            )}
          </div>

          {coverImage && (
            <figure className="pt-2">
              <div className="aspect-[1.9/1] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img src={coverImage} alt="" className="h-full w-full object-cover" />
              </div>
            </figure>
          )}
        </header>
      )}

      {!hasHeader && coverImage && (
        <div className="max-w-[1120px] mx-auto mb-10">
          <div className="aspect-[1.9/1] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img src={coverImage} alt="" className="h-full w-full object-cover" />
          </div>
        </div>
      )}

      <div className="max-w-[720px] mx-auto">
        <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none prose-p:text-[17px] prose-p:leading-[1.6] prose-headings:tracking-tight prose-a:text-neutral-900 dark:prose-a:text-neutral-100 prose-a:underline prose-a:underline-offset-2">
          <NotionPage recordMap={recordMap} rootPageId={rootPageId} fullPage={!hasHeader} />
        </div>

        {tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="inline-block px-3 py-1 text-sm border border-neutral-200 text-neutral-600 hover:border-neutral-400 hover:text-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-neutral-500 dark:hover:text-neutral-100 transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          </div>
        )}

        {author && (
          <div className="mt-10 pt-6 border-t border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Written by</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-sm font-medium text-neutral-600 dark:text-neutral-300">
                {author.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-neutral-900 dark:text-neutral-100">{author}</span>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
