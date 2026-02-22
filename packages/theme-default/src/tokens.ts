import type { NoxionThemeTokens } from "@noxion/renderer";

export const defaultTokens: NoxionThemeTokens = {
  name: "default",
  colors: {
    primary: "#000000",
    primaryForeground: "#ffffff",
    background: "#ffffff",
    foreground: "#111111",
    muted: "#f2f2f2",
    mutedForeground: "#6b6b6b",
    border: "#e8e8e8",
    accent: "#f7f7f7",
    accentForeground: "#111111",
    card: "#ffffff",
    cardForeground: "#111111",
  },
  fonts: {
    sans: '"Geist", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    serif: 'Georgia, "Times New Roman", serif',
    mono: '"Geist Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace',
  },
  spacing: {
    content: "720px",
    sidebar: "260px",
  },
  borderRadius: "0.5rem",
  shadows: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.04), 0 1px 1px rgba(0, 0, 0, 0.03)",
    md: "0 4px 8px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
    xl: "0 16px 40px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  transitions: {
    fast: "100ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "180ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "280ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
  dark: {
    colors: {
      primary: "#ffffff",
      primaryForeground: "#000000",
      background: "#0c0c0c",
      foreground: "#ededed",
      muted: "#1a1a1a",
      mutedForeground: "#888888",
      border: "#272727",
      accent: "#1e1e1e",
      accentForeground: "#ededed",
      card: "#141414",
      cardForeground: "#ededed",
    },
  },
};
