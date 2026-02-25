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
    return <div className="">Post not found.</div>;
  }

  const hasHeader = Boolean(title);

  return (
    <article className="">
      {coverImage && (
        <div className="">
          <img src={coverImage} alt="" className="" />
        </div>
      )}

      {hasHeader && (
        <header className="">
          {(category || tags.length > 0) && (
            <div className="">
              {category && <span className="">{category}</span>}
              {tags.map((tag) => (
                <a key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="">
                  {tag}
                </a>
              ))}
            </div>
          )}

          <h1 className="">{title}</h1>

          {description && <p className="">{description}</p>}

          <div className="">
            {author && <span>{author}</span>}
            {author && date && <span className="" aria-hidden="true" />}
            {date && (
              <time dateTime={date}>{formattedDate ?? date}</time>
            )}
          </div>
        </header>
      )}

      <div className="">
        <NotionPage recordMap={recordMap} rootPageId={rootPageId} fullPage={!hasHeader} />
      </div>
    </article>
  );
}
