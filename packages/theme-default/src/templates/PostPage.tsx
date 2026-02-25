"use client";

import type { NoxionTemplateProps } from "@noxion/renderer";
import { NotionPage } from "../components/NotionPage";

interface AdjacentPost {
  title: string;
  slug: string;
}

function ChevronLeft() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
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

  const prevPost = data.prevPost as AdjacentPost | undefined;
  const nextPost = data.nextPost as AdjacentPost | undefined;
  const siteName = data.siteName as string | undefined;

  if (!recordMap) {
    return <div className="py-12 text-center text-[#757575] dark:text-gray-500">Post not found.</div>;
  }

  const hasHeader = Boolean(title);
  const tagLabel = tags.length > 0 ? tags[0] : category;
  const hasPrevNext = prevPost || nextPost;

  return (
    <article className="mx-auto max-w-[720px]">
      {hasHeader && (
        <header className="mb-10">
          <div className="flex items-center gap-1 text-xs font-medium text-[#757575] dark:text-gray-500 mb-5">
            {author && (
              <>
                <span>By</span>
                <span className="text-black dark:text-gray-200">{author}</span>
              </>
            )}
            {author && tagLabel && <span className="ml-1">in</span>}
            {tagLabel && (
              <a
                href={`/tag/${encodeURIComponent(tags[0] || "")}`}
                className="text-black hover:opacity-70 transition-opacity dark:text-gray-200"
              >
                {tagLabel}
              </a>
            )}
            {date && (
              <>
                <span className="mx-1">&mdash;</span>
                <time dateTime={date}>{formattedDate ?? date}</time>
              </>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[58px] font-semibold leading-[1.04] tracking-[-0.02em] text-black dark:text-gray-100">
            {title}
          </h1>

          {description && (
            <p className="mt-4 text-lg sm:text-2xl sm:leading-[1.4] text-black/80 dark:text-gray-300">
              {description}
            </p>
          )}
        </header>
      )}

      {coverImage && (
        <div className="mt-10 mb-10 w-full overflow-hidden rounded-lg">
          <img src={coverImage} alt="" className="w-full h-auto object-cover" />
        </div>
      )}

      <div className="mt-10">
        <NotionPage
          recordMap={recordMap}
          rootPageId={rootPageId}
          fullPage={!hasHeader}
          className="notion-page-wrapper--tally"
        />
      </div>

      {hasPrevNext && (
        <nav className="grid grid-cols-[1fr_auto_1fr] gap-x-6 mt-16 pt-0">
          {prevPost ? (
            <a
              href={`/${prevPost.slug}`}
              className="flex flex-col items-start text-left no-underline group"
            >
              <span className="flex items-center gap-1 text-[17px] font-bold text-black dark:text-gray-100 tracking-[0.01em]">
                <ChevronLeft />
                Previous issue
              </span>
              <h4 className="mt-2 text-base font-normal text-black dark:text-gray-300 group-hover:opacity-70 transition-opacity">
                {prevPost.title}
              </h4>
            </a>
          ) : (
            <div />
          )}

          <div />

          {nextPost ? (
            <a
              href={`/${nextPost.slug}`}
              className="flex flex-col items-end text-right no-underline group"
            >
              <span className="flex items-center gap-1 text-[17px] font-bold text-black dark:text-gray-100 tracking-[0.01em]">
                Next issue
                <ChevronRight />
              </span>
              <h4 className="mt-2 text-base font-normal text-black dark:text-gray-300 group-hover:opacity-70 transition-opacity">
                {nextPost.title}
              </h4>
            </a>
          ) : (
            <div />
          )}
        </nav>
      )}

      {siteName && (
        <section className="mt-20 py-10 text-center">
          <h3 className="text-4xl font-bold text-black dark:text-gray-100">
            Subscribe to {siteName}
          </h3>
          <p className="mt-3 text-base text-[#757575] dark:text-gray-500">
            Don&apos;t miss out on the latest issues. Sign up now to get access to the library of members-only issues.
          </p>
        </section>
      )}
    </article>
  );
}
