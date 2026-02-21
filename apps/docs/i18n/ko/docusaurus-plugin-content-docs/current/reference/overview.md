---
sidebar_position: 1
title: API 개요
description: Noxion 패키지 API 레퍼런스
---

# API 레퍼런스

Noxion은 세 개의 npm 패키지와 CLI로 배포됩니다. 이 섹션은 모든 익스포트된 함수, 컴포넌트, 타입을 다룹니다.

## 패키지

| 패키지 | 목적 |
|--------|------|
| [`@noxion/core`](./core/config) | 설정, 데이터 페칭, 플러그인 시스템, 타입 |
| [`@noxion/renderer`](./renderer/notion-page) | Notion 콘텐츠 렌더링용 React 컴포넌트 |
| [`@noxion/adapter-nextjs`](./adapter-nextjs/metadata) | Next.js SEO 어댑터 (metadata, JSON-LD, sitemap) |
| [`create-noxion`](./cli/create-noxion) | CLI 스캐폴딩 도구 |

## 빠른 탐색

### @noxion/core
- [`defineConfig()`](./core/config) — 사이트 설정 정의
- [`fetchBlogPosts()`](./core/fetcher) — 공개된 모든 포스트 페치
- [`fetchPostBySlug()`](./core/fetcher) — slug로 포스트 한 개 페치
- [`parseFrontmatter()`](./core/frontmatter) — Notion 페이지에서 프론트매터 파싱
- [`definePlugin()`](./core/plugins) — 커스텀 플러그인 생성

### @noxion/renderer
- [`<NotionPage />`](./renderer/notion-page) — Notion 페이지 렌더링
- [`<PostList />`](./renderer/post-list) — 포스트 카드 목록 렌더링
- [`<PostCard />`](./renderer/post-card) — 포스트 카드 단일 렌더링
- [`<NoxionThemeProvider />`](./renderer/theme-provider) — 테마 컨텍스트 프로바이더

### @noxion/adapter-nextjs
- [`generateNoxionMetadata()`](./adapter-nextjs/metadata) — 포스트 레벨 Next.js Metadata
- [`generateNoxionListMetadata()`](./adapter-nextjs/metadata) — 사이트 레벨 Metadata
- [`generateBlogPostingLD()`](./adapter-nextjs/structured-data) — BlogPosting JSON-LD
- [`generateBreadcrumbLD()`](./adapter-nextjs/structured-data) — BreadcrumbList JSON-LD
- [`generateNoxionSitemap()`](./adapter-nextjs/sitemap) — 사이트맵 엔트리
