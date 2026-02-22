---
sidebar_position: 999
title: Changelog
description: Version history and release notes for Noxion.
---

# Changelog

All notable changes to the Noxion project are documented here.

---

## v0.1.0

**Released: 2026-02-22**

The first milestone release. Noxion now ships its own Notion block renderer (`@noxion/notion-renderer`), replacing the third-party `react-notion-x` dependency entirely. This gives full control over rendering, styling, and performance.

### New: `@noxion/notion-renderer`

A from-scratch Notion block renderer built specifically for Noxion.

- **30+ block types** — paragraph, headings (H1–H3), bulleted/numbered/to-do lists, quote, callout, divider, toggle, equation, code, image, video, audio, embed, bookmark, file, PDF, table, column layout, synced block, alias, table of contents, and collection view placeholder
- **Full rich text rendering** — bold, italic, strikethrough, underline, code, color, links, inline equations, inline mentions (user, page, date, database), and nested decorations
- **KaTeX math (SSR)** — equations rendered server-side via `katex.renderToString()`. Zero client-side math JS.
- **Shiki syntax highlighting** — VS Code-quality code blocks with dual-theme support (light + dark). 38 common languages preloaded. Runs asynchronously via `createShikiHighlighter()` factory — no Prism.js, no client-side highlighting.
- **Pure CSS with BEM** — ~1,250 lines of self-authored CSS using `noxion-{block}__{element}--{modifier}` naming. Themed via `--noxion-*` CSS custom properties. No Tailwind, no CSS-in-JS.
- **Dark mode** — dual selector support: `.noxion-renderer--dark` class and `[data-theme="dark"]` attribute. Works with the existing theme system out of the box.
- **94 unit tests** passing (`bun test`)

### Breaking changes

- **`react-notion-x` removed** — the `@noxion/renderer` package no longer depends on `react-notion-x`, `prismjs`, or client-side `katex`. If you imported anything from `react-notion-x` directly, migrate to `@noxion/notion-renderer` exports.
- **CSS imports changed** — `globals.css` in the web app now imports `@noxion/notion-renderer` styles instead of `react-notion-x` styles. If you have a custom app, update your CSS imports:
  ```css
  @import '@noxion/notion-renderer/styles';
  ```
- **`next.config.ts` update** — `transpilePackages` now includes `@noxion/notion-renderer` instead of `react-notion-x`.

### Improved

- **Theme system** — CSS variable-based theming now covers all Notion block types. Variables like `--noxion-foreground`, `--noxion-muted`, `--noxion-border`, `--noxion-font-mono` are used consistently throughout.
- **Callout layout** — fixed overflow bug where long content inside callouts could break the layout (flex overflow fix).
- **Image URL handling** — `mapImageUrl` properly routes Notion attachment URLs through the `notion.so/image/` proxy for stable, non-expiring URLs.
- **Code blocks** — Shiki dual-theme output uses inline `style` with `--shiki-dark` CSS variables, enabling seamless light/dark transitions without re-highlighting.

### Internal

- **Monorepo structure** — new `packages/notion-renderer/` package with clean exports: `NotionRenderer`, `NotionRendererProvider`, `useNotionRenderer`, `useNotionBlock`, `Text`, `createShikiHighlighter`, all block components, and full TypeScript types.
- **`create-noxion` template** updated to use `@noxion/notion-renderer`.
- **All packages** bumped to `0.1.0`.
- **252 total tests** passing across the monorepo (94 notion-renderer + 58 renderer + 116 core).
