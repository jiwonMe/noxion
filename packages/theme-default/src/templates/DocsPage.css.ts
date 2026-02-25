import { style } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
  fontFamily: "var(--font-sans)",
});

export const notFound = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 1rem",
  color: "var(--color-muted-foreground)",
  fontSize: "0.9375rem",
});

export const docsNav = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "1rem",
  paddingTop: "1.5rem",
  borderTop: "1px solid var(--color-border)",
  "@media": {
    "screen and (max-width: 640px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const navLink = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.25rem",
  padding: "1rem",
  borderRadius: "var(--radius-default)",
  border: "1px solid var(--color-border)",
  textDecoration: "none",
  transition: "border-color 150ms ease, background-color 150ms ease",
  selectors: {
    "&:hover": {
      borderColor: "var(--color-primary)",
      backgroundColor: "var(--color-muted)",
    },
  },
});

export const navLabel = style({
  fontSize: "0.75rem",
  fontWeight: 500,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
});

export const navTitle = style({
  fontSize: "0.9375rem",
  fontWeight: 600,
  color: "var(--color-foreground)",
});

export const navNext = style({
  textAlign: "right",
});
