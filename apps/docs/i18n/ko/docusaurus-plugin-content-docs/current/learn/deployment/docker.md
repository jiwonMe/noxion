---
sidebar_position: 2
title: Docker로 배포
---

# Docker로 배포

## Docker Compose (가장 빠름)

```bash
cd apps/web
cp .env.example .env   # 값 채우기
docker compose up -d
```

`http://localhost:3000`에서 확인하세요.

## Dockerfile

포함된 Dockerfile은 3단계 빌드를 사용합니다:

1. **deps** — 의존성 설치
2. **build** — Next.js 컴파일
3. **runner** — standalone 출력을 사용하는 최소 프로덕션 이미지

```bash
# 이미지 빌드
docker build -t my-blog ./apps/web

# 실행
docker run -p 3000:3000 \
  -e NOTION_PAGE_ID=abc123 \
  -e SITE_NAME="내 블로그" \
  -e SITE_DOMAIN=myblog.com \
  my-blog
```

## 환경 변수

`-e` 플래그 또는 `--env-file`로 `.env` 파일을 전달하세요.
