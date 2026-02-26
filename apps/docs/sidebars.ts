import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  learnSidebar: [
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      items: [
        'learn/introduction',
        'learn/quick-start',
        'learn/notion-setup',
      ],
    },
    {
      type: 'category',
      label: 'Core Concepts',
      collapsed: false,
      items: [
        'learn/configuration',
        'learn/auto-publish',
        'learn/image-optimization',
        'learn/seo',
        'learn/themes',
      ],
    },
    {
      type: 'category',
      label: 'Content Features',
      items: [
        'learn/syntax-highlighting',
        'learn/math-equations',
        'learn/block-overrides',
        'learn/renderer-plugins',
      ],
    },
    {
      type: 'category',
      label: 'Page Types',
      items: [
        'learn/building-docs',
        'learn/building-portfolio',
      ],
    },
    {
      type: 'category',
      label: 'Plugins',
      items: [
        'learn/plugins/overview',
        'learn/plugins/analytics',
        'learn/plugins/rss',
        'learn/plugins/comments',
        'learn/plugins/creating-a-plugin',
      ],
    },
    {
      type: 'category',
      label: 'Customization',
      items: [
        'learn/creating-theme',
      ],
    },
    {
      type: 'category',
      label: 'Deployment',
      items: [
        'learn/deployment/vercel',
        'learn/deployment/docker',
      ],
    },
    {
      type: 'category',
      label: 'Advanced',
      items: [
        'learn/performance',
        'learn/troubleshooting',
      ],
    },
    {
      type: 'category',
      label: 'Upgrading',
      items: [
        'learn/migration-v02',
        'learn/migration-v04',
      ],
    },
  ],
  changelogSidebar: [
    'changelog',
  ],
  referenceSidebar: [
    'reference/overview',
    {
      type: 'category',
      label: '@noxion/core',
      collapsed: false,
      items: [
        'reference/core/config',
        'reference/core/fetcher',
        'reference/core/slug',
        'reference/core/frontmatter',
        'reference/core/plugins',
        'reference/core/types',
      ],
    },
    {
      type: 'category',
      label: '@noxion/notion-renderer',
      collapsed: false,
      items: [
        'reference/notion-renderer/overview',
        'reference/notion-renderer/renderer-api',
        'reference/notion-renderer/blocks',
        'reference/notion-renderer/hooks',
        'reference/notion-renderer/components',
        'reference/notion-renderer/utils',
        'reference/notion-renderer/shiki',
        'reference/notion-renderer/plugins',
        'reference/notion-renderer/built-in-plugins'
      ],
    },
    {
      type: 'category',
      label: '@noxion/renderer',
      collapsed: false,
      items: [
        'reference/renderer/notion-page',
        'reference/renderer/post-list',
        'reference/renderer/post-card',
        'reference/renderer/theme-provider',
      ],
    },
    {
      type: 'category',
      label: '@noxion/adapter-nextjs',
      collapsed: false,
      items: [
        'reference/adapter-nextjs/metadata',
        'reference/adapter-nextjs/structured-data',
        'reference/adapter-nextjs/sitemap',
        'reference/adapter-nextjs/revalidation',
      ],
    },
    {
      type: 'category',
      label: 'create-noxion',
      items: [
        'reference/cli/create-noxion',
      ],
    },
  ],
};

export default sidebars;
