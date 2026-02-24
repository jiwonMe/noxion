# Noxion v0.2: Website Builder Ecosystem Evolution

## TL;DR

> **Quick Summary**: Transform noxion from a Notion blog builder into a full-featured Notion Website Builder supporting Blog + Docs + Portfolio page types, with a layered UX (zero-config for creators, deep customization for developers), enhanced plugin/theme ecosystem, and framework-neutral core architecture.
> 
> **Deliverables**:
> - Generic `NoxionPage` data model replacing `BlogPost`
> - Enhanced plugin API with page type registration, config validation, component/slot extension
> - Multi-page-type theme system with inheritance and community conventions
> - New CLI commands (`noxion add`, `noxion validate`)
> - Plugin & theme ecosystem infrastructure (starters, conventions, test utilities)
> - Docs & Portfolio page type support with templates and layouts
> - Migration layer for backward compatibility
> 
> **Estimated Effort**: XL (multi-sprint, phased roadmap)
> **Parallel Execution**: YES - 4 waves
> **Critical Path**: Phase 1 (Data Model) → Phase 2 (Plugin API) → Phase 3 (Theme + Page Types) → Phase 4 (Ecosystem + DX)

---

## Context

### Original Request
User wants noxion to become a more powerful library with a wider user ecosystem. The question was: what features are needed and what structural changes are required?

### Interview Summary
**Key Discussions**:
- **Identity**: Notion Website Builder (not just blog). Open-source super.so/oopy.io alternative.
- **Target**: Layered approach — creators start with zero-config, developers customize deeply (Docusaurus model)
- **Breaking changes**: Freely allowed at v0.1.x — this is the time to redesign
- **Data model**: BlogPost → NoxionPage with pageType + metadata. Hybrid schema mapping (convention + config override)
- **Framework**: Next.js first, design core/renderer as framework-neutral for future adapter-astro etc.
- **Notion API**: Keep notion-client (unofficial). No migration.
- **Ecosystem**: Plugin-first growth. Enhance plugin API, make community plugins easy.
- **Page types**: Blog + Docs + Portfolio initially
- **Themes**: 2-3 official themes to start, enable community themes via inheritance/conventions

**Research Findings**:
- Current codebase has 6 packages at v0.1.x, 24 test files, solid architecture base
- Plugin system already has 12 hooks and factory pattern — good foundation to extend
- Theme system already has NoxionThemePackage with tokens/layouts/templates/components/slots
- `@noxion/notion-renderer` is a custom implementation (27 block types) replacing react-notion-x
- SEO is comprehensive (JSON-LD 4 types, OG, Twitter, sitemap, RSS, robots.txt)
- CONTRIBUTING.md and Docusaurus docs site already exist

### Gap Analysis (Self-Conducted, Metis-Level)

**Questions that should have been asked (addressed in plan)**:
1. Migration strategy for existing BlogPost API users → Added backward compat layer
2. New packages needed → Added @noxion/plugin-utils, @noxion/types
3. How to detect page types in Notion → Hybrid: separate DBs or Type property in single DB
4. Version strategy → v0.2.0 (semver minor, since pre-1.0 breaking changes are expected)

**Guardrails identified**:
1. BlogPost type must remain as type alias for one version cycle
2. Zero-config path must always work (adding collections is optional)
3. Plugin API additions are phased — don't add all hooks at once
4. Tests must accompany every change
5. Bundle size must not regress significantly

**Scope creep risks**:
1. Building a full plugin marketplace too early → Deferred to future
2. i18n and caching as core features → Explicitly scoped as plugins
3. Multi-framework adapters → Explicitly Next.js only in this plan
4. Visual admin dashboard → Explicitly OUT of scope
5. Over-engineering plugin hooks → Start with most-needed only

---

## Work Objectives

### Core Objective
Transform noxion from a blog-only tool into a Notion Website Builder that supports multiple page types (Blog, Docs, Portfolio), with a plugin and theme ecosystem that enables community growth.

### Concrete Deliverables
- `@noxion/core` v0.2: NoxionPage model, enhanced plugin API, collection system
- `@noxion/renderer` v0.2: Multi-page-type templates, theme inheritance support
- `@noxion/adapter-nextjs` v0.2: Multi-page-type routing, metadata for all types
- `@noxion/theme-default` v0.2: Blog + Docs + Portfolio templates
- `create-noxion` v0.2: Template selection (blog, docs, portfolio), plugin scaffolding
- `@noxion/plugin-utils` v0.1: New package for plugin testing utilities
- Updated documentation covering all new APIs

### Definition of Done
- [ ] `bun run test` passes across all packages (0 failures)
- [ ] `bun run build` succeeds for all packages
- [ ] Demo app (`apps/web`) works with new NoxionPage model
- [ ] Blog backward compatibility: existing blog configurations still work
- [ ] Docs page type: sidebar navigation, hierarchical pages
- [ ] Portfolio page type: project grid with filtering
- [ ] At least 1 community-style plugin can be built using new API
- [ ] Documentation updated for all new features

### Must Have
- NoxionPage generic data model with pageType discrimination
- Backward compatibility layer (BlogPost as type alias)
- Collections config for multi-database support
- Plugin registerPageTypes() hook
- Plugin configSchema validation
- Multi-page-type template map in theme system
- Theme inheritance mechanism
- Updated CLI with template selection
- All existing tests passing + new tests for new features

### Must NOT Have (Guardrails)
- NO multi-framework adapters in this plan (Next.js only)
- NO visual admin dashboard or WYSIWYG editor
- NO Notion official API migration (keep notion-client)
- NO plugin marketplace/registry website (just conventions + docs)
- NO i18n as core feature (design as plugin-compatible, implement later)
- NO caching layer as core feature (design as plugin-compatible, implement later)
- NO over-engineered plugin hooks (only add hooks with clear use cases)
- NO SSG/static export improvements (focus on ISR/SSR for now)
- DO NOT add `as any` or `@ts-ignore` — maintain TypeScript strict mode
- DO NOT increase bundle size by more than 15% per package

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (bun test, 24 existing test files)
- **User wants tests**: YES (TDD where possible, tests alongside implementation)
- **Framework**: bun test (existing)

### Approach
Each TODO includes test requirements. All changes must maintain or improve test coverage.

**Test Commands**:
```bash
bun run test          # All packages
bun run build         # Verify build succeeds
bun test              # Individual package (from package dir)
```

---

## Execution Strategy

### Parallel Execution Waves

```
Phase 1 — Foundation (Wave 1-2):
├── Wave 1 (Start Immediately):
│   ├── TODO 1: @noxion/core types redesign (NoxionPage, collections)
│   └── TODO 2: Plugin API type extensions (new hooks interfaces)
│
├── Wave 2 (After Wave 1):
│   ├── TODO 3: Fetcher refactoring (multi-collection, pageType detection)
│   ├── TODO 4: Plugin loader/executor updates (new hooks)
│   └── TODO 5: Config system evolution (collections, validation)

Phase 2 — Rendering & Themes (Wave 3):
├── Wave 3 (After Wave 2):
│   ├── TODO 6: Renderer template map expansion
│   ├── TODO 7: Theme inheritance system
│   ├── TODO 8: theme-default: Docs templates & components
│   └── TODO 9: theme-default: Portfolio templates & components

Phase 3 — Adapter & Integration (Wave 4):
├── Wave 4 (After Wave 3):
│   ├── TODO 10: adapter-nextjs multi-page-type routing
│   ├── TODO 11: adapter-nextjs metadata/SEO for all page types
│   ├── TODO 12: apps/web demo update (showcase all page types)
│   └── TODO 13: Backward compatibility layer & migration

Phase 4 — Ecosystem & DX (Wave 5):
├── Wave 5 (After Wave 4):
│   ├── TODO 14: Plugin ecosystem infrastructure
│   ├── TODO 15: create-noxion CLI enhancements
│   ├── TODO 16: Documentation updates
│   └── TODO 17: Community plugin example
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 (Types) | None | 3, 4, 5, 6, 10, 11 | 2 |
| 2 (Plugin types) | None | 4, 14 | 1 |
| 3 (Fetcher) | 1 | 10, 12 | 4, 5 |
| 4 (Plugin executor) | 1, 2 | 14, 17 | 3, 5 |
| 5 (Config) | 1 | 3, 12, 15 | 3, 4 |
| 6 (Renderer templates) | 1 | 8, 9, 12 | 7 |
| 7 (Theme inheritance) | 1 | 8, 9 | 6 |
| 8 (Docs templates) | 6, 7 | 12 | 9 |
| 9 (Portfolio templates) | 6, 7 | 12 | 8 |
| 10 (Adapter routing) | 1, 3 | 12 | 11 |
| 11 (Adapter SEO) | 1, 3 | 12 | 10 |
| 12 (Demo app) | 3, 5, 6, 8, 9, 10, 11 | None | 13 |
| 13 (Backward compat) | 1, 3 | 15 | 12 |
| 14 (Plugin infra) | 2, 4 | 17 | 15, 16 |
| 15 (CLI) | 5, 13 | None | 14, 16 |
| 16 (Docs) | ALL previous | None | 14, 15 |
| 17 (Example plugin) | 4, 14 | None | 15, 16 |

### Agent Dispatch Summary

| Wave | Tasks | Recommended Dispatch |
|------|-------|---------------------|
| 1 | 1, 2 | 2 parallel agents: types redesign + plugin type extensions |
| 2 | 3, 4, 5 | 3 parallel agents after wave 1 |
| 3 | 6, 7, 8, 9 | 4 parallel agents (6+7 first, then 8+9) |
| 4 | 10, 11, 12, 13 | 4 parallel agents |
| 5 | 14, 15, 16, 17 | 4 parallel agents |

---

## TODOs

---

- [ ] 1. Core Types Redesign: NoxionPage + Collections

  **What to do**:
  - Create new `NoxionPage` interface that generalizes `BlogPost`
  - Add `pageType` discriminated union field
  - Add `metadata: Record<string, unknown>` for type-specific data
  - Add hierarchical fields: `parent`, `children`, `order`
  - Create typed sub-interfaces: `BlogPage`, `DocsPage`, `PortfolioPage`
  - Define `NoxionCollection` interface for multi-database config
  - Define `SchemaConventions` interface for automatic Notion DB property mapping
  - Define `PageTypeDefinition` interface for registering custom page types
  - Add `collections` field to `NoxionConfigInput` and `NoxionConfig`
  - Export `BlogPost` as a type alias to `BlogPage` for backward compatibility
  - Update `PaginatedResponse` to work with `NoxionPage`
  - Write tests for all new types and type guards

  **Must NOT do**:
  - Do NOT remove `BlogPost` type (keep as alias)
  - Do NOT change the existing `NoxionPlugin` interface yet (that's TODO 2)
  - Do NOT modify `fetcher.ts` yet (that's TODO 3)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Core type system redesign requires careful TypeScript architecture
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: No UI work in this task
    - `playwright`: No browser testing needed

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Tasks 3, 4, 5, 6, 10, 11
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `packages/core/src/types.ts` — Current BlogPost, NoxionConfig, NoxionConfigInput, NoxionThemeConfig, ComponentOverrides, PaginatedResponse definitions. This is the primary file to modify.
  - `packages/core/src/index.ts` — Current exports. All new types must be re-exported here.

  **API/Type References**:
  - `packages/core/src/plugin.ts:41-59` — NoxionPlugin interface references BlogPost. The new NoxionPage must be compatible with plugin hook signatures.
  - `packages/core/src/fetcher.ts:44-57` — BlogPost construction in extractPost(). The new type must support this construction pattern.

  **Test References**:
  - `packages/core/src/__tests__/config.test.ts` — Config test patterns. New collections config tests should follow this style.
  - `packages/core/src/__tests__/fetcher.test.ts` — Fetcher tests that create BlogPost objects. New tests should verify NoxionPage creation.

  **Documentation References**:
  - `CONTRIBUTING.md:219-228` — Code style guide. TypeScript strict, no `as any`.

  **Acceptance Criteria**:

  - [ ] `NoxionPage` interface exported from `@noxion/core`
  - [ ] `BlogPage`, `DocsPage`, `PortfolioPage` sub-interfaces exported
  - [ ] `BlogPost` exported as type alias of `BlogPage` (backward compat)
  - [ ] `NoxionCollection` interface with `databaseId`, `pageType`, optional `schema` override
  - [ ] `PageTypeDefinition` interface with `name`, `schemaConventions`, `defaultTemplate`, `defaultLayout`
  - [ ] `NoxionConfig.collections` field (optional, for multi-DB)
  - [ ] Type guard functions: `isBlogPage()`, `isDocsPage()`, `isPortfolioPage()`

  ```bash
  # Agent runs:
  cd packages/core && bun test src/__tests__/config.test.ts
  # Assert: PASS

  cd packages/core && bun test
  # Assert: All tests pass (0 failures)

  cd packages/core && bun run build
  # Assert: Build succeeds with no TypeScript errors
  ```

  **Commit**: YES
  - Message: `feat(core): introduce NoxionPage generic data model with pageType system`
  - Files: `packages/core/src/types.ts`, `packages/core/src/index.ts`, `packages/core/src/__tests__/types.test.ts`
  - Pre-commit: `cd packages/core && bun test`

---

- [ ] 2. Plugin API Type Extensions

  **What to do**:
  - Add `registerPageTypes` hook to `NoxionPlugin` interface
  - Add `configSchema` field (optional Zod-like schema or validation function)
  - Add `onRouteResolve` hook for route middleware
  - Add `extendSlots` hook for UI slot extensions
  - Add `extendCLI` hook interface (for future CLI plugin commands)
  - Define `PageTypeDefinition` return type for `registerPageTypes`
  - Define `CLICommand` interface for `extendCLI`
  - Update `PluginActions` with `registerPageType()` action
  - Keep all existing hooks untouched (backward compatible extension)
  - Update `TRANSFORM_INPUT_KEYS` in plugin-executor.ts if needed
  - Write tests for new hook type signatures

  **Must NOT do**:
  - Do NOT implement the hook execution logic yet (that's TODO 4)
  - Do NOT add hooks without clear use cases (no `onAssetProcess` yet — defer)
  - Do NOT break existing plugin interfaces

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Type-level API design requiring deep TypeScript expertise
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Tasks 4, 14
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `packages/core/src/plugin.ts` — Current NoxionPlugin interface with all 12 hooks. Extend this interface with new optional hooks.
  - `packages/core/src/plugin-executor.ts` — How hooks are executed. New hooks will need entries in `TRANSFORM_INPUT_KEYS`.
  - `packages/core/src/plugin-loader.ts` — Plugin loading pattern. No changes needed but understand the factory pattern.

  **API/Type References**:
  - `packages/core/src/plugin.ts:33-37` — `PluginActions` interface. Add `registerPageType()` to this.
  - `packages/core/src/plugin.ts:41-59` — `NoxionPlugin` interface. This is the primary interface to extend.
  - `packages/renderer/src/theme/types.ts:129-137` — `NoxionSlotMap`. The `extendSlots` hook should return modifications to this type.

  **Test References**:
  - `packages/core/src/__tests__/plugin.test.ts` — Existing plugin tests. New hook tests should follow this pattern.
  - `packages/core/src/__tests__/plugins/analytics.test.ts` — Built-in plugin test pattern.

  **Acceptance Criteria**:

  - [ ] `NoxionPlugin.registerPageTypes` optional hook added
  - [ ] `NoxionPlugin.configSchema` optional field added
  - [ ] `NoxionPlugin.onRouteResolve` optional hook added
  - [ ] `NoxionPlugin.extendSlots` optional hook added
  - [ ] `NoxionPlugin.extendCLI` optional hook added
  - [ ] `PluginActions.registerPageType` method added
  - [ ] All existing plugin tests still pass

  ```bash
  cd packages/core && bun test src/__tests__/plugin.test.ts
  # Assert: PASS

  cd packages/core && bun test
  # Assert: All tests pass

  cd packages/core && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(core): extend plugin API with registerPageTypes, configSchema, extendSlots hooks`
  - Files: `packages/core/src/plugin.ts`, `packages/core/src/index.ts`, `packages/core/src/__tests__/plugin.test.ts`
  - Pre-commit: `cd packages/core && bun test`

---

- [ ] 3. Fetcher Refactoring: Multi-Collection & PageType Detection

  **What to do**:
  - Refactor `buildSchemaMap()` to be pageType-aware using `SchemaConventions`
  - Create `SchemaMapper` class/module that maps Notion DB properties to NoxionPage fields based on conventions
  - Support common conventions for each page type (blog: date/tags/category, docs: section/order/version, portfolio: technologies/projectUrl/year)
  - Add `fetchCollection()` function that fetches pages from a specific collection with its pageType
  - Add `fetchAllCollections()` that fetches from all configured collections
  - Update `fetchBlogPosts()` to delegate to the new system (backward compat)
  - Support single-DB mode: detect pageType from a "Type" property if present
  - Support multi-DB mode: each collection config has its pageType
  - Populate `NoxionPage.metadata` with type-specific fields
  - Populate `NoxionPage.parent`/`children`/`order` for docs pages
  - Update all existing fetcher functions to return `NoxionPage[]` (with BlogPost compat)
  - Write comprehensive tests for multi-collection fetching and schema mapping

  **Must NOT do**:
  - Do NOT remove any existing public API functions (fetchBlogPosts, fetchPage, etc.)
  - Do NOT change the Notion client itself (keep notion-client)
  - Do NOT implement caching (that's a future plugin concern)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Complex data transformation logic with backward compatibility requirements
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 4, 5)
  - **Blocks**: Tasks 10, 12
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `packages/core/src/fetcher.ts` — ENTIRE FILE is relevant. The `buildSchemaMap()` (lines 123-150), `extractPost()` (lines 152-200), `extractPostsFromRecordMap()` (lines 47-94), and `collectAllBlockIds()` (lines 101-109) all need refactoring.
  - `packages/core/src/frontmatter.ts` — Frontmatter parsing that applies to all page types. No changes needed but understand integration.

  **API/Type References**:
  - `packages/core/src/types.ts` — New NoxionPage type (from TODO 1). Fetcher must return this type.
  - `packages/core/src/client.ts` — NotionAPI client usage pattern. Fetcher uses `client.getPage()`.

  **Test References**:
  - `packages/core/src/__tests__/fetcher.test.ts` — Existing fetcher tests with mock RecordMap data. Extend with multi-collection scenarios.

  **External References**:
  - `notion-client` package: the `getPage()` method returns `ExtendedRecordMap` which contains collection data.

  **Acceptance Criteria**:

  - [ ] `SchemaMapper` module that maps Notion properties to NoxionPage fields per pageType
  - [ ] `fetchCollection(client, collectionConfig)` → `NoxionPage[]`
  - [ ] `fetchAllCollections(client, config)` → `NoxionPage[]` (all collections merged)
  - [ ] `fetchBlogPosts()` still works (calls new system internally, returns BlogPage[])
  - [ ] Single-DB mode: if "Type" property exists, auto-detect pageType
  - [ ] Multi-DB mode: each collection config specifies pageType
  - [ ] Docs pages: parent/children/order fields populated from Notion hierarchy
  - [ ] Convention-based property detection: "Tags" → tags, "Section" → section, etc.

  ```bash
  cd packages/core && bun test src/__tests__/fetcher.test.ts
  # Assert: PASS (existing + new tests)

  cd packages/core && bun test
  # Assert: All tests pass

  cd packages/core && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(core): refactor fetcher for multi-collection and pageType-aware schema mapping`
  - Files: `packages/core/src/fetcher.ts`, `packages/core/src/schema-mapper.ts` (new), `packages/core/src/__tests__/fetcher.test.ts`, `packages/core/src/__tests__/schema-mapper.test.ts` (new)
  - Pre-commit: `cd packages/core && bun test`

---

- [ ] 4. Plugin Loader & Executor: New Hook Execution

  **What to do**:
  - Implement execution logic for `registerPageTypes` hook in plugin-executor
  - Implement `configSchema` validation during plugin loading
  - Implement `onRouteResolve` hook execution (route middleware pipeline)
  - Implement `extendSlots` hook execution (slot composition pipeline)
  - Add `registerPageType` to PluginActions implementation
  - Create a `PageTypeRegistry` that collects page type definitions from plugins
  - Ensure new hooks follow the same error-handling pattern (warn, don't crash)
  - Maintain backward compatibility — existing plugins with no new hooks work unchanged
  - Write tests for each new hook execution path

  **Must NOT do**:
  - Do NOT change existing hook execution behavior
  - Do NOT add hook execution for `extendCLI` yet (CLI integration is TODO 15)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Plugin system internals requiring careful error handling and backward compat
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 5)
  - **Blocks**: Tasks 14, 17
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `packages/core/src/plugin-executor.ts` — Current `executeHook()` and `executeTransformHook()` patterns. New hooks follow same patterns.
  - `packages/core/src/plugin-loader.ts` — Current `loadPlugins()`. Add config validation step here.

  **API/Type References**:
  - `packages/core/src/plugin.ts` — Updated NoxionPlugin interface (from TODO 2) with new hooks.

  **Test References**:
  - `packages/core/src/__tests__/plugin.test.ts` — Plugin loading and execution tests. Add tests for each new hook.
  - `packages/core/src/__tests__/plugins/analytics.test.ts` — Pattern for testing individual plugin behavior.

  **Acceptance Criteria**:

  - [ ] `registerPageTypes` hook collected during plugin loading → `PageTypeRegistry`
  - [ ] `configSchema` validated during `loadPlugins()` — invalid config warns but doesn't crash
  - [ ] `onRouteResolve` executed as middleware chain (each plugin can modify or null-out a route)
  - [ ] `extendSlots` executed as composition chain (each plugin can add/modify slots)
  - [ ] Existing plugins (analytics, RSS, comments) still load and execute correctly

  ```bash
  cd packages/core && bun test src/__tests__/plugin.test.ts
  # Assert: PASS (all existing + new tests)

  cd packages/core && bun test
  # Assert: All tests pass

  cd packages/core && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(core): implement execution for registerPageTypes, configSchema, onRouteResolve, extendSlots hooks`
  - Files: `packages/core/src/plugin-executor.ts`, `packages/core/src/plugin-loader.ts`, `packages/core/src/page-type-registry.ts` (new), related tests
  - Pre-commit: `cd packages/core && bun test`

---

- [ ] 5. Config System Evolution: Collections & Validation

  **What to do**:
  - Add `collections` support to `NoxionConfigInput` and `NoxionConfig`
  - Make `rootNotionPageId` optional when `collections` is provided (but at least one must be present)
  - Add config validation logic: ensure at least rootNotionPageId OR collections is present
  - Support both single-root mode (current) and multi-collection mode (new)
  - In single-root mode, auto-create a default "blog" collection from rootNotionPageId
  - Add `defaultPageType` config field (defaults to "blog")
  - Validate collection configs (each must have databaseId)
  - Write comprehensive config tests for all modes and edge cases

  **Must NOT do**:
  - Do NOT break single-root mode (existing configs must still work)
  - Do NOT add complex validation libraries (keep it simple)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Config changes are relatively straightforward, building on existing pattern
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: Tasks 3, 12, 15
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `packages/core/src/config.ts` — Current `defineConfig()` and `loadConfig()`. Extend validation logic.
  - `apps/web/noxion.config.ts` — Real-world config usage. New config must be backward compatible with this.

  **Test References**:
  - `packages/core/src/__tests__/config.test.ts` — Existing config tests. Add multi-collection scenarios.

  **Acceptance Criteria**:

  - [ ] `NoxionConfig.collections` field supported
  - [ ] Existing config with only `rootNotionPageId` still works
  - [ ] New config with `collections` (without rootNotionPageId) works
  - [ ] Config validation: must have at least rootNotionPageId or collections
  - [ ] Single-root mode auto-creates default "blog" collection internally

  ```bash
  cd packages/core && bun test src/__tests__/config.test.ts
  # Assert: PASS

  cd packages/core && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(core): add collections config for multi-database support`
  - Files: `packages/core/src/config.ts`, `packages/core/src/types.ts`, `packages/core/src/__tests__/config.test.ts`
  - Pre-commit: `cd packages/core && bun test`

---

- [ ] 6. Renderer Template Map Expansion

  **What to do**:
  - Expand `NoxionTemplateMap` to support namespaced templates: `blog/post`, `docs/page`, `portfolio/project`, etc.
  - Keep backward compatibility: `home`, `post`, `archive`, `tag` still work (map to `blog/*`)
  - Add `NoxionTemplateMap` entries for docs: `docs/page`, `docs/sidebar`
  - Add entries for portfolio: `portfolio/grid`, `portfolio/project`
  - Update `resolveTemplate()` to handle namespaced template names
  - Update `NoxionThemePackage` interface to include `supports: string[]` (supported page types)
  - Add template fallback logic: if `docs/page` not in theme, fall back to generic `page` template
  - Write tests for template resolution with namespaced names and fallbacks

  **Must NOT do**:
  - Do NOT implement the actual Docs/Portfolio template components (that's TODOs 8-9)
  - Do NOT break existing template resolution

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Template map is type-level + resolver logic, moderate complexity
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 7)
  - **Blocks**: Tasks 8, 9, 12
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `packages/renderer/src/theme/template-resolver.ts` — Current template resolution logic. Extend for namespacing.
  - `packages/renderer/src/theme/types.ts:146-152` — Current `NoxionTemplateMap` definition.
  - `packages/renderer/src/theme/types.ts:160-167` — `NoxionThemePackage` definition. Add `supports` field.

  **Test References**:
  - `packages/renderer/src/__tests__/template-resolver.test.ts` — Template resolver tests. Add namespaced resolution tests.

  **Acceptance Criteria**:

  - [ ] `NoxionTemplateMap` supports namespaced keys (`blog/post`, `docs/page`, `portfolio/grid`)
  - [ ] Backward compat: `post` resolves to `blog/post` template
  - [ ] `NoxionThemePackage.supports` field added (string array)
  - [ ] Fallback: `docs/page` → `page` → default if not found
  - [ ] `resolveTemplate()` handles all cases correctly

  ```bash
  cd packages/renderer && bun test src/__tests__/template-resolver.test.ts
  # Assert: PASS

  cd packages/renderer && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(renderer): expand template map with namespaced page type support`
  - Files: `packages/renderer/src/theme/types.ts`, `packages/renderer/src/theme/template-resolver.ts`, `packages/renderer/src/__tests__/template-resolver.test.ts`
  - Pre-commit: `cd packages/renderer && bun test`

---

- [ ] 7. Theme Inheritance System

  **What to do**:
  - Create `extendTheme()` utility function that deep-merges theme packages
  - Support partial overrides: only specify what you want to change
  - Token inheritance: child theme tokens merge over parent tokens
  - Component inheritance: child components override parent, unspecified components fall through
  - Template inheritance: child templates override parent per template name
  - Layout inheritance: same as templates
  - Stylesheet composition: both parent and child stylesheets loaded
  - Add theme metadata: `description`, `author`, `version`, `preview` fields
  - Write tests for deep merge behavior and edge cases

  **Must NOT do**:
  - Do NOT create actual child themes (just the mechanism)
  - Do NOT implement runtime theme switching (CSS variables already handle this)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Utility function + deep merge logic, moderate complexity
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Task 6)
  - **Blocks**: Tasks 8, 9
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `packages/renderer/src/theme/define-theme.ts` — Current `defineTheme()`. Model `extendTheme()` similarly.
  - `packages/renderer/src/theme/component-resolver.ts` — Component merging logic. Theme inheritance should follow same pattern.
  - `packages/renderer/src/theme/ThemeProvider.tsx:60-76` — How theme packages are resolved. extendTheme output must be compatible.

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts:160-167` — `NoxionThemePackage`. This is the input/output type of `extendTheme()`.
  - `packages/theme-default/src/index.ts` — Default theme structure. Community themes will extend this.

  **Test References**:
  - `packages/renderer/src/__tests__/theme.test.ts` — Theme test patterns.

  **Acceptance Criteria**:

  - [ ] `extendTheme(parent, overrides)` function exported from `@noxion/renderer`
  - [ ] Token deep merge works (child overrides specific colors, rest inherited)
  - [ ] Component override works (child replaces Header, rest from parent)
  - [ ] Template override works (child adds `docs/page`, rest from parent)
  - [ ] Theme metadata fields added to `NoxionThemePackage`

  ```bash
  cd packages/renderer && bun test src/__tests__/theme.test.ts
  # Assert: PASS

  cd packages/renderer && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(renderer): add extendTheme() for theme inheritance and metadata fields`
  - Files: `packages/renderer/src/theme/extend-theme.ts` (new), `packages/renderer/src/theme/types.ts`, `packages/renderer/src/index.ts`, related tests
  - Pre-commit: `cd packages/renderer && bun test`

---

- [ ] 8. theme-default: Docs Templates & Components

  **What to do**:
  - Create `DocsLayout` component: sidebar navigation + content area
  - Create `DocsSidebar` component: hierarchical page navigation from page tree
  - Create `DocsPage` template: docs-specific page with prev/next navigation
  - Create `DocsBreadcrumb` component: breadcrumb trail from page hierarchy
  - Add docs-specific CSS styles to theme stylesheet
  - Register docs templates in theme-default's `NoxionThemePackage`
  - Add `docs` to `supports` array
  - Write tests for docs components

  **Must NOT do**:
  - Do NOT implement version switching (future enhancement)
  - Do NOT add full-text search (that's a plugin concern)
  - Do NOT add edit-on-Notion links (future enhancement)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Creating UI components with layouts and styling
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Docs layout requires thoughtful navigation UX design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3b (with Task 9, after Tasks 6+7)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 6, 7

  **References**:

  **Pattern References**:
  - `packages/theme-default/src/layouts/BlogLayout.tsx` — Existing layout component pattern. DocsLayout follows same structure.
  - `packages/theme-default/src/templates/PostPage.tsx` — Template component pattern. DocsPage follows this.
  - `packages/renderer/src/components/TOC.tsx` — Table of contents component. DocsSidebar may reuse patterns.
  - `packages/theme-default/src/index.ts` — How theme package is composed. Add docs entries here.

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts:154-158` — `NoxionLayoutProps` that DocsLayout must implement.
  - `packages/renderer/src/theme/types.ts:139-144` — `NoxionTemplateProps` that DocsPage template must implement.

  **External References**:
  - Docusaurus docs layout: sidebar + content pattern for reference
  - Nextra docs layout: another good reference for Notion-based docs

  **Acceptance Criteria**:

  - [ ] `DocsLayout` renders sidebar + content area
  - [ ] `DocsSidebar` renders hierarchical navigation from page tree data
  - [ ] `DocsPage` template renders page content with prev/next navigation
  - [ ] `DocsBreadcrumb` renders breadcrumb from page hierarchy
  - [ ] Docs styles integrated into theme stylesheet
  - [ ] theme-default exports include all docs components
  - [ ] `supports` array includes `'docs'`

  ```bash
  cd packages/theme-default && bun run build
  # Assert: Build succeeds with no TypeScript errors

  cd packages/renderer && bun run build
  # Assert: No breaking changes in renderer
  ```

  **Commit**: YES
  - Message: `feat(theme-default): add Docs page type with sidebar layout and navigation`
  - Files: `packages/theme-default/src/layouts/DocsLayout.tsx` (new), `packages/theme-default/src/templates/DocsPage.tsx` (new), `packages/theme-default/src/components/DocsSidebar.tsx` (new), `packages/theme-default/src/components/DocsBreadcrumb.tsx` (new), `packages/theme-default/styles/docs.css` (new), `packages/theme-default/src/index.ts`
  - Pre-commit: `cd packages/theme-default && bun run build`

---

- [ ] 9. theme-default: Portfolio Templates & Components

  **What to do**:
  - Create `PortfolioGrid` template: masonry/grid layout for project cards
  - Create `PortfolioProjectCard` component: project card with image, title, technologies, links
  - Create `PortfolioProject` template: individual project detail page
  - Create `PortfolioFilter` component: filter by technology/year
  - Add portfolio-specific CSS styles to theme stylesheet
  - Register portfolio templates in theme-default's `NoxionThemePackage`
  - Add `portfolio` to `supports` array
  - Write tests for portfolio components

  **Must NOT do**:
  - Do NOT implement lightbox/gallery features (plugin concern)
  - Do NOT add contact forms (plugin concern)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Grid layout and card design require visual engineering
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Portfolio grid UX with filtering

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3b (with Task 8, after Tasks 6+7)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 6, 7

  **References**:

  **Pattern References**:
  - `packages/theme-default/src/templates/HomePage.tsx` — Grid/list template pattern. PortfolioGrid follows this.
  - `packages/renderer/src/components/PostCard.tsx` — Card component pattern. PortfolioProjectCard follows this.
  - `packages/renderer/src/components/TagFilter.tsx` — Filter component pattern. PortfolioFilter follows this.

  **API/Type References**:
  - `packages/renderer/src/theme/types.ts:78-88` — `PostCardProps` pattern. Create `PortfolioCardProps` similarly.

  **Acceptance Criteria**:

  - [ ] `PortfolioGrid` renders responsive project grid
  - [ ] `PortfolioProjectCard` renders project card with image, title, tech stack, links
  - [ ] `PortfolioProject` template renders full project detail page
  - [ ] `PortfolioFilter` filters projects by technology
  - [ ] Portfolio styles in theme stylesheet
  - [ ] theme-default `supports` includes `'portfolio'`

  ```bash
  cd packages/theme-default && bun run build
  # Assert: Build succeeds

  cd packages/renderer && bun run build
  # Assert: No breaking changes
  ```

  **Commit**: YES
  - Message: `feat(theme-default): add Portfolio page type with grid layout and filtering`
  - Files: `packages/theme-default/src/templates/PortfolioGrid.tsx` (new), `packages/theme-default/src/templates/PortfolioProject.tsx` (new), `packages/theme-default/src/components/PortfolioProjectCard.tsx` (new), `packages/theme-default/src/components/PortfolioFilter.tsx` (new), `packages/theme-default/styles/portfolio.css` (new), `packages/theme-default/src/index.ts`
  - Pre-commit: `cd packages/theme-default && bun run build`

---

- [ ] 10. adapter-nextjs: Multi-Page-Type Routing

  **What to do**:
  - Update `generateNoxionStaticParams` to generate params for all page types
  - Create routing helpers that map pageType → URL pattern:
    - Blog: `/{slug}` (current)
    - Docs: `/docs/{section}/{slug}` or `/docs/{slug}`
    - Portfolio: `/projects/{slug}` or `/portfolio/{slug}`
  - Add `generateNoxionRoutes()` function that produces Next.js route configs for all page types
  - Add `resolvePageType()` utility: given a URL path, determine which pageType it belongs to
  - Support configurable URL patterns per collection
  - Keep existing `generateNoxionStaticParams` backward compatible
  - Write tests for route generation and resolution

  **Must NOT do**:
  - Do NOT implement catch-all route patterns (keep explicit routes)
  - Do NOT add middleware (Next.js middleware is out of scope for now)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Routing logic is moderate complexity, well-defined patterns
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 11, 12, 13)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `packages/adapter-nextjs/src/static-params.ts` — Current static params generation. Extend for multi-type.
  - `apps/web/app/[slug]/page.tsx:25-32` — How static params are used in the demo app.

  **API/Type References**:
  - `packages/adapter-nextjs/src/index.ts` — Current exports. Add new route helpers.

  **Test References**:
  - `packages/adapter-nextjs/src/__tests__/metadata.test.ts` — Test pattern for adapter functions.

  **Acceptance Criteria**:

  - [ ] `generateNoxionStaticParams` generates params for all page types
  - [ ] `generateNoxionRoutes()` produces route configs per page type
  - [ ] `resolvePageType(path)` determines page type from URL
  - [ ] Blog URLs unchanged (`/{slug}`)
  - [ ] Docs URLs: `/docs/{slug}` (configurable)
  - [ ] Portfolio URLs: `/projects/{slug}` (configurable)
  - [ ] Existing static params generation still works for blog-only sites

  ```bash
  cd packages/adapter-nextjs && bun test
  # Assert: All tests pass

  cd packages/adapter-nextjs && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(adapter-nextjs): add multi-page-type routing and URL resolution`
  - Files: `packages/adapter-nextjs/src/static-params.ts`, `packages/adapter-nextjs/src/routes.ts` (new), `packages/adapter-nextjs/src/index.ts`, related tests
  - Pre-commit: `cd packages/adapter-nextjs && bun test`

---

- [ ] 11. adapter-nextjs: Metadata & SEO for All Page Types

  **What to do**:
  - Update `generateNoxionMetadata` to handle NoxionPage (not just BlogPost)
  - Add page-type-specific JSON-LD schemas:
    - Docs: `TechArticle` or `HowTo` schema
    - Portfolio: `CreativeWork` schema
  - Update sitemap generation to include all page type URLs with correct changefreq/priority
  - Add page-type-specific OG tags (e.g., docs don't need article:published_time)
  - Keep backward compat: BlogPost still produces identical metadata as before
  - Write tests for metadata generation per page type

  **Must NOT do**:
  - Do NOT change the existing blog SEO behavior

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
    - Reason: Metadata patterns are well-defined, extending existing patterns
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 10, 12, 13)
  - **Blocks**: Task 12
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `packages/adapter-nextjs/src/metadata.ts` — Current metadata generation for blog posts. Extend with page type branching.
  - `packages/adapter-nextjs/src/structured-data.ts` — JSON-LD generation. Add TechArticle, CreativeWork schemas.
  - `packages/adapter-nextjs/src/sitemap.ts` — Sitemap generation. Include all page types.

  **Test References**:
  - `packages/adapter-nextjs/src/__tests__/metadata.test.ts` — Metadata tests. Add per-page-type tests.

  **External References**:
  - Schema.org TechArticle: https://schema.org/TechArticle
  - Schema.org CreativeWork: https://schema.org/CreativeWork

  **Acceptance Criteria**:

  - [ ] `generateNoxionMetadata(page, config)` works for NoxionPage of any type
  - [ ] Blog pages produce identical metadata as before (regression test)
  - [ ] Docs pages produce TechArticle JSON-LD
  - [ ] Portfolio pages produce CreativeWork JSON-LD
  - [ ] Sitemap includes all page types with appropriate priorities

  ```bash
  cd packages/adapter-nextjs && bun test
  # Assert: All tests pass

  cd packages/adapter-nextjs && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat(adapter-nextjs): add metadata and JSON-LD for docs and portfolio page types`
  - Files: `packages/adapter-nextjs/src/metadata.ts`, `packages/adapter-nextjs/src/structured-data.ts`, `packages/adapter-nextjs/src/sitemap.ts`, related tests
  - Pre-commit: `cd packages/adapter-nextjs && bun test`

---

- [ ] 12. Demo App Update: Showcase All Page Types

  **What to do**:
  - Update `apps/web` to demonstrate Blog + Docs + Portfolio
  - Add docs section: `/docs/*` routes with sidebar navigation
  - Add portfolio section: `/projects/*` routes with grid and detail pages
  - Update home page to show all content types
  - Update navigation to include Docs and Portfolio links
  - Update `noxion.config.ts` with collections config (if multiple DBs used)
  - Or add sample Notion pages with Type property for single-DB demo
  - Update `.env.example` with any new environment variables
  - Verify all SEO features work for all page types

  **Must NOT do**:
  - Do NOT over-customize the demo (keep it as a reference implementation)
  - Do NOT add authentication or complex features

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Full app integration with multiple page types and layouts
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Cohesive multi-section site design

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 10, 11, 13) — but depends on many tasks
  - **Blocks**: None (final integration)
  - **Blocked By**: Tasks 3, 5, 6, 8, 9, 10, 11

  **References**:

  **Pattern References**:
  - `apps/web/app/page.tsx` — Current home page. Update to show all content types.
  - `apps/web/app/[slug]/page.tsx` — Current post page. Add similar pages for docs/portfolio.
  - `apps/web/noxion.config.ts` — Config to update with collections.
  - `apps/web/app/layout.tsx` — Root layout, update navigation.

  **Acceptance Criteria**:

  - [ ] Blog section works as before at `/{slug}`
  - [ ] Docs section at `/docs/{slug}` with sidebar navigation
  - [ ] Portfolio section at `/projects/{slug}` with grid view
  - [ ] Home page shows all content types
  - [ ] Navigation includes Blog, Docs, Projects links
  - [ ] `bun run dev` starts without errors
  - [ ] All SEO signals present for all page types

  ```bash
  cd apps/web && bun run build
  # Assert: Build succeeds with no errors

  cd apps/web && bun run dev &
  # Assert: Dev server starts on port 3000
  # Navigate to localhost:3000 — home page loads
  # Navigate to localhost:3000/docs — docs page loads
  # Navigate to localhost:3000/projects — portfolio grid loads
  ```

  **Commit**: YES
  - Message: `feat(web): update demo app to showcase Blog, Docs, and Portfolio page types`
  - Files: `apps/web/app/*` (multiple files), `apps/web/noxion.config.ts`, `apps/web/.env.example`
  - Pre-commit: `cd apps/web && bun run build`

---

- [ ] 13. Backward Compatibility Layer & Migration Guide

  **What to do**:
  - Ensure `BlogPost` type alias works throughout the stack
  - Add deprecation notices (console.warn) for old API patterns
  - Create `@noxion/core/compat` export that provides old function signatures mapped to new ones
  - Verify all existing tests pass without modifications to test code
  - Write a migration guide document: `docs/migration/v0.2.md`
  - List all breaking changes with before/after code examples
  - Provide codemod script if feasible (optional)

  **Must NOT do**:
  - Do NOT keep deprecated code permanently (plan for removal in v0.3)
  - Do NOT create complex shim layers

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Primarily documentation and migration guide writing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 4 (with Tasks 10, 11, 12)
  - **Blocks**: Task 15
  - **Blocked By**: Tasks 1, 3

  **References**:

  **Pattern References**:
  - `packages/core/src/index.ts` — All current exports. Each must remain working.
  - `packages/core/src/types.ts` — Where BlogPost alias lives.

  **Documentation References**:
  - `apps/docs/docs/learn/` — Existing docs structure for migration guide placement.

  **Acceptance Criteria**:

  - [ ] All existing tests pass without test code modifications
  - [ ] `BlogPost` type resolves correctly
  - [ ] `fetchBlogPosts()` works identically to before
  - [ ] Deprecation warnings appear for old patterns
  - [ ] Migration guide: `apps/docs/docs/learn/migration-v02.md` created
  - [ ] Migration guide covers all breaking changes with code examples

  ```bash
  bun run test
  # Assert: ALL tests across ALL packages pass (0 failures)

  bun run build
  # Assert: ALL packages build successfully
  ```

  **Commit**: YES
  - Message: `feat(core): add backward compatibility layer and v0.2 migration guide`
  - Files: `packages/core/src/compat.ts` (new), `apps/docs/docs/learn/migration-v02.md` (new)
  - Pre-commit: `bun run test`

---

- [ ] 14. Plugin Ecosystem Infrastructure

  **What to do**:
  - Create `@noxion/plugin-utils` package (new) with:
    - Mock Notion RecordMap data generators for testing
    - `createTestConfig()` helper for plugin test setup
    - `createTestPlugin()` helper for creating minimal test plugins
    - Type helpers for plugin development
  - Define `noxion-plugin-*` naming convention in documentation
  - Create plugin starter template in `create-noxion` (TODO 15 will wire it up)
  - Add `noxion-plugin.json` manifest schema definition
  - Write "Creating a Plugin" guide for documentation
  - Create an example community-style plugin skeleton (not functional, just structure)

  **Must NOT do**:
  - Do NOT build a plugin registry website
  - Do NOT implement automatic plugin discovery from npm
  - Do NOT create more than 1 example plugin

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: New package creation + ecosystem design decisions
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 15, 16, 17)
  - **Blocks**: Task 17
  - **Blocked By**: Tasks 2, 4

  **References**:

  **Pattern References**:
  - `packages/core/src/plugins/analytics.ts` — Built-in plugin pattern. Community plugins follow this.
  - `packages/core/src/__tests__/plugins/analytics.test.ts` — Plugin test pattern. Test utils should make this easier.
  - `packages/core/package.json` — Package structure to follow for @noxion/plugin-utils.

  **Documentation References**:
  - `CONTRIBUTING.md:256-296` — Existing "Writing a Plugin" section. Expand this significantly.

  **Acceptance Criteria**:

  - [ ] `@noxion/plugin-utils` package created with mock data generators
  - [ ] `createTestConfig()` and `createTestPlugin()` helpers working
  - [ ] Plugin naming convention documented
  - [ ] Plugin manifest schema (`noxion-plugin.json`) defined
  - [ ] "Creating a Plugin" guide written
  - [ ] Plugin starter template files created (for create-noxion)

  ```bash
  cd packages/plugin-utils && bun test
  # Assert: All utility tests pass

  cd packages/plugin-utils && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat: add @noxion/plugin-utils package and plugin ecosystem infrastructure`
  - Files: `packages/plugin-utils/` (new package), docs files
  - Pre-commit: `bun run test`

---

- [ ] 15. create-noxion CLI Enhancements

  **What to do**:
  - Add template selection to CLI: blog (default), docs, portfolio, full (all three)
  - Add `--plugin` flag to scaffold a new plugin project
  - Add `--theme` flag to scaffold a new theme project
  - Update scaffolded project templates:
    - Blog template: current behavior (updated for NoxionPage)
    - Docs template: docs-focused site with sidebar
    - Portfolio template: portfolio site with project grid
    - Full template: all three page types
  - Add interactive prompts for Notion DB setup per page type
  - Update `.env.example` in templates for collection configs
  - Write tests for scaffold variations

  **Must NOT do**:
  - Do NOT implement `noxion add` command (future CLI package)
  - Do NOT implement `noxion validate` command (future CLI package)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: CLI with multiple template variations and interactive prompts
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 14, 16, 17)
  - **Blocks**: None
  - **Blocked By**: Tasks 5, 13

  **References**:

  **Pattern References**:
  - `packages/create-noxion/src/scaffold.ts` — Current scaffolding logic. Extend with template selection.
  - `packages/create-noxion/src/index.ts` — CLI entry point with @clack/prompts.
  - `packages/create-noxion/src/templates/` — Template files to expand.

  **Test References**:
  - `packages/create-noxion/src/__tests__/scaffold.test.ts` — Scaffold tests. Add template variation tests.

  **Acceptance Criteria**:

  - [ ] `bun create noxion my-blog` → blog template (default, backward compat)
  - [ ] `bun create noxion my-docs --template docs` → docs template
  - [ ] `bun create noxion my-portfolio --template portfolio` → portfolio template
  - [ ] `bun create noxion my-site --template full` → all page types
  - [ ] `bun create noxion my-plugin --plugin` → plugin scaffold
  - [ ] `bun create noxion my-theme --theme` → theme scaffold
  - [ ] Interactive prompts for Notion page IDs per collection

  ```bash
  cd packages/create-noxion && bun run build
  # Assert: Build succeeds

  # Manual verification: run create-noxion and verify template output
  ```

  **Commit**: YES
  - Message: `feat(create-noxion): add template selection (blog, docs, portfolio, full) and plugin/theme scaffolding`
  - Files: `packages/create-noxion/src/*`, `packages/create-noxion/src/templates/*` (multiple)
  - Pre-commit: `cd packages/create-noxion && bun run build`

---

- [ ] 16. Documentation Updates

  **What to do**:
  - Update all learn guides for NoxionPage model:
    - `docs/learn/introduction.md` — Update project description
    - `docs/learn/quick-start.md` — Multi-template quick starts
    - `docs/learn/configuration.md` — Collections config
    - `docs/learn/notion-setup.md` — Per-page-type DB setup guides
    - `docs/learn/themes.md` — Theme inheritance, community themes
    - `docs/learn/plugins/` — Updated plugin authoring guide
  - Update API reference docs:
    - `docs/reference/core/` — NoxionPage, new config, enhanced plugin API
    - `docs/reference/renderer/` — Extended templates, extendTheme()
    - `docs/reference/adapter-nextjs/` — Multi-page-type routing, new SEO
  - Add new guides:
    - "Building a Docs Site with Noxion"
    - "Building a Portfolio with Noxion"
    - "Creating a Custom Theme"
    - "Creating a Plugin"
  - Update changelog

  **Must NOT do**:
  - Do NOT translate docs (i18n is out of scope)
  - Do NOT add video tutorials

  **Recommended Agent Profile**:
  - **Category**: `writing`
    - Reason: Technical documentation writing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 14, 15, 17)
  - **Blocks**: None
  - **Blocked By**: ALL previous tasks (docs describe final state)

  **References**:

  **Documentation References**:
  - `apps/docs/docs/learn/` — All existing learn guides. Update each.
  - `apps/docs/docs/reference/` — All API reference docs. Update each.
  - `apps/docs/sidebars.ts` — Sidebar config. Add new pages.
  - `apps/docs/docusaurus.config.ts` — Docusaurus config if navigation changes needed.

  **Acceptance Criteria**:

  - [ ] All learn guides updated for v0.2 APIs
  - [ ] API reference reflects all new types and functions
  - [ ] "Building a Docs Site" guide exists and is accurate
  - [ ] "Building a Portfolio" guide exists and is accurate
  - [ ] "Creating a Custom Theme" guide exists
  - [ ] "Creating a Plugin" guide exists (expanded from CONTRIBUTING.md)
  - [ ] Changelog updated with all v0.2 changes

  ```bash
  cd apps/docs && bun run build
  # Assert: Docs build succeeds with no broken links
  ```

  **Commit**: YES
  - Message: `docs: comprehensive v0.2 documentation update for Website Builder features`
  - Files: `apps/docs/docs/**/*.md` (multiple)
  - Pre-commit: `cd apps/docs && bun run build`

---

- [ ] 17. Community Plugin Example: noxion-plugin-reading-time

  **What to do**:
  - Create a working example plugin that demonstrates the new plugin API
  - `noxion-plugin-reading-time`: calculates and displays reading time for posts
  - Uses `transformPosts` hook to add reading time to metadata
  - Uses `extendSlots` hook to inject reading time display component
  - Uses `configSchema` for options validation
  - Include full test suite using `@noxion/plugin-utils`
  - Include README with usage instructions
  - Serve as the reference implementation for community plugin authors

  **Must NOT do**:
  - Do NOT publish to npm (it's an example in the monorepo)
  - Do NOT over-engineer (keep it simple and educational)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small, focused plugin implementation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 5 (with Tasks 14, 15, 16)
  - **Blocks**: None
  - **Blocked By**: Tasks 4, 14

  **References**:

  **Pattern References**:
  - `packages/core/src/plugins/analytics.ts` — Built-in plugin pattern
  - `packages/core/src/plugins/rss.ts` — Plugin with content transformation
  - `packages/core/src/__tests__/plugins/rss.test.ts` — Plugin test pattern

  **External References**:
  - Reading time calculation: ~200 words per minute average

  **Acceptance Criteria**:

  - [ ] Plugin calculates reading time from page content
  - [ ] Plugin uses `transformPosts` to add `readingTime` to page metadata
  - [ ] Plugin uses `extendSlots` to inject reading time display
  - [ ] Plugin uses `configSchema` for options (wordsPerMinute, showIcon)
  - [ ] Full test suite passes using `@noxion/plugin-utils`
  - [ ] README serves as plugin authoring tutorial

  ```bash
  cd packages/plugin-reading-time && bun test
  # Assert: All tests pass

  cd packages/plugin-reading-time && bun run build
  # Assert: Build succeeds
  ```

  **Commit**: YES
  - Message: `feat: add noxion-plugin-reading-time as community plugin example`
  - Files: `packages/plugin-reading-time/` (new example package)
  - Pre-commit: `cd packages/plugin-reading-time && bun test`

---

## Commit Strategy

| After Task(s) | Message | Verification |
|------------|---------|--------------|
| 1 | `feat(core): introduce NoxionPage generic data model with pageType system` | `bun test` in core |
| 2 | `feat(core): extend plugin API with registerPageTypes, configSchema, extendSlots hooks` | `bun test` in core |
| 3 | `feat(core): refactor fetcher for multi-collection and pageType-aware schema mapping` | `bun test` in core |
| 4 | `feat(core): implement execution for new plugin hooks` | `bun test` in core |
| 5 | `feat(core): add collections config for multi-database support` | `bun test` in core |
| 6 | `feat(renderer): expand template map with namespaced page type support` | `bun test` in renderer |
| 7 | `feat(renderer): add extendTheme() for theme inheritance and metadata fields` | `bun test` in renderer |
| 8 | `feat(theme-default): add Docs page type with sidebar layout and navigation` | `bun run build` in theme-default |
| 9 | `feat(theme-default): add Portfolio page type with grid layout and filtering` | `bun run build` in theme-default |
| 10 | `feat(adapter-nextjs): add multi-page-type routing and URL resolution` | `bun test` in adapter-nextjs |
| 11 | `feat(adapter-nextjs): add metadata and JSON-LD for docs and portfolio page types` | `bun test` in adapter-nextjs |
| 12 | `feat(web): update demo app to showcase Blog, Docs, and Portfolio page types` | `bun run build` in web |
| 13 | `feat(core): add backward compatibility layer and v0.2 migration guide` | `bun run test` (all) |
| 14 | `feat: add @noxion/plugin-utils package and plugin ecosystem infrastructure` | `bun test` in plugin-utils |
| 15 | `feat(create-noxion): add template selection and plugin/theme scaffolding` | `bun run build` in create-noxion |
| 16 | `docs: comprehensive v0.2 documentation update` | `bun run build` in docs |
| 17 | `feat: add noxion-plugin-reading-time as community plugin example` | `bun test` in plugin-reading-time |

---

## Success Criteria

### Verification Commands
```bash
# All tests pass
bun run test
# Expected: 0 failures across all packages

# All packages build
bun run build
# Expected: All packages build successfully

# Demo app starts
cd apps/web && bun run dev
# Expected: Server starts on port 3000

# Docs build
cd apps/docs && bun run build
# Expected: Build succeeds with no broken links
```

### Final Checklist
- [ ] All "Must Have" items present in the codebase
- [ ] All "Must NOT Have" items absent from the codebase
- [ ] All existing tests pass (backward compat verified)
- [ ] New tests cover all new features
- [ ] Demo app showcases Blog + Docs + Portfolio
- [ ] Documentation is up to date
- [ ] Plugin ecosystem infrastructure is in place
- [ ] At least one example plugin works end-to-end
