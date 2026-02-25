"use client";

import { PostList, TagFilter, Search } from "@noxion/theme-default";
import type { PostCardProps } from "@noxion/renderer";
import { useState, useCallback } from "react";

interface HomeContentProps {
  posts: PostCardProps[];
  allTags: string[];
}

export function HomeContent({ posts, allTags }: HomeContentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const tagFiltered = selectedTags.length > 0
    ? posts.filter((p) => p.tags.some((t: string) => selectedTags.includes(t)))
    : posts;

  const filtered = searchQuery.trim()
    ? tagFiltered.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description ?? "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tagFiltered;

  const handleToggleTag = useCallback((tag: string) => {
    setSelectedTags((prev: string[]) =>
      prev.includes(tag) ? prev.filter((t: string) => t !== tag) : [...prev, tag]
    );
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-4">
        <Search onSearch={setSearchQuery} placeholder="Search posts..." />
        {allTags.length > 0 && (
          <TagFilter
            tags={allTags}
            selectedTags={selectedTags}
            onToggle={handleToggleTag}
          />
        )}
      </div>

      <PostList posts={filtered} />
    </div>
  );
}
