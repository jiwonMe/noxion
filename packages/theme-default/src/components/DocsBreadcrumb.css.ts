import { style } from "@vanilla-extract/css";

export const nav = style({
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
});

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.25rem",
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
});

export const link = style({
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  transition: "color 150ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
    },
  },
});

export const current = style({
  color: "var(--color-foreground)",
  fontWeight: 500,
});

export const separator = style({
  color: "var(--color-border)",
  userSelect: "none",
});
