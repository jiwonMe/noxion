import { style } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  fontFamily: "var(--font-sans)",
});

export const tag = style({
  display: "inline-flex",
  alignItems: "center",
  padding: "0.3125rem 0.75rem",
  fontSize: "0.8125rem",
  fontWeight: 500,
  borderRadius: "0.375rem",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-card)",
  color: "var(--color-muted-foreground)",
  fontFamily: "var(--font-mono)",
  cursor: "pointer",
  transition: "border-color 150ms ease, color 150ms ease, background-color 150ms ease",
  selectors: {
    "&:hover": {
      borderColor: "var(--color-foreground)",
      color: "var(--color-foreground)",
    },
  },
});

export const tagSelected = style({
  backgroundColor: "var(--color-foreground)",
  color: "var(--color-background)",
  borderColor: "var(--color-foreground)",
  selectors: {
    "&:hover": {
      backgroundColor: "var(--color-foreground)",
      color: "var(--color-background)",
      opacity: 0.85,
    },
  },
});

export const tagMore = style({
  display: "inline-flex",
  alignItems: "center",
  padding: "0.3125rem 0.75rem",
  fontSize: "0.8125rem",
  fontWeight: 500,
  borderRadius: "0.375rem",
  border: "1px dashed var(--color-border)",
  backgroundColor: "transparent",
  color: "var(--color-muted-foreground)",
  cursor: "pointer",
  transition: "border-color 150ms ease, color 150ms ease",
  selectors: {
    "&:hover": {
      borderColor: "var(--color-foreground)",
      color: "var(--color-foreground)",
    },
  },
});
