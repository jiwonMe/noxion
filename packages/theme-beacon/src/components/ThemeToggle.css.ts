import { style } from "@vanilla-extract/css";

export const button = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "2rem",
  height: "2rem",
  border: "none",
  background: "transparent",
  color: "var(--color-foreground)",
  cursor: "pointer",
  transition: "opacity 100ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.7,
    },
  },
});
