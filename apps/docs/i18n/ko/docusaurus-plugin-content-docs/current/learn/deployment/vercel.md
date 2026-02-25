---
sidebar_position: 1
title: Vercel에 배포
---

# Vercel에 배포

## 원클릭 배포

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiwonme/noxion)

## 직접 배포

1. 프로젝트를 GitHub에 푸시
2. [vercel.com/new](https://vercel.com/new)에서 레포 가져오기
3. **Root Directory**를 `apps/web`으로 설정 (모노레포 사용 시)
4. 환경 변수 추가:

```
NOTION_PAGE_ID=your-page-id
SITE_NAME=내 블로그
SITE_DOMAIN=myblog.vercel.app
SITE_AUTHOR=이름
SITE_DESCRIPTION=블로그 설명
```

5. 배포

Vercel이 ISR, 이미지 최적화, CDN을 자동으로 처리합니다.

## 온디맨드 재검증

배포 후 Vercel 환경 변수에 `REVALIDATE_SECRET`을 설정한 뒤:

```bash
curl -X POST "https://myblog.vercel.app/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","slug":"post-slug"}'
```
