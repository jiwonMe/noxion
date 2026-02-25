import { style } from "@vanilla-extract/css";

export const header = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 1.5rem",
  height: "3.5rem",
  backgroundColor: "var(--color-card)",
  borderBottom: "1px solid var(--color-border)",
  position: "sticky",
  top: 0,
  zIndex: 50,
  fontFamily: "var(--font-sans)",
});

export const logo = style({
  fontSize: "1rem",
  fontWeight: 600,
  color: "var(--color-foreground)",
  textDecoration: "none",
  letterSpacing: "-0.01em",
  transition: "color 150ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-primary)",
    },
  },
});

export const nav = style({
  display: "flex",
  alignItems: "center",
  gap: "0.25rem",
});

export const navLink = style({
  fontSize: "0.875rem",
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  padding: "0.375rem 0.625rem",
  borderRadius: "var(--radius-default)",
  transition: "color 150ms ease, background-color 150ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
      backgroundColor: "var(--color-accent)",
    },
  },
});

export const actions = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
});
