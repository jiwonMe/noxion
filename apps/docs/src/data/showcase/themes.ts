import type { ShowcaseTheme } from './types';

const themes: ShowcaseTheme[] = [
  {
    title: 'Default',
    description: 'Clean typography, comfortable spacing, and sensible defaults. Supports blog, docs, and portfolio page types out of the box.',
    preview: '/img/showcase/themes/default-light.png',
    previewDark: '/img/showcase/themes/default-dark.png',
    author: 'Noxion',
    tags: ['minimal'],
    command: 'bun create noxion my-site',
    npmUrl: 'https://www.npmjs.com/package/@noxion/renderer',
    repoUrl: 'https://github.com/jiwonme/noxion/tree/main/packages/renderer',
  },
  {
    title: 'Ink',
    description: 'Dark-first monochrome theme. IBM Plex font stack, zero shadows, 2px border radius. Designed for technical blogs and developer documentation.',
    preview: '/img/showcase/themes/ink-light.png',
    previewDark: '/img/showcase/themes/ink-dark.png',
    author: 'Noxion',
    tags: ['dark-first', 'technical', 'minimal'],
    command: 'bun create noxion my-site --theme ink',
    repoUrl: 'https://github.com/jiwonme/noxion/tree/main/packages/renderer/src/themes/ink.ts',
  },
  {
    title: 'Editorial',
    description: 'Magazine-inspired theme with Playfair Display headings, Lora body text, warm cream palette, and wide content area for content-heavy blog sites.',
    preview: '/img/showcase/themes/editorial-light.png',
    previewDark: '/img/showcase/themes/editorial-dark.png',
    author: 'Noxion',
    tags: ['magazine', 'creative'],
    command: 'bun create noxion my-site --theme editorial',
    repoUrl: 'https://github.com/jiwonme/noxion/tree/main/packages/renderer/src/themes/editorial.ts',
  },
  {
    title: 'Folio',
    description: 'Portfolio-optimized theme. Zero border radius, Helvetica Neue stack, ultra-wide 1120px content area, and minimal chrome that lets your work speak.',
    preview: '/img/showcase/themes/folio-light.png',
    previewDark: '/img/showcase/themes/folio-dark.png',
    author: 'Noxion',
    tags: ['creative', 'minimal'],
    command: 'bun create noxion my-site --theme folio',
    repoUrl: 'https://github.com/jiwonme/noxion/tree/main/packages/renderer/src/themes/folio.ts',
  },
];

export default themes;
