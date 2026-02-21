import { describe, it, expect } from "bun:test";
import { generateNoxionMetadata, generateNoxionListMetadata } from "../metadata";
import { generateNoxionSitemap } from "../sitemap";
import { generateNoxionRobots } from "../robots";
import { generateBlogPostingLD, generateWebSiteLD } from "../structured-data";
import type { NoxionConfig, BlogPost } from "@noxion/core";

const stubConfig: NoxionConfig = {
  rootNotionPageId: "test-page-id",
  name: "Test Blog",
  domain: "test.com",
  author: "Test Author",
  description: "A test blog",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
};

const stubPost: BlogPost = {
  id: "post-1",
  title: "My First Post",
  slug: "my-first-post",
  date: "2024-01-15",
  tags: ["react", "typescript"],
  category: "Frontend",
  coverImage: "https://example.com/cover.jpg",
  published: true,
  lastEditedTime: "2024-01-15T10:00:00.000Z",
};

describe("generateNoxionMetadata", () => {
  it("generates title from post", () => {
    const meta = generateNoxionMetadata(stubPost, stubConfig);
    expect(meta.title).toBe("My First Post | Test Blog");
  });

  it("generates description from post title when no custom desc", () => {
    const meta = generateNoxionMetadata(stubPost, stubConfig);
    expect(meta.description).toBeDefined();
  });

  it("includes Open Graph metadata", () => {
    const meta = generateNoxionMetadata(stubPost, stubConfig);
    const og = meta.openGraph as Record<string, unknown>;
    expect(og).toBeDefined();
    expect(og.title).toBe("My First Post");
    expect(og.type).toBe("article");
    expect(og.url).toContain("my-first-post");
  });

  it("includes Twitter card metadata", () => {
    const meta = generateNoxionMetadata(stubPost, stubConfig);
    const tw = meta.twitter as Record<string, unknown>;
    expect(tw).toBeDefined();
    expect(tw.card).toBe("summary_large_image");
  });

  it("includes cover image in OG when available", () => {
    const meta = generateNoxionMetadata(stubPost, stubConfig);
    expect(meta.openGraph!.images).toBeDefined();
  });

  it("generates canonical URL", () => {
    const meta = generateNoxionMetadata(stubPost, stubConfig);
    expect(meta.alternates?.canonical).toContain("test.com");
    expect(meta.alternates?.canonical).toContain("my-first-post");
  });
});

describe("generateNoxionListMetadata", () => {
  it("generates site-level metadata", () => {
    const meta = generateNoxionListMetadata(stubConfig);
    expect((meta.title as { default: string }).default).toBe("Test Blog");
    expect(meta.description).toBe("A test blog");
  });

  it("includes Open Graph for homepage", () => {
    const meta = generateNoxionListMetadata(stubConfig);
    const og = meta.openGraph as Record<string, unknown>;
    expect(og).toBeDefined();
    expect(og.type).toBe("website");
  });
});

describe("generateNoxionSitemap", () => {
  it("generates sitemap entries for posts", () => {
    const sitemap = generateNoxionSitemap([stubPost], stubConfig);
    expect(sitemap.length).toBeGreaterThanOrEqual(1);
    const postEntry = sitemap.find((e) => e.url.includes("my-first-post"));
    expect(postEntry).toBeDefined();
  });

  it("includes homepage entry", () => {
    const sitemap = generateNoxionSitemap([], stubConfig);
    expect(sitemap.length).toBeGreaterThanOrEqual(1);
    const home = sitemap.find((e) => e.url === "https://test.com");
    expect(home).toBeDefined();
  });

  it("includes lastModified from post", () => {
    const sitemap = generateNoxionSitemap([stubPost], stubConfig);
    const postEntry = sitemap.find((e) => e.url.includes("my-first-post"));
    expect(postEntry?.lastModified).toBeDefined();
  });
});

describe("generateNoxionRobots", () => {
  it("allows all crawling", () => {
    const robots = generateNoxionRobots(stubConfig);
    expect(robots.rules).toBeDefined();
  });

  it("includes sitemap URL", () => {
    const robots = generateNoxionRobots(stubConfig);
    expect(robots.sitemap).toContain("test.com");
    expect(robots.sitemap).toContain("sitemap.xml");
  });
});

describe("generateBlogPostingLD", () => {
  it("returns valid BlogPosting JSON-LD", () => {
    const ld = generateBlogPostingLD(stubPost, stubConfig);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld.headline).toBe("My First Post");
    expect(ld.author).toBeDefined();
    expect(ld.datePublished).toBe("2024-01-15T00:00:00.000Z");
  });

  it("includes image when cover is present", () => {
    const ld = generateBlogPostingLD(stubPost, stubConfig);
    expect((ld.image as { url: string }).url).toBe("https://example.com/cover.jpg");
  });
});

describe("generateWebSiteLD", () => {
  it("returns valid WebSite JSON-LD", () => {
    const ld = generateWebSiteLD(stubConfig);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("WebSite");
    expect(ld.name).toBe("Test Blog");
    expect(ld.url).toContain("test.com");
  });
});
