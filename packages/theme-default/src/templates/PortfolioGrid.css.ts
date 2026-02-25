import { style } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
});

export const grid = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: "1.5rem",
});

export const empty = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 1rem",
  color: "var(--color-muted-foreground)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
});
