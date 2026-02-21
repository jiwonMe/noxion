import type { NoxionTemplateProps } from "../theme/types";
import type { PostCardProps } from "../theme/types";
import { PostList } from "../components/PostList";

export function HomePage({ data, className }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];

  return (
    <div className={className ? `noxion-template-home ${className}` : "noxion-template-home"}>
      <PostList posts={posts} />
    </div>
  );
}
