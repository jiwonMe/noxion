import { describe, it, expect } from "bun:test";
import { defineConfig, loadConfig } from "../config";
import type { NoxionConfig } from "../types";

describe("defineConfig", () => {
  it("returns the config object unchanged", () => {
    const input = {
      rootNotionPageId: "abc123",
      name: "My Blog",
      domain: "blog.example.com",
      author: "Test Author",
      description: "A test blog",
    };

    const result = defineConfig(input);
    expect(result).toEqual(input);
  });

  it("preserves all optional fields when provided", () => {
    const input = {
      rootNotionPageId: "abc123",
      rootNotionSpaceId: "space123",
      name: "My Blog",
      domain: "blog.example.com",
      author: "Test Author",
      description: "A test blog",
      language: "ko",
      defaultTheme: "dark" as const,
      revalidate: 1800,
      revalidateSecret: "secret-token",
    };

    const result = defineConfig(input);
    expect(result).toEqual(input);
  });
});

describe("loadConfig", () => {
  it("applies default values for language, defaultTheme, and defaultPageType", () => {
    const result = loadConfig({
      rootNotionPageId: "abc123",
      name: "My Blog",
      domain: "blog.example.com",
      author: "Test Author",
      description: "A test blog",
    });

    expect(result.language).toBe("en");
    expect(result.defaultTheme).toBe("system");
    expect(result.defaultPageType).toBe("blog");
    expect(result.revalidate).toBe(3600);
  });

  it("preserves user-provided values over defaults", () => {
    const result = loadConfig({
      rootNotionPageId: "abc123",
      name: "My Blog",
      domain: "blog.example.com",
      author: "Test Author",
      description: "A test blog",
      language: "ko",
      defaultTheme: "dark",
      revalidate: 1800,
    });

    expect(result.language).toBe("ko");
    expect(result.defaultTheme).toBe("dark");
    expect(result.revalidate).toBe(1800);
  });

  it("throws when neither rootNotionPageId nor collections is provided", () => {
    expect(() =>
      loadConfig({
        name: "My Blog",
        domain: "blog.example.com",
        author: "Test Author",
        description: "A test blog",
      })
    ).toThrow("Config must have either rootNotionPageId or collections");
  });

  it("throws when name is missing", () => {
    expect(() =>
      loadConfig({
        rootNotionPageId: "abc123",
        name: "",
        domain: "blog.example.com",
        author: "Test Author",
        description: "A test blog",
      })
    ).toThrow("name is required");
  });

  it("throws when domain is missing", () => {
    expect(() =>
      loadConfig({
        rootNotionPageId: "abc123",
        name: "My Blog",
        domain: "",
        author: "Test Author",
        description: "A test blog",
      })
    ).toThrow("domain is required");
  });

  it("returns a fully resolved NoxionConfig", () => {
    const result = loadConfig({
      rootNotionPageId: "abc123",
      name: "My Blog",
      domain: "blog.example.com",
      author: "Test Author",
      description: "A test blog",
    });

    expect(result.rootNotionPageId).toBe("abc123");
    expect(result.name).toBe("My Blog");
    expect(result.domain).toBe("blog.example.com");
    expect(result.author).toBe("Test Author");
    expect(result.description).toBe("A test blog");
  });

  it("auto-creates default blog collection in single-root mode", () => {
    const result = loadConfig({
      rootNotionPageId: "abc123",
      name: "My Blog",
      domain: "blog.example.com",
      author: "Test Author",
      description: "A test blog",
    });

    expect(result.collections).toBeDefined();
    expect(result.collections).toHaveLength(1);
    expect(result.collections![0].databaseId).toBe("abc123");
    expect(result.collections![0].pageType).toBe("blog");
    expect(result.collections![0].name).toBe("default");
  });

  it("auto-creates collection with custom defaultPageType", () => {
    const result = loadConfig({
      rootNotionPageId: "abc123",
      name: "My Docs",
      domain: "docs.example.com",
      author: "Test Author",
      description: "A docs site",
      defaultPageType: "docs",
    });

    expect(result.collections![0].pageType).toBe("docs");
    expect(result.defaultPageType).toBe("docs");
  });

  it("accepts collections config without rootNotionPageId", () => {
    const result = loadConfig({
      name: "My Website",
      domain: "example.com",
      author: "Test Author",
      description: "A website",
      collections: [
        { databaseId: "db-1", pageType: "blog", name: "blog" },
        { databaseId: "db-2", pageType: "docs", name: "docs" },
      ],
    });

    expect(result.rootNotionPageId).toBeUndefined();
    expect(result.collections).toHaveLength(2);
    expect(result.collections![0].pageType).toBe("blog");
    expect(result.collections![1].pageType).toBe("docs");
  });

  it("preserves explicit collections when rootNotionPageId is also present", () => {
    const result = loadConfig({
      rootNotionPageId: "abc123",
      name: "My Website",
      domain: "example.com",
      author: "Test Author",
      description: "A website",
      collections: [
        { databaseId: "db-1", pageType: "blog" },
        { databaseId: "db-2", pageType: "docs" },
      ],
    });

    expect(result.collections).toHaveLength(2);
    expect(result.collections![0].databaseId).toBe("db-1");
  });

  it("throws when collection is missing databaseId", () => {
    expect(() =>
      loadConfig({
        name: "My Website",
        domain: "example.com",
        author: "Test Author",
        description: "A website",
        collections: [
          { databaseId: "", pageType: "blog", name: "blog" },
        ],
      })
    ).toThrow('Collection "blog" is missing databaseId');
  });

  it("throws when collection is missing pageType", () => {
    expect(() =>
      loadConfig({
        name: "My Website",
        domain: "example.com",
        author: "Test Author",
        description: "A website",
        collections: [
          { databaseId: "db-1", pageType: "", name: "docs" },
        ],
      })
    ).toThrow('Collection "docs" is missing pageType');
  });

  it("uses index as label when collection has no name", () => {
    expect(() =>
      loadConfig({
        name: "My Website",
        domain: "example.com",
        author: "Test Author",
        description: "A website",
        collections: [
          { databaseId: "", pageType: "blog" },
        ],
      })
    ).toThrow('Collection "collections[0]" is missing databaseId');
  });
});
