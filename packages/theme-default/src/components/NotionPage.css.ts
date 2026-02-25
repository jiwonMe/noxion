import { style } from "@vanilla-extract/css";

export const wrapper = style({
  fontFamily: "var(--font-sans)",
  color: "var(--color-foreground)",
  lineHeight: 1.7,
  maxWidth: "100%",
  overflowX: "hidden",
});
