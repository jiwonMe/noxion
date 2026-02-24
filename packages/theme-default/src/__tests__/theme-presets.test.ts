import { describe, it, expect } from "bun:test";
import { defaultThemePackage } from "../themes/default";
import { generateThemeStylesheet } from "@noxion/renderer";

describe("default theme", () => {
  it("has a name", () => {
    expect(defaultThemePackage.name).toBe("default");
  });

  it("has required color tokens", () => {
    const requiredKeys = [
      "primary",
      "primaryForeground",
      "background",
      "foreground",
      "muted",
      "mutedForeground",
      "border",
      "accent",
      "accentForeground",
      "card",
      "cardForeground",
    ];
    for (const key of requiredKeys) {
      expect(defaultThemePackage.tokens.colors[key]).toBeTruthy();
    }
  });

  it("has dark mode colors", () => {
    expect(defaultThemePackage.tokens.dark).toBeDefined();
    expect(defaultThemePackage.tokens.dark?.colors?.background).toBeTruthy();
    expect(defaultThemePackage.tokens.dark?.colors?.foreground).toBeTruthy();
  });

  it("has font definitions", () => {
    expect(defaultThemePackage.tokens.fonts?.sans).toBeTruthy();
    expect(defaultThemePackage.tokens.fonts?.mono).toBeTruthy();
  });

  it("has spacing definitions", () => {
    expect(defaultThemePackage.tokens.spacing?.content).toBeTruthy();
    expect(defaultThemePackage.tokens.spacing?.sidebar).toBeTruthy();
  });

  it("has layouts", () => {
    expect(Object.keys(defaultThemePackage.layouts).length).toBeGreaterThan(0);
  });

  it("has templates", () => {
    expect(Object.keys(defaultThemePackage.templates).length).toBeGreaterThan(0);
  });

  it("has supports array", () => {
    expect(Array.isArray(defaultThemePackage.supports)).toBe(true);
    expect(defaultThemePackage.supports!.length).toBeGreaterThan(0);
  });

  it("has metadata", () => {
    expect(defaultThemePackage.metadata).toBeDefined();
  });

  it("generates valid CSS", () => {
    const css = generateThemeStylesheet(defaultThemePackage);
    expect(css).toContain(":root");
    expect(css).toContain("--noxion-primary");
    expect(css).toContain("--noxion-background");
    expect(css).toContain('[data-theme="dark"]');
  });

  it("has all page type support", () => {
    expect(defaultThemePackage.supports).toContain("blog");
    expect(defaultThemePackage.supports).toContain("docs");
    expect(defaultThemePackage.supports).toContain("portfolio");
  });
});
