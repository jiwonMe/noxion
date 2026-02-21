import type { NoxionThemeTokens } from "@noxion/renderer";

export const defaultTokens: NoxionThemeTokens = {
  name: "default",
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
    sans: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
  },
  spacing: {
    content: "720px",
    sidebar: "260px",
  },
  borderRadius: "0.5rem",
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.04)",
    md: "0 4px 12px rgba(0, 0, 0, 0.06)",
    lg: "0 12px 32px rgba(0, 0, 0, 0.08)",
    xl: "0 24px 48px rgba(0, 0, 0, 0.1)",
  },
  transitions: {
    fast: "120ms ease",
    normal: "200ms ease",
    slow: "300ms ease",
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
