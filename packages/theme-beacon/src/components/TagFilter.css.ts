import { style } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
  fontFamily: "var(--font-sans)",
});

export const tag = style({
  fontSize: "0.9375rem",
  fontWeight: 550,
  letterSpacing: "-0.004em",
  padding: "0.5em 1em",
  borderRadius: "100px",
  border: "1px solid var(--color-border)",
  background: "transparent",
  color: "var(--color-muted-foreground)",
  cursor: "pointer",
  transition: "opacity 100ms ease, background-color 100ms ease",
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
  selectors: {
    "&:hover": {
      opacity: 0.85,
    },
  },
});
