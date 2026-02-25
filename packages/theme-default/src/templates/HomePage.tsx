"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { HeroSection } from "../components/HeroSection";
import { PostList } from "../components/PostList";

export function HomePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const recentCount = typeof data.recentCount === "number" ? data.recentCount : 0;
  const feedTitle = (data.feedTitle as string) ?? "All Posts";

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
    <div className="space-y-16">
      <HeroSection posts={heroPosts} />

      {feedPosts.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{feedTitle}</h2>
          <PostList posts={feedPosts} />
        </section>
      )}
    </div>
  );
}
