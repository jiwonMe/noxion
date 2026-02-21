import { describe, it, expect } from "bun:test";
import type { PostCardProps } from "../theme/types";

describe("useSearch logic (pure function test)", () => {
  function filterPosts(posts: PostCardProps[], query: string): PostCardProps[] {
    if (!query.trim()) return posts;
    const lower = query.toLowerCase();
    return posts.filter((post) => {
      if (post.title.toLowerCase().includes(lower)) return true;
      if (post.tags.some((tag) => tag.toLowerCase().includes(lower))) return true;
      if (post.category?.toLowerCase().includes(lower)) return true;
      return false;
    });
  }

  const posts: PostCardProps[] = [
    { title: "Getting Started with React", slug: "react-start", date: "2024-01-01", tags: ["react", "tutorial"], category: "Frontend" },
    { title: "Advanced TypeScript", slug: "ts-advanced", date: "2024-01-02", tags: ["typescript"], category: "Backend" },
    { title: "CSS Grid Layout", slug: "css-grid", date: "2024-01-03", tags: ["css", "layout"], category: "Frontend" },
  ];

  it("returns all posts when query is empty", () => {
    expect(filterPosts(posts, "")).toEqual(posts);
    expect(filterPosts(posts, "   ")).toEqual(posts);
  });

  it("filters by title", () => {
    const result = filterPosts(posts, "react");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("react-start");
  });

  it("filters by tag", () => {
    const result = filterPosts(posts, "css");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("css-grid");
  });

  it("filters by category", () => {
    const result = filterPosts(posts, "Frontend");
    expect(result).toHaveLength(2);
  });

  it("is case insensitive", () => {
    const result = filterPosts(posts, "TYPESCRIPT");
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("ts-advanced");
  });

  it("returns empty array when no match", () => {
    const result = filterPosts(posts, "nonexistent");
    expect(result).toHaveLength(0);
  });
});
