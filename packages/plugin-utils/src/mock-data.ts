import type { NoxionPage, BlogPage, DocsPage, PortfolioPage } from "@noxion/core";

let counter = 0;

function nextId(): string {
  return `mock-${++counter}`;
}

export function createMockPage(overrides: Partial<NoxionPage> = {}): NoxionPage {
  const id = nextId();
  return {
    id,
    title: `Mock Page ${id}`,
    slug: `mock-page-${id}`,
    pageType: "blog",
    published: true,
    lastEditedTime: new Date().toISOString(),
    metadata: {},
    ...overrides,
  };
}

export function createMockBlogPage(overrides: Partial<Omit<BlogPage, "metadata">> & { metadata?: Partial<BlogPage["metadata"]> } = {}): BlogPage {
  const id = nextId();
  const { metadata: metaOverrides, ...rest } = overrides;
  return {
    id,
    title: `Mock Blog Post ${id}`,
    slug: `mock-blog-${id}`,
    pageType: "blog" as const,
    published: true,
    lastEditedTime: new Date().toISOString(),
    ...rest,
    metadata: {
      date: "2024-01-15",
      tags: ["test"],
      category: undefined,
      author: undefined,
      ...metaOverrides,
    },
  };
}

export function createMockDocsPage(overrides: Partial<Omit<DocsPage, "metadata">> & { metadata?: Partial<DocsPage["metadata"]> } = {}): DocsPage {
  const id = nextId();
  const { metadata: metaOverrides, ...rest } = overrides;
  return {
    id,
    title: `Mock Docs Page ${id}`,
    slug: `mock-docs-${id}`,
    pageType: "docs" as const,
    published: true,
    lastEditedTime: new Date().toISOString(),
    ...rest,
    metadata: {
      section: undefined,
      version: undefined,
      editUrl: undefined,
      ...metaOverrides,
    },
  };
}

export function createMockPortfolioPage(overrides: Partial<Omit<PortfolioPage, "metadata">> & { metadata?: Partial<PortfolioPage["metadata"]> } = {}): PortfolioPage {
  const id = nextId();
  const { metadata: metaOverrides, ...rest } = overrides;
  return {
    id,
    title: `Mock Portfolio ${id}`,
    slug: `mock-portfolio-${id}`,
    pageType: "portfolio" as const,
    published: true,
    lastEditedTime: new Date().toISOString(),
    ...rest,
    metadata: {
      projectUrl: undefined,
      technologies: undefined,
      year: undefined,
      featured: undefined,
      ...metaOverrides,
    },
  };
}

export function createMockPages(count: number, overrides: Partial<NoxionPage> = {}): NoxionPage[] {
  return Array.from({ length: count }, () => createMockPage(overrides));
}

export function createMockBlogPages(count: number, overrides: Partial<Omit<BlogPage, "metadata">> & { metadata?: Partial<BlogPage["metadata"]> } = {}): BlogPage[] {
  return Array.from({ length: count }, () => createMockBlogPage(overrides));
}

export function resetMockCounter(): void {
  counter = 0;
}
