import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { FeaturedPostCard } from "../components/FeaturedPostCard";
import { PostCard } from "../components/PostCard";
import { PostList } from "../components/PostList";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

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

  const featured = posts[0];
  const middlePosts = posts.slice(1, 4);
  const sidebarPosts = posts.slice(4, 10);
  const feedPosts = posts.slice(10);

  return (
    <div className="space-y-16">
      <section className="grid grid-cols-1 md:grid-cols-[1fr_0.5fr] lg:grid-cols-[1fr_0.5fr_0.5fr] gap-0">
        {featured && (
          <div className="md:pr-10">
            <FeaturedPostCard {...featured} />
          </div>
        )}

        {middlePosts.length > 0 && (
          <div className="border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800 pt-6 md:pt-0 md:pl-10 lg:pr-10 mt-6 md:mt-0">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {middlePosts.map((post) => (
                <PostCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        )}

        {sidebarPosts.length > 0 && (
          <div className="border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 pt-6 lg:pt-0 lg:pl-10 mt-6 lg:mt-0 md:col-span-2 lg:col-span-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 md:gap-x-10 divide-y md:divide-y-0 lg:divide-y divide-neutral-200 dark:divide-neutral-800">
              {sidebarPosts.map((post) => (
                <a key={post.slug} href={`/${post.slug}`} className="group block py-4 first:pt-0 md:py-0 lg:py-4 lg:first:pt-0">
                  {post.coverImage && (
                    <div className="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-2.5">
                      <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 transition-colors">{post.title}</h3>
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                    {post.author && <span>By {post.author}</span>}
                    {post.date && <span className="ml-1">&mdash;{formatDate(post.date)}</span>}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {feedPosts.length > 0 && (
        <section className="max-w-4xl space-y-6">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-3">{feedTitle}</h2>
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800/50">
            {feedPosts.map((post) => (
              <a key={post.slug} href={`/${post.slug}`} className="group flex flex-col sm:flex-row gap-4 sm:gap-6 py-5 first:pt-0">
                {post.coverImage && (
                  <div className="shrink-0 w-full sm:w-[180px] md:w-[220px] aspect-video sm:aspect-auto sm:h-[100px] md:h-[116px] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <img src={post.coverImage} alt={post.title} loading="lazy" decoding="async" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">{post.title}</h3>
                  {post.description && <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2">{post.description}</p>}
                  <div className="text-sm text-neutral-400 dark:text-neutral-500">
                    {post.author && <span>By {post.author}</span>}
                    {post.date && <span className="ml-1">&mdash;{formatDate(post.date)}</span>}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
