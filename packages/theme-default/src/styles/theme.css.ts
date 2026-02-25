import { style, globalStyle } from "@vanilla-extract/css";

export const themeRoot = style({
  fontFamily: "var(--font-sans)",
});

globalStyle(":root", {
  vars: {
    "--noxion-radius": "0.5rem",
  },
});
