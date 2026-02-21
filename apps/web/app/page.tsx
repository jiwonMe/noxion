import { generateCollectionPageLD } from "@noxion/adapter-nextjs";
import { getAllPosts, getAllTags } from "../lib/notion";
import { siteConfig } from "../lib/config";
import { HomeContent } from "./home-content";

export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getAllPosts();
  const allTags = getAllTags(posts);
  const collectionLd = generateCollectionPageLD(posts, siteConfig);

  const postCards = posts.map((post) => ({
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <HomeContent posts={postCards} allTags={allTags} />
    </>
  );
}
