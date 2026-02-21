import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import { Text } from "../components/text";
import { NotionRendererProvider } from "../context";
import type { NotionRendererContextValue } from "../types";
import type { ExtendedRecordMap, Decoration } from "notion-types";

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

function createContextValue(overrides?: Partial<NotionRendererContextValue>): NotionRendererContextValue {
  return {
    recordMap: createMinimalRecordMap(),
    mapPageUrl: (id) => `/${id}`,
    mapImageUrl: (url) => url,
    components: {},
    fullPage: true,
    darkMode: false,
    previewImages: false,
    ...overrides,
  };
}

function renderText(value: Decoration[], ctx?: Partial<NotionRendererContextValue>): string {
  return renderToString(
    <NotionRendererProvider value={createContextValue(ctx)}>
      <Text value={value} />
    </NotionRendererProvider>
  );
}

describe("Text component", () => {
  it("renders plain text", () => {
    const html = renderText([["Hello World"]]);
    expect(html).toContain("Hello World");
  });

  it("renders multiple text segments", () => {
    const html = renderText([["Hello "], ["World"]]);
    expect(html).toContain("Hello ");
    expect(html).toContain("World");
  });

  it("renders bold text", () => {
    const html = renderText([["bold text", [["b"]]]]);
    expect(html).toContain("<strong>");
    expect(html).toContain("bold text");
    expect(html).toContain("</strong>");
  });

  it("renders italic text", () => {
    const html = renderText([["italic text", [["i"]]]]);
    expect(html).toContain("<em>");
    expect(html).toContain("italic text");
    expect(html).toContain("</em>");
  });

  it("renders strikethrough text", () => {
    const html = renderText([["struck", [["s"]]]]);
    expect(html).toContain("<s>");
    expect(html).toContain("struck");
    expect(html).toContain("</s>");
  });

  it("renders inline code", () => {
    const html = renderText([["code", [["c"]]]]);
    expect(html).toContain("noxion-inline-code");
    expect(html).toContain("code");
  });

  it("renders underline", () => {
    const html = renderText([["underlined", [["_"]]]]);
    expect(html).toContain("noxion-inline-underscore");
    expect(html).toContain("underlined");
  });

  it("renders nested bold + italic", () => {
    const html = renderText([["nested", [["b"], ["i"]]]]);
    expect(html).toContain("<strong>");
    expect(html).toContain("<em>");
    expect(html).toContain("nested");
  });

  it("renders link", () => {
    const html = renderText([["click me", [["a", "https://example.com"]]]]);
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain("click me");
    expect(html).toContain("noxion-link");
  });

  it("renders color/highlight", () => {
    const html = renderText([["colored", [["h", "red"]]]]);
    expect(html).toContain("noxion-color--red");
    expect(html).toContain("colored");
  });

  it("renders background color", () => {
    const html = renderText([["highlighted", [["h", "yellow_background"]]]]);
    expect(html).toContain("noxion-color--yellow_background");
  });

  it("renders inline equation via KaTeX", () => {
    const html = renderText([["", [["e", "E=mc^2"]]]]);
    expect(html).toContain("noxion-equation");
    expect(html).toContain("noxion-equation--inline");
    expect(html).toContain("katex");
  });

  it("handles invalid equation gracefully", () => {
    const html = renderText([["", [["e", "\\invalid{"]]]]);
    expect(html).toContain("noxion-equation");
  });

  it("renders date", () => {
    const dateValue = { type: "date" as const, start_date: "2024-01-15" };
    const decorations = [["", [["d", dateValue]]]] as unknown as Decoration[];
    const html = renderText(decorations);
    expect(html).toContain("Jan");
    expect(html).toContain("15");
    expect(html).toContain("2024");
  });

  it("renders date range", () => {
    const dateValue = { type: "daterange" as const, start_date: "2024-01-01", end_date: "2024-12-31" };
    const decorations = [["", [["d", dateValue]]]] as unknown as Decoration[];
    const html = renderText(decorations);
    expect(html).toContain("→");
  });

  it("renders comment decorator (m) as passthrough", () => {
    const html = renderText([["visible text", [["m", "comment-id"]]]]);
    expect(html).toContain("visible text");
  });

  it("renders suggestion edit (si) as null", () => {
    const html = renderText([["suggested", [["si", "suggestion-id"]]]]);
    expect(html).not.toContain("suggested");
  });

  it("renders null for empty value", () => {
    const html = renderToString(
      <NotionRendererProvider value={createContextValue()}>
        <Text value={undefined} />
      </NotionRendererProvider>
    );
    expect(html).toBe("");
  });

  it("renders page link (p decorator) with page title", () => {
    const recordMap = createMinimalRecordMap();
    (recordMap.block as Record<string, unknown>)["page-123"] = {
      value: {
        id: "page-123",
        type: "page",
        properties: { title: [["My Page"]] },
        parent_id: "root",
        parent_table: "block",
        version: 1,
        created_time: Date.now(),
        last_edited_time: Date.now(),
        alive: true,
        created_by_table: "notion_user",
        created_by_id: "u1",
        last_edited_by_table: "notion_user",
        last_edited_by_id: "u1",
      },
    };

    const html = renderText(
      [["", [["p", "page-123"]]]],
      { recordMap }
    );
    expect(html).toContain("My Page");
    expect(html).toContain('href="/page-123"');
    expect(html).toContain("noxion-link");
  });

  it("uses custom Link component from context", () => {
    function CustomLink({ href, children }: { href: string; className?: string; children?: React.ReactNode }) {
      return <a href={href} data-custom="true">{children}</a>;
    }

    const html = renderText(
      [["click", [["a", "https://test.com"]]]],
      { components: { Link: CustomLink } }
    );
    expect(html).toContain('data-custom="true"');
    expect(html).toContain('href="https://test.com"');
  });
});
