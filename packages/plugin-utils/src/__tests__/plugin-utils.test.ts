import { describe, it, expect, beforeEach } from "bun:test";
import {
  createMockPage,
  createMockBlogPage,
  createMockDocsPage,
  createMockPortfolioPage,
  createMockPages,
  createMockBlogPages,
  resetMockCounter,
  createTestConfig,
  createTestPlugin,
  validatePluginManifest,
  pluginManifestSchema,
} from "../index";

describe("mock-data", () => {
  beforeEach(() => {
    resetMockCounter();
  });

  describe("createMockPage", () => {
    it("creates a page with default values", () => {
      const page = createMockPage();
      expect(page.id).toBe("mock-1");
      expect(page.title).toBe("Mock Page mock-1");
      expect(page.slug).toBe("mock-page-mock-1");
      expect(page.pageType).toBe("blog");
      expect(page.published).toBe(true);
      expect(page.lastEditedTime).toBeTruthy();
      expect(page.metadata).toEqual({});
    });

    it("applies overrides", () => {
      const page = createMockPage({
        title: "Custom Title",
        pageType: "docs",
        published: false,
      });
      expect(page.title).toBe("Custom Title");
      expect(page.pageType).toBe("docs");
      expect(page.published).toBe(false);
    });

    it("increments IDs across calls", () => {
      const a = createMockPage();
      const b = createMockPage();
      expect(a.id).toBe("mock-1");
      expect(b.id).toBe("mock-2");
    });
  });

  describe("createMockBlogPage", () => {
    it("creates a blog page with typed metadata", () => {
      const page = createMockBlogPage();
      expect(page.pageType).toBe("blog");
      expect(page.metadata.date).toBe("2024-01-15");
      expect(page.metadata.tags).toEqual(["test"]);
      expect(page.metadata.category).toBeUndefined();
      expect(page.metadata.author).toBeUndefined();
    });

    it("merges metadata overrides without losing defaults", () => {
      const page = createMockBlogPage({
        metadata: { category: "tech", tags: ["ts", "react"] },
      });
      expect(page.metadata.date).toBe("2024-01-15");
      expect(page.metadata.category).toBe("tech");
      expect(page.metadata.tags).toEqual(["ts", "react"]);
    });

    it("applies non-metadata overrides", () => {
      const page = createMockBlogPage({ title: "My Post", published: false });
      expect(page.title).toBe("My Post");
      expect(page.published).toBe(false);
    });
  });

  describe("createMockDocsPage", () => {
    it("creates a docs page with typed metadata", () => {
      const page = createMockDocsPage();
      expect(page.pageType).toBe("docs");
      expect(page.metadata.section).toBeUndefined();
      expect(page.metadata.version).toBeUndefined();
      expect(page.metadata.editUrl).toBeUndefined();
    });

    it("merges metadata overrides", () => {
      const page = createMockDocsPage({
        metadata: { section: "Getting Started", version: "2.0" },
      });
      expect(page.metadata.section).toBe("Getting Started");
      expect(page.metadata.version).toBe("2.0");
    });
  });

  describe("createMockPortfolioPage", () => {
    it("creates a portfolio page with typed metadata", () => {
      const page = createMockPortfolioPage();
      expect(page.pageType).toBe("portfolio");
      expect(page.metadata.projectUrl).toBeUndefined();
      expect(page.metadata.technologies).toBeUndefined();
      expect(page.metadata.year).toBeUndefined();
      expect(page.metadata.featured).toBeUndefined();
    });

    it("merges metadata overrides", () => {
      const page = createMockPortfolioPage({
        metadata: {
          technologies: ["React", "Node"],
          featured: true,
          year: "2024",
        },
      });
      expect(page.metadata.technologies).toEqual(["React", "Node"]);
      expect(page.metadata.featured).toBe(true);
      expect(page.metadata.year).toBe("2024");
    });
  });

  describe("createMockPages", () => {
    it("creates N pages", () => {
      const pages = createMockPages(5);
      expect(pages).toHaveLength(5);
      expect(pages[0].id).toBe("mock-1");
      expect(pages[4].id).toBe("mock-5");
    });

    it("applies overrides to all pages", () => {
      const pages = createMockPages(3, { pageType: "docs" });
      for (const p of pages) {
        expect(p.pageType).toBe("docs");
      }
    });
  });

  describe("createMockBlogPages", () => {
    it("creates N blog pages", () => {
      const pages = createMockBlogPages(3);
      expect(pages).toHaveLength(3);
      for (const p of pages) {
        expect(p.pageType).toBe("blog");
        expect(p.metadata.date).toBeTruthy();
        expect(p.metadata.tags).toBeTruthy();
      }
    });
  });

  describe("resetMockCounter", () => {
    it("resets the counter so IDs start from 1 again", () => {
      createMockPage();
      createMockPage();
      resetMockCounter();
      const page = createMockPage();
      expect(page.id).toBe("mock-1");
    });
  });
});

describe("test-helpers", () => {
  describe("createTestConfig", () => {
    it("returns a valid config with defaults", () => {
      const config = createTestConfig();
      expect(config.rootNotionPageId).toBe("test-root-page-id");
      expect(config.name).toBe("Test Site");
      expect(config.domain).toBe("test.example.com");
      expect(config.author).toBe("Test Author");
      expect(config.language).toBe("en");
      expect(config.defaultPageType).toBe("blog");
      expect(config.revalidate).toBe(3600);
    });

    it("applies overrides", () => {
      const config = createTestConfig({
        name: "My Site",
        defaultPageType: "docs",
        revalidate: 600,
      });
      expect(config.name).toBe("My Site");
      expect(config.defaultPageType).toBe("docs");
      expect(config.revalidate).toBe(600);
      expect(config.domain).toBe("test.example.com");
    });
  });

  describe("createTestPlugin", () => {
    it("returns a minimal plugin with default name", () => {
      const plugin = createTestPlugin();
      expect(plugin.name).toBe("test-plugin");
    });

    it("applies name and hook overrides", () => {
      const plugin = createTestPlugin({
        name: "my-plugin",
        transformPosts: ({ posts }) => posts,
      });
      expect(plugin.name).toBe("my-plugin");
      expect(plugin.transformPosts).toBeDefined();
    });
  });
});

describe("manifest", () => {
  const validManifest = {
    name: "noxion-plugin-reading-time",
    description: "Adds estimated reading time to posts",
    version: "1.0.0",
    noxion: ">=0.2.0",
  };

  describe("pluginManifestSchema", () => {
    it("defines required fields", () => {
      expect(pluginManifestSchema.required).toEqual([
        "name",
        "description",
        "version",
        "noxion",
      ]);
    });

    it("defines all expected properties", () => {
      const keys = Object.keys(pluginManifestSchema.properties);
      expect(keys).toContain("name");
      expect(keys).toContain("hooks");
      expect(keys).toContain("pageTypes");
      expect(keys).toContain("hasConfig");
      expect(keys).toContain("keywords");
    });
  });

  describe("validatePluginManifest", () => {
    it("validates a correct manifest", () => {
      const result = validatePluginManifest(validManifest);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("validates a manifest with all optional fields", () => {
      const full = {
        ...validManifest,
        author: "Test Author",
        homepage: "https://github.com/test/plugin",
        license: "MIT",
        hooks: ["transformPosts", "extendSlots"],
        pageTypes: ["blog"],
        hasConfig: true,
        keywords: ["reading-time", "blog"],
      };
      const result = validatePluginManifest(full);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it("rejects null", () => {
      const result = validatePluginManifest(null);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain("Manifest must be a non-null object");
    });

    it("rejects non-object", () => {
      const result = validatePluginManifest("string");
      expect(result.valid).toBe(false);
    });

    it("requires name field", () => {
      const { name: _, ...rest } = validManifest;
      const result = validatePluginManifest(rest);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"name"'))).toBe(true);
    });

    it("requires description field", () => {
      const { description: _, ...rest } = validManifest;
      const result = validatePluginManifest(rest);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"description"'))).toBe(true);
    });

    it("requires version field", () => {
      const { version: _, ...rest } = validManifest;
      const result = validatePluginManifest(rest);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"version"'))).toBe(true);
    });

    it("requires noxion field", () => {
      const { noxion: _, ...rest } = validManifest;
      const result = validatePluginManifest(rest);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"noxion"'))).toBe(true);
    });

    it("rejects empty required fields", () => {
      const result = validatePluginManifest({ ...validManifest, name: "  " });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"name"'))).toBe(true);
    });

    it("rejects non-string author", () => {
      const result = validatePluginManifest({ ...validManifest, author: 42 });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"author"'))).toBe(true);
    });

    it("rejects non-boolean hasConfig", () => {
      const result = validatePluginManifest({ ...validManifest, hasConfig: "yes" });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"hasConfig"'))).toBe(true);
    });

    it("rejects non-array hooks", () => {
      const result = validatePluginManifest({ ...validManifest, hooks: "transformPosts" });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"hooks"'))).toBe(true);
    });

    it("rejects hooks with non-string entries", () => {
      const result = validatePluginManifest({ ...validManifest, hooks: [1, 2] });
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('"hooks"'))).toBe(true);
    });

    it("rejects non-array pageTypes", () => {
      const result = validatePluginManifest({ ...validManifest, pageTypes: "blog" });
      expect(result.valid).toBe(false);
    });

    it("rejects non-array keywords", () => {
      const result = validatePluginManifest({ ...validManifest, keywords: 123 });
      expect(result.valid).toBe(false);
    });

    it("collects multiple errors at once", () => {
      const result = validatePluginManifest({});
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(4);
    });
  });
});
