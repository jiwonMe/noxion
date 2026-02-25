import type { PostListProps } from "@noxion/renderer";
import { PostCard } from "./PostCard";

export function PostList({ posts }: PostListProps) {
  return (
    <div className="">
      {posts.map((post) => (
        <PostCard key={post.slug} {...post} />
      ))}
    </div>
  );
}
