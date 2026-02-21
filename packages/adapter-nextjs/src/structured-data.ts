import type { BlogPost, NoxionConfig } from "@noxion/core";

export interface JsonLd {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

export function generateBlogPostingLD(
  post: BlogPost,
  config: NoxionConfig
): JsonLd {
  const ld: JsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    dateModified: post.lastEditedTime,
    author: {
      "@type": "Person",
      name: config.author,
    },
    publisher: {
      "@type": "Organization",
      name: config.name,
    },
    url: `https://${config.domain}/${post.slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://${config.domain}/${post.slug}`,
    },
  };

  if (post.coverImage) {
    ld.image = post.coverImage;
  }

  if (post.tags.length > 0) {
    ld.keywords = post.tags.join(", ");
  }

  if (post.category) {
    ld.articleSection = post.category;
  }

  return ld;
}

export function generateWebSiteLD(config: NoxionConfig): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: config.name,
    description: config.description,
    url: `https://${config.domain}`,
    author: {
      "@type": "Person",
      name: config.author,
    },
    inLanguage: config.language,
  };
}
