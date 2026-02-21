---
sidebar_position: 2
title: Analytics Plugin
---

# Analytics Plugin

## Google Analytics

```ts
createAnalyticsPlugin({
  provider: "google",
  trackingId: process.env.NEXT_PUBLIC_GA_ID, // "G-XXXXXXXXXX"
})
```

## Plausible

```ts
createAnalyticsPlugin({
  provider: "plausible",
  trackingId: "yourdomain.com",
})
```

## Umami

```ts
createAnalyticsPlugin({
  provider: "umami",
  trackingId: "your-website-id",
})
```
