---
title: create-noxion
description: Noxion 프로젝트를 생성하는 CLI 스캐폴딩 도구 (blog/docs/portfolio/full)
---

# `create-noxion`

Noxion 프로젝트를 스캐폴딩합니다. 사이트 템플릿(`blog`, `docs`, `portfolio`, `full`)과 플러그인/테마 스타터 스캐폴딩을 지원합니다.

## 사용법

```bash
bun create noxion [project-name] [flags]
```

또는:

```bash
npx create-noxion [project-name] [flags]
pnpm create noxion [project-name] [flags]
```

## 대화형 모드

```bash
bun create noxion my-blog
```

프롬프트에서 프로젝트명, 템플릿, Notion DB ID, 사이트 메타 정보를 입력합니다.

## 비대화형 모드

```bash
bun create noxion my-blog \
  --yes \
  --template=blog \
  --notion-id=abc123def456 \
  --name="내 블로그" \
  --description="블로그 설명" \
  --author="이름" \
  --domain=myblog.com
```

## 플래그

| 플래그 | 타입 | 설명 |
|--------|------|------|
| `--yes` | boolean | 인터랙티브 프롬프트를 건너뜀 (누락 값은 기본값 사용) |
| `--template=<type>` | string | `blog`, `docs`, `portfolio`, `full` |
| `--notion-id=<id>` | string | 기본 Notion 데이터베이스 페이지 ID |
| `--docs-notion-id=<id>` | string | `full` 템플릿에서 docs DB ID |
| `--portfolio-notion-id=<id>` | string | `full` 템플릿에서 portfolio DB ID |
| `--name=<name>` | string | 사이트 이름 |
| `--description=<desc>` | string | 사이트 설명 |
| `--author=<name>` | string | 작성자 이름 |
| `--domain=<domain>` | string | 프로덕션 도메인 (프로토콜 제외) |

## 생성되는 파일 구조 (blog 템플릿 예시)

```
my-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── [slug]/page.tsx
│   ├── tag/[tag]/page.tsx
│   ├── api/
│   │   ├── revalidate/route.ts
│   │   └── notion-webhook/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── config.ts
│   └── notion.ts
├── noxion.config.ts
├── next.config.ts
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 스캐폴딩 후

```bash
cd my-blog
bun install
bun run dev
```

필요 시 `.env`의 `NOTION_PAGE_ID` 등 환경 변수를 확인/수정하세요.
