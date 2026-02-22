# @noxion/renderer

React rendering components and theme system for [Noxion](https://github.com/jiwonme/noxion) — a Notion-powered blog builder.

## Features

- Notion page renderer (via `@noxion/notion-renderer`)
- Pre-built blog components: `PostCard`, `PostList`, `Header`, `Footer`, `TOC`, `Search`, `TagFilter`
- CSS variable-based theme system with dark/light/system mode support
- Fully customizable via component overrides

## Installation

```bash
npm install @noxion/renderer react react-dom
```

## Peer Dependencies

- `react >= 18.0.0`
- `react-dom >= 18.0.0`

## Usage

```tsx
import { NoxionThemeProvider, PostList } from "@noxion/renderer";

export default function BlogPage({ posts }) {
  return (
    <NoxionThemeProvider>
      <PostList posts={posts} />
    </NoxionThemeProvider>
  );
}
```

## Documentation

See the [full documentation](https://github.com/jiwonme/noxion) for complete usage guides.

## License

MIT
