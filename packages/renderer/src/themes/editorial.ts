import type { NoxionThemePackage } from "../theme/types";
import { extendTheme } from "../theme/extend-theme";
import { defaultThemePackage } from "./default";

const editorialStylesheet = `
.noxion-header {
  height: 64px;
  border-bottom: 2px solid var(--noxion-foreground);
}

.noxion-header__logo {
  font-family: var(--noxion-font-display);
  font-size: 1.125rem;
  font-weight: 700;
  letter-spacing: -0.04em;
}

.noxion-header__nav-link {
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: -0.01em;
}

.noxion-layout__content {
  max-width: var(--noxion-spacing-content);
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

.noxion-post-card:hover .noxion-post-card__title {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1.5px;
}

.noxion-post-card__cover {
  aspect-ratio: 3 / 2;
  border-radius: 4px;
  overflow: hidden;
}

.noxion-post-card__title {
  font-family: var(--noxion-font-display);
  font-size: 1.375rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.25;
}

.noxion-post-card__description {
  font-family: var(--noxion-font-serif);
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--noxion-mutedForeground);
}

.noxion-post-card__category {
  font-family: var(--noxion-font-sans);
  font-weight: 700;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--noxion-primary);
}

.noxion-post-card__date {
  font-family: var(--noxion-font-sans);
}

.noxion-post-card__tag {
  border-radius: 2px;
  font-weight: 600;
  font-size: 0.625rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.noxion-post-list {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2.5rem;
}

@media (min-width: 768px) {
  .noxion-post-list--featured .noxion-post-card:first-child {
    grid-column: 1 / -1;
  }

  .noxion-post-list--featured .noxion-post-card:first-child .noxion-post-card__title {
    font-size: 2rem;
  }

  .noxion-post-list--featured .noxion-post-card:first-child .noxion-post-card__cover {
    aspect-ratio: 2 / 1;
  }
}

.noxion-tag-filter__tag {
  border-radius: 2px;
  font-weight: 600;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-width: 2px;
}

.noxion-tag-filter__tag--selected {
  border-color: var(--noxion-foreground);
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-footer {
  border-top: 2px solid var(--noxion-foreground);
  padding: 2rem 1.25rem;
}

.noxion-toc__heading {
  font-family: var(--noxion-font-sans);
  font-weight: 700;
  letter-spacing: 0.08em;
}

.noxion-search__input {
  border-radius: 2px;
  border-width: 2px;
}

.noxion-search__input:focus {
  border-color: var(--noxion-foreground);
  box-shadow: none;
}
`;

export const editorialThemePackage: NoxionThemePackage = extendTheme(defaultThemePackage, {
  name: "editorial",
  tokens: {
    colors: {
      primary: "#c42d2d",
      primaryForeground: "#ffffff",
      background: "#fdfcfa",
      foreground: "#1a1a1a",
      muted: "#f3f1ec",
      mutedForeground: "#6b6560",
      border: "#e5e0d8",
      accent: "#f7f5f0",
      accentForeground: "#1a1a1a",
      card: "#fdfcfa",
      cardForeground: "#1a1a1a",
    },
    fonts: {
      sans: '"Inter", system-ui, -apple-system, sans-serif',
      serif: '"Lora", "Georgia", "Times New Roman", serif',
      mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
      display: '"Playfair Display", "Georgia", serif',
    },
    spacing: {
      content: "960px",
      sidebar: "280px",
    },
    borderRadius: "4px",
    shadows: {
      sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
      md: "0 4px 12px rgba(0, 0, 0, 0.08)",
      lg: "0 8px 28px rgba(0, 0, 0, 0.12)",
    },
    dark: {
      colors: {
        primary: "#e85d5d",
        primaryForeground: "#ffffff",
        background: "#121110",
        foreground: "#e8e4de",
        muted: "#1e1c19",
        mutedForeground: "#9a958d",
        border: "#2a2723",
        accent: "#1a1816",
        accentForeground: "#e8e4de",
        card: "#161412",
        cardForeground: "#e8e4de",
      },
    },
  },
  stylesheet: editorialStylesheet,
  supports: ["blog"],
});
