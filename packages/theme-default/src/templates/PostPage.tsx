"use client";

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
    return <div className="py-12 text-center text-gray-600 dark:text-gray-400">Post not found.</div>;
  }

  const hasHeader = Boolean(title);

  return (
    <article className="space-y-8">
      {coverImage && (
        <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 -mx-4 sm:-mx-6 lg:-mx-8">
          <img src={coverImage} alt="" className="h-full w-full object-cover" />
        </div>
      )}

      {hasHeader && (
        <header className="space-y-6">
          {(category || tags.length > 0) && (
            <div className="flex flex-wrap items-center gap-2">
              {category && (
                <span className="inline-block px-3 py-1 text-sm font-medium rounded-md bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {category}
                </span>
              )}
              {tags.map((tag) => (
                <a 
                  key={tag} 
                  href={`/tag/${encodeURIComponent(tag)}`} 
                  className="inline-block px-3 py-1 text-sm font-medium rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>

          {description && (
            <p className="text-xl text-gray-600 dark:text-gray-400">{description}</p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-500">
            {author && <span>{author}</span>}
            {author && date && <span aria-hidden="true">·</span>}
            {date && (
              <time dateTime={date}>{formattedDate ?? date}</time>
            )}
          </div>
        </header>
      )}

      <div className="prose prose-gray dark:prose-invert max-w-none">
        <NotionPage recordMap={recordMap} rootPageId={rootPageId} fullPage={!hasHeader} />
      </div>
    </article>
  );
}
