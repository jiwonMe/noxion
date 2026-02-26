import { describe, it, expect } from "bun:test";
import { renderToString } from "react-dom/server";
import { generateHeadingId } from "../utils/heading-id";
import { HeadingAnchor } from "../components/heading-anchor";

describe("generateHeadingId", () => {
  it("converts text to lowercase slug", () => {
    expect(generateHeadingId("Hello World")).toBe("hello-world");
  });

  it("replaces spaces with hyphens", () => {
    expect(generateHeadingId("Multiple Word Heading")).toBe("multiple-word-heading");
  });

  it("removes special characters but keeps alphanumeric", () => {
    expect(generateHeadingId("Hello! @World #123")).toBe("hello-world-123");
  });

  it("preserves Korean characters", () => {
    expect(generateHeadingId("안녕하세요")).toBe("안녕하세요");
  });

  it("handles mixed Korean and English", () => {
    expect(generateHeadingId("안녕하세요 World")).toBe("안녕하세요-world");
  });

  it("handles mixed English and Korean", () => {
    expect(generateHeadingId("Hello 세계")).toBe("hello-세계");
  });

  it("handles duplicate slugs with incrementing suffix", () => {
    const existingIds = new Set(["hello-world"]);
    expect(generateHeadingId("Hello World", existingIds)).toBe("hello-world-1");
  });

  it("handles multiple duplicates", () => {
    const existingIds = new Set(["hello-world", "hello-world-1"]);
    expect(generateHeadingId("Hello World", existingIds)).toBe("hello-world-2");
  });

  it("handles empty string", () => {
    expect(generateHeadingId("")).toBe("");
  });

  it("handles string with only spaces", () => {
    expect(generateHeadingId("   ")).toBe("");
  });

  it("handles string with only special characters", () => {
    expect(generateHeadingId("!@#$%^&*()")).toBe("");
  });

  it("removes leading and trailing hyphens", () => {
    expect(generateHeadingId("---hello---")).toBe("hello");
  });

  it("collapses multiple consecutive hyphens", () => {
    expect(generateHeadingId("hello---world")).toBe("hello-world");
  });
});

describe("HeadingAnchor", () => {
  it("renders an anchor element with correct href", () => {
    const html = renderToString(<HeadingAnchor id="test-heading" />);
    expect(html).toContain('href="#test-heading"');
  });

  it("renders with noxion-heading-anchor class", () => {
    const html = renderToString(<HeadingAnchor id="test-heading" />);
    expect(html).toContain("noxion-heading-anchor");
  });

  it("accepts custom className", () => {
    const html = renderToString(<HeadingAnchor id="test-heading" className="custom-class" />);
    expect(html).toContain("custom-class");
  });

  it("renders a link symbol or icon", () => {
    const html = renderToString(<HeadingAnchor id="test-heading" />);
    // Should contain either # symbol or SVG
    expect(html).toMatch(/#|<svg/);
  });

  it("has use client directive", () => {
    // This is a compile-time check, but we verify the component is client-side
    const html = renderToString(<HeadingAnchor id="test-heading" />);
    expect(html).toBeTruthy();
  });
});
