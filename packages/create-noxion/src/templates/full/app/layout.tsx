import type { Metadata } from "next";
import { generateNoxionListMetadata, generateWebSiteLD } from "@noxion/adapter-nextjs";
import { BlogLayout, Header, Footer } from "@noxion/theme-default";
import { siteConfig } from "../lib/config";
import { ThemeScript } from "./theme-script";
import "@noxion/theme-default/styles/tailwind";
import "./globals.css";

export function generateMetadata(): Metadata {
  return generateNoxionListMetadata(siteConfig);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = generateWebSiteLD(siteConfig);

  const SiteHeader = () => (
    <Header
      siteName={siteConfig.name}
      navigation={[
        { label: "Home", href: "/" },
        { label: "Docs", href: "/docs" },
        { label: "Portfolio", href: "/portfolio" },
      ]}
    />
  );

  const SiteFooter = () => (
    <Footer siteName={siteConfig.name} author={siteConfig.author} />
  );

  return (
    <html lang={siteConfig.language} suppressHydrationWarning>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <BlogLayout slots={{ header: SiteHeader, footer: SiteFooter }}>
          {children}
        </BlogLayout>
      </body>
    </html>
  );
}
