import { style } from "@vanilla-extract/css";

export const card = style({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--color-card)",
  borderRadius: "var(--radius-default)",
  border: "1px solid var(--color-border)",
  overflow: "hidden",
  transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
  selectors: {
    "&:hover": {
      borderColor: "var(--color-foreground)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      transform: "translateY(-2px)",
    },
  },
});

export const cardFeatured = style({
  gridColumn: "span 2",
  "@media": {
    "screen and (max-width: 640px)": {
      gridColumn: "span 1",
    },
  },
});

export const cover = style({
  width: "100%",
  aspectRatio: "16 / 9",
  backgroundColor: "var(--color-muted)",
  overflow: "hidden",
});

export const coverImage = style({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 300ms ease",
  selectors: {
    [`${card}:hover &`]: {
      transform: "scale(1.03)",
    },
  },
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.75rem",
  padding: "1.25rem",
  flex: 1,
});

export const header = style({
  display: "flex",
  alignItems: "baseline",
  justifyContent: "space-between",
  gap: "0.5rem",
});

export const titleLink = style({
  textDecoration: "none",
  color: "inherit",
});

export const title = style({
  fontSize: "1.0625rem",
  fontWeight: 600,
  lineHeight: 1.3,
  color: "var(--color-card-foreground)",
  margin: 0,
  letterSpacing: "-0.01em",
});

export const year = style({
  fontSize: "0.8125rem",
  color: "var(--color-muted-foreground)",
  flexShrink: 0,
});

export const description = style({
  fontSize: "0.875rem",
  lineHeight: 1.6,
  color: "var(--color-muted-foreground)",
  margin: 0,
  flex: 1,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export const tech = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
});

export const techTag = style({
  fontSize: "0.75rem",
  padding: "0.1875rem 0.5rem",
  backgroundColor: "var(--color-muted)",
  color: "var(--color-muted-foreground)",
  borderRadius: "0.25rem",
  fontFamily: "var(--font-mono)",
});

export const actions = style({
  display: "flex",
  gap: "0.75rem",
  marginTop: "auto",
  paddingTop: "0.25rem",
});

export const actionLink = style({
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "var(--color-primary)",
  textDecoration: "none",
  transition: "opacity 150ms ease",
  selectors: {
    "&:hover": {
      opacity: 0.75,
    },
  },
});
