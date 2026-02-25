import { style } from "@vanilla-extract/css";

export const card = style({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  height: "100%",
  minHeight: "400px",
  borderRadius: "var(--radius-default)",
  overflow: "hidden",
  textDecoration: "none",
  color: "inherit",
  backgroundColor: "var(--color-muted)",
  border: "1px solid var(--color-border)",
  transition: "box-shadow 200ms ease, transform 200ms ease",
  selectors: {
    "&:hover": {
      boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      transform: "translateY(-2px)",
    },
  },
});

export const coverImage = style({
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 400ms ease",
  selectors: {
    [`${card}:hover &`]: {
      transform: "scale(1.03)",
    },
  },
});

export const overlay = style({
  position: "absolute",
  inset: 0,
  background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
});

export const content = style({
  position: "relative",
  zIndex: 1,
  padding: "1.5rem",
  color: "#ffffff",
});

export const contentNoImage = style({
  position: "relative",
  padding: "1.5rem",
  color: "var(--color-card-foreground)",
});

export const category = style({
  display: "inline-block",
  fontSize: "0.6875rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: "0.5rem",
  opacity: 0.9,
});

export const title = style({
  fontSize: "1.5rem",
  fontWeight: 700,
  lineHeight: 1.25,
  letterSpacing: "-0.02em",
  margin: "0 0 0.5rem",
});

export const description = style({
  fontSize: "0.9375rem",
  lineHeight: 1.5,
  opacity: 0.85,
  margin: "0 0 0.75rem",
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
  opacity: 0.75,
});

export const tags = style({
  display: "flex",
  flexWrap: "wrap",
  gap: "0.375rem",
  marginTop: "0.5rem",
});

export const tag = style({
  fontSize: "0.75rem",
  padding: "0.125rem 0.5rem",
  backgroundColor: "rgba(255,255,255,0.2)",
  borderRadius: "9999px",
  backdropFilter: "blur(4px)",
});
