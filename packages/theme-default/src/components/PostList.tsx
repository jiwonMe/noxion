"use client";

import type { PostListProps } from "@noxion/renderer";
import { PostCard } from "./PostCard";

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="">
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className="">
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
