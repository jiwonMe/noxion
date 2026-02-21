---
sidebar_position: 2
title: Analytics Plugin
description: Add page view tracking to your Noxion blog with Google Analytics, Plausible, or Umami.
---

# Analytics Plugin

The analytics plugin injects tracking scripts into your blog's `<head>`. It supports three providers out of the box, plus a custom provider for any other analytics service.

---

## Google Analytics 4

[Google Analytics 4](https://analytics.google.com) (GA4) is the most widely-used web analytics platform. It provides pageview tracking, user behavior, traffic sources, and more.

### Setup

1. Go to [analytics.google.com](https://analytics.google.com) and create a new GA4 property
2. Under **Data collection → Data streams**, add a web data stream for your domain
3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)
4. Add it to your environment variables:

```bash
# .env
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

5. Configure the plugin:

```ts
createAnalyticsPlugin({
  provider: "google",
  trackingId: process.env.NEXT_PUBLIC_GA_ID, // "G-XXXXXXXXXX"
})
```

### What gets injected

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

:::note Privacy compliance
GA4 collects personal data (IP addresses, user identifiers). If you have visitors from the EU, ensure you comply with [GDPR](https://gdpr.eu/) by adding a cookie consent banner or using a cookie-less configuration. See [Google's GDPR guide for Analytics](https://support.google.com/analytics/answer/9019185).
:::

---

## Plausible

[Plausible Analytics](https://plausible.io) is a lightweight, privacy-focused analytics tool. It doesn't use cookies, is GDPR-compliant by default, and doesn't collect personal data.

### Setup

1. Sign up at [plausible.io](https://plausible.io) (paid service, but self-hostable)
2. Add your domain to your Plausible dashboard
3. Configure the plugin:

```ts
createAnalyticsPlugin({
  provider: "plausible",
  trackingId: "yourdomain.com", // Your domain as registered in Plausible
})
```

### What gets injected

```html
<script
  defer
  data-domain="yourdomain.com"
  src="https://plausible.io/js/plausible.js"
></script>
```

### Self-hosted Plausible

If you're self-hosting Plausible, use the custom provider to point to your instance:

```ts
createAnalyticsPlugin({
  provider: "custom",
  trackingId: "yourdomain.com",
  customScript: `
    <script defer data-domain="yourdomain.com" src="https://your-plausible.com/js/plausible.js"></script>
  `,
})
```

---

## Umami

[Umami](https://umami.is) is an open-source, self-hostable analytics solution. Like Plausible, it's privacy-focused and doesn't use cookies.

### Setup

1. Set up Umami (either [umami.is cloud](https://umami.is) or [self-hosted](https://umami.is/docs/install))
2. Add your website in the Umami dashboard
3. Copy the **Website ID** (a UUID)
4. Configure the plugin:

```ts
createAnalyticsPlugin({
  provider: "umami",
  trackingId: "your-website-id-uuid",
})
```

### What gets injected

```html
<script
  async
  defer
  src="https://umami.is/script.js"
  data-website-id="your-website-id-uuid"
></script>
```

For a self-hosted instance, use the custom provider to point to your server:

```ts
createAnalyticsPlugin({
  provider: "custom",
  customScript: `
    <script async defer src="https://your-umami.com/script.js" data-website-id="your-id"></script>
  `,
})
```

---

## Custom provider

For any other analytics service (Fathom, Mixpanel, PostHog, Matomo, etc.), use the `"custom"` provider:

```ts
createAnalyticsPlugin({
  provider: "custom",
  customScript: `<script>/* your tracking snippet */</script>`,
})
```

The `customScript` string is injected verbatim into `<head>`. You're responsible for ensuring it's valid HTML.

---

## Multiple providers

You can include multiple analytics plugins simultaneously:

```ts
plugins: [
  // Primary: privacy-respecting analytics
  createAnalyticsPlugin({ provider: "plausible", trackingId: "myblog.com" }),
  // Secondary: detailed GA4 for conversion tracking
  createAnalyticsPlugin({ provider: "google", trackingId: "G-XXXXXXXXXX" }),
],
```

---

## Disabling in development

Analytics scripts are often unwanted during local development (they would pollute your analytics data). The plugin automatically skips injection when `process.env.NODE_ENV !== "production"`.

You can also gate it manually:

```ts
plugins: [
  process.env.NODE_ENV === "production" &&
    createAnalyticsPlugin({ provider: "google", trackingId: process.env.NEXT_PUBLIC_GA_ID }),
].filter(Boolean),
```

---

## Performance impact

Analytics scripts are loaded with `async` or `defer` attributes (depending on the provider), so they don't block page rendering. The impact on [Core Web Vitals](https://web.dev/vitals/) is minimal:

- **LCP (Largest Contentful Paint)** — not affected (scripts are async)
- **FID/INP** — minimal, as scripts run after initial parse
- **CLS** — not affected

Google recommends loading GA4 via `async` (which the plugin does) to minimize performance impact. See [Google's Performance Best Practices](https://developers.google.com/analytics/devguides/collection/analyticsjs/performance-tips).
