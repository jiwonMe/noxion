import type { NoxionThemePackage, NoxionThemeTokens } from "./types";

export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  severity: ValidationSeverity;
  path: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
}

const REQUIRED_COLOR_KEYS = [
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
] as const;

const KNOWN_SUPPORTS = ["blog", "docs", "portfolio"] as const;

const SUPPORTS_TEMPLATE_MAP: Record<string, string[]> = {
  blog: ["home", "post", "archive", "tag"],
  docs: ["docs"],
  portfolio: ["portfolio-grid", "portfolio-project"],
};

function issue(severity: ValidationSeverity, path: string, message: string): ValidationIssue {
  return { severity, path, message };
}

function validateName(pkg: NoxionThemePackage, issues: ValidationIssue[]): void {
  if (!pkg.name || typeof pkg.name !== "string") {
    issues.push(issue("error", "name", "Theme name is required and must be a non-empty string."));
  } else if (!/^[a-z][a-z0-9-]*$/.test(pkg.name)) {
    issues.push(
      issue("warning", "name", `Theme name "${pkg.name}" should be lowercase kebab-case (e.g. "my-theme").`)
    );
  }
}

function validateColors(tokens: NoxionThemeTokens, prefix: string, issues: ValidationIssue[]): void {
  if (!tokens.colors || typeof tokens.colors !== "object") {
    issues.push(issue("error", `${prefix}.colors`, "Token colors object is required."));
    return;
  }

  for (const key of REQUIRED_COLOR_KEYS) {
    const value = tokens.colors[key];
    if (!value || typeof value !== "string") {
      issues.push(issue("error", `${prefix}.colors.${key}`, `Required color "${key}" is missing or not a string.`));
    } else if (!isValidCSSColor(value)) {
      issues.push(
        issue("warning", `${prefix}.colors.${key}`, `Color "${key}" value "${value}" may not be a valid CSS color.`)
      );
    }
  }
}

function validateFonts(tokens: NoxionThemeTokens, prefix: string, issues: ValidationIssue[]): void {
  if (!tokens.fonts) return;
  if (typeof tokens.fonts !== "object") {
    issues.push(issue("error", `${prefix}.fonts`, "Fonts must be an object."));
    return;
  }
  for (const [key, value] of Object.entries(tokens.fonts)) {
    if (value !== undefined && typeof value !== "string") {
      issues.push(issue("error", `${prefix}.fonts.${key}`, `Font "${key}" must be a string.`));
    }
  }
}

function validateSpacing(tokens: NoxionThemeTokens, prefix: string, issues: ValidationIssue[]): void {
  if (!tokens.spacing) {
    issues.push(issue("warning", `${prefix}.spacing`, "Spacing tokens are recommended (content, sidebar widths)."));
    return;
  }
  if (typeof tokens.spacing !== "object") {
    issues.push(issue("error", `${prefix}.spacing`, "Spacing must be an object."));
    return;
  }
  if (!tokens.spacing.content) {
    issues.push(issue("warning", `${prefix}.spacing.content`, "Content width spacing is recommended."));
  }
}

function validateShadows(tokens: NoxionThemeTokens, prefix: string, issues: ValidationIssue[]): void {
  if (!tokens.shadows) return;
  if (typeof tokens.shadows !== "object") {
    issues.push(issue("error", `${prefix}.shadows`, "Shadows must be an object."));
  }
}

function validateTransitions(tokens: NoxionThemeTokens, prefix: string, issues: ValidationIssue[]): void {
  if (!tokens.transitions) return;
  if (typeof tokens.transitions !== "object") {
    issues.push(issue("error", `${prefix}.transitions`, "Transitions must be an object."));
  }
}

function validateBreakpoints(tokens: NoxionThemeTokens, prefix: string, issues: ValidationIssue[]): void {
  if (!tokens.breakpoints) return;
  if (typeof tokens.breakpoints !== "object") {
    issues.push(issue("error", `${prefix}.breakpoints`, "Breakpoints must be an object."));
  }
}

function validateTokens(tokens: NoxionThemeTokens, issues: ValidationIssue[]): void {
  if (!tokens || typeof tokens !== "object") {
    issues.push(issue("error", "tokens", "Tokens object is required."));
    return;
  }

  if (!tokens.name || typeof tokens.name !== "string") {
    issues.push(issue("error", "tokens.name", "Token name is required."));
  }

  validateColors(tokens, "tokens", issues);
  validateFonts(tokens, "tokens", issues);
  validateSpacing(tokens, "tokens", issues);
  validateShadows(tokens, "tokens", issues);
  validateTransitions(tokens, "tokens", issues);
  validateBreakpoints(tokens, "tokens", issues);

  if (tokens.dark) {
    if (tokens.dark.colors) {
      validateColors(tokens.dark as NoxionThemeTokens, "tokens.dark", issues);
    } else {
      issues.push(
        issue("warning", "tokens.dark.colors", "Dark mode declared but no dark colors provided.")
      );
    }
  } else {
    issues.push(issue("warning", "tokens.dark", "No dark mode tokens. Dark mode will fall back to light colors."));
  }
}

function validateLayouts(pkg: NoxionThemePackage, issues: ValidationIssue[]): void {
  if (!pkg.layouts || typeof pkg.layouts !== "object") {
    issues.push(issue("error", "layouts", "Layouts object is required."));
    return;
  }

  const layoutKeys = Object.keys(pkg.layouts);
  if (layoutKeys.length === 0) {
    issues.push(issue("error", "layouts", "At least one layout is required."));
    return;
  }

  if (!pkg.layouts["base"] && !pkg.layouts["blog"]) {
    issues.push(
      issue("warning", "layouts", 'No "base" or "blog" layout found. Most themes provide at least one.')
    );
  }

  for (const [key, value] of Object.entries(pkg.layouts)) {
    if (typeof value !== "function") {
      issues.push(issue("error", `layouts.${key}`, `Layout "${key}" must be a React component (function).`));
    }
  }
}

function validateTemplates(pkg: NoxionThemePackage, issues: ValidationIssue[]): void {
  if (!pkg.templates || typeof pkg.templates !== "object") {
    issues.push(issue("warning", "templates", "Templates object is recommended."));
    return;
  }

  for (const [key, value] of Object.entries(pkg.templates)) {
    if (value !== undefined && typeof value !== "function") {
      issues.push(issue("error", `templates.${key}`, `Template "${key}" must be a React component (function).`));
    }
  }
}

function validateSupportsConsistency(pkg: NoxionThemePackage, issues: ValidationIssue[]): void {
  if (!pkg.supports || !Array.isArray(pkg.supports)) return;

  for (const pageType of pkg.supports) {
    if (!KNOWN_SUPPORTS.includes(pageType as (typeof KNOWN_SUPPORTS)[number])) {
      issues.push(
        issue(
          "warning",
          `supports`,
          `Unknown page type "${pageType}". Known types: ${KNOWN_SUPPORTS.join(", ")}.`
        )
      );
      continue;
    }

    const expectedTemplates = SUPPORTS_TEMPLATE_MAP[pageType];
    if (!expectedTemplates) continue;

    const templateKeys = Object.keys(pkg.templates ?? {});
    const missing = expectedTemplates.filter((t) => !templateKeys.includes(t));
    if (missing.length > 0) {
      issues.push(
        issue(
          "warning",
          `supports → templates`,
          `Theme declares support for "${pageType}" but missing templates: ${missing.join(", ")}.`
        )
      );
    }
  }
}

function validateComponents(pkg: NoxionThemePackage, issues: ValidationIssue[]): void {
  if (!pkg.components || typeof pkg.components !== "object") return;

  for (const [key, value] of Object.entries(pkg.components)) {
    if (value !== undefined && typeof value !== "function" && typeof value !== "object") {
      issues.push(
        issue("error", `components.${key}`, `Component override "${key}" must be a React component or record.`)
      );
    }
  }
}

function validateMetadata(pkg: NoxionThemePackage, issues: ValidationIssue[]): void {
  if (!pkg.metadata) {
    issues.push(issue("warning", "metadata", "Theme metadata (description, author, version) is recommended."));
    return;
  }
  if (!pkg.metadata.description) {
    issues.push(issue("warning", "metadata.description", "Theme description is recommended."));
  }
  if (!pkg.metadata.version) {
    issues.push(issue("warning", "metadata.version", "Theme version is recommended for tracking."));
  }
}

function isValidCSSColor(value: string): boolean {
  if (value.startsWith("#")) {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(value);
  }
  if (/^(rgb|hsl|oklch|oklab|lab|lch|hwb|color)\(/.test(value)) {
    return true;
  }
  if (/^[a-z]+$/i.test(value)) {
    return true;
  }
  return false;
}

export function validateTheme(pkg: NoxionThemePackage): ValidationResult {
  const issues: ValidationIssue[] = [];

  validateName(pkg, issues);
  validateTokens(pkg.tokens, issues);
  validateLayouts(pkg, issues);
  validateTemplates(pkg, issues);
  validateSupportsConsistency(pkg, issues);
  validateComponents(pkg, issues);
  validateMetadata(pkg, issues);

  const hasErrors = issues.some((i) => i.severity === "error");
  return { valid: !hasErrors, issues };
}

export function formatValidationResult(result: ValidationResult): string {
  if (result.issues.length === 0) {
    return "✓ Theme is valid. No issues found.";
  }

  const errors = result.issues.filter((i) => i.severity === "error");
  const warnings = result.issues.filter((i) => i.severity === "warning");

  const lines: string[] = [];

  if (errors.length > 0) {
    lines.push(`✗ ${errors.length} error(s):`);
    for (const e of errors) {
      lines.push(`  ERROR [${e.path}] ${e.message}`);
    }
  }

  if (warnings.length > 0) {
    lines.push(`⚠ ${warnings.length} warning(s):`);
    for (const w of warnings) {
      lines.push(`  WARN  [${w.path}] ${w.message}`);
    }
  }

  lines.push("");
  lines.push(result.valid ? "✓ Theme is valid (warnings only)." : "✗ Theme is invalid. Fix errors above.");

  return lines.join("\n");
}
