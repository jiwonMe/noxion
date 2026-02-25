import { style } from "@vanilla-extract/css";

export const button = style({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2rem",
  height: "2rem",
  borderRadius: "var(--radius-default)",
  border: "none",
  backgroundColor: "transparent",
  color: "var(--color-muted-foreground)",
  cursor: "pointer",
  transition: "color 150ms ease, background-color 150ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
      backgroundColor: "var(--color-accent)",
    },
    "&:focus-visible": {
      outline: "2px solid var(--color-primary)",
      outlineOffset: "2px",
    },
  },
});
