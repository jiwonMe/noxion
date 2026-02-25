import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  generateNoxionMetadata,
  generateNoxionStaticParams,
  generateBlogPostingLD,
  generateBreadcrumbLD,
} from "@noxion/adapter-nextjs";
import { createNotionClient } from "@noxion/core";
import { PostPage } from "@noxion/theme-default";
import { resolvePostWithFrontmatter, getAllPosts } from "../../lib/notion";
import { siteConfig } from "../../lib/config";

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat(siteConfig.language || "en", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateStr));
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await resolvePostWithFrontmatter(slug);
  if (!data) return { title: "Not Found" };
  return generateNoxionMetadata(data.post, siteConfig);
}

export default async function PostPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [data, allPosts] = await Promise.all([
    resolvePostWithFrontmatter(slug),
    getAllPosts(),
  ]);
  if (!data) notFound();

  const { post, recordMap } = data;
  const blogPostingLd = generateBlogPostingLD(post, siteConfig);
  const breadcrumbLd = generateBreadcrumbLD(post, siteConfig);

  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost =
    currentIndex > 0
      ? { title: allPosts[currentIndex - 1].title, slug: allPosts[currentIndex - 1].slug }
      : undefined;
  const nextPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1
      ? { title: allPosts[currentIndex + 1].title, slug: allPosts[currentIndex + 1].slug }
      : undefined;

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
          prevPost,
          nextPost,
          siteName: siteConfig.name,
        }}
      />
    </>
  );
}
