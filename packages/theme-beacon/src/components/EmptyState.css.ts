import { style } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 2rem",
  textAlign: "center",
  fontFamily: "var(--font-sans)",
});

export const title = style({
  fontSize: "1.25rem",
  fontWeight: 700,
  letterSpacing: "-0.015em",
  color: "var(--color-foreground)",
  margin: "0 0 0.5rem 0",
});

export const message = style({
  fontSize: "1rem",
  color: "var(--color-muted-foreground)",
  margin: 0,
});
