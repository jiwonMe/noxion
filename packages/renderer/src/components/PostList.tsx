import type { ComponentType } from "react";
import type { PostListProps, PostCardProps } from "../theme/types";
import { useNoxionComponents } from "../theme/ThemeProvider";
import { PostCard as DefaultPostCard } from "./PostCard";

export function PostList({ posts }: PostListProps) {
  const overrides = useNoxionComponents();
  const Card = (overrides.PostCard ?? DefaultPostCard) as ComponentType<PostCardProps>;

  if (posts.length === 0) {
    return <EmptyState message="No posts found." />;
  }

  return (
    <div
      className="noxion-post-list"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1.5rem",
        width: "100%",
      }}
    >
      {posts.map((post) => (
        <Card key={post.slug} {...post} />
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "3rem 1rem",
        color: "var(--noxion-mutedForeground, #737373)",
      }}
    >
      <p style={{ fontSize: "1.125rem" }}>{message}</p>
    </div>
  );
}
