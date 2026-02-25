import { style } from "@vanilla-extract/css";

export const hero = style({
  paddingBottom: "3rem",
  fontFamily: "var(--font-sans)",
});

export const title = style({
  fontSize: "clamp(2.5rem, 5vw, 4rem)",
  fontWeight: 800,
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "var(--color-foreground)",
  margin: "0 0 1rem 0",
});

export const description = style({
  fontSize: "1.125rem",
  lineHeight: 1.6,
  color: "var(--color-muted-foreground)",
  maxWidth: "600px",
  margin: 0,
});

export const posts = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "2rem",
  marginTop: "2rem",
});
