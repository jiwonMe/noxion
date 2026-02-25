import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";
import * as styles from "./TagPage.css";

export function TagPage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const tag = data.tag as string | undefined;

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>{tag ? `#${tag}` : "Tag"}</h1>
      <div className={styles.list}>
        <PostList posts={posts} />
      </div>
    </div>
  );
}
