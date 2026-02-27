---
sidebar_position: 13
title: 문제 해결
description: "Notion API, 빌드, 이미지, ISR 등 Noxion에서 발생하는 일반적인 문제에 대한 해결 방법입니다."
---

이 가이드는 Noxion을 설정하거나 실행할 때 발생하는 일반적인 문제에 대한 해결 방법을 제공합니다. 여기에 나열되지 않은 오류가 발생하면 브라우저 콘솔과 서버 로그에서 구체적인 오류 메시지를 확인하십시오.

---

## Notion API 문제

### 페이지가 나타나지 않거나 사이트가 비어 있음

| 원인 | 해결 방법 |
| :--- | :--- |
| 잘못된 `NOTION_PAGE_ID` | ID가 사이트의 루트 페이지와 일치하는지 확인하십시오. 32자리의 문자열이어야 합니다. |
| 페이지가 공유되지 않음 | `NOTION_TOKEN`을 사용하지 않는 경우 페이지가 "Public" 상태여야 합니다. 토큰을 사용하는 경우 통합(Integration)이 페이지에 초대되어야 합니다. |
| 토큰 없이 비공개 페이지 접근 | 페이지가 비공개인 경우 환경 변수에 `NOTION_TOKEN`이 설정되어 있는지 확인하십시오. |

### "Unauthorized" (401) 오류

**문제**: 빌드가 실패하거나 페이지에서 401 오류가 반환됩니다.
**원인**: `NOTION_TOKEN`이 유효하지 않거나 만료되었거나, 통합에 특정 페이지에 대한 액세스 권한이 부여되지 않았습니다.
**해결 방법**:
1. Notion Developers 포털에서 토큰을 확인하십시오.
2. Notion의 루트 페이지에서 "..." 메뉴를 클릭하고 "연결 대상"으로 이동하여 해당 통합을 선택하십시오.

### 오래된 콘텐츠 (Stale content)

**문제**: Notion에서의 변경 사항이 라이브 사이트에 반영되지 않습니다.
**원인**: ISR (Incremental Static Regeneration) 캐시가 아직 만료되지 않았거나 재검증 트리거가 실패했습니다.
**해결 방법**:
1. `revalidate` 간격(기본 3600초)이 지날 때까지 기다리십시오.
2. 재검증 엔드포인트가 구성된 경우 수동 재검증을 트리거하십시오.
3. 호스팅 제공업체(예: Vercel)가 `Cache-Control` 헤더를 올바르게 처리하고 있는지 확인하십시오.

---

## 빌드 문제

### "Cannot find module" 오류

**문제**: 모듈 해석 오류로 인해 빌드가 실패합니다.
**원인**: 종속성이 누락되었거나 lockfile이 손상되었습니다.
**해결 방법**:
1. `node_modules`와 lockfile(`package-lock.json` 또는 `pnpm-lock.yaml`)을 삭제하십시오.
2. `npm install` 또는 `pnpm install`을 실행하십시오.
3. `.nvmrc` 또는 `package.json`에 지정된 Node.js 버전을 사용하고 있는지 확인하십시오.

### 타입 오류로 인한 빌드 실패

**문제**: `next build` 중 TypeScript 오류가 발생합니다.
**원인**: `@noxion` 패키지 간의 버전 불일치 또는 오래된 로컬 타입입니다.
**해결 방법**:
1. `package.json`의 모든 `@noxion/*` 패키지가 동일한 버전을 사용하는지 확인하십시오.
2. `npx tsc --noEmit`을 실행하여 특정 파일을 디버깅하십시오.
3. 커스텀 플러그인을 사용하는 경우 `NoxionPlugin` 인터페이스와 일치하는지 확인하십시오.

### 빌드 속도가 느림

**문제**: 빌드 프로세스가 몇 분씩 걸리거나 타임아웃이 발생합니다.
**원인**: 너무 많은 이미지를 다운로드하거나 너무 많은 Shiki 언어를 로드하고 있습니다.
**해결 방법**:
1. 이미지를 다운로드하는 대신 런타임에 프록시하도록 `NOXION_DOWNLOAD_IMAGES=false`로 설정하십시오.
2. `noxion.config.ts`의 `shiki.langs`를 실제로 사용하는 언어로만 제한하십시오.

---

## 런타임 문제

### 스타일이 적용되지 않은 콘텐츠의 깜빡임 (FOUC)

**문제**: 로드 시 사이트가 깜빡이거나 아주 짧은 순간 동안 잘못된 색상이 표시됩니다.
**원인**: 루트 레이아웃에 `ThemeScript` 컴포넌트가 누락되었거나 메인 콘텐츠 뒤에 배치되었습니다.
**해결 방법**:
`app/layout.tsx`의 `<body>` 태그 최상단에 `ThemeScript`를 배치하십시오.

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
```

### 다크 모드 작동 안 함

**문제**: 다크 모드 전환이 효과가 없습니다.
**원인**: `data-theme` 속성이 `<html>` 또는 `<body>` 태그에 적용되지 않았거나, Tailwind가 `data-theme` 선택자에 대해 구성되지 않았습니다.
**해결 방법**:
1. DOM을 검사하여 `<html data-theme="dark">`가 존재하는지 확인하십시오.
2. `tailwind.config.ts`에서 올바른 테마 전략을 확인하십시오.

### 수식이 렌더링되지 않음

**문제**: LaTeX 코드가 일반 텍스트로 나타납니다.
**원인**: KaTeX CSS가 누락되었거나 수학 플러그인이 활성화되지 않았습니다.
**해결 방법**:
1. 글로벌 CSS 파일이나 루트 레이아웃에서 KaTeX CSS를 임포트하십시오.
2. 프로세서 파이프라인에 `remark-math`와 `rehype-katex`가 포함되어 있는지 확인하십시오.

```css
/* globals.css */
@import 'katex/dist/katex.min.css';
```

---

## 배포 문제

### Vercel: ISR 작동 안 함

**문제**: 초기 빌드 이후 페이지가 업데이트되지 않습니다.
**원인**: Vercel 대시보드에 환경 변수가 누락되었거나 `revalidate` 상수가 재정의되었습니다.
**해결 방법**:
1. Vercel의 "Environment Variables" 탭을 확인하십시오.
2. "Production" 환경에 `NOTION_TOKEN`과 `NOTION_PAGE_ID`가 있는지 확인하십시오.
3. 재검증 중 "Function Invocation" 오류가 있는지 Vercel 로그를 확인하십시오.

### Docker: 이미지 깨짐

**문제**: 셀프 호스팅 시 이미지가 깨진 아이콘으로 표시됩니다.
**원인**: `next.config.ts`에 `remotePatterns`가 누락되었거나 Notion S3 프록시와의 CORS 문제입니다.
**해결 방법**:
`next.config.ts`에 Notion S3 도메인을 추가하십시오.

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
    { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
  ],
},
```

---

## 플러그인 문제

### 플러그인이 로드되지 않음

**문제**: 커스텀 블록이나 기능이 누락되었습니다.
**원인**: 플러그인 순서가 잘못되었거나 렌더러에서 플러그인을 임포트하지 않았습니다.
**해결 방법**:
1. `noxion.config.ts`에서 플러그인이 내보내졌는지 확인하십시오.
2. 순서를 확인하십시오. 플러그인은 순차적으로 처리되므로, 일반적인 플러그인이 커스텀 플러그인보다 먼저 특정 블록을 처리해버릴 수 있습니다.

### 분석 도구(Analytics) 추적 안 함

**문제**: 분석 대시보드에 데이터가 나타나지 않습니다.
**원인**: `NODE_ENV`가 `production`이 아니거나 추적 ID에 `NEXT_PUBLIC_` 접두사가 누락되었습니다.
**해결 방법**:
1. 환경 변수 이름이 `NEXT_PUBLIC_GA_ID`(또는 유사한 이름)인지 확인하십시오.
2. 대부분의 분석 플러그인은 데이터 오염을 방지하기 위해 개발 모드에서 비활성화됩니다. 프로덕션 빌드에서 테스트하십시오.

:::warning
분석 스크립트가 실제로 요청되고 있는지 항상 브라우저의 Network 탭을 확인하십시오.
:::
