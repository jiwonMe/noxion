import { describe, it, expect } from "bun:test";
import { createRSSPlugin, generateRSSXml } from "../../plugins/rss";
import type { NoxionConfig, BlogPost } from "../../types";

const stubConfig: NoxionConfig = {
  rootNotionPageId: "test",
  name: "Test Blog",
  domain: "test.com",
  author: "Test Author",
  description: "A test blog",
  language: "en",
  defaultTheme: "system",
  revalidate: 3600,
};

const stubPosts: BlogPost[] = [
  {
    id: "1",
    title: "First Post",
    slug: "first-post",
    date: "2024-01-15",
    tags: ["react"],
    published: true,
    lastEditedTime: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "2",
    title: "Second Post",
    slug: "second-post",
    date: "2024-01-10",
    tags: ["typescript"],
    published: true,
    lastEditedTime: "2024-01-10T00:00:00.000Z",
  },
];

describe("createRSSPlugin", () => {
  it("has correct plugin name", () => {
    const plugin = createRSSPlugin({});
    expect(plugin.name).toBe("noxion-plugin-rss");
  });

  it("injects RSS link tag in head", () => {
    const plugin = createRSSPlugin({});
    const tags = plugin.injectHead!({ config: stubConfig });
    const rssLink = tags.find((t) => t.attributes?.type === "application/rss+xml");
    expect(rssLink).toBeDefined();
    expect(rssLink!.tagName).toBe("link");
    expect(rssLink!.attributes!.href).toBe("/feed.xml");
  });

  it("uses custom feed path", () => {
    const plugin = createRSSPlugin({ feedPath: "/rss.xml" });
    const tags = plugin.injectHead!({ config: stubConfig });
    const rssLink = tags.find((t) => t.attributes?.type === "application/rss+xml");
    expect(rssLink!.attributes!.href).toBe("/rss.xml");
  });
});

describe("generateRSSXml", () => {
  it("generates valid RSS 2.0 XML", () => {
    const xml = generateRSSXml(stubPosts, stubConfig);
    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");
    expect(xml).toContain("</channel>");
    expect(xml).toContain("</rss>");
  });

  it("includes channel metadata", () => {
    const xml = generateRSSXml(stubPosts, stubConfig);
    expect(xml).toContain("<title>Test Blog</title>");
    expect(xml).toContain("<description>A test blog</description>");
    expect(xml).toContain("https://test.com");
  });

  it("includes post items", () => {
    const xml = generateRSSXml(stubPosts, stubConfig);
    expect(xml).toContain("<item>");
    expect(xml).toContain("<title>First Post</title>");
    expect(xml).toContain("<title>Second Post</title>");
    expect(xml).toContain("https://test.com/first-post");
  });

  it("respects limit option", () => {
    const xml = generateRSSXml(stubPosts, stubConfig, { limit: 1 });
    const itemCount = (xml.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(1);
  });
});
