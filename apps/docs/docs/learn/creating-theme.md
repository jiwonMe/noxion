---
sidebar_position: 10
title: Creating a Custom Theme
description: Build and publish a custom Noxion theme with direct component imports and Tailwind CSS.
---

# Creating a Custom Theme

This guide walks you through creating a reusable Noxion theme that can be shared as an npm package.

---

## Step 1: Scaffold the theme

```bash
bun create noxion my-theme --theme
```

This generates:

```
my-theme/
├── src/
│   ├── index.ts            # Re-exports components, layouts, and templates
│   ├── components/         # React components (Header, Footer, PostCard, etc.)
│   ├── layouts/            # Layout components (BaseLayout, BlogLayout)
│   └── templates/          # Page templates (HomePage, PostPage, etc.)
├── styles/
│   ├── tailwind.css        # Tailwind CSS entry with theme variables
│   └── theme.css           # Additional CSS variable overrides
├── package.json
└── tsconfig.json
```

---

## Step 2: Configure Tailwind CSS

Your theme's `styles/tailwind.css` is the Tailwind entry point. It must include:

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

@source "../src/**/*.{ts,tsx}";

:root {
  --color-primary: #8b5cf6;
  --color-primary-foreground: #ffffff;
  --color-background: #ffffff;
  --color-foreground: #171717;
  --color-muted: #f5f5f5;
  --color-muted-foreground: #737373;
  --color-border: #e5e5e5;
  --color-card: #ffffff;
  --color-card-foreground: #171717;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --width-content: 1080px;
  --radius-default: 0.5rem;
}

[data-theme="dark"] {
  --color-background: #0f0f23;
  --color-foreground: #ededed;
  --color-card: #1e1e3f;
  --color-border: #2a2a2a;
  --color-muted: #1a1a1a;
}
```

Key points:

- **`@custom-variant dark`** — maps `dark:` Tailwind utilities to `[data-theme="dark"]`, so they respond to the theme toggle instead of the OS media query.
- **`@source`** — tells Tailwind to scan your theme's source files for class names.
- **CSS variables** — define your theme's design tokens for both light and dark modes.

### Package exports

Configure `package.json` to export the Tailwind entry:

```json
{
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./styles": "./styles/theme.css",
    "./styles/tailwind": "./styles/tailwind.css"
  },
  "sideEffects": ["styles/**/*.css"]
}
```

---

## Step 3: Create components

Theme components are standard React components that use Tailwind utility classes. Import prop types from `@noxion/renderer`:

```tsx
// src/components/Header.tsx
import type { HeaderProps } from "@noxion/renderer";

export function Header({ siteName, navigation }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <a href="/" className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {siteName}
        </a>
        <nav className="flex items-center gap-6">
          {navigation?.map((item) => (
            <a key={item.href} href={item.href} className="text-sm text-gray-700 dark:text-gray-300">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
```

### Required exports

Your theme must export these components, layouts, and templates:

| Category | Required Exports |
|----------|-----------------|
| **Components** | `Header`, `Footer`, `PostCard`, `FeaturedPostCard`, `PostList`, `HeroSection`, `TOC`, `Search`, `TagFilter`, `ThemeToggle`, `EmptyState`, `NotionPage`, `DocsSidebar`, `DocsBreadcrumb`, `PortfolioProjectCard`, `PortfolioFilter` |
| **Layouts** | `BaseLayout`, `BlogLayout`, `DocsLayout` |
| **Templates** | `HomePage`, `PostPage`, `ArchivePage`, `TagPage`, `DocsPage` |

All prop types are exported from `@noxion/renderer`.

---

## Responsive Design Patterns

Noxion themes use a mobile-first approach. Use Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) to adjust layouts across devices.

### Breakpoint Strategy

| Breakpoint | Width | Usage |
|------------|-------|-------|
| `sm` | 640px | Small tablets |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |

### Sidebar Behavior

In documentation layouts, the sidebar should collapse into a drawer or hidden menu on mobile.

```tsx
export function DocsLayout({ children, slots }: DocsLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <button onClick={() => setIsOpen(!isOpen)}>Menu</button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {slots.sidebar?.()}
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
```

:::tip
Use the `cn` utility from `@noxion/renderer` to manage conditional classes cleanly.
:::

### Grid/List Switching

For portfolios, you might want to switch from a single-column list on mobile to a multi-column grid on desktop.

```tsx
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {projects.map(project => (
    <PortfolioProjectCard key={project.id} {...project} />
  ))}
</div>
```

---

## Step 4: Build on the default theme

You don't have to build every component from scratch. Import and re-export components from `@noxion/theme-default`, then override only the ones you want to customize:

```ts
// src/components/index.ts

// Re-use most components from the default theme
export { Footer, TOC, Search, TagFilter, ThemeToggle, EmptyState,
  NotionPage, DocsSidebar, DocsBreadcrumb, PortfolioProjectCard,
  PortfolioFilter } from "@noxion/theme-default";

// Create your own custom components for the ones you want to change
export { Header } from "./Header";
export { PostCard } from "./PostCard";
// ...
```

---

## Typography System

Noxion themes rely on CSS variables for font families to allow easy overrides by end-users.

### Font Variables

Define your font stacks in `styles/tailwind.css`:

```css
:root {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-serif: "Georgia", serif;
  --font-mono: "JetBrains Mono", monospace;
}
```

### Using next/font

If your theme is used in a Next.js project, you can map `next/font` to these variables in the root layout:

```tsx
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### Responsive Typography

Use fluid type scales or responsive utility classes to ensure readability.

| Element | Mobile | Desktop |
|---------|--------|---------|
| H1 | `text-3xl` | `text-5xl` |
| H2 | `text-2xl` | `text-3xl` |
| Body | `text-base` | `text-lg` |

```tsx
<h1 className="text-3xl font-bold leading-tight md:text-5xl">
  {title}
</h1>
```

:::note
Maintain a line-height of 1.5 to 1.6 for body text to ensure accessibility and readability.
:::

### Code Font Configuration

For syntax highlighting with Shiki, ensure your mono font is correctly applied to code blocks.

```css
pre, code {
  font-family: var(--font-mono);
}
```

---

## Step 5: Export everything

Your theme's entry point (`src/index.ts`) re-exports all components:

```ts
// src/index.ts
export * from "./components";
export * from "./layouts";
export * from "./templates";
```

---

## Testing Your Theme

Before publishing, verify your theme against various content types and device sizes.

### Theme Dev App

The `apps/theme-dev/` directory contains a specialized environment for theme development. Link your theme to this app to see live changes.

```bash
cd apps/theme-dev
bun link my-theme
bun run dev
```

### Dark Mode Transitions

Ensure all components handle theme switching gracefully. Test for:
- Background and foreground color contrast.
- Border visibility in dark mode.
- Image opacity or filtering.

```css
/* Example: Dimming images in dark mode */
[data-theme="dark"] img {
  filter: brightness(0.8) contrast(1.2);
}
```

### Content Type Matrix

Verify your theme with these content scenarios:

| Content Type | Key Components to Test |
|--------------|------------------------|
| **Blog** | Long-form text, code blocks, images with captions, blockquotes. |
| **Docs** | Nested navigation, table of contents, callouts, API tables. |
| **Portfolio** | Image galleries, project metadata, external links. |

### Accessibility Testing

- **Contrast**: Use tools like Lighthouse or Axe to check WCAG AA compliance.
- **Keyboard Nav**: Ensure all interactive elements have visible focus states.
- **Screen Readers**: Use semantic HTML (`<nav>`, `<article>`, `<aside>`).

:::warning
Never remove the default browser focus ring without providing a high-contrast custom alternative.
:::

---

## Step 6: Publish

```bash
npm publish
```

Users install and use your theme:

```bash
bun add noxion-theme-midnight
```

```tsx
// app/layout.tsx
import "noxion-theme-midnight/styles/tailwind";

// app/site-layout.tsx
import { BlogLayout, Header, Footer } from "noxion-theme-midnight";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <BlogLayout
      slots={{
        header: () => <Header siteName="My Blog" />,
        footer: () => <Footer siteName="My Blog" />,
      }}
    >
      {children}
    </BlogLayout>
  );
}
```

---

## Theme Configuration Patterns

Make your theme flexible by allowing users to customize it without editing the source code.

### CSS Variable Overrides

Users can override your theme by providing their own CSS variables in their global stylesheet.

```css
/* User's global.css */
:root {
  --color-primary: #3b82f6;
  --radius-default: 0px;
}
```

### Color Presets

Provide multiple built-in color schemes that users can toggle via a configuration option.

```ts
// src/presets.ts
export const presets = {
  midnight: {
    '--color-background': '#0f172a',
    '--color-foreground': '#f8fafc',
  },
  forest: {
    '--color-background': '#064e3b',
    '--color-foreground': '#ecfdf5',
  }
};
```

### Theme Composition

You can extend existing themes by importing their components and wrapping them.

```tsx
import { Header as BaseHeader } from "@noxion/theme-default";

export function Header(props: HeaderProps) {
  return (
    <div className="border-t-4 border-primary">
      <BaseHeader {...props} />
    </div>
  );
}
```

---

## Advanced: Custom Layouts

Layouts define the high-level structure of your pages.

### Slot System

Noxion uses a "slot" pattern to inject components into layouts. This keeps layouts decoupled from specific component implementations.

```tsx
interface LayoutProps {
  children: React.ReactNode;
  slots: {
    header: () => React.ReactNode;
    footer: () => React.ReactNode;
    sidebar?: () => React.ReactNode;
  };
}

export function BaseLayout({ children, slots }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {slots.header()}
      <div className="flex-1">
        {slots.sidebar && <aside>{slots.sidebar()}</aside>}
        <main>{children}</main>
      </div>
      {slots.footer()}
    </div>
  );
}
```

### Layout Composition

Combine multiple layouts for complex page structures. For example, a `DocsLayout` might wrap a `BaseLayout`.

```tsx
export function DocsLayout({ children, slots }: DocsLayoutProps) {
  return (
    <BaseLayout
      slots={{
        header: slots.header,
        footer: slots.footer,
        sidebar: slots.sidebar,
      }}
    >
      <div className="prose dark:prose-invert max-w-none">
        {children}
      </div>
    </BaseLayout>
  );
}
```

---

## Design System Integration

If you are building a theme for an existing brand, integrate your design tokens directly.

### Design Tokens

Map your design system's tokens to Noxion's CSS variables.

| Token Category | Noxion Variable |
|----------------|-----------------|
| Brand Primary | `--color-primary` |
| Surface Base | `--color-background` |
| Text Main | `--color-foreground` |
| Radius Large | `--radius-default` |

### Figma Integration

When exporting from Figma, use a tool like Style Dictionary to generate the `theme.css` file automatically.

```json
{
  "color": {
    "primary": { "value": "{colors.blue.500}" },
    "background": { "value": "{colors.white}" }
  }
}
```

:::note
Consistency between your design tool and your code is key for long-term maintenance.
:::

---

## Theme metadata

Themes can include metadata for discovery and display:

```ts
interface NoxionThemeMetadata {
  description?: string;
  author?: string;
  version?: string;
  preview?: string;
}
```
