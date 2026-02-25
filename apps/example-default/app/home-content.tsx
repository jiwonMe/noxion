"use client";

import { HeroSection, PostList } from "@noxion/theme-default";
import type { PostCardProps } from "@noxion/renderer";
import { useState, useCallback, useRef, useEffect } from "react";

const HERO_COUNT = 1;

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

  const res = await fetch(`/api/posts?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export function HomeContent({
  initialPosts,
  allTags: _allTags,
  hasMore: initialHasMore,
  total: _total,
  pageSize,
  initialTag,
}: HomeContentProps) {
  const [state, setState] = useState<FetchState>({
    posts: initialPosts,
    page: 1,
    hasMore: initialHasMore,
    loading: false,
  });

  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    if (state.loading || !state.hasMore) return;

    const nextPage = state.page + 1;
    const tag = initialTag || undefined;

    setState((prev) => ({ ...prev, loading: true }));

    fetchPosts({ page: nextPage, pageSize, tag })
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
  }, [state.loading, state.hasMore, state.page, initialTag, pageSize]);

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

  const heroPosts =
    state.posts.length >= HERO_COUNT
      ? state.posts.slice(0, HERO_COUNT)
      : [];
  const feedPosts =
    heroPosts.length > 0 ? state.posts.slice(HERO_COUNT) : state.posts;

  return (
    <div>
      {heroPosts.length > 0 && <HeroSection posts={heroPosts} />}

      {feedPosts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold text-black dark:text-gray-100 mb-8">
            More issues
          </h2>

          <PostList posts={feedPosts} />

          <div ref={sentinelRef} style={{ height: 1 }} />

          {state.loading && (
            <div className="flex justify-center py-12">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-gray-100" />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
