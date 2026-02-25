# Learnings: theme-ghost-overhaul

Convention discoveries, patterns, and reusable knowledge.

---

## 2026-02-24 Task 1: NoxionThemeContract

- **Props locations**: Most props in `types.ts` (HeaderProps, FooterProps, PostCardProps, etc.). HeroSectionProps/EmptyStateProps were in component files — added to `types.ts` for contract access. New `ThemeToggleProps` added.
- **Contract sub-interfaces**: `NoxionThemeContractComponents`, `NoxionThemeContractLayouts`, `NoxionThemeContractTemplates` — separated for reusability and clarity.
- **Validation pattern**: Follows existing `validate-theme.ts` pattern — `ValidationResult { valid, issues[] }` with `error`/`warning` severity.
- **Type indexing**: TS strict mode rejects `as Record<string, unknown>` on interfaces without index signatures. Use `as unknown as Record<string, unknown>` double-cast.
- **Required vs optional**: Components all required (16). Layouts: base+blog required, docs+magazine optional. Templates: home+post required, rest optional.
- **defineThemeContract**: Validates then returns identity (throws on errors, tolerates warnings).
- **bun path**: `$HOME/.bun/bin/bun` — needs PATH export.

## 2026-02-24 Task 2: Build Infrastructure

- **Tailwind v4 CSS-first**: No tailwind.config.ts needed! Use `@import "tailwindcss"` + `@theme {}` in CSS files.
- **VE + Next.js 16 Turbopack**: The `@vanilla-extract/next-plugin` injects webpack config. Next.js 16 defaults to Turbopack. Solution: add `turbopack: {}` to next config — Turbopack ignores the webpack config and works natively.
- **PostCSS conflict**: Installing `@tailwindcss/postcss` at root causes Next.js webpack to auto-detect and process ALL CSS through Tailwind, breaking existing `@import` statements. Solution: Don't add root `postcss.config.mjs` yet. PostCSS config should only be added when Tailwind CSS is actually imported in apps/web.
- **VE plugin with Turbopack**: The VE plugin's webpack config is ignored by Turbopack, but VE styles still compile correctly via transpilePackages. VE generates CSS at build time via TypeScript compilation.
- **Pre-existing test failures**: 2 failures in create-noxion template tests (missing @noxion/plugin-utils module). Not related to our changes.
