import { style } from "@vanilla-extract/css";

export const nav = style({
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
});

export const list = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
});

export const item = style({
  margin: 0,
});

export const link = style({
  display: "block",
  padding: "0.3rem 0",
  fontSize: "0.9375rem",
  fontWeight: 450,
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  transition: "color 100ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
    },
  },
});

export const linkActive = style({
  color: "var(--color-foreground)",
  fontWeight: 600,
});

export const depthIndent: Record<number, string> = {
  0: style({ paddingLeft: 0 }),
  1: style({ paddingLeft: "0.75rem" }),
  2: style({ paddingLeft: "1.5rem" }),
  3: style({ paddingLeft: "2.25rem" }),
  4: style({ paddingLeft: "3rem" }),
  5: style({ paddingLeft: "3.75rem" }),
};
