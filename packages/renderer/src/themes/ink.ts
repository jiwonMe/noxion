import type { NoxionThemePackage } from "../theme/types";
import { extendTheme } from "../theme/extend-theme";
import { defaultThemePackage } from "./default";

const inkStylesheet = `
.noxion-header {
  height: 48px;
  border-bottom: 1px dashed var(--noxion-border);
  background-color: var(--noxion-background);
  backdrop-filter: none;
}

.noxion-header__logo {
  font-family: var(--noxion-font-mono);
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: -0.03em;
  text-transform: lowercase;
}

.noxion-header__logo::before {
  content: "~/";
  opacity: 0.4;
}

.noxion-header__logo:hover {
  opacity: 1;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-offset: 3px;
}

.noxion-header__nav-link {
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0;
  text-transform: lowercase;
  border-radius: 2px;
  padding: 0.25rem 0.5rem;
}

.noxion-header__nav-link:hover {
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-post-card {
  border: none;
  border-bottom: 1px solid var(--noxion-border);
  border-radius: 0;
  background: transparent;
}

.noxion-post-card:hover {
  border-color: var(--noxion-foreground);
  box-shadow: none;
  transform: none;
}

.noxion-post-card__title {
  font-family: var(--noxion-font-mono);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.noxion-post-card__description {
  font-size: 0.8125rem;
  line-height: 1.7;
}

.noxion-post-card__meta {
  font-family: var(--noxion-font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
}

.noxion-post-card__tag {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.noxion-post-list {
  grid-template-columns: 1fr;
  gap: 0;
}

.noxion-tag-filter__tag {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  text-transform: lowercase;
}

.noxion-tag-filter__tag--selected {
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-footer {
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.01em;
}

.noxion-search__input {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
}

.noxion-toc__link {
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
}

.noxion-portfolio-grid {
  grid-template-columns: 1fr;
  gap: 0;
}

.noxion-portfolio-card {
  border: none;
  border-bottom: 1px solid var(--noxion-border);
  border-radius: 0;
  background: transparent;
  flex-direction: row;
}

.noxion-portfolio-card:hover {
  border-color: var(--noxion-foreground);
  box-shadow: none;
  transform: none;
}

.noxion-portfolio-card--featured {
  border-bottom-width: 2px;
}

.noxion-portfolio-card__cover {
  border-radius: 0;
  width: 180px;
  min-width: 180px;
  aspect-ratio: auto;
  min-height: 120px;
}

@media (max-width: 640px) {
  .noxion-portfolio-card {
    flex-direction: column;
  }
  .noxion-portfolio-card__cover {
    width: 100%;
    min-width: unset;
    aspect-ratio: 16 / 10;
  }
}

.noxion-portfolio-card__title {
  font-family: var(--noxion-font-mono);
  font-weight: 500;
  letter-spacing: -0.03em;
}

.noxion-portfolio-card__year {
  font-family: var(--noxion-font-mono);
  font-size: 0.6875rem;
  letter-spacing: 0.02em;
}

.noxion-portfolio-card__description {
  font-size: 0.8125rem;
  line-height: 1.7;
}

.noxion-portfolio-card__tech-tag {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.noxion-portfolio-card__link {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.noxion-portfolio-filter__tag {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  text-transform: lowercase;
}

.noxion-portfolio-filter__tag--selected {
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-portfolio-project__tech-tag {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.noxion-portfolio-project__link {
  border-radius: 2px;
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.noxion-docs-sidebar {
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
}

.noxion-docs-sidebar__link {
  border-radius: 2px;
  letter-spacing: 0.02em;
}

.noxion-docs-sidebar__link--active {
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-docs-sidebar__link--active:hover {
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-docs-nav__link {
  border-radius: 2px;
}

.noxion-docs-nav__label {
  font-family: var(--noxion-font-mono);
  letter-spacing: 0.04em;
}

.noxion-docs-nav__title {
  font-family: var(--noxion-font-mono);
}

.noxion-docs-breadcrumb {
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.noxion-docs-breadcrumb__separator {
  font-family: var(--noxion-font-mono);
}

.noxion-featured-card {
  border-radius: 0;
  min-height: 300px;
}

.noxion-featured-card__cover-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.5) 50%,
    rgba(0, 0, 0, 0.3) 100%
  );
}

.noxion-featured-card--no-cover .noxion-featured-card__cover {
  background-color: var(--noxion-foreground);
}

.noxion-featured-card__content {
  min-height: 300px;
  padding: 1.5rem;
}

.noxion-featured-card__category {
  font-family: var(--noxion-font-mono);
  font-size: 0.6875rem;
  text-transform: lowercase;
  letter-spacing: 0;
}

.noxion-featured-card__category::before {
  content: "$ ";
}

.noxion-featured-card__title {
  font-family: var(--noxion-font-mono);
  font-size: 1.5rem;
  font-weight: 600;
  letter-spacing: -0.03em;
  text-transform: lowercase;
}

.noxion-featured-card__description {
  font-family: var(--noxion-font-mono);
  font-size: 0.8125rem;
}

.noxion-featured-card__meta {
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
}

.noxion-featured-card__tag {
  font-family: var(--noxion-font-mono);
  border-radius: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  font-size: 0.6875rem;
}

.noxion-featured-card__tag::before {
  content: "#";
}

@media (max-width: 768px) {
  .noxion-featured-card {
    min-height: 240px;
  }

  .noxion-featured-card__content {
    min-height: 240px;
  }

  .noxion-featured-card__title {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .noxion-featured-card {
    min-height: 200px;
  }

  .noxion-featured-card__content {
    min-height: 200px;
    padding: 1.25rem;
  }

  .noxion-featured-card__title {
    font-size: 1.125rem;
  }
}

.noxion-home-feed__title {
  font-family: var(--noxion-font-mono);
  text-transform: lowercase;
  letter-spacing: 0;
  border-bottom-style: dashed;
}
`;

export const inkThemePackage: NoxionThemePackage = extendTheme(defaultThemePackage, {
  name: "ink",
  tokens: {
    colors: {
      primary: "#000000",
      primaryForeground: "#ffffff",
      background: "#fafafa",
      foreground: "#111111",
      muted: "#f0f0f0",
      mutedForeground: "#666666",
      border: "#e0e0e0",
      accent: "#f5f5f5",
      accentForeground: "#111111",
      card: "#ffffff",
      cardForeground: "#111111",
    },
    fonts: {
      sans: '"IBM Plex Sans", "Inter", system-ui, -apple-system, sans-serif',
      mono: '"IBM Plex Mono", "JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
      serif: '"IBM Plex Serif", Georgia, "Times New Roman", serif',
    },
    spacing: {
      content: "880px",
      sidebar: "240px",
    },
    borderRadius: "2px",
    shadows: {
      sm: "none",
      md: "none",
      lg: "none",
    },
    transitions: {
      fast: "80ms linear",
      normal: "150ms linear",
      slow: "250ms linear",
    },
    dark: {
      colors: {
        primary: "#ffffff",
        primaryForeground: "#000000",
        background: "#0a0a0a",
        foreground: "#e0e0e0",
        muted: "#1a1a1a",
        mutedForeground: "#888888",
        border: "#222222",
        accent: "#151515",
        accentForeground: "#e0e0e0",
        card: "#111111",
        cardForeground: "#e0e0e0",
      },
    },
  },
  stylesheet: inkStylesheet,
  supports: ["blog", "docs"],
});
