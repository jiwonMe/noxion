---
sidebar_position: 10
title: 사용자 정의 테마 만들기
description: 컴포넌트 직접 임포트와 Tailwind CSS를 사용하여 사용자 정의 Noxion 테마를 구축하고 배포합니다.
---

# 사용자 정의 테마 만들기

이 가이드는 npm 패키지로 공유할 수 있는 재사용 가능한 Noxion 테마를 만드는 과정을 안내합니다.

---

## Step 1: 테마 스캐폴딩

```bash
bun create noxion my-theme --theme
```

다음 파일들이 생성됩니다:

```
my-theme/
├── src/
│   ├── index.ts            # 컴포넌트, 레이아웃, 템플릿을 다시 내보냅니다 (re-export)
│   ├── components/         # React 컴포넌트 (Header, Footer, PostCard 등)
│   ├── layouts/            # 레이아웃 컴포넌트 (BaseLayout, BlogLayout)
│   └── templates/          # 페이지 템플릿 (HomePage, PostPage 등)
├── styles/
│   ├── tailwind.css        # 테마 변수가 포함된 Tailwind CSS 진입점
│   └── theme.css           # 추가적인 CSS 변수 오버라이드
├── package.json
└── tsconfig.json
```

---

## Step 2: Tailwind CSS 설정

테마의 `styles/tailwind.css` 파일은 Tailwind의 진입점입니다. 다음 내용을 포함해야 합니다:

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

주요 사항:

- **`@custom-variant dark`**: `dark:` Tailwind 유틸리티를 `[data-theme="dark"]`에 매핑하여, OS 미디어 쿼리 대신 테마 토글에 반응하도록 합니다.
- **`@source`**: Tailwind가 클래스 이름을 스캔할 테마 소스 파일의 위치를 지정합니다.
- **CSS 변수**: 라이트 모드와 다크 모드 각각에 대한 테마 디자인 토큰을 정의합니다.

### 패키지 내보내기 설정

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

## Step 3: 컴포넌트 만들기

테마 컴포넌트는 Tailwind 유틸리티 클래스를 사용하는 표준 React 컴포넌트입니다. `@noxion/renderer`에서 prop 타입을 임포트하여 사용합니다:

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

### 필수 내보내기 항목

테마는 다음 컴포넌트, 레이아웃, 템플릿을 반드시 내보내야 합니다:

| 카테고리 | 필수 내보내기 항목 |
|----------|-----------------|
| **컴포넌트** | `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter` |
| **레이아웃** | `BaseLayout`, `BlogLayout`, `DocsLayout` |
| **템플릿** | `HomePage`, `PostPage`, `ArchivePage`, `TagPage`, `DocsPage` |

모든 prop 타입은 `@noxion/renderer`에서 제공됩니다.

---

## 반응형 디자인 패턴

Noxion 테마는 모바일 우선(mobile-first) 방식을 사용합니다. Tailwind의 반응형 수식어(`sm:`, `md:`, `lg:`, `xl:`)를 사용하여 기기별로 레이아웃을 조정하십시오.

### 브레이크포인트 전략

| 브레이크포인트 | 너비 | 용도 |
|------------|-------|-------|
| `sm` | 640px | 소형 태블릿 |
| `md` | 768px | 태블릿 |
| `lg` | 1024px | 노트북 |
| `xl` | 1280px | 데스크톱 |

### 사이드바 동작

문서 레이아웃에서 사이드바는 모바일에서 드로어(drawer) 형태나 숨겨진 메뉴로 접혀야 합니다.

```tsx
export function DocsLayout({ children, slots }: DocsLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* 모바일 헤더 */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      </div>

      {/* 사이드바 */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {slots.sidebar?.()}
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

:::tip
조건부 클래스를 깔끔하게 관리하려면 `@noxion/renderer`에서 제공하는 `cn` 유틸리티를 사용하십시오.
:::

### 그리드/리스트 전환

포트폴리오의 경우, 모바일에서는 단일 열 리스트로 보여주고 데스크톱에서는 다중 열 그리드로 전환하고 싶을 수 있습니다.

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {projects.map(project => (
    <PortfolioProjectCard key={project.id} {...project} />
  ))}
</div>
```

---

## Step 4: 기본 테마를 기반으로 구축하기

모든 컴포넌트를 처음부터 만들 필요는 없습니다. `@noxion/theme-default`에서 컴포넌트를 임포트하여 다시 내보낸 후, 사용자 정의하고 싶은 컴포넌트만 오버라이드하십시오:

```ts
// src/components/index.ts

// 기본 테마의 대부분 컴포넌트를 재사용합니다
export { Footer, TOC, Search, TagFilter, ThemeToggle, EmptyState,
  NotionPage, DocsSidebar, DocsBreadcrumb, PortfolioProjectCard,
  PortfolioFilter } from "@noxion/theme-default";

// 변경하고 싶은 컴포넌트만 직접 작성하여 내보냅니다
export { Header } from "./Header";
export { PostCard } from "./PostCard";
// ...
```

---

## 타이포그래피 시스템

Noxion 테마는 최종 사용자가 쉽게 오버라이드할 수 있도록 폰트 패밀리에 CSS 변수를 사용합니다.

### 폰트 변수

`styles/tailwind.css`에서 폰트 스택을 정의합니다:

```css
:root {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "Georgia", serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

### next/font 사용하기

테마가 Next.js 프로젝트에서 사용되는 경우, 루트 레이아웃에서 `next/font`를 이 변수들에 매핑할 수 있습니다:

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### 반응형 타이포그래피

가독성을 보장하기 위해 유동적인 타입 스케일이나 반응형 유틸리티 클래스를 사용하십시오.

| 요소 | 모바일 | 데스크톱 |
|---------|--------|---------|
| H1 | `text-3xl` | `text-5xl` |
| H2 | `text-2xl` | `text-3xl` |
| 본문 | `text-base` | `text-lg` |

```tsx
<h1 className="text-3xl font-bold leading-tight md:text-5xl">
  {title}
</h1>
```

:::note
접근성과 가독성을 위해 본문 텍스트의 줄 간격(line-height)을 1.5에서 1.6 사이로 유지하십시오.
:::

### 코드 폰트 설정

Shiki를 사용한 구문 강조의 경우, 코드 블록에 모노 폰트가 올바르게 적용되었는지 확인하십시오.

```css
pre, code {
  font-family: var(--font-mono);
}
```

---

## Step 5: 모든 항목 내보내기

테마의 진입점(`src/index.ts`)에서 모든 컴포넌트를 다시 내보냅니다:

```ts
// src/index.ts
export * from "./components";
export * from "./layouts";
export * from "./templates";
```

---

## 테마 테스트하기

배포하기 전에 다양한 콘텐츠 유형과 기기 크기에서 테마를 검증하십시오.

### 테마 개발 앱

`apps/theme-dev/` 디렉토리에는 테마 개발을 위한 특화된 환경이 포함되어 있습니다. 테마를 이 앱에 연결하여 실시간 변경 사항을 확인하십시오.

```bash
cd apps/theme-dev
bun link my-theme
bun run dev
```

### 다크 모드 전환

모든 컴포넌트가 테마 전환을 매끄럽게 처리하는지 확인하십시오. 다음 항목들을 테스트하십시오:
- 배경색과 전경색의 대비.
- 다크 모드에서의 테두리 가시성.
- 이미지 불투명도 또는 필터링.

```css
/* 예시: 다크 모드에서 이미지 어둡게 하기 */
[data-theme="dark"] img {
  filter: brightness(0.8) contrast(1.2);
}
```

### 콘텐츠 유형 매트릭스

다음 콘텐츠 시나리오에서 테마를 검증하십시오:

| 콘텐츠 유형 | 테스트할 주요 컴포넌트 |
|--------------|------------------------|
| **블로그** | 긴 텍스트, 코드 블록, 캡션이 있는 이미지, 인용구. |
| **문서** | 중첩된 내비게이션, 목차(TOC), 콜아웃, API 테이블. |
| **포트폴리오** | 이미지 갤러리, 프로젝트 메타데이터, 외부 링크. |

### 접근성 테스트

- **대비**: Lighthouse나 Axe와 같은 도구를 사용하여 WCAG AA 준수 여부를 확인하십시오.
- **키보드 내비게이션**: 모든 대화형 요소에 가시적인 포커스 상태가 있는지 확인하십시오.
- **스크린 리더**: 의미론적 HTML(`<nav>`, `<article>`, `<aside>`)을 사용하십시오.

:::warning
고대비 사용자 정의 대안을 제공하지 않고 브라우저 기본 포커스 링을 제거하지 마십시오.
:::

---

## Step 6: 배포하기

```bash
npm publish
```

사용자는 다음과 같이 테마를 설치하고 사용할 수 있습니다:

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
        header: () => <Header siteName="My Blog" />,
        footer: () => <Footer siteName="My Blog" />,
      }}
    >
      {children}
    </BlogLayout>
  );
}
```

---

## 테마 설정 패턴

사용자가 소스 코드를 수정하지 않고도 테마를 유연하게 사용자 정의할 수 있도록 만드십시오.

### CSS 변수 오버라이드

사용자는 자신의 글로벌 스타일시트에서 CSS 변수를 제공하여 테마를 오버라이드할 수 있습니다.

```css
/* 사용자의 global.css */
:root {
  --color-primary: #3b82f6;
  --radius-default: 0px;
}
```

### 컬러 프리셋

사용자가 설정 옵션을 통해 전환할 수 있는 여러 내장 컬러 스키마를 제공하십시오.

```ts
// src/presets.ts
export const presets = {
  midnight: {
    '--color-background': '#0f172a',
    '--color-foreground': '#f8fafc',
  },
  forest: {
    '--color-background': '#064e3b',
    '--color-foreground': '#ecfdf5',
  }
};
```

### 테마 구성

기존 테마의 컴포넌트를 임포트하고 감싸는 방식으로 테마를 확장할 수 있습니다.

```tsx
import { Header as BaseHeader } from "@noxion/theme-default";

export function Header(props: HeaderProps) {
  return (
    <div className="border-t-4 border-primary">
      <BaseHeader {...props} />
    </div>
  );
}
```

---

## 고급: 사용자 정의 레이아웃

레이아웃은 페이지의 상위 수준 구조를 정의합니다.

### 슬롯(Slot) 시스템

Noxion은 레이아웃에 컴포넌트를 주입하기 위해 "슬롯" 패턴을 사용합니다. 이는 레이아웃을 특정 컴포넌트 구현으로부터 분리된 상태로 유지해 줍니다.

```tsx
interface LayoutProps {
  children: React.ReactNode;
  slots: {
    header: () => React.ReactNode;
    footer: () => React.ReactNode;
    sidebar?: () => React.ReactNode;
  };
}

export function BaseLayout({ children, slots }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {slots.header()}
      <div className="flex-1">
        {slots.sidebar && <aside>{slots.sidebar()}</aside>}
        <main>{children}</main>
      </div>
      {slots.footer()}
    </div>
  );
}
```

### 레이아웃 구성

복잡한 페이지 구조를 위해 여러 레이아웃을 결합하십시오. 예를 들어, `DocsLayout`은 `BaseLayout`을 감쌀 수 있습니다.

```tsx
export function DocsLayout({ children, slots }: DocsLayoutProps) {
  return (
    <BaseLayout
      slots={{
        header: slots.header,
        footer: slots.footer,
        sidebar: slots.sidebar,
      }}
    >
      <div className="prose dark:prose-invert max-w-none">
        {children}
      </div>
    </BaseLayout>
  );
}
```

---

## 디자인 시스템 통합

기존 브랜드의 테마를 구축하는 경우, 디자인 토큰을 직접 통합하십시오.

### 디자인 토큰

디자인 시스템의 토큰을 Noxion의 CSS 변수에 매핑하십시오.

| 토큰 카테고리 | Noxion 변수 |
|----------------|-----------------|
| 브랜드 프라이머리 | `--color-primary` |
| 표면 베이스 | `--color-background` |
| 텍스트 메인 | `--color-foreground` |
| 반경 라지 | `--radius-default` |

### Figma 통합

Figma에서 내보낼 때 Style Dictionary와 같은 도구를 사용하여 `theme.css` 파일을 자동으로 생성하십시오.

```json
{
  "color": {
    "primary": { "value": "{colors.blue.500}" },
    "background": { "value": "{colors.white}" }
  }
}
```

:::note
디자인 도구와 코드 간의 일관성은 장기적인 유지 관리를 위한 핵심입니다.
:::

---

## 테마 메타데이터

테마에는 검색 및 표시를 위한 메타데이터를 포함할 수 있습니다:

```ts
interface NoxionThemeMetadata {
  description?: string;
  author?: string;
  version?: string;
  preview?: string;
}
```
