import { style } from "@vanilla-extract/css";

export const section = style({
  display: "grid",
  gridTemplateColumns: "1fr",
  gap: "1.5rem",
  "@media": {
    "screen and (min-width: 768px)": {
      gridTemplateColumns: "3fr 2fr",
    },
  },
});

export const primary = style({
  height: "100%",
  minHeight: "400px",
});

export const secondary = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
});
