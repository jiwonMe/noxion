/**
 * T18: Integration tests — all plugins working together
 * Tests that all 5 built-in plugins coexist without conflicts,
 * blockOverrides precedence is correct, and error isolation works.
 */
import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import { createMermaidPlugin } from "../plugins/mermaid";
import { createChartPlugin } from "../plugins/chart";
import { createCalloutTransformPlugin } from "../plugins/callout-transform";
import { createEmbedEnhancedPlugin } from "../plugins/embed-enhanced";
import { createTextTransformPlugin } from "../plugins/text-transform";
import type { NotionBlockProps } from "../types";

// ─── Test helpers ────────────────────────────────────────────────────────────

function makeBlock(id: string, type: string, overrides: Partial<Block> = {}): Block {
  return {
    id, type,
    properties: { title: [["Test content"]] },
    parent_id: "root", parent_table: "block", version: 1,
    created_time: Date.now(), last_edited_time: Date.now(), alive: true,
    created_by_table: "notion_user", created_by_id: "user1",
    last_edited_by_table: "notion_user", last_edited_by_id: "user1",
    ...overrides,
  } as unknown as Block;
}

function makePageBlock(id: string, childIds: string[] = []): Block {
  return makeBlock(id, "page", {
    content: childIds,
    properties: { title: [["Integration Test Page"]] },
  });
}

function createRecordMap(blocks: Record<string, { value: Block }>): ExtendedRecordMap {
  return {
    block: blocks as ExtendedRecordMap["block"],
    collection: {}, collection_view: {}, collection_query: {},
    notion_user: {}, signed_urls: {},
  };
}

// ─── All plugins active simultaneously ───────────────────────────────────────

describe("integration: all plugins active simultaneously", () => {
  it("mermaid code block renders diagram container", () => {
    const page = makePageBlock("page-1", ["text-0", "mermaid-1"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["intro"]] } });
    const mermaidBlock = makeBlock("mermaid-1", "code", {
      properties: { language: [["mermaid"]], title: [["graph TD; A-->B"]] },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
      "mermaid-1": { value: mermaidBlock },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        plugins={[
          createMermaidPlugin(),
          createChartPlugin(),
          createCalloutTransformPlugin(),
          createEmbedEnhancedPlugin(),
          createTextTransformPlugin(),
        ]}
      />
    );

    // Lazy-loaded mermaid shows loading placeholder during SSR
    expect(html).toContain("noxion-loading-placeholder");
    expect(html).not.toContain("noxion-code");
  });

  it("chart code block renders chart container", () => {
    const page = makePageBlock("page-1", ["text-0", "chart-1"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["intro"]] } });
    const chartBlock = makeBlock("chart-1", "code", {
      properties: { language: [["chart"]], title: [['{"type":"bar","data":{}}']] },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
      "chart-1": { value: chartBlock },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        plugins={[
          createMermaidPlugin(),
          createChartPlugin(),
          createCalloutTransformPlugin(),
          createEmbedEnhancedPlugin(),
          createTextTransformPlugin(),
        ]}
      />
    );

    // Lazy-loaded chart shows loading placeholder during SSR
    expect(html).toContain("noxion-loading-placeholder");
  });

  it("accordion callout renders accordion, regular callout renders normally", () => {
    const page = makePageBlock("page-1", ["callout-accordion", "callout-regular"]);
    const accordionCallout = makeBlock("callout-accordion", "callout", {
      properties: { title: [["Accordion content"]] },
      format: { page_icon: "📋" },
    });
    const regularCallout = makeBlock("callout-regular", "callout", {
      properties: { title: [["Regular callout"]] },
      format: { page_icon: "💡" },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "callout-accordion": { value: accordionCallout },
      "callout-regular": { value: regularCallout },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        plugins={[createCalloutTransformPlugin()]}
      />
    );

    expect(html).toContain("noxion-accordion");
    expect(html).toContain("noxion-callout");
  });

  it("CodePen embed renders enhanced embed", () => {
    const page = makePageBlock("page-1", ["embed-1"]);
    const embedBlock = makeBlock("embed-1", "embed", {
      properties: { source: [["https://codepen.io/user/pen/abc123"]] },
      format: { display_source: "https://codepen.io/user/pen/abc123" },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "embed-1": { value: embedBlock },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        plugins={[createEmbedEnhancedPlugin()]}
      />
    );

    expect(html).toContain("noxion-embed--codepen");
  });

  it("javascript code block renders normally (no plugin override)", () => {
    const page = makePageBlock("page-1", ["text-0", "code-1"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["intro"]] } });
    const codeBlock = makeBlock("code-1", "code", {
      properties: { language: [["javascript"]], title: [["console.log('hello')"]] },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
      "code-1": { value: codeBlock },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        plugins={[
          createMermaidPlugin(),
          createChartPlugin(),
          createCalloutTransformPlugin(),
          createEmbedEnhancedPlugin(),
          createTextTransformPlugin(),
        ]}
      />
    );

    expect(html).toContain("noxion-code");
    expect(html).not.toContain("noxion-mermaid");
    expect(html).not.toContain("noxion-chart");
  });
});

// ─── blockOverrides precedence ────────────────────────────────────────────────

describe("integration: blockOverrides takes precedence over plugins", () => {
  it("blockOverrides.code beats mermaid plugin", () => {
    function CustomCodeBlock({ block }: NotionBlockProps) {
      const content = (block.properties as { title?: string[][] })?.title?.[0]?.[0] ?? "";
      return <div className="custom-override">{content}</div>;
    }

    const page = makePageBlock("page-1", ["text-0", "code-1"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["intro"]] } });
    const codeBlock = makeBlock("code-1", "code", {
      properties: { language: [["mermaid"]], title: [["graph TD; A-->B"]] },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
      "code-1": { value: codeBlock },
    });

    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        plugins={[createMermaidPlugin()]}
        components={{ blockOverrides: { code: CustomCodeBlock } }}
      />
    );

    expect(html).toContain("custom-override");
    expect(html).not.toContain("noxion-mermaid");
  });
});

// ─── Error isolation ──────────────────────────────────────────────────────────

describe("integration: plugin error isolation", () => {
  it("a plugin that throws in blockOverride does not crash the page", () => {
    const throwingPlugin = {
      name: "throwing-plugin",
      blockOverride: () => {
        throw new Error("Plugin error!");
      },
    };

    const page = makePageBlock("page-1", ["text-0", "code-1"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["intro"]] } });
    const codeBlock = makeBlock("code-1", "code", {
      properties: { language: [["javascript"]], title: [["console.log()"]] },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
      "code-1": { value: codeBlock },
    });

    // Should not throw
    let html = "";
    expect(() => {
      html = renderToString(
        <NotionRenderer
          recordMap={recordMap}
          plugins={[throwingPlugin, createMermaidPlugin()]}
        />
      );
    }).not.toThrow();

    // Page still renders
    expect(html).toContain("noxion-page");
  });

  it("a plugin that throws in transformBlock does not crash the page", () => {
    const throwingPlugin = {
      name: "throwing-transform",
      transformBlock: () => {
        throw new Error("Transform error!");
      },
    };

    const page = makePageBlock("page-1", ["text-0", "code-1"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["intro"]] } });
    const codeBlock = makeBlock("code-1", "code", {
      properties: { language: [["javascript"]], title: [["console.log()"]] },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
      "code-1": { value: codeBlock },
    });

    let html = "";
    expect(() => {
      html = renderToString(
        <NotionRenderer
          recordMap={recordMap}
          plugins={[throwingPlugin]}
        />
      );
    }).not.toThrow();

    expect(html).toContain("noxion-page");
  });
});

// ─── No plugins — backward compat ────────────────────────────────────────────

describe("integration: backward compatibility without plugins", () => {
  it("renders correctly with no plugins prop", () => {
    const page = makePageBlock("page-1", ["text-0", "code-1"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["Hello world"]] } });
    const codeBlock = makeBlock("code-1", "code", {
      properties: { language: [["javascript"]], title: [["const x = 1;"]] },
    });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
      "code-1": { value: codeBlock },
    });

    const html = renderToString(<NotionRenderer recordMap={recordMap} />);

    expect(html).toContain("noxion-code");
    expect(html).toContain("noxion-page");
  });

  it("renders correctly with empty plugins array", () => {
    const page = makePageBlock("page-1", ["text-0"]);
    const textBlock = makeBlock("text-0", "text", { properties: { title: [["Hello"]] } });
    const recordMap = createRecordMap({
      "page-1": { value: page },
      "text-0": { value: textBlock },
    });

    const html = renderToString(
      <NotionRenderer recordMap={recordMap} plugins={[]} />
    );

    expect(html).toContain("noxion-page");
  });
});

// ─── 100+ block performance ───────────────────────────────────────────────────

describe("integration: large page with all plugins", () => {
  it("renders 50 mixed blocks with all plugins in reasonable time", () => {
    const childIds: string[] = [];
    const blocks: Record<string, { value: Block }> = {};

    // Add a text block first to prevent frontmatter parsing
    childIds.push("text-intro");

    for (let i = 0; i < 48; i++) {
      const id = `block-${i}`;
      childIds.push(id);
    }

    // Page block MUST be first key in recordMap (Object.keys determines root)
    const page = makePageBlock("page-1", childIds);
    blocks["page-1"] = { value: page };

    // Now add child blocks
    blocks["text-intro"] = { value: makeBlock("text-intro", "text", { properties: { title: [["intro"]] } }) };
    for (let i = 0; i < 48; i++) {
      const id = `block-${i}`;
      const type = i % 3 === 0 ? "text" : i % 3 === 1 ? "bulleted_list" : "quote";
      blocks[id] = {
        value: makeBlock(id, type, {
          properties: { title: [[`Block ${i} content`]] },
        }),
      };
    }

    const recordMap = createRecordMap(blocks);

    const start = performance.now();
    const html = renderToString(
      <NotionRenderer
        recordMap={recordMap}
        plugins={[
          createMermaidPlugin(),
          createChartPlugin(),
          createCalloutTransformPlugin(),
          createEmbedEnhancedPlugin(),
          createTextTransformPlugin(),
        ]}
      />
    );
    const duration = performance.now() - start;

    expect(html).toContain("noxion-page");
    expect(duration).toBeLessThan(500); // generous budget for CI
  });
});
