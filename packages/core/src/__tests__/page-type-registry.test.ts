import { describe, it, expect } from "bun:test";
import { PageTypeRegistry, createPageTypeRegistry } from "../page-type-registry";
import type { PageTypeDefinition } from "../types";

describe("PageTypeRegistry", () => {
  it("registers and retrieves a page type definition", () => {
    const registry = new PageTypeRegistry();
    const definition: PageTypeDefinition = {
      name: "gallery",
      defaultTemplate: "gallery/grid",
      defaultLayout: "single-column",
    };

    registry.register(definition);

    expect(registry.get("gallery")).toEqual(definition);
    expect(registry.has("gallery")).toBe(true);
  });

  it("returns undefined for unregistered page type", () => {
    const registry = new PageTypeRegistry();
    expect(registry.get("nonexistent")).toBeUndefined();
    expect(registry.has("nonexistent")).toBe(false);
  });

  it("overwrites existing definition on duplicate registration", () => {
    const registry = new PageTypeRegistry();
    registry.register({ name: "gallery", defaultTemplate: "v1" });
    registry.register({ name: "gallery", defaultTemplate: "v2" });

    expect(registry.get("gallery")?.defaultTemplate).toBe("v2");
  });

  it("returns all registered definitions", () => {
    const registry = new PageTypeRegistry();
    registry.register({ name: "wiki" });
    registry.register({ name: "gallery" });
    registry.register({ name: "changelog" });

    const all = registry.getAll();
    expect(all).toHaveLength(3);
    expect(all.map(d => d.name).sort()).toEqual(["changelog", "gallery", "wiki"]);
  });

  it("returns all registered names", () => {
    const registry = new PageTypeRegistry();
    registry.register({ name: "wiki" });
    registry.register({ name: "gallery" });

    expect(registry.names().sort()).toEqual(["gallery", "wiki"]);
  });
});

describe("createPageTypeRegistry", () => {
  it("creates registry with built-in page types", () => {
    const registry = createPageTypeRegistry();

    expect(registry.has("blog")).toBe(true);
    expect(registry.has("docs")).toBe(true);
    expect(registry.has("portfolio")).toBe(true);
  });

  it("built-in blog type has correct defaults", () => {
    const registry = createPageTypeRegistry();
    const blog = registry.get("blog");

    expect(blog?.defaultTemplate).toBe("blog/post");
    expect(blog?.defaultLayout).toBe("single-column");
  });

  it("built-in docs type has sidebar-left layout", () => {
    const registry = createPageTypeRegistry();
    const docs = registry.get("docs");

    expect(docs?.defaultTemplate).toBe("docs/page");
    expect(docs?.defaultLayout).toBe("sidebar-left");
  });

  it("allows registering additional types alongside built-ins", () => {
    const registry = createPageTypeRegistry();
    registry.register({ name: "wiki", defaultTemplate: "wiki/page" });

    expect(registry.has("blog")).toBe(true);
    expect(registry.has("wiki")).toBe(true);
    expect(registry.getAll()).toHaveLength(4);
  });
});
