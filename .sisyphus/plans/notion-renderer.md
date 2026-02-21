# Custom Notion Renderer — Replace react-notion-x

## TL;DR

> **Quick Summary**: Build `@noxion/notion-renderer` — a custom Notion block renderer package that replaces `react-notion-x` with full styling control, KaTeX SSR for math, and Shiki for code highlighting. Then migrate `@noxion/renderer` and `apps/web` to use it.
> 
> **Deliverables**:
> - `packages/notion-renderer/` — new package with all Notion block renderers, rich text, KaTeX SSR, Shiki code highlighting
> - Updated `packages/renderer/` — uses `@noxion/notion-renderer` instead of `react-notion-x`
> - Updated `apps/web/` — removes react-notion-x CSS, transpilePackages, and overrides
> - Fully self-authored CSS with BEM naming (no `!important` overrides)
> 
> **Estimated Effort**: XL (large multi-package effort)
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 → Task 2 → Task 3 → Task 4 → Task 5 → Task 6 → Task 8 → Task 9 → Task 10

---

## Context

### Original Request
User wants to remove the `react-notion-x` dependency entirely because:
1. Math/equation rendering is broken (KaTeX not properly integrated)
2. Code syntax highlighting missing (empty component warnings)
3. Styling requires ~400 lines of `!important` CSS overrides in globals.css
4. No control over rendering behavior, layout, or styling

### Interview Summary
**Key Discussions**:
- Data layer (notion-client/types/utils): KEEP as-is — only replace rendering
- Block scope: All react-notion-x block types EXCEPT Collection View (extensible for future)
- Code: Shiki server-side highlighting (VS Code themes, zero client JS)
- Math: KaTeX server-side rendering (katex.renderToString())
- CSS: Self-authored BEM (noxion-* namespace) — no react-notion-x CSS import
- Architecture: `@noxion/notion-renderer` (pure block rendering) consumed by `@noxion/renderer` (theme/layout)

**Research Findings**:
- react-notion-x: 113 source files, 82 .tsx/.ts, 3385 lines CSS
- Key source files: `block.tsx` (router), `context.tsx`, `renderer.tsx`, `components/text.tsx` (rich text)
- Third-party components: code, equation, collection, modal, pdf
- Notion data types (ExtendedRecordMap, Block, Decoration[]) from `notion-types` package
- Current override points: `apps/web/app/globals.css` (457 lines), `apps/web/next.config.ts` (transpilePackages)
- `packages/core/src/fetcher.ts` uses `notion-client`, `notion-types`, `notion-utils` heavily — stays untouched
- `bun` is at `~/.bun/bin/bun`, NOT on PATH

### Self-Gap Analysis (Metis unavailable)
**Identified Gaps** (addressed in plan):
- Notion's Decoration[] rich text format is complex (bold, italic, links, colors, inline equations, mentions, dates) — dedicated task
- Shiki is async (needs await) — must handle in server component context or pre-render
- KaTeX CSS must be included for proper equation styling
- react-notion-x's context system provides mapPageUrl, mapImageUrl, components overrides — must replicate
- Synced blocks (transclusion_container/reference) need special handling
- Image handling: react-notion-x has lazy loading, preview images, Next.js Image integration
- Dark mode: react-notion-x uses CSS variables and dark class — new renderer must integrate with NoxionThemeProvider
- `create-noxion` template also references react-notion-x — needs update

---

## Work Objectives

### Core Objective
Replace `react-notion-x` with a custom `@noxion/notion-renderer` package that gives full control over Notion block rendering, styling, math equations, and code highlighting.

### Concrete Deliverables
- `packages/notion-renderer/` — complete package with block renderers, rich text, CSS
- `packages/notion-renderer/src/blocks/` — individual block components (~25 files)
- `packages/notion-renderer/src/components/` — shared components (text, image, asset)
- `packages/notion-renderer/src/styles/` — self-authored CSS for all blocks
- Updated `packages/renderer/src/components/NotionPage.tsx` — uses new renderer
- Cleaned `apps/web/app/globals.css` — no react-notion-x imports or overrides
- Updated `apps/web/next.config.ts` — remove react-notion-x from transpilePackages

### Definition of Done
- [ ] `react-notion-x` removed from all package.json files (renderer, apps/web, create-noxion template)
- [ ] `@import "react-notion-x/src/styles.css"` removed from globals.css
- [ ] All existing blog pages render correctly (home, post detail, tag pages)
- [ ] Math equations render via KaTeX SSR
- [ ] Code blocks have syntax highlighting via Shiki
- [ ] 0 `!important` overrides needed in apps/web for Notion content styling
- [ ] All existing tests pass + new tests for notion-renderer
- [ ] All packages type-check clean

### Must Have
- Correct rendering of all blog-relevant Notion block types
- KaTeX equation rendering (both inline and block)
- Shiki code syntax highlighting
- Rich text rendering (bold, italic, strikethrough, code, underline, links, colors, inline equations)
- Image rendering with Next.js Image support
- Dark/light mode CSS variable integration
- Component override system (users can replace any block renderer)
- BEM CSS naming consistent with existing theme system

### Must NOT Have (Guardrails)
- Collection View rendering (table/board/gallery/list/calendar database views) — placeholder only
- Changes to `notion-client`, `notion-types`, `notion-utils` packages
- Changes to `@noxion/core` data fetching logic
- Any `!important` in the new renderer's CSS
- Tailwind or CSS-in-JS — pure CSS only
- Client-side KaTeX loading (must be SSR)
- Client-side Shiki loading (must be SSR or build-time)

---

## Verification Strategy (MANDATORY)

### Test Decision
- **Infrastructure exists**: YES (bun test, 203 tests currently passing)
- **User wants tests**: TDD
- **Framework**: bun test
- **Command**: `~/.bun/bin/bun test`

### TDD Approach
Each task follows RED-GREEN-REFACTOR where applicable. Unit tests for:
- Block type routing (given block type X → renders component Y)
- Rich text decoration parsing (Decoration[] → correct JSX)
- Context provider configuration
- Equation rendering output
- Integration: full recordMap → rendered HTML structure

### Automated Verification
- `~/.bun/bin/bun test` — all tests pass
- `~/.bun/bin/bun tsc --noEmit` — type-check each package
- Playwright browser verification for visual rendering

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation):
├── Task 1: Package scaffolding + types + context
└── Task 7: Update create-noxion template references

Wave 2 (Core Rendering):
├── Task 2: Rich text renderer (Decoration[])
├── Task 3: Block router + text/heading/list/divider/quote/callout/toggle/todo blocks
└── Task 4: KaTeX equation renderer (SSR)

Wave 3 (Media & Code):
├── Task 5: Shiki code block renderer
├── Task 6: Image/video/audio/embed/bookmark/file/asset blocks
└── (Task 4 completion if not done)

Wave 4 (Integration & Migration):
├── Task 8: Table, column_list/column, synced blocks, remaining block types
├── Task 9: Self-authored CSS for all blocks
└── Task 10: Migrate @noxion/renderer + apps/web, remove react-notion-x
```

### Dependency Matrix

| Task | Depends On | Blocks | Can Parallelize With |
|------|------------|--------|---------------------|
| 1 | None | 2, 3, 4, 5, 6, 8 | 7 |
| 2 | 1 | 3, 6, 8 | 4, 5 |
| 3 | 1, 2 | 8, 10 | 4, 5, 6 |
| 4 | 1 | 10 | 2, 3, 5, 6 |
| 5 | 1 | 10 | 2, 3, 4, 6 |
| 6 | 1, 2 | 10 | 3, 4, 5 |
| 7 | None | None | 1, 2, 3, 4, 5, 6 |
| 8 | 1, 2, 3 | 10 | 9 |
| 9 | 3, 6, 8 | 10 | None (needs all blocks) |
| 10 | 3, 4, 5, 6, 8, 9 | None | None (final) |

---

## TODOs

- [ ] 1. Package scaffolding, types, and context provider

  **What to do**:
  - Create `packages/notion-renderer/` directory with package.json, tsconfig.json
  - Package name: `@noxion/notion-renderer`, version `0.0.1`
  - Dependencies: `notion-types` (peer), `notion-utils` (peer), `react` (peer)
  - Create core type definitions in `src/types.ts`:
    - `NotionRendererProps` — top-level renderer props (recordMap, rootPageId, mapPageUrl, mapImageUrl, components, darkMode, fullPage, previewImages, className, etc.)
    - `NotionBlockProps` — props passed to each block renderer (block, level, children, etc.)
    - `NotionComponents` — component override map (one key per block type + Text, PageIcon, PageLink, etc.)
    - `NotionRendererContext` — context value type
  - Create context provider in `src/context.tsx`:
    - `NotionRendererProvider` — React context providing recordMap, mapPageUrl, mapImageUrl, component overrides, darkMode, fullPage
    - `useNotionRenderer()` hook — access context
    - `useNotionBlock(blockId)` hook — get block from recordMap
  - Create `src/index.ts` with all exports
  - Create initial test file `src/__tests__/context.test.ts`

  **Must NOT do**:
  - Import from react-notion-x
  - Use `!important` in any CSS
  - Add Collection View types or components

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
    - No special skills needed — package scaffolding and TypeScript types

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 7)
  - **Blocks**: Tasks 2, 3, 4, 5, 6, 8
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `packages/theme-default/package.json` — package.json structure pattern for monorepo packages
  - `packages/theme-default/tsconfig.json` — tsconfig pattern for monorepo packages
  - `packages/renderer/src/theme/ThemeProvider.tsx` — React context provider pattern used in this project

  **API/Type References**:
  - `notion-types` package: `ExtendedRecordMap`, `Block`, `BlockType`, `Decoration`, `BlockMap`, `Collection` — these are the input data types
  - `packages/core/src/types.ts:1-4` — how ExtendedRecordMap is re-exported
  - react-notion-x `build/index.d.ts` at `/Users/jiwon/Workspace/jiwonme/noxion/node_modules/.bun/react-notion-x@7.8.2+5b17367855fab75a/node_modules/react-notion-x/build/index.d.ts` — NotionRenderer props interface (lines 54-89), NotionComponents type

  **External References**:
  - react-notion-x source `context.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/context.tsx` — original context implementation to reference and improve upon
  - react-notion-x source `renderer.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/renderer.tsx` — original renderer component

  **Acceptance Criteria**:
  - [ ] `packages/notion-renderer/package.json` exists with correct name, deps, exports
  - [ ] `packages/notion-renderer/tsconfig.json` extends root config
  - [ ] `~/.bun/bin/bun tsc --noEmit` in `packages/notion-renderer` — 0 errors
  - [ ] `~/.bun/bin/bun test` in root — context tests pass
  - [ ] `NotionRendererProvider` renders children and provides context
  - [ ] `useNotionRenderer()` returns context with recordMap, mapPageUrl, etc.

  **Commit**: YES
  - Message: `feat(notion-renderer): scaffold package with types and context provider`
  - Files: `packages/notion-renderer/**`
  - Pre-commit: `~/.bun/bin/bun test && ~/.bun/bin/bun tsc --noEmit` (in packages/notion-renderer)

---

- [ ] 2. Rich text renderer (Decoration[] → JSX)

  **What to do**:
  - Create `src/components/text.tsx` — the rich text renderer
  - Input: `Decoration[]` from notion-types (Notion's rich text format)
  - Handle all SubDecoration types:
    - `['b']` bold → `<strong>`
    - `['i']` italic → `<em>`
    - `['s']` strikethrough → `<s>`
    - `['c']` code → `<code>`
    - `['_']` underline → `<span style="text-decoration:underline">`
    - `['a', url]` link → `<a href={url}>`
    - `['h', color]` highlight/color → `<span>` with CSS class for Notion color
    - `['d', date]` date → formatted date string
    - `['u', userId]` user mention → user name from recordMap
    - `['e', expression]` inline equation → KaTeX SSR (delegate to equation component)
    - `['p', pageId]` page mention → link using mapPageUrl
    - `['‣', [pageId, ...]]` external link → formatted link
    - `['m', commentId]` discussion → skip/ignore
    - `['eoi', id]` external object instance → skip/ignore
    - `['lm', url]` link mention → rendered as link with preview card placeholder
    - `['si', sugId]` suggestion edit — skip/ignore
  - Handle nested decorations (a decoration segment can have multiple SubDecorations)
  - Create `src/components/page-icon.tsx` — renders page emoji/icon
  - Create `src/components/page-link.tsx` — renders links to other Notion pages
  - Test file: `src/__tests__/text.test.ts`

  **Must NOT do**:
  - Client-side equation rendering (inline equations use KaTeX SSR too)
  - Use className from react-notion-x (.notion-*)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Complex logic with many branches but no special domain

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5 after Task 1 completes)
  - **Parallel Group**: Wave 2
  - **Blocks**: Tasks 3, 6, 8
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `packages/renderer/src/components/PostCard.tsx` — component structure pattern in this project

  **API/Type References**:
  - `notion-types` `Decoration` type: `BaseDecoration = [string]`, `AdditionalDecoration = [string, SubDecoration[]]`
  - `notion-types` SubDecoration types: BoldFormat, ItalicFormat, StrikeFormat, CodeFormat, UnderlineFormat, LinkFormat, ColorFormat, DateFormat, UserFormat, InlineEquationFormat, PageFormat, ExternalLinkFormat, DiscussionFormat, ExternalObjectInstanceFormat, LinkMentionFormat, SuggestionEditFormat
  - Full type definitions at notion-types `build/index.d.ts` (in node_modules)

  **External References**:
  - react-notion-x source `components/text.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/components/text.tsx` — original rich text implementation, reference for decoration handling logic
  - react-notion-x source `components/page-icon.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/components/page-icon.tsx`

  **Acceptance Criteria**:
  - [ ] `Text` component renders plain text: `[["Hello"]]` → `<span>Hello</span>`
  - [ ] Bold: `[["text", [["b"]]]]` → `<strong>text</strong>`
  - [ ] Nested: `[["text", [["b"], ["i"]]]]` → `<strong><em>text</em></strong>`
  - [ ] Link: `[["click", [["a", "https://example.com"]]]]` → `<a href="https://example.com">click</a>`
  - [ ] Color: `[["text", [["h", "red"]]]]` → `<span class="noxion-color--red">text</span>`
  - [ ] Inline equation: `[["", [["e", "E=mc^2"]]]]` → contains KaTeX HTML output
  - [ ] `~/.bun/bin/bun test` — text tests pass

  **Commit**: YES
  - Message: `feat(notion-renderer): rich text renderer with decoration support`
  - Files: `packages/notion-renderer/src/components/text.tsx`, `packages/notion-renderer/src/__tests__/text.test.ts`
  - Pre-commit: `~/.bun/bin/bun test`

---

- [ ] 3. Block router + core text blocks

  **What to do**:
  - Create `src/block.tsx` — the main block router component
    - Takes a `blockId` and `level` as props
    - Looks up block from context (recordMap)
    - Switches on `block.type` to render the appropriate component
    - Checks component overrides from context first
    - Renders children blocks recursively
    - Unknown block types render a dev-mode warning div or nothing in production
  - Create `src/renderer.tsx` — the top-level `NotionRenderer` component
    - Wraps content in `NotionRendererProvider`
    - Renders the root page block
    - Handles full-page mode (with cover, icon, title) vs inline mode
  - Create block components in `src/blocks/`:
    - `text.tsx` — paragraph block (wraps rich text)
    - `heading.tsx` — header, sub_header, sub_sub_header (h1, h2, h3)
    - `bulleted-list.tsx` — bulleted_list
    - `numbered-list.tsx` — numbered_list
    - `to-do.tsx` — to_do (checkbox + text)
    - `quote.tsx` — quote block
    - `callout.tsx` — callout (icon + colored background + text)
    - `divider.tsx` — horizontal rule
    - `toggle.tsx` — toggle block (collapsible, renders children)
    - `page.tsx` — page block (handles full-page rendering with cover, icon, title)
  - Test file: `src/__tests__/block-router.test.ts`

  **Must NOT do**:
  - Render Collection View blocks (use placeholder)
  - Import from react-notion-x
  - Add any styling CSS in this task (CSS is Task 9)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Core rendering logic, recursive tree rendering

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 6 once Task 2 is available)
  - **Parallel Group**: Wave 2 (starts after Tasks 1+2)
  - **Blocks**: Tasks 8, 10
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `packages/renderer/src/components/NotionPage.tsx` — current NotionPage wrapper (what we're replacing)

  **API/Type References**:
  - `notion-types` `Block` union type — all block interfaces
  - `notion-types` `ExtendedRecordMap` — `recordMap.block[id]` access pattern
  - `notion-types` `BlockType` — type string union

  **External References**:
  - react-notion-x `block.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/block.tsx` — main block router, ~800 lines, handles all block type switching
  - react-notion-x `renderer.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/renderer.tsx` — top-level renderer with full-page mode

  **Acceptance Criteria**:
  - [ ] `NotionRenderer` renders a recordMap with text blocks → outputs paragraph elements
  - [ ] Block router dispatches `header` → heading component, `text` → text component, etc.
  - [ ] Component overrides: passing `components={{ text: CustomText }}` uses CustomText for text blocks
  - [ ] Unknown block types don't crash — render nothing or a debug placeholder
  - [ ] Nested blocks: toggle block renders children when expanded
  - [ ] `~/.bun/bin/bun test` — block router tests pass

  **Commit**: YES
  - Message: `feat(notion-renderer): block router and core text blocks`
  - Files: `packages/notion-renderer/src/block.tsx`, `packages/notion-renderer/src/renderer.tsx`, `packages/notion-renderer/src/blocks/*.tsx`
  - Pre-commit: `~/.bun/bin/bun test`

---

- [ ] 4. KaTeX equation renderer (SSR)

  **What to do**:
  - Add `katex` as a dependency to `packages/notion-renderer/package.json`
  - Create `src/blocks/equation.tsx` — block equation component
    - Reads equation expression from `block.properties.title`
    - Uses `katex.renderToString(expression, { displayMode: true, throwOnError: false })` for block equations
    - Outputs `<div class="noxion-equation" dangerouslySetInnerHTML={...}>`
  - Create `src/components/inline-equation.tsx` — inline equation for use in rich text
    - Uses `katex.renderToString(expression, { displayMode: false, throwOnError: false })`
    - Outputs `<span class="noxion-equation--inline" dangerouslySetInnerHTML={...}>`
  - Update rich text renderer (Task 2) to use `InlineEquation` for `['e', expression]` decorations
  - KaTeX CSS: Add `katex/dist/katex.min.css` as a CSS dependency that consumers must import
  - Add export path in package.json: `"./katex-css": "katex/dist/katex.min.css"` or document import instruction
  - Test file: `src/__tests__/equation.test.ts`

  **Must NOT do**:
  - Client-side dynamic import of KaTeX
  - Bundle KaTeX CSS into the renderer's own CSS (keep it as a separate import for tree-shaking)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: []
    - Straightforward integration — KaTeX API is simple

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 5)
  - **Blocks**: Task 10
  - **Blocked By**: Task 1

  **References**:

  **API/Type References**:
  - `notion-types` `EquationBlock` — `properties.title` contains the LaTeX expression as Decoration[]
  - `notion-types` `InlineEquationFormat = ['e', string]` — inline equation decoration

  **External References**:
  - react-notion-x equation: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/third-party/equation.tsx` — original equation component (uses dynamic import + client-side rendering, which we improve upon with SSR)
  - KaTeX API: `https://katex.org/docs/api` — `renderToString()` function
  - KaTeX npm: `https://www.npmjs.com/package/katex`

  **Acceptance Criteria**:
  - [ ] Block equation: `E = mc^2` renders KaTeX HTML with display mode
  - [ ] Inline equation: `x^2` in rich text renders KaTeX HTML inline
  - [ ] Invalid LaTeX doesn't crash — renders error message gracefully (throwOnError: false)
  - [ ] No client-side JS required for equation rendering
  - [ ] `~/.bun/bin/bun test` — equation tests pass

  **Commit**: YES
  - Message: `feat(notion-renderer): KaTeX equation rendering (SSR)`
  - Files: `packages/notion-renderer/src/blocks/equation.tsx`, `packages/notion-renderer/src/components/inline-equation.tsx`, `packages/notion-renderer/src/__tests__/equation.test.ts`
  - Pre-commit: `~/.bun/bin/bun test`

---

- [ ] 5. Shiki code block renderer

  **What to do**:
  - Add `shiki` as a dependency to `packages/notion-renderer/package.json`
  - Create `src/blocks/code.tsx` — code block component
    - Reads code text from `block.properties.title` (Decoration[])
    - Reads language from `block.properties.language` (Decoration[]) — normalize to Shiki language ID
    - Creates a Shiki highlighter instance (cache it via module-level singleton or React cache)
    - Calls `highlighter.codeToHtml(code, { lang, theme })` — server-side
    - Outputs highlighted HTML with `dangerouslySetInnerHTML`
    - Wraps in `<div class="noxion-code"><pre>...</pre></div>`
    - Include copy button (optional, can be client-side)
    - Include language label display
    - Handle caption from `block.properties.caption`
  - Language mapping: Map Notion language names to Shiki language IDs (Notion uses display names like "JavaScript", Shiki uses "javascript")
  - Theme: Use a neutral theme (e.g., `github-dark` for dark mode, `github-light` for light) or `one-dark-pro`
  - Handle edge cases: no language specified → plain text, unknown language → plain text
  - Consider: Shiki is async — if used in server components this is fine. For client components, may need pre-rendering strategy.
  - Test file: `src/__tests__/code.test.ts`

  **Must NOT do**:
  - Use Prism.js or highlight.js
  - Bundle all Shiki languages (use lazy loading for languages)
  - Client-side Shiki initialization

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Shiki integration requires understanding async patterns and caching

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 4)
  - **Blocks**: Task 10
  - **Blocked By**: Task 1

  **References**:

  **API/Type References**:
  - `notion-types` `CodeBlock` — `properties.title` (code text), `properties.language` (language name), `properties.caption` (caption text)

  **External References**:
  - react-notion-x code: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/third-party/code.tsx` — original code component (uses prismjs, which we replace with Shiki)
  - Shiki docs: `https://shiki.style/` — official documentation
  - Shiki npm: `https://www.npmjs.com/package/shiki`

  **Acceptance Criteria**:
  - [ ] JavaScript code renders with syntax highlighting tokens
  - [ ] Language label displays (e.g., "JavaScript" above code block)
  - [ ] Unknown language renders as plain text without crashing
  - [ ] Empty code block renders without crashing
  - [ ] Caption renders below code block if present
  - [ ] `~/.bun/bin/bun test` — code tests pass

  **Commit**: YES
  - Message: `feat(notion-renderer): Shiki code syntax highlighting`
  - Files: `packages/notion-renderer/src/blocks/code.tsx`, `packages/notion-renderer/src/__tests__/code.test.ts`
  - Pre-commit: `~/.bun/bin/bun test`

---

- [ ] 6. Media blocks (image, video, audio, embed, bookmark, file)

  **What to do**:
  - Create media block components in `src/blocks/`:
    - `image.tsx` — image block
      - Reads image URL from `block.format.display_source` or `block.properties.source`
      - Supports Next.js Image component via context (components.Image)
      - Handles Notion image proxy URLs
      - Caption from `block.properties.caption`
      - Wraps in `<figure>` + `<figcaption>`
    - `video.tsx` — video block
      - Handles YouTube (extract video ID, render lite embed or iframe)
      - Handles direct video URLs (HTML5 `<video>`)
      - Handles Vimeo, Loom, other embed URLs
    - `audio.tsx` — audio block (HTML5 `<audio>`)
    - `embed.tsx` — generic embed block (iframe)
      - Handles: figma, typeform, replit, codepen, excalidraw, tweet, maps, gist, miro, generic URLs
      - Each embed type can have custom rendering (e.g., tweet uses embed URL pattern)
    - `bookmark.tsx` — bookmark block
      - Renders link with title, description, icon, cover image from `block.format`
      - Styled as a card
    - `file.tsx` — file attachment block
      - Download link with filename and size
    - `pdf.tsx` — PDF embed (iframe to PDF URL)
  - Create `src/components/asset.tsx` — shared asset/media wrapper that handles common logic (source URL resolution, format reading)
  - Create `src/components/lazy-image.tsx` — image component with loading state

  **Must NOT do**:
  - Import react-notion-x components
  - Use react-medium-image-zoom or similar (simple lightbox can be added later)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Multiple related components, media handling patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 3, 4, 5)
  - **Parallel Group**: Wave 2/3
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2 (needs rich text for captions)

  **References**:

  **API/Type References**:
  - `notion-types` `ImageBlock` — `format.block_width`, `format.block_height`, `format.display_source`, `properties.source`, `properties.caption`
  - `notion-types` `VideoBlock`, `AudioBlock`, `EmbedBlock`, `BookmarkBlock`, `FileBlock`, `PdfBlock`
  - `notion-utils` `defaultMapImageUrl` — URL mapping function (used in core/fetcher.ts)

  **External References**:
  - react-notion-x `components/asset.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/components/asset.tsx` — asset rendering logic
  - react-notion-x `components/asset-wrapper.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/components/asset-wrapper.tsx`
  - react-notion-x `components/lazy-image.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/components/lazy-image.tsx`
  - react-notion-x `components/lite-youtube-embed.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/components/lite-youtube-embed.tsx`

  **Acceptance Criteria**:
  - [ ] Image block renders `<figure>` with image and optional caption
  - [ ] Image supports both direct URLs and Notion proxy URLs
  - [ ] Video block renders YouTube embeds correctly
  - [ ] Bookmark block renders as a styled card with title/description/favicon
  - [ ] File block renders as a download link
  - [ ] `~/.bun/bin/bun test` — media block tests pass

  **Commit**: YES
  - Message: `feat(notion-renderer): media blocks (image, video, audio, embed, bookmark, file)`
  - Files: `packages/notion-renderer/src/blocks/{image,video,audio,embed,bookmark,file,pdf}.tsx`, `packages/notion-renderer/src/components/{asset,lazy-image}.tsx`
  - Pre-commit: `~/.bun/bin/bun test`

---

- [ ] 7. Update create-noxion template

  **What to do**:
  - Update `packages/create-noxion/src/templates/nextjs/package.json`:
    - Remove `react-notion-x` from dependencies
    - Add `@noxion/notion-renderer` (or ensure it comes through `@noxion/renderer`)
  - Update `packages/create-noxion/src/templates/nextjs/next.config.ts`:
    - Remove `react-notion-x` from transpilePackages
    - Add `@noxion/notion-renderer` if needed
  - Review other template files for react-notion-x references

  **Must NOT do**:
  - Change the template's actual functionality
  - Modify `packages/create-noxion/src/` scaffolding logic

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1) — or defer to final wave
  - **Blocks**: None
  - **Blocked By**: None (template can be updated independently)

  **References**:

  **Pattern References**:
  - `packages/create-noxion/src/templates/nextjs/package.json` — current template package.json
  - `packages/create-noxion/src/templates/nextjs/next.config.ts` — current template next.config

  **Acceptance Criteria**:
  - [ ] No `react-notion-x` in template package.json
  - [ ] No `react-notion-x` in template next.config.ts transpilePackages
  - [ ] Template still has all needed dependencies for a working blog

  **Commit**: YES (group with Task 10)
  - Message: `chore(create-noxion): update template to use notion-renderer`
  - Files: `packages/create-noxion/src/templates/nextjs/**`
  - Pre-commit: `~/.bun/bin/bun tsc --noEmit` (in create-noxion)

---

- [ ] 8. Table, columns, synced blocks, and remaining block types

  **What to do**:
  - Create remaining block components in `src/blocks/`:
    - `table.tsx` — simple table block (table + table_row)
      - Reads table properties from block format
      - Renders `<table>` with `<thead>` and `<tbody>`
      - Handles column headers, row data
    - `column-list.tsx` — column_list block
      - Renders children as flex row (side-by-side columns)
      - Each child is a `column` block with `format.column_ratio`
    - `column.tsx` — individual column block
      - Renders children with appropriate width from `format.column_ratio`
    - `synced-block.tsx` — transclusion_container + transclusion_reference
      - transclusion_container: renders children directly (it's the source block)
      - transclusion_reference: looks up the source block via `format.transclusion_reference_pointer` and renders its content
    - `alias.tsx` — alias block (page reference)
    - `table-of-contents.tsx` — table_of_contents block (renders TOC from page headings)
    - `button.tsx` — button block (Notion's button, render as styled button)
    - `external-object-instance.tsx` — EOI block (external integrations placeholder)
    - `collection-view-placeholder.tsx` — placeholder for collection_view and collection_view_page
      - Renders a subtle "Database view" placeholder with optional link to Notion
  - Create `src/blocks/index.ts` — exports all block components + default block component map

  **Must NOT do**:
  - Implement full Collection View rendering
  - Import from react-notion-x

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: []
    - Multiple components, some with complex data access patterns (synced blocks, tables)

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 9)
  - **Parallel Group**: Wave 4
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 1, 2, 3

  **References**:

  **API/Type References**:
  - `notion-types` `TableBlock` — `format.table_block_column_order`, `format.table_block_column_header`
  - `notion-types` `TableRowBlock` — `properties` contains cell data keyed by column ID
  - `notion-types` `ColumnListBlock`, `ColumnBlock` — `format.column_ratio`
  - `notion-types` `SyncBlock`, `SyncPointerBlock` — `format.transclusion_reference_pointer`

  **External References**:
  - react-notion-x `block.tsx` table handling: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/block.tsx` — search for "table" and "column_list" cases
  - react-notion-x `components/sync-pointer-block.tsx`: `https://github.com/NotionX/react-notion-x/blob/master/packages/react-notion-x/src/components/sync-pointer-block.tsx`

  **Acceptance Criteria**:
  - [ ] Table renders with correct rows and columns from recordMap
  - [ ] Column list renders children side-by-side with correct width ratios
  - [ ] Synced block (transclusion_reference) renders content from source block
  - [ ] Collection view blocks render placeholder (not crash)
  - [ ] All block types have a registered component (no "empty component" warnings)
  - [ ] `~/.bun/bin/bun test` — all tests pass

  **Commit**: YES
  - Message: `feat(notion-renderer): table, columns, synced blocks, and remaining types`
  - Files: `packages/notion-renderer/src/blocks/*.tsx`
  - Pre-commit: `~/.bun/bin/bun test`

---

- [ ] 9. Self-authored CSS for all blocks

  **What to do**:
  - Create `packages/notion-renderer/src/styles/notion-renderer.css` — complete stylesheet for all Notion blocks
  - BEM naming convention: `noxion-block`, `noxion-block--{type}`, `noxion-block__{element}`
  - CSS must use CSS custom properties (variables) from `--noxion-*` namespace for:
    - Colors: `--noxion-foreground`, `--noxion-background`, `--noxion-mutedForeground`, `--noxion-border`, `--noxion-accent`
    - Fonts: `--noxion-font-sans`, `--noxion-font-mono`
    - Spacing: use consistent scale
  - Block-specific styles:
    - Text blocks: line-height, margin-bottom, font-size per heading level
    - Lists: indentation, bullet/number styles, nesting
    - Quote: left border, italic, indentation
    - Callout: colored background, icon area, rounded corners
    - Code: monospace font, background, padding, line numbers area, language label, copy button
    - Image: max-width, figure/figcaption, responsive
    - Video: responsive 16:9 aspect ratio for iframes
    - Bookmark: card layout with favicon, title, description, cover
    - Table: border-collapse, header styling, cell padding
    - Column list: flexbox layout with gap
    - Toggle: expand/collapse indicator, indented children
    - Divider: `<hr>` styling
    - Equation: centered display, inline sizing
    - TOC: indented list, link styling
    - Colors: all 16 Notion colors (8 text + 8 background)
  - Dark mode: all styles work with both light and dark CSS variable values (no hardcoded colors)
  - Add export in package.json: `"./styles": "./src/styles/notion-renderer.css"`
  - No `!important` anywhere

  **Must NOT do**:
  - Use `!important`
  - Use Tailwind or CSS-in-JS
  - Copy react-notion-x CSS verbatim (write from scratch with better structure)
  - Hardcode colors (use CSS variables)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: CSS authoring for all block types, visual consistency, responsive design

  **Parallelization**:
  - **Can Run In Parallel**: Partially (can start after core blocks exist, refine as more blocks are added)
  - **Parallel Group**: Wave 4 (with Task 8)
  - **Blocks**: Task 10
  - **Blocked By**: Tasks 3, 6, 8 (needs to know what elements/classes exist)

  **References**:

  **Pattern References**:
  - `packages/renderer/src/styles/noxion.css` — existing BEM CSS pattern, CSS variable usage, responsive breakpoints
  - `packages/theme-default/styles/theme.css` — CSS variable definitions (what variables are available)

  **External References**:
  - react-notion-x `src/styles.css` (3385 lines): at `/Users/jiwon/Workspace/jiwonme/noxion/node_modules/.bun/react-notion-x@7.8.2+5b17367855fab75a/node_modules/react-notion-x/src/styles.css` — reference for which elements need styling, but rewrite with BEM naming

  **Acceptance Criteria**:
  - [ ] All block types have CSS rules (no unstyled blocks)
  - [ ] 0 uses of `!important` in the entire CSS file
  - [ ] All colors reference `--noxion-*` CSS variables
  - [ ] Responsive: blocks work at 320px, 768px, 1024px+ widths
  - [ ] Dark mode works via CSS variable switching (no separate dark stylesheet)
  - [ ] Notion color classes (16 colors) all have rules
  - [ ] Code blocks have proper monospace styling and background

  **Commit**: YES
  - Message: `feat(notion-renderer): self-authored CSS for all Notion blocks`
  - Files: `packages/notion-renderer/src/styles/notion-renderer.css`, `packages/notion-renderer/package.json` (exports)
  - Pre-commit: `~/.bun/bin/bun tsc --noEmit`

---

- [ ] 10. Migrate @noxion/renderer and apps/web, remove react-notion-x

  **What to do**:
  - **Update `packages/renderer/package.json`**:
    - Remove `react-notion-x` from dependencies
    - Remove `notion-types` from dependencies (if only used for react-notion-x; keep if used elsewhere)
    - Add `@noxion/notion-renderer` as dependency
  - **Update `packages/renderer/src/components/NotionPage.tsx`**:
    - Replace `import { NotionRenderer } from "react-notion-x"` with `import { NotionRenderer } from "@noxion/notion-renderer"`
    - Update props mapping to match new renderer's API
    - Remove react-notion-x-specific component override format
  - **Update `packages/renderer/src/templates/PostPage.tsx`**:
    - Replace `import type { ExtendedRecordMap } from "notion-types"` with import from `@noxion/core` or `@noxion/notion-renderer`
  - **Update `apps/web/app/globals.css`**:
    - Remove `@import "react-notion-x/src/styles.css"` (line 1)
    - Remove ALL `.notion-*` CSS override rules (~400 lines of overrides)
    - Add `@import "@noxion/notion-renderer/styles"` (the new CSS)
    - Add `@import "katex/dist/katex.min.css"` (for equation styling)
    - Keep non-notion rules (body, reset, noxion-* rules)
  - **Update `apps/web/app/layout.tsx`**:
    - Verify CSS imports are correct
  - **Update `apps/web/next.config.ts`**:
    - Remove `react-notion-x`, `notion-types`, `notion-utils` from transpilePackages
    - Add `@noxion/notion-renderer` to transpilePackages
  - **Update `apps/web/app/[slug]/notion-page-client.tsx`**:
    - Update imports if NotionPage API changed
  - **Update `apps/web/package.json`**:
    - Remove `react-notion-x` from dependencies
  - **Run full test suite and type-check all packages**
  - **Visual verification with Playwright**:
    - Start dev server
    - Navigate to home page — verify post list renders
    - Navigate to a post with equations — verify KaTeX renders
    - Navigate to a post with code blocks — verify Shiki highlighting
    - Navigate to a post with images — verify images render
    - Check dark mode toggle

  **Must NOT do**:
  - Change `@noxion/core` or its notion-client/types/utils dependencies
  - Break any existing test
  - Leave any react-notion-x reference in the codebase (except possibly in git history)

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
  - **Skills**: [`playwright`, `frontend-ui-ux`]
    - `playwright`: browser verification of rendered pages
    - `frontend-ui-ux`: ensure visual quality matches or exceeds current state

  **Parallelization**:
  - **Can Run In Parallel**: NO (final integration task)
  - **Parallel Group**: Sequential (after all other tasks)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 3, 4, 5, 6, 7, 8, 9

  **References**:

  **Pattern References**:
  - `packages/renderer/src/components/NotionPage.tsx` — current component to update
  - `packages/renderer/src/templates/PostPage.tsx` — template to update
  - `apps/web/app/globals.css` — CSS to clean up
  - `apps/web/app/[slug]/notion-page-client.tsx` — client wrapper to update
  - `apps/web/next.config.ts` — config to clean up
  - `apps/web/app/layout.tsx` — CSS import location

  **Acceptance Criteria**:
  - [ ] `grep -r "react-notion-x" packages/ apps/ --include="*.ts" --include="*.tsx" --include="*.json" --include="*.css"` → 0 results (excluding node_modules, .next, dist)
  - [ ] `~/.bun/bin/bun test` — all tests pass (203+ tests)
  - [ ] `~/.bun/bin/bun tsc --noEmit` in packages/renderer — 0 errors
  - [ ] `~/.bun/bin/bun tsc --noEmit` in packages/notion-renderer — 0 errors
  - [ ] `~/.bun/bin/bun tsc --noEmit` in packages/core — 0 errors
  - [ ] Home page renders with post cards (Playwright)
  - [ ] Post detail page renders with full content (Playwright)
  - [ ] Equations render as formatted math (Playwright)
  - [ ] Code blocks have syntax highlighting (Playwright)
  - [ ] Images render correctly (Playwright)
  - [ ] Dark mode works (Playwright)
  - [ ] No console errors about "empty component" (Playwright console check)

  **Commit**: YES
  - Message: `feat: migrate to @noxion/notion-renderer, remove react-notion-x`
  - Files: `packages/renderer/**`, `apps/web/**`, `packages/create-noxion/**`
  - Pre-commit: `~/.bun/bin/bun test`

---

## Commit Strategy

| After Task | Message | Key Files | Verification |
|------------|---------|-----------|--------------|
| 1 | `feat(notion-renderer): scaffold package with types and context provider` | packages/notion-renderer/** | bun test + tsc |
| 2 | `feat(notion-renderer): rich text renderer with decoration support` | src/components/text.tsx | bun test |
| 3 | `feat(notion-renderer): block router and core text blocks` | src/block.tsx, src/renderer.tsx, src/blocks/*.tsx | bun test |
| 4 | `feat(notion-renderer): KaTeX equation rendering (SSR)` | src/blocks/equation.tsx | bun test |
| 5 | `feat(notion-renderer): Shiki code syntax highlighting` | src/blocks/code.tsx | bun test |
| 6 | `feat(notion-renderer): media blocks` | src/blocks/{image,video,...}.tsx | bun test |
| 7+10 | `feat: migrate to @noxion/notion-renderer, remove react-notion-x` | renderer/**, apps/web/**, create-noxion/** | bun test + Playwright |
| 8 | `feat(notion-renderer): table, columns, synced blocks` | src/blocks/*.tsx | bun test |
| 9 | `feat(notion-renderer): self-authored CSS` | src/styles/notion-renderer.css | visual |

---

## Success Criteria

### Verification Commands
```bash
# All tests pass
~/.bun/bin/bun test

# All packages type-check
~/.bun/bin/bun tsc --noEmit  # in each package dir

# No react-notion-x references remain
grep -r "react-notion-x" packages/ apps/ --include="*.ts" --include="*.tsx" --include="*.json" --include="*.css" | grep -v node_modules | grep -v .next | grep -v dist
# Expected: 0 results

# Dev server starts and pages render
cd apps/web && ~/.bun/bin/bun run dev
# Then Playwright verification of all page types
```

### Final Checklist
- [ ] `react-notion-x` fully removed from all package.json files
- [ ] `react-notion-x/src/styles.css` import removed from globals.css
- [ ] All ~400 lines of `.notion-*` CSS overrides removed from globals.css
- [ ] `@noxion/notion-renderer` package created with all block renderers
- [ ] KaTeX equations render server-side
- [ ] Shiki code highlighting works server-side
- [ ] 0 uses of `!important` in notion-renderer CSS
- [ ] All CSS uses `--noxion-*` variables (dark/light mode compatible)
- [ ] Component override system works (users can replace any block renderer)
- [ ] All existing tests pass + new tests added
- [ ] Visual rendering matches or exceeds current quality
