import { style } from "@vanilla-extract/css";

export const article = style({
  maxWidth: "720px",
  margin: "0 auto",
  fontFamily: "var(--font-sans)",
});

export const cover = style({
  width: "100%",
  borderRadius: "var(--radius-default)",
  overflow: "hidden",
  marginBottom: "2rem",
  aspectRatio: "2 / 1",
});

export const coverImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

export const header = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  marginBottom: "2.5rem",
  paddingBottom: "2rem",
  borderBottom: "1px solid var(--color-border)",
});

export const topics = style({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "0.5rem",
});

export const category = style({
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-primary)",
});

export const tag = style({
  fontSize: "0.75rem",
  padding: "0.125rem 0.5rem",
  backgroundColor: "var(--color-muted)",
  color: "var(--color-muted-foreground)",
  borderRadius: "9999px",
  textDecoration: "none",
  transition: "background-color 150ms ease",
  selectors: {
    "&:hover": {
      backgroundColor: "var(--color-border)",
    },
  },
});

export const title = style({
  fontSize: "2rem",
  fontWeight: 700,
  lineHeight: 1.2,
  letterSpacing: "-0.025em",
  color: "var(--color-foreground)",
  margin: 0,
  "@media": {
    "screen and (max-width: 640px)": {
      fontSize: "1.5rem",
    },
  },
});

export const description = style({
  fontSize: "1.0625rem",
  lineHeight: 1.6,
  color: "var(--color-muted-foreground)",
  margin: 0,
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.875rem",
  color: "var(--color-muted-foreground)",
});

export const dot = style({
  width: "3px",
  height: "3px",
  borderRadius: "50%",
  backgroundColor: "currentColor",
  display: "inline-block",
});

export const body = style({
  lineHeight: 1.8,
});

export const notFound = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 1rem",
  color: "var(--color-muted-foreground)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
});
