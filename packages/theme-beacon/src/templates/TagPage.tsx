import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "../components/PostList";

export function TagPage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const tag = data.tag as string | undefined;

  return (
    <div className="">
      <h1 className="">{tag ? `#${tag}` : "Tag"}</h1>
      <div className="">
        <PostList posts={posts} />
      </div>
    </div>
  );
}
