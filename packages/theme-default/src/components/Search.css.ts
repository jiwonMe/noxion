import { style } from "@vanilla-extract/css";

export const wrapper = style({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  backgroundColor: "var(--color-muted)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-default)",
  padding: "0.375rem 0.625rem",
  transition: "border-color 150ms ease, box-shadow 150ms ease",
  fontFamily: "var(--font-sans)",
  selectors: {
    "&:focus-within": {
      borderColor: "var(--color-primary)",
      boxShadow: "0 0 0 3px color-mix(in srgb, var(--color-primary) 15%, transparent)",
    },
  },
});

export const icon = style({
  display: "flex",
  alignItems: "center",
  color: "var(--color-muted-foreground)",
  flexShrink: 0,
});

export const input = style({
  flex: 1,
  border: "none",
  outline: "none",
  background: "transparent",
  color: "var(--color-foreground)",
  fontSize: "0.875rem",
  fontFamily: "inherit",
  "::placeholder": {
    color: "var(--color-muted-foreground)",
  },
});

export const kbd = style({
  display: "inline-flex",
  alignItems: "center",
  padding: "0.125rem 0.3125rem",
  fontSize: "0.6875rem",
  fontFamily: "var(--font-mono)",
  backgroundColor: "var(--color-border)",
  color: "var(--color-muted-foreground)",
  borderRadius: "0.25rem",
  flexShrink: 0,
});
