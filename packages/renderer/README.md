# @noxion/renderer

Theme contract system and React components for [Noxion](https://github.com/jiwonme/noxion) — a Notion-powered website builder.

## Features

- Theme contract system (`NoxionThemeContract`, `defineThemeContract`, `validateThemeContract`)
- Theme resolution hooks (`useThemeComponent`, `useThemeLayout`, `useThemeTemplate`)
- Notion page renderer (via `@noxion/notion-renderer`)
- CSS variable-based theming with dark/light/system mode support

## Installation

```bash
npm install @noxion/renderer react react-dom
```

## Peer Dependencies

- `react >= 18.0.0`
- `react-dom >= 18.0.0`

## Usage

```tsx
import { NoxionThemeProvider } from "@noxion/renderer";
import { defaultThemeContract } from "@noxion/theme-default";

export default function App({ children }) {
  return (
    <NoxionThemeProvider themeContract={defaultThemeContract}>
      {children}
    </NoxionThemeProvider>
  );
}
```

## Documentation

See the [full documentation](https://github.com/jiwonme/noxion) for complete usage guides.

## License

MIT
