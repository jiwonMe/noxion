---
sidebar_position: 5
title: Auto-Publish from Notion
description: Automatically update your site the moment you check "Public" in Notion.
---

# Auto-Publish from Notion

By default, Noxion refreshes content every hour via [ISR](./configuration#revalidate). This guide shows you how to **publish instantly** — the moment you check the `Public` checkbox in Notion, your site updates within seconds.

---

## Built-in: Notion Integration Webhooks (Recommended)

Noxion has a **built-in webhook endpoint** that receives events directly from Notion. No external services needed — just configure your Notion integration and you're done.

```
Notion (Public ✓) ──webhook──▶ /api/notion-webhook (built into Noxion) ──▶ Site updated
```

### How it works

1. When you change a page in Notion (edit content, check `Public`, etc.), Notion sends a webhook event to your Noxion site
2. Noxion verifies the request signature (HMAC-SHA256)
3. Noxion triggers ISR revalidation for the homepage and tag pages
4. Your site updates within seconds

### Supported events

| Event | Trigger |
|-------|---------|
| `page.properties_updated` | Property changed (e.g. `Public` checkbox toggled) |
| `page.content_updated` | Page content edited |
| `page.created` | New page created |
| `page.deleted` | Page moved to trash |
| `page.undeleted` | Page restored from trash |

---

### Step 1: Create a Notion Integration

If you already have an integration (e.g. for private pages), skip to Step 2.

1. Go to [notion.so/profile/integrations](https://www.notion.so/profile/integrations)
2. Click **New integration**
3. Give it a name (e.g. "Noxion Auto-Publish")
4. Set **Associated workspace** to your workspace
5. Under **Capabilities**, enable:
   - ✅ Read content
   - ❌ Insert content (not needed)
   - ❌ Update content (not needed)
6. Click **Submit**

### Step 2: Connect the integration to your database

1. Open your Notion database
2. Click the **`...`** menu (top right)
3. Click **Add connections**
4. Search for and select your integration

### Step 3: Create a webhook subscription

1. Go back to [notion.so/profile/integrations](https://www.notion.so/profile/integrations)
2. Select your integration
3. Navigate to the **Webhooks** tab
4. Click **+ Create a subscription**
5. Enter your webhook URL:
   ```
   https://yourdomain.com/api/notion-webhook
   ```
   :::warning HTTPS required
   Notion requires a publicly accessible HTTPS endpoint. This won't work with `localhost` — your site must be deployed first.
   :::
6. Select event types to subscribe to:
   - ✅ `page.properties_updated`
   - ✅ `page.content_updated`
   - ✅ `page.created`
   - ✅ `page.deleted`
   - ✅ `page.undeleted`
7. Click **Create subscription**

### Step 4: Verify the subscription

When you create the subscription, Notion sends a one-time verification request to your endpoint. Noxion automatically handles this and logs the verification token.

1. Check your deployment logs for:
   ```
   [noxion] Notion webhook verification token received: secret_tMrlL1q...
   ```
2. Copy the token
3. Back in the Notion Webhooks tab, click **Verify**
4. Paste the verification token and click **Verify subscription**

Your webhook is now active.

### Step 5: Set up signature verification (recommended)

For security, configure HMAC-SHA256 signature verification:

1. The verification token you received in Step 4 is also your **signing secret**
2. Add it to your environment variables:
   ```bash
   NOTION_WEBHOOK_SECRET=secret_tMrlL1q...
   ```
3. Redeploy your site

With this set, Noxion will reject any requests that don't have a valid `X-Notion-Signature` header.

### Step 6: Test it

1. Open your Notion database
2. Check the `Public` checkbox on a page
3. Your site should update within 1–5 minutes (Notion's event delivery time)

:::info Event delivery timing
Notion delivers most webhook events within 1 minute, and all events within 5 minutes. Some events (like `page.content_updated`) are aggregated — rapid sequential edits are batched into a single webhook delivery.
:::

---

## Environment variables

| Variable | Description |
|----------|-------------|
| `NOTION_WEBHOOK_SECRET` | Verification token from Notion for HMAC-SHA256 signature validation. Without this, signature verification is skipped. |

Add this to your deployment platform (Vercel, Docker, etc.) alongside your existing environment variables.

---

## Alternative approaches

If you can't use Notion webhooks (e.g. your Notion plan doesn't support integrations, or you need a simpler setup), there are other options:

### Make.com

[Make](https://www.make.com) (formerly Integromat) watches your Notion database and calls Noxion's revalidation endpoint when changes are detected.

1. Create a Make scenario with **Notion → Watch Database Items** trigger
2. Add a filter: only when `Public` = `true`
3. Add **HTTP → Make a request**: POST to `https://yourdomain.com/api/revalidate` with query params `secret=YOUR_REVALIDATE_SECRET&path=/`
4. Set polling interval (15 min on free tier)

Free tier: 1,000 ops/month, 15-min polling interval.

### GitHub Actions

A scheduled workflow that pings the revalidation endpoint. Free, but minimum 5-minute interval.

```yaml
# .github/workflows/notion-auto-publish.yml
name: Notion Auto-Publish
on:
  schedule:
    - cron: '*/15 * * * *'
  workflow_dispatch:
jobs:
  revalidate:
    runs-on: ubuntu-latest
    steps:
      - run: |
          curl -s -X POST "${{ secrets.SITE_URL }}/api/revalidate?secret=${{ secrets.REVALIDATE_SECRET }}&path=/"
```

### Vercel Deploy Hooks

Triggers a full site rebuild instead of ISR revalidation:

1. In Vercel: **Settings → Git → Deploy Hooks**
2. Create a hook and use its URL with Make, Zapier, or GitHub Actions

:::caution
Deploy Hooks trigger a **full rebuild** (1–3 min). Notion webhooks with ISR revalidation update **individual pages in seconds**.
:::

---

## Comparison

| Approach | Cost | Latency | External service? |
|----------|------|---------|-------------------|
| **Notion Webhooks** (built-in) | Free | 1–5 min | No |
| Make.com | Free (1K ops/month) | ~15 min (free) | Yes |
| GitHub Actions | Free (2K min/month) | 5–15 min | No |
| Vercel Deploy Hooks | Free | 1–3 min (full rebuild) | Depends on trigger |

---

## Troubleshooting

### Webhook events not arriving

- Ensure the integration is connected to your database (Step 2)
- Check that you subscribed to the correct event types (Step 3)
- Verify the subscription is active (not paused) in the Webhooks tab
- Check your deployment logs for incoming requests

### Signature validation failing

- Ensure `NOTION_WEBHOOK_SECRET` matches the verification token exactly
- The token starts with `secret_` — include the full string
- Redeploy after adding/changing the environment variable

### Changes not appearing after webhook

1. Check deployment logs for `[noxion] Webhook: page.properties_updated for page ...`
2. If the log appears but the site doesn't update, try clearing the CDN cache
3. If the log doesn't appear, the webhook may not be reaching your endpoint — check Notion's webhook subscription status

### Event aggregation

Notion batches rapid changes. If you make several quick edits, you'll receive one webhook event (not one per edit). This is expected behavior and doesn't affect the final result — your site will reflect the latest state.
