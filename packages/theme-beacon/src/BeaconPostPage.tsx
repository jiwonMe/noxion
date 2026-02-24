import type { NoxionTemplateProps } from "@noxion/renderer";
import { NotionPage } from "@noxion/renderer";
import type { ExtendedRecordMap } from "notion-types";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function BeaconPostPage({ data, className }: NoxionTemplateProps) {
  const recordMap = data.recordMap as ExtendedRecordMap | undefined;
  const rootPageId = data.rootPageId as string | undefined;

  const title = data.title as string | undefined;
  const description = data.description as string | undefined;
  const coverImage = data.coverImage as string | undefined;
  const category = data.category as string | undefined;
  const tags = (data.tags ?? []) as string[];
  const author = data.author as string | undefined;
  const date = data.date as string | undefined;
  const formattedDate = (data.formattedDate as string | undefined) ?? (date ? formatDate(date) : undefined);

  if (!recordMap) {
    return (
      <div className="noxion-empty-state">
        <p className="noxion-empty-state__message">Post not found.</p>
      </div>
    );
  }

  const hasArticleHeader = Boolean(title);
  const baseClass = className
    ? `noxion-template-post ${className}`
    : "noxion-template-post";

  return (
    <article className={baseClass}>
      {hasArticleHeader && (
        <header className="noxion-template-post__header">
          {(category || tags.length > 0) && (
            <div className="noxion-template-post__topics">
              {category && (
                <span className="noxion-template-post__category">{category}</span>
              )}
              {tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tag/${encodeURIComponent(tag)}`}
                  className="noxion-template-post__tag"
                >
                  {tag}
                </a>
              ))}
            </div>
          )}

          <h1 className="noxion-template-post__title">{title}</h1>

          {description && (
            <p className="noxion-template-post__description">{description}</p>
          )}

          <div className="noxion-template-post__meta">
            {author && (
              <span className="noxion-template-post__author">{author}</span>
            )}
            {date && (
              <>
                {author && (
                  <span className="noxion-template-post__meta-dot" aria-hidden="true" />
                )}
                <time className="noxion-template-post__date" dateTime={date}>
                  {formattedDate}
                </time>
              </>
            )}
          </div>
        </header>
      )}

      {coverImage && (
        <div className="noxion-template-post__cover">
          <img
            src={coverImage}
            alt=""
            className="noxion-template-post__cover-image"
          />
        </div>
      )}

      <div className="noxion-template-post__body">
        <NotionPage
          recordMap={recordMap}
          rootPageId={rootPageId}
          fullPage={!hasArticleHeader}
        />
      </div>
    </article>
  );
}
