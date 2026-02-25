import { style } from "@vanilla-extract/css";

export const page = style({
  display: "flex",
  flexDirection: "column",
  gap: "3rem",
});

export const feed = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

export const toolbar = style({
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  marginBottom: "2rem",
});
