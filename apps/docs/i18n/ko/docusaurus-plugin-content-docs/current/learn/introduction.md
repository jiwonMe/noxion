---
sidebar_position: 1
title: 소개
description: Noxion이란 무엇이며 왜 만들었나요?
---

# 소개

**Noxion**은 Notion을 CMS로 사용하는 오픈소스 블로그 빌더입니다. Notion 데이터베이스를 연결하면 완전히 렌더링된 SEO 최적화 웹사이트를 얻을 수 있습니다.

[super.so](https://super.so)나 [oopy.io](https://oopy.io)와 비슷하지만 — 무료이고, 오픈소스이며, 완전히 직접 소유합니다.

## 왜 Noxion인가?

대부분의 개발자는 Notion에서 글을 쓰고 싶지만, 빠르고 SEO가 최적화된 직접 제어 가능한 웹사이트에 게시하고 싶어합니다. 기존 대안들은 모두 아쉬운 점이 있습니다:

| 옵션 | 문제점 |
|------|-------|
| Notion 기본 공유 | 느림, 커스텀 도메인 없음, SEO 취약 |
| super.so / oopy.io | 유료, 비공개 소스, 벤더 종속 |
| 내보내기 + 정적 사이트 | 수동 작업, 실시간 동기화 없음 |
| 공식 Notion API | presigned URL이 1시간 후 만료 |

Noxion은 이 모든 문제를 해결합니다. Notion 자체 웹앱에서 사용하는 **비공식 Notion API**를 사용해 더 풍부한 데이터에 접근하고, ISR(증분 정적 재생성)로 콘텐츠를 자동으로 최신 상태로 유지합니다.

## Noxion이 제공하는 것

- **빠른 시작** — `bun create noxion`으로 1분 안에 블로그 스캐폴딩 완료
- **Notion에서 작성** — Notion 에디터 사용, 포스트는 1시간 이내(또는 즉시 재검증 API로)에 사이트에 반영
- **극한의 SEO** — Open Graph, Twitter Cards, JSON-LD 스키마, RSS, 사이트맵, robots.txt — 전부 자동 생성
- **이미지 최적화** — Next.js Image를 통한 AVIF/WebP, URL 만료 문제 없음
- **플러그인 시스템** — 한 줄 설정으로 애널리틱스, 댓글, RSS
- **어디서나 배포** — Vercel, Docker, 정적 내보내기

## 아키텍처

Noxion은 함께 구성하는 **npm 패키지 모노레포**입니다:

```
@noxion/core           — 데이터 페칭, 설정, 플러그인 시스템
@noxion/renderer       — React 컴포넌트 (PostList, NotionPage, ThemeProvider)
@noxion/adapter-nextjs — SEO 유틸리티 (metadata, JSON-LD, sitemap)
create-noxion          — CLI 스캐폴딩 도구
```

`create-noxion` CLI는 이것들을 함께 연결하는 Next.js 16 App Router 프로젝트를 생성합니다. 앱은 직접 소유하며 — Noxion 패키지는 단순히 의존성입니다.

## 다음 단계

- [빠른 시작](./quick-start) — 5분 안에 블로그 스캐폴딩
- [Notion 설정](./notion-setup) — Notion 데이터베이스 올바르게 구성하기
- [설정](./configuration) — 전체 `noxion.config.ts` 레퍼런스
