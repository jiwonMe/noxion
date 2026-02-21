import type { Metadata } from "next";
import { getAllPosts, getAllTags } from "../../../lib/notion";
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
  const posts = await getAllPosts();
  const allTags = getAllTags(posts);

  const filteredPosts = posts
    .filter((p) => p.tags.includes(decodedTag))
    .map((post) => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      date: post.date,
      tags: post.tags,
      coverImage: post.coverImage,
      category: post.category,
      description: post.description,
      author: post.author,
    }));

  return (
    <div>
      <h2
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBottom: "1.5rem",
          color: "var(--noxion-mutedForeground, #737373)",
        }}
      >
        Tag: {decodedTag}
      </h2>
      <HomeContent posts={filteredPosts} allTags={allTags} />
    </div>
  );
}
