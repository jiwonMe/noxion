import type { Metadata } from "next";
import type { BlogPost, NoxionConfig } from "@noxion/core";

export function generateNoxionMetadata(
  post: BlogPost,
  config: NoxionConfig
): Metadata {
  const title = `${post.title} | ${config.name}`;
  const description = `${post.title} - ${config.name}`;
  const url = `https://${config.domain}/${post.slug}`;

  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url,
      siteName: config.name,
      ...(post.coverImage ? { images: [{ url: post.coverImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
    alternates: {
      canonical: url,
    },
  };

  return metadata;
}

export function generateNoxionListMetadata(config: NoxionConfig): Metadata {
  return {
    title: config.name,
    description: config.description,
    openGraph: {
      title: config.name,
      description: config.description,
      type: "website",
      url: `https://${config.domain}`,
      siteName: config.name,
    },
    twitter: {
      card: "summary_large_image",
      title: config.name,
      description: config.description,
    },
    alternates: {
      canonical: `https://${config.domain}`,
    },
  };
}
