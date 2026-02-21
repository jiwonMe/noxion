---
sidebar_position: 5
title: 이미지 최적화
description: Noxion이 Notion 이미지를 처리하는 방법
---

# 이미지 최적화

## 기본값: next/image 프록시

Noxion은 기본적으로 **Notion 이미지 프록시**(`notion.so/image/`)를 통해 이미지를 서빙하고, Next.js Image로 실시간 최적화합니다:

- AVIF 및 WebP 자동 변환
- 반응형 `srcset` 자동 생성
- Lazy loading 및 blur placeholder
- Vercel 또는 호스팅 환경의 CDN 캐싱

이 프록시 URL은 **만료되지 않습니다** — Notion의 presigned S3 URL(~1시간 후 만료)과 달리 영구적으로 유효합니다.

```ts
// next.config.ts — create-noxion이 자동으로 설정
images: {
  formats: ["image/avif", "image/webp"],
  remotePatterns: [
    { protocol: "https", hostname: "www.notion.so" },
    { protocol: "https", hostname: "file.notion.so" },
    // ...
  ],
}
```

## 옵션: 빌드타임 다운로드

Notion 인프라에서 완전히 독립하려면 다음을 설정하세요:

```bash
# .env
NOXION_DOWNLOAD_IMAGES=true
```

활성화 시 (프로덕션 빌드에서만):
1. 빌드 중 이미지를 `public/images/`에 다운로드
2. `mapImages()`가 모든 URL을 로컬 경로로 재작성
3. Next.js가 정적 에셋으로 이미지 서빙 — 런타임 외부 의존성 없음

개발 환경에서는 이 설정과 무관하게 항상 프록시를 사용합니다.

## 커버 이미지

포스트 커버 이미지는 `notion-utils`의 `defaultMapImageUrl()`을 사용합니다. 이 함수가 `attachment:` 내부 참조를 올바른 프록시 URL로 변환합니다. `fetchBlogPosts()` 내 데이터 페치 시점에 실행됩니다.
