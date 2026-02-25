"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";
import * as styles from "./ArchivePage.css";

export function ArchivePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const title = (data.title as string) ?? "Archive";

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{title}</h1>
      <PostList posts={posts} />
    </div>
  );
}
