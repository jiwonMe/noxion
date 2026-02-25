import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";

export function ArchivePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">Archive</h1>
      <div>
        <PostList posts={posts} />
      </div>
    </div>
  );
}
