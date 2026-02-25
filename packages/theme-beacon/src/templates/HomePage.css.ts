import { style } from "@vanilla-extract/css";

export const page = style({
  fontFamily: "var(--font-sans)",
});

export const headerGrid = style({
  display: "grid",
  gridTemplateColumns: "1fr 1fr 260px",
  gap: "0",
  borderBottom: "1px solid var(--color-border)",
  marginBottom: "3rem",
  paddingBottom: "3rem",
  "@media": {
    "(max-width: 900px)": {
      gridTemplateColumns: "1fr",
    },
  },
});

export const gridLeft = style({
  borderRight: "1px solid var(--color-border)",
  paddingRight: "2rem",
  "@media": {
    "(max-width: 900px)": {
      borderRight: "none",
      borderBottom: "1px solid var(--color-border)",
      paddingRight: 0,
      paddingBottom: "2rem",
      marginBottom: "2rem",
    },
  },
});

export const gridMiddle = style({
  borderRight: "1px solid var(--color-border)",
  padding: "0 2rem",
  display: "flex",
  flexDirection: "column",
  gap: "2rem",
  "@media": {
    "(max-width: 900px)": {
      borderRight: "none",
      borderBottom: "1px solid var(--color-border)",
      padding: "0 0 2rem 0",
      marginBottom: "2rem",
    },
  },
});

export const gridRight = style({
  paddingLeft: "2rem",
  "@media": {
    "(max-width: 900px)": {
      paddingLeft: 0,
    },
  },
});

export const featuredFeed = style({
  display: "flex",
  flexDirection: "column",
  gap: "1.5rem",
});

export const feed = style({
  marginTop: "2rem",
});

export const feedTitle = style({
  fontSize: "0.75rem",
  fontWeight: 600,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--color-muted-foreground)",
  borderBottom: "1px solid var(--color-border)",
  paddingBottom: "0.75rem",
  marginBottom: "2rem",
});

export const feedList = style({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(248px, 1fr))",
  gap: "42px",
});
