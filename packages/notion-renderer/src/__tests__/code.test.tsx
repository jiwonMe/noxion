import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import { NotionRenderer } from "../renderer";
import { normalizeLanguage } from "../shiki";
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

describe("CodeBlock", () => {
  it("renders code block with language label", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: {
        title: [["const x = 42;"]],
        language: [["JavaScript"]],
        caption: [],
      },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-code");
    expect(html).toContain("const x = 42;");
    expect(html).toContain("JavaScript");
    expect(html).toContain("noxion-code__language");
  });

  it("renders plain text code when no highlightCode provided", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: {
        title: [["print('hello')"]],
        language: [["Python"]],
        caption: [],
      },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("print(&#x27;hello&#x27;)");
    expect(html).toContain("<pre");
    expect(html).toContain("<code");
  });

  it("uses highlightCode function when provided", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: {
        title: [["const x = 1;"]],
        language: [["JavaScript"]],
        caption: [],
      },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    const mockHighlight = (_code: string, _lang: string) =>
      '<pre class="shiki"><code><span class="token">const</span> x = 1;</code></pre>';

    const html = renderToString(
      <NotionRenderer recordMap={recordMap} highlightCode={mockHighlight} />
    );

    expect(html).toContain("shiki");
    expect(html).toContain("token");
  });

  it("renders caption when present", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: {
        title: [["x = 1"]],
        language: [["Python"]],
        caption: [["A simple assignment"]],
      },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("A simple assignment");
    expect(html).toContain("noxion-code__caption");
  });

  it("renders empty code block without crashing", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: {
        title: [[""]],
        language: [["Plain Text"]],
        caption: [],
      },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-code");
  });

  it("handles code with no properties", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: undefined,
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-code");
    expect(html).toContain("plain text");
  });

  it("handles highlightCode that throws", () => {
    const page = makePageBlock("page-1", ["code-1"]);
    const code = makeBlock("code-1", "code", {
      properties: {
        title: [["x = 1"]],
        language: [["Python"]],
        caption: [],
      },
    });

    const recordMap = createMinimalRecordMap({
      "page-1": { value: page },
      "code-1": { value: code },
    });

    const throwingHighlight = () => {
      throw new Error("highlight failed");
    };

    const html = renderToString(
      <NotionRenderer recordMap={recordMap} highlightCode={throwingHighlight} />
    );

    expect(html).toContain("x = 1");
    expect(html).toContain("<pre");
  });
});

describe("normalizeLanguage", () => {
  it("maps Notion display names to Shiki language IDs", () => {
    expect(normalizeLanguage("JavaScript")).toBe("javascript");
    expect(normalizeLanguage("TypeScript")).toBe("typescript");
    expect(normalizeLanguage("Python")).toBe("python");
    expect(normalizeLanguage("C++")).toBe("cpp");
    expect(normalizeLanguage("C#")).toBe("csharp");
    expect(normalizeLanguage("Plain Text")).toBe("text");
  });

  it("handles already-lowercase languages", () => {
    expect(normalizeLanguage("javascript")).toBe("javascript");
    expect(normalizeLanguage("python")).toBe("python");
  });

  it("passes through unknown languages as-is (lowercased)", () => {
    expect(normalizeLanguage("SomeNewLang")).toBe("somenewlang");
  });

  it("handles empty string", () => {
    expect(normalizeLanguage("")).toBe("");
  });
});
