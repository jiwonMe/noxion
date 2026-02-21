import type { Metadata } from "next";
import type { BlogPost, NoxionConfig } from "@noxion/core";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "…";
}

function buildDescription(post: BlogPost, config: NoxionConfig): string {
  if (post.description) return truncate(post.description, 160);
  return truncate(`${post.title} - ${config.name}`, 160);
}

export function generateNoxionMetadata(
  post: BlogPost,
  config: NoxionConfig
): Metadata {
  const title = `${post.title} | ${config.name}`;
  const description = buildDescription(post, config);
  const url = `https://${config.domain}/${post.slug}`;

  const metadata: Metadata = {
    title,
    description,
    authors: [{ name: post.author ?? config.author }],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      siteName: config.name,
      locale: config.language === "ko" ? "ko_KR" : config.language === "ja" ? "ja_JP" : "en_US",
      publishedTime: post.date ? new Date(post.date).toISOString() : undefined,
      modifiedTime: post.lastEditedTime,
      authors: [post.author ?? config.author],
      section: post.category ?? undefined,
      tags: post.tags.length > 0 ? post.tags : undefined,
      ...(post.coverImage
        ? {
            images: [
              {
                url: post.coverImage,
                width: 1200,
                height: 630,
                alt: post.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.coverImage
        ? {
            images: [
              {
                url: post.coverImage,
                alt: post.title,
              },
            ],
          }
        : {}),
    },
    alternates: {
      canonical: url,
    },
    other: {
      "article:published_time": post.date ? new Date(post.date).toISOString() : "",
      "article:modified_time": post.lastEditedTime,
      "article:author": post.author ?? config.author,
      ...(post.category ? { "article:section": post.category } : {}),
      ...(post.tags.length > 0
        ? Object.fromEntries(post.tags.map((tag, i) => [`article:tag:${i}`, tag]))
        : {}),
    },
  };

  return metadata;
}

export function generateNoxionListMetadata(config: NoxionConfig): Metadata {
  const description = truncate(config.description, 160);
  return {
    title: {
      default: config.name,
      template: `%s | ${config.name}`,
    },
    description,
    authors: [{ name: config.author }],
    metadataBase: new URL(`https://${config.domain}`),
    openGraph: {
      title: config.name,
      description,
      type: "website",
      url: `https://${config.domain}`,
      siteName: config.name,
      locale: config.language === "ko" ? "ko_KR" : config.language === "ja" ? "ja_JP" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: config.name,
      description,
    },
    alternates: {
      canonical: `https://${config.domain}`,
      types: {
        "application/rss+xml": `https://${config.domain}/feed.xml`,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
