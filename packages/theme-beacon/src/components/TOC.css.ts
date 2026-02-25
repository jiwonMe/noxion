import { style } from "@vanilla-extract/css";

export const toc = style({
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
});

export const heading = style({
  fontSize: "0.75rem",
  fontWeight: 550,
  letterSpacing: "0.025em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
  borderBottom: "1px solid var(--color-border)",
  paddingBottom: "0.75rem",
  marginBottom: "1.25rem",
  margin: "0 0 1.25rem 0",
});

export const list = style({
  listStyle: "none",
  padding: 0,
  margin: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
});

export const item = style({});

export const link = style({
  display: "block",
  fontSize: "0.9375rem",
  fontWeight: 500,
  letterSpacing: "-0.004em",
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  padding: "0.25rem 0",
  transition: "color 100ms ease, opacity 100ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
    },
  },
});

export const activeLink = style({
  fontWeight: 650,
  color: "var(--color-foreground)",
});

export const depthIndent: Record<number, string> = {
  1: style({ paddingLeft: 0 }),
  2: style({ paddingLeft: "0.75rem" }),
  3: style({ paddingLeft: "1.5rem" }),
  4: style({ paddingLeft: "2.25rem" }),
};
