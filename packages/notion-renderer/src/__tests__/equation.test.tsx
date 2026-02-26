import { describe, it, expect } from "bun:test";
import type React from "react";
import { renderToString } from "react-dom/server";
import { NotionRenderer } from "../renderer";
import { InlineEquation } from "../components/inline-equation";
import { NotionRendererProvider } from "../context";
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

function makeBlock(id: string, type: string, overrides: Record<string, unknown> = {}): Block {
  return {
    id,
    type,
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

function wrapInProvider(element: React.JSX.Element, recordMap?: ExtendedRecordMap) {
  const rm = recordMap ?? createMinimalRecordMap({});
  const value: NotionRendererContextValue = {
    recordMap: rm,
    plugins: [],
    mapPageUrl: (id) => `/${id}`,
    mapImageUrl: (url) => url,
    components: {},
    fullPage: true,
    darkMode: false,
    previewImages: false,
  };
  return <NotionRendererProvider value={value}>{element}</NotionRendererProvider>;
}

describe("EquationBlock (block-level)", () => {
  it("renders E = mc^2 with KaTeX in display mode", () => {
    const page = makePageBlock("page-1", ["eq-1"]);
    const eq = makeBlock("eq-1", "equation", {
      properties: { title: [["E = mc^2"]] },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "eq-1": { value: eq },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-equation");
    expect(html).toContain("noxion-equation--block");
    expect(html).toContain("katex");
    expect(html).toContain("mc");
  });

  it("renders complex LaTeX expression", () => {
    const page = makePageBlock("page-1", ["eq-1"]);
    const eq = makeBlock("eq-1", "equation", {
      properties: { title: [["\\int_{0}^{\\infty} e^{-x} dx = 1"]] },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "eq-1": { value: eq },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-equation--block");
    expect(html).toContain("katex");
  });

  it("handles invalid LaTeX gracefully without crashing", () => {
    const page = makePageBlock("page-1", ["eq-1"]);
    const eq = makeBlock("eq-1", "equation", {
      properties: { title: [["\\invalid{command{{"]] },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "eq-1": { value: eq },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-equation");
    expect(html).toBeTruthy();
  });

  it("handles empty equation expression", () => {
    const page = makePageBlock("page-1", ["eq-1"]);
    const eq = makeBlock("eq-1", "equation", {
      properties: { title: [[""]] },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "eq-1": { value: eq },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-equation");
  });

  it("handles equation with no properties", () => {
    const page = makePageBlock("page-1", ["eq-1"]);
    const eq = makeBlock("eq-1", "equation", {
      properties: undefined,
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "eq-1": { value: eq },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-equation");
  });

  it("applies block color when present", () => {
    const page = makePageBlock("page-1", ["eq-1"]);
    const eq = makeBlock("eq-1", "equation", {
      properties: { title: [["x^2"]] },
      format: { block_color: "blue" },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "eq-1": { value: eq },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-color--blue");
  });
});

describe("InlineEquation", () => {
  it("renders inline equation with KaTeX", () => {
    const html = renderToString(wrapInProvider(<InlineEquation expression="x^2" />));

    expect(html).toContain("noxion-equation--inline");
    expect(html).toContain("katex");
  });

  it("renders inline equation within rich text via text component", () => {
    const page = makePageBlock("page-1", ["text-1"]);
    const text = makeBlock("text-1", "text", {
      properties: { title: [["", [["e", "a^2 + b^2 = c^2"]]]] },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "text-1": { value: text },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-equation--inline");
    expect(html).toContain("katex");
  });

  it("handles invalid inline LaTeX gracefully", () => {
    const html = renderToString(wrapInProvider(<InlineEquation expression="\\badcommand{{" />));

    expect(html).toBeTruthy();
    expect(html).toContain("noxion-equation");
  });
});
