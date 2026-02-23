"use client";

import { PostList, TagFilter, Search } from "@noxion/renderer";
import type { PostCardProps } from "@noxion/renderer";
import { useState, useCallback, useRef, useEffect } from "react";

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
    initialTag ? [initialTag] : []
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
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em" }}>Posts</h1>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <Search onSearch={handleSearch} placeholder="Search posts..." />
      </div>

      {allTags.length > 0 && (
        <div style={{ marginBottom: "2rem" }}>
          <TagFilter
            tags={allTags}
            selectedTags={selectedTags}
            onToggle={handleToggleTag}
            maxVisible={8}
          />
        </div>
      )}

      <PostList posts={state.posts} />

      <div ref={sentinelRef} style={{ height: 1 }} />

      {state.loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "2rem 0",
          }}
        >
          <div
            style={{
              width: 24,
              height: 24,
              border: "2px solid var(--noxion-border, #e5e5e5)",
              borderTopColor: "var(--noxion-foreground, #171717)",
              borderRadius: "50%",
              animation: "noxion-spin 0.6s linear infinite",
            }}
          />
          <style>{`@keyframes noxion-spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      )}
    </div>
  );
}
