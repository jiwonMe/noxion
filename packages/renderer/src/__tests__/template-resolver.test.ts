import { describe, it, expect } from "bun:test";
import { resolveTemplate } from "../theme/template-resolver";
import type { NoxionTemplateMap, NoxionTemplateProps } from "../theme/types";
import type { ComponentType } from "react";

describe("resolveTemplate", () => {
  const MockHome = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockPost = (() => null) as ComponentType<NoxionTemplateProps>;
  const MockArchive = (() => null) as ComponentType<NoxionTemplateProps>;
  const FallbackTemplate = (() => null) as ComponentType<NoxionTemplateProps>;

  const templates: Partial<NoxionTemplateMap> = {
    home: MockHome,
    post: MockPost,
    archive: MockArchive,
  };

  it("returns matching template for page type", () => {
    expect(resolveTemplate(templates, "home")).toBe(MockHome);
    expect(resolveTemplate(templates, "post")).toBe(MockPost);
    expect(resolveTemplate(templates, "archive")).toBe(MockArchive);
  });

  it("returns fallback when page type not found", () => {
    const result = resolveTemplate(templates, "unknown", FallbackTemplate);
    expect(result).toBe(FallbackTemplate);
  });

  it("falls back to home template when no fallback provided", () => {
    const result = resolveTemplate(templates, "unknown");
    expect(result).toBe(MockHome);
  });

  it("returns undefined when no match, no fallback, and no home template", () => {
    const result = resolveTemplate({}, "unknown");
    expect(result).toBeUndefined();
  });

  it("prefers explicit fallback over home template", () => {
    const result = resolveTemplate(templates, "unknown", FallbackTemplate);
    expect(result).toBe(FallbackTemplate);
  });
});
