# @noxion/adapter-nextjs

Next.js App Router integration and SEO utilities for [Noxion](https://github.com/jiwonme/noxion) — a Notion-powered blog builder.

## Features

- Metadata generation (`generateNoxionMetadata`)
- Sitemap generation (`generateNoxionSitemap`)
- Robots.txt generation (`generateNoxionRobots`)
- JSON-LD structured data (BlogPosting, BreadcrumbList, WebSite)
- Static params generation for `generateStaticParams`
- On-demand ISR revalidation handler

## Installation

```bash
npm install @noxion/adapter-nextjs @noxion/core
```

## Peer Dependencies

- `next >= 15.0.0`

## Usage

```ts
// app/[slug]/page.tsx
import { generateNoxionMetadata, generateNoxionStaticParams } from "@noxion/adapter-nextjs";

export const generateMetadata = generateNoxionMetadata;
export const generateStaticParams = generateNoxionStaticParams;
```

## Documentation

See the [full documentation](https://github.com/jiwonme/noxion) for complete usage guides.

## License

MIT
