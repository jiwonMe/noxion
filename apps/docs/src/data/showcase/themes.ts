import type { ShowcaseTheme } from './types';

const themes: ShowcaseTheme[] = [
  {
    title: 'Default',
    description: 'The built-in theme. Clean typography, comfortable spacing, and sensible defaults for blogs and docs.',
    preview: '/img/showcase/themes/default-light.png',
    previewDark: '/img/showcase/themes/default-dark.png',
    author: 'Noxion',
    tags: ['minimal'],
    command: 'bun create noxion my-site',
  },
  {
    title: 'Ink',
    description: 'A dark-first monochrome theme with high contrast typography. Great for technical blogs and developer portfolios.',
    preview: '/img/showcase/themes/ink-light.png',
    previewDark: '/img/showcase/themes/ink-dark.png',
    author: 'Noxion',
    tags: ['dark-first', 'technical', 'minimal'],
    command: 'bun create noxion my-site --template ink',
  },
  {
    title: 'Editorial',
    description: 'A magazine-inspired layout with feature images, pull quotes, and multi-column grids for content-heavy sites.',
    preview: '/img/showcase/themes/editorial-light.png',
    previewDark: '/img/showcase/themes/editorial-dark.png',
    author: 'Noxion',
    tags: ['magazine', 'creative'],
    command: 'bun create noxion my-site --template editorial',
  },
  {
    title: 'Folio',
    description: 'A portfolio-optimized theme with masonry grid, project cards, and case study layouts.',
    preview: '/img/showcase/themes/folio-light.png',
    previewDark: '/img/showcase/themes/folio-dark.png',
    author: 'Noxion',
    tags: ['creative', 'minimal'],
    command: 'bun create noxion my-site --template folio',
  },
];

export default themes;
