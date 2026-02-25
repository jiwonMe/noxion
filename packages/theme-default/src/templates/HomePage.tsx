"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { HeroSection } from "../components/HeroSection";
import { PostList } from "../components/PostList";

export function HomePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const recentCount = typeof data.recentCount === "number" ? data.recentCount : 0;
  const feedTitle = (data.feedTitle as string) ?? "More posts";

  if (recentCount <= 0) {
    return (
      <div>
        <PostList posts={posts} />
      </div>
    );
  }

  const heroPosts = posts.slice(0, recentCount);
  const feedPosts = posts.slice(recentCount);

  return (
    <div>
      <HeroSection posts={heroPosts} />

      {feedPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-black dark:text-gray-100 mb-8">
            {feedTitle}
          </h2>
          <PostList posts={feedPosts} />
        </section>
      )}
    </div>
  );
}
