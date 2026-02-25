import { style } from "@vanilla-extract/css";

export const wrapper = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "5rem 1.5rem",
  textAlign: "center",
  fontFamily: "var(--font-sans)",
  color: "var(--color-muted-foreground)",
  gap: "0.75rem",
});

export const icon = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "3.5rem",
  height: "3.5rem",
  borderRadius: "50%",
  backgroundColor: "var(--color-muted)",
  color: "var(--color-muted-foreground)",
  marginBottom: "0.25rem",
});

export const title = style({
  fontSize: "1.125rem",
  fontWeight: 600,
  color: "var(--color-foreground)",
  margin: 0,
});

export const message = style({
  fontSize: "0.9375rem",
  color: "var(--color-muted-foreground)",
  margin: 0,
  maxWidth: "32ch",
});
