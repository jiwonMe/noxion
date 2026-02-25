"use client";

import type { PostListProps } from "@noxion/renderer";
import { PostCard } from "./PostCard";

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400">No posts found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
