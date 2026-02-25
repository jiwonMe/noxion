import { style } from "@vanilla-extract/css";

export const list = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "1.5rem",
});

export const empty = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 1rem",
  color: "var(--color-muted-foreground)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
});
