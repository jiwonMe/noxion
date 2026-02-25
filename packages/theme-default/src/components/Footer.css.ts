import { style } from "@vanilla-extract/css";

export const footer = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "1.25rem 1.5rem",
  borderTop: "1px solid var(--color-border)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.8125rem",
  color: "var(--color-muted-foreground)",
});

export const copyright = style({
  color: "var(--color-muted-foreground)",
});

export const poweredBy = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  transition: "color 150ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
    },
  },
});
