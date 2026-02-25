import { style } from "@vanilla-extract/css";

export const article = style({
  fontFamily: "var(--font-sans)",
  maxWidth: "760px",
  margin: "0 auto",
});

export const notFound = style({
  padding: "3rem",
  textAlign: "center",
  color: "var(--color-muted-foreground)",
});

export const cover = style({
  width: "100%",
  marginBottom: "2.5rem",
  overflow: "hidden",
});

export const coverImage = style({
  width: "100%",
  height: "auto",
  display: "block",
});

export const header = style({
  marginBottom: "3rem",
});

export const topics = style({
  display: "flex",
  gap: "0.5rem",
  flexWrap: "wrap",
  marginBottom: "1rem",
});

export const category = style({
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
});

export const tag = style({
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
    },
  },
});

export const title = style({
  fontSize: "clamp(2rem, 4vw, 3rem)",
  fontWeight: 800,
  letterSpacing: "-0.025em",
  lineHeight: 1.15,
  color: "var(--color-foreground)",
  margin: "0 0 1rem 0",
});

export const description = style({
  fontSize: "1.125rem",
  lineHeight: 1.6,
  color: "var(--color-muted-foreground)",
  margin: "0 0 1.5rem 0",
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.875rem",
  color: "var(--color-muted-foreground)",
});

export const dot = style({
  width: "2px",
  height: "2px",
  borderRadius: "50%",
  backgroundColor: "currentColor",
  display: "inline-block",
});

export const body = style({
  fontSize: "1.0625rem",
  lineHeight: 1.75,
  color: "var(--color-foreground)",
});
