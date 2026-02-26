import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Block, ExtendedRecordMap } from "notion-types";
import { NotionRenderer } from "../renderer";
import { useNotionRenderer, useRendererPlugins, useResolvedBlockRenderer } from "../context";
import type { NotionBlockProps } from "../types";
import type { RendererPlugin } from "../plugin/types";

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

function makeBlock(id: string, type: string, overrides: Partial<Block> = {}): Block {
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

function createRecordMap(): ExtendedRecordMap {
  const page = makePageBlock("page-1", ["text-1"]);
  const text = makeBlock("text-1", "text", {
    properties: { title: [["Plugin context test"]] },
  });

  return createMinimalRecordMap({
    "page-1": { value: page },
    "text-1": { value: text },
  });
}

describe("plugin context hooks", () => {
  it("returns registered plugins and keeps useNotionRenderer working", () => {
    const plugin: RendererPlugin = { name: "sample-plugin" };

    function ProbeBlock() {
      const plugins = useRendererPlugins();
      const renderer = useNotionRenderer();

      return (
        <div
          data-testid="plugin-probe"
          data-plugin-count={plugins.length}
          data-dark-mode={renderer.darkMode ? "yes" : "no"}
        />
      );
    }

    const html = renderToString(
      <NotionRenderer
        recordMap={createRecordMap()}
        darkMode
        plugins={[plugin]}
        components={{
          blockOverrides: {
            text: ProbeBlock,
          },
        }}
      />
    );

    expect(html).toContain('data-plugin-count="1"');
    expect(html).toContain('data-dark-mode="yes"');
  });

  it("returns empty array when no plugins are provided", () => {
    function ProbeBlock() {
      const plugins = useRendererPlugins();
      return <div data-testid="plugin-probe" data-plugin-count={plugins.length} />;
    }

    const html = renderToString(
      <NotionRenderer
        recordMap={createRecordMap()}
        components={{
          blockOverrides: {
            text: ProbeBlock,
          },
        }}
      />
    );

    expect(html).toContain('data-plugin-count="0"');
  });

  it("resolves block renderer through plugins", () => {
    const plugin: RendererPlugin = {
      name: "override-plugin",
      blockOverride: ({ blockId }) => {
        if (blockId !== "text-1") return null;
        return {
          component: () => <div>Overridden</div>,
          props: { source: "plugin" },
        };
      },
    };

    function ProbeBlock(props: NotionBlockProps) {
      const resolved = useResolvedBlockRenderer(props.block, props.blockId);

      return (
        <div
          data-testid="resolved-probe"
          data-resolved={resolved ? "yes" : "no"}
          data-source={String(resolved?.props?.source ?? "")}
        />
      );
    }

    const html = renderToString(
      <NotionRenderer
        recordMap={createRecordMap()}
        plugins={[plugin]}
        components={{
          blockOverrides: {
            text: ProbeBlock,
          },
        }}
      />
    );

    expect(html).toContain('data-resolved="yes"');
    expect(html).toContain('data-source="plugin"');
  });
});
