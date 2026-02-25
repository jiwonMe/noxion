import { style } from "@vanilla-extract/css";

export const nav = style({
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
});

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.0625rem",
});

export const item = style({
  margin: 0,
});

export const link = style({
  display: "block",
  padding: "0.3125rem 0.625rem",
  borderRadius: "calc(var(--radius-default) * 0.5)",
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  lineHeight: 1.4,
  transition: "color 150ms ease, background-color 150ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
      backgroundColor: "var(--color-accent)",
    },
  },
});

export const depthIndent: Record<number, string> = {
  0: style({ paddingLeft: "0.5rem" }),
  1: style({ paddingLeft: "1.25rem" }),
  2: style({ paddingLeft: "2rem" }),
  3: style({ paddingLeft: "2.75rem" }),
  4: style({ paddingLeft: "3.5rem" }),
  5: style({ paddingLeft: "4.25rem" }),
};

export const linkActive = style({
  color: "var(--color-primary)",
  fontWeight: 500,
  backgroundColor: "color-mix(in srgb, var(--color-primary) 10%, transparent)",
  selectors: {
    "&:hover": {
      color: "var(--color-primary)",
      backgroundColor: "color-mix(in srgb, var(--color-primary) 15%, transparent)",
    },
  },
});
