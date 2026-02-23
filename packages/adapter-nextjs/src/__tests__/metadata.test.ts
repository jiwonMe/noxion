import { describe, it, expect } from "bun:test";
import { generateNoxionMetadata, generateNoxionListMetadata } from "../metadata";
import { generateNoxionSitemap } from "../sitemap";
import { generateNoxionRobots } from "../robots";
import { generateBlogPostingLD, generateTechArticleLD, generateCreativeWorkLD, generatePageLD, generateWebSiteLD } from "../structured-data";
import type { NoxionConfig, NoxionPage, BlogPage, DocsPage, PortfolioPage } from "@noxion/core";

const stubConfig: NoxionConfig = {
  rootNotionPageId: "test-page-id",
  name: "Test Blog",
  domain: "test.com",
  author: "Test Author",
  description: "A test blog",
  language: "en",
  defaultTheme: "system",
  defaultPageType: "blog",
  revalidate: 3600,
};

const stubBlogPage: BlogPage = {
  id: "post-1",
  title: "My First Post",
  slug: "my-first-post",
  pageType: "blog",
  published: true,
  lastEditedTime: "2024-01-15T10:00:00.000Z",
  coverImage: "https://example.com/cover.jpg",
  metadata: {
    date: "2024-01-15",
    tags: ["react", "typescript"],
    category: "Frontend",
    author: undefined,
  },
};

const stubDocsPage: DocsPage = {
  id: "doc-1",
  title: "Getting Started",
  slug: "getting-started",
  pageType: "docs",
  published: true,
  lastEditedTime: "2024-02-01T10:00:00.000Z",
  description: "Learn how to get started with Noxion",
  metadata: {
    section: "Introduction",
    version: "0.2",
  },
};

const stubPortfolioPage: PortfolioPage = {
  id: "proj-1",
  title: "My App",
  slug: "my-app",
  pageType: "portfolio",
  published: true,
  lastEditedTime: "2024-03-01T10:00:00.000Z",
  description: "A cool app I built",
  coverImage: "https://example.com/project.jpg",
  metadata: {
    projectUrl: "https://myapp.com",
    technologies: ["React", "Node.js"],
    year: "2024",
    featured: true,
  },
};

describe("generateNoxionMetadata — blog", () => {
  it("generates title from page", () => {
    const meta = generateNoxionMetadata(stubBlogPage, stubConfig);
    expect(meta.title).toBe("My First Post | Test Blog");
  });

  it("generates description from page title when no custom desc", () => {
    const meta = generateNoxionMetadata(stubBlogPage, stubConfig);
    expect(meta.description).toBeDefined();
  });

  it("includes Open Graph metadata with article type for blog", () => {
    const meta = generateNoxionMetadata(stubBlogPage, stubConfig);
    const og = meta.openGraph as Record<string, unknown>;
    expect(og).toBeDefined();
    expect(og.title).toBe("My First Post");
    expect(og.type).toBe("article");
    expect(og.url).toContain("my-first-post");
  });

  it("includes Twitter card metadata", () => {
    const meta = generateNoxionMetadata(stubBlogPage, stubConfig);
    const tw = meta.twitter as Record<string, unknown>;
    expect(tw).toBeDefined();
    expect(tw.card).toBe("summary_large_image");
  });

  it("includes cover image in OG when available", () => {
    const meta = generateNoxionMetadata(stubBlogPage, stubConfig);
    expect(meta.openGraph!.images).toBeDefined();
  });

  it("generates canonical URL", () => {
    const meta = generateNoxionMetadata(stubBlogPage, stubConfig);
    expect(meta.alternates?.canonical).toContain("test.com");
    expect(meta.alternates?.canonical).toContain("my-first-post");
  });
});

describe("generateNoxionMetadata — docs", () => {
  it("uses website OG type for docs", () => {
    const meta = generateNoxionMetadata(stubDocsPage, stubConfig);
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("website");
  });

  it("uses custom description", () => {
    const meta = generateNoxionMetadata(stubDocsPage, stubConfig);
    expect(meta.description).toContain("Learn how to get started");
  });
});

describe("generateNoxionMetadata — portfolio", () => {
  it("uses website OG type for portfolio", () => {
    const meta = generateNoxionMetadata(stubPortfolioPage, stubConfig);
    const og = meta.openGraph as Record<string, unknown>;
    expect(og.type).toBe("website");
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
  it("generates sitemap entries for pages", () => {
    const sitemap = generateNoxionSitemap([stubBlogPage], stubConfig);
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

  it("includes lastModified from page", () => {
    const sitemap = generateNoxionSitemap([stubBlogPage], stubConfig);
    const postEntry = sitemap.find((e) => e.url.includes("my-first-post"));
    expect(postEntry?.lastModified).toBeDefined();
  });

  it("uses route prefixes for docs pages", () => {
    const sitemap = generateNoxionSitemap([stubDocsPage], stubConfig, { docs: "/docs" });
    const docsEntry = sitemap.find((e) => e.url.includes("/docs/getting-started"));
    expect(docsEntry).toBeDefined();
  });

  it("assigns correct priorities per page type", () => {
    const sitemap = generateNoxionSitemap(
      [stubBlogPage, stubDocsPage, stubPortfolioPage],
      stubConfig
    );
    const blog = sitemap.find((e) => e.url.includes("my-first-post"));
    const docs = sitemap.find((e) => e.url.includes("getting-started"));
    const portfolio = sitemap.find((e) => e.url.includes("my-app"));
    expect(blog?.priority).toBe(0.8);
    expect(docs?.priority).toBe(0.7);
    expect(portfolio?.priority).toBe(0.6);
  });

  it("extracts tags from metadata for tag pages", () => {
    const sitemap = generateNoxionSitemap([stubBlogPage], stubConfig);
    const reactTag = sitemap.find((e) => e.url.includes("tag/react"));
    const tsTag = sitemap.find((e) => e.url.includes("tag/typescript"));
    expect(reactTag).toBeDefined();
    expect(tsTag).toBeDefined();
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
    const ld = generateBlogPostingLD(stubBlogPage, stubConfig);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld.headline).toBe("My First Post");
    expect(ld.author).toBeDefined();
    expect(ld.datePublished).toBe("2024-01-15T00:00:00.000Z");
  });

  it("includes image when cover is present", () => {
    const ld = generateBlogPostingLD(stubBlogPage, stubConfig);
    expect((ld.image as { url: string }).url).toBe("https://example.com/cover.jpg");
  });

  it("includes keywords from tags", () => {
    const ld = generateBlogPostingLD(stubBlogPage, stubConfig);
    expect(ld.keywords).toBe("react, typescript");
  });

  it("includes articleSection from category", () => {
    const ld = generateBlogPostingLD(stubBlogPage, stubConfig);
    expect(ld.articleSection).toBe("Frontend");
  });
});

describe("generateTechArticleLD", () => {
  it("returns TechArticle JSON-LD for docs", () => {
    const ld = generateTechArticleLD(stubDocsPage, stubConfig);
    expect(ld["@type"]).toBe("TechArticle");
    expect(ld.headline).toBe("Getting Started");
    expect(ld.url).toContain("/docs/getting-started");
  });

  it("includes articleSection from docs section", () => {
    const ld = generateTechArticleLD(stubDocsPage, stubConfig);
    expect(ld.articleSection).toBe("Introduction");
  });
});

describe("generateCreativeWorkLD", () => {
  it("returns CreativeWork JSON-LD for portfolio", () => {
    const ld = generateCreativeWorkLD(stubPortfolioPage, stubConfig);
    expect(ld["@type"]).toBe("CreativeWork");
    expect(ld.name).toBe("My App");
    expect(ld.url).toContain("/projects/my-app");
  });

  it("includes technologies as keywords", () => {
    const ld = generateCreativeWorkLD(stubPortfolioPage, stubConfig);
    expect(ld.keywords).toBe("React, Node.js");
  });

  it("includes project URL", () => {
    const ld = generateCreativeWorkLD(stubPortfolioPage, stubConfig);
    expect(ld.mainEntityOfPage).toBe("https://myapp.com");
  });
});

describe("generatePageLD", () => {
  it("dispatches to BlogPosting for blog pages", () => {
    const ld = generatePageLD(stubBlogPage, stubConfig);
    expect(ld["@type"]).toBe("BlogPosting");
  });

  it("dispatches to TechArticle for docs pages", () => {
    const ld = generatePageLD(stubDocsPage, stubConfig);
    expect(ld["@type"]).toBe("TechArticle");
  });

  it("dispatches to CreativeWork for portfolio pages", () => {
    const ld = generatePageLD(stubPortfolioPage, stubConfig);
    expect(ld["@type"]).toBe("CreativeWork");
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
