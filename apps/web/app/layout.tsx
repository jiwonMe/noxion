import type { Metadata, Viewport } from "next";
import { generateNoxionListMetadata, generateWebSiteLD } from "@noxion/adapter-nextjs";
import { siteConfig } from "../lib/config";
import { ThemeScript } from "./theme-script";
import { SiteLayout } from "./site-layout";
import "@noxion/theme-default/styles/tailwind";
import "./globals.css";

export function generateMetadata(): Metadata {
  return generateNoxionListMetadata(siteConfig);
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = generateWebSiteLD(siteConfig);

  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <link rel="dns-prefetch" href="https://www.notion.so" />
        <link rel="dns-prefetch" href="https://file.notion.so" />
        <link rel="preconnect" href="https://www.notion.so" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://file.notion.so" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title={siteConfig.name} href="/feed.xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteLayout siteName={siteConfig.name} author={siteConfig.author}>
          {children}
        </SiteLayout>
      </body>
    </html>
  );
}
