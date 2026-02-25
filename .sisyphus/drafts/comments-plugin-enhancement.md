# Draft: Comments Plugin Enhancement

## Current State Analysis

### What exists now
- **File**: `packages/core/src/plugins/comments.ts` (83 lines)
- **Providers**: Giscus, Utterances, Disqus
- **Plugin hooks used**: `injectHead` only (script tag injection)
- **Tests**: Basic tests in `packages/core/src/__tests__/plugins/comments.test.ts` (bun:test)
- **Docs**: `apps/docs/docs/learn/plugins/comments.md`

### What's missing / underutilized
1. **No React component** — comments only inject `<script>` tags, no actual Comment UI component in renderer
2. **No slot integration** — plugin has `extendSlots` hook available but unused
3. **No per-post control** — docs mention `comments: false` frontmatter but it's not implemented in plugin
4. **No theme sync** — Giscus/Utterances themes don't dynamically follow Noxion's theme toggle
5. **No language/locale support** — `data-lang` attribute not configurable
6. **Missing config options** — docs mention `reactionsEnabled`, `label` but code doesn't support them
7. **No lazy loading** — scripts load immediately on every page
8. **No comment count widget** — no way to show comment counts on post cards/lists

### Available Plugin Hooks (unused by comments plugin)
- `extendSlots` — could inject a Comment component into layout slots
- `extendMetadata` — could add comment-related metadata
- `transformPosts` — could filter/modify posts based on comment settings
- `configSchema` — could add validation for comment config

### Tech Stack
- Monorepo: Turborepo + Bun
- Language: TypeScript
- Framework: Next.js 16 App Router
- Testing: bun:test
- Renderer: React with slot-based layout system

## Requirements (confirmed)
- (pending interview)

## Technical Decisions
- (pending interview)

## Open Questions
- What specific features does the user want to add?
- Should we add a React component to the renderer package?
- Priority of features?
- Scope boundaries?
