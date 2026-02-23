import type { NoxionPage, NoxionConfig } from "@noxion/core";

export interface JsonLd {
  "@context": string;
  "@type": string | string[];
  [key: string]: unknown;
}

function getMetaString(page: NoxionPage, key: string): string | undefined {
  const val = page.metadata[key];
  return typeof val === "string" ? val : undefined;
}

function getMetaStringArray(page: NoxionPage, key: string): string[] {
  const val = page.metadata[key];
  return Array.isArray(val) ? val.filter((v): v is string => typeof v === "string") : [];
}

export function generateBlogPostingLD(
  page: NoxionPage,
  config: NoxionConfig
): JsonLd {
  const url = `https://${config.domain}/${page.slug}`;
  const date = getMetaString(page, "date");
  const author = getMetaString(page, "author") ?? config.author;
  const tags = getMetaStringArray(page, "tags");
  const category = getMetaString(page, "category");

  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.title,
    description: page.description ?? page.title,
    datePublished: date ? new Date(date).toISOString() : undefined,
    dateModified: page.lastEditedTime,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: config.name,
      url: `https://${config.domain}`,
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: config.language,
    isAccessibleForFree: true,
  };

  if (page.coverImage) {
    ld.image = {
      "@type": "ImageObject",
      url: page.coverImage,
    };
    ld.thumbnailUrl = page.coverImage;
  }

  if (tags.length > 0) {
    ld.keywords = tags.join(", ");
  }

  if (category) {
    ld.articleSection = category;
  }

  return ld;
}

export function generateTechArticleLD(
  page: NoxionPage,
  config: NoxionConfig
): JsonLd {
  const url = `https://${config.domain}/docs/${page.slug}`;
  const section = getMetaString(page, "section");

  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: page.title,
    description: page.description ?? page.title,
    dateModified: page.lastEditedTime,
    author: {
      "@type": "Organization",
      name: config.name,
    },
    publisher: {
      "@type": "Organization",
      name: config.name,
      url: `https://${config.domain}`,
    },
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    inLanguage: config.language,
    isAccessibleForFree: true,
  };

  if (section) {
    ld.articleSection = section;
  }

  if (page.coverImage) {
    ld.image = {
      "@type": "ImageObject",
      url: page.coverImage,
    };
  }

  return ld;
}

export function generateCreativeWorkLD(
  page: NoxionPage,
  config: NoxionConfig
): JsonLd {
  const url = `https://${config.domain}/projects/${page.slug}`;
  const technologies = getMetaStringArray(page, "technologies");
  const projectUrl = getMetaString(page, "projectUrl");
  const year = page.metadata.year;

  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: page.title,
    description: page.description ?? page.title,
    url,
    author: {
      "@type": "Person",
      name: config.author,
    },
    inLanguage: config.language,
  };

  if (projectUrl) {
    ld.mainEntityOfPage = projectUrl;
  }

  if (page.coverImage) {
    ld.image = {
      "@type": "ImageObject",
      url: page.coverImage,
    };
  }

  if (technologies.length > 0) {
    ld.keywords = technologies.join(", ");
  }

  if (typeof year === "number" || typeof year === "string") {
    ld.dateCreated = String(year);
  }

  return ld;
}

export function generatePageLD(
  page: NoxionPage,
  config: NoxionConfig
): JsonLd {
  switch (page.pageType) {
    case "blog":
      return generateBlogPostingLD(page, config);
    case "docs":
      return generateTechArticleLD(page, config);
    case "portfolio":
      return generateCreativeWorkLD(page, config);
    default:
      return generateBlogPostingLD(page, config);
  }
}

export function generateBreadcrumbLD(
  page: NoxionPage,
  config: NoxionConfig
): JsonLd {
  const baseUrl = `https://${config.domain}`;
  const category = getMetaString(page, "category");

  const items: unknown[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: config.name,
      item: baseUrl,
    },
  ];

  if (category) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: category,
      item: `${baseUrl}/tag/${encodeURIComponent(category)}`,
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: page.title,
      item: `${baseUrl}/${page.slug}`,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: page.title,
      item: `${baseUrl}/${page.slug}`,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

export function generateWebSiteLD(config: NoxionConfig): JsonLd {
  const baseUrl = `https://${config.domain}`;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    description: config.description,
    url: baseUrl,
    author: {
      "@type": "Person",
      name: config.author,
    },
    inLanguage: config.language,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateCollectionPageLD(
  pages: NoxionPage[],
  config: NoxionConfig
): JsonLd {
  const baseUrl = `https://${config.domain}`;

  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: config.name,
    description: config.description,
    url: baseUrl,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: pages.length,
      itemListElement: pages.slice(0, 30).map((page, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/${page.slug}`,
        name: page.title,
      })),
    },
    inLanguage: config.language,
  };
}
