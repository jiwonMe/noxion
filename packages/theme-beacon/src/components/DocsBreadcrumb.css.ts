import { style } from "@vanilla-extract/css";

export const nav = style({
  fontFamily: "var(--font-sans)",
});

export const list = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  listStyle: "none",
  padding: 0,
  margin: 0,
  fontSize: "0.875rem",
  color: "var(--color-muted-foreground)",
});

export const item = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});

export const link = style({
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  transition: "opacity 100ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.7,
    },
  },
});

export const current = style({
  color: "var(--color-foreground)",
  fontWeight: 500,
});

export const separator = style({
  color: "var(--color-muted-foreground)",
});
