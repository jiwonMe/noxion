# Architectural Decisions - copy-dont-import Plan

## [2026-02-25] Initial Decisions

### Theme System Transition
- **Decision**: Remove runtime contract/provider system entirely
- **Rationale**: shadcn/ui model - components are owned source code, not npm imports
- **Impact**: No more NoxionThemeProvider, defineThemeContract, validateThemeContract

### Styling Approach
- **Decision**: Tailwind-only (remove Vanilla-Extract)
- **Rationale**: Copied files should work without additional build configuration
- **Impact**: All .css.ts files deleted, components will be rewritten with Tailwind in Tasks 4/5

### PageType Architecture
- **Decision**: De-hardcode blog/docs/portfolio, use PageTypeDefinition registry
- **Rationale**: Enable custom page types without core changes
- **Impact**: All switch statements on pageType must be replaced with registry lookups
