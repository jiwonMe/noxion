import type { ShowcaseSite } from './types';

const sites: ShowcaseSite[] = [
  {
    title: 'Jiwon\'s Dev Log',
    description: 'A personal engineering blog covering web architecture, React patterns, and open-source tooling.',
    url: 'https://jiwon.me',
    thumbnail: '/img/showcase/sites/jiwon-dev-log.png',
    tags: ['blog', 'personal'],
    author: 'jiwon',
  },
  {
    title: 'Acme Design System',
    description: 'Component documentation for a design system, fully powered by Notion databases and Noxion Docs mode.',
    url: 'https://acme-ds.example.com',
    thumbnail: '/img/showcase/sites/acme-design-system.png',
    tags: ['docs', 'company'],
  },
  {
    title: 'Soyeon Park — Portfolio',
    description: 'A minimal portfolio showcasing product design work, case studies, and side projects.',
    url: 'https://soyeon.example.com',
    thumbnail: '/img/showcase/sites/soyeon-portfolio.png',
    tags: ['portfolio', 'personal'],
    author: 'Soyeon Park',
  },
  {
    title: 'Startup Weekly',
    description: 'A curated newsletter blog about the Korean startup ecosystem with RSS and analytics plugins.',
    url: 'https://startup-weekly.example.com',
    thumbnail: '/img/showcase/sites/startup-weekly.png',
    tags: ['blog', 'company'],
  },
  {
    title: 'React Patterns KR',
    description: 'Korean-language documentation site cataloguing React design patterns with interactive examples.',
    url: 'https://react-patterns-kr.example.com',
    thumbnail: '/img/showcase/sites/react-patterns-kr.png',
    tags: ['docs', 'blog'],
    author: 'minjun',
  },
  {
    title: 'Hyein Lee — Works',
    description: 'Illustration and visual design portfolio with a magazine-style layout theme.',
    url: 'https://hyein.example.com',
    thumbnail: '/img/showcase/sites/hyein-works.png',
    tags: ['portfolio', 'personal'],
    author: 'Hyein Lee',
  },
];

export default sites;
