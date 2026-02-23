import { describe, it, expect } from "bun:test";
import { extendTheme } from "../theme/extend-theme";
import type {
  NoxionThemePackage,
  NoxionThemeTokens,
  NoxionLayoutProps,
  NoxionTemplateProps,
  HeaderProps,
} from "../theme/types";
import type { ComponentType } from "react";

const baseTokens: NoxionThemeTokens = {
  name: "parent",
  colors: {
    primary: "#2563eb",
    primaryForeground: "#ffffff",
    background: "#ffffff",
    foreground: "#171717",
    muted: "#f5f5f5",
    mutedForeground: "#737373",
    border: "#e5e5e5",
    accent: "#f5f5f5",
    accentForeground: "#171717",
    card: "#ffffff",
    cardForeground: "#171717",
  },
  fonts: {
    sans: "Inter, sans-serif",
    mono: "JetBrains Mono, monospace",
  },
  spacing: {
    content: "720px",
    sidebar: "260px",
  },
  borderRadius: "0.5rem",
  shadows: {
    sm: "0 1px 2px rgba(0,0,0,0.05)",
    md: "0 4px 6px rgba(0,0,0,0.1)",
  },
  dark: {
    colors: {
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      background: "#0a0a0a",
      foreground: "#ededed",
      muted: "#1a1a1a",
      mutedForeground: "#888888",
      border: "#1f1f1f",
      accent: "#1a1a1a",
      accentForeground: "#ededed",
      card: "#111111",
      cardForeground: "#ededed",
    },
  },
};

const MockLayout = (() => null) as ComponentType<NoxionLayoutProps>;
const MockTemplate = (() => null) as ComponentType<NoxionTemplateProps>;
const MockHeader = (() => null) as ComponentType<HeaderProps>;

const parentTheme: NoxionThemePackage = {
  name: "parent-theme",
  tokens: baseTokens,
  layouts: { blog: MockLayout },
  templates: { home: MockTemplate, post: MockTemplate },
  components: { Header: MockHeader },
  stylesheet: "@parent/styles",
  supports: ["blog"],
};

describe("extendTheme", () => {
  it("returns parent theme when overrides are empty", () => {
    const child = extendTheme(parentTheme, {});
    expect(child.name).toBe("parent-theme");
    expect(child.tokens).toBe(parentTheme.tokens);
    expect(child.layouts).toBe(parentTheme.layouts);
    expect(child.templates).toBe(parentTheme.templates);
    expect(child.components).toBe(parentTheme.components);
    expect(child.stylesheet).toBe("@parent/styles");
  });

  it("overrides name", () => {
    const child = extendTheme(parentTheme, { name: "child-theme" });
    expect(child.name).toBe("child-theme");
  });

  it("deep merges token colors", () => {
    const child = extendTheme(parentTheme, {
      tokens: {
        colors: { primary: "#ff0000" },
      },
    });
    expect(child.tokens.colors.primary).toBe("#ff0000");
    expect(child.tokens.colors.background).toBe("#ffffff");
    expect(child.tokens.colors.foreground).toBe("#171717");
  });

  it("deep merges token fonts", () => {
    const child = extendTheme(parentTheme, {
      tokens: {
        fonts: { serif: "Georgia, serif" },
      },
    });
    expect(child.tokens.fonts?.sans).toBe("Inter, sans-serif");
    expect(child.tokens.fonts?.serif).toBe("Georgia, serif");
    expect(child.tokens.fonts?.mono).toBe("JetBrains Mono, monospace");
  });

  it("deep merges token spacing", () => {
    const child = extendTheme(parentTheme, {
      tokens: {
        spacing: { content: "800px", sidebar: "300px" },
      },
    });
    expect(child.tokens.spacing?.content).toBe("800px");
    expect(child.tokens.spacing?.sidebar).toBe("300px");
  });

  it("overrides borderRadius", () => {
    const child = extendTheme(parentTheme, {
      tokens: { borderRadius: "1rem" },
    });
    expect(child.tokens.borderRadius).toBe("1rem");
  });

  it("deep merges shadows", () => {
    const child = extendTheme(parentTheme, {
      tokens: {
        shadows: { lg: "0 10px 15px rgba(0,0,0,0.2)" },
      },
    });
    expect(child.tokens.shadows?.sm).toBe("0 1px 2px rgba(0,0,0,0.05)");
    expect(child.tokens.shadows?.md).toBe("0 4px 6px rgba(0,0,0,0.1)");
    expect(child.tokens.shadows?.lg).toBe("0 10px 15px rgba(0,0,0,0.2)");
  });

  it("deep merges dark mode colors", () => {
    const child = extendTheme(parentTheme, {
      tokens: {
        dark: {
          colors: {
            primary: "#60a5fa",
            primaryForeground: "#ffffff",
            background: "#000000",
            foreground: "#ffffff",
            muted: "#222222",
            mutedForeground: "#999999",
            border: "#333333",
            accent: "#222222",
            accentForeground: "#ffffff",
            card: "#111111",
            cardForeground: "#ffffff",
          },
        },
      },
    });
    expect(child.tokens.dark?.colors?.primary).toBe("#60a5fa");
    expect(child.tokens.dark?.colors?.background).toBe("#000000");
  });

  it("merges layouts — child overrides, parent keys fall through", () => {
    const DocsLayout = (() => null) as ComponentType<NoxionLayoutProps>;
    const child = extendTheme(parentTheme, {
      layouts: { docs: DocsLayout },
    });
    expect(child.layouts.blog).toBe(MockLayout);
    expect(child.layouts.docs).toBe(DocsLayout);
  });

  it("merges templates — child overrides specific, parent keys preserved", () => {
    const CustomHome = (() => null) as ComponentType<NoxionTemplateProps>;
    const DocsPage = (() => null) as ComponentType<NoxionTemplateProps>;
    const child = extendTheme(parentTheme, {
      templates: { home: CustomHome, "docs/page": DocsPage },
    });
    expect(child.templates.home).toBe(CustomHome);
    expect(child.templates.post).toBe(MockTemplate);
    expect(child.templates["docs/page"]).toBe(DocsPage);
  });

  it("merges components — child overrides specific, parent keys preserved", () => {
    const CustomHeader = (() => null) as ComponentType<HeaderProps>;
    const child = extendTheme(parentTheme, {
      components: { Header: CustomHeader },
    });
    expect(child.components.Header).toBe(CustomHeader);
  });

  it("overrides stylesheet", () => {
    const child = extendTheme(parentTheme, {
      stylesheet: "@child/styles",
    });
    expect(child.stylesheet).toBe("@child/styles");
  });

  it("merges supports arrays with deduplication", () => {
    const child = extendTheme(parentTheme, {
      supports: ["docs", "blog"],
    });
    expect(child.supports).toEqual(["blog", "docs"]);
  });

  it("handles parent without supports", () => {
    const noSupports: NoxionThemePackage = { ...parentTheme, supports: undefined };
    const child = extendTheme(noSupports, {
      supports: ["docs"],
    });
    expect(child.supports).toEqual(["docs"]);
  });

  it("preserves parent supports when child has none", () => {
    const child = extendTheme(parentTheme, {});
    expect(child.supports).toEqual(["blog"]);
  });

  it("does not mutate parent theme", () => {
    const originalColors = { ...parentTheme.tokens.colors };
    extendTheme(parentTheme, {
      tokens: { colors: { primary: "#ff0000" } },
    });
    expect(parentTheme.tokens.colors.primary).toBe(originalColors.primary);
  });
});
