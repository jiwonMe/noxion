---
sidebar_position: 1
title: Deploy to Vercel
description: Deploy your Noxion blog to Vercel with ISR, image optimization, and CDN.
---

# Deploy to Vercel

[Vercel](https://vercel.com) is the recommended deployment platform for Noxion. It provides:
- First-class Next.js support (ISR, App Router, edge functions)
- [Vercel Image Optimization](https://vercel.com/docs/image-optimization) for AVIF/WebP conversion
- Global CDN with automatic cache invalidation on deploy
- Free tier sufficient for most personal blogs

---

## One-click deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jiwonme/noxion)

This button clones the Noxion repository to your GitHub account and deploys it to Vercel. You'll be prompted to fill in environment variables during the setup wizard.

---

## Manual deploy from your project

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial Noxion blog"
gh repo create my-blog --public --source=. --push
# or: git remote add origin https://github.com/you/my-blog && git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import** next to your repository
3. If using the default generated project (not the monorepo), leave **Root Directory** as is
4. If using the monorepo directly, set **Root Directory** to `apps/web`
5. Framework will be auto-detected as **Next.js**

### Step 3: Add environment variables

In the deployment configuration screen, add:

| Key | Value | Required |
|-----|-------|----------|
| `NOTION_PAGE_ID` | Your Notion database page ID | ✅ |
| `SITE_NAME` | Your blog name | — |
| `SITE_DOMAIN` | Your custom domain (e.g., `myblog.com`) | Recommended |
| `SITE_AUTHOR` | Your name | — |
| `SITE_DESCRIPTION` | Blog description | — |
| `REVALIDATE_SECRET` | Random secret for on-demand ISR | Recommended |
| `NOTION_TOKEN` | Integration token (private pages only) | — |
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | — |

:::tip Generate a strong secret
```bash
openssl rand -hex 32
```
:::

### Step 4: Deploy

Click **Deploy**. The first build takes 1–3 minutes. After that, your blog is live.

---

## Setting up a custom domain

1. In your Vercel project dashboard, go to **Settings → Domains**
2. Add your domain (e.g., `myblog.com`)
3. Follow the DNS instructions — typically add a CNAME record pointing to `cname.vercel-dns.com`
4. Update your `SITE_DOMAIN` environment variable to match your domain
5. Redeploy (or wait for the next automatic deployment) for the domain change to take effect in canonical URLs and OG tags

---

## On-demand revalidation

Vercel's ISR cache can be cleared on-demand without a full redeploy. This lets you publish a Notion post and have it appear on your blog within seconds.

### Setup

1. Make sure `REVALIDATE_SECRET` is set in your Vercel environment variables
2. The generated app includes `/api/revalidate` route handler that validates the secret

### Triggering revalidation

```bash
# After publishing a new post in Notion:
curl -X POST "https://myblog.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET","slug":"my-new-post"}'

# After updating the homepage (e.g., post order changed):
curl -X POST "https://myblog.com/api/revalidate" \
  -H "Content-Type: application/json" \
  -d '{"secret":"YOUR_SECRET"}'
```

### Using Vercel webhooks

You can automate revalidation with a GitHub Actions workflow or a scheduled task. See [Configuration → On-demand revalidation](../configuration#on-demand-revalidation) for examples.

---

## Vercel Image Optimization

Noxion's `next/image` integration uses Vercel's Image Optimization service automatically. This converts Notion images to AVIF/WebP and caches them at the CDN edge.

**Free tier limits**: 1,000 unique source images per month. Each unique (URL + width) combination counts as one image. For most personal blogs, this is more than enough.

If you exceed the limit, images fall back to the original format (no AVIF/WebP conversion) but still load correctly. Upgrade to Vercel Pro ($20/month) for unlimited image optimization.

---

## Environment-specific configuration

Use Vercel's [Environment Variables](https://vercel.com/docs/projects/environment-variables) to set different values for Production, Preview, and Development:

| Environment | Typical settings |
|-------------|-----------------|
| Production | Real domain, real Notion ID, analytics enabled |
| Preview | Staging domain, same Notion ID, analytics disabled |
| Development | `localhost:3000`, local `.env` file |

---

## Monitoring

After deploying, set up:

1. **[Vercel Analytics](https://vercel.com/analytics)** — built-in web vitals monitoring (free)
2. **[Google Search Console](https://search.google.com/search-console)** — submit your sitemap and monitor indexing
3. **[Vercel Speed Insights](https://vercel.com/docs/speed-insights)** — real user performance monitoring

---

## Troubleshooting

### Build fails with "Cannot find module"

Make sure `bun.lock` or `package-lock.json` is committed. Vercel uses this to install exact dependencies.

### Posts don't update after publishing in Notion

Vercel's ISR cache is separate from Next.js's local cache. After publishing in Notion:
1. Wait up to `revalidate` seconds (default: 3600 = 1 hour), or
2. Use on-demand revalidation (see above)

### Images are broken

Check that your `next.config.ts` includes `www.notion.so` in `remotePatterns`. The scaffolded config includes this, but if you've customized it, you may have accidentally removed it.
