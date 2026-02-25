import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";

export function ArchivePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];

  return (
    <div className="">
      <h1 className="">Archive</h1>
      <div className="">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
