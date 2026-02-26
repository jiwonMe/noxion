import { describe, it, expect, beforeEach, afterEach } from "bun:test";
import { renderToString } from "react-dom/server";
import { BlockActions } from "../components/block-actions";

describe("BlockActions", () => {
  let clipboardWriteTextMock: (text: string) => Promise<void>;
  let originalNavigator: typeof global.navigator;

  beforeEach(() => {
    clipboardWriteTextMock = async (text: string) => {
      // Mock implementation
    };

    originalNavigator = global.navigator;
    (global as any).navigator = {
      clipboard: {
        writeText: clipboardWriteTextMock,
      },
    };
  });

  afterEach(() => {
    global.navigator = originalNavigator;
  });

  it("renders block actions container with correct class", () => {
    const html = renderToString(
      <BlockActions blockId="test-block" blockType="code" content="console.log('test')" />
    );

    expect(html).toContain("noxion-block-actions");
  });

  it("renders copy button for code blocks", () => {
    const html = renderToString(
      <BlockActions blockId="test-block" blockType="code" content="const x = 1;" />
    );

    expect(html).toContain("Copy");
  });

  it("renders share button", () => {
    const html = renderToString(
      <BlockActions blockId="test-block" blockType="code" content="test" />
    );

    expect(html).toContain("Share");
  });

  it("accepts optional className prop", () => {
    const html = renderToString(
      <BlockActions
        blockId="test-block"
        blockType="code"
        content="test"
        className="custom-class"
      />
    );

    expect(html).toContain("custom-class");
    expect(html).toContain("noxion-block-actions");
  });

  it("renders without content prop", () => {
    const html = renderToString(
      <BlockActions blockId="test-block" blockType="code" />
    );

    expect(html).toContain("noxion-block-actions");
  });

  it("copy button has aria-label", () => {
    const html = renderToString(
      <BlockActions blockId="test-block" blockType="code" content="test" />
    );

    expect(html).toContain("aria-label");
  });

  it("share button has aria-label", () => {
    const html = renderToString(
      <BlockActions blockId="test-block" blockType="code" content="test" />
    );

    expect(html).toContain("aria-label");
  });
});
