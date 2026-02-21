import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { NotionPage } from "@noxion/renderer";
import { generateNoxionMetadata, generateNoxionStaticParams, generateBlogPostingLD } from "@noxion/adapter-nextjs";
import { createNotionClient } from "@noxion/core";
import { getPostBySlug, getPageRecordMap } from "../../lib/notion";
import { siteConfig } from "../../lib/config";

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
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found" };
  return generateNoxionMetadata(post, siteConfig);
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const recordMap = await getPageRecordMap(post.id);
  const jsonLd = generateBlogPostingLD(post, siteConfig);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NotionPage
        recordMap={recordMap}
        rootPageId={post.id}
        fullPage
        previewImages
        showTableOfContents
        mapPageUrl={(pageId: string) => `/${pageId}`}
      />
    </article>
  );
}
