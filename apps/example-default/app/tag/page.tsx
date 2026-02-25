import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, getAllTags } from "../../lib/notion";
import { siteConfig } from "../../lib/config";

export const revalidate = 3600;

export function generateMetadata(): Metadata {
  return {
    title: `Tags | ${siteConfig.name}`,
    description: `All tags on ${siteConfig.name}`,
  };
}

export default async function TagIndexPage() {
  const posts = await getAllPosts();
  const tags = getAllTags(posts);

  const tagCounts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.metadata.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return (
    <div>
      <h1 className="text-4xl sm:text-5xl lg:text-7xl font-semibold leading-[1.0] tracking-[-0.02em] text-black dark:text-gray-100 mb-12">
        Tags
      </h1>

      {tags.length === 0 ? (
        <p className="text-[#757575] dark:text-gray-500">No tags yet.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tag/${encodeURIComponent(tag)}`}
              className="px-4 py-2 text-sm font-medium text-black bg-gray-100 rounded-md hover:bg-gray-200 transition-colors no-underline dark:text-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {tag}
              <span className="ml-2 text-[#757575] dark:text-gray-500">
                {tagCounts.get(tag) ?? 0}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
