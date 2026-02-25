# Learnings - copy-dont-import Plan

## [2026-02-25] Task 1 & 2 Completion

### Task 1: Renderer Cleanup
- Successfully removed ThemeProvider, contract, slot-resolver, template-resolver
- Kept all prop interfaces (HeaderProps, PostCardProps, etc.) in renderer/types.ts
- Added @deprecated to extendSlots in core/plugin.ts
- Build passes, 6/6 tests pass

### Task 2: Vanilla-Extract Removal
- Deleted 27 .css.ts files across theme-default and theme-beacon
- Removed all @vanilla-extract/* dependencies
- Components now have empty className="" strings (intentional - Task 4/5 will add Tailwind)
- Added noUnusedLocals: false to theme tsconfigs temporarily (unused variables from removed styles)
- apps/theme-dev build fails (imports removed validateThemeContract) - expected, will be fixed in Task 8

### Key Conventions
- Tailwind configs were preserved (only VE removed)
- Contract.ts files were deleted from themes
- Build verification: theme-default and theme-beacon must build successfully
- Full monorepo build may fail due to apps/theme-dev - this is expected

## [2026-02-25] Task 3: pageType De-hardcoding

### Changes Made
1. **Extended PageTypeDefinition interface** (types.ts):
   - Added `sortBy?: { field: string; order: 'asc' | 'desc' }`
   - Added `sitemapConfig?: { priority: number; changefreq: 'daily' | 'weekly' | 'monthly' }`
   - Added `structuredDataType?: string` (e.g., 'BlogPosting', 'TechArticle', 'CreativeWork')
   - Added `metadataConfig?: { openGraphType: 'article' | 'website' }`

2. **Updated BUILTIN_PAGE_TYPES** (page-type-registry.ts):
   - Added all new fields to blog/docs/portfolio definitions
   - Moved schemaConventions from METADATA_CONVENTIONS to PageTypeDefinition
   - Blog: sortBy date desc, priority 0.8, BlogPosting, article type
   - Docs: priority 0.7, TechArticle, website type
   - Portfolio: priority 0.6, monthly changefreq, CreativeWork, website type

3. **Refactored schema-mapper.ts**:
   - Updated `getMetadataConventions()` to accept optional PageTypeRegistry
   - Function now checks registry first, falls back to hardcoded METADATA_CONVENTIONS
   - Updated `buildPropertyMapping()` to accept and pass registry parameter

4. **Simplified fetcher.ts**:
   - Removed hardcoded pageType check in `detectPageType()` - now accepts any typeValue
   - Refactored `buildMetadata()` to be fully dynamic - no more switch statements
   - Metadata building now uses mapping.metadataKeys generically
   - Special handling for arrays (tags, technologies), numbers (order), booleans (featured)
   - Kept blog-specific sorting as fallback (line 111) - acceptable for backward compat

5. **Updated adapter-nextjs**:
   - `sitemap.ts`: getPriority/getChangeFrequency check registry first, fall back to switch
   - `structured-data.ts`: generatePageLD checks registry for structuredDataType
   - `metadata.ts`: generateNoxionMetadata checks registry for openGraphType

### Key Patterns
- **Registry-first, fallback pattern**: All functions check registry if provided, fall back to hardcoded values
- **Backward compatibility**: Existing blog/docs/portfolio behavior unchanged
- **Optional registry parameter**: Functions work without registry (uses fallbacks)
- **Dynamic metadata**: buildMetadata no longer has pageType-specific logic

### Remaining Hardcoded References
- `fetchBlogPosts()` uses "blog" string - INTENTIONAL for backward compat API
- Blog sorting in extractPagesFromRecordMap - ACCEPTABLE fallback behavior

## [2026-02-25] Task 4: theme-default Tailwind Rewrite

### Completed
- ✅ Rewrote all 16 components with Tailwind utility classes
- ✅ Rewrote all 3 layouts (BaseLayout, BlogLayout, DocsLayout)
- ✅ Rewrote all 7 templates (HomePage, PostPage, ArchivePage, TagPage, DocsPage, PortfolioGrid, PortfolioProject)
- ✅ Created registry.json with component dependencies
- ✅ Build successful

### Design System Applied
**Colors:**
- Primary: blue-600/blue-400 (dark mode)
- Background: white/gray-950
- Text: gray-900/gray-100
- Muted: gray-600/gray-400
- Borders: gray-200/gray-800

**Components:**
- Cards: rounded-lg, border, hover:shadow-lg transitions
- Buttons: rounded-md, px-3 py-1.5, hover states
- Typography: text-4xl for h1, text-xl for h3, prose for content
- Spacing: space-y-8 for sections, gap-6 for grids
- Dark mode: All components use dark: variants

**Layouts:**
- Container: mx-auto px-4 sm:px-6 lg:px-8
- Header: sticky top-0, backdrop-blur
- Grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Docs: sidebar w-64, main flex-1 max-w-3xl

### Key Patterns
- All className props accept custom classes or use defaults
- Hover states with group/group-hover for nested elements
- Responsive breakpoints: sm:, md:, lg:
- Accessibility: aria-labels, aria-current for active states
- Image optimization: aspect-video, object-cover, loading="lazy"
