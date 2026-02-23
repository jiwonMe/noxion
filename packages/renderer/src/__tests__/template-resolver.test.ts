import { describe, it, expect } from "bun:test";
import { resolveTemplate } from "../theme/template-resolver";
import type { NoxionTemplateMap, NoxionTemplateProps } from "../theme/types";
import type { ComponentType } from "react";

describe("resolveTemplate", () => {
  const MockHome = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockPost = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockArchive = (() => null) as ComponentType<NoxionTemplateProps>;
  const FallbackTemplate = (() => null) as ComponentType<NoxionTemplateProps>;

  const templates: Partial<NoxionTemplateMap> = {
    home: MockHome,
    post: MockPost,
    archive: MockArchive,
  };

  it("returns matching template for page type", () => {
    expect(resolveTemplate(templates, "home")).toBe(MockHome);
    expect(resolveTemplate(templates, "post")).toBe(MockPost);
    expect(resolveTemplate(templates, "archive")).toBe(MockArchive);
  });

  it("returns fallback when page type not found", () => {
    const result = resolveTemplate(templates, "unknown", FallbackTemplate);
    expect(result).toBe(FallbackTemplate);
  });

  it("falls back to home template when no fallback provided", () => {
    const result = resolveTemplate(templates, "unknown");
    expect(result).toBe(MockHome);
  });

  it("returns undefined when no match, no fallback, and no home template", () => {
    const result = resolveTemplate({}, "unknown");
    expect(result).toBeUndefined();
  });

  it("prefers explicit fallback over home template", () => {
    const result = resolveTemplate(templates, "unknown", FallbackTemplate);
    expect(result).toBe(FallbackTemplate);
  });
});

describe("resolveTemplate — namespaced keys", () => {
  const MockHome = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockBlogPost = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockDocsPage = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockPortfolioGrid = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockPortfolioProject = (() => null) as ComponentType<NoxionTemplateProps>;

  const namespacedTemplates: Partial<NoxionTemplateMap> = {
    home: MockHome,
    "blog/post": MockBlogPost,
    "docs/page": MockDocsPage,
    "portfolio/grid": MockPortfolioGrid,
    "portfolio/project": MockPortfolioProject,
  };

  it("resolves namespaced template directly", () => {
    expect(resolveTemplate(namespacedTemplates, "blog/post")).toBe(MockBlogPost);
    expect(resolveTemplate(namespacedTemplates, "docs/page")).toBe(MockDocsPage);
    expect(resolveTemplate(namespacedTemplates, "portfolio/grid")).toBe(MockPortfolioGrid);
  });

  it("resolves legacy 'post' to namespaced 'blog/post'", () => {
    expect(resolveTemplate(namespacedTemplates, "post")).toBe(MockBlogPost);
  });

  it("resolves legacy 'home' directly when it exists", () => {
    expect(resolveTemplate(namespacedTemplates, "home")).toBe(MockHome);
  });

  it("resolves namespaced 'blog/post' to legacy 'post' when only legacy exists", () => {
    const legacyOnly: Partial<NoxionTemplateMap> = {
      home: MockHome,
      post: MockBlogPost,
    };
    expect(resolveTemplate(legacyOnly, "blog/post")).toBe(MockBlogPost);
  });

  it("falls back from namespaced to generic basename", () => {
    const withGenericPage: Partial<NoxionTemplateMap> = {
      home: MockHome,
      page: MockDocsPage,
    };
    expect(resolveTemplate(withGenericPage, "docs/page")).toBe(MockDocsPage);
  });

  it("falls back from unknown namespaced to generic basename", () => {
    const withGenericGrid: Partial<NoxionTemplateMap> = {
      home: MockHome,
      grid: MockPortfolioGrid,
    };
    expect(resolveTemplate(withGenericGrid, "portfolio/grid")).toBe(MockPortfolioGrid);
  });

  it("falls back to home when namespaced template and basename not found", () => {
    const homeOnly: Partial<NoxionTemplateMap> = {
      home: MockHome,
    };
    expect(resolveTemplate(homeOnly, "docs/sidebar")).toBe(MockHome);
  });

  it("falls back to explicit fallback over home for unknown namespaced", () => {
    const FallbackTemplate = (() => null) as ComponentType<NoxionTemplateProps>;
    const homeOnly: Partial<NoxionTemplateMap> = {
      home: MockHome,
    };
    expect(resolveTemplate(homeOnly, "docs/sidebar", FallbackTemplate)).toBe(FallbackTemplate);
  });

  it("handles mixed legacy and namespaced templates", () => {
    const mixed: Partial<NoxionTemplateMap> = {
      home: MockHome,
      post: MockBlogPost,
      "docs/page": MockDocsPage,
      "portfolio/grid": MockPortfolioGrid,
    };
    expect(resolveTemplate(mixed, "post")).toBe(MockBlogPost);
    expect(resolveTemplate(mixed, "blog/post")).toBe(MockBlogPost);
    expect(resolveTemplate(mixed, "docs/page")).toBe(MockDocsPage);
    expect(resolveTemplate(mixed, "portfolio/grid")).toBe(MockPortfolioGrid);
  });
});
