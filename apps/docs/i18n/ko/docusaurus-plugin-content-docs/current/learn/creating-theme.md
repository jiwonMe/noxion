---
sidebar_position: 10
title: 커스텀 테마 만들기
description: CSS 변수와 테마 상속을 사용하여 커스텀 Noxion 테마 패키지를 만들고 배포하세요.
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
│   └── index.ts            # 테마 패키지 내보내기
├── styles/
│   └── theme.css           # CSS 변수 오버라이드
├── package.json
└── tsconfig.json
```

---

## 2단계: 테마 정의

`src/index.ts`를 편집하여 테마 토큰을 설정하세요:

```ts
import type { NoxionThemePackage } from "@noxion/renderer";

const myTheme: NoxionThemePackage = {
  name: "noxion-theme-midnight",
  tokens: {
    colors: {
      primary: "#8b5cf6",
      primaryHover: "#7c3aed",
      background: "#0f0f23",
      foreground: "#e2e8f0",
      card: "#1e1e3f",
      cardForeground: "#e2e8f0",
      muted: "#2a2a5e",
      mutedForeground: "#94a3b8",
      border: "#334155",
    },
    fonts: {
      sans: '"Inter", system-ui, sans-serif',
      mono: '"JetBrains Mono", monospace',
    },
  },
  metadata: {
    name: "Midnight",
    author: "Your Name",
    version: "1.0.0",
    description: "A dark purple theme for Noxion",
  },
  supports: ["blog", "docs", "portfolio"],
};

export default myTheme;
```

### 토큰 레퍼런스

| 토큰 그룹 | 사용 가능한 토큰 |
|-----------|-----------------|
| `colors.primary` | 기본 강조 색상 (링크, 버튼) |
| `colors.primaryHover` | 기본 색상의 호버 상태 |
| `colors.background` | 페이지 배경 |
| `colors.foreground` | 메인 텍스트 색상 |
| `colors.card` | 카드/위젯 배경 |
| `colors.cardForeground` | 카드 위의 텍스트 |
| `colors.muted` | 미묘한 배경 (코드 블록 등) |
| `colors.mutedForeground` | 보조/비활성 텍스트 |
| `colors.border` | 기본 테두리 색상 |
| `fonts.sans` | 산세리프 폰트 스택 |
| `fonts.mono` | 모노스페이스 폰트 스택 |

---

## 3단계: CSS 오버라이드 추가 (선택사항)

더 세밀한 제어를 위해 `styles/theme.css`를 편집하세요:

```css
:root {
  --noxion-border-radius: 0.75rem;
  --noxion-line-height-base: 1.8;
}

[data-theme="dark"] {
  --noxion-background: #0f0f23;
  --noxion-card: #1e1e3f;
}
```

---

## 4단계: `extendTheme()`으로 상속 사용

처음부터 만들지 않고 기본 테마를 확장하세요:

```ts
import { extendTheme, themeDefault } from "@noxion/renderer";

const myTheme = extendTheme(themeDefault, {
  tokens: {
    colors: {
      primary: "#8b5cf6",
      primaryHover: "#7c3aed",
    },
  },
  metadata: {
    name: "Midnight",
    author: "Your Name",
    version: "1.0.0",
  },
});

export default myTheme;
```

`extendTheme()`은 딥 머지를 수행합니다 — 변경하고 싶은 토큰만 지정하면 됩니다.

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

```ts
// noxion.config.ts
import { defineConfig } from "@noxion/core";
import midnightTheme from "noxion-theme-midnight";

export default defineConfig({
  theme: midnightTheme,
  // ...
});
```

---

## 테마 메타데이터

테마에 검색과 표시를 위한 메타데이터를 포함할 수 있습니다:

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
