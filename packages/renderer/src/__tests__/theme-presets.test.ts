import { describe, it, expect } from "bun:test";
import { defaultThemePackage } from "../themes/default";
import { inkThemePackage } from "../themes/ink";
import { editorialThemePackage } from "../themes/editorial";
import { folioThemePackage } from "../themes/folio";
import type { NoxionThemePackage } from "../theme/types";
import { generateThemeStylesheet } from "../theme/css-generator";

const allThemes: [string, NoxionThemePackage][] = [
  ["default", defaultThemePackage],
  ["ink", inkThemePackage],
  ["editorial", editorialThemePackage],
  ["folio", folioThemePackage],
];

describe("theme presets", () => {
  describe.each(allThemes)("%s", (_name, theme) => {
    it("has a name", () => {
      expect(theme.name).toBeTruthy();
      expect(typeof theme.name).toBe("string");
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
        expect(theme.tokens.colors[key]).toBeTruthy();
      }
    });

    it("has dark mode colors", () => {
      expect(theme.tokens.dark).toBeDefined();
      expect(theme.tokens.dark?.colors?.background).toBeTruthy();
      expect(theme.tokens.dark?.colors?.foreground).toBeTruthy();
    });

    it("has font definitions", () => {
      expect(theme.tokens.fonts?.sans).toBeTruthy();
      expect(theme.tokens.fonts?.mono).toBeTruthy();
    });

    it("has spacing definitions", () => {
      expect(theme.tokens.spacing?.content).toBeTruthy();
      expect(theme.tokens.spacing?.sidebar).toBeTruthy();
    });

    it("has layouts", () => {
      expect(Object.keys(theme.layouts).length).toBeGreaterThan(0);
    });

    it("has templates", () => {
      expect(Object.keys(theme.templates).length).toBeGreaterThan(0);
    });

    it("has supports array", () => {
      expect(Array.isArray(theme.supports)).toBe(true);
      expect(theme.supports!.length).toBeGreaterThan(0);
    });

    it("has metadata", () => {
      expect(theme.metadata).toBeDefined();
    });

    it("generates valid CSS", () => {
      const css = generateThemeStylesheet(theme);
      expect(css).toContain(":root");
      expect(css).toContain("--noxion-primary");
      expect(css).toContain("--noxion-background");
      expect(css).toContain('[data-theme="dark"]');
    });
  });

  it("default theme has all page type support", () => {
    expect(defaultThemePackage.supports).toContain("blog");
    expect(defaultThemePackage.supports).toContain("docs");
    expect(defaultThemePackage.supports).toContain("portfolio");
  });

  it("ink theme supports blog and docs", () => {
    expect(inkThemePackage.supports).toContain("blog");
    expect(inkThemePackage.supports).toContain("docs");
  });

  it("editorial theme supports blog", () => {
    expect(editorialThemePackage.supports).toContain("blog");
  });

  it("folio theme supports portfolio", () => {
    expect(folioThemePackage.supports).toContain("portfolio");
  });

  it("ink theme has monospace-focused fonts", () => {
    expect(inkThemePackage.tokens.fonts?.mono).toContain("IBM Plex Mono");
  });

  it("editorial theme has serif display font", () => {
    expect(editorialThemePackage.tokens.fonts?.display).toContain("Playfair Display");
  });

  it("folio theme has zero border radius", () => {
    expect(folioThemePackage.tokens.borderRadius).toBe("0");
  });

  it("ink theme has no shadows", () => {
    expect(inkThemePackage.tokens.shadows?.sm).toBe("none");
    expect(inkThemePackage.tokens.shadows?.md).toBe("none");
  });

  it("editorial theme has warm background", () => {
    expect(editorialThemePackage.tokens.colors.background).toBe("#fdfcfa");
  });

  it("each theme has a unique name", () => {
    const names = allThemes.map(([, t]) => t.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("ink inherits templates from default", () => {
    expect(inkThemePackage.templates.home).toBe(defaultThemePackage.templates.home);
    expect(inkThemePackage.templates.post).toBe(defaultThemePackage.templates.post);
  });

  it("editorial inherits layouts from default", () => {
    expect(editorialThemePackage.layouts.blog).toBe(defaultThemePackage.layouts.blog);
    expect(editorialThemePackage.layouts.docs).toBe(defaultThemePackage.layouts.docs);
  });

  it("themes with stylesheets have valid CSS strings", () => {
    const themesWithStylesheets = allThemes.filter(([, t]) => t.stylesheet);
    for (const [name, theme] of themesWithStylesheets) {
      expect(typeof theme.stylesheet).toBe("string");
      expect(theme.stylesheet!.length).toBeGreaterThan(0);
    }
  });
});
