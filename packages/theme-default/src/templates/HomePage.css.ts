import { style } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

export const feed = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

export const feedTitle = style({
  fontSize: "1.125rem",
  fontWeight: 600,
  color: "var(--color-foreground)",
  letterSpacing: "-0.01em",
  margin: 0,
  paddingBottom: "0.75rem",
  borderBottom: "1px solid var(--color-border)",
});
