import { getAllPosts, getAllTags } from "../lib/notion";
import { HomeContent } from "./home-content";

export const revalidate = 3600;

export default async function HomePage() {
  const posts = await getAllPosts();
  const allTags = getAllTags(posts);

  const postCards = posts.map((post) => ({
    title: post.title,
    slug: post.slug,
    date: post.date,
    tags: post.tags,
    coverImage: post.coverImage,
    category: post.category,
  }));

  return <HomeContent posts={postCards} allTags={allTags} />;
}
