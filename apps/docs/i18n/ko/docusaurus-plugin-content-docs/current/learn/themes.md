---
sidebar_position: 7
title: 테마
description: CSS 변수, 테마 상속, 다크 모드로 Noxion 사이트의 디자인을 커스터마이징하세요.
---

# 테마

Noxion은 **CSS 커스텀 속성(CSS 변수)** 시스템을 테마에 사용합니다. 변수를 오버라이드하여 모든 색상, 폰트, 간격 값을 커스터마이징할 수 있습니다 — 빌드 과정 없이, 설정 변경 없이, JavaScript 불필요.

고급 사용 사례에서는 `extendTheme()`로 기본 테마에서 부분 오버라이드를 적용한 파생 테마를 만들 수 있습니다.

---

## 내장 테마

Noxion은 **5개의 공식 테마**를 독립적인 npm 패키지로 제공합니다:

| 테마 | 패키지 | 스타일 |
|------|--------|--------|
| **Default** | `@noxion/theme-default` | 시스템 폰트, 둥근 카드, 고정 헤더의 깔끔하고 모던한 레이아웃. 다른 모든 테마의 베이스. |
| **Ink** | `@noxion/theme-ink` | 터미널 감성의 미니멀 디자인 — 모노스페이스 타이포그래피, 점선 테두리, `~/` 로고 접두사, 소문자 내비게이션. |
| **Editorial** | `@noxion/theme-editorial` | 매거진 스타일 레이아웃 — 중앙 마스트헤드, 굵은 테두리, 세리프 디스플레이 폰트, 대문자 내비게이션. |
| **Folio** | `@noxion/theme-folio` | 포트폴리오에 최적화된 디자인 — 투명 헤더, 넓은 자간의 대문자 로고, 갤러리 친화적 카드 그리드. |
| **Beacon** | `@noxion/theme-beacon` | 콘텐츠 중심 읽기 경험 — 넓은 콘텐츠 영역(1320px), 정적 헤더, 큰 타이포그래피. 커스텀 `HomePage`와 `PostPage` 컴포넌트 포함. |

### 테마 사용하기

테마 패키지를 설치하고 가져오세요:

```bash
bun add @noxion/theme-ink
```

```ts
// noxion.config.ts
import { defineConfig } from "@noxion/core";
import { inkThemePackage } from "@noxion/theme-ink";

export default defineConfig({
  theme: inkThemePackage,
  // ...
});
```

모든 내장 테마는 `extendTheme()`를 통해 `@noxion/theme-default`를 확장하므로, 모든 기본 토큰을 상속받고 고유한 디자인 속성만 오버라이드합니다.

---

## 색상 모드

세 가지 색상 모드를 지원합니다:

| 모드 | 동작 |
|------|------|
| `"light"` | 항상 라이트 테마, OS 설정 무시 |
| `"dark"` | 항상 다크 테마, OS 설정 무시 |
| `"system"` | 사용자의 OS 다크/라이트 모드 설정을 따름 |

`noxion.config.ts`에서 기본값을 설정합니다:

```ts
export default defineConfig({
  defaultTheme: "system",   // 권장
  // ...
});
```

사용자가 테마 토글을 클릭하여 명시적으로 선택하면 `localStorage`에 저장되어 `defaultTheme`보다 우선합니다.

### `"system"` 작동 방식

`defaultTheme: "system"`일 때, Noxion은 [`prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme) 미디어 쿼리를 사용하여 사용자의 OS 설정을 감지합니다:

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* 다크 테마 변수가 자동 적용 */
  }
}
```

---

## FOUC 방지

JS 기반 테마 시스템의 흔한 문제는 **FOUC(스타일이 적용되지 않은 콘텐츠 깜빡임)** — React가 하이드레이션되기 전에 잘못된 테마가 잠깐 보이는 현상입니다.

Noxion은 `<head>`에 `<ThemeScript>` 컴포넌트를 주입하여 이를 방지합니다. 이 스크립트는 페인트 전에 동기적으로 실행되어 `localStorage`에서 저장된 설정을 읽고, 콘텐츠가 렌더링되기 전에 `<html>`에 `data-theme="light"` 또는 `data-theme="dark"`를 설정합니다:

```tsx
// app/layout.tsx (create-noxion이 생성)
import { ThemeScript } from "./theme-script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

`<html>`의 `suppressHydrationWarning`은 React가 하이드레이션하기 전에 스크립트가 `data-theme`을 설정하기 때문에 필요합니다.

---

## CSS 변수

모든 시각적 속성은 `:root`(라이트 모드)와 `[data-theme="dark"]`에 CSS 커스텀 속성으로 노출됩니다.

### 색상 토큰

```css
:root {
  --noxion-primary: #2563eb;          /* 기본 강조 색상 (링크, 버튼) */
  --noxion-primary-hover: #1d4ed8;    /* 기본 색상의 호버 상태 */
  --noxion-background: #ffffff;       /* 페이지 배경 */
  --noxion-card: #ffffff;             /* 카드/위젯 배경 */
  --noxion-muted: #f5f5f5;            /* 미묘한 배경 (코드 블록 등) */
  --noxion-foreground: #0a0a0a;       /* 메인 텍스트 색상 */
  --noxion-card-foreground: #0a0a0a;  /* 카드 위의 텍스트 */
  --noxion-muted-foreground: #737373; /* 보조/비활성 텍스트 */
  --noxion-border: #e5e5e5;           /* 기본 테두리 색상 */
  --noxion-border-radius: 0.5rem;     /* 기본 테두리 반경 */
}

[data-theme="dark"] {
  --noxion-background: #0a0a0a;
  --noxion-foreground: #fafafa;
  --noxion-card: #1a1a1a;
  --noxion-card-foreground: #fafafa;
  --noxion-muted: #262626;
  --noxion-muted-foreground: #a3a3a3;
  --noxion-border: #2a2a2a;
}
```

### 타이포그래피 토큰

```css
:root {
  --noxion-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, sans-serif;
  --noxion-font-mono: "JetBrains Mono", "Fira Code", Menlo, Monaco,
    "Cascadia Code", "Courier New", monospace;
  --noxion-font-size-base: 1rem;
  --noxion-line-height-base: 1.75;
  --noxion-font-size-sm: 0.875rem;
  --noxion-font-size-lg: 1.125rem;
}
```

---

## 테마 커스터마이징

`globals.css` (또는 동등한 전역 스타일시트)에서 변수를 오버라이드하세요:

```css
/* app/globals.css */

:root {
  --noxion-primary: #7c3aed;       /* 파란색 대신 보라색 */
  --noxion-primary-hover: #6d28d9;
  --noxion-border-radius: 0.25rem; /* 더 각진 카드 */
}

/* 커스텀 폰트 (next/font 또는 @font-face로 로드 후) */
:root {
  --noxion-font-sans: "Inter", system-ui, sans-serif;
}

/* 커스텀 다크 모드 색상 */
[data-theme="dark"] {
  --noxion-background: #0f0f23;
  --noxion-card: #16213e;
  --noxion-border: #1a1a2e;
}
```

### Google Fonts / next/font 사용

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html style={{ "--noxion-font-sans": inter.style.fontFamily } as React.CSSProperties}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## `extendTheme()`을 통한 테마 상속

재사용 가능한 테마 패키지를 만들 때, `@noxion/renderer`가 제공하는 `extendTheme()`을 사용합니다. 기본 테마 위에 테마 오버라이드를 딥 머지합니다:

```ts
import { extendTheme, themeDefault } from "@noxion/renderer";

const myTheme = extendTheme(themeDefault, {
  tokens: {
    colors: {
      primary: "#7c3aed",
      primaryHover: "#6d28d9",
    },
    fonts: {
      sans: '"Inter", system-ui, sans-serif',
    },
  },
  metadata: {
    name: "My Custom Theme",
    author: "Jane Doe",
    version: "1.0.0",
    description: "A violet-accented theme",
  },
  supports: ["blog", "docs", "portfolio"],
});
```

### 테마 패키지 만들기

CLI를 사용하여 테마 스타터를 스캐폴딩하세요:

```bash
bun create noxion my-theme --theme
```

다음이 포함된 패키지가 생성됩니다:
- `src/index.ts` — `NoxionThemePackage` 객체를 내보냄
- `styles/theme.css` — CSS 변수 오버라이드
- `package.json` — npm 퍼블리싱을 위한 설정

전체 안내는 [커스텀 테마 만들기](./creating-theme)를 참조하세요.

### 테마 메타데이터

테마는 메타데이터와 지원하는 페이지 타입을 선언할 수 있습니다:

```ts
interface NoxionThemeMetadata {
  name: string;
  author?: string;
  version?: string;
  description?: string;
  previewUrl?: string;
  repository?: string;
}
```

`supports` 필드는 테마가 어떤 페이지 타입의 템플릿을 가지고 있는지 선언합니다:

```ts
supports: ["blog", "docs"]  // 이 테마는 블로그와 문서 템플릿만 있음
```

---

## 테마 토글 컴포넌트

스캐폴딩된 앱에는 헤더에 `<ThemeToggle>` 컴포넌트가 포함되어 사용자가 라이트, 다크, 시스템 모드 사이를 전환할 수 있습니다. 토글은:

1. 컨텍스트에서 현재 모드를 읽습니다 (`useThemePreference()`)
2. 클릭 시 `light → dark → system` 순으로 순환합니다
3. 선택을 `localStorage`에 저장합니다
4. 전체 페이지 리로드 없이 `<html>`의 `data-theme`을 업데이트합니다

### 토글 숨기기

토글을 제거하고 싶다면 (예: 라이트 전용 사이트):

```ts
// noxion.config.ts
export default defineConfig({
  defaultTheme: "light",
  // ...
});
```

그런 다음 `<Header>` 컴포넌트에서 `<ThemeToggle>`을 제거하세요.

---

## 훅

고급 커스터마이징을 위해 `@noxion/renderer`는 두 가지 React 훅을 내보냅니다:

### `useNoxionTheme()`

**현재 활성 테마**(해결됨 — 여기서는 `"system"` 없음)를 반환합니다:

```tsx
import { useNoxionTheme } from "@noxion/renderer";

function MyComponent() {
  const theme = useNoxionTheme();
  // theme.name: "light" | "dark"

  return <div className={theme.name === "dark" ? "dark-style" : "light-style"} />;
}
```

### `useThemePreference()`

사용자의 **설정 값** (`"system"` 포함)과 세터를 반환합니다:

```tsx
import { useThemePreference } from "@noxion/renderer";

function ThemeSelector() {
  const { mode, setMode } = useThemePreference();

  return (
    <select value={mode} onChange={(e) => setMode(e.target.value as ThemeMode)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">System</option>
    </select>
  );
}
```

두 훅 모두 `<NoxionThemeProvider>`로 감싸진 컴포넌트 안에서 사용해야 합니다.
