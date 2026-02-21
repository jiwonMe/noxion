---
title: ThemeProvider
description: "@noxion/renderer ThemeProvider 컴포넌트"
---

# `<NoxionThemeProvider />`

```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
```

모든 Noxion 컴포넌트에 테마 컨텍스트를 제공합니다. 전체 앱(또는 최소한 모든 Noxion 컴포넌트)을 감싸야 합니다.

## Props

| Prop | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `theme` | `NoxionTheme` | `defaultTheme` | 테마 설정 |
| `defaultMode` | `ThemeMode` | `"system"` | 초기 색상 모드 |
| `children` | `ReactNode` | 필수 | |

## 훅

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
