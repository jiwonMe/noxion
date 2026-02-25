---
title: 테마 훅
description: "@noxion/renderer 테마 훅 — 색상 모드 관리를 위한 useThemePreference"
---

# 테마 훅

```tsx
import { useThemePreference } from "@noxion/renderer";
```

`@noxion/renderer`는 색상 모드(라이트/다크/시스템) 관리를 위한 `useThemePreference()` 훅을 제공합니다. 테마 컴포넌트, 레이아웃, 템플릿은 테마 패키지에서 직접 임포트합니다 — 프로바이더가 필요 없습니다.

---

## 설정

```tsx
// app/layout.tsx
import "@noxion/theme-default/styles/tailwind";
import "./globals.css";

function ThemeScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('noxion-theme');
        var theme = stored || 'system';
        if (theme === 'system') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        document.documentElement.dataset.theme = theme;
      } catch (e) {}
    })();
  `;
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

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

### `suppressHydrationWarning`이 필요한 이유

`<ThemeScript>`는 React가 하이드레이션하기 전에 `<html>`에 `data-theme="light"` 또는 `data-theme="dark"`를 설정합니다. 이로 인해 서버 렌더링된 HTML(`data-theme` 속성 없음)과 클라이언트 사이드 DOM(`data-theme` 포함) 사이에 불일치가 발생합니다. React는 일반적으로 이 하이드레이션 불일치에 대해 경고하므로, `suppressHydrationWarning`으로 이를 무시합니다.

이는 테마 시스템의 잘 알려진 패턴입니다. [React suppressHydrationWarning 문서](https://react.dev/reference/react-dom/client/hydrateRoot#suppressing-unavoidable-hydration-mismatch-errors)를 참조하세요.

---

## `useThemePreference()`

사용자의 **설정 값** (`"system"` 포함), 해석된 모드, 그리고 변경 함수를 반환합니다.

### 시그니처

```ts
function useThemePreference(): {
  preference: ThemePreference;   // "light" | "dark" | "system"
  resolved: "light" | "dark";   // 실제 적용된 모드
  setPreference: (pref: ThemePreference) => void;
}
```

### 반환값

| 속성 | 타입 | 설명 |
|------|------|------|
| `preference` | `ThemePreference` | 사용자의 저장된 설정. OS 설정을 따르는 경우 `"system"`. |
| `resolved` | `"light" \| "dark"` | OS 설정에 대해 `"system"`을 해석한 후 실제 적용된 모드. |
| `setPreference` | `(pref: ThemePreference) => void` | 설정을 업데이트합니다. `localStorage`에 저장되고 즉시 적용됩니다. |

### 사용법

```tsx
"use client";
import { useThemePreference } from "@noxion/renderer";
import type { ThemePreference } from "@noxion/renderer";

function ThemeToggle() {
  const { preference, setPreference } = useThemePreference();

  const cycleTheme = () => {
    const order: ThemePreference[] = ["system", "light", "dark"];
    const currentIndex = order.indexOf(preference);
    setPreference(order[(currentIndex + 1) % order.length]);
  };

  return (
    <button onClick={cycleTheme} aria-label={`현재 테마: ${preference}`}>
      {preference === "light" ? "☀️" : preference === "dark" ? "🌙" : "💻"}
    </button>
  );
}
```

### 저장

`setPreference()`는 `localStorage`의 `"noxion-theme"` 키에 설정을 저장합니다. 이후 페이지 로드 시 `<ThemeScript>`가 이 키를 읽어 React 하이드레이션 전에 설정을 적용합니다.

---

## 테마 해석 로직

전체 테마 해석 흐름:

```
1. 사용자가 페이지 방문
2. <ThemeScript>가 <head>에서 동기적으로 실행:
   a. localStorage["noxion-theme"] 확인
   b. 설정되어 있으면: 그 값 사용 ("light" 또는 "dark")
   c. "system"이거나 미설정: window.matchMedia("(prefers-color-scheme: dark)") 확인
   d. <html data-theme="light|dark"> 설정
3. React 하이드레이션 — useThemePreference()가 <html>에서 data-theme 읽기
4. 사용자가 토글 클릭 → setPreference()가 localStorage와 data-theme 업데이트
5. CSS가 [data-theme="dark"] 선택자에 반응
6. Tailwind dark: 유틸리티가 @custom-variant를 통해 활성화
```

이 아키텍처는 사용자의 설정이나 네트워크 속도에 관계없이 FOUC(스타일이 적용되지 않은 콘텐츠 깜빡임)가 전혀 없도록 보장합니다.

### 미디어 쿼리 반응성

`preference === "system"`일 때, 테마는 실시간 OS 설정 변경에 반응합니다:

```ts
// useThemePreference() 내부
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
mediaQuery.addEventListener("change", (e) => {
  if (preference === "system") {
    applyTheme(e.matches ? "dark" : "light");
  }
});
```

이는 사용자가 블로그에서 OS를 라이트에서 다크 모드로 전환하면(`preference === "system"` 상태에서), 페이지 리로드 없이 블로그가 자동으로 업데이트된다는 의미입니다.
