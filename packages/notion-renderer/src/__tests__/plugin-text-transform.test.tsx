import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { ReactNode } from "react";
import type { Block, ExtendedRecordMap, Decoration } from "notion-types";
import { NotionRenderer } from "../renderer";
import { executeTextTransforms } from "../plugin/executor";
import { createTextTransformPlugin } from "../plugins/text-transform";

function createMinimalRecordMap(
  blocks: Record<string, { value: Block }>
): ExtendedRecordMap {
  return {
    block: blocks as ExtendedRecordMap["block"],
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  };
}

function makeBlock(
  id: string,
  type: string,
  overrides: Partial<Block> = {}
): Block {
  return {
    id,
    type,
    properties: { title: [["Test content"]] },
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

function makePageBlock(id: string, childIds: string[] = []): Block {
  return {
    id,
    type: "page",
    content: childIds,
    properties: { title: [["Test Page"]] },
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

function createTextRecordMap(title: Decoration[]): ExtendedRecordMap {
  const page = makePageBlock("page-1", ["text-1"]);
  const text = makeBlock("text-1", "text", {
    properties: { title },
  });
  return createMinimalRecordMap({
    "page-1": { value: page },
    "text-1": { value: text },
  });
}

describe("text transform plugin", () => {
  it("createTextTransformPlugin returns a RendererPlugin with name 'text-transform'", () => {
    const plugin = createTextTransformPlugin({});
    expect(plugin.name).toBe("text-transform");
    expect(typeof plugin.transformText).toBe("function");
  });

  it("transforms [[Page Name]] wikilinks into links", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createTextRecordMap([["See [[My Page]] for info"]])}
        plugins={[createTextTransformPlugin({})]}
      />
    );
    // Should render as a link
    expect(html).toContain("My Page");
    expect(html).toContain("href");
  });

  it("transforms #hashtag into highlighted text", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createTextRecordMap([["Check #awesome tag"]])}
        plugins={[createTextTransformPlugin({})]}
      />
    );
    expect(html).toContain("awesome");
  });

  it("transforms Korean hashtag #태그", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createTextRecordMap([["Check #태그 here"]])}
        plugins={[createTextTransformPlugin({})]}
      />
    );
    expect(html).toContain("태그");
  });

  it("does not transform text inside code decoration", () => {
    // Code decoration: ['[[not a link]]', [['c']]]
    const decorations: Decoration[] = [
      ["[[not a link]]", [["c"]]] as unknown as Decoration,
    ];
    const plugin = createTextTransformPlugin({});
    const block = makeBlock("b1", "text");
    const result = executeTextTransforms(decorations, block, [plugin]);
    // Should be unchanged - still has code decoration
    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe("[[not a link]]");
    const formatting = result[0][1];
    expect(formatting).toBeDefined();
    expect(formatting!.some((f) => f[0] === "c")).toBe(true);
  });

  it("does not transform text inside link decoration", () => {
    const decorations: Decoration[] = [
      ["[[existing link]]", [["a", [["/", "/some-url"]]]]] as unknown as Decoration,
    ];
    const plugin = createTextTransformPlugin({});
    const block = makeBlock("b1", "text");
    const result = executeTextTransforms(decorations, block, [plugin]);
    expect(result).toHaveLength(1);
    expect(result[0][0]).toBe("[[existing link]]");
  });

  it("enableWikilinks: false disables wikilink transformation", () => {
    const plugin = createTextTransformPlugin({ enableWikilinks: false });
    const block = makeBlock("b1", "text");
    const decorations: Decoration[] = [["See [[My Page]] here"] as Decoration];
    const result = executeTextTransforms(decorations, block, [plugin]);
    // Should not be split into link
    expect(result).toHaveLength(1);
    expect(result[0][0]).toContain("[[My Page]]");
  });

  it("enableHashtags: false disables hashtag transformation", () => {
    const plugin = createTextTransformPlugin({ enableHashtags: false });
    const block = makeBlock("b1", "text");
    const decorations: Decoration[] = [["Check #awesome tag"] as Decoration];
    const result = executeTextTransforms(decorations, block, [plugin]);
    expect(result).toHaveLength(1);
    expect(result[0][0]).toContain("#awesome");
  });

  it("custom hashtagUrl option is used for hashtag links", () => {
    const plugin = createTextTransformPlugin({
      hashtagUrl: (tag) => `/tags/${tag}`,
    });
    const block = makeBlock("b1", "text");
    const decorations: Decoration[] = [["Check #awesome tag"] as Decoration];
    const result = executeTextTransforms(decorations, block, [plugin]);
    expect(result).toHaveLength(3);

    const transformed = result[1]?.[0];
    expect(typeof transformed).not.toBe("string");

    const html = renderToString(<>{transformed as ReactNode}</>);
    expect(html).toContain('href="/tags/awesome"');
  });
});
