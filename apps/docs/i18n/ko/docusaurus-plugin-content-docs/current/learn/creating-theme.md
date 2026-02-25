---
sidebar_position: 10
title: 커스텀 테마 만들기
description: 직접 컴포넌트 임포트와 Tailwind CSS를 사용하여 커스텀 Noxion 테마를 만들고 배포하세요.
---

# 커스텀 테마 만들기

이 가이드에서는 npm 패키지로 공유할 수 있는 재사용 가능한 Noxion 테마를 만드는 과정을 안내합니다.

---

## 1단계: 테마 스캐폴딩

```bash
bun create noxion my-theme --theme
```

다음이 생성됩니다:

```
my-theme/
├── src/
│   ├── index.ts            # 컴포넌트, 레이아웃, 템플릿을 re-export
│   ├── components/         # React 컴포넌트 (Header, Footer, PostCard 등)
│   ├── layouts/            # 레이아웃 컴포넌트 (BaseLayout, BlogLayout)
│   └── templates/          # 페이지 템플릿 (HomePage, PostPage 등)
├── styles/
│   ├── tailwind.css        # 테마 변수가 포함된 Tailwind CSS 진입점
│   └── theme.css           # 추가 CSS 변수 오버라이드
├── package.json
└── tsconfig.json
```

---

## 2단계: Tailwind CSS 설정

테마의 `styles/tailwind.css`가 Tailwind 진입점입니다. 다음을 포함해야 합니다:

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@source "../src/**/*.{ts,tsx}";

:root {
  --color-primary: #8b5cf6;
  --color-primary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #737373;
  --color-border: #e5e5e5;
  --color-card: #ffffff;
  --color-card-foreground: #171717;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --width-content: 1080px;
  --radius-default: 0.5rem;
}

[data-theme="dark"] {
  --color-background: #0f0f23;
  --color-foreground: #ededed;
  --color-card: #1e1e3f;
  --color-border: #2a2a2a;
  --color-muted: #1a1a1a;
}
```

핵심 사항:

- **`@custom-variant dark`** — `dark:` Tailwind 유틸리티를 `[data-theme="dark"]`에 매핑하여, OS 미디어 쿼리 대신 테마 토글에 반응하도록 합니다.
- **`@source`** — Tailwind에게 테마의 소스 파일에서 클래스 이름을 스캔하도록 지시합니다.
- **CSS 변수** — 라이트와 다크 모드 모두의 디자인 토큰을 정의합니다.

### 패키지 내보내기

Tailwind 진입점을 내보내도록 `package.json`을 설정합니다:

```json
{
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./styles": "./styles/theme.css",
    "./styles/tailwind": "./styles/tailwind.css"
  },
  "sideEffects": ["styles/**/*.css"]
}
```

---

## 3단계: 컴포넌트 만들기

테마 컴포넌트는 Tailwind 유틸리티 클래스를 사용하는 표준 React 컴포넌트입니다. `@noxion/renderer`에서 prop 타입을 임포트합니다:

```tsx
// src/components/Header.tsx
import type { HeaderProps } from "@noxion/renderer";

export function Header({ siteName, navigation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {siteName}
        </a>
        <nav className="flex items-center gap-6">
          {navigation?.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-gray-700 dark:text-gray-300">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

### 필수 내보내기

테마는 다음 컴포넌트, 레이아웃, 템플릿을 내보내야 합니다:

| 카테고리 | 필수 내보내기 |
|----------|--------------|
| **컴포넌트** | `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter` |
| **레이아웃** | `BaseLayout`, `BlogLayout`, `DocsLayout` |
| **템플릿** | `HomePage`, `PostPage`, `ArchivePage`, `TagPage`, `DocsPage` |

모든 prop 타입은 `@noxion/renderer`에서 내보냅니다.

---

## 4단계: 기본 테마 위에 구축하기

모든 컴포넌트를 처음부터 만들 필요는 없습니다. `@noxion/theme-default`에서 컴포넌트를 임포트하고 re-export한 다음, 변경하고 싶은 것만 오버라이드하세요:

```ts
// src/components/index.ts

// 기본 테마의 대부분 컴포넌트를 재사용
export { Footer, TOC, Search, TagFilter, ThemeToggle, EmptyState,
  NotionPage, DocsSidebar, DocsBreadcrumb, PortfolioProjectCard,
  PortfolioFilter } from "@noxion/theme-default";

// 변경하고 싶은 컴포넌트만 직접 만들기
export { Header } from "./Header";
export { PostCard } from "./PostCard";
// ...
```

---

## 5단계: 전체 내보내기

테마의 진입점(`src/index.ts`)에서 모든 컴포넌트를 re-export합니다:

```ts
// src/index.ts
export * from "./components";
export * from "./layouts";
export * from "./templates";
```

---

## 6단계: 배포

```bash
npm publish
```

사용자가 테마를 설치하고 사용합니다:

```bash
bun add noxion-theme-midnight
```

```tsx
// app/layout.tsx
import "noxion-theme-midnight/styles/tailwind";

// app/site-layout.tsx
import { BlogLayout, Header, Footer } from "noxion-theme-midnight";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogLayout
      slots={{
        header: () => <Header siteName="내 블로그" />,
        footer: () => <Footer siteName="내 블로그" />,
      }}
    >
      {children}
    </BlogLayout>
  );
}
```

---

## 테마 메타데이터

테마에 검색과 표시를 위한 메타데이터를 포함할 수 있습니다:

```ts
interface NoxionThemeMetadata {
  description?: string;
  author?: string;
  version?: string;
  preview?: string;
}
```
