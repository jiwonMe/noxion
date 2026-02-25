import { style } from "@vanilla-extract/css";

export const list = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(248px, 1fr))",
  gap: "42px",
  fontFamily: "var(--font-sans)",
});
