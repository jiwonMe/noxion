---
sidebar_position: 6
title: SEO
description: Noxion이 자동으로 생성하는 SEO 시그널
---

# SEO

Noxion은 모든 SEO 시그널을 자동으로 생성합니다. 각 페이지에서 어떤 것이 생성되는지 정확히 설명합니다.

## 홈페이지

| 시그널 | 값 |
|--------|-----|
| `<title>` | 사이트 이름 |
| `<meta description>` | 사이트 설명 (최대 160자) |
| `og:type` | `website` |
| `og:locale` | `ko_KR` / `en_US` / `ja_JP` (`language` 설정 기반) |
| JSON-LD | `WebSite` + `SearchAction` (Google Sitelinks 검색창) |
| JSON-LD | `CollectionPage` + 포스트 `ItemList` |
| `<link rel="alternate">` | RSS 피드 자동 감지 |

## 포스트 페이지

| 시그널 | 값 |
|--------|-----|
| `<title>` | `포스트 제목 \| 사이트 이름` |
| `<meta description>` | Notion `Description` 필드 (최대 160자) |
| `og:type` | `article` |
| `article:published_time` | `Published` 날짜 |
| `article:modified_time` | Notion `last_edited_time` |
| `article:author` | `Author` 필드 또는 사이트 작성자 |
| `article:section` | `Category` 필드 |
| `article:tag` | 모든 포스트 태그 |
| `og:image` | 커버 이미지, 1200×630, alt 텍스트 포함 |
| Canonical URL | `https://domain.com/post-slug` |
| JSON-LD | `BlogPosting` (전체 메타데이터) |
| JSON-LD | `BreadcrumbList` (홈 → 카테고리 → 포스트) |

## 사이트맵

`/sitemap.xml`에 포함:

- 홈페이지 (우선순위 1.0, 매일)
- 모든 공개 포스트 (우선순위 0.8, 매주)
- 모든 태그 페이지 (우선순위 0.5, 매주)

## RSS 피드

`/feed.xml`에 최대 50개 포스트 포함:
- `dc:creator`, `category` 태그 완비
- 피드 리더용 `atom:link` 자기 참조

## robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /_next/

Sitemap: https://yourdomain.com/sitemap.xml
Host: https://yourdomain.com
```

## 온디맨드 재검증

Notion 포스트를 수정했을 때 1시간을 기다리지 않고 즉시 갱신:

```bash
curl -X POST "https://yourdomain.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","slug":"post-slug"}'
```
