import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import type { CollectionViewExtensionPoint } from "../blocks/collection-view";

function makeBlock(id: string, type: string, overrides: Partial<Block> = {}): Block {
  return {
    id,
    type,
    properties: {},
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
    ...overrides,
  } as unknown as Block;
}

function makePageBlock(id: string, childIds: string[]): Block {
  return makeBlock(id, "page", {
    content: childIds,
    properties: { title: [["Test Page"]] },
    format: { page_full_width: false, page_small_text: false, page_cover_position: 0.5 },
  });
}

function createRecordMap(input: {
  blocks: Record<string, { value: Block }>;
  collection?: Record<string, { value: unknown }>;
  collectionView?: Record<string, { value: unknown }>;
  collectionQuery?: Record<string, Record<string, unknown>>;
}): ExtendedRecordMap {
  return {
    block: input.blocks,
    collection: input.collection ?? {},
    collection_view: input.collectionView ?? {},
    collection_query: input.collectionQuery ?? {},
    notion_user: {},
    signed_urls: {},
  } as unknown as ExtendedRecordMap;
}

function renderWithRecordMap(recordMap: ExtendedRecordMap): string {
  return renderToString(<NotionRenderer recordMap={recordMap} />);
}

describe("CollectionViewBlock", () => {
  it("renders table with correct column headers from schema", () => {
    const page = makePageBlock("page-1", ["cv-1"]);
    const cv = makeBlock("cv-1", "collection_view", {
      collection_id: "col-1",
      view_ids: ["view-1"],
    } as Partial<Block>);
    const row = makeBlock("row-1", "page", {
      properties: {
        title: [["Row 1 Title"]],
        "prop-status": [["active-id"]],
      },
    });

    const recordMap = createRecordMap({
      blocks: {
        "page-1": { value: page },
        "cv-1": { value: cv },
        "row-1": { value: row },
      },
      collection: {
        "col-1": {
          value: {
            schema: {
              title: { name: "Name", type: "title" },
              "prop-status": {
                name: "Status",
                type: "select",
                options: [{ id: "active-id", value: "Active" }],
              },
            },
          },
        },
      },
      collectionView: {
        "view-1": {
          value: {
            type: "table",
            format: {
              table_properties: [
                { property: "title", visible: true, width: 200 },
                { property: "prop-status", visible: true, width: 100 },
              ],
            },
          },
        },
      },
      collectionQuery: {
        "col-1": {
          "view-1": {
            blockIds: ["row-1"],
          },
        },
      },
    });

    const html = renderWithRecordMap(recordMap);
    expect(html).toContain("<table");
    expect(html).toContain("noxion-collection-view");
    expect(html).toContain("<thead");
    expect(html).toContain("Name");
    expect(html).toContain("Status");
    expect(html).toContain("Row 1 Title");
    expect(html).toContain("Active");
  });

  it("renders rows from collection query data", () => {
    const page = makePageBlock("page-1", ["cv-1"]);
    const cv = makeBlock("cv-1", "collection_view", {
      collection_id: "col-1",
      view_ids: ["view-1"],
    } as Partial<Block>);
    const row1 = makeBlock("row-1", "page", { properties: { title: [["Row 1"]] } });
    const row2 = makeBlock("row-2", "page", { properties: { title: [["Row 2"]] } });

    const recordMap = createRecordMap({
      blocks: {
        "page-1": { value: page },
        "cv-1": { value: cv },
        "row-1": { value: row1 },
        "row-2": { value: row2 },
      },
      collection: {
        "col-1": { value: { schema: { title: { name: "Name", type: "title" } } } },
      },
      collectionView: {
        "view-1": {
          value: {
            type: "table",
            format: {
              table_properties: [{ property: "title", visible: true, width: 200 }],
            },
          },
        },
      },
      collectionQuery: {
        "col-1": {
          "view-1": {
            collection_group_results: { blockIds: ["row-1", "row-2"] },
          },
        },
      },
    });

    const html = renderWithRecordMap(recordMap);
    expect(html).toContain("Row 1");
    expect(html).toContain("Row 2");
  });

  it("empty collection shows empty placeholder", () => {
    const page = makePageBlock("page-1", ["cv-1"]);
    const cv = makeBlock("cv-1", "collection_view", {
      collection_id: "col-1",
      view_ids: ["view-1"],
    } as Partial<Block>);

    const recordMap = createRecordMap({
      blocks: {
        "page-1": { value: page },
        "cv-1": { value: cv },
      },
      collection: {
        "col-1": { value: { schema: { title: { name: "Name", type: "title" } } } },
      },
      collectionView: {
        "view-1": {
          value: {
            type: "table",
            format: {
              table_properties: [{ property: "title", visible: true, width: 200 }],
            },
          },
        },
      },
      collectionQuery: {
        "col-1": {
          "view-1": { blockIds: [] },
        },
      },
    });

    const html = renderWithRecordMap(recordMap);
    expect(html).toContain("noxion-collection-view__empty");
    expect(html).toContain("No items");
  });

  it("missing collection data falls back to placeholder", () => {
    const page = makePageBlock("page-1", ["cv-1"]);
    const cv = makeBlock("cv-1", "collection_view", {
      collection_id: "missing-col",
      view_ids: ["missing-view"],
    } as Partial<Block>);

    const recordMap = createRecordMap({
      blocks: {
        "page-1": { value: page },
        "cv-1": { value: cv },
      },
    });

    const html = renderWithRecordMap(recordMap);
    expect(html).toContain("noxion-collection-view-placeholder");
    expect(html).toContain("Database view");
  });

  it("checkbox column renders check and cross marks", () => {
    const page = makePageBlock("page-1", ["cv-1"]);
    const cv = makeBlock("cv-1", "collection_view", {
      collection_id: "col-1",
      view_ids: ["view-1"],
    } as Partial<Block>);
    const row1 = makeBlock("row-1", "page", { properties: { title: [["Yes"]] } });
    const row2 = makeBlock("row-2", "page", { properties: { title: [["No"]] } });

    const recordMap = createRecordMap({
      blocks: {
        "page-1": { value: page },
        "cv-1": { value: cv },
        "row-1": { value: row1 },
        "row-2": { value: row2 },
      },
      collection: {
        "col-1": { value: { schema: { title: { name: "Done", type: "checkbox" } } } },
      },
      collectionView: {
        "view-1": {
          value: {
            type: "table",
            format: {
              table_properties: [{ property: "title", visible: true, width: 120 }],
            },
          },
        },
      },
      collectionQuery: {
        "col-1": {
          "view-1": { blockIds: ["row-1", "row-2"] },
        },
      },
    });

    const html = renderWithRecordMap(recordMap);
    expect(html).toContain("✓");
    expect(html).toContain("✗");
  });

  it("select column renders option name", () => {
    const page = makePageBlock("page-1", ["cv-1"]);
    const cv = makeBlock("cv-1", "collection_view", {
      collection_id: "col-1",
      view_ids: ["view-1"],
    } as Partial<Block>);
    const row = makeBlock("row-1", "page", {
      properties: { title: [["opt-open"]] },
    });

    const recordMap = createRecordMap({
      blocks: {
        "page-1": { value: page },
        "cv-1": { value: cv },
        "row-1": { value: row },
      },
      collection: {
        "col-1": {
          value: {
            schema: {
              title: {
                name: "Status",
                type: "select",
                options: [{ id: "opt-open", value: "Open" }],
              },
            },
          },
        },
      },
      collectionView: {
        "view-1": {
          value: {
            type: "table",
            format: {
              table_properties: [{ property: "title", visible: true, width: 120 }],
            },
          },
        },
      },
      collectionQuery: {
        "col-1": {
          "view-1": { blockIds: ["row-1"] },
        },
      },
    });

    const html = renderWithRecordMap(recordMap);
    expect(html).toContain("Open");
  });

  it("url column renders as anchor tag", () => {
    const page = makePageBlock("page-1", ["cv-1"]);
    const cv = makeBlock("cv-1", "collection_view", {
      collection_id: "col-1",
      view_ids: ["view-1"],
    } as Partial<Block>);
    const row = makeBlock("row-1", "page", {
      properties: { title: [["https://example.com"]] },
    });

    const recordMap = createRecordMap({
      blocks: {
        "page-1": { value: page },
        "cv-1": { value: cv },
        "row-1": { value: row },
      },
      collection: {
        "col-1": { value: { schema: { title: { name: "Website", type: "url" } } } },
      },
      collectionView: {
        "view-1": {
          value: {
            type: "table",
            format: {
              table_properties: [{ property: "title", visible: true, width: 120 }],
            },
          },
        },
      },
      collectionQuery: {
        "col-1": {
          "view-1": { blockIds: ["row-1"] },
        },
      },
    });

    const html = renderWithRecordMap(recordMap);
    expect(html).toContain('<a href="https://example.com">https://example.com</a>');
  });

  it("CollectionViewExtensionPoint interface is exported", () => {
    const extensionPoint: CollectionViewExtensionPoint = {
      type: "table",
      render: () => null,
    };

    expect(extensionPoint.type).toBe("table");
    expect(
      extensionPoint.render({
        collectionId: "col-1",
        viewId: "view-1",
        schema: {},
        rows: [],
      })
    ).toBeNull();
  });
});
