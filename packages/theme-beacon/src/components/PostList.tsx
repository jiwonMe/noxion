import type { PostListProps } from "@noxion/renderer";
import { PostCard } from "./PostCard";
import * as styles from "./PostList.css";

export function PostList({ posts }: PostListProps) {
  return (
    <div className={styles.list}>
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
