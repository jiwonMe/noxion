import type { ShowcaseFeature } from './types';

const features: ShowcaseFeature[] = [
  {
    title: 'Multi-Page Types',
    description: 'Build blogs, documentation sites, and portfolios from a single Noxion project. Each page type has its own layout, metadata schema, and URL structure.',
    image: '/img/showcase/features/multi-page-types.png',
    docsUrl: '/docs/learn/configuration#collections',
    badge: 'v0.2',
  },
  {
    title: 'Theme System',
    description: 'CSS variable-based theming with light/dark/system modes. Extend built-in themes or create your own from scratch with full TypeScript support.',
    image: '/img/showcase/features/theme-system.png',
    docsUrl: '/docs/learn/themes',
  },
  {
    title: 'Plugin Ecosystem',
    description: 'Analytics, RSS, comments, reading time — add features with a single line. Build custom plugins with lifecycle hooks and the plugin-utils SDK.',
    image: '/img/showcase/features/plugin-ecosystem.png',
    docsUrl: '/docs/learn/plugins/overview',
  },
  {
    title: 'Automatic SEO',
    description: 'Open Graph, Twitter Cards, JSON-LD (BlogPosting, TechArticle, CreativeWork), RSS feed, sitemap, and robots.txt — all generated from your Notion data.',
    image: '/img/showcase/features/automatic-seo.png',
    docsUrl: '/docs/reference/adapter-nextjs/metadata',
  },
  {
    title: 'Notion as CMS',
    description: 'Write in Notion, publish instantly. Your database schema becomes your site. ISR keeps content fresh with on-demand revalidation.',
    image: '/img/showcase/features/notion-cms.png',
    docsUrl: '/docs/learn/notion-setup',
  },
  {
    title: 'One-Command Setup',
    description: 'Run `bun create noxion` and choose your template. Blog, docs, or portfolio — scaffolded and ready to deploy in under a minute.',
    image: '/img/showcase/features/one-command-setup.png',
    docsUrl: '/docs/learn/quick-start',
  },
];

export default features;
