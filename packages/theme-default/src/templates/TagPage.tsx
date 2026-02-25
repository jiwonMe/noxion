"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";

export function TagPage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const tag = (data.tag as string) ?? "Unknown";
  const count = posts.length;

  return (
    <div className="">
      <div className="">
        <h1 className="">#{tag}</h1>
        <p className="">
          {count} {count === 1 ? "post" : "posts"}
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  );
}
