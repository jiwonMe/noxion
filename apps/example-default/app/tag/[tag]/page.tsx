import type { Metadata } from "next";
import {
  getPaginatedPosts,
  getAllPosts,
  getAllTags,
  DEFAULT_PAGE_SIZE,
} from "../../../lib/notion";
import { siteConfig } from "../../../lib/config";
import { HomeContent } from "../../home-content";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);
  return tags.map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `${decodedTag} | ${siteConfig.name}`,
    description: `Posts tagged with "${decodedTag}" on ${siteConfig.name}`,
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);

  const [paginated, allPosts] = await Promise.all([
    getPaginatedPosts({ page: 1, pageSize: DEFAULT_PAGE_SIZE, tag: decodedTag }),
    getAllPosts(),
  ]);

  const allTags = getAllTags(allPosts);

  const initialPosts = paginated.data.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    date: post.metadata.date,
    tags: post.metadata.tags,
    coverImage: post.coverImage,
    category: post.metadata.category,
    description: post.description,
    author: post.metadata.author,
  }));

  return (
    <div>
      <h1 className="mb-8 text-4xl font-bold text-gray-900 dark:text-gray-100">
        #{decodedTag}
      </h1>
      <HomeContent
        initialPosts={initialPosts}
        allTags={allTags}
        hasMore={paginated.hasMore}
        total={paginated.total}
        pageSize={DEFAULT_PAGE_SIZE}
        initialTag={decodedTag}
      />
    </div>
  );
}
