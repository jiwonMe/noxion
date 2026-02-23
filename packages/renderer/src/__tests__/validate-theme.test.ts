import { describe, it, expect } from "bun:test";
import { validateTheme, formatValidationResult } from "../theme/validate-theme";
import type { ValidationResult } from "../theme/validate-theme";
import { defaultThemePackage } from "../themes/default";
import { inkThemePackage } from "../themes/ink";
import { editorialThemePackage } from "../themes/editorial";
import { folioThemePackage } from "../themes/folio";
import type { NoxionThemePackage } from "../theme/types";

function makeMinimalTheme(overrides: Partial<NoxionThemePackage> = {}): NoxionThemePackage {
  return {
    name: "test-theme",
    tokens: {
      name: "test-theme",
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
      fonts: { sans: "Inter, sans-serif", mono: "monospace" },
      spacing: { content: "720px", sidebar: "260px" },
      borderRadius: "0.5rem",
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
    },
    layouts: { base: (() => null) as any },
    templates: { home: (() => null) as any },
    components: {},
    supports: ["blog"],
    metadata: { description: "Test theme", version: "0.1.0" },
    ...overrides,
  };
}

describe("validateTheme", () => {
  describe("built-in theme presets pass validation", () => {
    const presets: [string, NoxionThemePackage][] = [
      ["default", defaultThemePackage],
      ["ink", inkThemePackage],
      ["editorial", editorialThemePackage],
      ["folio", folioThemePackage],
    ];

    it.each(presets)("%s theme is valid", (_name, theme) => {
      const result = validateTheme(theme);
      const errors = result.issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
      expect(result.valid).toBe(true);
    });
  });

  describe("name validation", () => {
    it("rejects missing name", () => {
      const theme = makeMinimalTheme({ name: "" });
      const result = validateTheme(theme);
      expect(result.issues.some((i) => i.path === "name" && i.severity === "error")).toBe(true);
    });

    it("warns on non-kebab-case name", () => {
      const theme = makeMinimalTheme({ name: "MyTheme" });
      const result = validateTheme(theme);
      expect(result.issues.some((i) => i.path === "name" && i.severity === "warning")).toBe(true);
      expect(result.valid).toBe(true);
    });

    it("accepts kebab-case name", () => {
      const theme = makeMinimalTheme({ name: "my-theme" });
      const result = validateTheme(theme);
      expect(result.issues.some((i) => i.path === "name")).toBe(false);
    });
  });

  describe("token validation", () => {
    it("rejects missing required colors", () => {
      const theme = makeMinimalTheme();
      (theme.tokens.colors as any) = { primary: "#fff" };
      const result = validateTheme(theme);
      const colorErrors = result.issues.filter(
        (i) => i.path.startsWith("tokens.colors.") && i.severity === "error"
      );
      expect(colorErrors.length).toBeGreaterThan(0);
      expect(result.valid).toBe(false);
    });

    it("warns on invalid hex color format", () => {
      const theme = makeMinimalTheme();
      theme.tokens.colors.primary = "not-a-color-123";
      const result = validateTheme(theme);
      expect(
        result.issues.some(
          (i) => i.path === "tokens.colors.primary" && i.severity === "warning"
        )
      ).toBe(true);
    });

    it("accepts rgb/hsl/oklch colors", () => {
      const theme = makeMinimalTheme();
      theme.tokens.colors.primary = "rgb(37, 99, 235)";
      theme.tokens.colors.accent = "hsl(220, 80%, 50%)";
      const result = validateTheme(theme);
      expect(
        result.issues.some(
          (i) => i.path === "tokens.colors.primary" && i.severity === "warning"
        )
      ).toBe(false);
    });

    it("accepts named CSS colors", () => {
      const theme = makeMinimalTheme();
      theme.tokens.colors.primary = "blue";
      const result = validateTheme(theme);
      expect(
        result.issues.some(
          (i) => i.path === "tokens.colors.primary" && i.severity === "warning"
        )
      ).toBe(false);
    });

    it("warns when dark mode is missing", () => {
      const theme = makeMinimalTheme();
      delete (theme.tokens as any).dark;
      const result = validateTheme(theme);
      expect(result.issues.some((i) => i.path === "tokens.dark" && i.severity === "warning")).toBe(true);
    });

    it("warns when spacing is missing", () => {
      const theme = makeMinimalTheme();
      delete (theme.tokens as any).spacing;
      const result = validateTheme(theme);
      expect(result.issues.some((i) => i.path.startsWith("tokens.spacing"))).toBe(true);
    });
  });

  describe("layout validation", () => {
    it("rejects empty layouts", () => {
      const theme = makeMinimalTheme({ layouts: {} });
      const result = validateTheme(theme);
      expect(result.issues.some((i) => i.path === "layouts" && i.severity === "error")).toBe(true);
      expect(result.valid).toBe(false);
    });

    it("rejects non-function layout values", () => {
      const theme = makeMinimalTheme({ layouts: { base: "not a function" as any } });
      const result = validateTheme(theme);
      expect(
        result.issues.some((i) => i.path === "layouts.base" && i.severity === "error")
      ).toBe(true);
    });
  });

  describe("supports ↔ templates consistency", () => {
    it("warns when blog is supported but home template is missing", () => {
      const theme = makeMinimalTheme({
        supports: ["blog"],
        templates: {},
      });
      const result = validateTheme(theme);
      expect(
        result.issues.some(
          (i) => i.path === "supports → templates" && i.message.includes("blog") && i.message.includes("home")
        )
      ).toBe(true);
    });

    it("warns when docs is supported but docs template is missing", () => {
      const theme = makeMinimalTheme({
        supports: ["docs"],
        templates: { home: (() => null) as any },
      });
      const result = validateTheme(theme);
      expect(
        result.issues.some(
          (i) => i.path === "supports → templates" && i.message.includes("docs")
        )
      ).toBe(true);
    });

    it("warns on unknown supports value", () => {
      const theme = makeMinimalTheme({ supports: ["unknown-type"] });
      const result = validateTheme(theme);
      expect(
        result.issues.some((i) => i.path === "supports" && i.message.includes("unknown-type"))
      ).toBe(true);
    });

    it("no warnings when all blog templates are present", () => {
      const fn = (() => null) as any;
      const theme = makeMinimalTheme({
        supports: ["blog"],
        templates: { home: fn, post: fn, archive: fn, tag: fn },
      });
      const result = validateTheme(theme);
      expect(
        result.issues.some((i) => i.path === "supports → templates" && i.message.includes("blog"))
      ).toBe(false);
    });
  });

  describe("metadata validation", () => {
    it("warns when metadata is missing", () => {
      const theme = makeMinimalTheme({ metadata: undefined });
      const result = validateTheme(theme);
      expect(result.issues.some((i) => i.path === "metadata" && i.severity === "warning")).toBe(true);
    });

    it("warns when description is missing", () => {
      const theme = makeMinimalTheme({ metadata: { version: "0.1.0" } });
      const result = validateTheme(theme);
      expect(
        result.issues.some((i) => i.path === "metadata.description" && i.severity === "warning")
      ).toBe(true);
    });
  });

  describe("overall result", () => {
    it("valid=true when only warnings exist", () => {
      const theme = makeMinimalTheme();
      const result = validateTheme(theme);
      const errors = result.issues.filter((i) => i.severity === "error");
      expect(errors).toEqual([]);
      expect(result.valid).toBe(true);
    });

    it("valid=false when errors exist", () => {
      const theme = makeMinimalTheme({ name: "", layouts: {} });
      const result = validateTheme(theme);
      expect(result.valid).toBe(false);
    });
  });
});

describe("formatValidationResult", () => {
  it("shows success for clean result", () => {
    const result: ValidationResult = { valid: true, issues: [] };
    const output = formatValidationResult(result);
    expect(output).toContain("No issues found");
  });

  it("formats errors and warnings", () => {
    const result: ValidationResult = {
      valid: false,
      issues: [
        { severity: "error", path: "name", message: "Name is required." },
        { severity: "warning", path: "metadata", message: "Metadata recommended." },
      ],
    };
    const output = formatValidationResult(result);
    expect(output).toContain("1 error(s)");
    expect(output).toContain("1 warning(s)");
    expect(output).toContain("ERROR [name]");
    expect(output).toContain("WARN  [metadata]");
    expect(output).toContain("invalid");
  });

  it("shows valid with warnings", () => {
    const result: ValidationResult = {
      valid: true,
      issues: [{ severity: "warning", path: "metadata", message: "Metadata recommended." }],
    };
    const output = formatValidationResult(result);
    expect(output).toContain("warnings only");
  });
});
