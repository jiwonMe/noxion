"use client";

import { useState, useMemo } from "react";
import type { PostCardProps } from "../theme/types";

export function useSearch(posts: PostCardProps[]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return posts;

    const lower = query.toLowerCase();
    return posts.filter((post) => {
      if (post.title.toLowerCase().includes(lower)) return true;
      if (post.tags.some((tag) => tag.toLowerCase().includes(lower))) return true;
      if (post.category?.toLowerCase().includes(lower)) return true;
      return false;
    });
  }, [posts, query]);

  return { query, setQuery, filtered } as const;
}
