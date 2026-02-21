---
sidebar_position: 2
title: Deploy with Docker
---

# Deploy with Docker

## Docker Compose (quickest)

```bash
cd apps/web
cp .env.example .env   # fill in your values
docker compose up -d
```

Access at `http://localhost:3000`.

## Dockerfile

The included Dockerfile uses a 3-stage build:

1. **deps** — install dependencies
2. **build** — compile Next.js
3. **runner** — minimal production image with standalone output

```bash
# Build image
docker build -t my-blog ./apps/web

# Run
docker run -p 3000:3000 \
  -e NOTION_PAGE_ID=abc123 \
  -e SITE_NAME="My Blog" \
  -e SITE_DOMAIN=myblog.com \
  my-blog
```

## Environment variables

Pass all required variables via `-e` flags or a `.env` file with `--env-file`.
