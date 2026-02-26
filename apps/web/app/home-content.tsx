"use client";

import { FeaturedPostCard, FeedCard, Search } from "@noxion/theme-carbon";
import type { PostCardProps } from "@noxion/renderer";
import { useState, useCallback, useRef, useEffect } from "react";

const HERO_FEED_OFFSET = 1;

interface HomeContentProps {
  initialPosts: PostCardProps[];
  allTags: string[];
  hasMore: boolean;
  total: number;
  pageSize: number;
  initialTag?: string;
}

interface FetchState {
  posts: PostCardProps[];
  page: number;
  hasMore: boolean;
  loading: boolean;
}

async function fetchPosts(params: {
  page: number;
  pageSize: number;
  tag?: string;
  search?: string;
}): Promise<{
  posts: PostCardProps[];
  page: number;
  hasMore: boolean;
  total: number;
}> {
  const query = new URLSearchParams();
  query.set("page", String(params.page));
  query.set("pageSize", String(params.pageSize));
  if (params.tag) query.set("tag", params.tag);
  if (params.search) query.set("search", params.search);

  const res = await fetch(`/api/posts?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export function HomeContent({
  initialPosts,
  allTags,
  hasMore: initialHasMore,
  total: _total,
  pageSize,
  initialTag,
}: HomeContentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initialTag ? [initialTag] : [],
  );
  const [searchQuery, setSearchQuery] = useState("");

  const [state, setState] = useState<FetchState>({
    posts: initialPosts,
    page: 1,
    hasMore: initialHasMore,
    loading: false,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const tag = selectedTags.length === 1 ? selectedTags[0] : undefined;
    const search = searchQuery.trim() || undefined;

    if (!tag && !search && !initialTag) {
      setState({
        posts: initialPosts,
        page: 1,
        hasMore: initialHasMore,
        loading: false,
      });
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setState((prev) => ({ ...prev, loading: true, posts: [], page: 1 }));

    fetchPosts({ page: 1, pageSize, tag, search })
      .then((result) => {
        if (controller.signal.aborted) return;
        setState({
          posts: result.posts,
          page: 1,
          hasMore: result.hasMore,
          loading: false,
        });
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Failed to fetch posts:", err);
        setState((prev) => ({ ...prev, loading: false }));
      });

    return () => controller.abort();
  }, [selectedTags, searchQuery, initialPosts, initialHasMore, initialTag, pageSize]);

  const loadMore = useCallback(() => {
    if (state.loading || !state.hasMore) return;

    const nextPage = state.page + 1;
    const tag = selectedTags.length === 1 ? selectedTags[0] : undefined;
    const search = searchQuery.trim() || undefined;

    setState((prev) => ({ ...prev, loading: true }));

    fetchPosts({ page: nextPage, pageSize, tag, search })
      .then((result) => {
        setState((prev) => ({
          posts: [...prev.posts, ...result.posts],
          page: nextPage,
          hasMore: result.hasMore,
          loading: false,
        }));
      })
      .catch((err) => {
        console.error("Failed to load more posts:", err);
        setState((prev) => ({ ...prev, loading: false }));
      });
  }, [state.loading, state.hasMore, state.page, selectedTags, searchQuery, pageSize]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const isFiltering = selectedTags.length > 0 || Boolean(searchQuery.trim());
  const featuredPost = !isFiltering && state.posts.length > 0 ? state.posts[0] : null;
  const feedPosts = featuredPost ? state.posts.slice(HERO_FEED_OFFSET) : state.posts;
  const categories = Array.from(
    new Set(state.posts.map((post) => post.category).filter((category): category is string => Boolean(category))),
  );
  const popularTopics = allTags.slice(0, 8);

  return (
    <div>
      {/* ── Hero: sidebar + featured ── */}
      {featuredPost && (
        <section className="grid gap-0 lg:grid-cols-[320px_1fr]">
          {/* Sidebar */}
          <aside className="hidden lg:block">
            <div className="border-b border-[var(--color-border)] px-6 pb-4 pt-6">
              <a href="/" className="text-sm text-[var(--color-primary)] transition-colors duration-[110ms] hover:opacity-80">
                Home
              </a>
              <p className="mt-0.5 text-sm text-[var(--color-foreground)]">↳ Blog</p>
            </div>

            <div className="border-b border-[var(--color-border)] px-6 py-5">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">Categories</h3>
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

            <div className="px-6 py-5">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-foreground)]">Popular topics</h3>
              <div className="flex flex-wrap gap-2">
                {popularTopics.map((tag) => {
                  const active = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={
                        active
                          ? "inline-flex items-center rounded-full border border-[var(--color-primary)] bg-[var(--color-primary)] px-3 py-1 text-sm text-[var(--color-primary-foreground)] transition-colors duration-[110ms]"
                          : "inline-flex items-center rounded-full bg-[var(--color-tag-green-bg)] px-3 py-1 text-sm text-[var(--color-tag-green-text)] transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:bg-[var(--color-tag-green-hover-bg)]"
                      }
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Featured */}
          <div className="border-l border-[var(--color-border)]">
            <FeaturedPostCard {...featuredPost} />
          </div>
        </section>
      )}

      {/* ── Search bar ── */}
      <div className="border-y border-[var(--color-border)]">
        <Search onSearch={handleSearch} placeholder="Search topics, titles and authors" />
      </div>

      {/* ── Feed ── */}
      {feedPosts.map((post) => (
        <FeedCard key={post.slug} {...post} />
      ))}

      <div ref={sentinelRef} style={{ height: 1 }} />

      {state.loading && (
        <div className="flex justify-center py-8">
          <div className="h-5 w-5 animate-spin border-2 border-[var(--color-border)] border-t-[var(--color-foreground)]" />
        </div>
      )}
    </div>
  );
}
