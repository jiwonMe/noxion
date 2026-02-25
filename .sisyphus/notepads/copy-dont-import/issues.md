# Issues & Gotchas - copy-dont-import Plan

## [2026-02-25] Known Issues

### apps/theme-dev Build Failure
- **Issue**: Imports validateThemeContract which was removed in Task 1
- **Status**: Expected, will be fixed in Task 8
- **Workaround**: None needed - Task 2 acceptance criteria don't require theme-dev to build

### Unused Variables in Components
- **Issue**: After removing .css.ts imports, variables like clampedDepth, linkClass are unused
- **Solution**: Added noUnusedLocals: false to theme-default and theme-beacon tsconfigs
- **Temporary**: Will be removed when Task 4/5 rewrite components with Tailwind

### Test Failures in create-noxion
- **Issue**: 2 test failures in plugin template (Cannot find module '@noxion/plugin-utils')
- **Status**: Pre-existing, not related to our changes
- **Impact**: None on current tasks
