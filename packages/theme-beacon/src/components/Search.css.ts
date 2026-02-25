import { style } from "@vanilla-extract/css";

export const wrapper = style({
  fontFamily: "var(--font-sans)",
});

export const input = style({
  width: "100%",
  height: "56px",
  borderRadius: "40px",
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  border: "none",
  fontSize: "1.0625rem",
  fontWeight: 450,
  letterSpacing: "-0.008em",
  padding: "0.8em 1.4em",
  color: "var(--color-foreground)",
  fontFamily: "var(--font-sans)",
  outline: "none",
  transition: "background-color 100ms ease",
  selectors: {
    "&::placeholder": {
      color: "var(--color-muted-foreground)",
    },
    "&:focus": {
      backgroundColor: "rgba(0, 0, 0, 0.065)",
    },
    "[data-theme='dark'] &": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    "[data-theme='dark'] &:focus": {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
    },
  },
});
