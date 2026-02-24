import type { NoxionThemePackage } from "@noxion/renderer";
import { extendTheme } from "@noxion/renderer";
import { defaultThemePackage } from "@noxion/theme-default";
import { BeaconHomePage } from "./BeaconHomePage";
import { BeaconPostPage } from "./BeaconPostPage";

const beaconStylesheet = `
.noxion-header {
  position: static;
  height: 100px;
  max-width: var(--noxion-spacing-content, 1320px);
  margin: 0 auto;
  border-bottom: none;
  background-color: var(--noxion-background);
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  padding: 0 max(4vmin, 20px);
}

.noxion-header__logo {
  font-size: 1.5rem;
  font-weight: 725;
  letter-spacing: -0.015em;
  white-space: nowrap;
  color: var(--noxion-foreground);
}

.noxion-header__logo svg {
  height: 1.5rem;
}

.noxion-header__logo:hover {
  opacity: 0.8;
}

.noxion-header__nav {
  gap: 28px;
}

.noxion-header__nav-link {
  font-size: 0.9375rem;
  font-weight: 550;
  letter-spacing: -0.004em;
  border-radius: 0;
  padding: 0;
  color: var(--noxion-foreground);
}

.noxion-header__nav-link:hover {
  background: transparent;
  color: var(--noxion-foreground);
  opacity: 0.8;
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
  opacity: 0.8;
}

.noxion-post-card__cover {
  aspect-ratio: 16 / 9;
  border-radius: 0;
}

.noxion-post-card__cover-image {
  object-fit: cover;
}

.noxion-post-card__category {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.noxion-post-card__title {
  font-size: 1.1875rem;
  font-weight: 725;
  letter-spacing: -0.014em;
  line-height: 1.3;
}

.noxion-post-card__description {
  font-size: 0.9063rem;
  line-height: 1.4;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -webkit-box;
  overflow: hidden;
  margin-top: 8px;
}

.noxion-post-card__meta {
  font-size: 0.7813rem;
  font-weight: 500;
  letter-spacing: -0.004em;
  color: var(--noxion-mutedForeground);
}

.noxion-post-card__tag {
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  background: transparent;
  border: none;
  padding: 0;
}

.noxion-post-list {
  gap: 42px;
}

.noxion-post-list--grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(248px, 1fr));
  overflow: hidden;
}

.noxion-tag-filter__tag {
  border-radius: 100px;
  font-size: 0.9375rem;
  font-weight: 550;
  letter-spacing: -0.004em;
  padding: 0.5em 1em;
}

.noxion-tag-filter__tag--selected {
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-footer {
  font-size: 0.875rem;
  font-weight: 450;
  border-top: 1px solid var(--noxion-border);
}

.noxion-search__input {
  border-radius: 40px;
  background-color: rgba(0, 0, 0, 0.05);
  border: none;
  font-size: 1.0625rem;
  font-weight: 450;
  letter-spacing: -0.008em;
  padding: 0.8em 1.4em;
  height: 56px;
}

.noxion-search__input:focus {
  box-shadow: none;
  background-color: rgba(0, 0, 0, 0.065);
}

[data-theme="dark"] .noxion-search__input {
  background-color: rgba(255, 255, 255, 0.1);
}

[data-theme="dark"] .noxion-search__input:focus {
  background-color: rgba(255, 255, 255, 0.15);
}

.noxion-toc {
  border-left: none;
}

.noxion-toc__heading {
  font-size: 0.75rem;
  font-weight: 550;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--noxion-border);
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.noxion-toc__link {
  font-size: 0.9375rem;
  font-weight: 500;
  letter-spacing: -0.004em;
  border-left: none;
  padding-left: 0;
}

.noxion-toc__item--active > .noxion-toc__link {
  border-left: none;
  font-weight: 650;
}

.noxion-portfolio-grid {
  grid-template-columns: repeat(auto-fit, minmax(248px, 1fr));
  gap: 42px;
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

.noxion-portfolio-card:hover .noxion-portfolio-card__title {
  opacity: 0.8;
}

.noxion-portfolio-card__cover {
  aspect-ratio: 16 / 9;
  border-radius: 0;
}

.noxion-portfolio-card__title {
  font-size: 1.1875rem;
  font-weight: 725;
  letter-spacing: -0.014em;
  line-height: 1.3;
}

.noxion-portfolio-card__description {
  font-size: 0.9063rem;
  line-height: 1.4;
}

.noxion-portfolio-card__year {
  font-size: 0.7813rem;
  font-weight: 500;
  letter-spacing: -0.004em;
  color: var(--noxion-mutedForeground);
}

.noxion-portfolio-card__tech-tag {
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.01em;
  background: transparent;
  border: none;
  padding: 0;
}

.noxion-portfolio-card__link {
  border-radius: 100px;
  font-size: 0.9375rem;
  font-weight: 600;
  letter-spacing: -0.004em;
}

.noxion-portfolio-filter__tag {
  border-radius: 100px;
  font-size: 0.9375rem;
  font-weight: 550;
}

.noxion-portfolio-filter__tag--selected {
  background-color: var(--noxion-foreground);
  color: var(--noxion-background);
}

.noxion-portfolio-project__tech-tag {
  border-radius: 0;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.noxion-portfolio-project__link {
  border-radius: 100px;
  font-size: 0.9375rem;
  font-weight: 600;
}

.noxion-docs-sidebar {
  font-size: 0.9375rem;
  font-weight: 450;
}

.noxion-docs-sidebar__link {
  border-radius: 4px;
  letter-spacing: -0.004em;
}

.noxion-docs-sidebar__link--active {
  font-weight: 650;
  color: var(--noxion-foreground);
  background-color: var(--noxion-accent);
}

.noxion-docs-sidebar__link--active:hover {
  background-color: var(--noxion-accent);
}

.noxion-docs-nav__link {
  border-radius: 4px;
}

.noxion-docs-nav__label {
  font-size: 0.75rem;
  font-weight: 550;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.noxion-docs-nav__title {
  font-weight: 650;
  letter-spacing: -0.014em;
}

.noxion-docs-breadcrumb {
  font-size: 0.75rem;
  font-weight: 550;
  letter-spacing: 0.025em;
  text-transform: uppercase;
}

.noxion-featured-card {
  border-radius: 0;
  min-height: 380px;
}

.noxion-featured-card__cover-overlay {
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    rgba(0, 0, 0, 0.1) 100%
  );
}

.noxion-featured-card__content {
  min-height: 380px;
  padding: 2rem;
}

.noxion-featured-card__category {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

.noxion-featured-card__title {
  font-size: clamp(1.75rem, 1.36vw + 1.4rem, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.022em;
  line-height: 1.1;
}

.noxion-featured-card__description {
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  line-height: 1.4;
}

.noxion-featured-card__meta {
  font-size: 0.7813rem;
  font-weight: 500;
  letter-spacing: -0.004em;
}

.noxion-featured-card__tag {
  border-radius: 0;
  background: transparent;
  border: none;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
}

@media (max-width: 768px) {
  .noxion-featured-card {
    min-height: 300px;
  }

  .noxion-featured-card__content {
    min-height: 300px;
  }
}

@media (max-width: 640px) {
  .noxion-featured-card {
    min-height: 240px;
  }

  .noxion-featured-card__content {
    min-height: 240px;
    padding: 1.5rem;
  }
}

.noxion-home-feed__title {
  font-size: 0.75rem;
  font-weight: 550;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--noxion-border);
  padding-bottom: 12px;
}

.noxion-template-post {
  --beacon-content-spacing: 28px;
  --beacon-content-width: 720px;
  --beacon-link-color: #004080;
  --beacon-link-color-dark: #6ab0f3;
}

.noxion-page {
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto auto auto;
}

.noxion-page__main {
  display: contents;
}

.noxion-page__icon {
  display: none;
}

.noxion-page__title {
  order: 1;
  font-size: clamp(2.5rem, 2.73vw + 1.91rem, 3.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
  max-width: 960px;
  padding: clamp(40px, 3.64vw + 25.45px, 72px) max(4vmin, 20px) 0;
}

.noxion-page__cover {
  order: 2;
  margin-top: 2.5rem;
}

.noxion-page__content {
  order: 3;
  max-width: var(--beacon-content-width, 720px);
  margin: 0 auto;
  padding: 2.5rem 1.25rem calc(max(10vh, 100px));
  width: 100%;
}

.noxion-template-post__header {
  max-width: var(--noxion-spacing-content, 1320px);
  padding: clamp(40px, 3.64vw + 25.45px, 72px) max(4vmin, 20px) 0;
}

.noxion-template-post__topics {
  margin-bottom: 1.25rem;
}

.noxion-template-post__category {
  font-size: 0.8125rem;
  font-weight: 500;
  letter-spacing: 0.01em;
}

.noxion-template-post__tag {
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 500;
}

.noxion-template-post__title {
  font-size: clamp(2.5rem, 2.73vw + 1.91rem, 3.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
  max-width: 960px;
}

.noxion-template-post__description {
  display: none;
}

.noxion-template-post__meta {
  gap: 8px;
  margin-top: 1.75rem;
  padding-top: 0;
  border-top: none;
}

.noxion-template-post__author {
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: -0.013em;
}

.noxion-template-post__meta-dot {
  display: inline-block;
}

.noxion-template-post__date {
  font-size: 0.875rem;
  font-weight: 400;
  letter-spacing: -0.006em;
}

.noxion-template-post__cover {
  max-height: 680px;
  margin-top: 2.5rem;
}

.noxion-template-post__cover-image {
  max-height: 680px;
}

.noxion-template-post__body {
  max-width: var(--beacon-content-width);
  padding: 2.5rem 1.25rem calc(max(10vh, 100px));
}

.noxion-template-post .noxion-page__icon {
  display: none;
}

.noxion-template-post .noxion-page__title {
  font-size: clamp(2.5rem, 2.73vw + 1.91rem, 3.75rem);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

.noxion-template-post .noxion-page__description {
  font-size: clamp(0.9375rem, 0.45vw + 0.82rem, 1.1875rem);
  letter-spacing: -0.018em;
  line-height: 1.4;
}

.noxion-template-post .noxion-heading {
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.2;
  margin-top: calc(var(--beacon-content-spacing) * 2);
  margin-bottom: 0;
}

.noxion-template-post .noxion-heading + .noxion-text,
.noxion-template-post .noxion-heading + .noxion-list {
  margin-top: calc(var(--beacon-content-spacing) * 0.43);
}

.noxion-template-post .noxion-heading--h1 {
  font-size: 2.2em;
  letter-spacing: -0.02em;
}

.noxion-template-post .noxion-heading--h2 {
  font-size: 1.6em;
  letter-spacing: -0.02em;
}

.noxion-template-post .noxion-heading--h3 {
  font-size: 1.3em;
  letter-spacing: -0.017em;
}

.noxion-template-post .noxion-text {
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
  line-height: 1.6;
}

.noxion-template-post .noxion-text + .noxion-text {
  margin-top: var(--beacon-content-spacing);
}

.noxion-template-post .noxion-link {
  color: var(--beacon-link-color);
  text-decoration: underline;
}

.noxion-template-post .noxion-link:hover {
  opacity: 0.8;
}

[data-theme="dark"] .noxion-template-post .noxion-link {
  color: var(--beacon-link-color-dark);
}

.noxion-template-post .noxion-list {
  padding-left: 28px;
  font-size: 1.0625rem;
  letter-spacing: -0.01em;
  line-height: 1.6;
}

.noxion-template-post .noxion-list-item + .noxion-list-item {
  margin-top: 8px;
}

.noxion-template-post .noxion-list-item .noxion-list {
  margin-top: 8px;
}

.noxion-template-post .noxion-quote {
  border-left: 4px solid var(--beacon-link-color);
  padding-left: 2rem;
  font-size: 1em;
  font-style: normal;
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
  color: var(--noxion-foreground);
}

.noxion-template-post .noxion-quote + * {
  margin-top: calc(var(--beacon-content-spacing) * 1.71) !important;
}

[data-theme="dark"] .noxion-template-post .noxion-quote {
  border-left-color: var(--beacon-link-color-dark);
}

.noxion-template-post .noxion-quote--alt {
  border-left: none;
  padding-left: 0;
  text-align: center;
  font-style: normal;
  font-weight: 400;
  color: var(--noxion-mutedForeground);
}

.noxion-template-post .noxion-callout {
  border-radius: 0.25em;
  border: 1px solid var(--noxion-border);
  background-color: var(--noxion-accent);
  padding: 1.25em;
  font-size: 0.95em;
}

.noxion-template-post .noxion-callout .noxion-callout-text,
.noxion-template-post .noxion-callout .noxion-text {
  font-size: 0.95em;
}

.noxion-template-post .noxion-code {
  border-radius: 6px;
  border: none;
  background: var(--noxion-accent);
  font-size: 0.9375rem;
  line-height: 1.5;
  padding: 16px;
  overflow: auto;
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
  font-family: var(--noxion-font-mono);
}

.noxion-template-post .noxion-code + *:not(.noxion-code) {
  margin-top: calc(var(--beacon-content-spacing) * 1.71) !important;
}

.noxion-template-post .noxion-code__header {
  border-bottom: 1px solid var(--noxion-border);
  font-family: var(--noxion-font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  padding: 8px 16px;
  color: var(--noxion-mutedForeground);
}

.noxion-template-post .noxion-inline-code {
  background: var(--noxion-accent);
  border-radius: 0.25em;
  font-size: 0.95em;
  font-weight: 400;
  padding: 0.15em 0.4em;
  font-family: var(--noxion-font-mono);
  vertical-align: baseline;
  line-height: 1em;
}

.noxion-template-post .noxion-divider {
  background-color: var(--noxion-border);
  border: none;
  height: 1px;
  width: 100%;
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
}

.noxion-template-post .noxion-divider + * {
  margin-top: calc(var(--beacon-content-spacing) * 1.71) !important;
}

.noxion-template-post .noxion-image {
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
  margin-left: calc(-50vw + 50%);
  margin-right: calc(-50vw + 50%);
  width: 100vw;
  max-width: min(1120px, 100vw);
  margin-left: calc((min(1120px, 100vw) - 100%) / -2);
  margin-right: calc((min(1120px, 100vw) - 100%) / -2);
}

.noxion-template-post .noxion-image + *:not(.noxion-image) {
  margin-top: calc(var(--beacon-content-spacing) * 1.71) !important;
}

.noxion-template-post .noxion-image img {
  max-width: 100%;
  height: auto;
  width: 100%;
}

.noxion-template-post .noxion-image__caption {
  font-size: 0.875rem;
  text-align: center;
  margin-top: 12px;
  color: var(--noxion-mutedForeground);
  line-height: 1.4;
}

.noxion-template-post .noxion-image__caption a {
  color: var(--beacon-link-color);
  text-decoration: underline;
}

[data-theme="dark"] .noxion-template-post .noxion-image__caption a {
  color: var(--beacon-link-color-dark);
}

.noxion-template-post .noxion-bookmark {
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
}

.noxion-template-post .noxion-bookmark__link {
  border: 1px solid var(--noxion-border);
  border-radius: 0.25em;
  display: flex;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
}

.noxion-template-post .noxion-bookmark__link:hover {
  opacity: 1;
  border-color: var(--noxion-mutedForeground);
}

.noxion-template-post .noxion-bookmark__content {
  padding: 1.15em;
  flex: 1;
}

.noxion-template-post .noxion-bookmark__title {
  font-size: 0.9em;
  font-weight: 600;
  letter-spacing: -0.01em;
}

.noxion-template-post .noxion-bookmark__description {
  font-size: 0.8em;
  color: var(--noxion-mutedForeground);
  margin-top: 0.3em;
  max-height: none;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.noxion-template-post .noxion-bookmark__metadata {
  font-size: 0.8em;
  color: var(--noxion-mutedForeground);
  margin-top: 0.5em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.noxion-template-post .noxion-bookmark__favicon {
  width: 16px;
  height: 16px;
  border-radius: 2px;
}

.noxion-template-post .noxion-bookmark__thumbnail img {
  border-radius: 0 0.2em 0.2em 0;
  object-fit: cover;
  height: 100%;
}

.noxion-template-post .noxion-table {
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
}

.noxion-template-post .noxion-table table {
  border-collapse: collapse;
  border-spacing: 0;
  font-size: 0.9375rem;
  vertical-align: top;
  white-space: nowrap;
  width: 100%;
  font-family: var(--noxion-font-sans);
}

.noxion-template-post .noxion-table th {
  color: var(--noxion-foreground);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: left;
  text-transform: uppercase;
}

.noxion-template-post .noxion-table th,
.noxion-template-post .noxion-table td {
  border-bottom: 1px solid var(--noxion-border);
  padding: 6px 12px;
}

.noxion-template-post .noxion-table th:first-child,
.noxion-template-post .noxion-table td:first-child {
  padding-left: 0;
}

.noxion-template-post .noxion-table th:last-child,
.noxion-template-post .noxion-table td:last-child {
  padding-right: 0;
}

.noxion-template-post .noxion-toggle {
  margin-top: var(--beacon-content-spacing);
}

.noxion-template-post .noxion-toggle__heading-text {
  font-size: 1.25rem;
  font-weight: 700;
}

.noxion-template-post .noxion-toggle__content > p,
.noxion-template-post .noxion-toggle__content > ul,
.noxion-template-post .noxion-toggle__content > ol {
  font-size: 0.95em;
}

.noxion-template-post .noxion-embed {
  display: flex;
  align-items: center;
  flex-direction: column;
  width: 100%;
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
}

.noxion-template-post .noxion-video {
  margin-top: calc(var(--beacon-content-spacing) * 1.71);
  margin-bottom: 0;
}

.noxion-template-post .noxion-equation {
  margin-top: var(--beacon-content-spacing);
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .noxion-template-post__header {
    padding: clamp(32px, 2vw + 24px, 48px) 1rem 0;
  }

  .noxion-template-post__title {
    font-size: clamp(1.75rem, 2vw + 1.2rem, 2.5rem);
    line-height: 1.1;
  }

  .noxion-template-post__body {
    padding: 1.5rem 1rem calc(max(8vh, 80px));
  }

  .noxion-template-post__cover {
    max-height: 400px;
    margin-top: 2rem;
  }

  .noxion-template-post__cover-image {
    max-height: 400px;
  }

  .noxion-template-post .noxion-image {
    margin-left: -1rem;
    margin-right: -1rem;
    width: calc(100% + 2rem);
    max-width: calc(100% + 2rem);
  }
}

@media (max-width: 480px) {
  .noxion-template-post__header {
    padding: 1.5rem 1rem 0;
  }

  .noxion-template-post__title {
    font-size: 1.625rem;
  }

  .noxion-template-post__meta {
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .noxion-template-post__cover {
    max-height: 280px;
  }

  .noxion-template-post__cover-image {
    max-height: 280px;
  }
}

.beacon-home {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.beacon-header-grid {
  --grid-gap: 42px;
  display: grid;
  gap: var(--grid-gap);
  grid-template-columns: repeat(16, 1fr);
  max-width: var(--noxion-spacing-content, 1320px);
  margin: 0 auto;
  padding: 40px max(4vmin, 20px) 0;
}

.beacon-header-grid__left {
  grid-column: span 8;
  position: relative;
}

.beacon-header-grid__middle {
  display: flex;
  flex-direction: column;
  gap: var(--grid-gap);
  grid-column: 9 / span 4;
  position: relative;
}

.beacon-header-grid__right {
  grid-column: 13 / -1;
}

.beacon-header-grid__left::after,
.beacon-header-grid__middle::after {
  content: "";
  position: absolute;
  top: 0;
  right: calc(var(--grid-gap) / -2);
  width: 1px;
  height: 100%;
  background-color: var(--noxion-border);
}

.beacon-card {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.beacon-card:hover {
  opacity: 1;
}

.beacon-card:hover .beacon-card__title {
  opacity: 0.8;
}

.beacon-card__image {
  flex-shrink: 0;
  margin: 0;
  position: relative;
}

.beacon-card__image img {
  width: 100%;
  height: auto;
  display: block;
}

.beacon-card--large .beacon-card__image img {
  aspect-ratio: 3 / 2;
  object-fit: cover;
}

.beacon-card__wrapper {
  flex-grow: 1;
}

.beacon-card__tag {
  margin: 0 0 4px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: var(--noxion-foreground);
}

.beacon-card__title {
  margin: 0;
  font-size: 1.1875rem;
  font-weight: 725;
  letter-spacing: -0.014em;
  line-height: 1.3;
  transition: opacity 0.2s;
}

.beacon-card--large .beacon-card__title {
  font-size: clamp(1.75rem, 1.36vw + 1.4rem, 2.5rem);
  font-weight: 700;
  letter-spacing: -0.022em;
  line-height: 1.1;
}

.beacon-card__excerpt {
  margin: 8px 0 0;
  font-size: 0.9063rem;
  line-height: 1.4;
  color: var(--noxion-foreground);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.beacon-card--large .beacon-card__excerpt {
  font-size: 1.125rem;
  letter-spacing: -0.02em;
  -webkit-line-clamp: 3;
  max-width: 90%;
}

.beacon-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 12px;
  font-size: 0.7813rem;
  font-weight: 500;
  letter-spacing: -0.004em;
  color: var(--noxion-mutedForeground);
  line-height: 1.05;
}

.beacon-card__author + .beacon-card__date::before {
  content: "—";
  margin-right: 4px;
}

.beacon-card--medium + .beacon-card--medium::before {
  content: "";
  position: absolute;
  top: calc(var(--grid-gap) / -2);
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--noxion-border);
}

.beacon-card--medium .beacon-card__image img {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.beacon-card--list {
  flex-direction: row;
  align-items: center;
  gap: 24px;
}

.beacon-card--list .beacon-card__image {
  width: 220px;
  flex-shrink: 0;
}

.beacon-card--list .beacon-card__image img {
  aspect-ratio: 1.618;
  object-fit: cover;
}

.beacon-card--list + .beacon-card--list::before {
  content: "";
  position: absolute;
  top: calc(var(--grid-gap) / -2);
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--noxion-border);
}

.beacon-sidebar-card {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  gap: 16px;
  text-decoration: none;
  color: inherit;
  position: relative;
}

.beacon-sidebar-card:hover {
  opacity: 1;
}

.beacon-sidebar-card:hover .beacon-sidebar-card__title {
  opacity: 0.8;
}

.beacon-sidebar-card__image {
  flex-shrink: 0;
  width: 72px;
  margin: 0;
}

.beacon-sidebar-card__image img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  display: block;
}

.beacon-sidebar-card__wrapper {
  flex-grow: 1;
}

.beacon-sidebar-card__tag {
  margin: 0 0 4px;
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  display: none;
}

.beacon-sidebar-card__title {
  margin: 0;
  font-size: 1rem;
  font-weight: 650;
  letter-spacing: -0.011em;
  line-height: 1.3;
  transition: opacity 0.2s;
}

.beacon-sidebar-card__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 10px;
  font-size: 0.7813rem;
  font-weight: 500;
  letter-spacing: -0.004em;
  color: var(--noxion-mutedForeground);
  line-height: 1.05;
}

.beacon-sidebar-card__author + .beacon-sidebar-card__date::before {
  content: "—";
  margin-right: 4px;
}

.beacon-featured-feed {
  display: flex;
  flex-direction: column;
  gap: var(--grid-gap);
}

.beacon-featured-feed .beacon-sidebar-card + .beacon-sidebar-card::before {
  content: "";
  position: absolute;
  top: calc(var(--grid-gap) / -2);
  left: 0;
  width: 100%;
  height: 1px;
  background-color: var(--noxion-border);
}

.beacon-latest {
  max-width: var(--noxion-spacing-content, 1120px);
  margin: 0 auto;
  padding: max(4vw, 40px) max(4vmin, 20px) 0;
  width: 100%;
}

.beacon-latest__title {
  font-size: 0.75rem;
  font-weight: 550;
  letter-spacing: 0.025em;
  text-transform: uppercase;
  border-bottom: 1px solid var(--noxion-border);
  padding-bottom: 12px;
  margin: 0 0 calc(var(--grid-gap, 42px) / 2);
}

.beacon-latest__feed {
  display: flex;
  flex-direction: column;
  gap: var(--grid-gap, 42px);
}

@media (max-width: 1199px) {
  .beacon-header-grid {
    grid-template-columns: repeat(9, 1fr);
  }

  .beacon-header-grid__left {
    grid-column: span 6;
  }

  .beacon-header-grid__middle {
    grid-column: 7 / -1;
  }

  .beacon-header-grid__right {
    grid-column: 1 / -1;
  }

  .beacon-header-grid__middle::after {
    display: none;
  }

  .beacon-featured-feed {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .beacon-featured-feed .beacon-sidebar-card::before {
    width: calc(100% + var(--grid-gap)) !important;
  }

  .beacon-featured-feed .beacon-sidebar-card::after {
    content: "";
    position: absolute;
    top: 0;
    left: calc(var(--grid-gap) / -2);
    width: 1px;
    height: 100%;
    background-color: var(--noxion-border);
  }

  .beacon-header-grid__right::before {
    content: "";
    position: absolute;
    top: calc(var(--grid-gap) / -2);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--noxion-border);
  }

  .beacon-header-grid__right {
    position: relative;
  }
}

@media (max-width: 767px) {
  .beacon-header-grid {
    display: flex;
    flex-direction: column;
    padding: 20px max(4vmin, 20px) 0;
  }

  .beacon-header-grid__left::after,
  .beacon-header-grid__middle::after {
    display: none;
  }

  .beacon-card + .beacon-card::before,
  .beacon-header-grid__middle::before,
  .beacon-header-grid__right::before {
    content: "";
    position: absolute;
    top: calc(var(--grid-gap) / -2);
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--noxion-border);
  }

  .beacon-header-grid__middle,
  .beacon-header-grid__right {
    position: relative;
  }

  .beacon-featured-feed {
    display: flex;
    flex-direction: column;
  }

  .beacon-card--list {
    flex-direction: column;
  }

  .beacon-card--list .beacon-card__image {
    width: 100%;
  }
}
`;

export const beaconThemePackage: NoxionThemePackage = extendTheme(defaultThemePackage, {
  name: "beacon",
  tokens: {
    colors: {
      primary: "#000000",
      primaryForeground: "#ffffff",
      background: "#ffffff",
      foreground: "#15171a",
      muted: "rgba(0, 0, 0, 0.05)",
      mutedForeground: "rgba(0, 0, 0, 0.55)",
      border: "rgba(0, 0, 0, 0.08)",
      accent: "rgba(0, 0, 0, 0.05)",
      accentForeground: "#15171a",
      card: "#ffffff",
      cardForeground: "#15171a",
    },
    fonts: {
      sans: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      serif: '"EB Garamond", Georgia, Times, serif',
      mono: '"JetBrains Mono", Menlo, Consolas, Monaco, "Liberation Mono", "Lucida Console", monospace',
    },
    spacing: {
      content: "1320px",
      sidebar: "280px",
    },
    borderRadius: "0",
    shadows: {
      sm: "none",
      md: "none",
      lg: "none",
    },
    transitions: {
      fast: "100ms ease",
      normal: "200ms ease",
      slow: "300ms ease",
    },
    dark: {
      colors: {
        primary: "#ffffff",
        primaryForeground: "#15171a",
        background: "#15171a",
        foreground: "#ffffff",
        muted: "rgba(255, 255, 255, 0.1)",
        mutedForeground: "rgba(255, 255, 255, 0.64)",
        border: "rgba(255, 255, 255, 0.15)",
        accent: "rgba(255, 255, 255, 0.1)",
        accentForeground: "#ffffff",
        card: "#1e2025",
        cardForeground: "#ffffff",
      },
    },
  },
  templates: {
    home: BeaconHomePage,
    post: BeaconPostPage,
  },
  stylesheet: beaconStylesheet,
  supports: ["blog", "docs"],
});
