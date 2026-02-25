import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { generateNoxionMetadata, generateNoxionStaticParams, generateBlogPostingLD, generateBreadcrumbLD } from "@noxion/adapter-nextjs";
import { createNotionClient, parseFrontmatter, applyFrontmatter } from "@noxion/core";
import { PostPage } from "@noxion/theme-default";
import { getPostBySlug, getPageRecordMap } from "../../lib/notion";
import { siteConfig } from "../../lib/config";

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

export default async function PostPageRoute({
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <PostPage
        data={{
          recordMap,
          rootPageId: post.id,
          title: post.title,
          description: post.description,
          coverImage: post.coverImage,
          category: post.metadata.category,
          tags: post.metadata.tags,
          author: post.metadata.author || siteConfig.author,
          date: post.metadata.date,
          formattedDate: formatDate(post.metadata.date),
        }}
      />
    </>
  );
}
