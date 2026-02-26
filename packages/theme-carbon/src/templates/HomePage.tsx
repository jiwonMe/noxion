import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { FeaturedPostCard } from "../components/FeaturedPostCard";
import { PostList } from "../components/PostList";

export function HomePage({ data }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const categories = Array.from(new Set(posts.map((post) => post.category).filter(Boolean))) as string[];
  const popularTopics = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 8);

  if (posts.length === 0) {
    return <div className="py-12 text-center text-[var(--color-muted-foreground)]">No posts found.</div>;
  }

  const featured = posts[0];
  const feed = posts.slice(1);

  return (
    <div>
      {/* ── Hero: sidebar + featured ── */}
      {featured && (
        <section className="grid gap-0 lg:grid-cols-[320px_1fr]">
          {/* Sidebar — no outer border, only right divider + internal horizontal rules */}
          <aside className="hidden lg:block">
            {/* Breadcrumb */}
            <div className="border-b border-[var(--color-border)] px-6 pb-4 pt-6">
              <a
                href="/"
                className="text-sm text-[var(--color-primary)] transition-colors duration-[110ms] hover:opacity-80"
              >
                Home
              </a>
              <p className="mt-0.5 text-sm text-[var(--color-foreground)]">↳ Blog</p>
            </div>

            {/* Categories */}
            <div className="border-b border-[var(--color-border)] px-6 py-5">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <a
                    key={category}
                    href={`/tag/${encodeURIComponent(category)}`}
                    className="inline-flex items-center rounded-full border border-[var(--color-border)] px-3 py-1 text-sm text-[var(--color-foreground)] transition-all duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-hover)]"
                  >
                    {category}
                  </a>
                ))}
              </div>
            </div>

            {/* Popular topics */}
            <div className="px-6 py-5">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">
                Popular topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((tag) => (
                  <a
                    key={tag}
                    href={`/tag/${encodeURIComponent(tag)}`}
                    className="inline-flex items-center rounded-full bg-[var(--color-tag-green-bg)] px-3 py-1 text-sm text-[var(--color-tag-green-text)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-tag-green-hover-bg)]"
                  >
                    {tag}
                  </a>
                ))}
              </div>
            </div>
          </aside>

          {/* Featured post — right side */}
          <div className="border-l border-[var(--color-border)] lg:border-l">
            <FeaturedPostCard {...featured} />
          </div>
        </section>
      )}

      {/* ── Search bar ── */}
      <div className="border-y border-[var(--color-border)] px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
            <path d="M29 27.586l-7.552-7.552a11.018 11.018 0 10-1.414 1.414L27.586 29zM4 13a9 9 0 119 9 9.01 9.01 0 01-9-9z" />
          </svg>
          <span>Search topics, titles and authors</span>
        </div>
      </div>

      {/* ── Feed ── */}
      {feed.length > 0 && (
        <PostList posts={feed} />
      )}
    </div>
  );
}
