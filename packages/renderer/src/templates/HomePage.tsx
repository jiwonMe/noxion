import type { NoxionTemplateProps } from "../theme/types";
import type { PostCardProps } from "../theme/types";
import { HeroSection } from "../components/HeroSection";
import { PostList } from "../components/PostList";

export function HomePage({ data, className }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const recentCount = typeof data.recentCount === "number" ? data.recentCount : 0;
  const feedTitle = (data.feedTitle as string) ?? "All Posts";
  const baseClass = className ? `noxion-template-home ${className}` : "noxion-template-home";

  if (recentCount <= 0) {
    return (
      <div className={baseClass}>
        <PostList posts={posts} />
      </div>
    );
  }

  const heroPosts = posts.slice(0, recentCount);
  const feedPosts = posts.slice(recentCount);

  return (
    <div className={baseClass}>
      <HeroSection posts={heroPosts} />

      {feedPosts.length > 0 && (
        <section className="noxion-home-feed">
          <h2 className="noxion-home-feed__title">{feedTitle}</h2>
          <PostList posts={feedPosts} />
        </section>
      )}
    </div>
  );
}
