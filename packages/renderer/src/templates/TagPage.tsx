import type { NoxionTemplateProps } from "../theme/types";
import type { PostCardProps } from "../theme/types";
import { PostList } from "../components/PostList";

export function TagPage({ data, className }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const tag = (data.tag as string) ?? "Unknown";

  return (
    <div className={className ? `noxion-template-tag ${className}` : "noxion-template-tag"}>
      <h1 className="noxion-template-tag__title">#{tag}</h1>
      <PostList posts={posts} />
    </div>
  );
}
