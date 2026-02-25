import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";
import * as styles from "./ArchivePage.css";

export function ArchivePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Archive</h1>
      <div className={styles.list}>
        <PostList posts={posts} />
      </div>
    </div>
  );
}
