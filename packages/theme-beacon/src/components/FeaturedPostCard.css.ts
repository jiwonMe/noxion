import { style } from "@vanilla-extract/css";

export const card = style({
  display: "block",
  textDecoration: "none",
  color: "inherit",
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
  marginBottom: "1rem",
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
  gap: "0.375rem",
});

export const category = style({
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.01em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
});

export const title = style({
  fontSize: "1.5rem",
  fontWeight: 725,
  letterSpacing: "-0.02em",
  lineHeight: 1.25,
  color: "var(--color-foreground)",
  margin: 0,
});

export const description = style({
  fontSize: "1rem",
  lineHeight: 1.5,
  color: "var(--color-muted-foreground)",
  marginTop: "0.25rem",
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.8125rem",
  color: "var(--color-muted-foreground)",
  marginTop: "0.5rem",
});
