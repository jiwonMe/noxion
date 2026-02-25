# Breaking Changes: copy-dont-import Migration

**Plan**: copy-dont-import  
**Completed**: 2026-02-25  
**Commits**: Tasks 1–9 (see git log)

---

## Summary

This migration transitions Noxion from a runtime theme contract/provider system to a shadcn/ui-style component ownership model. Themes are no longer runtime dependencies — they are copied into user projects at scaffold time.

---

## Breaking Changes by Package

### `@noxion/renderer`

| Removed Export | Replacement |
|---|---|
| `NoxionThemeProvider` | Deleted — no replacement. Use layout components directly. |
| `NoxionThemeContract` | Deleted — no replacement. Use `NoxionLayoutProps` from `@noxion/renderer`. |
| `defineThemeContract()` | Deleted — no replacement. |
| `validateThemeContract()` | Deleted — no replacement. |
| `useThemeContract()` | Deleted — no replacement. |

**Migration**: Remove all `NoxionThemeProvider` wrappers from your app. Import layout components (`BlogLayout`, `DocsLayout`) directly from your theme package.

---

### `@noxion/theme-default`

| Removed Export | Replacement |
|---|---|
| `defaultThemeContract` | Deleted — no replacement. |
| All vanilla-extract `.css.ts` files | Replaced with Tailwind CSS classes inline. |

**New exports**: `BlogLayout`, `DocsLayout`, `Header`, `Footer`, `PostCard`, `TagBadge`, `ThemeToggle`, `HomePage`, `PostPage`, `ArchivePage`, `TagPage`, `NotFoundPage`

**Migration**: Replace `import { defaultThemeContract } from "@noxion/theme-default"` with direct component imports.

---

### `@noxion/theme-beacon`

| Removed Export | Replacement |
|---|---|
| `beaconThemeContract` | Deleted — no replacement. |
| All vanilla-extract `.css.ts` files | Replaced with Tailwind CSS classes inline. |

**New exports**: Same component set as theme-default, with Beacon's editorial wide-layout style.

---

### `@noxion/core`

| Changed | Details |
|---|---|
| `pageType` field | No longer hardcoded to `"blog" \| "docs" \| "portfolio"`. Now uses `PageTypeDefinition` registry. Custom page types can be registered via `registerPageType()`. |

**Migration**: If you relied on the hardcoded page type union, update to use the registry. Built-in types (`blog`, `docs`, `portfolio`) are still registered by default.

---

### `@noxion/adapter-nextjs`

| Changed | Details |
|---|---|
| Page type resolution | Now uses `PageTypeDefinition` registry instead of hardcoded switch. |

No API changes — fully backward compatible for built-in page types.

---

### `create-noxion` scaffold output

| Changed | Details |
|---|---|
| `providers.tsx` | **Removed** from all scaffolded templates. No longer generated. |
| `layout.tsx` | Now imports layout components directly. Uses a `SiteLayout` client wrapper to satisfy Next.js server/client boundary rules. |
| Component ownership | Theme components are **copied** into `src/components/noxion/` at scaffold time, not imported from npm. |

**New CLI commands**:
- `noxion add <component>` — copy a component from a theme into your project
- `noxion list` — list available components in a theme
- `noxion diff <component>` — diff your local copy against the upstream theme version

---

## Infrastructure Removed

| Removed | Details |
|---|---|
| `vanilla-extract` | All `*.css.ts` files deleted. Zero VE dependencies remain. |
| `@vanilla-extract/css` | Removed from all package.json files. |
| `@vanilla-extract/next-plugin` | Removed from all next.config files. |
| Theme contract runtime | `NoxionThemeProvider`, `NoxionThemeContract`, `defineThemeContract`, `validateThemeContract` all deleted. |

---

## Verification Evidence

```
# Build: 12/12 success
bun run build → Tasks: 12 successful, 12 total

# Tests: 409 pass, 2 known pre-existing failures
bun test → 409 pass, 2 fail (create-noxion plugin template @noxion/plugin-utils not installed)

# Contract symbols: 0
grep -r "NoxionThemeContract|NoxionThemeProvider|defineThemeContract|validateThemeContract" packages/renderer/src/ | wc -l → 0

# VE files: 0
find packages/ -name "*.css.ts" | wc -l → 0
```
