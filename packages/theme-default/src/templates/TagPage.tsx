"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";
import * as styles from "./TagPage.css";

export function TagPage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const tag = (data.tag as string) ?? "Unknown";
  const count = posts.length;

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <h1 className={styles.title}>#{tag}</h1>
        <p className={styles.subtitle}>
          {count} {count === 1 ? "post" : "posts"}
        </p>
      </div>
      <PostList posts={posts} />
    </div>
  );
}
