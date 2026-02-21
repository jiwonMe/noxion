---
sidebar_position: 1
title: Deploy to Vercel
---

# Deploy to Vercel

## One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiwonme/noxion)

## Manual deploy

1. Push your project to GitHub
2. Import the repo in [vercel.com/new](https://vercel.com/new)
3. Set **Root Directory** to `apps/web` (if using the monorepo)
4. Add environment variables:

```
NOTION_PAGE_ID=your-page-id
SITE_NAME=My Blog
SITE_DOMAIN=myblog.vercel.app
SITE_AUTHOR=Your Name
SITE_DESCRIPTION=My blog description
```

5. Deploy

Vercel automatically handles ISR, image optimization, and CDN.

## On-demand revalidation

After deploying, set `REVALIDATE_SECRET` in Vercel environment variables, then:

```bash
curl -X POST "https://myblog.vercel.app/api/revalidate?secret=YOUR_SECRET&path=/post-slug"
```
