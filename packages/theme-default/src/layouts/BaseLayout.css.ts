import { style } from "@vanilla-extract/css";

export const layout = style({
  display: "flex",
  flexDirection: "column",
  minHeight: "100vh",
  backgroundColor: "var(--color-background)",
  color: "var(--color-foreground)",
  fontFamily: "var(--font-sans)",
});

export const headerSlot = style({
  flexShrink: 0,
  zIndex: 50,
});

export const heroSlot = style({
  width: "100%",
  maxWidth: "var(--width-content)",
  margin: "0 auto",
  padding: "2rem 1.5rem 0",
  boxSizing: "border-box",
});

export const content = style({
  flex: 1,
  width: "100%",
  maxWidth: "var(--width-content)",
  margin: "0 auto",
  padding: "2rem 1.5rem",
  boxSizing: "border-box",
});

export const footerSlot = style({
  flexShrink: 0,
});
