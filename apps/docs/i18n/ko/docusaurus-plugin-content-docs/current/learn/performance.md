---
sidebar_position: 12
title: 성능 최적화
description: Core Web Vitals, 빠른 로딩 및 효율적인 렌더링을 위해 Noxion 사이트를 최적화합니다.
---

Noxion은 속도를 위해 설계되었습니다. Next.js App Router와 Notion API를 효율적으로 활용하여 대부분의 사이트가 별도의 설정 없이도 완벽에 가까운 성능 점수를 기록합니다. 이 가이드는 사이트가 성장함에 따라 성능을 유지하고 개선하는 방법을 다룹니다.

---

## Core Web Vitals 기준

기본적인 Noxion 설치 시 일반적으로 다음과 같은 Lighthouse 점수를 얻을 수 있습니다.

| 지표 | 목표 점수 | 설명 |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | < 1.2s | 로딩 성능을 측정합니다. |
| **FID/INP** (First Input Delay) | < 100ms | 상호작용성을 측정합니다. |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 시각적 안정성을 측정합니다. |
| **SEO** | 100 | 표준 SEO 권장 사항을 준수합니다. |

Noxion 사이트의 일반적인 Lighthouse 진단 결과는 모든 카테고리에서 95-100점 사이를 기록합니다.

---

## ISR 튜닝

Incremental Static Regeneration (ISR)을 사용하면 전체 사이트를 다시 빌드하지 않고도 정적 콘텐츠를 업데이트할 수 있습니다.

### 재검증 간격 (Revalidate Interval)

기본 재검증 간격은 3600초(1시간)입니다. 페이지 구성이나 환경 변수에서 이를 조정할 수 있습니다.

```typescript
// apps/web/app/[...slug]/page.tsx
export const revalidate = 3600; // 기본값
```

| 간격 | 사용 사례 | 트레이드오프 |
| :--- | :--- | :--- |
| `60` | 빈번한 업데이트 | 낮은 CDN 캐시 히트율, 높은 API 부하. |
| `3600` | 일반적인 블로그/문서 | 성능과 최신성의 균형. |
| `86400` | 정적 아카이브 | 최대 CDN 캐싱, 수동 업데이트 필요. |

### 온디맨드 재검증 (On-Demand Revalidation)

즉각적인 업데이트를 위해 웹훅을 통한 온디맨드 재검증을 사용합니다. 이를 통해 Notion에서 변경이 발생한 정확한 시점에 콘텐츠를 최신 상태로 유지할 수 있으며, 더 긴 정적 TTL을 설정할 수 있습니다.

```typescript
// 재검증 트리거 예시
await fetch(`https://your-site.com/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`);
```

---

## 이미지 최적화

Noxion은 WebP/AVIF 변환 및 크기 조정을 포함한 자동 이미지 최적화를 위해 `next/image`를 사용합니다.

### Notion 프록시 URL

Notion의 기본 S3 URL은 서명된 URL이며 1시간 후에 만료됩니다. Noxion은 이러한 URL이 유효하게 유지되고 CDN에 캐시될 수 있도록 배포 환경을 통해 프록시 처리합니다.

### 빌드 시 다운로드

런타임 프록시를 피하기 위해 빌드 프로세스 중에 이미지를 다운로드하도록 선택할 수 있습니다.

```bash
# .env
NOXION_DOWNLOAD_IMAGES=true
```

:::note
이미지를 다운로드하면 빌드 시간이 늘어나지만, 이미지가 로컬 정적 자산으로 제공되므로 런타임 성능이 향상됩니다.
:::

---

## 코드 분할 (Code Splitting)

Next.js는 자동으로 코드를 작은 번들로 분할합니다. Noxion은 무거운 컴포넌트가 필요할 때만 로드되도록 하여 이를 확장합니다.

### 동적 임포트 (Dynamic Imports)

Mermaid나 차트와 같은 무거운 플러그인은 메인 번들에 포함되지 않습니다. 이러한 플러그인은 페이지에 특정 블록이 포함된 경우에만 로드되도록 동적 임포트를 사용합니다.

```typescript
import dynamic from 'next/dynamic';

const Mermaid = dynamic(() => import('./components/Mermaid'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />
});
```

---

## 폰트 최적화

폰트를 로컬에서 호스팅하려면 `next/font`를 사용합니다. 이는 레이아웃 시프트를 제거하고 Google Fonts에 대한 외부 요청을 없앱니다.

```typescript
// styles/fonts.ts
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

CSS 변수를 통해 테마 시스템과 통합합니다.

```css
:root {
  --font-sans: var(--font-inter);
}
```

---

## Shiki 성능

Noxion은 구문 강조를 위해 Shiki를 사용합니다. 클라이언트 측 하이라이터(Prism.js 등)와 달리 Shiki는 완전히 빌드 타임에 실행됩니다.

- **Zero Client JS**: 브라우저로 하이라이팅 로직이 전송되지 않습니다.
- **Dual-Theme CSS**: 라이트 테마와 다크 테마가 모두 HTML로 렌더링됩니다. CSS 변수가 가시성을 전환하여 테마 변경 시 깜빡임을 방지합니다.
- **언어 서브셋**: Shiki가 로드하는 언어를 제한하여 빌드 속도를 높입니다.

```typescript
// noxion.config.ts
export default {
  shiki: {
    langs: ['typescript', 'javascript', 'bash', 'json'],
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
};
```

---

## KaTeX 성능

수식은 빌드 또는 ISR 단계에서 `katex.renderToString`을 사용하여 정적 HTML 문자열로 렌더링됩니다.

- **런타임 파서 없음**: 브라우저는 순수 HTML과 CSS를 수신합니다.
- **빠른 렌더링**: 수식이 다른 콘텐츠와 함께 즉시 나타납니다.

:::tip
스타일이 적용되지 않은 수학 콘텐츠를 방지하려면 루트 레이아웃에 KaTeX CSS를 포함해야 합니다.
:::

---

## 지연 로딩 (Lazy Loading)

무거운 커스텀 블록의 경우 `createLazyBlock` 유틸리티를 사용합니다. 이는 `IntersectionObserver`를 사용하여 블록이 뷰포트에 들어올 때까지 컴포넌트 마운트를 지연시킵니다.

```typescript
import { createLazyBlock } from '@noxion/sdk';

const HeavyChart = createLazyBlock(() => import('./HeavyChart'));

export const blocks = {
  code: (props) => {
    if (props.language === 'chart') return <HeavyChart {...props} />;
    return <DefaultCode {...props} />;
  }
};
```

---

## 번들 분석

용량이 큰 종속성을 식별하려면 `@next/bundle-analyzer`를 사용합니다.

1. 패키지 설치: `npm install -D @next/bundle-analyzer`
2. 분석 실행: `ANALYZE=true npm run build`

이 명령은 JS 번들의 시각적 맵을 생성하여 동적 임포트로 이동해야 할 "새는" 종속성을 찾는 데 도움을 줍니다.

---

## Vercel 전용 최적화

Vercel에 배포하는 경우 Noxion은 다음 기능을 활용합니다.

- **Edge Functions**: 빠른 미들웨어 및 API 라우트.
- **Vercel 이미지 최적화**: 에지에서 자동 크기 조정 및 형식 변환.
- **글로벌 CDN**: 콘텐츠가 사용자 근처에 캐시됩니다.

---

## 셀프 호스팅 팁

자체 인프라(예: Docker + Nginx)에서 호스팅하는 경우 다음을 고려합니다.

1. **Nginx 캐싱**: 프록시에 대해 stale-while-revalidate 캐시 정책을 구현합니다.
2. **압축**: HTML, JS, CSS에 대해 Gzip 또는 Brotli를 활성화합니다.
3. **HTTP/2+**: 서버가 다중 로딩을 위해 HTTP/2 또는 HTTP/3를 지원하는지 확인합니다.
4. **이미지 프록시**: `NOXION_DOWNLOAD_IMAGES`를 사용하지 않는 경우 Sharp와 같은 전용 이미지 서비스나 외부 프록시를 사용합니다.

```nginx
# Nginx 압축 설정 예시
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
```
