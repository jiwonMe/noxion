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
  borderBottom: "1px solid var(--color-border)",
});

export const content = style({
  flex: 1,
  width: "100%",
  maxWidth: "1320px",
  margin: "0 auto",
  padding: "3rem max(4vmin, 20px)",
  boxSizing: "border-box",
});

export const footerSlot = style({
  flexShrink: 0,
});
