import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { FeaturedPostCard } from "../components/FeaturedPostCard";
import { PostCard } from "../components/PostCard";
import { PostList } from "../components/PostList";

export function HomePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const feedTitle = (data.feedTitle as string) ?? "Latest";

  if (posts.length === 0) {
    return (
      <div className="">
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
    <div className="">
      <section className="">
        {leftPosts.length > 0 && (
          <div className="">
            {leftPosts.map((post) => (
              <FeaturedPostCard key={post.slug} {...post} />
            ))}
          </div>
        )}

        {middlePosts.length > 0 && (
          <div className="">
            {middlePosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        )}

        {sidebarPosts.length > 0 && (
          <div className="">
            <div className="">
              {sidebarPosts.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        )}
      </section>

      {feedPosts.length > 0 && (
        <section className="">
          <h2 className="">{feedTitle}</h2>
          <div className="">
            {feedPosts.map((post) => (
              <PostCard key={post.slug} {...post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
