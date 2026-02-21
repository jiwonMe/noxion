---
title: ThemeProvider
description: "@noxion/renderer ThemeProvider component"
---

# `<NoxionThemeProvider />`

```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
```

Provides theme context to all Noxion components. Must wrap your entire app (or at least all Noxion components).

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `NoxionTheme` | `defaultTheme` | Theme configuration |
| `defaultMode` | `ThemeMode` | `"system"` | Initial color mode |
| `children` | `ReactNode` | required | |

## Hooks

### `useNoxionTheme()`

```ts
import { useNoxionTheme } from "@noxion/renderer";

const theme = useNoxionTheme();
// theme.name: "light" | "dark"
```

### `useThemePreference()`

```ts
import { useThemePreference } from "@noxion/renderer";

const { mode, setMode } = useThemePreference();
// mode: "light" | "dark" | "system"
// setMode: (mode: ThemeMode) => void
```
