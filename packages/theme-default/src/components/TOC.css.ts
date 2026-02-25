import { style } from "@vanilla-extract/css";

export const nav = style({
  fontFamily: "var(--font-sans)",
  fontSize: "0.875rem",
});

export const heading = style({
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
  marginBottom: "0.75rem",
});

export const list = style({
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "0.125rem",
});

export const item = style({
  margin: 0,
});

export const levelIndent: Record<number, string> = {
  1: style({ paddingLeft: "0rem" }),
  2: style({ paddingLeft: "0rem" }),
  3: style({ paddingLeft: "0.75rem" }),
  4: style({ paddingLeft: "1.5rem" }),
  5: style({ paddingLeft: "2.25rem" }),
  6: style({ paddingLeft: "3rem" }),
};

export const link = style({
  display: "block",
  padding: "0.25rem 0.5rem",
  borderRadius: "calc(var(--radius-default) * 0.5)",
  color: "var(--color-muted-foreground)",
  textDecoration: "none",
  lineHeight: 1.5,
  transition: "color 150ms ease, background-color 150ms ease",
  selectors: {
    "&:hover": {
      color: "var(--color-foreground)",
      backgroundColor: "var(--color-accent)",
    },
  },
});
