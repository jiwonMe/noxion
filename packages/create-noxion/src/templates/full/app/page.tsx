import Link from "next/link";
import { getPagesByType, getAllTags } from "../lib/notion";
import { HomeContent } from "./home-content";

export const revalidate = 3600;

export default async function HomePage() {
  const blogPosts = await getPagesByType("blog");
  const allTags = getAllTags(blogPosts);

  const postCards = blogPosts.map((post) => ({
    title: post.title,
    slug: post.slug,
    date: (post.metadata.date as string) ?? "",
    tags: (post.metadata.tags as string[]) ?? [],
    coverImage: post.coverImage,
    category: post.metadata.category as string | undefined,
  }));

  return (
    <div>
      <HomeContent posts={postCards} allTags={allTags} />

      <div style={{ marginTop: "3rem", display: "flex", gap: "1rem" }}>
        <Link
          href="/docs"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--noxion-border-radius, 0.5rem)",
            backgroundColor: "var(--noxion-muted, #f5f5f5)",
            fontSize: "0.875rem",
          }}
        >
          Documentation →
        </Link>
        <Link
          href="/projects"
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "var(--noxion-border-radius, 0.5rem)",
            backgroundColor: "var(--noxion-muted, #f5f5f5)",
            fontSize: "0.875rem",
          }}
        >
          Projects →
        </Link>
      </div>
    </div>
  );
}
