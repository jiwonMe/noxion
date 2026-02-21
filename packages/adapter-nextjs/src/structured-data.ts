import type { BlogPost, NoxionConfig } from "@noxion/core";

export interface JsonLd {
  "@context": string;
  "@type": string | string[];
  [key: string]: unknown;
}

export function generateBlogPostingLD(
  post: BlogPost,
  config: NoxionConfig
): JsonLd {
  const url = `https://${config.domain}/${post.slug}`;

  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description ?? post.title,
    datePublished: post.date ? new Date(post.date).toISOString() : undefined,
    dateModified: post.lastEditedTime,
    author: {
      "@type": "Person",
      name: post.author ?? config.author,
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

  if (post.coverImage) {
    ld.image = {
      "@type": "ImageObject",
      url: post.coverImage,
    };
    ld.thumbnailUrl = post.coverImage;
  }

  if (post.tags.length > 0) {
    ld.keywords = post.tags.join(", ");
  }

  if (post.category) {
    ld.articleSection = post.category;
  }

  return ld;
}

export function generateBreadcrumbLD(
  post: BlogPost,
  config: NoxionConfig
): JsonLd {
  const baseUrl = `https://${config.domain}`;

  const items: unknown[] = [
    {
      "@type": "ListItem",
      position: 1,
      name: config.name,
      item: baseUrl,
    },
  ];

  if (post.category) {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: post.category,
      item: `${baseUrl}/tag/${encodeURIComponent(post.category)}`,
    });
    items.push({
      "@type": "ListItem",
      position: 3,
      name: post.title,
      item: `${baseUrl}/${post.slug}`,
    });
  } else {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: post.title,
      item: `${baseUrl}/${post.slug}`,
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
  posts: BlogPost[],
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
      numberOfItems: posts.length,
      itemListElement: posts.slice(0, 30).map((post, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${baseUrl}/${post.slug}`,
        name: post.title,
      })),
    },
    inLanguage: config.language,
  };
}
