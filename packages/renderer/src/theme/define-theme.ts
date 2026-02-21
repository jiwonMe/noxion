import type { NoxionTheme } from "./types";

export function defineTheme<T extends NoxionTheme>(theme: T): T {
  return theme;
}

export const defaultTheme: NoxionTheme = defineTheme({
  name: "default",
  colors: {
    primary: "#2563eb",
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
  fonts: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace",
  },
  spacing: {
    content: "720px",
    sidebar: "280px",
  },
  borderRadius: "0.5rem",
  dark: {
    colors: {
      primary: "#3b82f6",
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
});
