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
});

export const main = style({
  flex: 1,
  display: "flex",
  width: "100%",
  maxWidth: "var(--width-content)",
  margin: "0 auto",
  padding: "2rem 1.5rem",
  gap: "2rem",
  boxSizing: "border-box",
  "@media": {
    "screen and (max-width: 767px)": {
      flexDirection: "column",
    },
  },
});

export const sidebar = style({
  flexShrink: 0,
  width: "var(--width-sidebar)",
  "@media": {
    "screen and (max-width: 767px)": {
      width: "100%",
    },
  },
});

export const content = style({
  flex: 1,
  minWidth: 0,
});

export const footerSlot = style({
  flexShrink: 0,
});
