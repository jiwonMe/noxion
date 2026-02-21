---
sidebar_position: 2
title: 빠른 시작
description: 5분 안에 Noxion 블로그를 스캐폴딩하세요.
---

# 빠른 시작

## 사전 요구사항

- [Bun](https://bun.sh) 1.0+
- [Notion](https://notion.so) 계정
- Notion 데이터베이스 ([Notion 설정](./notion-setup) 참고)

## 1. 스캐폴딩

```bash
bun create noxion my-blog
```

CLI가 다음을 묻습니다:
- **프로젝트 이름** — 블로그 폴더 이름
- **Notion 페이지 ID** — 루트 데이터베이스 페이지
- **사이트 이름**, **설명**, **작성자**, **도메인**

또는 비대화형 모드:

```bash
bun create noxion my-blog \
  --yes \
  --notion-id=abc123def456 \
  --name="내 블로그" \
  --domain=myblog.com \
  --author="이름"
```

## 2. 환경 변수 설정

```bash
cd my-blog
cp .env.example .env
```

`.env` 수정:

```bash
NOTION_PAGE_ID=abc123def456...
SITE_DOMAIN=myblog.com
SITE_NAME=내 블로그
SITE_AUTHOR=이름
SITE_DESCRIPTION=나의 블로그
```

## 3. 개발 서버 시작

```bash
bun install
bun run dev
```

[http://localhost:3000](http://localhost:3000)을 열면 Notion 포스트가 자동으로 나타납니다.

## 4. 배포

### Vercel (추천)

```bash
vercel
```

Vercel 대시보드에서 동일한 환경 변수를 추가합니다.

### Docker

```bash
docker compose up
```

자세한 내용은 [배포 → Vercel](./deployment/vercel)과 [배포 → Docker](./deployment/docker)를 참고하세요.

## 생성되는 파일 구조

```
my-blog/
├── app/
│   ├── layout.tsx          # SEO 메타데이터가 포함된 루트 레이아웃
│   ├── page.tsx            # 포스트 목록 홈페이지
│   ├── [slug]/page.tsx     # 포스트 상세 페이지
│   ├── tag/[tag]/page.tsx  # 태그 필터 페이지
│   ├── feed.xml/route.ts   # RSS 피드
│   ├── sitemap.ts
│   └── robots.ts
├── lib/
│   ├── config.ts           # noxion 설정 로드
│   └── notion.ts           # Notion 데이터 페칭 헬퍼
├── noxion.config.ts        # 사이트 설정
└── .env.example
```
