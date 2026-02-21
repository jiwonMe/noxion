---
title: create-noxion
description: CLI 스캐폴딩 도구
---

# `create-noxion`

새 Noxion 블로그 프로젝트를 스캐폴딩합니다.

## 사용법

```bash
bun create noxion [프로젝트명] [옵션]
```

또는 npx:

```bash
npx create-noxion [프로젝트명]
```

## 대화형 모드

```bash
bun create noxion my-blog
```

다음을 묻습니다:
- 프로젝트 이름
- Notion 데이터베이스 페이지 ID
- 사이트 이름
- 사이트 설명
- 작성자
- 도메인

## 비대화형 모드

```bash
bun create noxion my-blog \
  --yes \
  --notion-id=abc123def456 \
  --name="내 블로그" \
  --description="블로그 설명" \
  --author="이름" \
  --domain=myblog.com
```

## 플래그

| 플래그 | 설명 |
|--------|------|
| `--yes` | 프롬프트 건너뛰기, 기본값 사용 |
| `--notion-id=<id>` | Notion 페이지 ID |
| `--name=<name>` | 사이트 이름 |
| `--description=<desc>` | 사이트 설명 |
| `--author=<name>` | 작성자 이름 |
| `--domain=<domain>` | 프로덕션 도메인 |

## 생성되는 파일 구조

```
my-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   ├── tag/[tag]/page.tsx
│   ├── feed.xml/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── config.ts
│   └── notion.ts
├── noxion.config.ts
├── next.config.ts
├── .env.example
└── package.json
```
