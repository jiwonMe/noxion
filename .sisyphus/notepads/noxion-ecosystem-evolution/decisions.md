# Architectural Decisions

## [2026-02-23] Wave 1: Foundation

### Decision: NoxionPage Generic Model
- **Context**: Need to support Blog, Docs, Portfolio page types
- **Decision**: Create generic `NoxionPage` interface with `pageType` discriminator
- **Rationale**: Allows type-safe handling of different page types while maintaining single data model
- **Alternatives Considered**: Separate interfaces per type (rejected - too fragmented)

### Decision: Metadata as Record<string, unknown>
- **Context**: Each page type has different fields (blog: tags/category, docs: section/order, portfolio: technologies/year)
- **Decision**: Use flexible `metadata` field instead of hardcoding all possible fields
- **Rationale**: Extensible for plugin-registered page types, avoids type bloat
- **Trade-off**: Less type safety for metadata access (acceptable for flexibility)

### Decision: Backward Compatibility via Type Alias
- **Context**: Breaking change from BlogPost to BlogPage
- **Decision**: Export `BlogPost` as type alias to `BlogPage` for one version cycle
- **Rationale**: Allows gradual migration, warns users but doesn't break existing code
- **Removal Plan**: Deprecate in v0.2, remove in v0.3

### Decision: Optional Plugin Hooks
- **Context**: Adding 5 new hooks to plugin API
- **Decision**: All new hooks are optional
- **Rationale**: Existing plugins continue working without modification
- **Pattern**: Follows existing hook pattern (all hooks are optional)

### Decision: Collections Config
- **Context**: Need to support multiple Notion databases
- **Decision**: Add `collections` field to config, make `rootNotionPageId` optional
- **Rationale**: Supports both single-DB (current) and multi-DB (new) modes
- **Validation**: At least one of rootNotionPageId or collections must be present
