import type { NoxionThemePackage } from "../theme/types";
import { extendTheme } from "../theme/extend-theme";
import { defaultThemePackage } from "./default";

const folioStylesheet = `
.noxion-header {
  height: 52px;
  border-bottom: none;
  background: transparent;
  backdrop-filter: none;
}

.noxion-header__logo {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.noxion-header__nav-link {
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.noxion-layout__content {
  max-width: var(--noxion-spacing-content);
  padding: 3rem 2rem;
}

@media (max-width: 640px) {
  .noxion-layout__content {
    padding: 2rem 1rem;
  }
}

.noxion-post-card {
  border: none;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}

.noxion-post-card:hover {
  box-shadow: none;
  transform: none;
}

.noxion-post-card__cover {
  aspect-ratio: 4 / 3;
  border-radius: 0;
  background-color: var(--noxion-muted);
}

.noxion-post-card:hover .noxion-post-card__cover-image {
  transform: scale(1.02);
}

.noxion-post-card__body {
  padding: 1rem 0;
}

.noxion-post-card__title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.noxion-post-card__description {
  font-size: 0.8125rem;
  line-height: 1.6;
  opacity: 0.7;
}

.noxion-post-card__meta {
  padding-top: 0.5rem;
}

.noxion-post-card__category {
  font-weight: 500;
  font-size: 0.6875rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.5;
}

.noxion-post-card__tag {
  border-radius: 0;
  background: transparent;
  border: none;
  padding: 0;
  font-size: 0.6875rem;
  opacity: 0.5;
}

.noxion-post-card__tag + .noxion-post-card__tag::before {
  content: ", ";
}

.noxion-post-list {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem 1.5rem;
}

@media (min-width: 1024px) {
  .noxion-post-list {
    grid-template-columns: repeat(3, 1fr);
  }
}

.noxion-tag-filter__tag {
  border: none;
  border-radius: 0;
  padding: 0.25rem 0;
  font-size: 0.8125rem;
  font-weight: 400;
  letter-spacing: 0;
  border-bottom: 1px solid transparent;
}

.noxion-tag-filter__tag:hover {
  background: transparent;
  border-bottom-color: var(--noxion-foreground);
}

.noxion-tag-filter__tag--selected {
  background: transparent;
  color: var(--noxion-foreground);
  border-bottom-color: var(--noxion-foreground);
}

.noxion-tag-filter__tag--selected:hover {
  background: transparent;
  opacity: 1;
}

.noxion-footer {
  border-top: none;
  padding: 3rem 2rem;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
  opacity: 0.5;
}

.noxion-footer:hover {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.noxion-search__input {
  border: none;
  border-bottom: 1px solid var(--noxion-border);
  border-radius: 0;
  background: transparent;
  padding-left: 0;
}

.noxion-search__input:focus {
  border-color: var(--noxion-foreground);
  box-shadow: none;
  background: transparent;
}

.noxion-search__icon {
  display: none;
}

.noxion-toc {
  border-left: none;
}

.noxion-toc__link {
  border-left: none;
  padding-left: 0;
  font-size: 0.75rem;
  letter-spacing: 0.01em;
}

.noxion-toc__item--active > .noxion-toc__link {
  border-left: none;
  font-weight: 500;
}

.noxion-portfolio-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem 1.5rem;
}

@media (min-width: 1024px) {
  .noxion-portfolio-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.noxion-portfolio-card {
  border: none;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}

.noxion-portfolio-card:hover {
  box-shadow: none;
  transform: none;
}

.noxion-portfolio-card--featured {
  grid-column: 1 / -1;
  flex-direction: column;
}

.noxion-portfolio-card--featured .noxion-portfolio-card__cover {
  width: 100%;
  aspect-ratio: 2 / 1;
  min-height: unset;
}

.noxion-portfolio-card--featured .noxion-portfolio-card__body {
  flex: unset;
  justify-content: flex-start;
}

.noxion-portfolio-card__cover {
  aspect-ratio: 4 / 3;
  border-radius: 0;
  background-color: var(--noxion-muted);
}

.noxion-portfolio-card:hover .noxion-portfolio-card__cover-image {
  transform: scale(1.02);
}

.noxion-portfolio-card__body {
  padding: 1rem 0;
}

.noxion-portfolio-card__title {
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.noxion-portfolio-card__description {
  font-size: 0.8125rem;
  line-height: 1.6;
  opacity: 0.7;
}

.noxion-portfolio-card__year {
  font-size: 0.6875rem;
  font-weight: 400;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.5;
}

.noxion-portfolio-card__tech {
  gap: 0.25rem;
}

.noxion-portfolio-card__tech-tag {
  border-radius: 0;
  background: transparent;
  padding: 0;
  font-size: 0.6875rem;
  opacity: 0.5;
}

.noxion-portfolio-card__actions {
  padding-top: 0.5rem;
}

.noxion-portfolio-card__link {
  border: none;
  border-radius: 0;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  background: transparent;
  color: var(--noxion-foreground);
  border-bottom: 1px solid transparent;
}

.noxion-portfolio-card__link:hover {
  background: transparent;
  border-bottom-color: var(--noxion-foreground);
}

.noxion-portfolio-card__link--external {
  background: transparent;
  color: var(--noxion-foreground);
  border: none;
  border-bottom: 1px solid var(--noxion-foreground);
}

.noxion-portfolio-card__link--external:hover {
  opacity: 0.6;
  background: transparent;
  color: var(--noxion-foreground);
}

.noxion-portfolio-filter__tag {
  border: none;
  border-radius: 0;
  padding: 0.25rem 0;
  font-size: 0.8125rem;
  font-weight: 400;
  border-bottom: 1px solid transparent;
}

.noxion-portfolio-filter__tag:hover {
  background: transparent;
  border-bottom-color: var(--noxion-foreground);
}

.noxion-portfolio-filter__tag--selected {
  background: transparent;
  color: var(--noxion-foreground);
  border-bottom-color: var(--noxion-foreground);
}

.noxion-portfolio-filter__tag--selected:hover {
  background: transparent;
  opacity: 1;
}

.noxion-portfolio-project__header {
  border-bottom: none;
  padding-bottom: 0;
}

.noxion-portfolio-project__tech-tag {
  border-radius: 0;
  background: transparent;
  padding: 0;
  font-size: 0.6875rem;
  opacity: 0.5;
}

.noxion-portfolio-project__link {
  border-radius: 0;
  font-weight: 400;
  font-size: 0.75rem;
  letter-spacing: 0.02em;
}

.noxion-docs-sidebar {
  font-size: 0.75rem;
  letter-spacing: 0.01em;
}

.noxion-docs-sidebar__link {
  border-radius: 0;
  padding: 0.25rem 0.5rem;
}

.noxion-docs-sidebar__link:hover {
  background: transparent;
  color: var(--noxion-foreground);
}

.noxion-docs-sidebar__link--active {
  background: transparent;
  color: var(--noxion-foreground);
  font-weight: 500;
}

.noxion-docs-sidebar__link--active:hover {
  background: transparent;
}

.noxion-docs-nav {
  border-top: none;
  padding-top: 2rem;
}

.noxion-docs-nav__link {
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--noxion-border);
  padding: 0.75rem 0;
}

.noxion-docs-nav__link:hover {
  background: transparent;
  border-bottom-color: var(--noxion-foreground);
}

.noxion-docs-nav__label {
  font-size: 0.625rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.5;
}

.noxion-docs-nav__title {
  font-weight: 500;
  letter-spacing: -0.01em;
}

.noxion-docs-nav__next .noxion-docs-nav__link {
  align-items: flex-end;
}

.noxion-docs-breadcrumb {
  font-size: 0.6875rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  opacity: 0.5;
}

.noxion-docs-breadcrumb__link:hover {
  opacity: 1;
}

.noxion-featured-card {
  border-radius: 0;
  min-height: 400px;
}

.noxion-featured-card__cover-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.15) 40%,
    transparent 100%
  );
}

.noxion-featured-card:hover .noxion-featured-card__cover-image {
  transform: scale(1.02);
}

.noxion-featured-card__content {
  min-height: 400px;
  padding: 2rem;
}

.noxion-featured-card__category {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.7;
}

.noxion-featured-card__title {
  font-size: 1.75rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}

.noxion-featured-card__description {
  font-size: 0.875rem;
  opacity: 0.85;
}

.noxion-featured-card__meta {
  font-size: 0.75rem;
  opacity: 0.6;
}

.noxion-featured-card__tags {
  display: none;
}

.noxion-home-feed__title {
  font-size: 0.625rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.5;
  border-bottom: none;
  padding-bottom: 0;
}
`;

export const folioThemePackage: NoxionThemePackage = extendTheme(defaultThemePackage, {
  name: "folio",
  tokens: {
    colors: {
      primary: "#111111",
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#111111",
      muted: "#f5f5f5",
      mutedForeground: "#999999",
      border: "#eeeeee",
      accent: "#fafafa",
      accentForeground: "#111111",
      card: "#ffffff",
      cardForeground: "#111111",
    },
    fonts: {
      sans: '"Helvetica Neue", "Arial", system-ui, sans-serif',
      serif: '"Georgia", "Times New Roman", serif',
      mono: '"SF Mono", ui-monospace, SFMono-Regular, monospace',
    },
    spacing: {
      content: "1120px",
      sidebar: "220px",
    },
    borderRadius: "0",
    shadows: {
      sm: "none",
      md: "none",
      lg: "0 20px 60px rgba(0, 0, 0, 0.08)",
    },
    transitions: {
      fast: "120ms ease",
      normal: "200ms ease",
      slow: "400ms ease",
    },
    dark: {
      colors: {
        primary: "#ffffff",
        primaryForeground: "#000000",
        background: "#0e0e0e",
        foreground: "#e5e5e5",
        muted: "#1a1a1a",
        mutedForeground: "#777777",
        border: "#1f1f1f",
        accent: "#151515",
        accentForeground: "#e5e5e5",
        card: "#121212",
        cardForeground: "#e5e5e5",
      },
    },
  },
  stylesheet: folioStylesheet,
  supports: ["portfolio", "blog"],
});
