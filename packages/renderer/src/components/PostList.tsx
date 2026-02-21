"use client";

import type { ComponentType } from "react";
import type { PostListProps, PostCardProps } from "../theme/types";
import { useNoxionComponents } from "../theme/ThemeProvider";
import { PostCard as DefaultPostCard } from "./PostCard";

export function PostList({ posts, className }: PostListProps & { className?: string }) {
  const overrides = useNoxionComponents();
  const Card = (overrides.PostCard ?? DefaultPostCard) as ComponentType<PostCardProps>;

  if (posts.length === 0) {
    return (
      <div className="noxion-empty-state">
        <p className="noxion-empty-state__message">No posts found.</p>
      </div>
    );
  }

  return (
    <div className={className ? `noxion-post-list ${className}` : "noxion-post-list"}>
      {posts.map((post) => (
        <Card key={post.slug} {...post} />
      ))}
    </div>
  );
}
