import { describe, it, expect } from "bun:test";
import { buildPropertyMapping, getMetadataConventions } from "../schema-mapper";
import type { CollectionPropertySchemaMap } from "notion-types";

function createSchema(entries: Array<{ key: string; name: string; type: string }>): CollectionPropertySchemaMap {
  const schema: Record<string, { name: string; type: string }> = {};
  for (const { key, name, type } of entries) {
    schema[key] = { name, type };
  }
  return schema as CollectionPropertySchemaMap;
}

describe("buildPropertyMapping", () => {
  it("maps blog schema properties by convention", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
      { key: "prop-slug", name: "Slug", type: "text" },
      { key: "prop-date", name: "Date", type: "date" },
      { key: "prop-tags", name: "Tags", type: "multi_select" },
      { key: "prop-cat", name: "Category", type: "select" },
      { key: "prop-pub", name: "Published", type: "checkbox" },
      { key: "prop-desc", name: "Description", type: "text" },
      { key: "prop-author", name: "Author", type: "text" },
    ]);

    const mapping = buildPropertyMapping(schema, "blog");

    expect(mapping.titleKey).toBe("title");
    expect(mapping.slugKey).toBe("prop-slug");
    expect(mapping.dateKey).toBe("prop-date");
    expect(mapping.publishedKey).toBe("prop-pub");
    expect(mapping.descriptionKey).toBe("prop-desc");
    expect(mapping.authorKey).toBe("prop-author");
    expect(mapping.metadataKeys.tags).toBe("prop-tags");
    expect(mapping.metadataKeys.category).toBe("prop-cat");
  });

  it("maps docs schema properties by convention", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
      { key: "prop-section", name: "Section", type: "select" },
      { key: "prop-order", name: "Order", type: "number" },
      { key: "prop-version", name: "Version", type: "text" },
      { key: "prop-pub", name: "Public", type: "checkbox" },
    ]);

    const mapping = buildPropertyMapping(schema, "docs");

    expect(mapping.titleKey).toBe("title");
    expect(mapping.publishedKey).toBe("prop-pub");
    expect(mapping.metadataKeys.section).toBe("prop-section");
    expect(mapping.metadataKeys.order).toBe("prop-order");
    expect(mapping.metadataKeys.version).toBe("prop-version");
  });

  it("maps portfolio schema properties by convention", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
      { key: "prop-tech", name: "Technologies", type: "multi_select" },
      { key: "prop-url", name: "URL", type: "url" },
      { key: "prop-year", name: "Year", type: "text" },
      { key: "prop-feat", name: "Featured", type: "checkbox" },
      { key: "prop-pub", name: "Published", type: "checkbox" },
    ]);

    const mapping = buildPropertyMapping(schema, "portfolio");

    expect(mapping.titleKey).toBe("title");
    expect(mapping.metadataKeys.technologies).toBe("prop-tech");
    expect(mapping.metadataKeys.projectUrl).toBe("prop-url");
    expect(mapping.metadataKeys.year).toBe("prop-year");
    expect(mapping.metadataKeys.featured).toBe("prop-feat");
  });

  it("detects Type select property for single-DB mode", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
      { key: "prop-type", name: "Type", type: "select" },
    ]);

    const mapping = buildPropertyMapping(schema, "blog");
    expect(mapping.typeKey).toBe("prop-type");
  });

  it("applies manual overrides", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
      { key: "prop-date", name: "Date", type: "date" },
    ]);

    const mapping = buildPropertyMapping(schema, "blog", {
      slug: "custom-slug-key",
      tags: "custom-tags-key",
    });

    expect(mapping.slugKey).toBe("custom-slug-key");
    expect(mapping.metadataKeys.tags).toBe("custom-tags-key");
  });

  it("returns null keys for missing properties", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
    ]);

    const mapping = buildPropertyMapping(schema, "blog");

    expect(mapping.titleKey).toBe("title");
    expect(mapping.slugKey).toBeNull();
    expect(mapping.dateKey).toBeNull();
    expect(mapping.publishedKey).toBeNull();
  });

  it("handles unknown page types with base conventions only", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
      { key: "prop-slug", name: "Slug", type: "text" },
      { key: "prop-custom", name: "Custom", type: "text" },
    ]);

    const mapping = buildPropertyMapping(schema, "custom-type");

    expect(mapping.titleKey).toBe("title");
    expect(mapping.slugKey).toBe("prop-slug");
    expect(Object.keys(mapping.metadataKeys)).toHaveLength(0);
  });

  it("matches Published checkbox for published key, not date", () => {
    const schema = createSchema([
      { key: "title", name: "Title", type: "title" },
      { key: "prop-pub-check", name: "Published", type: "checkbox" },
      { key: "prop-pub-date", name: "Published", type: "date" },
    ]);

    const mapping = buildPropertyMapping(schema, "blog");

    expect(mapping.publishedKey).toBe("prop-pub-check");
    expect(mapping.dateKey).toBe("prop-pub-date");
  });
});

describe("getMetadataConventions", () => {
  it("returns blog conventions for blog type", () => {
    const conventions = getMetadataConventions("blog");
    expect(conventions).toHaveProperty("tags");
    expect(conventions).toHaveProperty("category");
  });

  it("returns docs conventions for docs type", () => {
    const conventions = getMetadataConventions("docs");
    expect(conventions).toHaveProperty("section");
    expect(conventions).toHaveProperty("order");
    expect(conventions).toHaveProperty("version");
  });

  it("returns empty object for unknown page type", () => {
    const conventions = getMetadataConventions("unknown");
    expect(Object.keys(conventions)).toHaveLength(0);
  });
});
