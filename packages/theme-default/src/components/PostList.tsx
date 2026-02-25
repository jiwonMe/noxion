"use client";

import type { PostListProps } from "@noxion/renderer";
import { PostCard } from "./PostCard";
import * as styles from "./PostList.css";

export function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No posts found.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
