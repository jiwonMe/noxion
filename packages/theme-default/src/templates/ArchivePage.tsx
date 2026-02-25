"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";

export function ArchivePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const title = (data.title as string) ?? "Archive";

  return (
    <div className="">
      <h1 className="">{title}</h1>
      <PostList posts={posts} />
    </div>
  );
}
