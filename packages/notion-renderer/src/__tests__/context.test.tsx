import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import { NotionRendererProvider, useNotionRenderer, useNotionBlock } from "../context";
import type { NotionRendererContextValue } from "../types";
import type { ExtendedRecordMap, Block } from "notion-types";

function createMinimalRecordMap(blocks: Record<string, { value: Block }>): ExtendedRecordMap {
  return {
    block: blocks as ExtendedRecordMap["block"],
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  };
}

function createTextBlock(id: string, text: string): Block {
  return {
    id,
    type: "text",
    properties: { title: [[text]] },
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
  } as unknown as Block;
}

describe("NotionRendererProvider", () => {
  it("renders children", () => {
    const recordMap = createMinimalRecordMap({});
    const value: NotionRendererContextValue = {
      recordMap,
      plugins: [],
      mapPageUrl: (id) => `/${id}`,
      mapImageUrl: (url) => url,
      components: {},
      fullPage: true,
      darkMode: false,
      previewImages: false,
    };

    const html = renderToString(
      <NotionRendererProvider value={value}>
        <div data-testid="child">Hello</div>
      </NotionRendererProvider>
    );

    expect(html).toContain("Hello");
    expect(html).toContain('data-testid="child"');
  });
});

describe("useNotionRenderer", () => {
  it("returns context value with recordMap and config", () => {
    const recordMap = createMinimalRecordMap({});
    let captured: NotionRendererContextValue | null = null;

    function Consumer() {
      captured = useNotionRenderer();
      return <span>ok</span>;
    }

    renderToString(
      <NotionRendererProvider
        value={{
          recordMap,
          plugins: [],
          mapPageUrl: (id) => `/page/${id}`,
          mapImageUrl: (url) => url,
          components: {},
          fullPage: false,
          darkMode: true,
          previewImages: true,
        }}
      >
        <Consumer />
      </NotionRendererProvider>
    );

    expect(captured).not.toBeNull();
    expect(captured!.darkMode).toBe(true);
    expect(captured!.fullPage).toBe(false);
    expect(captured!.previewImages).toBe(true);
    expect(captured!.mapPageUrl("abc")).toBe("/page/abc");
  });
});

describe("useNotionBlock", () => {
  it("returns block by id from recordMap", () => {
    const block = createTextBlock("block-1", "Hello World");
    const recordMap = createMinimalRecordMap({
      "block-1": { value: block },
    });

    let captured: Block | undefined;

    function Consumer() {
      captured = useNotionBlock("block-1");
      return <span>ok</span>;
    }

    renderToString(
      <NotionRendererProvider
        value={{
          recordMap,
          plugins: [],
          mapPageUrl: (id) => `/${id}`,
          mapImageUrl: (url) => url,
          components: {},
          fullPage: true,
          darkMode: false,
          previewImages: false,
        }}
      >
        <Consumer />
      </NotionRendererProvider>
    );

    expect(captured).toBeDefined();
    expect(captured!.id).toBe("block-1");
    expect(captured!.type).toBe("text");
  });

  it("returns undefined for missing block id", () => {
    const recordMap = createMinimalRecordMap({});
    let captured: Block | undefined = undefined;

    function Consumer() {
      captured = useNotionBlock("nonexistent");
      return <span>ok</span>;
    }

    renderToString(
      <NotionRendererProvider
        value={{
          recordMap,
          plugins: [],
          mapPageUrl: (id) => `/${id}`,
          mapImageUrl: (url) => url,
          components: {},
          fullPage: true,
          darkMode: false,
          previewImages: false,
        }}
      >
        <Consumer />
      </NotionRendererProvider>
    );

    expect(captured).toBeUndefined();
  });

  it("unwraps boxed block values with role wrapper", () => {
    const block = createTextBlock("block-2", "Boxed");
    const recordMap = createMinimalRecordMap({
      "block-2": { value: { role: "reader", value: block } } as unknown as { value: Block },
    });

    let captured: Block | undefined;

    function Consumer() {
      captured = useNotionBlock("block-2");
      return <span>ok</span>;
    }

    renderToString(
      <NotionRendererProvider
        value={{
          recordMap,
          plugins: [],
          mapPageUrl: (id) => `/${id}`,
          mapImageUrl: (url) => url,
          components: {},
          fullPage: true,
          darkMode: false,
          previewImages: false,
        }}
      >
        <Consumer />
      </NotionRendererProvider>
    );

    expect(captured).toBeDefined();
    expect(captured!.id).toBe("block-2");
  });
});
