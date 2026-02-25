import { generateCollectionPageLD } from "@noxion/adapter-nextjs";
import {
  getPaginatedPosts,
  getAllPosts,
  getAllTags,
  DEFAULT_PAGE_SIZE,
} from "../lib/notion";
import { siteConfig } from "../lib/config";
import { HomeContent } from "./home-content";

export const revalidate = 3600;

export default async function HomePage() {
  const [paginated, allPosts] = await Promise.all([
    getPaginatedPosts({ page: 1, pageSize: DEFAULT_PAGE_SIZE }),
    getAllPosts(),
  ]);

  const allTags = getAllTags(allPosts);
  const collectionLd = generateCollectionPageLD(allPosts, siteConfig);

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <HomeContent
        initialPosts={initialPosts}
        allTags={allTags}
        hasMore={paginated.hasMore}
        total={paginated.total}
        pageSize={DEFAULT_PAGE_SIZE}
      />
    </>
  );
}
