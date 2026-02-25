import { style } from "@vanilla-extract/css";

export const card = style({
  display: "flex",
  flexDirection: "column",
  backgroundColor: "var(--color-card)",
  borderRadius: "var(--radius-default)",
  border: "1px solid var(--color-border)",
  overflow: "hidden",
  textDecoration: "none",
  color: "inherit",
  transition: "border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease",
  selectors: {
    "&:hover": {
      borderColor: "var(--color-primary)",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      transform: "translateY(-1px)",
    },
  },
});

export const cover = style({
  position: "relative",
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
      transform: "scale(1.02)",
    },
  },
});

export const body = style({
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
  padding: "1rem",
  flex: 1,
});

export const category = style({
  display: "inline-block",
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "var(--color-primary)",
});

export const title = style({
  fontSize: "1rem",
  fontWeight: 600,
  lineHeight: 1.4,
  color: "var(--color-card-foreground)",
  margin: 0,
  letterSpacing: "-0.01em",
});

export const description = style({
  fontSize: "0.875rem",
  lineHeight: 1.6,
  color: "var(--color-muted-foreground)",
  margin: 0,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

export const meta = style({
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "0.8125rem",
  color: "var(--color-muted-foreground)",
  marginTop: "auto",
  paddingTop: "0.25rem",
});

export const author = style({
  fontWeight: 500,
  color: "var(--color-muted-foreground)",
});

export const date = style({
  color: "var(--color-muted-foreground)",
});

export const tags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
  marginTop: "0.25rem",
});

export const tag = style({
  fontSize: "0.75rem",
  padding: "0.125rem 0.5rem",
  backgroundColor: "var(--color-muted)",
  color: "var(--color-muted-foreground)",
  borderRadius: "9999px",
  fontFamily: "var(--font-sans)",
});
