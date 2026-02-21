import { describe, it, expect } from "bun:test";
import { generateSlug, parseNotionPageId, buildPageUrl, resolveSlug } from "../slug";
import type { BlogPost } from "../types";

describe("generateSlug", () => {
  it("converts English title to kebab-case", () => {
    expect(generateSlug("Hello World")).toBe("hello-world");
  });

  it("handles multiple spaces", () => {
    expect(generateSlug("Hello   World")).toBe("hello-world");
  });

  it("removes special characters", () => {
    expect(generateSlug("Hello! World? #2024")).toBe("hello-world-2024");
  });

  it("trims leading/trailing hyphens", () => {
    expect(generateSlug("  Hello World  ")).toBe("hello-world");
  });

  it("preserves Korean characters", () => {
    const result = generateSlug("안녕하세요 세계");
    expect(result).toBe("안녕하세요-세계");
  });

  it("preserves CJK characters mixed with English", () => {
    const result = generateSlug("React 시작하기");
    expect(result).toBe("react-시작하기");
  });

  it("handles empty string", () => {
    expect(generateSlug("")).toBe("");
  });

  it("collapses consecutive hyphens", () => {
    expect(generateSlug("Hello---World")).toBe("hello-world");
  });

  it("handles numbers", () => {
    expect(generateSlug("Top 10 Tips for 2024")).toBe("top-10-tips-for-2024");
  });
});

describe("parseNotionPageId", () => {
  it("extracts ID from full Notion URL", () => {
    const result = parseNotionPageId(
      "https://www.notion.so/My-Page-abc123def456abc123def456abc123de"
    );
    expect(result).toBe("abc123de-f456-abc1-23de-f456abc123de");
  });

  it("returns clean ID when given raw 32-char hex", () => {
    const result = parseNotionPageId("abc123def456abc123def456abc123de");
    expect(result).toBe("abc123de-f456-abc1-23de-f456abc123de");
  });

  it("returns UUID unchanged when already formatted", () => {
    const result = parseNotionPageId("abc123de-f456-abc1-23de-f456abc123de");
    expect(result).toBe("abc123de-f456-abc1-23de-f456abc123de");
  });
});

describe("buildPageUrl", () => {
  it("builds URL from slug", () => {
    expect(buildPageUrl("hello-world")).toBe("/hello-world");
  });

  it("handles slug with leading slash", () => {
    expect(buildPageUrl("/hello-world")).toBe("/hello-world");
  });
});

describe("resolveSlug", () => {
  it("uses explicit slug property when available", () => {
    const post: BlogPost = {
      id: "1",
      title: "My Post Title",
      slug: "custom-slug",
      date: "2024-01-15",
      tags: [],
      published: true,
      lastEditedTime: "2024-01-15T00:00:00.000Z",
    };
    expect(resolveSlug(post)).toBe("custom-slug");
  });

  it("generates slug from title when slug is empty", () => {
    const post: BlogPost = {
      id: "1",
      title: "My Post Title",
      slug: "",
      date: "2024-01-15",
      tags: [],
      published: true,
      lastEditedTime: "2024-01-15T00:00:00.000Z",
    };
    expect(resolveSlug(post)).toBe("my-post-title");
  });

  it("generates slug from Korean title", () => {
    const post: BlogPost = {
      id: "1",
      title: "React 시작하기",
      slug: "",
      date: "2024-01-15",
      tags: [],
      published: true,
      lastEditedTime: "2024-01-15T00:00:00.000Z",
    };
    expect(resolveSlug(post)).toBe("react-시작하기");
  });
});
