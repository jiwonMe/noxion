import type { NoxionTemplateProps } from "../theme/types";
import type { PostCardProps } from "../theme/types";
import { PostList } from "../components/PostList";

export function ArchivePage({ data, className }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const title = (data.title as string) ?? "Archive";

  return (
    <div className={className ? `noxion-template-archive ${className}` : "noxion-template-archive"}>
      <h1 className="noxion-template-archive__title">{title}</h1>
      <PostList posts={posts} />
    </div>
  );
}
