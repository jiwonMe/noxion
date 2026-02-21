---
sidebar_position: 4
title: 설정
description: 전체 noxion.config.ts 레퍼런스
---

# 설정

모든 설정은 프로젝트 루트의 `noxion.config.ts`에 있습니다.

## 전체 예시

```ts
import {
  defineConfig,
  createRSSPlugin,
  createAnalyticsPlugin,
  createCommentsPlugin,
} from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  rootNotionSpaceId: process.env.NOTION_SPACE_ID,

  name: "내 블로그",
  domain: "myblog.com",
  author: "이름",
  description: "흥미로운 것들에 관한 블로그",
  language: "ko",           // <html lang>과 og:locale에 사용
  defaultTheme: "system",   // "light" | "dark" | "system"
  revalidate: 3600,         // ISR 재검증 간격 (초)
  revalidateSecret: process.env.REVALIDATE_SECRET,

  plugins: [
    createRSSPlugin({
      feedPath: "/feed.xml",
      limit: 20,
    }),
    createAnalyticsPlugin({
      provider: "google",
      trackingId: process.env.NEXT_PUBLIC_GA_ID,
    }),
    createCommentsPlugin({
      provider: "giscus",
      config: {
        repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
        repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
        category: "Announcements",
        categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
      },
    }),
  ],
});
```

## 옵션

### 필수

| 옵션 | 타입 | 설명 |
|------|------|------|
| `rootNotionPageId` | `string` | 루트 Notion 데이터베이스 페이지 ID |
| `name` | `string` | 사이트 이름 |
| `domain` | `string` | 프로덕션 도메인 (프로토콜 없음) |
| `author` | `string` | 기본 작성자 이름 |
| `description` | `string` | 사이트 설명 |

### 선택사항

| 옵션 | 타입 | 기본값 | 설명 |
|------|------|--------|------|
| `rootNotionSpaceId` | `string` | — | Notion 워크스페이스 ID |
| `language` | `string` | `"en"` | 사이트 언어 코드 |
| `defaultTheme` | `ThemeMode` | `"system"` | 기본 색 구성표 |
| `revalidate` | `number` | `3600` | ISR 간격 (초) |
| `revalidateSecret` | `string` | — | 온디맨드 재검증 시크릿 |
| `plugins` | `PluginConfig[]` | `[]` | 활성화할 플러그인 |

## 환경 변수

| 변수 | 필수 | 설명 |
|------|------|------|
| `NOTION_PAGE_ID` | ✅ | 루트 Notion 데이터베이스 페이지 ID |
| `NOTION_TOKEN` | — | 통합 토큰 (비공개 페이지) |
| `SITE_NAME` | — | config의 `name` 오버라이드 |
| `SITE_DOMAIN` | — | config의 `domain` 오버라이드 |
| `SITE_AUTHOR` | — | config의 `author` 오버라이드 |
| `SITE_DESCRIPTION` | — | config의 `description` 오버라이드 |
| `REVALIDATE_SECRET` | — | 온디맨드 재검증 시크릿 |
| `NEXT_PUBLIC_GA_ID` | — | Google Analytics 추적 ID |
| `NEXT_PUBLIC_GISCUS_REPO` | — | Giscus GitHub 레포 |
| `NOXION_DOWNLOAD_IMAGES` | — | `"true"`로 빌드 시 이미지 다운로드 |
