import { describe, it, expect } from "bun:test";
import type { NoxionPage, BlogPage, DocsPage, PortfolioPage } from "../types";
import { isBlogPage, isDocsPage, isPortfolioPage } from "../types";

describe("NoxionPage type guards", () => {
  it("isBlogPage identifies blog pages correctly", () => {
    const blogPage: BlogPage = {
      id: "page-1",
      title: "Test Blog Post",
      slug: "test-post",
      pageType: "blog",
      published: true,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {
        date: "2026-02-23",
        tags: ["test", "blog"],
        category: "Tech",
        author: "Test Author",
      },
    };

    expect(isBlogPage(blogPage)).toBe(true);
    expect(isDocsPage(blogPage)).toBe(false);
    expect(isPortfolioPage(blogPage)).toBe(false);
  });

  it("isDocsPage identifies docs pages correctly", () => {
    const docsPage: DocsPage = {
      id: "page-2",
      title: "Documentation Page",
      slug: "docs-page",
      pageType: "docs",
      published: true,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {
        section: "Getting Started",
        version: "1.0",
      },
      parent: "parent-page-id",
      order: 1,
    };

    expect(isDocsPage(docsPage)).toBe(true);
    expect(isBlogPage(docsPage)).toBe(false);
    expect(isPortfolioPage(docsPage)).toBe(false);
  });

  it("isPortfolioPage identifies portfolio pages correctly", () => {
    const portfolioPage: PortfolioPage = {
      id: "page-3",
      title: "My Project",
      slug: "my-project",
      pageType: "portfolio",
      published: true,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {
        projectUrl: "https://example.com",
        technologies: ["React", "TypeScript"],
        year: "2026",
        featured: true,
      },
    };

    expect(isPortfolioPage(portfolioPage)).toBe(true);
    expect(isBlogPage(portfolioPage)).toBe(false);
    expect(isDocsPage(portfolioPage)).toBe(false);
  });

  it("handles custom page types", () => {
    const customPage: NoxionPage = {
      id: "page-4",
      title: "Custom Page",
      slug: "custom",
      pageType: "gallery",
      published: true,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {
        images: ["img1.jpg", "img2.jpg"],
      },
    };

    expect(isBlogPage(customPage)).toBe(false);
    expect(isDocsPage(customPage)).toBe(false);
    expect(isPortfolioPage(customPage)).toBe(false);
  });

  it("BlogPage satisfies NoxionPage interface", () => {
    const blogPage: BlogPage = {
      id: "page-5",
      title: "Type Check Test",
      slug: "type-check",
      pageType: "blog",
      published: true,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {
        date: "2026-02-23",
        tags: [],
      },
    };

    const asNoxionPage: NoxionPage = blogPage;
    expect(asNoxionPage.pageType).toBe("blog");
  });

  it("supports optional fields", () => {
    const minimalPage: NoxionPage = {
      id: "page-6",
      title: "Minimal",
      slug: "minimal",
      pageType: "blog",
      published: false,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {},
    };

    expect(minimalPage.coverImage).toBeUndefined();
    expect(minimalPage.description).toBeUndefined();
    expect(minimalPage.frontmatter).toBeUndefined();
    expect(minimalPage.parent).toBeUndefined();
    expect(minimalPage.children).toBeUndefined();
    expect(minimalPage.order).toBeUndefined();
  });

  it("supports hierarchical structure", () => {
    const parentPage: DocsPage = {
      id: "parent",
      title: "Parent",
      slug: "parent",
      pageType: "docs",
      published: true,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {},
      children: ["child-1", "child-2"],
    };

    const childPage: DocsPage = {
      id: "child-1",
      title: "Child",
      slug: "child",
      pageType: "docs",
      published: true,
      lastEditedTime: "2026-02-23T00:00:00.000Z",
      metadata: {},
      parent: "parent",
      order: 1,
    };

    expect(parentPage.children).toEqual(["child-1", "child-2"]);
    expect(childPage.parent).toBe("parent");
    expect(childPage.order).toBe(1);
  });
});
