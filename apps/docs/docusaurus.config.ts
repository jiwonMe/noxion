import type { PrismTheme } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const notionLightTheme: PrismTheme = {
  plain: { color: '#37352f', backgroundColor: '#f7f6f3' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'rgba(55, 53, 47, 0.4)', fontStyle: 'italic' as const } },
    { types: ['punctuation'], style: { color: 'rgba(55, 53, 47, 0.6)' } },
    { types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'], style: { color: '#0550ae' } },
    { types: ['selector', 'attr-name', 'string', 'char', 'builtin'], style: { color: '#0a3069' } },
    { types: ['operator', 'entity', 'url'], style: { color: 'rgba(55, 53, 47, 0.7)' } },
    { types: ['atrule', 'attr-value', 'keyword'], style: { color: '#cf222e' } },
    { types: ['function', 'class-name'], style: { color: '#8250df' } },
    { types: ['regex', 'important', 'variable'], style: { color: '#0550ae' } },
  ],
};

const notionDarkTheme: PrismTheme = {
  plain: { color: '#e6e6e5', backgroundColor: '#2f2f2f' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: 'rgba(255, 255, 255, 0.35)', fontStyle: 'italic' as const } },
    { types: ['punctuation'], style: { color: 'rgba(255, 255, 255, 0.5)' } },
    { types: ['property', 'tag', 'boolean', 'number', 'constant', 'symbol'], style: { color: '#79c0ff' } },
    { types: ['selector', 'attr-name', 'string', 'char', 'builtin'], style: { color: '#a5d6ff' } },
    { types: ['operator', 'entity', 'url'], style: { color: 'rgba(255, 255, 255, 0.6)' } },
    { types: ['atrule', 'attr-value', 'keyword'], style: { color: '#ff7b72' } },
    { types: ['function', 'class-name'], style: { color: '#d2a8ff' } },
    { types: ['regex', 'important', 'variable'], style: { color: '#79c0ff' } },
  ],
};

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

  plugins: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'ko'],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
        searchBarPosition: 'right',
      },
    ],
  ],

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
    navbar: {
      title: '',
      logo: {
        alt: 'Noxion',
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
      style: 'light',
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
      theme: notionLightTheme,
      darkTheme: notionDarkTheme,
      additionalLanguages: ['bash', 'typescript', 'json', 'yaml'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
