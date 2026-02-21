# @noxion/core

Core data fetching, config, and plugin system for [Noxion](https://github.com/jiwonme/noxion) — a Notion-powered blog builder.

## Features

- Notion API client wrapper
- Blog post fetching and caching
- Frontmatter parsing from Notion code blocks
- Plugin system (analytics, RSS, comments)
- Image downloading and mapping utilities

## Installation

```bash
npm install @noxion/core
```

## Usage

```ts
import { defineConfig, fetchBlogPosts, createRSSPlugin } from "@noxion/core";

const config = defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  plugins: [createRSSPlugin({ feedPath: "/feed.xml" })],
});
```

## Documentation

See the [full documentation](https://github.com/jiwonme/noxion) for complete usage guides.

## License

MIT
