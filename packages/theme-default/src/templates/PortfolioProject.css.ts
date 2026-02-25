import { style } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  maxWidth: "800px",
  margin: "0 auto",
});

export const notFound = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "4rem 1rem",
  color: "var(--color-muted-foreground)",
  fontFamily: "var(--font-sans)",
  fontSize: "0.9375rem",
});

export const projectHeader = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  paddingBottom: "1.5rem",
  borderBottom: "1px solid var(--color-border)",
  flexWrap: "wrap",
});

export const tech = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
});

export const techTag = style({
  fontSize: "0.75rem",
  padding: "0.1875rem 0.5rem",
  backgroundColor: "var(--color-muted)",
  color: "var(--color-muted-foreground)",
  borderRadius: "0.25rem",
  fontFamily: "var(--font-mono)",
});

export const visitLink = style({
  display: "inline-flex",
  alignItems: "center",
  gap: "0.25rem",
  padding: "0.5rem 1rem",
  backgroundColor: "var(--color-primary)",
  color: "var(--color-primary-foreground)",
  borderRadius: "var(--radius-default)",
  textDecoration: "none",
  fontSize: "0.875rem",
  fontWeight: 500,
  transition: "opacity 150ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.85,
    },
  },
});
