import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { generateNoxionMetadata, generateNoxionStaticParams, generateBlogPostingLD, generateBreadcrumbLD } from "@noxion/adapter-nextjs";
import { createNotionClient, parseFrontmatter, applyFrontmatter } from "@noxion/core";
import { getPostBySlug, getPageRecordMap } from "../../lib/notion";
import { siteConfig } from "../../lib/config";
import { NotionPageClient } from "./notion-page-client";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat(siteConfig.language || "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export const revalidate = 3600;

const notion = createNotionClient({
  authToken: process.env.NOTION_TOKEN || undefined,
});

export async function generateStaticParams() {
  if (!siteConfig.rootNotionPageId) return [];
  try {
    return await generateNoxionStaticParams(notion, siteConfig.rootNotionPageId);
  } catch {
    return [];
  }
}

async function getPostWithFrontmatter(slug: string) {
  const post = await getPostBySlug(slug);
  if (!post) return null;

  const recordMap = await getPageRecordMap(post.id);
  const frontmatter = parseFrontmatter(recordMap, post.id);
  const resolvedPost = frontmatter ? applyFrontmatter(post, frontmatter) : post;

  return { post: resolvedPost, recordMap };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPostWithFrontmatter(slug);
  if (!data) return { title: "Not Found" };
  return generateNoxionMetadata(data.post, siteConfig);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPostWithFrontmatter(slug);
  if (!data) notFound();

  const { post, recordMap } = data;
  const blogPostingLd = generateBlogPostingLD(post, siteConfig);
  const breadcrumbLd = generateBreadcrumbLD(post, siteConfig);
  const authorName = post.metadata.author || siteConfig.author;
  const postDate = post.metadata.date;
  const postCategory = post.metadata.category;
  const postTags = post.metadata.tags;

  return (
    <article className="article-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {post.coverImage && (
        <div className="article-page__cover">
          <img
            src={post.coverImage}
            alt=""
            className="article-page__cover-image"
          />
        </div>
      )}

      <header className="article-page__header">
        {(postCategory || postTags.length > 0) && (
          <div className="article-page__topics">
            {postCategory && (
              <span className="article-page__category">{postCategory}</span>
            )}
            {postTags.map((tag: string) => (
              <Link
                key={tag}
                href={`/tag/${encodeURIComponent(tag)}`}
                className="article-page__tag"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}

        <h1 className="article-page__title">{post.title}</h1>

        {post.description && (
          <p className="article-page__description">{post.description}</p>
        )}

        <div className="article-page__meta">
          <span className="article-page__author">{authorName}</span>
          <span className="article-page__meta-dot" aria-hidden="true" />
          <time className="article-page__date" dateTime={postDate}>
            {formatDate(postDate)}
          </time>
        </div>
      </header>

      <div className="article-page__body">
        <NotionPageClient
          recordMap={recordMap}
          rootPageId={post.id}
          fullPage={false}
        />
      </div>
    </article>
  );
}
