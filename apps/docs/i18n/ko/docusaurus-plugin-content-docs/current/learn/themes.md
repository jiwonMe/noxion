---
sidebar_position: 7
title: 테마
description: Tailwind CSS, CSS 변수, 다크 모드로 Noxion 사이트의 디자인을 커스터마이징하세요.
---

# 테마

Noxion은 **직접 임포트** 테마 시스템을 사용합니다. 각 테마는 React 컴포넌트, 레이아웃, 템플릿을 내보내는 npm 패키지입니다. 필요한 것을 임포트하여 앱을 직접 구성합니다 — 프로바이더 없이, 컨트랙트 없이, 런타임 간접 참조 없이.

시각적 커스터마이징은 **Tailwind CSS 유틸리티 클래스**와 **CSS 커스텀 속성(CSS 변수)**으로 이루어집니다.

---

## 내장 테마

Noxion은 **2개의 공식 테마**를 독립적인 npm 패키지로 제공합니다:

| 테마 | 패키지 | 스타일 |
|------|--------|--------|
| **Default** | `@noxion/theme-default` | 시스템 폰트, 둥근 카드, 고정 헤더의 깔끔하고 모던한 레이아웃. 대부분의 사이트를 위한 기본 테마. |
| **Beacon** | `@noxion/theme-beacon` | 콘텐츠 중심 읽기 경험 — 넓은 콘텐츠 영역(1320px), 정적 헤더, 큰 타이포그래피. |

### 테마 사용하기

테마 패키지를 설치하고 필요한 컴포넌트를 임포트하세요:

```bash
bun add @noxion/theme-default
```

```tsx
// app/layout.tsx
import "@noxion/theme-default/styles/tailwind";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
```

```tsx
// app/site-layout.tsx
"use client";
import { BlogLayout, Header, Footer } from "@noxion/theme-default";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogLayout
      slots={{
        header: () => <Header siteName="내 블로그" navigation={[{ label: "홈", href: "/" }]} />,
        footer: () => <Footer siteName="내 블로그" author="작성자" />,
      }}
    >
      {children}
    </BlogLayout>
  );
}
```

테마를 전환하려면 임포트를 교체하세요:

```tsx
import { BlogLayout, Header, Footer } from "@noxion/theme-beacon";
```

### 테마 내보내기

각 테마 패키지는 다음을 내보냅니다:

| 카테고리 | 내보내기 |
|----------|----------|
| **컴포넌트** | `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter` |
| **레이아웃** | `BaseLayout`, `BlogLayout`, `DocsLayout` |
| **템플릿** | `HomePage`, `PostPage`, `ArchivePage`, `TagPage`, `DocsPage`, `PortfolioGrid`, `PortfolioProject` |
| **스타일** | `@noxion/theme-default/styles/tailwind` (Tailwind CSS 진입점), `@noxion/theme-default/styles` (CSS 변수만) |

---

## Tailwind CSS 설정

Noxion 테마는 **Tailwind CSS v4**를 PostCSS와 함께 사용합니다. 각 테마의 `styles/tailwind.css`에는 다음이 포함됩니다:

1. `@import "tailwindcss"` — Tailwind 베이스 로드
2. `@custom-variant dark` — `dark:` 유틸리티를 `@media (prefers-color-scheme: dark)` 대신 `[data-theme="dark"]`에 매핑
3. `@source` — Tailwind에게 클래스 이름을 스캔할 파일 지정
4. `:root`와 `[data-theme="dark"]`의 CSS 변수

### PostCSS 설정 필수

앱에 `postcss.config.mjs`가 필요합니다:

```js
// postcss.config.mjs
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

### 앱 레벨 클래스 스캔

앱에서 Tailwind 클래스를 사용한다면(테마뿐만 아니라), `globals.css`에 `@source`를 추가하여 자체 파일과 워크스페이스 패키지를 포함하세요:

```css
/* app/globals.css */
@source "../../../packages/*/src/**/*.{ts,tsx}";
```

이렇게 하면 모노레포 전체의 모든 컴포넌트에 대해 Tailwind가 유틸리티 클래스를 생성합니다.

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

### 다크 모드 작동 방식

Noxion은 `<html>`의 `data-theme="dark"`으로 다크 모드를 활성화합니다. Tailwind `dark:` 변형은 `@custom-variant`를 통해 이 속성에 매핑됩니다:

```css
/* 테마 tailwind.css 내 */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));
```

이는 모든 Tailwind `dark:` 유틸리티(예: `dark:bg-gray-950`, `dark:text-gray-100`)가 OS 미디어 쿼리가 아닌 `data-theme` 속성에 반응한다는 의미입니다.

---

## FOUC 방지

JS 기반 테마 시스템의 흔한 문제는 **FOUC(스타일이 적용되지 않은 콘텐츠 깜빡임)** — React가 하이드레이션되기 전에 잘못된 테마가 잠깐 보이는 현상입니다.

Noxion은 `<head>`에 `<ThemeScript>` 컴포넌트를 주입하여 이를 방지합니다. 이 스크립트는 페인트 전에 동기적으로 실행되어 `localStorage`에서 저장된 설정을 읽고, 콘텐츠가 렌더링되기 전에 `<html>`에 `data-theme="light"` 또는 `data-theme="dark"`를 설정합니다:

```tsx
// app/layout.tsx (create-noxion이 생성)
import { ThemeScript } from "./theme-script";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
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

각 테마는 `:root`(라이트 모드)와 `[data-theme="dark"]`에 CSS 커스텀 속성을 정의합니다. 이는 테마의 `styles/tailwind.css`에 설정됩니다.

### Default 테마 토큰

```css
:root {
  --color-primary: #2563eb;
  --color-primary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #737373;
  --color-border: #e5e5e5;
  --color-accent: #f5f5f5;
  --color-accent-foreground: #171717;
  --color-card: #ffffff;
  --color-card-foreground: #171717;

  --font-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-serif: Georgia, "Times New Roman", serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;

  --width-content: 1080px;
  --width-sidebar: 260px;
  --radius-default: 0.5rem;
}

[data-theme="dark"] {
  --color-primary: #3b82f6;
  --color-primary-foreground: #ffffff;
  --color-background: #0a0a0a;
  --color-foreground: #ededed;
  --color-muted: #1a1a1a;
  --color-muted-foreground: #888888;
  --color-border: #1f1f1f;
  --color-accent: #1a1a1a;
  --color-accent-foreground: #ededed;
  --color-card: #111111;
  --color-card-foreground: #ededed;
}
```

---

## 테마 커스터마이징

`globals.css`에서 변수를 오버라이드하세요:

```css
/* app/globals.css */

:root {
  --color-primary: #7c3aed;       /* 파란색 대신 보라색 */
  --radius-default: 0.25rem;      /* 더 각진 카드 */
}

[data-theme="dark"] {
  --color-background: #0f0f23;
  --color-card: #16213e;
  --color-border: #1a1a2e;
}
```

### Google Fonts / next/font 사용

```tsx
// app/layout.tsx
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html style={{ "--font-sans": inter.style.fontFamily } as React.CSSProperties}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## 테마 토글 컴포넌트

각 테마에는 `<ThemeToggle>` 컴포넌트가 포함되어 사용자가 라이트, 다크, 시스템 모드 사이를 전환할 수 있습니다. 토글은:

1. `@noxion/renderer`의 `useThemePreference()`로 현재 설정을 읽습니다
2. 클릭 시 `system -> light -> dark` 순으로 순환합니다
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

고급 커스터마이징을 위해 `@noxion/renderer`는 다음 React 훅을 내보냅니다:

### `useThemePreference()`

사용자의 **설정 값** (`"system"` 포함), **해석된** 값, 그리고 세터를 반환합니다:

```tsx
"use client";
import { useThemePreference } from "@noxion/renderer";
import type { ThemePreference } from "@noxion/renderer";

function ThemeSelector() {
  const { preference, resolved, setPreference } = useThemePreference();

  return (
    <select
      value={preference}
      onChange={(e) => setPreference(e.target.value as ThemePreference)}
    >
      <option value="light">라이트</option>
      <option value="dark">다크</option>
      <option value="system">시스템</option>
    </select>
  );
}
```

| 속성 | 타입 | 설명 |
|------|------|------|
| `preference` | `ThemePreference` | 사용자의 저장된 설정: `"light"`, `"dark"`, 또는 `"system"`. |
| `resolved` | `"light" \| "dark"` | OS 설정에 대해 `"system"`을 해석한 후 실제 적용된 모드. |
| `setPreference` | `(pref: ThemePreference) => void` | 설정을 업데이트합니다. `localStorage`에 저장되고 즉시 적용됩니다. |
