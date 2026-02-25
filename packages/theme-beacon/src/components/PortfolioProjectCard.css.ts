import { style } from "@vanilla-extract/css";

export const card = style({
  display: "block",
  textDecoration: "none",
  color: "inherit",
  border: "none",
  borderRadius: 0,
  background: "transparent",
  fontFamily: "var(--font-sans)",
  transition: "opacity 100ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.85,
    },
  },
});

export const cover = style({
  aspectRatio: "16 / 9",
  overflow: "hidden",
  marginBottom: "0.875rem",
});

export const coverImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  display: "block",
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const title = style({
  fontSize: "1.1875rem",
  fontWeight: 725,
  letterSpacing: "-0.014em",
  lineHeight: 1.3,
  color: "var(--color-foreground)",
  margin: 0,
});

export const description = style({
  fontSize: "0.9063rem",
  lineHeight: 1.4,
  color: "var(--color-muted-foreground)",
  marginTop: "0.25rem",
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.7813rem",
  fontWeight: 500,
  letterSpacing: "-0.004em",
  color: "var(--color-muted-foreground)",
  marginTop: "0.5rem",
});

export const tags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
  marginTop: "0.5rem",
});

export const tag = style({
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.01em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
  padding: 0,
});

export const actions = style({
  display: "flex",
  gap: "1rem",
  marginTop: "0.5rem",
});

export const actionLink = style({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--color-foreground)",
  textDecoration: "none",
  transition: "opacity 100ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.7,
    },
  },
});
