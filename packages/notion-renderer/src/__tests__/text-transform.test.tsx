import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import type { Decoration, ExtendedRecordMap } from "notion-types";
import { Text } from "../components/text";
import { NotionRendererProvider } from "../context";
import type { RendererPlugin } from "../plugin/types";
import type { NotionRendererContextValue } from "../types";

function createMinimalRecordMap(): ExtendedRecordMap {
  return {
    block: {},
    collection: {},
    collection_view: {},
    collection_query: {},
    notion_user: {},
    signed_urls: {},
  } as ExtendedRecordMap;
}

function createContextValue(
  plugins: RendererPlugin[] = [],
  overrides?: Partial<NotionRendererContextValue>
): NotionRendererContextValue {
  return {
    recordMap: createMinimalRecordMap(),
    mapPageUrl: (id) => `/${id}`,
    mapImageUrl: (url) => url,
    components: {},
    fullPage: true,
    darkMode: false,
    previewImages: false,
    plugins,
    ...overrides,
  };
}

function renderTextWithPlugin(value: Decoration[], plugin: RendererPlugin): string {
  return renderToString(
    <NotionRendererProvider value={createContextValue([plugin])}>
      <Text value={value} />
    </NotionRendererProvider>
  );
}

function createWikilinkAndHashtagPlugin(): RendererPlugin {
  return {
    name: "wikilink-hashtag-transform",
    transformText: ({ text }) => {
      const replacements: Array<{ start: number; end: number; component: React.ReactNode }> = [];
      const pattern = /(\[\[([^\]]+)\]\])|(#[a-zA-Z0-9_-]+)/g;
      let output = "";
      let cursor = 0;

      for (const match of text.matchAll(pattern)) {
        const token = match[0];
        const start = match.index ?? 0;
        const end = start + token.length;
        output += text.slice(cursor, start);

        if (token.startsWith("[[")) {
          const pageName = (match[2] ?? "").trim();
          const slug = pageName.toLowerCase().replace(/\s+/g, "-");
          const replacementStart = output.length;
          output += pageName;
          replacements.push({
            start: replacementStart,
            end: output.length,
            component: <a href={`/wiki/${slug}`} className="noxion-link">{pageName}</a>,
          });
        } else {
          const replacementStart = output.length;
          output += token;
          replacements.push({
            start: replacementStart,
            end: output.length,
            component: <span className="noxion-color--gray_background">{token}</span>,
          });
        }

        cursor = end;
      }

      if (cursor < text.length) {
        output += text.slice(cursor);
      }

      return { text: output, replacements };
    },
  };
}

describe("Text transform hooks", () => {
  it("transforms wikilinks and hashtags before decoration reducer", () => {
    const html = renderTextWithPlugin(
      [["See [[Page Name]] and #tag today"]],
      createWikilinkAndHashtagPlugin()
    );

    expect(html).toContain('href="/wiki/page-name"');
    expect(html).toContain(">Page Name</a>");
    expect(html).toContain("noxion-color--gray_background");
    expect(html).toContain("#tag");
  });

  it("does not transform text inside existing decorations", () => {
    const html = renderTextWithPlugin(
      [["[[Decorated]]", [["b"]]], [" plain [[Raw]]"]],
      createWikilinkAndHashtagPlugin()
    );

    expect(html).toContain("<strong>[[Decorated]]</strong>");
    expect(html).toContain('href="/wiki/raw"');
    expect(html).toContain(">Raw</a>");
  });
});
