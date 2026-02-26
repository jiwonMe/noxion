import type { PostListProps } from "@noxion/renderer";
import { FeedCard } from "./FeedCard";

/**
 * Feed-style post list: vertical stack of horizontal FeedCards,
 * each separated by border-bottom. Matches IBM Research blog feed.
 */
export function PostList({ posts }: PostListProps) {
  return (
    <div className="border-x border-b border-[var(--color-border)]">
      {posts.map((post) => (
        <div key={post.slug}>
          <FeedCard {...post} />
        </div>
      ))}
    </div>
  );
}
