import { extendTheme } from "@noxion/renderer";
import type { NoxionThemePackage } from "@noxion/renderer";

const baseTheme: NoxionThemePackage = {
  name: "noxion-theme-{{THEME_NAME}}",
  tokens: {
    colors: {
      light: {
        primary: "#2563eb",
        primaryForeground: "#ffffff",
        background: "#ffffff",
        foreground: "#0a0a0a",
        muted: "#f5f5f5",
        mutedForeground: "#737373",
        border: "#e5e7eb",
        accent: "#f0f9ff",
        accentForeground: "#1e40af",
      },
      dark: {
        primary: "#3b82f6",
        primaryForeground: "#ffffff",
        background: "#0a0a0a",
        foreground: "#fafafa",
        muted: "#262626",
        mutedForeground: "#a3a3a3",
        border: "#404040",
        accent: "#1e3a5f",
        accentForeground: "#93c5fd",
      },
    },
    fonts: {
      sans: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
    },
  },
  supports: ["blog", "docs", "portfolio"],
};

export const theme = baseTheme;
export default theme;
