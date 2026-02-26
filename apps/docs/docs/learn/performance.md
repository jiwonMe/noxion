---
sidebar_position: 12
title: Performance Optimization
description: Optimize your Noxion site for Core Web Vitals, fast loading, and efficient rendering.
---

Noxion is designed for speed. By leveraging the Next.js App Router and Notion's API efficiently, most sites achieve near-perfect performance scores out of the box. This guide covers how to maintain and improve that performance as your site grows.

---

## Core Web Vitals Baseline

A default Noxion installation typically achieves the following Lighthouse scores:

| Metric | Target Score | Description |
| :--- | :--- | :--- |
| **LCP** (Largest Contentful Paint) | < 1.2s | Measures loading performance. |
| **FID/INP** (First Input Delay) | < 100ms | Measures interactivity. |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Measures visual stability. |
| **SEO** | 100 | Standard SEO best practices. |

Typical Lighthouse audits for Noxion sites range between 95-100 across all categories.

---

## ISR Tuning

Incremental Static Regeneration (ISR) allows you to update static content without rebuilding the entire site.

### Revalidate Interval

The default revalidation interval is 3600 seconds (1 hour). You can adjust this in your page configuration or environment variables.

```typescript
// apps/web/app/[...slug]/page.tsx
export const revalidate = 3600; // Default
```

| Interval | Use Case | Trade-off |
| :--- | :--- | :--- |
| `60` | High-frequency updates | Lower CDN cache hit rate, higher API load. |
| `3600` | Standard blogs/docs | Balanced performance and freshness. |
| `86400` | Static archives | Maximum CDN caching, manual updates needed. |

### On-Demand Revalidation

For instant updates, use on-demand revalidation via a webhook. This ensures content is fresh exactly when Notion changes, allowing for longer static TTLs.

```typescript
// Example revalidation trigger
await fetch(`https://your-site.com/api/revalidate?secret=${process.env.REVALIDATE_SECRET}`);
```

---

## Image Optimization

Noxion uses `next/image` for automatic image optimization, including WebP/AVIF conversion and resizing.

### Notion Proxy URLs

Notion's native S3 URLs are presigned and expire after one hour. Noxion proxies these through your deployment to ensure they remain valid and can be cached by CDNs.

### Build-time Downloads

You can choose to download images during the build process to avoid runtime proxying.

```bash
# .env
NOXION_DOWNLOAD_IMAGES=true
```

:::note
Downloading images increases build time but results in faster runtime performance as images are served as local static assets.
:::

---

## Code Splitting

Next.js automatically splits your code into smaller bundles. Noxion extends this by ensuring heavy components are only loaded when needed.

### Dynamic Imports

Heavy plugins like Mermaid or Charts are never included in the main bundle. They use dynamic imports to load only when a page contains those specific blocks.

```typescript
import dynamic from 'next/dynamic';

const Mermaid = dynamic(() => import('./components/Mermaid'), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse bg-gray-100" />
});
```

---

## Font Optimization

Use `next/font` to host fonts locally. This eliminates layout shift and removes external requests to Google Fonts.

```typescript
// styles/fonts.ts
import { Inter } from 'next/font/google';

export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});
```

Integrate with your theme system via CSS variables:

```css
:root {
  --font-sans: var(--font-inter);
}
```

---

## Shiki Performance

Noxion uses Shiki for syntax highlighting. Unlike client-side highlighters (like Prism.js), Shiki runs entirely at build time.

- **Zero Client JS**: No highlighting logic is sent to the browser.
- **Dual-Theme CSS**: Both light and dark themes are rendered into the HTML. CSS variables toggle visibility, preventing flashes during theme switches.
- **Language Subsets**: Limit the languages Shiki loads to speed up builds.

```typescript
// noxion.config.ts
export default {
  shiki: {
    langs: ['typescript', 'javascript', 'bash', 'json'],
    themes: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
};
```

---

## KaTeX Performance

Mathematical equations are rendered to static HTML strings using `katex.renderToString` during the build or ISR phase.

- **No Runtime Parser**: The browser receives pure HTML and CSS.
- **Fast Rendering**: Equations appear instantly with the rest of the content.

:::tip
Ensure you include the KaTeX CSS in your root layout to prevent unstyled math content.
:::

---

## Lazy Loading

For heavy custom blocks, use the `createLazyBlock` utility. It uses `IntersectionObserver` to delay component mounting until the block enters the viewport.

```typescript
import { createLazyBlock } from '@noxion/sdk';

const HeavyChart = createLazyBlock(() => import('./HeavyChart'));

export const blocks = {
  code: (props) => {
    if (props.language === 'chart') return <HeavyChart {...props} />;
    return <DefaultCode {...props} />;
  }
};
```

---

## Bundle Analysis

To identify large dependencies, use `@next/bundle-analyzer`.

1. Install the package: `npm install -D @next/bundle-analyzer`
2. Run the analysis: `ANALYZE=true npm run build`

This generates a visual map of your JS bundles, helping you spot "leaky" dependencies that should be moved to dynamic imports.

---

## Vercel-Specific Optimizations

If deploying on Vercel, Noxion takes advantage of:

- **Edge Functions**: Fast middleware and API routes.
- **Vercel Image Optimization**: Automatic resizing and format conversion at the edge.
- **Global CDN**: Content is cached close to your users.

---

## Self-Hosted Tips

When hosting on your own infrastructure (e.g., Docker + Nginx):

1. **Nginx Caching**: Implement a stale-while-revalidate cache policy for the proxy.
2. **Compression**: Enable Gzip or Brotli for HTML, JS, and CSS.
3. **HTTP/2+**: Ensure your server supports HTTP/2 or HTTP/3 for multiplexed loading.
4. **Image Proxy**: Use a dedicated image service like Sharp or an external proxy if not using `NOXION_DOWNLOAD_IMAGES`.

```nginx
# Example Nginx compression config
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
```
