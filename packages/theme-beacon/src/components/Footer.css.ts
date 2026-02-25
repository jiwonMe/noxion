import { style } from "@vanilla-extract/css";

export const footer = style({
  borderTop: "1px solid var(--color-border)",
  padding: "2rem max(4vmin, 20px)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
  fontWeight: 450,
  color: "var(--color-muted-foreground)",
});

export const inner = style({
  maxWidth: "1320px",
  margin: "0 auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  flexWrap: "wrap",
});

export const copy = style({
  color: "var(--color-muted-foreground)",
});

export const links = style({
  display: "flex",
  gap: "1.5rem",
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
