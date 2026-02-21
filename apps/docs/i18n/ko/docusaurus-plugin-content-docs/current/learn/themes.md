---
sidebar_position: 7
title: 테마
description: Noxion 블로그의 디자인을 커스터마이징하세요.
---

# 테마

Noxion은 **CSS 변수** 기반 테마를 사용합니다 — 색상을 바꾸는 데 빌드 과정이 필요 없습니다.

## 색상 모드

세 가지 모드를 지원합니다: `"light"`, `"dark"`, `"system"` (OS 환경설정 따름).

```ts
// noxion.config.ts
export default defineConfig({
  defaultTheme: "system",
  // ...
});
```

테마 토글 컴포넌트는 기본 레이아웃에 포함되어 있습니다.

## CSS 변수

전역 CSS에서 원하는 변수를 오버라이드해 디자인을 커스터마이징하세요:

```css
/* globals.css */
:root {
  --noxion-primary: #2563eb;
  --noxion-background: #ffffff;
  --noxion-foreground: #0a0a0a;
  --noxion-muted: #f5f5f5;
  --noxion-mutedForeground: #737373;
  --noxion-card: #ffffff;
  --noxion-cardForeground: #0a0a0a;
  --noxion-border: #e5e5e5;
  --noxion-border-radius: 0.5rem;
  --noxion-font-sans: system-ui, -apple-system, sans-serif;
}

[data-theme="dark"] {
  --noxion-background: #0a0a0a;
  --noxion-foreground: #fafafa;
  --noxion-card: #1a1a1a;
  --noxion-border: #2a2a2a;
}
```

## FOUC 방지

`<head>`에 주입되는 `ThemeScript` 컴포넌트가 React 하이드레이션 전에 `localStorage`를 읽어 스타일 깜빡임(FOUC)을 방지합니다:

```tsx
// layout.tsx
import { ThemeScript } from "./theme-script";

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
        {/* ... */}
      </head>
      <body>{children}</body>
    </html>
  );
}
```
