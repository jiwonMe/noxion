---
title: ThemeProvider
description: "@noxion/renderer ThemeProvider, 테마 컨트랙트 훅, useThemePreference"
---

# `<NoxionThemeProvider />`

```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
```

모든 Noxion 컴포넌트에 테마 컨트랙트와 색상 모드 컨텍스트를 제공합니다. 전체 앱(또는 최소한 테마 인식 기능을 사용하는 모든 컴포넌트)을 감싸야 합니다.

생성된 앱에서는 `app/providers.tsx`에 이미 설정되어 있습니다.

---

## Props

| Prop | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| `themeContract` | `NoxionThemeContract` | ✅ | — | 컴포넌트, 레이아웃, 템플릿을 제공하는 테마 컨트랙트. |
| `defaultMode` | `ThemeMode` | — | `"system"` | 초기 색상 모드. `config.defaultTheme`과 일치해야 합니다. |
| `children` | `ReactNode` | ✅ | — | 앱 트리. |

---

## 설정

```tsx
// app/providers.tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { defaultThemeContract } from "@noxion/theme-default";
import { siteConfig } from "@/lib/config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NoxionThemeProvider
      themeContract={defaultThemeContract}
      defaultMode={siteConfig.defaultTheme}
    >
      {children}
    </NoxionThemeProvider>
  );
}
```

```tsx
// app/layout.tsx
import { ThemeScript } from "./theme-script";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### `suppressHydrationWarning`은 왜 필요한가요?

`<ThemeScript>`는 React가 하이드레이션하기 전에 `<html>`에 `data-theme="light"` 또는 `data-theme="dark"`를 설정합니다. 이로 인해 서버 렌더링된 HTML(`data-theme` 속성 없음)과 클라이언트 사이드 DOM(`data-theme` 포함) 사이에 불일치가 발생합니다. React는 일반적으로 이 하이드레이션 불일치에 대해 경고하므로, `suppressHydrationWarning`으로 이를 무시합니다.

이것은 테마 시스템에서 잘 알려진 패턴입니다. [React 문서의 suppressHydrationWarning](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)을 참조하세요.

---

## `useThemeContract()`

활성 **테마 컨트랙트** 객체를 반환합니다.

### 시그니처

```ts
function useThemeContract(): NoxionThemeContract
```

### 반환값

`name`, `metadata`, `components`, `layouts`, `templates`, `supports`를 포함한 전체 `NoxionThemeContract`.

### 사용법

```tsx
"use client";
import { useThemeContract } from "@noxion/renderer";

function ThemeInfo() {
  const contract = useThemeContract();
  return <p>활성 테마: {contract.name}</p>;
}
```

---

## `useThemeComponent(name)`

활성 테마 컨트랙트에서 특정 컴포넌트를 반환합니다.

### 시그니처

```ts
function useThemeComponent<K extends keyof NoxionThemeContractComponents>(
  name: K
): NoxionThemeContractComponents[K]
```

### 사용법

```tsx
"use client";
import { useThemeComponent } from "@noxion/renderer";

function MyPage({ posts }) {
  const PostList = useThemeComponent("PostList");
  const Header = useThemeComponent("Header");

  return (
    <>
      <Header siteName="My Blog" />
      <PostList posts={posts} />
    </>
  );
}
```

사용 가능한 컴포넌트 이름: `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter`.

---

## `useThemeLayout(name)`

활성 테마 컨트랙트에서 레이아웃 컴포넌트를 반환합니다.

### 시그니처

```ts
function useThemeLayout<K extends keyof NoxionThemeContractLayouts>(
  name: K
): NoxionThemeContractLayouts[K]
```

### 사용법

```tsx
"use client";
import { useThemeLayout } from "@noxion/renderer";

function MyPage({ children }) {
  const BlogLayout = useThemeLayout("blog");
  return <BlogLayout slots={{}}>{children}</BlogLayout>;
}
```

사용 가능한 레이아웃 이름: `base`, `blog`, `docs` (선택), `magazine` (선택).

---

## `useThemeTemplate(name)`

활성 테마 컨트랙트에서 템플릿 컴포넌트를 반환합니다.

### 시그니처

```ts
function useThemeTemplate<K extends keyof NoxionThemeContractTemplates>(
  name: K
): NoxionThemeContractTemplates[K] | undefined
```

### 사용법

```tsx
"use client";
import { useThemeTemplate } from "@noxion/renderer";

function RenderPage({ data }) {
  const HomePage = useThemeTemplate("home");
  if (!HomePage) return null;
  return <HomePage data={data} />;
}
```

사용 가능한 템플릿 이름: `home`, `post`, `archive` (선택), `tag` (선택), `docs` (선택), `portfolioGrid` (선택), `portfolioProject` (선택).

---

## `useThemePreference()`

사용자의 **테마 설정**("`system`" 포함)과 이를 변경하는 함수를 반환합니다.

### 시그니처

```ts
function useThemePreference(): {
  mode: ThemeMode;         // "light" | "dark" | "system"
  setMode: (mode: ThemeMode) => void;
}
```

### 반환값

| 속성 | 타입 | 설명 |
|------|------|------|
| `mode` | `ThemeMode` | 사용자의 현재 설정. OS 설정을 따르는 경우 `"system"`. |
| `setMode` | `(mode: ThemeMode) => void` | 설정 업데이트. `localStorage`에 저장되고 즉시 적용됩니다. |

### 사용법

```tsx
"use client";
import { useThemePreference } from "@noxion/renderer";
import type { ThemeMode } from "@noxion/core";

function ThemeToggle() {
  const { mode, setMode } = useThemePreference();

  const cycleTheme = () => {
    const order: ThemeMode[] = ["light", "dark", "system"];
    const currentIndex = order.indexOf(mode);
    setMode(order[(currentIndex + 1) % order.length]);
  };

  return (
    <button onClick={cycleTheme} aria-label={`현재 테마: ${mode}`}>
      {mode === "light" ? "☀️" : mode === "dark" ? "🌙" : "💻"}
    </button>
  );
}
```

### 지속성

`setMode()`는 `localStorage`의 `"noxion-theme"` 키에 설정을 저장합니다. 이후 페이지 로드 시 `<ThemeScript>`가 이 키를 읽어 React 하이드레이션 전에 설정을 적용합니다.

---

## 테마 해석 로직

전체 테마 해석 흐름:

```
1. 사용자가 페이지 방문
2. <ThemeScript>가 <head>에서 동기적으로 실행:
   a. localStorage["noxion-theme"] 확인
   b. 설정된 경우: 해당 값 사용 ("light" 또는 "dark")
   c. "system"이거나 미설정: window.matchMedia("(prefers-color-scheme: dark)") 확인
   d. <html data-theme="light|dark"> 설정
3. React 하이드레이션 — <NoxionThemeProvider>가 <html>에서 data-theme 읽기
4. 사용자가 토글 클릭 → setMode()가 localStorage와 data-theme 업데이트
5. CSS가 [data-theme="dark"] 선택자에 반응
```

이 아키텍처는 사용자의 설정이나 네트워크 속도에 관계없이 FOUC(스타일 미적용 콘텐츠 깜빡임)가 발생하지 않도록 보장합니다.

### 미디어 쿼리 반응성

`mode === "system"`일 때, 테마는 실시간 OS 설정 변경에 반응합니다:

```ts
// NoxionThemeProvider 내부
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (mode === "system") {
    applyTheme(e.matches ? "dark" : "light");
  }
});
```

이는 사용자가 블로그를 보는 중(`mode === "system"` 상태)에 OS를 라이트에서 다크 모드로 전환하면, 페이지 새로고침 없이 블로그가 자동으로 업데이트된다는 의미입니다.
