---
sidebar_position: 13
title: Troubleshooting
description: Solutions to common issues with Noxion — Notion API, builds, images, ISR, and more.
---

This guide provides solutions to common issues encountered when setting up or running Noxion. If you encounter an error not listed here, check the browser console and server logs for specific error messages.

---

## Notion API Issues

### Pages don't appear or site is empty

| Cause | Solution |
| :--- | :--- |
| Wrong `NOTION_PAGE_ID` | Ensure the ID matches the root page of your site. It should be a 32-character string. |
| Page not shared | If not using a `NOTION_TOKEN`, the page must be "Public". If using a token, the integration must be invited to the page. |
| Private page without token | Ensure `NOTION_TOKEN` is set in your environment variables if the page is private. |

### "Unauthorized" (401) errors

**Problem**: The build fails or pages return 401 errors.
**Cause**: The `NOTION_TOKEN` is invalid, expired, or the integration hasn't been granted access to the specific page.
**Solution**:
1. Verify the token in the Notion Developers portal.
2. In Notion, click the "..." menu on your root page, go to "Connect to", and select your integration.

### Stale content

**Problem**: Changes in Notion are not reflecting on the live site.
**Cause**: The ISR (Incremental Static Regeneration) cache hasn't expired yet, or the revalidation trigger failed.
**Solution**:
1. Wait for the `revalidate` interval (default 3600s) to pass.
2. Trigger a manual revalidation if you have a revalidation endpoint configured.
3. Check if your hosting provider (like Vercel) is correctly handling the `Cache-Control` headers.

---

## Build Issues

### "Cannot find module" errors

**Problem**: Build fails with module resolution errors.
**Cause**: Missing dependencies or a corrupted lockfile.
**Solution**:
1. Delete `node_modules` and your lockfile (`package-lock.json` or `pnpm-lock.yaml`).
2. Run `npm install` or `pnpm install`.
3. Ensure you are using the Node.js version specified in `.nvmrc` or `package.json`.

### Build fails with type errors

**Problem**: TypeScript errors during `next build`.
**Cause**: Version mismatch between `@noxion` packages or outdated local types.
**Solution**:
1. Ensure all `@noxion/*` packages in your `package.json` use the same version.
2. Run `npx tsc --noEmit` to debug specific files.
3. If using custom plugins, verify they match the `NoxionPlugin` interface.

### Build is slow

**Problem**: The build process takes several minutes or times out.
**Cause**: Too many images being downloaded or too many Shiki languages being loaded.
**Solution**:
1. Set `NOXION_DOWNLOAD_IMAGES=false` to proxy images at runtime instead of downloading them.
2. Limit `shiki.langs` in `noxion.config.ts` to only the languages you actually use.

---

## Runtime Issues

### Flash of Unstyled Content (FOUC)

**Problem**: The site flickers or shows wrong colors for a split second on load.
**Cause**: The `ThemeScript` component is missing from the root layout, or it's placed after the main content.
**Solution**:
Place the `ThemeScript` at the very top of your `<body>` tag in `app/layout.tsx`.

```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeScript />
        {children}
      </body>
    </html>
  );
}
```

### Dark mode not working

**Problem**: Toggling dark mode has no effect.
**Cause**: The `data-theme` attribute is not being applied to the `<html>` or `<body>` tag, or Tailwind is not configured for the `data-theme` selector.
**Solution**:
1. Inspect the DOM to see if `<html data-theme="dark">` exists.
2. Check your `tailwind.config.ts` for the correct theme strategy.

### Math equations not rendering

**Problem**: LaTeX code appears as plain text.
**Cause**: Missing KaTeX CSS or the math plugin is not enabled.
**Solution**:
1. Import the KaTeX CSS in your global CSS file or root layout.
2. Ensure `remark-math` and `rehype-katex` are included in your processor pipeline.

```css
/* globals.css */
@import 'katex/dist/katex.min.css';
```

---

## Deployment Issues

### Vercel: ISR not working

**Problem**: Pages never update after the initial build.
**Cause**: Environment variables are missing in the Vercel dashboard, or the `revalidate` constant is being overridden.
**Solution**:
1. Check the "Environment Variables" tab in Vercel.
2. Ensure `NOTION_TOKEN` and `NOTION_PAGE_ID` are present for the "Production" environment.
3. Check Vercel logs for "Function Invocation" errors during revalidation.

### Docker: Broken images

**Problem**: Images show as broken icons when self-hosting.
**Cause**: Missing `remotePatterns` in `next.config.ts` or CORS issues with the Notion S3 proxy.
**Solution**:
Add the Notion S3 domains to your `next.config.ts`:

```typescript
// next.config.ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
    { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
  ],
},
```

---

## Plugin Issues

### Plugin not loading

**Problem**: A custom block or functionality is missing.
**Cause**: Wrong plugin order or the plugin was not imported in the renderer.
**Solution**:
1. Verify the plugin is exported in your `noxion.config.ts`.
2. Check the order: plugins are processed sequentially; a generic plugin might be "swallowing" a specific block before your custom plugin sees it.

### Analytics not tracking

**Problem**: No data appears in your analytics dashboard.
**Cause**: `NODE_ENV` is not `production`, or the tracking ID is missing the `NEXT_PUBLIC_` prefix.
**Solution**:
1. Ensure your environment variable is named `NEXT_PUBLIC_GA_ID` (or similar).
2. Most analytics plugins disable themselves in development mode to avoid polluting data. Test in a production build.

:::warning
Always check the browser's Network tab to see if the analytics script is actually being requested.
:::
