"use client";

import type { NoxionTemplateProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";
import * as styles from "./PostPage.css";

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
    return <div className={styles.notFound}>Post not found.</div>;
  }

  const hasHeader = Boolean(title);

  return (
    <article className={styles.article}>
      {coverImage && (
        <div className={styles.cover}>
          <img src={coverImage} alt="" className={styles.coverImage} />
        </div>
      )}

      {hasHeader && (
        <header className={styles.header}>
          {(category || tags.length > 0) && (
            <div className={styles.topics}>
              {category && <span className={styles.category}>{category}</span>}
              {tags.map((tag) => (
                <a key={tag} href={`/tag/${encodeURIComponent(tag)}`} className={styles.tag}>
                  {tag}
                </a>
              ))}
            </div>
          )}

          <h1 className={styles.title}>{title}</h1>

          {description && <p className={styles.description}>{description}</p>}

          <div className={styles.meta}>
            {author && <span>{author}</span>}
            {author && date && <span className={styles.dot} aria-hidden="true" />}
            {date && (
              <time dateTime={date}>{formattedDate ?? date}</time>
            )}
          </div>
        </header>
      )}

      <div className={styles.body}>
        <NotionPage recordMap={recordMap} rootPageId={rootPageId} fullPage={!hasHeader} />
      </div>
    </article>
  );
}
