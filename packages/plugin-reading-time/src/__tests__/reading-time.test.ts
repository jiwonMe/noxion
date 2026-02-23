import { describe, it, expect, beforeEach } from "bun:test";
import {
  createMockBlogPages,
  createMockBlogPage,
  createMockDocsPage,
  createMockPage,
  resetMockCounter,
} from "@noxion/plugin-utils";
import { createReadingTimePlugin, estimateReadingTime } from "../index";

describe("estimateReadingTime", () => {
  it("returns 1 min for very short text", () => {
    expect(estimateReadingTime("hello world")).toBe("1 min read");
  });

  it("calculates based on word count and wpm", () => {
    const text = Array.from({ length: 400 }, () => "word").join(" ");
    expect(estimateReadingTime(text, 200)).toBe("2 min read");
  });

  it("rounds up to next minute", () => {
    const text = Array.from({ length: 201 }, () => "word").join(" ");
    expect(estimateReadingTime(text, 200)).toBe("2 min read");
  });

  it("handles empty string", () => {
    expect(estimateReadingTime("")).toBe("1 min read");
  });

  it("handles whitespace-only string", () => {
    expect(estimateReadingTime("   \n\t  ")).toBe("1 min read");
  });

  it("uses custom wpm", () => {
    const text = Array.from({ length: 500 }, () => "word").join(" ");
    expect(estimateReadingTime(text, 500)).toBe("1 min read");
    expect(estimateReadingTime(text, 100)).toBe("5 min read");
  });
});

describe("createReadingTimePlugin", () => {
  beforeEach(() => {
    resetMockCounter();
  });

  it("has the correct name", () => {
    const plugin = createReadingTimePlugin({});
    expect(plugin.name).toBe("noxion-plugin-reading-time");
  });

  describe("transformPosts", () => {
    it("adds readingTime to post frontmatter", () => {
      const plugin = createReadingTimePlugin({});
      const posts = createMockBlogPages(3);
      const result = plugin.transformPosts!({ posts });

      for (const post of result) {
        expect(post.frontmatter?.readingTime).toBeDefined();
        expect(typeof post.frontmatter?.readingTime).toBe("string");
      }
    });

    it("preserves existing frontmatter", () => {
      const plugin = createReadingTimePlugin({});
      const posts = [
        createMockBlogPage({ frontmatter: { customKey: "value" } }),
      ];
      const result = plugin.transformPosts!({ posts });
      expect(result[0].frontmatter?.customKey).toBe("value");
      expect(result[0].frontmatter?.readingTime).toBeDefined();
    });

    it("uses description for word count if available", () => {
      const longDesc = Array.from({ length: 600 }, () => "word").join(" ");
      const plugin = createReadingTimePlugin({ wordsPerMinute: 200 });
      const posts = [createMockBlogPage({ description: longDesc })];
      const result = plugin.transformPosts!({ posts });
      expect(result[0].frontmatter?.readingTime).toBe("3 min read");
    });

    it("falls back to title when no description", () => {
      const plugin = createReadingTimePlugin({});
      const posts = [createMockBlogPage({ description: undefined })];
      const result = plugin.transformPosts!({ posts });
      expect(result[0].frontmatter?.readingTime).toBeDefined();
    });

    it("respects custom wordsPerMinute", () => {
      const text = Array.from({ length: 500 }, () => "word").join(" ");
      const fast = createReadingTimePlugin({ wordsPerMinute: 500 });
      const slow = createReadingTimePlugin({ wordsPerMinute: 100 });
      const posts = [createMockBlogPage({ description: text })];

      const fastResult = fast.transformPosts!({ posts });
      const slowResult = slow.transformPosts!({ posts });

      expect(fastResult[0].frontmatter?.readingTime).toBe("1 min read");
      expect(slowResult[0].frontmatter?.readingTime).toBe("5 min read");
    });

    it("preserves all other post properties", () => {
      const plugin = createReadingTimePlugin({});
      const original = createMockBlogPage({ title: "My Post" });
      const result = plugin.transformPosts!({ posts: [original] });

      expect(result[0].title).toBe("My Post");
      expect(result[0].pageType).toBe("blog");
      expect(result[0].metadata).toEqual(original.metadata);
    });

    it("works with non-blog pages passed at runtime", () => {
      const plugin = createReadingTimePlugin({});
      const docsPage = createMockDocsPage({ title: "Docs Page" });
      // At runtime, transformPosts may receive any NoxionPage subtype.
      // The hook signature uses BlogPost[] for backward compat, but the
      // implementation only accesses base NoxionPage fields.
      const posts = [docsPage] as unknown as Parameters<
        NonNullable<typeof plugin.transformPosts>
      >[0]["posts"];
      const result = plugin.transformPosts!({ posts });
      expect(result[0].frontmatter?.readingTime).toBeDefined();
    });
  });

  describe("extendSlots", () => {
    it("adds readingTimeDisplay slot with icon by default", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.extendSlots!({});
      expect(result.readingTimeDisplay).toContain("📖");
    });

    it("adds readingTimeDisplay slot without icon when showIcon is false", () => {
      const plugin = createReadingTimePlugin({ showIcon: false });
      const result = plugin.extendSlots!({});
      expect(result.readingTimeDisplay).not.toContain("📖");
    });

    it("preserves existing slots", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.extendSlots!({ existingSlot: "value" });
      expect(result.existingSlot).toBe("value");
      expect(result.readingTimeDisplay).toBeDefined();
    });
  });

  describe("configSchema", () => {
    it("validates valid options", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.configSchema!.validate({ wordsPerMinute: 250 });
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates empty options", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.configSchema!.validate({});
      expect(result.valid).toBe(true);
    });

    it("rejects non-object options", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.configSchema!.validate("invalid");
      expect(result.valid).toBe(false);
    });

    it("rejects non-number wordsPerMinute", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.configSchema!.validate({ wordsPerMinute: "fast" });
      expect(result.valid).toBe(false);
      expect(result.errors?.some((e: string) => e.includes("wordsPerMinute"))).toBe(true);
    });

    it("rejects zero wordsPerMinute", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.configSchema!.validate({ wordsPerMinute: 0 });
      expect(result.valid).toBe(false);
    });

    it("rejects non-boolean showIcon", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.configSchema!.validate({ showIcon: "yes" });
      expect(result.valid).toBe(false);
      expect(result.errors?.some((e: string) => e.includes("showIcon"))).toBe(true);
    });
  });

  describe("default options", () => {
    it("uses 200 wpm by default", () => {
      const text = Array.from({ length: 200 }, () => "word").join(" ");
      const plugin = createReadingTimePlugin({});
      const posts = [createMockBlogPage({ description: text })];
      const result = plugin.transformPosts!({ posts });
      expect(result[0].frontmatter?.readingTime).toBe("1 min read");
    });

    it("shows icon by default", () => {
      const plugin = createReadingTimePlugin({});
      const result = plugin.extendSlots!({});
      expect(result.readingTimeDisplay).toContain("📖");
    });
  });
});
