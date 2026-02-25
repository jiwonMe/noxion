"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";

export function ArchivePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const title = (data.title as string) ?? "Archive";

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
      <PostList posts={posts} />
    </div>
  );
}
