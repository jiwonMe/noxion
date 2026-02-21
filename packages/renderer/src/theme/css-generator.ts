import type { NoxionTheme, NoxionThemeTokens, NoxionThemePackage } from "./types";

export function generateCSSVariables(theme: NoxionTheme): string {
  const lightVars = buildVariables(theme);
  let css = `:root {\n${lightVars}}\n`;

  if (theme.dark) {
    const darkVars = buildVariables({
      ...theme,
      ...theme.dark,
      name: theme.name,
    } as NoxionTheme);
    css += `\n[data-theme="dark"] {\n${darkVars}}\n`;
  }

  return css;
}

export function generateThemeStylesheet(themePackage: NoxionThemePackage): string {
  const tokens = themePackage.tokens;
  const lightVars = buildTokenVariables(tokens);
  let css = `:root {\n${lightVars}}\n`;

  if (tokens.dark) {
    const darkTokens: NoxionThemeTokens = {
      ...tokens,
      ...tokens.dark,
      name: tokens.name,
    } as NoxionThemeTokens;
    const darkVars = buildTokenVariables(darkTokens);
    css += `\n[data-theme="dark"] {\n${darkVars}}\n`;
  }

  return css;
}

function buildVariables(theme: NoxionTheme): string {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(theme.colors)) {
    lines.push(`  --noxion-${key}: ${value};`);
  }

  if (theme.fonts) {
    for (const [key, value] of Object.entries(theme.fonts)) {
      if (value) {
        lines.push(`  --noxion-font-${key}: ${value};`);
      }
    }
  }

  if (theme.spacing) {
    for (const [key, value] of Object.entries(theme.spacing)) {
      lines.push(`  --noxion-spacing-${key}: ${value};`);
    }
  }

  if (theme.borderRadius) {
    lines.push(`  --noxion-border-radius: ${theme.borderRadius};`);
  }

  return lines.join("\n") + "\n";
}

function buildTokenVariables(tokens: NoxionThemeTokens): string {
  let result = buildVariables(tokens);
  const lines: string[] = [];

  if (tokens.shadows) {
    for (const [key, value] of Object.entries(tokens.shadows)) {
      if (value) {
        lines.push(`  --noxion-shadow-${key}: ${value};`);
      }
    }
  }

  if (tokens.transitions) {
    for (const [key, value] of Object.entries(tokens.transitions)) {
      if (value) {
        lines.push(`  --noxion-transition-${key}: ${value};`);
      }
    }
  }

  if (tokens.breakpoints) {
    for (const [key, value] of Object.entries(tokens.breakpoints)) {
      if (value) {
        lines.push(`  --noxion-breakpoint-${key}: ${value};`);
      }
    }
  }

  if (lines.length > 0) {
    result = result.trimEnd() + "\n" + lines.join("\n") + "\n";
  }

  return result;
}
