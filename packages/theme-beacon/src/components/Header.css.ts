import { style } from "@vanilla-extract/css";

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 max(4vmin, 20px)",
  height: "100px",
  maxWidth: "var(--color-content, 1320px)",
  margin: "0 auto",
  backgroundColor: "var(--color-background)",
  fontFamily: "var(--font-sans)",
});

export const logo = style({
  fontSize: "1.5rem",
  fontWeight: 725,
  letterSpacing: "-0.015em",
  whiteSpace: "nowrap",
  color: "var(--color-foreground)",
  textDecoration: "none",
  transition: "opacity 100ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.8,
    },
  },
});

export const nav = style({
  display: "flex",
  alignItems: "center",
  gap: "28px",
});

export const navLink = style({
  fontSize: "0.9375rem",
  fontWeight: 550,
  letterSpacing: "-0.004em",
  color: "var(--color-foreground)",
  textDecoration: "none",
  transition: "opacity 100ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.8,
    },
  },
});

export const actions = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});
