---
sidebar_position: 5
title: Auto-Publish from Notion
description: Automatically update your site the moment you check "Public" in Notion.
---

# Auto-Publish from Notion

By default, Noxion refreshes content every hour via [ISR](./configuration#revalidate). This guide shows you how to **publish instantly** — the moment you check the `Public` checkbox in Notion, your site updates within seconds.

---

## How it works

```
Notion (Public ✓) → Automation service → /api/revalidate → Site updated
```

Notion's built-in database automations cannot directly call external URLs. You need an intermediary service that **watches** your Notion database and **triggers** Noxion's revalidation endpoint when a property changes.

### Prerequisites

Before setting up auto-publish, make sure you have:

1. **`REVALIDATE_SECRET`** set in your environment variables (see [Configuration → On-demand revalidation](./configuration#on-demand-revalidation))
2. **Your site deployed** and accessible at a public URL
3. **The `/api/revalidate` endpoint working** — test it with:
   ```bash
   curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/"
   ```

---

## Option 1: Make.com (Recommended)

[Make](https://www.make.com) (formerly Integromat) is the recommended approach. The free tier includes 1,000 operations/month — enough for most blogs.

### Step 1: Create a Make account

1. Go to [make.com](https://www.make.com) and sign up
2. Confirm your email

### Step 2: Create a new Scenario

1. Click **Create a new scenario** on the dashboard
2. You'll see the visual scenario editor

### Step 3: Add the Notion trigger

1. Click the **+** button to add the first module
2. Search for **Notion** and select it
3. Choose **Watch Database Items**
4. Connect your Notion account:
   - Click **Add** next to Connection
   - Authorize Make to access your Notion workspace
   - Select the databases you want Make to monitor
5. Configure the trigger:
   - **Database**: Select your blog database
   - **Watch**: Choose **Updated Items** (this detects when the `Public` checkbox changes)

:::tip First run
On the first run, Make will ask you to choose a starting point. Select **From now on** to avoid processing all existing pages.
:::

### Step 4: Add a Filter (optional but recommended)

Click the line between the Notion module and the next module, then **Add a filter**:

- **Label**: `Only when Public is checked`
- **Condition**: `Public` (from the Notion output) → **is equal to** → `true`

This ensures the webhook only fires when a page is actually published, not on every edit.

### Step 5: Add the HTTP module

1. Click **+** to add the next module
2. Search for **HTTP** and select **Make a request**
3. Configure:
   - **URL**: `https://yourdomain.com/api/revalidate`
   - **Method**: `POST`
   - **Query String**:
     | Key | Value |
     |-----|-------|
     | `secret` | Your `REVALIDATE_SECRET` value |
     | `path` | `/` |

### Step 6: (Optional) Add a second HTTP module for the specific page

If you want to revalidate the specific post page as well:

1. Add another **HTTP → Make a request** module
2. Configure:
   - **URL**: `https://yourdomain.com/api/revalidate`
   - **Method**: `POST`
   - **Query String**:
     | Key | Value |
     |-----|-------|
     | `secret` | Your `REVALIDATE_SECRET` value |
     | `path` | `/` + Slug from the Notion module (or use the page title) |

### Step 7: Activate the Scenario

1. Click the **scheduling toggle** (bottom-left of the editor)
2. Set the interval — **15 minutes** is a good default (Make checks for changes every 15 minutes on the free tier)
3. Click **Save** and then **Activate**

### Complete scenario diagram

```
┌──────────────────┐     ┌──────────┐     ┌─────────────────────┐
│ Notion            │     │ Filter   │     │ HTTP Request         │
│ Watch Database    │────▶│ Public = │────▶│ POST /api/revalidate │
│ Items (Updated)   │     │ true     │     │ ?secret=...&path=/   │
└──────────────────┘     └──────────┘     └─────────────────────┘
```

:::info Make free tier
The free tier allows **1,000 operations/month** with a **15-minute minimum polling interval**. For most blogs, this is more than enough. If you need faster polling (down to 1 minute), upgrade to the Core plan ($9/month).
:::

---

## Option 2: Zapier

[Zapier](https://zapier.com) is another popular automation platform with Notion integration.

### Quick setup

1. Create a new **Zap**
2. **Trigger**: Notion → **Updated Database Item**
   - Connect your Notion account
   - Select your blog database
3. **Filter** (optional): Only continue when `Public` is `true`
4. **Action**: Webhooks by Zapier → **POST**
   - URL: `https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/`
   - Method: POST
5. **Test & Publish** the Zap

:::note Zapier pricing
Zapier's free tier is limited to 100 tasks/month with a 15-minute polling interval. The Starter plan ($19.99/month) offers 750 tasks and 2-minute polling. For most users, **Make.com offers better value**.
:::

---

## Option 3: n8n (Self-hosted)

[n8n](https://n8n.io) is an open-source workflow automation tool you can self-host for free.

### Quick setup

1. Install n8n: `npm install -g n8n` or use Docker
2. Create a workflow:
   - **Trigger**: Notion → **Database Page Updated** (polling every 5 minutes)
   - **IF Node**: Check if `Public` property is `true`
   - **HTTP Request Node**: POST to `https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/`
3. Activate the workflow

:::tip Self-hosted advantage
n8n is free to self-host with no operation limits. It can poll every minute if you need near-instant updates. The trade-off is hosting and maintaining the n8n instance yourself.
:::

---

## Option 4: GitHub Actions (Free, no third-party service)

If you don't want to use an external service, a GitHub Actions workflow can poll your Notion database and revalidate when changes are detected. This approach is entirely free but has a **minimum 5-minute interval**.

### Create the workflow

Create `.github/workflows/notion-auto-publish.yml`:

```yaml
name: Notion Auto-Publish

on:
  schedule:
    # Runs every 5 minutes
    - cron: '*/5 * * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger revalidation
        run: |
          curl -s -o /dev/null -w "%{http_code}" \
            -X POST "${{ secrets.SITE_URL }}/api/revalidate?secret=${{ secrets.REVALIDATE_SECRET }}&path=/"
```

### Add repository secrets

In your GitHub repository, go to **Settings → Secrets and variables → Actions** and add:

| Secret | Value |
|--------|-------|
| `SITE_URL` | `https://yourdomain.com` |
| `REVALIDATE_SECRET` | Your revalidation secret |

### How it works

This workflow triggers revalidation every 5 minutes regardless of whether content has changed. Since the revalidation endpoint is idempotent and lightweight, this is safe and effective.

:::warning GitHub Actions limits
- **Free tier**: 2,000 minutes/month. At 5-minute intervals, this workflow uses ~8,640 runs/month (~30 seconds each = ~4,320 minutes). You may want to **increase the interval to 10-15 minutes** or use a different approach to stay within limits.
- **Recommended cron for free tier**: `*/15 * * * *` (every 15 minutes, uses ~1,440 minutes/month)
:::

---

## Comparison

| Approach | Cost | Latency | Setup effort | Maintenance |
|----------|------|---------|-------------|-------------|
| **Make.com** | Free (1K ops/month) | ~15 min (free) / ~1 min (paid) | Medium | None |
| **Zapier** | Free (100 tasks/month) | ~15 min (free) / ~2 min (paid) | Medium | None |
| **n8n** | Free (self-hosted) | ~1 min | High (need server) | Server maintenance |
| **GitHub Actions** | Free (2K min/month) | 5–15 min | Low | None |

**Our recommendation**: Start with **Make.com** for the best balance of cost, ease of setup, and reliability. If you're already self-hosting infrastructure, **n8n** gives you the most control.

---

## Vercel Deploy Hooks (alternative)

If you prefer a full site rebuild instead of ISR revalidation, you can use [Vercel Deploy Hooks](https://vercel.com/docs/deployments/deploy-hooks):

1. In your Vercel project, go to **Settings → Git → Deploy Hooks**
2. Create a hook (e.g., name: "Notion Publish", branch: `main`)
3. Copy the hook URL
4. Use any of the approaches above, but replace the revalidation URL with the Deploy Hook URL

:::caution Full rebuild vs. ISR
Deploy Hooks trigger a **full site rebuild** (1–3 minutes). On-demand ISR revalidation updates **individual pages in seconds**. For most use cases, ISR revalidation is faster and more efficient.
:::

---

## Troubleshooting

### Changes not appearing after trigger

1. Verify your `REVALIDATE_SECRET` is correct
2. Test the revalidation endpoint manually:
   ```bash
   curl -X POST "https://yourdomain.com/api/revalidate?secret=YOUR_SECRET&path=/"
   ```
3. Check that the `Public` checkbox is actually checked in Notion
4. If using Make/Zapier, check the execution history for errors

### Make.com not detecting changes

- Ensure your Notion connection is still authorized
- Check that the database is shared with the Make integration
- Verify the trigger is set to **Updated Items**, not just **New Items**

### Rate limiting

The `/api/revalidate` endpoint has no built-in rate limiting. If you're concerned about abuse, add rate limiting at the infrastructure level (e.g., Vercel's [Edge Middleware](https://vercel.com/docs/functions/edge-middleware)).
