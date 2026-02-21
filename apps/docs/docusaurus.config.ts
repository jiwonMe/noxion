import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Noxion',
  tagline: 'Notion-powered blog builder for developers',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://jiwonme.github.io',
  baseUrl: '/noxion/',

  organizationName: 'jiwonme',
  projectName: 'noxion',
  trailingSlash: false,

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
    localeConfigs: {
      en: { label: 'English', direction: 'ltr' },
      ko: { label: '한국어', direction: 'ltr' },
    },
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/jiwonme/noxion/tree/main/apps/docs/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/og-card.png',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    algolia: undefined,
    navbar: {
      title: 'Noxion',
      logo: {
        alt: 'Noxion Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: '/docs/learn/introduction',
          label: 'Learn',
          position: 'left',
          activeBasePath: 'docs/learn',
        },
        {
          to: '/docs/reference/overview',
          label: 'Reference',
          position: 'left',
          activeBasePath: 'docs/reference',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/jiwonme/noxion',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Introduction', to: '/docs/learn/introduction' },
            { label: 'Quick Start', to: '/docs/learn/quick-start' },
            { label: 'API Reference', to: '/docs/reference/overview' },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub Discussions',
              href: 'https://github.com/jiwonme/noxion/discussions',
            },
            {
              label: 'GitHub Issues',
              href: 'https://github.com/jiwonme/noxion/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/jiwonme/noxion',
            },
            {
              label: 'npm',
              href: 'https://www.npmjs.com/package/@noxion/core',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Noxion. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
