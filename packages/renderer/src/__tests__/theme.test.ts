import { describe, it, expect } from "bun:test";
import { defineTheme, defaultTheme } from "../theme/define-theme";
import { generateCSSVariables } from "../theme/css-generator";
import { resolveComponents } from "../theme/component-resolver";
import type { NoxionTheme, ComponentOverrides, HeaderProps } from "../theme/types";
import type { ComponentType } from "react";

describe("defineTheme", () => {
  it("returns the theme object as-is (identity helper)", () => {
    const theme: NoxionTheme = {
      name: "custom",
      colors: {
        primary: "#000",
        primaryForeground: "#fff",
        background: "#fff",
        foreground: "#000",
        muted: "#f5f5f5",
        mutedForeground: "#737373",
        border: "#e5e5e5",
        accent: "#f5f5f5",
        accentForeground: "#171717",
        card: "#fff",
        cardForeground: "#000",
      },
    };
    const result = defineTheme(theme);
    expect(result).toEqual(theme);
  });

  it("defaultTheme has required color properties", () => {
    expect(defaultTheme.name).toBe("default");
    expect(defaultTheme.colors.primary).toBeDefined();
    expect(defaultTheme.colors.background).toBeDefined();
    expect(defaultTheme.colors.foreground).toBeDefined();
  });

  it("defaultTheme includes dark mode overrides", () => {
    expect(defaultTheme.dark).toBeDefined();
    expect(defaultTheme.dark?.colors?.background).toBeDefined();
    expect(defaultTheme.dark?.colors?.foreground).toBeDefined();
  });

  it("defaultTheme has font definitions", () => {
    expect(defaultTheme.fonts).toBeDefined();
    expect(defaultTheme.fonts?.sans).toBeDefined();
  });
});

describe("generateCSSVariables", () => {
  const minimalTheme: NoxionTheme = {
    name: "test",
    colors: {
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#0a0a0a",
      muted: "#f5f5f5",
      mutedForeground: "#737373",
      border: "#e5e5e5",
      accent: "#f5f5f5",
      accentForeground: "#171717",
      card: "#ffffff",
      cardForeground: "#0a0a0a",
    },
  };

  it("generates CSS variables with --noxion- prefix", () => {
    const css = generateCSSVariables(minimalTheme);
    expect(css).toContain("--noxion-primary");
    expect(css).toContain("--noxion-background");
    expect(css).toContain("--noxion-foreground");
  });

  it("wraps light mode variables in :root selector", () => {
    const css = generateCSSVariables(minimalTheme);
    expect(css).toContain(":root");
  });

  it("includes color values from theme", () => {
    const css = generateCSSVariables(minimalTheme);
    expect(css).toContain("#3b82f6");
    expect(css).toContain("#ffffff");
  });

  it("generates font variables when fonts are provided", () => {
    const theme: NoxionTheme = {
      ...minimalTheme,
      fonts: { sans: "Inter, sans-serif", mono: "JetBrains Mono, monospace" },
    };
    const css = generateCSSVariables(theme);
    expect(css).toContain("--noxion-font-sans");
    expect(css).toContain("Inter, sans-serif");
    expect(css).toContain("--noxion-font-mono");
  });

  it("generates spacing variables when spacing is provided", () => {
    const theme: NoxionTheme = {
      ...minimalTheme,
      spacing: { content: "720px", sidebar: "280px" },
    };
    const css = generateCSSVariables(theme);
    expect(css).toContain("--noxion-spacing-content");
    expect(css).toContain("720px");
  });

  it("generates border-radius variable when provided", () => {
    const theme: NoxionTheme = {
      ...minimalTheme,
      borderRadius: "0.5rem",
    };
    const css = generateCSSVariables(theme);
    expect(css).toContain("--noxion-border-radius");
    expect(css).toContain("0.5rem");
  });

  it("generates dark mode overrides with [data-theme='dark'] selector", () => {
    const theme: NoxionTheme = {
      ...minimalTheme,
      dark: {
        colors: {
          primary: "#60a5fa",
          primaryForeground: "#ffffff",
          background: "#0a0a0a",
          foreground: "#fafafa",
          muted: "#262626",
          mutedForeground: "#a3a3a3",
          border: "#262626",
          accent: "#262626",
          accentForeground: "#fafafa",
          card: "#0a0a0a",
          cardForeground: "#fafafa",
        },
      },
    };
    const css = generateCSSVariables(theme);
    expect(css).toContain("[data-theme=\"dark\"]");
    expect(css).toContain("#0a0a0a");
    expect(css).toContain("#60a5fa");
  });
});

describe("resolveComponents", () => {
  it("returns defaults when no overrides provided", () => {
    const MockHeader = (() => null) as ComponentType<HeaderProps>;
    const defaults: ComponentOverrides = { Header: MockHeader };
    const resolved = resolveComponents(defaults, {});
    expect(resolved.Header).toBe(MockHeader);
  });

  it("overrides specific components while keeping others", () => {
    const DefaultHeader = (() => null) as ComponentType<HeaderProps>;
    const CustomHeader = (() => null) as ComponentType<HeaderProps>;
    const defaults: ComponentOverrides = { Header: DefaultHeader };
    const overrides: ComponentOverrides = { Header: CustomHeader };
    const resolved = resolveComponents(defaults, overrides);
    expect(resolved.Header).toBe(CustomHeader);
  });

  it("handles partial overrides", () => {
    const DefaultHeader = (() => null) as ComponentType<HeaderProps>;
    const defaults: ComponentOverrides = { Header: DefaultHeader };
    const resolved = resolveComponents(defaults, { Footer: (() => null) as never });
    expect(resolved.Header).toBe(DefaultHeader);
    expect(resolved.Footer).toBeDefined();
  });

  it("merges NotionBlock overrides", () => {
    const DefaultCode = (() => null) as ComponentType<unknown>;
    const CustomCode = (() => null) as ComponentType<unknown>;
    const CustomImage = (() => null) as ComponentType<unknown>;
    const defaults: ComponentOverrides = {
      NotionBlock: { code: DefaultCode },
    };
    const overrides: ComponentOverrides = {
      NotionBlock: { code: CustomCode, image: CustomImage },
    };
    const resolved = resolveComponents(defaults, overrides);
    expect(resolved.NotionBlock?.code).toBe(CustomCode);
    expect(resolved.NotionBlock?.image).toBe(CustomImage);
  });
});
