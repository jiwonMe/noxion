# Learnings & Conventions

## [2026-02-23] Wave 1 Complete: Types & Plugin API

### Data Model Evolution
- BlogPost → NoxionPage with `pageType` discriminated union
- Old structure: flat fields (date, tags, category)
- New structure: `metadata: Record<string, unknown>` for type-specific data
- Backward compat: BlogPost exported as type alias to BlogPage

### Type System Patterns
- Type guards: `isBlogPage()`, `isDocsPage()`, `isPortfolioPage()`
- Discriminated union on `pageType` field
- Hierarchical fields: `parent`, `children`, `order` for docs navigation

### Plugin System Foundation
- 12 existing hooks with factory pattern
- 5 new hooks added (all optional for backward compat):
  - `registerPageTypes()` → PageTypeDefinition[]
  - `configSchema` → validation object
  - `onRouteResolve()` → route middleware
  - `extendSlots()` → UI slot extension
  - `extendCLI()` → CLICommand[]

### Test Infrastructure
- bun test runner
- 24 existing test files
- All tests passing (129 tests in core package)

### Monorepo Structure
- 6 packages: @noxion/core, @noxion/renderer, @noxion/notion-renderer, @noxion/adapter-nextjs, @noxion/theme-default, create-noxion
- 2 apps: web, docs
- Bun path: `~/.bun/bin/bun` (not on PATH)
