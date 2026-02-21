import type { NoxionThemeTokens } from "@noxion/renderer";

export const defaultTokens: NoxionThemeTokens = {
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
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  },
  transitions: {
    fast: "150ms ease",
    normal: "250ms ease",
    slow: "350ms ease",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
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
};
