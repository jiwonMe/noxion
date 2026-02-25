"use client";

import { HeroSection, PostList, TagFilter, Search } from "@noxion/theme-default";
import type { PostCardProps } from "@noxion/renderer";
import { useState, useCallback, useRef, useEffect } from "react";

const HERO_COUNT = 3;

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
  const heroPosts =
    !isFiltering && state.posts.length >= HERO_COUNT
      ? state.posts.slice(0, HERO_COUNT)
      : [];
  const feedPosts =
    heroPosts.length > 0 ? state.posts.slice(HERO_COUNT) : state.posts;

  return (
    <div className="space-y-12">
      {heroPosts.length > 0 && <HeroSection posts={heroPosts} />}

      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Search onSearch={handleSearch} placeholder="Search posts..." />
          {allTags.length > 0 && (
            <TagFilter
              tags={allTags}
              selectedTags={selectedTags}
              onToggle={handleToggleTag}
              maxVisible={8}
            />
          )}
        </div>

        <PostList posts={feedPosts} />

        <div ref={sentinelRef} style={{ height: 1 }} />

        {state.loading && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-gray-100" />
          </div>
        )}
      </section>
    </div>
  );
}
