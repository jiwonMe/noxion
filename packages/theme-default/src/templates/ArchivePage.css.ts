import { style } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const title = style({
  fontSize: "1.75rem",
  fontWeight: 700,
  letterSpacing: "-0.02em",
  color: "var(--color-foreground)",
  margin: 0,
});
