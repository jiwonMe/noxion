import type { PostListProps } from "@noxion/renderer";
import { PostCard } from "./PostCard";

export function PostList({ posts }: PostListProps) {
  return (
    <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
