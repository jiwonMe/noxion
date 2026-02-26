import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import React from "react";
import { createLazyBlock } from "../utils/lazy-block";
import type { NotionBlockProps } from "../types";

// Mock component for testing
function MockComponent({ block }: NotionBlockProps) {
  return <div className="mock-component">Mock Content</div>;
}

// Mock component with named export
function NamedExportComponent({ block }: NotionBlockProps) {
  return <div className="named-export-component">Named Export Content</div>;
}

describe("createLazyBlock", () => {
  it("returns a valid React component", () => {
    const LazyComponent = createLazyBlock(() =>
      Promise.resolve({ default: MockComponent })
    );

    expect(LazyComponent).toBeDefined();
    expect(typeof LazyComponent).toBe("function");
  });

  it("renders lazy component with Suspense fallback", async () => {
    const LazyComponent = createLazyBlock(() =>
      Promise.resolve({ default: MockComponent })
    );

    const mockBlock = {
      id: "test-1",
      type: "text",
      properties: { title: [["Test"]] },
      parent_id: "root",
      parent_table: "block",
      version: 1,
      created_time: Date.now(),
      last_edited_time: Date.now(),
      alive: true,
      created_by_table: "notion_user",
      created_by_id: "user1",
      last_edited_by_table: "notion_user",
      last_edited_by_id: "user1",
    } as any;

    const html = renderToString(
      <LazyComponent block={mockBlock} blockId="test-1" level={0} />
    );

    // Should contain either the mock content or loading placeholder
    expect(html).toBeDefined();
    expect(html.length > 0).toBe(true);
  });

  it("shows loading placeholder while module loads", async () => {
    let resolveImport: any;
    const importPromise = new Promise((resolve) => {
      resolveImport = resolve;
    });

    const LazyComponent = createLazyBlock(() =>
      importPromise as Promise<{ default: React.ComponentType<NotionBlockProps> }>
    );

    const mockBlock = {
      id: "test-2",
      type: "text",
      properties: { title: [["Test"]] },
      parent_id: "root",
      parent_table: "block",
      version: 1,
      created_time: Date.now(),
      last_edited_time: Date.now(),
      alive: true,
      created_by_table: "notion_user",
      created_by_id: "user1",
      last_edited_by_table: "notion_user",
      last_edited_by_id: "user1",
    } as any;

    const html = renderToString(
      <LazyComponent block={mockBlock} blockId="test-2" level={0} />
    );

    // Should contain loading placeholder class
    expect(html).toContain("noxion-loading-placeholder");
  });

  it("supports named exports via exportName parameter", () => {
    const LazyComponent = createLazyBlock(
      () =>
        Promise.resolve({
          default: MockComponent,
          NamedExport: NamedExportComponent,
        } as any),
      "NamedExport"
    );

    expect(LazyComponent).toBeDefined();
    expect(typeof LazyComponent).toBe("function");
  });

  it("handles import errors gracefully without crashing", async () => {
    const LazyComponent = createLazyBlock(() =>
      Promise.reject(new Error("Import failed"))
    );

    const mockBlock = {
      id: "test-3",
      type: "text",
      properties: { title: [["Test"]] },
      parent_id: "root",
      parent_table: "block",
      version: 1,
      created_time: Date.now(),
      last_edited_time: Date.now(),
      alive: true,
      created_by_table: "notion_user",
      created_by_id: "user1",
      last_edited_by_table: "notion_user",
      last_edited_by_id: "user1",
    } as any;

    // Should not throw
    expect(() => {
      renderToString(
        <LazyComponent block={mockBlock} blockId="test-3" level={0} />
      );
    }).not.toThrow();
  });

  it("accepts custom fallback component", () => {
    function CustomFallback() {
      return <div className="custom-loading">Custom Loading...</div>;
    }

    const LazyComponent = createLazyBlock(
      () => Promise.resolve({ default: MockComponent }),
      undefined,
      { fallback: <CustomFallback /> }
    );

    expect(LazyComponent).toBeDefined();
  });

  it("renders with default LoadingPlaceholder when no fallback provided", async () => {
    const LazyComponent = createLazyBlock(() =>
      Promise.resolve({ default: MockComponent })
    );

    const mockBlock = {
      id: "test-4",
      type: "text",
      properties: { title: [["Test"]] },
      parent_id: "root",
      parent_table: "block",
      version: 1,
      created_time: Date.now(),
      last_edited_time: Date.now(),
      alive: true,
      created_by_table: "notion_user",
      created_by_id: "user1",
      last_edited_by_table: "notion_user",
      last_edited_by_id: "user1",
    } as any;

    const html = renderToString(
      <LazyComponent block={mockBlock} blockId="test-4" level={0} />
    );

    // Should contain noxion-block-loading class from default placeholder
    expect(html).toContain("noxion-loading-placeholder");
  });
});
