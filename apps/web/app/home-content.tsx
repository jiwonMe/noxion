"use client";

import { PostList, TagFilter, Search, useSearch } from "@noxion/renderer";
import type { PostCardProps } from "@noxion/renderer";
import { useState, useCallback } from "react";

interface HomeContentProps {
  posts: PostCardProps[];
  allTags: string[];
}

export function HomeContent({ posts, allTags }: HomeContentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tagFiltered = selectedTags.length > 0
    ? posts.filter((p) => p.tags.some((t) => selectedTags.includes(t)))
    : posts;

  const { setQuery, filtered } = useSearch(tagFiltered);

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, letterSpacing: "-0.03em" }}>Posts</h1>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <Search onSearch={setQuery} placeholder="Search posts..." />
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

      <PostList posts={filtered} />
    </div>
  );
}
