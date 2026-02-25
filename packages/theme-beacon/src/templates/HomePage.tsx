import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { FeaturedPostCard } from "../components/FeaturedPostCard";
import { PostCard } from "../components/PostCard";
import { PostList } from "../components/PostList";

export function HomePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const feedTitle = (data.feedTitle as string) ?? "Latest";

  if (posts.length === 0) {
    return (
      <div>
        <PostList posts={posts} />
      </div>
    );
  }

  const LEFT_COUNT = 1;
  const MIDDLE_COUNT = 3;
  const SIDEBAR_COUNT = 6;
  const HERO_TOTAL = LEFT_COUNT + MIDDLE_COUNT + SIDEBAR_COUNT;

  const heroCount = Math.min(posts.length, HERO_TOTAL);
  const heroPosts = posts.slice(0, heroCount);
  const feedPosts = posts.slice(heroCount);

  const leftPosts = heroPosts.slice(0, LEFT_COUNT);
  const middlePosts = heroPosts.slice(LEFT_COUNT, LEFT_COUNT + MIDDLE_COUNT);
  const sidebarPosts = heroPosts.slice(LEFT_COUNT + MIDDLE_COUNT);

  return (
    <div className="space-y-16">
      <section className="grid grid-cols-1 lg:grid-cols-[2fr_1fr_1fr] gap-8 lg:gap-6">
        {leftPosts.length > 0 && (
          <div className="lg:col-span-1">
            {leftPosts.map((post) => (
              <FeaturedPostCard key={post.slug} {...post} />
            ))}
          </div>
        )}

        {middlePosts.length > 0 && (
          <div className="lg:col-span-1 divide-y divide-neutral-200 dark:divide-neutral-800">
            {middlePosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        )}

        {sidebarPosts.length > 0 && (
          <div className="lg:col-span-1 border-l border-neutral-200 dark:border-neutral-800 pl-6">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {sidebarPosts.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        )}
      </section>

      {feedPosts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-3">{feedTitle}</h2>
          <PostList posts={feedPosts} />
        </section>
      )}
    </div>
  );
}
