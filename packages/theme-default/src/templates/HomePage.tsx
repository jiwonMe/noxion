"use client";

import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { HeroSection } from "../components/HeroSection";
import { PostList } from "../components/PostList";
import * as styles from "./HomePage.css";

export function HomePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const recentCount = typeof data.recentCount === "number" ? data.recentCount : 0;
  const feedTitle = (data.feedTitle as string) ?? "All Posts";

  if (recentCount <= 0) {
    return (
      <div className={styles.page}>
        <PostList posts={posts} />
      </div>
    );
  }

  const heroPosts = posts.slice(0, recentCount);
  const feedPosts = posts.slice(recentCount);

  return (
    <div className={styles.page}>
      <HeroSection posts={heroPosts} />

      {feedPosts.length > 0 && (
        <section className={styles.feed}>
          <h2 className={styles.feedTitle}>{feedTitle}</h2>
          <PostList posts={feedPosts} />
        </section>
      )}
    </div>
  );
}
