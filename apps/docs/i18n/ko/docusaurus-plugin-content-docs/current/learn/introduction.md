---
sidebar_position: 1
title: 소개
description: Noxion이란 무엇이며 왜 만들었나요?
---

# 소개

**Noxion**은 Notion을 CMS로 사용하는 오픈소스 블로그 빌더입니다. Notion 데이터베이스를 연결하면 완전히 렌더링된 SEO 최적화 웹사이트를 얻을 수 있습니다.

[super.so](https://super.so)나 [oopy.io](https://oopy.io)와 비슷하지만 — 무료이고, 오픈소스이며, 완전히 직접 소유합니다.

---

## 왜 Noxion인가?

대부분의 개발자는 Notion에서 글을 쓰고 싶지만, 빠르고 SEO가 최적화된 직접 제어 가능한 웹사이트에 게시하고 싶어합니다. 기존 대안들은 모두 아쉬운 점이 있습니다:

| 옵션 | 문제점 |
|------|-------|
| Notion 기본 공유 | 느림, 커스텀 도메인 없음, SEO 취약 |
| super.so / oopy.io | 유료, 비공개 소스, 벤더 종속 |
| 내보내기 → 정적 사이트 | 수동 작업, 실시간 동기화 없음 |
| 공식 Notion API | presigned URL이 1시간 후 만료 |

Noxion은 이 모든 문제를 해결합니다. Notion 자체 웹앱에서 사용하는 **비공식 Notion API**를 사용해 더 풍부한 데이터에 접근하고, ISR(증분 정적 재생성)로 콘텐츠를 자동으로 최신 상태로 유지합니다.

이 API는 문서화되지 않았지만, 관련 생태계(`notion-client`, `notion-types` 등)는 Notion이 자체 앱에서 이 API를 사용하기 때문에 수년간 안정적으로 유지되고 있습니다.

---

## Noxion이 제공하는 것

| 기능 | 설명 |
|------|------|
| **빠른 시작** | `bun create noxion`으로 1분 안에 Next.js 16 App Router 블로그 스캐폴딩 |
| **Notion에서 작성** | Notion 에디터 사용, 포스트는 1시간 이내(또는 즉시 재검증 API로)에 사이트에 반영 |
| **극한의 SEO** | Open Graph, Twitter Cards, JSON-LD, RSS, 사이트맵, robots.txt — 전부 자동 생성 |
| **이미지 최적화** | Next.js Image를 통한 AVIF/WebP, URL 만료 문제 없음 |
| **구문 강조** | [Shiki](https://shiki.style) 기반 VS Code 수준의 코드 블록 — 클라이언트 JS 불필요 |
| **수식 렌더링** | KaTeX SSR — 서버 사이드 수식 렌더링, 클라이언트 수학 런타임 불필요 |
| **CSS 변수 테마** | 라이트/다크/시스템 모드 기본 제공, 빌드 없이 커스터마이징 가능 |
| **플러그인 시스템** | 한 줄 설정으로 애널리틱스, 댓글, RSS |
| **어디서나 배포** | Vercel, Docker, 정적 내보내기 |

---

## 아키텍처

Noxion은 함께 구성하는 **npm 패키지 모노레포**입니다:

```
noxion/
├── packages/
│   ├── @noxion/core              — 데이터 페칭, 설정, 플러그인 시스템, 타입
│   ├── @noxion/notion-renderer   — Notion 블록 렌더러 (KaTeX SSR, Shiki 구문 강조)
│   ├── @noxion/renderer          — React 컴포넌트 (PostList, NotionPage, ThemeProvider)
│   ├── @noxion/adapter-nextjs    — SEO 유틸리티 (metadata, JSON-LD, sitemap)
│   └── create-noxion             — CLI 스캐폴딩 도구
└── apps/
    ├── docs/                     — 이 문서 사이트 (Docusaurus)
    └── web/                      — 데모/참조용 Next.js 블로그
```

### 데이터 흐름

```
Notion 데이터베이스
    │
    ▼
@noxion/core (fetchBlogPosts)
    │  ├─ 비공식 Notion API 호출 (notion-client)
    │  ├─ 스키마 속성 추출 (Title, Public, Tags, …)
    │  ├─ 첫 번째 코드 블록에서 프론트매터 파싱
    │  └─ 플러그인 적용 (transformPosts 훅)
    │
    ▼
Next.js App Router (ISR, revalidate: 3600)
    │
    ├─ @noxion/adapter-nextjs → generateMetadata(), JSON-LD, sitemap
    ├─ @noxion/notion-renderer → 블록 렌더링 (30+ 타입), KaTeX SSR, Shiki
    └─ @noxion/renderer → <NotionPage />, <PostList />, ThemeProvider
```

`create-noxion` CLI는 이것들을 함께 연결하는 Next.js 16 App Router 프로젝트를 생성합니다. **앱은 직접 소유하며** — Noxion 패키지는 단순히 npm 의존성입니다. 모든 파일을 커스터마이징하거나 컴포넌트를 오버라이드할 수 있습니다.

---

## 핵심 개념

### `NoxionConfig`

`noxion.config.ts`에 정의된 중앙 설정 객체. 모든 패키지가 이 단일 소스를 읽습니다. [설정](./configuration) 참조.

### `BlogPost`

`fetchBlogPosts()`가 출력하는 정규화된 포스트 데이터 타입. `id`, `title`, `slug`, `date`, `tags`, `category`, `coverImage`, `description`, `author`, `published`, `lastEditedTime`, `frontmatter`를 포함합니다. [타입 레퍼런스](../reference/core/types) 참조.

### 프론트매터

Notion 페이지 상단의 **코드 블록**을 읽어 포스트별 메타데이터 오버라이드로 사용합니다. [Notion 설정 → 프론트매터](./notion-setup#프론트매터-오버라이드) 참조.

### 플러그인

잘 정의된 라이프사이클 훅에서 Noxion을 확장합니다. 내장 플러그인으로 애널리틱스, RSS, 댓글을 지원합니다. [플러그인](./plugins/overview) 참조.

---

## 다음 단계

- [빠른 시작](./quick-start) — 5분 안에 블로그 스캐폴딩
- [Notion 설정](./notion-setup) — Notion 데이터베이스 올바르게 구성하기
- [설정](./configuration) — 전체 `noxion.config.ts` 레퍼런스
- [SEO](./seo) — Noxion이 자동 생성하는 SEO 신호 이해하기
