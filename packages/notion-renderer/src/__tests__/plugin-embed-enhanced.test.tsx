import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import {
  createEmbedEnhancedPlugin,
  detectEmbedProvider,
} from "../plugins/embed-enhanced";

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

function createEmbedRecordMap(src: string): ExtendedRecordMap {
  const page = makePageBlock("page-1", ["embed-1"]);
  const embed = makeBlock("embed-1", "embed", {
    properties: { source: [[src]] },
    format: { display_source: src },
  });
  return createMinimalRecordMap({
    "page-1": { value: page },
    "embed-1": { value: embed },
  });
}

describe("embed enhanced plugin", () => {
  it("createEmbedEnhancedPlugin returns a RendererPlugin with name 'embed-enhanced'", () => {
    const plugin = createEmbedEnhancedPlugin();
    expect(plugin.name).toBe("embed-enhanced");
    expect(typeof plugin.blockOverride).toBe("function");
  });

  describe("detectEmbedProvider", () => {
    it("detects codepen", () => {
      expect(detectEmbedProvider("https://codepen.io/user/pen/abc")).toBe("codepen");
    });
    it("detects stackblitz", () => {
      expect(detectEmbedProvider("https://stackblitz.com/edit/abc")).toBe("stackblitz");
    });
    it("detects figma", () => {
      expect(detectEmbedProvider("https://www.figma.com/file/abc")).toBe("figma");
    });
    it("detects youtube", () => {
      expect(detectEmbedProvider("https://www.youtube.com/watch?v=abc")).toBe("youtube");
      expect(detectEmbedProvider("https://youtu.be/abc")).toBe("youtube");
    });
    it("detects codesandbox", () => {
      expect(detectEmbedProvider("https://codesandbox.io/s/abc")).toBe("codesandbox");
    });
    it("returns null for unknown URLs", () => {
      expect(detectEmbedProvider("https://random-site.com/embed")).toBeNull();
    });
  });

  it("renders .noxion-embed--codepen for CodePen URL", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createEmbedRecordMap("https://codepen.io/user/pen/abc123")}
        plugins={[createEmbedEnhancedPlugin()]}
      />
    );
    expect(html).toContain("noxion-embed--codepen");
  });

  it("renders .noxion-embed--stackblitz for StackBlitz URL", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createEmbedRecordMap("https://stackblitz.com/edit/my-project")}
        plugins={[createEmbedEnhancedPlugin()]}
      />
    );
    expect(html).toContain("noxion-embed--stackblitz");
  });

  it("renders .noxion-embed--youtube for YouTube URL", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createEmbedRecordMap("https://www.youtube.com/watch?v=dQw4w9WgXcQ")}
        plugins={[createEmbedEnhancedPlugin()]}
      />
    );
    expect(html).toContain("noxion-embed--youtube");
  });

  it("all enhanced embeds have loading=lazy", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createEmbedRecordMap("https://codepen.io/user/pen/abc")}
        plugins={[createEmbedEnhancedPlugin()]}
      />
    );
    expect(html).toContain('loading="lazy"');
  });

  it("all enhanced embeds have title attribute", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createEmbedRecordMap("https://codepen.io/user/pen/abc")}
        plugins={[createEmbedEnhancedPlugin()]}
      />
    );
    expect(html).toContain("title=");
  });

  it("unknown URL falls back to default embed (plugin returns null)", () => {
    const html = renderToString(
      <NotionRenderer
        recordMap={createEmbedRecordMap("https://random-site.com/embed")}
        plugins={[createEmbedEnhancedPlugin()]}
      />
    );
    // Default embed renders noxion-embed (without provider suffix)
    expect(html).toContain("noxion-embed");
    expect(html).not.toContain("noxion-embed--");
  });

  it("blockOverride returns null for non-embed blocks", () => {
    const plugin = createEmbedEnhancedPlugin();
    const block = makeBlock("b1", "text");
    const result = plugin.blockOverride!({ block, blockId: "b1" });
    expect(result).toBeNull();
  });
});
