import type { Metadata } from "next";
import type { NoxionPage, NoxionConfig } from "@noxion/core";

function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 1).trimEnd() + "…";
}

function buildDescription(page: NoxionPage, config: NoxionConfig): string {
  if (page.description) return truncate(page.description, 160);
  return truncate(`${page.title} - ${config.name}`, 160);
}

function getMetaString(page: NoxionPage, key: string): string | undefined {
  const val = page.metadata[key];
  return typeof val === "string" ? val : undefined;
}

function getMetaStringArray(page: NoxionPage, key: string): string[] {
  const val = page.metadata[key];
  return Array.isArray(val) ? val.filter((v): v is string => typeof v === "string") : [];
}

export function generateNoxionMetadata(
  page: NoxionPage,
  config: NoxionConfig
): Metadata {
  const title = `${page.title} | ${config.name}`;
  const description = buildDescription(page, config);
  const url = `https://${config.domain}/${page.slug}`;

  const date = getMetaString(page, "date");
  const author = getMetaString(page, "author") ?? config.author;
  const category = getMetaString(page, "category");
  const tags = getMetaStringArray(page, "tags");

  const isBlog = page.pageType === "blog";

  const metadata: Metadata = {
    title,
    description,
    authors: [{ name: author }],
    openGraph: {
      title: page.title,
      description,
      type: isBlog ? "article" : "website",
      url,
      siteName: config.name,
      locale: config.language === "ko" ? "ko_KR" : config.language === "ja" ? "ja_JP" : "en_US",
      ...(isBlog && date ? { publishedTime: new Date(date).toISOString() } : {}),
      ...(isBlog ? { modifiedTime: page.lastEditedTime } : {}),
      ...(isBlog ? { authors: [author] } : {}),
      ...(category ? { section: category } : {}),
      ...(tags.length > 0 ? { tags } : {}),
      ...(page.coverImage
        ? {
            images: [
              {
                url: page.coverImage,
                width: 1200,
                height: 630,
                alt: page.title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description,
      ...(page.coverImage
        ? {
            images: [
              {
                url: page.coverImage,
                alt: page.title,
              },
            ],
          }
        : {}),
    },
    alternates: {
      canonical: url,
    },
    other: {
      ...(isBlog && date ? { "article:published_time": new Date(date).toISOString() } : {}),
      ...(isBlog ? { "article:modified_time": page.lastEditedTime } : {}),
      ...(isBlog ? { "article:author": author } : {}),
      ...(category ? { "article:section": category } : {}),
      ...(tags.length > 0
        ? Object.fromEntries(tags.map((tag: string, i: number) => [`article:tag:${i}`, tag]))
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
