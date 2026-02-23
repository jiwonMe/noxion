export type SiteTag = 'blog' | 'docs' | 'portfolio' | 'personal' | 'company';

export type ShowcaseSite = {
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  tags: SiteTag[];
  author?: string;
  source?: string;
};

export type ShowcaseFeature = {
  title: string;
  description: string;
  image: string;
  docsUrl: string;
  badge?: string;
};

export type ThemeTag = 'minimal' | 'magazine' | 'technical' | 'creative' | 'dark-first';

export type ShowcaseTheme = {
  title: string;
  description: string;
  preview: string;
  previewDark?: string;
  author: string;
  npmUrl?: string;
  repoUrl?: string;
  tags: ThemeTag[];
  command: string;
};
