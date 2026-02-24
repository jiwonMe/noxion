# Issues & Gotchas

## [2026-02-23] Wave 1 Complete

### Expected Breaking Changes (To Be Fixed in Wave 2)
- **Files with TSC errors** (INTENTIONAL, will be fixed in Task 3):
  - `packages/core/src/fetcher.ts` — accessing date/tags on BlogPage directly
  - `packages/core/src/frontmatter.ts` — same issue
  - `packages/core/src/plugins/rss.ts` — same issue
- **Root Cause**: These files still use old BlogPost flat structure
- **Fix**: Task 3 (Fetcher refactoring) will update to use NoxionPage.metadata

### Test Commands
- **Per-package**: `cd packages/{name} && ~/.bun/bin/bun test`
- **All packages**: `~/.bun/bin/bun run test` (from root)
- **Build**: `~/.bun/bin/bun run build` (from root or package)

### Code Style Requirements
- TypeScript strict mode
- NO `as any` or `@ts-ignore`
- Follow CONTRIBUTING.md:219-228 guidelines
