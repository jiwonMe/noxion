"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";

export function TagPage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const tag = (data.tag as string) ?? "Unknown";
  const count = posts.length;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">#{tag}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          {count} {count === 1 ? "post" : "posts"}
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  );
}
