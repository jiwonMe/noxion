---
sidebar_position: 10
title: 커스텀 테마 만들기
description: 계약 기반 테마 시스템을 사용하여 커스텀 Noxion 테마 패키지를 만들고 배포하세요.
---

# 커스텀 테마 만들기

이 가이드는 npm 패키지로 공유할 수 있는 재사용 가능한 Noxion 테마를 만드는 과정을 안내합니다.

---

## 1단계: 테마 스캐폴딩

```bash
bun create noxion my-theme --theme
```

다음이 생성됩니다:

```
my-theme/
├── src/
│   ├── index.ts            # 테마 계약 내보내기
│   ├── components/         # React 컴포넌트 (Header, Footer, PostCard 등)
│   ├── layouts/            # 레이아웃 컴포넌트 (BaseLayout, BlogLayout)
│   └── templates/          # 페이지 템플릿 (HomePage, PostPage 등)
├── styles/
│   └── theme.css           # CSS 변수 오버라이드
├── package.json
└── tsconfig.json
```

---

## 2단계: 테마 계약 정의

`src/index.ts`를 편집하여 테마 계약을 정의하세요. 테마 계약은 React 컴포넌트, 레이아웃, 템플릿을 묶습니다:

```ts
import { defineThemeContract } from "@noxion/renderer";
import type { NoxionThemeContract } from "@noxion/renderer";

import {
  Header, Footer, PostCard, FeaturedPostCard, PostList,
  HeroSection, TOC, Search, TagFilter, ThemeToggle,
  EmptyState, NotionPage, DocsSidebar, DocsBreadcrumb,
  PortfolioProjectCard, PortfolioFilter,
} from "./components";

import { BaseLayout, BlogLayout } from "./layouts";
import { HomePage, PostPage, ArchivePage, TagPage } from "./templates";

export const myThemeContract: NoxionThemeContract = defineThemeContract({
  name: "my-theme",

  metadata: {
    description: "커스텀 다크 테마",
    author: "Your Name",
    version: "1.0.0",
  },

  components: {
    Header, Footer, PostCard, FeaturedPostCard, PostList,
    HeroSection, TOC, Search, TagFilter, ThemeToggle,
    EmptyState, NotionPage, DocsSidebar, DocsBreadcrumb,
    PortfolioProjectCard, PortfolioFilter,
  },

  layouts: {
    base: BaseLayout,
    blog: BlogLayout,
  },

  templates: {
    home: HomePage,
    post: PostPage,
    archive: ArchivePage,
    tag: TagPage,
  },

  supports: ["blog", "docs"],
});
```

### 필수 컴포넌트

계약에는 `NoxionThemeContractComponents`에 나열된 모든 컴포넌트를 제공해야 합니다. 모든 prop 타입은 `@noxion/renderer`에서 내보내집니다.

---

## 3단계: CSS 오버라이드 추가 (선택사항)

시각적 커스터마이징을 위해 `styles/theme.css`를 편집하세요:

```css
:root {
  --noxion-primary: #8b5cf6;
  --noxion-primary-hover: #7c3aed;
  --noxion-border-radius: 0.75rem;
  --noxion-line-height-base: 1.8;
}

[data-theme="dark"] {
  --noxion-background: #0f0f23;
  --noxion-card: #1e1e3f;
}
```

---

## 4단계: 기본 테마 위에 구축

모든 컴포넌트를 처음부터 만들 필요가 없습니다. `@noxion/theme-default`에서 컴포넌트를 가져와 재사용하고, 변경하고 싶은 것만 오버라이드하세요:

```ts
// 기본 테마에서 대부분의 컴포넌트를 재사용
export { Footer, TOC, Search, TagFilter, ThemeToggle, EmptyState,
  NotionPage, DocsSidebar, DocsBreadcrumb, PortfolioProjectCard,
  PortfolioFilter } from "@noxion/theme-default";

// 변경하고 싶은 컴포넌트만 직접 만들기
export { Header } from "./Header";
export { PostCard } from "./PostCard";
```

---

## 5단계: 지원하는 페이지 타입 선언

`supports` 필드는 테마가 어떤 페이지 타입의 템플릿을 가지고 있는지 Noxion에 알려줍니다:

```ts
supports: ["blog", "docs", "portfolio"]
```

블로그 페이지만 지원하는 테마라면:

```ts
supports: ["blog"]
```

Noxion은 지원되지 않는 페이지 타입에 대해 기본 테마의 템플릿으로 폴백합니다.

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
// app/providers.tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { myThemeContract } from "noxion-theme-midnight";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NoxionThemeProvider themeContract={myThemeContract} defaultMode="system">
      {children}
    </NoxionThemeProvider>
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
