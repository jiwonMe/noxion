import { style } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  fontFamily: "var(--font-sans)",
});

export const tag = style({
  fontSize: "0.875rem",
  fontWeight: 500,
  letterSpacing: "-0.004em",
  padding: "0.375rem 0.75rem",
  borderRadius: 0,
  border: "1px solid var(--color-border)",
  background: "transparent",
  color: "var(--color-muted-foreground)",
  cursor: "pointer",
  transition: "opacity 100ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.7,
    },
  },
});

export const tagSelected = style({
  backgroundColor: "var(--color-foreground)",
  color: "var(--color-background)",
  borderColor: "var(--color-foreground)",
});
