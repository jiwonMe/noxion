import { style } from "@vanilla-extract/css";

export const page = style({
  fontFamily: "var(--font-sans)",
});

export const heading = style({
  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
  fontWeight: 800,
  letterSpacing: "-0.025em",
  color: "var(--color-foreground)",
  margin: "0 0 2rem 0",
});

export const list = style({
  marginTop: "2rem",
});
