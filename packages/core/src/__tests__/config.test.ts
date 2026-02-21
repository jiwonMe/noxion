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
  it("applies default values for language and defaultTheme", () => {
    const result = loadConfig({
      rootNotionPageId: "abc123",
      name: "My Blog",
      domain: "blog.example.com",
      author: "Test Author",
      description: "A test blog",
    });

    expect(result.language).toBe("en");
    expect(result.defaultTheme).toBe("system");
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

  it("throws when rootNotionPageId is missing", () => {
    expect(() =>
      loadConfig({
        rootNotionPageId: "",
        name: "My Blog",
        domain: "blog.example.com",
        author: "Test Author",
        description: "A test blog",
      })
    ).toThrow("rootNotionPageId is required");
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
});
