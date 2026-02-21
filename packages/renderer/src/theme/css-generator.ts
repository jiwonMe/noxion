import type { NoxionTheme } from "./types";

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
